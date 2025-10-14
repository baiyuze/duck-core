# AI 聊天组件快速开始

## 📦 安装依赖

所需依赖已在项目中安装：
- `@ant-design/x`: ^1.6.1
- `antd`: ^5.27.4
- `antd-style`: ^3.7.1
- `dayjs`: ^1.11.18

## 🚀 快速开始

### 1. 基础使用

```tsx
import { Copilot } from '@/Components/AiChat/AiChat';
import { useState } from 'react';

function App() {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ height: '100vh', display: 'flex' }}>
      <div style={{ flex: 1 }}>
        {/* 你的主要内容 */}
      </div>
      <Copilot copilotOpen={open} setCopilotOpen={setOpen} />
    </div>
  );
}
```

### 2. 使用完整 Demo

```tsx
import AiChatDemo from '@/Components/AiChat/AiChat';

function App() {
  return <AiChatDemo />;
}
```

## ⚙️ 配置 API

在 `AiChat.tsx` 的第 253-257 行，找到以下代码：

```typescript
const [agent] = useXAgent<BubbleDataType>({
  baseURL: "https://api.deepseek.com/v1",
  model: "deepseek-reasoner",
  dangerouslyApiKey: "Bearer sk-your-api-key-here",
});
```

### DeepSeek API 配置

1. **获取 API Key**
   - 访问 [DeepSeek Platform](https://platform.deepseek.com/)
   - 注册并创建 API Key

2. **选择模型**
   - `deepseek-reasoner`: 支持深度推理，显示思考过程
   - `deepseek-chat`: 通用对话，速度更快

3. **更新配置**
```typescript
const [agent] = useXAgent<BubbleDataType>({
  baseURL: "https://api.deepseek.com/v1",
  model: "deepseek-reasoner", // 或 "deepseek-chat"
  dangerouslyApiKey: "Bearer sk-xxxxxxxxxxxxxxx", // 替换为你的 API Key
});
```

### 使用其他 OpenAI 兼容 API

```typescript
const [agent] = useXAgent<BubbleDataType>({
  baseURL: "https://your-api-endpoint.com/v1",
  model: "your-model-name",
  dangerouslyApiKey: "Bearer your-api-key",
});
```

## 🎨 核心功能

### 1. 思考过程展示

DeepSeek R1 模型会返回 `reasoning_content` 字段，组件会自动：
- 以紫色渐变卡片显示思考过程
- 支持折叠/展开
- 思考中显示动态指示器

**API 响应格式：**
```json
{
  "choices": [{
    "delta": {
      "reasoning_content": "让我分析一下这个问题...",
      "content": "基于以上分析，我的回答是..."
    }
  }]
}
```

### 2. 流式对话

组件使用 SSE (Server-Sent Events) 实现流式响应：
- 实时显示生成内容
- 打字机效果
- 支持中断请求

### 3. 多会话管理

- 自动保存会话历史（内存中）
- 支持切换历史对话
- 新建对话

### 4. 文件上传

- 点击附件图标上传文件
- 支持拖拽上传
- 粘贴文件上传

### 5. 快捷操作

- **快捷按钮**：预设常用问题
- **快捷指令**：输入 `/` 触发技能菜单
- **消息操作**：复制、点赞、点踩

## 🎭 自定义

### 修改主题色

在 `ThinkingContent` 组件中修改渐变色：

```typescript
background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
```

### 修改欢迎消息

在 `chatList` 中找到 `Welcome` 组件：

```tsx
<Welcome
  variant="borderless"
  title="👋 你好，我是 AI 助手"
  description="我支持 DeepSeek R1 等先进模型..."
  className={styles.chatWelcome}
/>
```

### 修改快捷建议

在文件开头修改 `MOCK_SUGGESTIONS`：

```typescript
const MOCK_SUGGESTIONS = [
  { label: "你的建议", value: "your-value" },
  // 添加更多...
];
```

### 修改快捷按钮

在 `chatSender` 中修改按钮：

```tsx
<Button
  size="small"
  icon={<YourIcon />}
  onClick={() => handleUserSubmit("你的问题")}
>
  按钮文字
</Button>
```

## 🔧 高级配置

### 添加会话持久化

```typescript
// 保存到 localStorage
useEffect(() => {
  localStorage.setItem('chatHistory', JSON.stringify(messageHistory));
}, [messageHistory]);

// 从 localStorage 读取
useEffect(() => {
  const saved = localStorage.getItem('chatHistory');
  if (saved) {
    setMessageHistory(JSON.parse(saved));
  }
}, []);
```

### 自定义错误处理

在 `useXChat` 的 `requestFallback` 中：

```typescript
requestFallback: (_, { error }) => {
  if (error.name === "AbortError") {
    return { content: "❌ 请求已取消", role: "assistant" };
  }
  
  // 添加更多错误处理
  if (error.message.includes("401")) {
    return { content: "🔑 API Key 无效", role: "assistant" };
  }
  
  return {
    content: `❌ 请求失败: ${error.message}`,
    role: "assistant",
  };
},
```

### 添加消息预处理

```typescript
onRequest({
  stream: true,
  message: {
    content: preprocessMessage(val), // 预处理
    role: "user"
  },
});

function preprocessMessage(text: string) {
  // 添加系统提示词、格式化等
  return text.trim();
}
```

## 📱 响应式设计

组件默认宽度 400px，可以根据屏幕大小调整：

```typescript
<div
  className={styles.copilotChat}
  style={{
    width: copilotOpen ? (window.innerWidth < 768 ? '100%' : 400) : 0
  }}
>
```

## 🐛 常见问题

### Q: 思考过程不显示？
A: 确保使用的是 `deepseek-reasoner` 模型，并检查 API 响应是否包含 `reasoning_content` 字段。

### Q: 流式响应中断？
A: 检查网络连接，确保 API 支持 SSE，查看浏览器控制台错误。

### Q: API Key 报错？
A: 确保 Key 格式为 `Bearer sk-xxxxx`，检查 Key 是否有效。

### Q: 如何禁用某些功能？
A: 在组件中注释相关代码，例如禁用文件上传：
```tsx
// prefix={
//   <Button ... />
// }
```

## 📚 相关文档

- [Ant Design X 官方文档](https://x.ant.design/)
- [DeepSeek API 文档](https://platform.deepseek.com/docs)
- [项目 README](./README.md)
- [类型定义](./types.ts)
- [配置文件](./config.ts)

## 🤝 贡献

欢迎提交 Issue 和 PR！

## 📄 License

MIT
