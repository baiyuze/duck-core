# 后端 API 文档

<cite>
  **本文档中引用的文件**
  * [internal/router/user_router.go](file:///home/guangguang/project/duck-core/backend/internal/router/user_router.go)
  * [internal/router/roles_router.go](file:///home/guangguang/project/duck-core/backend/internal/router/roles_router.go)
  * [internal/router/department_router.go](file:///home/guangguang/project/duck-core/backend/internal/router/department_router.go)
  * [internal/dto/user.go](file:///home/guangguang/project/duck-core/backend/internal/dto/user.go)
  * [internal/grpc/proto/hello.proto](file:///home/guangguang/project/duck-core/backend/internal/grpc/proto/hello.proto)
</cite>

## 目录
1. [简介](#简介)
2. [RESTful API](#restful-api)
    1. [认证 (Authentication)](#认证-authentication)
    2. [用户 (Users)](#用户-users)
    3. [角色 (Roles)](#角色-roles)
    4. [部门 (Departments)](#部门-departments)
3. [gRPC API](#grpc-api)
    1. [服务: UserService](#服务-userservice)
    2. [服务: HelloService](#服务-helloservice)
4. [总结](#总结)

## 简介

本文档详细描述了 `duck-core` 后端系统提供的所有 API 接口，包括 RESTful API 和 gRPC API。所有 RESTful API 均以 `/api` 为前缀。

## RESTful API

### 认证 (Authentication)

#### 用户登录
*   **Endpoint**: `POST /api/users/login`
*   **描述**: 用户通过账号和密码进行登录，成功后返回 JWT Token。
*   **认证**: 否
*   **Request Body**:
    ```json
    {
      "account": "admin",
      "password": "password123"
    }
    ```
*   **Response Body (Success)**:
    ```json
    {
      "code": 200,
      "data": {
        "token": "ey...",
        "refreshToken": "ey...",
        "userInfo": {
          "account": "admin",
          "name": "Administrator",
          "id": 1
        }
      },
      "msg": "成功"
    }
    ```
*   **Curl 示例**:
    ```bash
    curl -X POST -H "Content-Type: application/json" \
      -d '{"account": "admin", "password": "password123"}' \
      http://localhost:8888/api/users/login
    ```

### 用户 (Users)

*源文件: [internal/router/user_router.go](file:///home/guangguang/project/duck-core/backend/internal/router/user_router.go)*

#### 获取用户列表
*   **Endpoint**: `GET /api/users/`
*   **认证**: 是
*   **描述**: 获取系统中的用户列表，支持分页。
*   **Query Parameters**: `page`, `pageSize`
*   **Response Body (Success)**:
    ```json
    {
      "code": 200,
      "data": {
        "list": [
          {
            "id": 1,
            "name": "Administrator",
            "account": "admin",
            "createTime": "2023-10-27T10:00:00Z",
            "updateTime": "2023-10-27T10:00:00Z",
            "roleId": [1],
            "roleName": ["SuperAdmin"]
          }
        ],
        "total": 1
      },
      "msg": "成功"
    }
    ```

#### 更新用户角色
*   **Endpoint**: `PUT /api/users/:id`
*   **认证**: 是
*   **描述**: 更新指定 ID 用户所绑定的角色。
*   **Request Body**:
    ```json
    {
      "roleIds": [1, 2]
    }
    ```

### 角色 (Roles)

*源文件: [internal/router/roles_router.go](file:///home/guangguang/project/duck-core/backend/internal/router/roles_router.go)*

#### 获取角色列表
*   **Endpoint**: `GET /api/roles/`
*   **认证**: 是
*   **描述**: 获取所有角色的列表。

#### 创建角色
*   **Endpoint**: `POST /api/roles/`
*   **认证**: 是
*   **描述**: 创建一个新的角色。

#### 更新角色权限
*   **Endpoint**: `PUT /api/roles/permissions/:id`
*   **认证**: 是
*   **描述**: 修改指定角色所拥有的权限。

### 部门 (Departments)

*源文件: [internal/router/department_router.go](file:///home/guangguang/project/duck-core/backend/internal/router/department_router.go)*

#### 获取部门列表
*   **Endpoint**: `GET /api/departments/`
*   **认证**: 是
*   **描述**: 以树状结构获取所有部门。

#### 为部门绑定用户
*   **Endpoint**: `POST /api/departments/:id/users`
*   **认证**: 是
*   **描述**: 为指定 ID 的部门添加用户。

## gRPC API

*源文件: [internal/grpc/proto/hello.proto](file:///home/guangguang/project/duck-core/backend/internal/grpc/proto/hello.proto)*

系统在 `50051` 端口上暴露了 gRPC 服务。

### 服务: UserService

#### 方法: VerifyToken
*   **RPC**: `rpc VerifyToken(TokenRequest) returns (UserResponse);`
*   **描述**: 验证一个 JWT Token 并返回对应的用户信息。这是服务间认证的关键 RPC。
*   **Request Message**:
    ```protobuf
    message TokenRequest {
      string token = 1;
    }
    ```
*   **Response Message**:
    ```protobuf
    message UserResponse {
      string id = 1;
      string name = 2;
      string email = 3;
    }
    ```

### 服务: HelloService

#### 方法: SayHello
*   **RPC**: `rpc SayHello (HelloRequest) returns (HelloResponse);`
*   **描述**: 一个简单的示例 RPC，用于测试服务可用性。
*   **Request Message**:
    ```protobuf
    message HelloRequest {
      string name = 1;
    }
    ```
*   **Response Message**:
    ```protobuf
    message HelloResponse {
      string greeting = 1;
    }
    ```

## 总结

`duck-core` 的 API 设计清晰地分离了面向外部客户端的 RESTful 接口和面向内部微服务的 gRPC 接口。

*   **RESTful API** 遵循了标准的 HTTP 方法和状态码约定，提供了用户、角色、权限等核心业务对象的完整 CRUD 操作。通过 JWT 进行状态无关的认证，保证了系统的安全性和可伸缩性。
*   **gRPC API** 则专注于提供高性能的服务间通信能力，例如 `VerifyToken` 方法，它为其他需要验证用户身份的微服务提供了一个高效、类型安全的接口。

这种混合 API 的设计模式，使得系统既能方便地与前端 Web 应用集成，又能构建一个高效、可靠的分布式系统。
