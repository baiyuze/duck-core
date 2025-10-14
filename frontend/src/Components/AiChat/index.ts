/**
 * AI Chat 组件统一导出
 */

export { default as AiChatDemo } from "./AiChat";
export { Copilot } from "./AiChat";
export { default as AiChatExample } from "./Example";

export type {
  BubbleDataType,
  ConversationType,
  AgentConfig,
  MessageHistory,
  DeepSeekResponse,
  SuggestionItem,
  CopilotProps,
} from "./types";

export {
  AI_MODELS,
  DEFAULT_CONFIG,
  QUICK_SUGGESTIONS,
  UI_CONFIG,
  ERROR_MESSAGES,
  PROMPT_MESSAGES,
} from "./config";
