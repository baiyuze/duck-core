import { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import CodeBlock from "./CodeBlock";

interface MarkdownRendererProps {
  content: string;
  onApplyCode?: (code: string) => void;
}

const MarkdownRenderer = ({ content, onApplyCode }: MarkdownRendererProps) => {
  // 使用 useMemo 缓存组件配置，避免每次渲染都重新创建
  const components = useMemo(
    () => ({
      // 自定义代码块渲染
      code({ node, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || "");

        // 正确提取文本内容 - 处理各种情况
        let codeContent = "";

        if (typeof children === "string") {
          codeContent = children;
        } else if (Array.isArray(children)) {
          // 递归提取所有文本节点
          const extractText = (nodes: any[]): string => {
            return nodes
              .map((node) => {
                if (typeof node === "string") {
                  return node;
                }
                if (node && node.props && node.props.children) {
                  if (Array.isArray(node.props.children)) {
                    return extractText(node.props.children);
                  }
                  return String(node.props.children || "");
                }
                return "";
              })
              .join("");
          };
          codeContent = extractText(children);
        } else {
          codeContent = String(children || "");
        }

        // 移除末尾换行符
        codeContent = codeContent.replace(/\n$/, "");

        const inline = !match;

        // 行内代码
        if (inline) {
          return (
            <code
              className={className}
              style={{
                background: "#f6f8fa",
                padding: "2px 6px",
                borderRadius: 3,
                fontSize: "0.9em",
                color: "#d73a49",
              }}
              {...props}
            >
              {codeContent}
            </code>
          );
        }

        // 代码块
        return (
          <CodeBlock
            language={match ? match[1] : undefined}
            onApply={onApplyCode}
          >
            {codeContent}
          </CodeBlock>
        );
      },
      // 自定义其他元素样式
      h1: ({ children }: any) => (
        <h1 style={{ fontSize: 24, fontWeight: 600, marginBlock: "16px 12px" }}>
          {children}
        </h1>
      ),
      h2: ({ children }: any) => (
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBlock: "14px 10px" }}>
          {children}
        </h2>
      ),
      h3: ({ children }: any) => (
        <h3 style={{ fontSize: 18, fontWeight: 600, marginBlock: "12px 8px" }}>
          {children}
        </h3>
      ),
      p: ({ children }: any) => (
        <p style={{ marginBlock: 8, lineHeight: 1.6 }}>{children}</p>
      ),
      ul: ({ children }: any) => (
        <ul style={{ marginBlock: 8, paddingLeft: 24 }}>{children}</ul>
      ),
      ol: ({ children }: any) => (
        <ol style={{ marginBlock: 8, paddingLeft: 24 }}>{children}</ol>
      ),
      li: ({ children }: any) => <li style={{ marginBlock: 4 }}>{children}</li>,
      blockquote: ({ children }: any) => (
        <blockquote
          style={{
            borderLeft: "4px solid #dfe2e5",
            paddingLeft: 16,
            marginBlock: 8,
            color: "#6a737d",
          }}
        >
          {children}
        </blockquote>
      ),
      a: ({ href, children }: any) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#0366d6", textDecoration: "none" }}
        >
          {children}
        </a>
      ),
      table: ({ children }: any) => (
        <div style={{ overflowX: "auto", marginBlock: 8 }}>
          <table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              border: "1px solid #dfe2e5",
            }}
          >
            {children}
          </table>
        </div>
      ),
      th: ({ children }: any) => (
        <th
          style={{
            padding: "8px 12px",
            border: "1px solid #dfe2e5",
            background: "#f6f8fa",
            fontWeight: 600,
          }}
        >
          {children}
        </th>
      ),
      td: ({ children }: any) => (
        <td style={{ padding: "8px 12px", border: "1px solid #dfe2e5" }}>
          {children}
        </td>
      ),
    }),
    [onApplyCode]
  ); // 只有当 onApplyCode 发生变化时才重新创建组件配置

  return <ReactMarkdown components={components}>{content}</ReactMarkdown>;
};

export default MarkdownRenderer;
