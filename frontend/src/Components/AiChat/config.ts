/**
 * AI Chat 配置文件
 */

/**
 * 支持的 AI 模型配置
 */
export const AI_MODELS = {
  deepseekReasoner: {
    name: "DeepSeek Reasoner",
    model: "deepseek-reasoner",
    baseURL: "https://api.deepseek.com/v1",
    description: "深度推理模型，支持展示思考过程",
    supportsReasoning: true,
  },
  deepseekChat: {
    name: "DeepSeek Chat",
    model: "deepseek-chat",
    baseURL: "https://api.deepseek.com/v1",
    description: "通用对话模型，响应速度快",
    supportsReasoning: false,
  },
  gpt4: {
    name: "GPT-4",
    model: "gpt-4",
    baseURL: "https://api.openai.com/v1",
    description: "OpenAI GPT-4 模型",
    supportsReasoning: false,
  },
  gpt35Turbo: {
    name: "GPT-3.5 Turbo",
    model: "gpt-3.5-turbo",
    baseURL: "https://api.openai.com/v1",
    description: "OpenAI GPT-3.5 Turbo 模型",
    supportsReasoning: false,
  },
};

/**
 * 默认配置
 */
export const DEFAULT_CONFIG = {
  model: AI_MODELS.deepseekReasoner.model,
  baseURL: AI_MODELS.deepseekReasoner.baseURL,
  temperature: 1,
  maxTokens: 4096,
  topP: 1,
};

/**
 * 快捷建议配置
 */
export const QUICK_SUGGESTIONS = {
  creative: [
    "帮我写一首诗",
    "生成一个创意故事",
    "设计一个产品名称",
    "给我一个营销方案",
  ],
  technical: [
    "解释 React Hooks 原理",
    "如何优化前端性能？",
    "什么是闭包？",
    "TypeScript 类型推导",
  ],
  coding: [
    "写一个防抖函数",
    "实现一个深拷贝",
    "用 TypeScript 实现单例模式",
    "写一个二分查找算法",
  ],
  analysis: [
    "分析这个问题的解决方案",
    "给出优缺点对比",
    "提供技术选型建议",
    "帮我做决策分析",
  ],
};

/**
 * UI 配置
 */
export const UI_CONFIG = {
  maxWidth: 400,
  minWidth: 300,
  headerHeight: 52,
  sendAreaPadding: 12,
  messageTypingSpeed: 5,
  messageTypingInterval: 20,
  thinkingGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  userAvatarGradient: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
  assistantAvatarGradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
};

/**
 * 错误消息配置
 */
export const ERROR_MESSAGES = {
  networkError: "网络连接失败，请检查网络设置",
  apiError: "API 请求失败，请检查配置",
  aborted: "请求已取消",
  timeout: "请求超时，请重试",
  invalidResponse: "响应数据格式错误",
  authError: "认证失败，请检查 API Key",
};

/**
 * 提示消息配置
 */
export const PROMPT_MESSAGES = {
  emptyInput: "请输入消息内容",
  requesting: "正在处理消息中，请等待完成或取消当前请求",
  newConversation: "当前已经是新对话",
  copied: "已复制到剪贴板",
  fileUploaded: "文件上传成功",
  fileUploadFailed: "文件上传失败",
};
