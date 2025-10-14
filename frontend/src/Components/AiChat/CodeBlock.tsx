import {
  CheckOutlined,
  CopyOutlined,
  ThunderboltOutlined,
} from "@ant-design/icons";
import { Button, message } from "antd";
import { useEffect, useRef, useState } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/github.css";

interface CodeBlockProps {
  language?: string;
  children: string;
  onApply?: (code: string) => void;
}

const CodeBlock = ({ language, children, onApply }: CodeBlockProps) => {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLElement>(null);

  // 应用语法高亮
  useEffect(() => {
    if (codeRef.current && language) {
      try {
        hljs.highlightElement(codeRef.current);
      } catch (error) {
        console.error("代码高亮失败:", error);
      }
    }
  }, [children, language]);

  // 判断是否为 JSON 数据
  const isJSON = () => {
    if (
      !language ||
      !["json", "javascript", "js", "typescript", "ts"].includes(
        language.toLowerCase()
      )
    ) {
      return false;
    }

    try {
      JSON.parse(children);
      return true;
    } catch {
      return false;
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setCopied(true);
      message.success("已复制到剪贴板");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      message.error("复制失败");
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply(children);
      message.success("已应用代码");
    }
  };

  const canApply = isJSON() && onApply;

  return (
    <div style={{ position: "relative", marginBlock: 8 }}>
      {/* 语言标签和操作按钮 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "4px 12px",
          background: "#f6f8fa",
          borderBottom: "1px solid #e1e4e8",
          borderRadius: "6px 6px 0 0",
        }}
      >
        <span style={{ fontSize: 12, color: "#57606a", fontWeight: 500 }}>
          {language || "text"}
        </span>
        <div style={{ display: "flex", gap: 4 }}>
          {canApply && (
            <Button
              type="text"
              size="small"
              icon={<ThunderboltOutlined />}
              onClick={handleApply}
              style={{ fontSize: 12 }}
            >
              应用
            </Button>
          )}
          <Button
            type="text"
            size="small"
            icon={copied ? <CheckOutlined /> : <CopyOutlined />}
            onClick={handleCopy}
            style={{ fontSize: 12 }}
          >
            {copied ? "已复制" : "复制"}
          </Button>
        </div>
      </div>

      {/* 代码内容 */}
      <pre
        style={{
          margin: 0,
          padding: 12,
          background: "#f6f8fa",
          borderRadius: "0 0 6px 6px",
          overflow: "auto",
          fontSize: 13,
          lineHeight: 1.5,
        }}
      >
        <code ref={codeRef} className={language ? `language-${language}` : ""}>
          {children}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
