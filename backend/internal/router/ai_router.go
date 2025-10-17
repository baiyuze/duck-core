package router

import (
	"app/internal/handler"
	"app/internal/middleware"
	"fmt"

	"github.com/gin-gonic/gin"
	"go.uber.org/dig"
)

// RegisterUserRoutes 注册所有路由
func RegisterAiRoutes(r *gin.RouterGroup, container *dig.Container) {

	router := r.Group("ai")

	err := container.Invoke(func(aiHandler *handler.AiHandler) {
		// AI 聊天接口 - POST /api/ai/chat
		router.POST("/chat", middleware.Jwt(true), aiHandler.Chat)
		// 旧接口保留（兼容）
		router.GET("/post", middleware.Jwt(false), aiHandler.Chat)
	})
	if err != nil {
		fmt.Printf("注入 handler 失败: %v\n", err)
	}

}
