# API 接口文档

本项目的 API 文档通过 Swagger 生成，提供了详细的接口信息和在线测试功能。

## 访问 API 文档

在项目成功运行后，可以通过以下地址访问 Swagger UI：

[http://localhost:8080/swagger/index.html](http://localhost:8080/swagger/index.html)

## 接口概览

API 主要分为以下几个模块：

- **用户管理**: 包括用户注册、登录、信息查询等功能。
- **角色管理**: 用于管理用户角色及其权限。
- **权限管理**: 定义了系统中的各种操作权限。
- **部门管理**: 用于组织和管理部门结构。
- **字典管理**: 维护系统中的各类字典数据。

## 认证方式

所有需要认证的接口都通过 JWT (JSON Web Token) 进行保护。在调用这些接口时，需要在请求头中添加 `Authorization` 字段，其值为 `Bearer {token}`。
