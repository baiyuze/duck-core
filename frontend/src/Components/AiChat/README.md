# AI Chat 组件使用说明

## 功能特点

✨ **核心功能**
- 支持流式对话，实时返回内容
- 支持 DeepSeek R1 等模型的思考过程（reasoning）展示
- **🆕 支持完整的 Markdown 语法渲染**
- **🆕 代码块支持复制和应用功能**
- **🆕 自动识别 JSON 数据并提供应用按钮**
- 多会话管理，可切换历史对话
- 文件上传功能
- 语音输入支持
- 消息复制、点赞等交互

🎨 **界面特色**
- 基于 Ant Design X 构建
- 思考过程可折叠展示，带渐变背景
- 代码高亮显示
- 流畅的加载动画
- 响应式布局

## Markdown 渲染功能

### 支持的 Markdown 语法
- ✅ 标题（H1-H6）
- ✅ 段落和换行
- ✅ 列表（有序/无序）
- ✅ 代码块和行内代码
- ✅ 引用块
- ✅ 链接
- ✅ 表格
- ✅ 代码高亮

### 代码块功能

#### 1. 自动语言识别
代码块会自动识别语言类型并应用相应的语法高亮：

````markdown
```javascript
function hello() {
  console.log("Hello World");
}
```
````

#### 2. 复制功能
所有代码块右上角都有"复制"按钮，点击即可复制代码到剪贴板。

#### 3. JSON 应用功能
当代码块包含有效的 JSON 数据时，会自动显示"应用"按钮：

````markdown
```json
{
  "type": "button",
  "text": "点击我",
  "style": {
    "color": "blue"
  }
}
```
````

支持的语言标识：`json`, `javascript`, `js`, `typescript`, `ts`

点击"应用"按钮会：
1. 验证 JSON 格式
2. 调用 `onApplyCode` 回调函数
3. 显示成功/失败提示

## 使用方式

### 基础用法

```tsx
import { Copilot } from './Components/AiChat/AiChat';

function App() {
  const [copilotOpen, setCopilotOpen] = useState(true);

  return (
    <Copilot 
      copilotOpen={copilotOpen} 
      setCopilotOpen={setCopilotOpen} 
    />
  );
}
```

### 自定义代码应用逻辑

```tsx
import { Copilot } from './Components/AiChat/AiChat';

function App() {
  const [copilotOpen, setCopilotOpen] = useState(true);

  // 自定义应用代码的逻辑
  const handleApplyCode = (code: string) => {
    try {
      const jsonData = JSON.parse(code);
      
      // 你的自定义逻辑
      // 例如：更新画布、应用配置等
      console.log('应用的数据:', jsonData);
      
      // 可以调用其他方法
      updateCanvas(jsonData);
      message.success('配置已应用到画布');
      
    } catch (error) {
      message.error('应用失败');
      console.error('应用失败:', error);
    }
  };

  return (
    <Copilot 
      copilotOpen={copilotOpen} 
      setCopilotOpen={setCopilotOpen}
      onApplyCode={handleApplyCode}
    />
  );
}
```

## Props 说明

### Copilot 组件

| 属性 | 类型 | 必填 | 默认值 | 说明 |
|------|------|------|--------|------|
| copilotOpen | boolean | 是 | - | 控制 AI 对话框的显示/隐藏 |
| setCopilotOpen | (open: boolean) => void | 是 | - | 设置对话框显示状态的回调 |
| onApplyCode | (code: string) => void | 否 | 内置处理 | 应用代码块的自定义回调函数 |

### 1. 配置 API

在 `AiChat.tsx` 中找到以下代码并替换为你的配置：

```typescript
const [agent] = useXAgent<BubbleDataType>({
  baseURL: "https://api.deepseek.com/v1",  // 你的 API 地址
  model: "deepseek-reasoner",              // 模型名称
  dangerouslyApiKey: "Bearer sk-xxxxx",    // 你的 API Key
});
```

### 2. 支持的模型

#### DeepSeek R1 / Reasoner
- 支持深度推理
- 返回 `reasoning_content` 字段展示思考过程
- 适合复杂问题解答

#### DeepSeek Chat
- 通用对话模型
- 速度更快
- 适合日常对话

#### 其他 OpenAI 兼容模型
- 只要支持 SSE（Server-Sent Events）流式输出
- 符合 OpenAI API 格式即可

### 3. 思考过程展示

组件会自动识别模型返回的 `reasoning_content` 字段，并以可折叠的紫色渐变卡片展示思考过程。

**数据结构示例：**
```json
{
  "choices": [{
    "delta": {
      "reasoning_content": "首先，我需要分析...",
      "content": "根据分析结果..."
    }
  }]
}
```

### 4. 使用组件

```tsx
import AiChat from '@/Components/AiChat/AiChat';

function App() {
  return (
    <div>
      <AiChat />
    </div>
  );
}
```

## API 说明

### useXAgent 配置

| 参数 | 说明 | 类型 | 默认值 |
|------|------|------|--------|
| baseURL | API 基础地址 | string | - |
| model | 模型名称 | string | - |
| dangerouslyApiKey | API 密钥 | string | - |

### useXChat 配置

| 参数 | 说明 | 类型 |
|------|------|------|
| agent | useXAgent 实例 | Agent |
| requestFallback | 请求失败回调 | Function |
| transformMessage | 消息转换函数 | Function |

### 消息数据结构

```typescript
type BubbleDataType = {
  role: string;        // "user" | "assistant"
  content: string;     // 消息内容
  thinking?: string;   // 思考过程（可选）
};
```

## 自定义样式

组件使用 `antd-style` 的 `createStyles` API，你可以修改以下样式：

- `copilotChat` - 聊天容器
- `chatHeader` - 顶部标题栏
- `chatList` - 消息列表区域
- `chatSend` - 输入框区域
- `thinkingIndicator` - 思考中指示器
- `loadingMessage` - 加载中消息样式

## 进阶功能

### 1. 会话持久化

当前会话保存在内存中，可以扩展为：
- LocalStorage 持久化
- 后端 API 保存
- IndexedDB 存储

### 2. 文件上传

组件已集成文件上传功能，可以：
- 配合后端 API 处理文件
- 支持图片、文档等多种格式
- 拖拽上传

### 3. 快捷指令

使用 `/` 触发快捷指令菜单，可自定义：

```typescript
const MOCK_SUGGESTIONS = [
  { label: "写一份报告", value: "report" },
  { label: "生成创意", value: "creative" },
  // 添加更多...
];
```

## 常见问题

### Q: 如何修改主题色？
A: 修改 `ThinkingContent` 组件的 gradient 背景色和其他相关颜色值。

### Q: 如何禁用思考过程显示？
A: 在消息渲染时添加条件判断，跳过 `ThinkingContent` 组件。

### Q: 如何添加更多消息操作？
A: 在 `footer` 渲染函数中添加更多按钮。

### Q: 流式返回不稳定怎么办？
A: 检查网络连接和 API 配置，确保支持 SSE。

## 技术栈

- React 19
- Ant Design X 1.6+
- Ant Design 5.27+
- TypeScript 5.8+
- antd-style 3.7+

## License

MIT
