import {
  BulbOutlined,
  CloseOutlined,
  CloudUploadOutlined,
  CommentOutlined,
  CopyOutlined,
  DislikeOutlined,
  DownOutlined,
  LikeOutlined,
  LoadingOutlined,
  OpenAIFilled,
  PaperClipOutlined,
  PlusOutlined,
  RobotOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import {
  Attachments,
  type AttachmentsProps,
  Bubble,
  Conversations,
  Prompts,
  Sender,
  Suggestion,
  Welcome,
  useXAgent,
  useXChat,
} from "@ant-design/x";
import type { Conversation } from "@ant-design/x/es/conversations";
import {
  Button,
  Dropdown,
  type GetProp,
  type GetRef,
  type MenuProps,
  Popover,
  Space,
  Spin,
  message,
} from "antd";
import { createStyles } from "antd-style";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import MarkdownRenderer from "./MarkdownRenderer";
import moduleStyles from "./AiChat.module.scss";

type BubbleDataType = {
  role: string;
  content: string;
  thinking?: string;
};

const MOCK_SESSION_LIST = [
  {
    key: "5",
    label: "新对话",
    group: "今天",
  },
  {
    key: "4",
    label: "如何实现 React 组件优化？",
    group: "今天",
  },
  {
    key: "3",
    label: "DeepSeek 模型的特点",
    group: "今天",
  },
  {
    key: "2",
    label: "前端性能优化方案",
    group: "昨天",
  },
  {
    key: "1",
    label: "TypeScript 类型系统",
    group: "昨天",
  },
];

// AI 模型列表
const AI_MODELS = [
  {
    key: "deepseek-r1",
    label: "DeepSeek R1",
    description: "深度思考模型，适合复杂推理",
    icon: <ThunderboltOutlined />,
  },
  {
    key: "deepseek-v3",
    label: "DeepSeek-v3",
    description: "快速对话模型",
    icon: <RobotOutlined />,
  },
  {
    key: "gpt-4",
    label: "GPT-4",
    description: "OpenAI 最强模型",
    icon: <OpenAIFilled />,
  },
  {
    key: "gpt-3.5-turbo",
    label: "GPT-3.5 Turbo",
    description: "快速高效的对话模型",
    icon: <OpenAIFilled />,
  },
  {
    key: "qwen3-max",
    label: "通义千问3",
    description: "通义千问3系列Max模型",
    icon: <OpenAIFilled />,
  },
];

const MOCK_SUGGESTIONS = [
  { label: "写一份报告", value: "report" },
  { label: "生成创意", value: "creative" },
  {
    label: "查询知识",
    value: "knowledge",
    icon: <OpenAIFilled />,
    children: [
      { label: "关于 React", value: "react" },
      { label: "关于 TypeScript", value: "typescript" },
    ],
  },
];
const AGENT_PLACEHOLDER = "正在生成内容，请稍候...";

// 思考过程组件
const ThinkingContent = ({ content }: { content: string }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className={moduleStyles.thinkingContainer}>
      <div
        className={`${moduleStyles.thinkingHeader} ${
          collapsed ? moduleStyles.collapsed : ""
        }`}
        onClick={() => setCollapsed(!collapsed)}
      >
        <Space>
          <BulbOutlined className={moduleStyles.thinkingIcon} />
          <span className={moduleStyles.thinkingTitle}>AI 思考过程</span>
        </Space>
        <DownOutlined
          className={`${moduleStyles.thinkingArrow} ${
            collapsed ? moduleStyles.collapsed : moduleStyles.expanded
          }`}
        />
      </div>
      {!collapsed && (
        <div className={moduleStyles.thinkingContentText}>{content}</div>
      )}
    </div>
  );
};

