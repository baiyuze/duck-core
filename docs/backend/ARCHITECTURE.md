# 后端架构

<cite>
  **本文档中引用的文件**
  * [main.go](file:///home/guangguang/project/duck-core/backend/main.go)
  * [internal/di/container.go](file:///home/guangguang/project/duck-core/backend/internal/di/container.go)
  * [internal/router/router.go](file:///home/guangguang/project/duck-core/backend/internal/router/router.go)
  * [internal/grpc/server.go](file:///home/guangguang/project/duck-core/backend/internal/grpc/server.go)
  * [internal/handler/container.go](file:///home/guangguang/project/duck-core/backend/internal/handler/container.go)
  * [internal/service/container.go](file:///home/guangguang/project/duck-core/backend/internal/service/container.go)
  * [internal/repo/db.go](file:///home/guangguang/project/duck-core/backend/internal/repo/db.go)
</cite>

## 目录
1. [简介](#简介)
2. [系统启动流程](#系统启动流程)
3. [架构分层与依赖注入](#架构分层与依赖注入)
    1. [分层设计](#分层设计)
    2. [依赖注入 (DI)](#依赖注入-di)
4. [路由与中间件](#路由与中间件)
    1. [路由注册](#路由注册)
    2. [核心中间件](#核心中间件)
5. [gRPC 服务](#grpc-服务)
6. [总结](#总结)

## 简介

本文档旨在深入解析 `duck-core` 后端系统的架构设计、核心流程和技术选型。后端采用 Go 语言开发，基于 [Gin](https://github.com/gin-gonic/gin) Web 框架和 [Dig](https://github.com/uber-go/dig) 依赖注入容器构建，具备清晰的分层结构和良好的可扩展性。

系统同时提供了 RESTful API 和 gRPC 两种接口形式，以适应不同的业务场景。

## 系统启动流程

系统的主入口位于 `main.go`，其启动流程清晰、有序，是理解整个应用生命周期的关键。

```mermaid
flowchart TD
    A[开始] --> B{加载环境变量};
    B --> C[初始化 Zap 日志];
    C --> D{设置 Gin 模式};
    D --> E[创建 DI 容器];
    E --> F[注册所有依赖];
    F --> G[启动 gRPC 服务 (goroutine)];
    G --> H[注册 HTTP 路由];
    H --> I[启动 Gin HTTP 服务器];
    I --> J[结束];

    subgraph "main.go"
        direction LR
        A
        B
        C
        D
        E
        F
        G
        H
        I
        J
    end
```

**流程说明:**
1.  **加载环境**: 从环境变量 `ENV` 中读取当前环境（如 `production` 或 `development`），并据此设置 Gin 的运行模式。
2.  **初始化日志**: 使用 `log.InitLogger()` 初始化全局的 `zap.Logger`，用于结构化日志记录。
3.  **创建 DI 容器**: 调用 `di.NewContainer()` 创建一个 `dig` 容器实例。这是整个应用实现控制反转 (IoC) 的核心。
4.  **注册依赖**: 在 `di.NewContainer()` 内部，应用的所有组件（如配置、数据库连接、Services、Handlers）都被注册到容器中。
5.  **启动 gRPC 服务**: 在一个独立的 goroutine 中调用 `server.IntServer(container)`，启动 gRPC 服务并监听 `50051` 端口。这使得 HTTP 和 gRPC 服务可以同时运行。
6.  **注册 HTTP 路由**: 调用 `router.RegisterRoutes(r, container)`，将所有 API 路由和中间件注册到 Gin 引擎。
7.  **启动 HTTP 服务**: 调用 `r.Run(":8888")`，阻塞并启动 HTTP 服务器，开始接收外部请求。

*章节来源: [main.go](file:///home/guangguang/project/duck-core/backend/main.go#L16-L55)*

## 架构分层与依赖注入

系统采用了经典的多层架构模式，并通过依赖注入（DI）来解耦各层之间的关系。

### 分层设计

```mermaid
graph TD
    subgraph "外部请求"
        direction LR
        U[用户/客户端]
    end

    subgraph "应用层"
        direction TB
        M[Middleware] --> R[Router]
        R --> H[Handler (Controller)]
        H --> S[Service]
        S --> D[Repository (Data Access)]
        D --> DB[(Database)]
    end

    U --> M

    style H fill:#cce5ff,stroke:#333,stroke-width:2px
    style S fill:#d4edda,stroke:#333,stroke-width:2px
    style D fill:#f8d7da,stroke:#333,stroke-width:2px
```

-   **Router (路由层)**: 负责解析 HTTP 请求，并将请求分发到对应的 Handler。定义了 API 的入口。
-   **Middleware (中间件层)**: 在请求到达 Handler 前后执行通用逻辑，如日志记录、身份认证、Panic 恢复等。
-   **Handler (处理层/控制器层)**: 接收并验证请求参数，调用 Service 层处理业务逻辑，并构造最终的 HTTP 响应。
-   **Service (服务层)**: 封装核心业务逻辑，是业务功能的主要实现者。它可能会调用一个或多个 Repository 来完成任务。
-   **Repository (仓储层)**: 负责数据持久化操作，隔离业务逻辑与数据源（如 MySQL 数据库）。

### 依赖注入 (DI)

项目利用 `go.uber.org/dig` 库实现依赖注入，极大地简化了对象生命周期管理和依赖关系。

**核心入口**: `internal/di/container.go`

```go
// internal/di/container.go
func NewContainer() *dig.Container {
	container := dig.New()
	// 公共日志管理器
	log.NewProvideLogger(container)
	// 获取客户端grpc
	grpcContainer.NewProvideClients(container)
	// 配置
	config.ProvideConfig(container)
	// 数据库
	repo.ProvideDB(container)
	// 服务
	service.Provide(container)
	// controller
	handler.Provide(container)

	return container
}
```

**注入流程**:
1.  `NewContainer` 创建一个空的 `dig` 容器。
2.  依次调用各模块的 `Provide` 函数（例如 `repo.ProvideDB`, `service.Provide`, `handler.Provide`）。
3.  在每个 `Provide` 函数内部，具体的构造函数被注册到容器中。例如，`service.ProvideUserService` 会告诉容器如何创建一个 `UserService` 实例，并声明它依赖于 `UserRepository`。
4.  当应用需要某个组件时（例如，在路由注册时需要一个 `UserHandler`），`dig` 容器会自动分析依赖关系，按需创建并注入所有必需的依赖项。

这种设计使得各组件只需声明其依赖，而无需关心依赖的具体创建过程，实现了控制反转。

*图表来源: [internal/di/container.go](file:///home/guangguang/project/duck-core/backend/internal/di/container.go#L15-L37)*

## 路由与中间件

### 路由注册

所有 HTTP 路由的注册都集中在 `internal/router` 包下，主入口为 `router.go`。

```go
// internal/router/router.go
func RegisterRoutes(r *gin.Engine, container *dig.Container) {
	route := r.Group("api")
	// ... Swagger and NoRoute handlers
	RegisterUserRoutes(route, container)
	RegisterRpcRoutes(route, container)
	// ... more route registrations
}
```

`RegisterRoutes` 函数首先创建一个 `/api` 路由组，然后调用各个模块的路由注册函数（如 `RegisterUserRoutes`），将具体的业务路由挂载到这个组下。这种模块化的方式使得路由结构清晰，易于管理。

### 核心中间件

在 `main.go` 中，一系列全局中间件被注册，它们对所有请求生效：

1.  `middleware.RecoveryWithZap(logger)`: 捕获 `panic`，记录错误日志并返回 500 响应，防止程序崩溃。
2.  `middleware.Trace`: 为每个请求生成一个唯一的 `TraceID`，并将其置于 `Context` 中，便于全链路日志追踪。
3.  `middleLog.Logger`: 记录每个请求的详细信息，包括 `TraceID`、耗时、状态码等。
4.  `middleware.AuthWhiteList`: 白名单验证，用于跳过某些特定路由的认证。

## gRPC 服务

除了 HTTP 服务，系统还通过 `internal/grpc/server.go` 启动了一个 gRPC 服务。

```go
// internal/grpc/server.go
func IntServer(container *dig.Container) {
	lis, err := net.Listen("tcp", ":50051")
	// ... error handling
	s := grpc.NewServer()
	// 注册健康检查服务
	healthServer := health.NewServer()
	grpc_health_v1.RegisterHealthServer(s, healthServer)
	// 初始化 gRPC 服务的 DI 容器
	ctr.InitContanier(s, container)
	// ...
	if err := s.Serve(lis); err != nil {
		log.Fatalf("failed to serve: %v", err)
	}
}
```

gRPC 服务的启动与 HTTP 服务并行，它同样利用了 DI 容器来获取其 Handler 所需的依赖。这使得 gRPC 服务可以复用大部分的业务逻辑（Service 层），实现了代码的高效利用。

## 总结

`duck-core` 后端系统是一个设计精良、结构清晰的现代化 Go 应用。其关键特性包括：

*   **分层架构**: 通过 Router, Handler, Service, Repository 的明确分层，实现了业务逻辑和基础设施的有效隔离。
*   **依赖注入**: 广泛使用 `dig` 容器管理依赖，降低了模块间的耦合度，提升了代码的可测试性和可维护性。
*   **双协议支持**: 同时提供 Gin (HTTP) 和 gRPC 服务，兼顾了对外的易用性和内部服务间的高效通信。
*   **可观测性**: 内置了基于 `zap` 的结构化日志和全链路追踪（TraceID），为问题排查和性能监控提供了有力支持。

该架构为后续的功能扩展和维护奠定了坚实的基础。
