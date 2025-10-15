package ai

import (
	"app/internal/dto"
	"context"
	"fmt"
	"os"

	"github.com/cloudwego/eino-ext/components/model/openai"
	"go.uber.org/dig"
)

func initModel(modelName string) *dto.AiModel {
	ctx := context.Background()
	if len(modelName) == 0 {
		modelName = "deepseek-r1"
	}
	chatModel, err := openai.NewChatModel(ctx, &openai.ChatModelConfig{
		BaseURL: "https://dashscope.aliyuncs.com/compatible-mode/v1",
		Model:   modelName,                   // 使用的模型版本
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
}

func getModelByName() *dto.AiHandler {
	models := make(map[string]dto.AiModel)

	AIModels := []string{
		"deepseek-r1",
		"deepseek-v3",
		"gpt-4",
		"gpt-3.5-turbo",
		"qwen3-max",
	}

	for _, name := range AIModels {
		models[name] = *initModel(name) // 这里假设 initModel 返回 dto.AiModel
	}

	return &dto.AiHandler{Models: models}
}

func Provide(contanier *dig.Container) {
	contanier.Provide(getModelByName)
}
