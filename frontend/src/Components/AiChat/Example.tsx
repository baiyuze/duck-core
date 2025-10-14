/**
 * AI Chat 使用示例
 */
import { Copilot } from "./AiChat";
import { Button } from "antd";
import { useState } from "react";

const AiChatExample = () => {
  const [open, setOpen] = useState(true);

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      {/* 主内容区 */}
      <div style={{ flex: 1, padding: 20, overflow: "auto" }}>
        <h1>AI Chat 示例</h1>
        <p>这是一个支持 DeepSeek 等模型的 AI 聊天窗口示例</p>

        <Button type="primary" onClick={() => setOpen(!open)}>
          {open ? "关闭" : "打开"} AI 助手
        </Button>

        <div style={{ marginTop: 20 }}>
          <h2>功能特点：</h2>
          <ul>
            <li>✅ 支持流式对话</li>
            <li>✅ 显示 AI 思考过程（DeepSeek R1）</li>
            <li>✅ 多会话管理</li>
            <li>✅ 文件上传</li>
            <li>✅ 语音输入</li>
            <li>✅ 消息操作（复制、点赞等）</li>
          </ul>
        </div>

        <div style={{ marginTop: 20 }}>
          <h2>配置步骤：</h2>
          <ol>
            <li>在 AiChat.tsx 中配置你的 API Key</li>
            <li>选择合适的模型（deepseek-reasoner/deepseek-chat）</li>
            <li>开始对话！</li>
          </ol>
        </div>

        <div
          style={{
            marginTop: 20,
            padding: 16,
            background: "#f5f5f5",
            borderRadius: 8,
          }}
        >
          <h3>⚙️ 配置示例：</h3>
          <pre
            style={{
              background: "#fff",
              padding: 12,
              borderRadius: 4,
              overflow: "auto",
            }}
          >
            {`const [agent] = useXAgent<BubbleDataType>({
  baseURL: "https://api.deepseek.com/v1",
  model: "deepseek-reasoner",
  dangerouslyApiKey: "Bearer sk-your-api-key-here",
});`}
          </pre>
        </div>
      </div>

      {/* AI 聊天窗口 */}
      <Copilot copilotOpen={open} setCopilotOpen={setOpen} />
    </div>
  );
};

export default AiChatExample;
