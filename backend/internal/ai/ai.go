package ai

import (
	"app/internal/dto"
	"context"
	"fmt"
	"os"

	"github.com/cloudwego/eino-ext/components/model/openai"
	"go.uber.org/dig"
)

func initModel(modelName string) (*dto.AiModel, error) {
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
		return nil, fmt.Errorf("failed to initialize chat model %s: %w", modelName, err)
	}

	if chatModel == nil {
		return nil, fmt.Errorf("chat model %s is nil", modelName)
	}

	tpl := DslDesignTpl()
	return &dto.AiModel{
		ChatModel: *chatModel,
		ChatTpl:   tpl,
	}, nil
}

func getModelByName() (*dto.AiHandler, error) {
	models := make(map[string]dto.AiModel)

	AIModels := []string{
		"deepseek-r1",
		"deepseek-v3",
		"deepseek-r1-0528",
		"Moonshot-Kimi-K2-Instruct",
		"qwen3-max",
	}

	for _, name := range AIModels {
		model, err := initModel(name)
		if err != nil {
			fmt.Printf("Failed to initialize model %s: %v\n", name, err)
			continue // 跳过失败的模型，继续初始化其他模型
		}
		if model != nil {
			models[name] = *model
		}
	}

	if len(models) == 0 {
		return nil, fmt.Errorf("no AI models were successfully initialized")
	}

	return &dto.AiHandler{Models: models}, nil
}

func Provide(contanier *dig.Container) {
	contanier.Provide(getModelByName)
}
