package dto

import (
	"github.com/cloudwego/eino-ext/components/model/openai"
	"github.com/cloudwego/eino/components/prompt"
)

type AiModel struct {
	ChatModel openai.ChatModel
	ChatTpl   *prompt.DefaultChatTemplate
}

type Message struct {
	Content string `json:"content,omitempty"`
	Role    string `json:"role,omitempty"`
}

type ChatBody struct {
	Message  Message
	Messages *[]Message
	Model    string `json:"model,omitempty"`
	Stream   bool   `json:"streaml,omitempty"`
}

type AiHandler struct {
	Models map[string]AiModel
}
