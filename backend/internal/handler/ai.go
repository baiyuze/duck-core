package handler

import (
	errs "app/internal/common/error"
	log "app/internal/common/log"
	"app/internal/dto"
	"app/internal/grpc/container"
	"app/internal/service"
	"net/http"

	"github.com/cloudwego/eino/schema"
	"github.com/gin-gonic/gin"
	"go.uber.org/dig"
)

type AiHandler struct {
	service   service.AiService
	clients   *container.Clients
	log       *log.LoggerWithContext
	aiHandler *dto.AiHandler
}

func NewAiHandler(
	service service.AiService,
	clients *container.Clients,
	log *log.LoggerWithContext,
	aiHandler *dto.AiHandler,

) *AiHandler {
	return &AiHandler{
		service:   service,
		clients:   clients,
		log:       log,
		aiHandler: aiHandler,
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

// Login 登录接口
// @Summary 登录接口
// @Tags 用户模块
// @Accept  json
// @Param   data  body dto.LoginBody  true  "用户信息"
// @Success 200  {object} dto.Response[any]
// @Router /api/users/login [post]
func (h *AiHandler) Chat(c *gin.Context) {

	// 设置 SSE 响应头
	c.Header("Content-Type", "text/event-stream")
	c.Header("Cache-Control", "no-cache")
	c.Header("Connection", "keep-alive")
	c.Header("Transfer-Encoding", "chunked")
	c.Header("Access-Control-Allow-Origin", "*")
	logger := h.log.WithContext(c)

	var body dto.ChatBody
	if err := c.ShouldBindJSON(&body); err != nil {
		errs.FailWithJSON(c, err)
		logger.Error(err.Error())
		return
	}
	modelName := body.Model
	if len(modelName) == 0 {
		modelName = "deepseek-r1"
	}
	aiModel := (h.aiHandler.Models)[modelName]
	chatModel := aiModel.ChatModel
	template := aiModel.ChatTpl
	ctx := *aiModel.Ctx

	messages, err := template.Format(ctx, map[string]any{
		"role":         "专业资深网页UI设计师和资深前端开发专家",
		"chat_history": []*schema.Message{},
	})
	if err != nil {
		logger.Error(err.Error() + "test")
		errs.FailWithJSON(c, err)
		return
	}
	for _, v := range *body.Messages {
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
	h.service.ReportStream(c, streamResult)
}
