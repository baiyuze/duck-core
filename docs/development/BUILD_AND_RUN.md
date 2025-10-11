# 构建、运行与部署指南

<cite>
  **本文档中引用的文件**
  * [docker-compose.yml](file:///home/guangguang/project/duck-core/docker-compose.yml)
  * [frontend/package.json](file:///home/guangguang/project/duck-core/frontend/package.json)
  * [backend/go.mod](file:///home/guangguang/project/duck-core/backend/go.mod)
  * [backend/build_proto.sh](file:///home/guangguang/project/duck-core/backend/build_proto.sh)
</cite>

## 目录
1. [简介](#简介)
2. [环境准备](#环境准备)
3. [本地开发](#本地开发)
    1. [后端 (Go)](#后端-go)
    2. [前端 (React + Vite)](#前端-react--vite)
4. [构建](#构建)
    1. [生成 gRPC 代码](#生成-grpc-代码)
    2. [构建前端静态资源](#构建前端静态资源)
    3. [构建后端可执行文件](#构建后端可执行文件)
5. [容器化部署 (Docker)](#容器化部署-docker)
    1. [Docker Compose](#docker-compose)
    2. [服务解析](#服务解析)
6. [总结](#总结)

## 简介

本文档提供了 `duck-core` 项目的完整构建、本地开发和部署说明。无论您是想在本地运行开发环境，还是将其部署到生产服务器，本文都将提供必要的步骤。

## 环境准备

在开始之前，请确保您的开发环境中安装了以下工具：
*   **Go**: 版本 `1.23` 或更高 (参考 `backend/go.mod`)
*   **Node.js**: 版本 `18.x` 或更高
*   **pnpm**: 用于管理前端依赖
*   **Docker** 和 **Docker Compose**: 用于容器化部署
*   **protoc**: Protocol Buffers 编译器，用于生成 gRPC 代码

## 本地开发

### 后端 (Go)

1.  **进入后端目录**:
    ```bash
    cd backend
    ```

2.  **安装依赖**:
    ```bash
    go mod tidy
    ```

3.  **配置环境变量**:
    后端服务需要数据库连接信息。创建一个 `.env` 文件或直接在启动命令前设置环境变量：
    ```bash
    export SQL_URL="user:password@tcp(host:port)/database?charset=utf8mb4&parseTime=True&loc=Local"
    export ENV="development"
    ```

4.  **运行服务**:
    ```bash
    go run main.go
    ```
    服务将默认在 `8888` 端口（HTTP）和 `50051` 端口（gRPC）上启动。

### 前端 (React + Vite)

1.  **进入前端目录**:
    ```bash
    cd frontend
    ```

2.  **安装依赖**:
    ```bash
    pnpm install
    ```

3.  **运行开发服务器**:
    ```bash
    pnpm dev
    ```
    Vite 开发服务器将启动，您可以在浏览器中访问 `http://localhost:5173` (或终端提示的地址)。Vite 会自动处理热重载和 API 代理。

## 构建

### 生成 gRPC 代码

如果修改了 `.proto` 文件，需要重新生成 Go gRPC 代码。

1.  **进入后端目录**:
    ```bash
    cd backend
    ```

2.  **执行脚本**:
    ```bash
    ./build_proto.sh
    ```
    此脚本会调用 `protoc`，根据 `internal/grpc/proto/hello.proto` 生成或更新 `pb.go` 和 `grpc.pb.go` 文件。

*脚本来源: [backend/build_proto.sh](file:///home/guangguang/project/duck-core/backend/build_proto.sh)*

### 构建前端静态资源

此步骤会将 React 应用打包成静态 HTML, CSS, 和 JavaScript 文件。

1.  **进入前端目录**:
    ```bash
    cd frontend
    ```

2.  **执行构建命令**:
    ```bash
    pnpm build
    ```
    构建产物将默认输出到 `frontend/dist` 目录下。

*命令来源: [frontend/package.json](file:///home/guangguang/project/duck-core/frontend/package.json)*

### 构建后端可执行文件

此步骤会编译 Go 应用，生成一个平台相关的二进制可执行文件。

1.  **进入后端目录**:
    ```bash
    cd backend
    ```

2.  **执行构建命令**:
    ```bash
    # 针对 Linux 环境
    CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o duck_core_backend main.go
    ```

## 容器化部署 (Docker)

项目提供了 `docker-compose.yml` 文件，用于一键启动整个应用栈，包括后端、前端和数据库。

### Docker Compose

在项目根目录下执行以下命令：

```bash
docker-compose up --build
```

*   `--build` 参数会强制 Docker 在启动前重新构建镜像。

### 服务解析

`docker-compose.yml` 定义了三个服务：

*   **`db`**:
    *   **镜像**: `mysql:8.0`
    *   **职责**: 运行 MySQL 数据库实例。
    *   **数据持久化**: 使用名为 `dbdata` 的 Docker Volume 来持久化数据库文件，防止容器重启导致数据丢失。

*   **`backend`**:
    *   **构建上下文**: `./backend`
    *   **职责**: 运行 Go 后端服务。
    *   **依赖**: `depends_on: - db` 确保在后端启动前，数据库服务已经就绪。

*   **`web` (前端)**:
    *   **构建上下文**: `./frontend` (注意：在示例中为 `./web`，可能需要根据实际目录调整 Dockerfile)
    *   **职责**: 使用 Nginx 或类似服务器托管构建好的前端静态文件。
    *   **API 代理**: 环境变量 `VITE_API_BASE` 指向后端服务，在生产构建中，通常需要配置反向代理将 `/api` 请求转发到后端容器。

*文件来源: [docker-compose.yml](file:///home/guangguang/project/duck-core/docker-compose.yml)*

## 总结

`duck-core` 项目提供了清晰、现代化的开发和部署流程。
- **本地开发**流程简单，前后端分离，利用各自生态系统的最佳工具（Vite, Go run）实现了高效的开发体验。
- **构建**步骤明确，涵盖了从 gRPC 代码生成到前后端应用打包的全过程。
- **部署**方案通过 `Docker Compose` 实现了“一键式”部署，极大地简化了环境配置和应用管理的复杂性，是现代云原生应用的理想实践。