const useCopilotStyle = createStyles(({ token, css }) => {
  return {
    copilotChat: css`
      display: flex;
      flex-direction: column;
      background: ${token.colorBgContainer};
      color: ${token.colorText};
      height: 100%; /* 确保固定高度 */
      overflow: hidden; /* 防止整体容器溢出 */
    `,
    // chatHeader 样式
    chatHeader: css`
      height: 52px;
      box-sizing: border-box;
      border-bottom: 1px solid ${token.colorBorder};
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 10px 0 16px;
    `,
    headerTitle: css`
      font-weight: 600;
      font-size: 15px;
    `,
    headerButton: css`
      font-size: 18px;
    `,
    conversations: css`
      width: 300px;
      .ant-conversations-list {
        padding-inline-start: 0;
      }
    `,
    // chatList 样式
    chatList: css`
      overflow: hidden; /* 防止滚动条闪烁 */
      padding-block: 16px;
      flex: 1;
      min-height: 0; /* 确保flex子元素可以缩小 */
      display: flex;
      flex-direction: column;
    `,
    chatWelcome: css`
      margin-inline: 16px;
      padding: 12px 16px;
      border-radius: 2px 12px 12px 12px;
      background: ${token.colorBgTextHover};
      margin-bottom: 16px;
    `,
    loadingMessage: css`
      background-image: linear-gradient(
        90deg,
        #ff6b23 0%,
        #af3cb8 31%,
        #53b6ff 89%
      );
      background-size: 100% 2px;
      background-repeat: no-repeat;
      background-position: bottom;
    `,
    // 防止内容变化时的闪烁
    messageContent: css`
      will-change: contents;
      contain: layout style;
      word-wrap: break-word;
      word-break: break-word;
      overflow-wrap: break-word;
      min-height: 1em; /* 确保最小高度 */
    `,
    thinkingIndicator: css`
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      border-radius: 12px;
      color: #fff;
      font-size: 12px;
      margin-bottom: 8px;
    `,
    // chatSend 样式
    chatSend: css`
      padding: 12px;
    `,
    sendAction: css`
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      gap: 8px;
    `,
    speechButton: css`
      font-size: 18px;
      color: ${token.colorText} !important;
    `,
  };
});

interface CopilotProps {
  copilotOpen: boolean;
  setCopilotOpen: (open: boolean) => void;
  onApplyCode?: (code: string) => void; // 应用代码的回调函数
}

