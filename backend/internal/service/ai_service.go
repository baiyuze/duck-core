package service

import (
	"app/internal/common/log"
	"app/internal/dto"
	"app/internal/model"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"

	"github.com/cloudwego/eino/schema"
	"github.com/gin-gonic/gin"
	"go.uber.org/dig"
	"gorm.io/gorm"
)

type AiService interface {
	GetUserOne() (*model.User, error)
	ReportStream(c *gin.Context, ctx context.Context, sr *schema.StreamReader[*schema.Message])
}

type aiService struct {
	db  *gorm.DB
	log *log.LoggerWithContext
}

func NewAiService(
	db *gorm.DB,
	log *log.LoggerWithContext) AiService {

	return &aiService{db: db, log: log}
}

func ProvideAiService(container *dig.Container) {
	if err := container.Provide(NewAiService); err != nil {
		panic(err)
	}
}

func (s *aiService) ReportStream(c *gin.Context, ctx context.Context, sr *schema.StreamReader[*schema.Message]) {
	defer sr.Close()
	logger := s.log.WithContext(c)

	// 获取 ResponseWriter 的 Flusher
	flusher, ok := c.Writer.(http.Flusher)
	if !ok {
		logger.Error("Streaming unsupported!")
		c.JSON(http.StatusInternalServerError, dto.Fail(http.StatusInternalServerError, "Streaming unsupported"))
		return
	}
	i := 0
	for {

		select {
		case <-ctx.Done():
			// 监听到 Context 被取消（客户端断开连接）
			logger.Info("============[SSE] client disconnected, closing stream via context...")
			return // 立即退出循环，defer sr.Close() 会被执行

		default:
			message, err := sr.Recv()

			if err == io.EOF { // 流式输出结束
				// 发送结束标记
				fmt.Fprintf(c.Writer, "data: [DONE]\n\n")
				flusher.Flush()
				return
			}
			if err != nil {
				logger.Error(err.Error())
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
				logger.Error("marshal failed: " + err.Error())
				continue
			}

			// 以 SSE 格式发送数据
			fmt.Fprintf(c.Writer, "data: %s\n\n", messageData)
			flusher.Flush()

			i++
		}
	}
}

func (s *aiService) GetUserOne() (*model.User, error) {
	var user model.User
	if err := s.db.First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}
