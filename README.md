# 🐤 DuckCore

**DuckLab** 是一个示例项目，采用 **前端 + Go 后端** 的 monorepo 结构，用于快速演示全栈开发实践。  
它轻量、简洁，适合作为 demo、学习和原型验证项目的基础。

---

## ✨ 特性

- **前端 (web)**  
  - 基于 **Vite + React**（或 Vue）  
  - 简洁的目录结构，快速开发体验  
  - 环境变量支持（`VITE_API_BASE`）  

- **后端 (backend)**  
  - 使用 **Go + Gin** 框架  
  - 内置 RESTful API 示例（如 `/api/health`）  
  - 依赖注入（DI）模式，清晰的分层结构  

- **一体化开发**  
  - 通过 **docker-compose** 一键启动前后端与数据库  
  - 支持本地调试和远程部署  
  - 提供可扩展的 `infra/` 目录（K8s、Nginx 等）  

---

## 📂 项目结构

```
duckCore/                # 根仓库（git）
├─ README.md
├─ docker-compose.yml
├─ .env
├─ backend/
│  ├─ go.mod            # module github.com/<you>/ducklab
│  ├─ cmd/
│  │  └─ server/
│  │     └─ main.go
│  ├─ internal/
│  │  ├─ api/           # HTTP handler 层
│  │  ├─ service/       # 业务逻辑
│  │  ├─ store/         # DB / 存储
│  │  └─ di/            # 初始化依赖注入（你之前有习惯）
│  └─ Dockerfile
├─ web/
│  ├─ package.json
│  ├─ vite.config.ts    # or webpack/next
│  ├─ src/
│  │  ├─ App.jsx
│  │  └─ pages/         # 或 components /
│  └─ Dockerfile
├─ infra/
│  ├─ k8s/              # 若需要
│  └─ nginx/            # 静态资源 / 反向代理示例
└─ scripts/
   ├─ start.sh
   └─ build-all.sh
```