const Copilot = (props: CopilotProps) => {
  const { copilotOpen, setCopilotOpen, onApplyCode } = props;
  const { styles } = useCopilotStyle();
  const attachmentsRef = useRef<GetRef<typeof Attachments>>(null);
  const abortController = useRef<AbortController>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  // ==================== State ====================

  const [messageHistory, setMessageHistory] = useState<Record<string, any>>({});

  const [sessionList, setSessionList] =
    useState<Conversation[]>(MOCK_SESSION_LIST);
  const [curSession, setCurSession] = useState(sessionList[0].key);

  const [attachmentsOpen, setAttachmentsOpen] = useState(false);
  const [files, setFiles] = useState<GetProp<AttachmentsProps, "items">>([]);

  const [inputValue, setInputValue] = useState("");

  // 当前选中的模型
  const [currentModel, setCurrentModel] = useState(AI_MODELS[0].key);

  // 防抖滚动到底部
  const scrollToBottomDebounced = useRef<number>(0);
  const scrollToBottom = () => {
    if (scrollToBottomDebounced.current) {
      clearTimeout(scrollToBottomDebounced.current);
    }
    scrollToBottomDebounced.current = window.setTimeout(() => {
      if (chatListRef.current) {
        const scrollElement =
          chatListRef.current.querySelector(".ant-bubble-list");
        if (scrollElement) {
          // 判断用户是否手动滚动到上面，如果不在底部则不自动滚动
          const { scrollTop, scrollHeight, clientHeight } = scrollElement;
          const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50; // 50px 的容差，适应轻微滚动

          if (isAtBottom) {
            scrollElement.scrollTop = scrollElement.scrollHeight;
          }
        }
      }
    }, 10);
  };

  // ==================== Callbacks ====================

  /**
   * 应用代码块中的 JSON 数据
   */
  const handleApplyCode = (code: string) => {
    if (onApplyCode) {
      // 如果外部传入了回调函数，使用外部的
      onApplyCode(code);
    } else {
      // 默认行为
      try {
        const jsonData = JSON.parse(code);
        console.log("应用的 JSON 数据:", jsonData);

        // TODO: 在这里实现你的应用逻辑
        // 例如：将 JSON 数据应用到画布、更新配置等

        message.success("JSON 数据已应用");
      } catch (error) {
        message.error("数据格式错误");
        console.error("解析 JSON 失败:", error);
      }
    }
  };

  /**
   * 🔔 配置说明:
   * - baseURL: API 基础地址，使用 vite 代理指向后端 http://192.168.50.1:8888
   * - model: 接口路径 chat，实际请求为 POST /api/ai/chat
   * - dangerouslyApiKey: API 密钥（如果后端需要）
   */

  // ==================== Runtime ====================

  const [agent] = useXAgent<BubbleDataType>({
    baseURL: "/api/ai/chat",
    model: currentModel,
  });

  const loading = agent.isRequesting();

  const { messages, onRequest, setMessages } = useXChat({
    agent,
    requestFallback: (_, { error }) => {
      if (error.name === "AbortError") {
        return {
          content: "请求已取消",
          role: "assistant",
        };
      }
      return {
        content: `请求失败: ${error.message || "请重试"}`,
        role: "assistant",
      };
    },
    transformMessage: (info) => {
      const { originMessage, chunk } = info || {};
      let currentContent = "";
      let currentThinking = "";

      try {
        if (chunk?.data && !chunk?.data.includes("[DONE]")) {
          // 尝试解析后端返回的数据
          const data = JSON.parse(chunk?.data);

          // 根据后端实际返回格式调整
          // 如果后端直接返回文本内容
          if (typeof data === "string") {
            currentContent = data;
          }
          // 如果后端返回对象格式（类似 DeepSeek）
          else if (data?.choices?.[0]?.delta) {
            const delta = data.choices[0].delta;
            currentThinking = delta?.reasoning_content || "";
            currentContent = delta?.content || "";
          }
          // 如果后端返回其他格式，尝试获取内容
          else {
            currentContent = data?.content || data?.text || "";
          }
        }
      } catch (error) {
        console.error("解析消息失败:", error);
        // 如果解析失败，尝试直接使用原始数据
        if (chunk?.data && !chunk?.data.includes("[DONE]")) {
          currentContent = chunk?.data;
        }
      }

      // 获取原始内容
      const prevContent = originMessage?.content || "";
      const prevThinking = (originMessage as any)?.thinking || "";

      // 构建新的思考和内容
      const newThinking = prevThinking + currentThinking;
      const newContent = prevContent + currentContent;

      // 判断是否正在思考（有 thinking 但没有 content）
      const isThinking = newThinking && !newContent;

      return {
        content: newContent || (isThinking ? "" : ""),
        role: "assistant",
        thinking: newThinking || undefined,
      };
    },
    resolveAbortController: (controller) => {
      abortController.current = controller;
    },
  });

  // ==================== Event ====================
  const handleUserSubmit = (val: string) => {
    onRequest({
      stream: true,
      message: { content: val, role: "user" },
    });

    // session title mock
    if (
      sessionList.find((i) => i.key === curSession)?.label === "New session"
    ) {
      setSessionList(
        sessionList.map((i) =>
          i.key !== curSession ? i : { ...i, label: val?.slice(0, 20) }
        )
      );
    }
  };

  const onPasteFile = (_: File, files: FileList) => {
    for (const file of files) {
      attachmentsRef.current?.upload(file);
    }
    setAttachmentsOpen(true);
  };

  // ==================== Nodes ====================
  const currentModelInfo =
    AI_MODELS.find((m) => m.key === currentModel) || AI_MODELS[0];

  const modelMenuItems: MenuProps["items"] = AI_MODELS.map((model) => ({
    key: model.key,
    label: (
      <div className={moduleStyles.modelMenuItem}>
        <div className={moduleStyles.modelMenuIcon}>{model.icon}</div>
        <div className={moduleStyles.modelMenuContent}>
          <div className={moduleStyles.modelMenuLabel}>{model.label}</div>
          <div className={moduleStyles.modelMenuDesc}>{model.description}</div>
        </div>
        {model.key === currentModel && (
          <span className={moduleStyles.modelMenuCheck}>✓</span>
        )}
      </div>
    ),
    onClick: () => {
      if (agent.isRequesting()) {
        message.warning("正在处理消息中，暂时无法切换模型");
        return;
      }
      setCurrentModel(model.key);
      message.success(`已切换到 ${model.label}`);
    },
  }));

  const chatHeader = (
    <div className={styles.chatHeader}>
      <div className={styles.headerTitle}>
        <ThunderboltOutlined style={{ color: "#764ba2" }} />
        <span>AI 智能助手</span>
      </div>
      <Space size={0}>
        <Dropdown
          menu={{ items: modelMenuItems }}
          placement="bottomRight"
          trigger={["click"]}
        >
          <Button type="text" className={styles.headerButton} title="切换模型">
            <Space size={4}>
              {currentModelInfo.icon}
              <span className={moduleStyles.modelButtonText}>
                {currentModelInfo.label}
              </span>
              <DownOutlined style={{ fontSize: 10 }} />
            </Space>
          </Button>
        </Dropdown>
        <Button
          type="text"
          icon={<PlusOutlined />}
          onClick={() => {
            if (agent.isRequesting()) {
              message.error("正在处理消息中，请等待完成或取消当前请求...");
              return;
            }

            if (messages?.length) {
              const timeNow = dayjs().valueOf().toString();
              abortController.current?.abort();
              setTimeout(() => {
                setSessionList([
                  { key: timeNow, label: "新对话", group: "今天" },
                  ...sessionList,
                ]);
                setCurSession(timeNow);
                setMessages([]);
              }, 100);
            } else {
              message.info("当前已经是新对话");
            }
          }}
          className={styles.headerButton}
          title="新建对话"
        />
        <Popover
          placement="bottom"
          styles={{ body: { padding: 0, maxHeight: 600 } }}
          content={
            <Conversations
              items={sessionList?.map((i) =>
                i.key === curSession ? { ...i, label: `[当前] ${i.label}` } : i
              )}
              activeKey={curSession}
              groupable
              onActiveChange={async (val) => {
                abortController.current?.abort();
                setTimeout(() => {
                  setCurSession(val);
                  setMessages(messageHistory?.[val] || []);
                }, 100);
              }}
              styles={{ item: { padding: "0 8px" } }}
              className={styles.conversations}
            />
          }
        >
          <Button
            type="text"
            icon={<CommentOutlined />}
            className={styles.headerButton}
            title="历史对话"
          />
        </Popover>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={() => setCopilotOpen(false)}
          className={styles.headerButton}
          title="关闭"
        />
      </Space>
    </div>
  );
  const chatList = (
    <div className={styles.chatList} ref={chatListRef}>
      {messages?.length ? (
        /** 消息列表 */
        <Bubble.List
          className={moduleStyles.bubbleList}
          items={messages?.map((i) => {
            const msg = i.message as BubbleDataType;
            const isLoading = i.status === "loading";
            const hasThinking = msg.thinking && msg.thinking.length > 0;

            return {
              ...msg,
              classNames: {
                content: isLoading
                  ? styles.loadingMessage
                  : styles.messageContent,
              },
              typing: isLoading
                ? { step: 5, interval: 20, suffix: <>💗</> }
                : false,
              // 如果有思考过程，在内容前显示
              content: (
                <>
                  {hasThinking && <ThinkingContent content={msg.thinking!} />}
                  {isLoading && hasThinking && !msg.content && (
                    <div className={styles.thinkingIndicator}>
                      <LoadingOutlined spin />
                      <span>正在深度思考...</span>
                    </div>
                  )}
                  {msg.content && (
                    <MarkdownRenderer
                      content={msg.content}
                      onApplyCode={handleApplyCode}
                    />
                  )}
                </>
              ),
            };
          })}
          roles={{
            assistant: {
              placement: "start",
              avatar: {
                icon: <ThunderboltOutlined />,
                className: moduleStyles.assistantAvatar,
              },
              footer: (msg) => {
                const content = (msg as any)?.props?.children?.[1]?.props
                  ?.children;
                const hasContent = content && typeof content === "string";

                return hasContent ? (
                  <div className={moduleStyles.footerActions}>
                    <Button
                      type="text"
                      size="small"
                      icon={<CopyOutlined />}
                      onClick={() => {
                        navigator.clipboard.writeText(content);
                        message.success("已复制到剪贴板");
                      }}
                    />
                    <Button type="text" size="small" icon={<LikeOutlined />} />
                    <Button
                      type="text"
                      size="small"
                      icon={<DislikeOutlined />}
                    />
                  </div>
                ) : null;
              },
              loadingRender: () => (
                <Space>
                  <Spin size="small" />
                  {AGENT_PLACEHOLDER}
                </Space>
              ),
            },
            user: {
              placement: "end",
              avatar: {
                className: moduleStyles.userAvatar,
              },
            },
          }}
        />
      ) : (
        /** 没有消息时的 welcome */
        <>
          <Welcome
            variant="borderless"
            title="👋 你好，我是X"
            description="我可以进行网页设计，比如说帮我设计要给系统商城！"
            className={styles.chatWelcome}
          />

          <Prompts
            vertical
            title="💡 你可以问我："
            items={[
              { key: "1", description: "帮我设计一个小红书首页" },
              { key: "3", description: "你是谁？" },
            ]}
            onItemClick={(info) =>
              handleUserSubmit(info?.data?.description as string)
            }
            className={moduleStyles.promptsContainer}
            styles={{
              title: { fontSize: 14, fontWeight: 500, marginBottom: 8 },
            }}
          />
        </>
      )}
    </div>
  );
  const sendHeader = (
    <Sender.Header
      title="上传文件"
      styles={{ content: { padding: 0 } }}
      open={attachmentsOpen}
      onOpenChange={setAttachmentsOpen}
      forceRender
    >
      <Attachments
        ref={attachmentsRef}
        beforeUpload={() => false}
        items={files}
        onChange={({ fileList }) => setFiles(fileList)}
        placeholder={(type) =>
          type === "drop"
            ? { title: "将文件拖放到此处" }
            : {
                icon: <CloudUploadOutlined />,
                title: "上传文件",
                description: "点击或拖拽文件到此区域上传",
              }
        }
      />
    </Sender.Header>
  );
  const chatSender = (
    <div className={styles.chatSend}>
      {/* <div className={styles.sendAction}>
        <Button
          size="small"
          icon={<BulbOutlined />}
          onClick={() => handleUserSubmit("给我一个创意想法")}
        >
          创意想法
        </Button>
        <Button
          size="small"
          icon={<ProductOutlined />}
          onClick={() => handleUserSubmit("帮我解决一个技术问题")}
        >
          技术问题
        </Button>
        <Button
          size="small"
          icon={<AppstoreAddOutlined />}
          onClick={() => handleUserSubmit("帮我写段代码")}
        >
          代码助手
        </Button>
      </div> */}

      {/** 输入框 */}
      <Suggestion
        items={MOCK_SUGGESTIONS}
        onSelect={(itemVal) => setInputValue(`[${itemVal}]:`)}
      >
        {({ onTrigger, onKeyDown }) => (
          <Sender
            loading={loading}
            value={inputValue}
            onChange={(v) => {
              onTrigger(v === "/");
              setInputValue(v);
            }}
            onSubmit={() => {
              if (inputValue.trim()) {
                handleUserSubmit(inputValue);
                setInputValue("");
              }
            }}
            onCancel={() => {
              abortController.current?.abort();
            }}
            allowSpeech
            placeholder="输入问题或 / 使用技能快捷方式"
            onKeyDown={onKeyDown}
            header={sendHeader}
            prefix={
              <Button
                type="text"
                icon={<PaperClipOutlined style={{ fontSize: 18 }} />}
                onClick={() => setAttachmentsOpen(!attachmentsOpen)}
                title="附加文件"
              />
            }
            onPasteFile={onPasteFile}
            actions={(_, info) => {
              const { SendButton, LoadingButton, SpeechButton } =
                info.components;
              return (
                <div className={moduleStyles.senderActions}>
                  <SpeechButton className={styles.speechButton} />
                  {loading ? (
                    <LoadingButton type="default"></LoadingButton>
                  ) : (
                    <SendButton type="primary"></SendButton>
                  )}
                </div>
              );
            }}
          />
        )}
      </Suggestion>
    </div>
  );

  useEffect(() => {
    // history mock
    if (messages?.length) {
      setMessageHistory((prev) => ({
        ...prev,
        [curSession]: messages,
      }));
      // 当消息更新时，滚动到底部
      scrollToBottom();
    }
  }, [messages]);

  // 清理定时器
  useEffect(() => {
    return () => {
      if (scrollToBottomDebounced.current) {
        clearTimeout(scrollToBottomDebounced.current);
      }
    };
  }, []);

  return (
    <div
      className={`${styles.copilotChat} ${moduleStyles.copilotContainer}`}
      style={{ width: copilotOpen ? 400 : 0 }}
    >
      {/** 对话区 - header */}
      {chatHeader}

      {/** 对话区 - 消息列表 */}
      {chatList}

      {/** 对话区 - 输入框 */}
      {chatSender}
    </div>
  );
};

