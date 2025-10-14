/**
 * AI Chat 组件类型定义
 */

/**
 * 消息气泡数据类型
 */
export interface BubbleDataType {
  role: "user" | "assistant";
  content: string;
  thinking?: string; // DeepSeek R1 思考过程
}

/**
 * 会话数据类型
 */
export interface ConversationType {
  key: string;
  label: string;
  group: string;
}

/**
 * AI Agent 配置
 */
export interface AgentConfig {
  baseURL: string;
  model: string;
  dangerouslyApiKey: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
}

/**
 * 消息历史记录
 */
export interface MessageHistory {
  [sessionId: string]: any[];
}

/**
 * DeepSeek API 响应数据结构
 */
export interface DeepSeekResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    delta: {
      role?: string;
      content?: string;
      reasoning_content?: string;
    };
    finish_reason?: string;
  }>;
}

/**
 * 快捷建议项
 */
export interface SuggestionItem {
  label: string;
  value: string;
  icon?: React.ReactNode;
  children?: SuggestionItem[];
}

/**
 * 组件 Props
 */
export interface CopilotProps {
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  defaultModel?: string;
  defaultBaseURL?: string;
  onMessageSend?: (message: string) => void;
  onMessageReceive?: (message: BubbleDataType) => void;
}
