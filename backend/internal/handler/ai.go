package handler

import (
	errs "app/internal/common/error"
	log "app/internal/common/log"
	"app/internal/dto"
	"app/internal/grpc/container"
	"app/internal/service"
	"app/utils"
	"encoding/json"
	"fmt"
	"io"
	baseLog "log"
	"net/http"
	"strconv"

	"github.com/cloudwego/eino/schema"
	"github.com/gin-gonic/gin"
	"go.uber.org/dig"
)

type AiHandler struct {
	service service.UserService
	clients *container.Clients
	log     *log.LoggerWithContext
	aiModel *dto.AiModel
}

func NewAiHandler(
	service service.UserService,
	clients *container.Clients,
	log *log.LoggerWithContext,
	aiModel *dto.AiModel,

) *AiHandler {
	return &AiHandler{
		service: service,
		clients: clients,
		log:     log,
		aiModel: aiModel,
	}
}

func ProviderAiHandler(container *dig.Container) {
	err := container.Provide(NewAiHandler)
	if err != nil {
		return
	}
}

// HomeHandler 处理首页请求
func (h *AiHandler) HomeHandler(c *gin.Context) {
	c.JSON(http.StatusOK, "首页")
}
func reportStream(c *gin.Context, sr *schema.StreamReader[*schema.Message]) {
	defer sr.Close()

	// 设置 SSE 响应头
	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("Transfer-Encoding", "chunked")
	c.Header("Access-Control-Allow-Origin", "*")

	// 获取 ResponseWriter 的 Flusher
	flusher, ok := c.Writer.(http.Flusher)
	if !ok {
		baseLog.Println("Streaming unsupported!")
		c.JSON(http.StatusInternalServerError, dto.Fail(http.StatusInternalServerError, "Streaming unsupported"))
		return
	}

	i := 0
	for {
		message, err := sr.Recv()
		if err == io.EOF { // 流式输出结束
			// 发送结束标记
			fmt.Fprintf(c.Writer, "data: [DONE]\n\n")
			flusher.Flush()
			return
		}
		if err != nil {
			baseLog.Printf("recv failed: %v", err)
			// 发送错误信息
			errorData, _ := json.Marshal(map[string]string{"error": err.Error()})
			fmt.Fprintf(c.Writer, "data: %s\n\n", errorData)
			flusher.Flush()
			return
		}

		// 构建符合 OpenAI/DeepSeek 格式的响应
		var content string
		var reasoningContent string

		if message.Content != "" {
			content = message.Content
		}
		if message.ReasoningContent != "" {
			reasoningContent = message.ReasoningContent
		}

		// 构建响应对象
		response := map[string]interface{}{
			"choices": []map[string]interface{}{
				{
					"delta": map[string]interface{}{
						"content":           content,
						"reasoning_content": reasoningContent,
					},
					"index":         0,
					"finish_reason": nil,
				},
			},
			"created": i,
			"model":   "ai-assistant",
		}

		// 将消息序列化为 JSON
		messageData, err := json.Marshal(response)
		if err != nil {
			baseLog.Printf("marshal failed: %v", err)
			continue
		}

		// 以 SSE 格式发送数据
		fmt.Fprintf(c.Writer, "data: %s\n\n", messageData)
		flusher.Flush()

		i++
	}
}

// Login 登录接口
// @Summary 登录接口
// @Tags 用户模块
// @Accept  json
// @Param   data  body dto.LoginBody  true  "用户信息"
// @Success 200  {object} dto.Response[any]
// @Router /api/users/login [post]
func (h *AiHandler) Chat(c *gin.Context) {

	logger := h.log.WithContext(c)
	chatModel := h.aiModel.ChatModel
	template := h.aiModel.ChatTpl
	ctx := *h.aiModel.Ctx

	var body dto.ChatBody
	if err := c.ShouldBindJSON(&body); err != nil {
		errs.FailWithJSON(c, err)
		logger.Error(err.Error())
		return
	}
	messages, err := template.Format(ctx, map[string]any{
		"role": "专业资深网页UI设计师",
		// 对话历史（这个例子里模拟两轮对话历史）
		"chat_history": []*schema.Message{},
	})
	if err != nil {
		logger.Error(err.Error() + "test")
		errs.FailWithJSON(c, err)
		return
	}
	for _, v := range *body.Messages {
		fmt.Println(v.Content, v.Role, "=====>")
		if v.Role == "user" {
			messages = append(messages, schema.UserMessage(v.Content))
		}
		if v.Role == "assistant" {
			messages = append(messages, schema.AssistantMessage(v.Content, nil))
		}
	}
	streamResult, err := chatModel.Stream(ctx, messages)
	if err != nil {
		logger.Error(err.Error())
		errs.FailWithJSON(c, err)
		return
	}
	reportStream(c, streamResult)
}