const useWorkareaStyle = createStyles(({ token, css }) => {
  return {
    copilotWrapper: css`
      width: 400px;
      height: 100%;
      display: flex;
    `,
    workarea: css`
      flex: 1;
      background: ${token.colorBgLayout};
      display: flex;
      flex-direction: column;
    `,
    workareaHeader: css`
      box-sizing: border-box;
      height: 52px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 48px 0 28px;
      border-bottom: 1px solid ${token.colorBorder};
    `,
    headerTitle: css`
      font-weight: 600;
      font-size: 15px;
      color: ${token.colorText};
      display: flex;
      align-items: center;
      gap: 8px;
    `,
    headerButton: css`
      background-image: linear-gradient(78deg, #8054f2 7%, #3895da 95%);
      border-radius: 12px;
      height: 24px;
      width: 93px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #fff;
      cursor: pointer;
      font-size: 12px;
      font-weight: 600;
      transition: all 0.3s;
      &:hover {
        opacity: 0.8;
      }
    `,
    workareaBody: css`
      flex: 1;
      padding: 16px;
      background: ${token.colorBgContainer};
      border-radius: 16px;
      min-height: 0;
    `,
    bodyContent: css`
      overflow: auto;
      height: 100%;
      padding-right: 10px;
    `,
    bodyText: css`
      color: ${token.colorText};
      padding: 8px;
    `,
  };
});

const CopilotDemo = (props: { onApplyCode: (code: string) => void }) => {
  const { styles: workareaStyles } = useWorkareaStyle();

  // ==================== State =================
  const [copilotOpen, setCopilotOpen] = useState(true);

  // ==================== Render =================
  return (
    <div className={workareaStyles.copilotWrapper}>
      <Copilot
        copilotOpen={copilotOpen}
        setCopilotOpen={setCopilotOpen}
        onApplyCode={props.onApplyCode}
      />
    </div>
  );
};

// 导出默认的 Demo 组件
export default CopilotDemo;
