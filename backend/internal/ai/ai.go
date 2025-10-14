package ai

import (
	"app/internal/dto"
	"context"
	"fmt"
	"os"

	"github.com/cloudwego/eino-ext/components/model/openai"
	"go.uber.org/dig"
)

func Provide(contanier *dig.Container) {
	// ctx := context.
	ctx := context.Background()
	contanier.Provide(func() *dto.AiModel {
		chatModel, err := openai.NewChatModel(ctx, &openai.ChatModelConfig{
			BaseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
			Model:   "deepseek-r1",               // 使用的模型版本
			APIKey:  os.Getenv("OPENAI_API_KEY"), // OpenAI API 密钥
		})

		if err != nil {
			fmt.Printf("chatInit==%+v===", err)
		}
		tpl := DslDesignTpl()
		return &dto.AiModel{
			ChatModel: *chatModel,
			ChatTpl:   tpl,
			Ctx:       &ctx,
		}
	})
}