// Register 注册
// @Summary 注册
// @Tags 用户模块
// @Accept  json
// @Param   data  body dto.RegBody  true  "注册用户"
// @Success 200  {object} dto.Response[any]
// @Router /api/users/register [post]
func (h *AiHandler) Register(c *gin.Context) {
	logger := h.log.WithContext(c)

	var body dto.RegBody
	if err := c.ShouldBindJSON(&body); err != nil {
		errs.FailWithJSON(c, err)
		logger.Error(err.Error())
		return
	}

	account := body.Account
	if account != nil || body.Password != nil {
		if err := h.service.Register(c, body); err != nil {
			errs.FailWithJSON(c, err)
			return
		}
		c.JSON(http.StatusOK, dto.Ok[any](nil))
		return
	} else {
		errs.FailWithJSON(c, errs.New("账号或密码不存在"))
		return
	}

}

// List 用户列表
// @Summary 用户列表
// @Tags 用户模块
// @Accept  json
// @Param pageNum query int false "页码"
// @Param pageSize query int false "每页数量"
// @Success 200  {object} dto.Response[dto.List[dto.UserWithRole]]
// @Router /api/users [get]
func (h *AiHandler) List(c *gin.Context) {
	pageNum := c.Query("pageNum")
	pageSize := c.Query("pageSize")

	result, err := h.service.List(c, utils.HandleQuery(pageNum, pageSize))
	if err != nil {
		errs.FailWithJSON(c, err)
	} else {
		c.JSON(http.StatusOK, dto.Ok(result.Data))
	}
}

// UpdateRole 修改角色，设置角色
// @Summary 设置角色
// @Description 修改角色，设置角色
// @Tags 用户模块
// @Accept  json
// @Param   id   path     int  true  "用户ID"
// @Success 200  {object} dto.User
// @Router /api/users/{id} [put]
func (h *AiHandler) UpdateRole(c *gin.Context) {
	var userId int
	id := c.Param("id")
	var user dto.User
	if len(id) == 0 {
		errs.FailWithJSON(c, errs.New("id不能为空"))
		return
	}

	if currentId, err := strconv.Atoi(id); err != nil {
		errs.FailWithJSON(c, err)
		return
	} else {
		userId = currentId
	}

	if err := c.ShouldBindJSON(&user); err != nil {
		errs.FailWithJSON(c, err)
		return
	}

	if err := h.service.UpdateRoles(c, userId, &user); err != nil {
		errs.FailWithJSON(c, err)
		return
	}
	c.JSON(http.StatusOK, dto.Ok[any](nil))
}

// Delete 删除用户
// @Summary 删除用户
// @Description 删除用户
// @Tags 用户模块
// @Accept  json
// @Param   id   path     int  true  "用户ID"
// @Success 200  {object} dto.DeleteIds
// @Router /api/users [delete]
func (h *AiHandler) Delete(c *gin.Context) {
	//logger := h.log.WithContext(c)
	var body dto.DeleteIds

	if err := c.ShouldBindJSON(&body); err != nil {
		errs.FailWithJSON(c, err)
		return
	}
	if err := h.service.Delete(c, body); err != nil {

		errs.FailWithJSON(c, err)
		return
	}
	c.JSON(http.StatusOK, dto.Ok[any](nil))
}

// TestAuth 用来验证是否token
func (h *AiHandler) TestAuth(c *gin.Context) {
	c.JSON(http.StatusOK, dto.Ok("成功"))
}
