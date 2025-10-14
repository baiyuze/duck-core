import MarkdownRenderer from "./MarkdownRenderer";
import { Card, Space, message } from "antd";

const testMarkdown = `
# 测试 Markdown 渲染

## JSON 代码块测试

\`\`\`json
{
  "type": "button",
  "text": "点击我",
  "style": {
    "color": "blue",
    "fontSize": 14
  }
}
\`\`\`

## JavaScript 代码块

\`\`\`javascript
function hello() {
  console.log("Hello World");
  return true;
}
\`\`\`

## 行内代码

这是一个 \`行内代码\` 示例。

## 列表

- 项目 1
- 项目 2
- 项目 3
`;

const MarkdownTest = () => {
  const handleApplyCode = (code: string) => {
    console.log("应用的代码:", code);
    try {
      const json = JSON.parse(code);
      console.log("解析的 JSON:", json);
      message.success("JSON 数据已应用");
    } catch (error) {
      message.error("不是有效的 JSON");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Space direction="vertical" size="large" style={{ width: "100%" }}>
        <Card title="Markdown 渲染测试">
          <MarkdownRenderer
            content={testMarkdown}
            onApplyCode={handleApplyCode}
          />
        </Card>
      </Space>
    </div>
  );
};

export default MarkdownTest;
