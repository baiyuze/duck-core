import { useEffect, useState } from "react";
import { Button, Card, Input, Space, Typography, message } from "antd";
import { getToken, isAuthenticated } from "../../utils/request";

const { Title, Text, Paragraph } = Typography;

/**
 * Token测试组件
 * 用于测试token是否正确携带到API请求中
 */
const TokenTest = () => {
  const [token, setToken] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 获取当前token
    setToken(getToken());
  }, []);

  // 测试用户API（需要token）
  const testUserApi = async () => {
    setLoading(true);
    setTestResult("");

    try {
      const response = await fetch("/api/users/auth", {
        method: "GET",
      });

      const data = await response.json();

      if (response.ok) {
        setTestResult(`✅ 成功！响应: ${JSON.stringify(data, null, 2)}`);
        message.success("API请求成功，token有效");
      } else {
        setTestResult(
          `❌ 失败！状态: ${response.status}, 响应: ${JSON.stringify(
            data,
            null,
            2
          )}`
        );
        message.error("API请求失败");
      }
    } catch (error: any) {
      setTestResult(`❌ 错误！${error.message}`);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 测试AI API（需要token）
  const testAiApi = async () => {
    setLoading(true);
    setTestResult("");

    try {
      const response = await fetch("/api/ai/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "deepseek-r1",
          messages: [{ role: "user", content: "你好，这是一个测试" }],
          stream: false,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setTestResult(`✅ 成功！响应: ${JSON.stringify(data, null, 2)}`);
        message.success("AI API请求成功");
      } else {
        const text = await response.text();
        setTestResult(`❌ 失败！状态: ${response.status}, 响应: ${text}`);
        message.error("AI API请求失败");
      }
    } catch (error: any) {
      setTestResult(`❌ 错误！${error.message}`);
      message.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // 查看请求头
  const checkHeaders = () => {
    console.log("=== Token信息 ===");
    console.log("Token:", token);
    console.log("已登录:", isAuthenticated());
    console.log("Token长度:", token?.length || 0);

    message.info("Token信息已输出到控制台，请按F12查看");
  };

  return (
    <Card title="Token 携带测试" style={{ maxWidth: 800, margin: "20px auto" }}>
      <Space direction="vertical" style={{ width: "100%" }} size="large">
        <div>
          <Title level={4}>当前状态</Title>
          <Paragraph>
            <Text strong>登录状态: </Text>
            {isAuthenticated() ? (
              <Text type="success">✅ 已登录</Text>
            ) : (
              <Text type="danger">❌ 未登录</Text>
            )}
          </Paragraph>
          <Paragraph>
            <Text strong>Token: </Text>
            <Text code copyable={!!token}>
              {token ? `${token.substring(0, 20)}...` : "无"}
            </Text>
          </Paragraph>
        </div>

        <div>
          <Title level={4}>测试功能</Title>
          <Space wrap>
            <Button
              type="primary"
              onClick={testUserApi}
              loading={loading}
              disabled={!isAuthenticated()}
            >
              测试用户API
            </Button>
            <Button
              type="primary"
              onClick={testAiApi}
              loading={loading}
              disabled={!isAuthenticated()}
            >
              测试AI API
            </Button>
            <Button onClick={checkHeaders}>查看请求头</Button>
          </Space>
          {!isAuthenticated() && (
            <Paragraph type="warning" style={{ marginTop: 10 }}>
              请先登录后再测试
            </Paragraph>
          )}
        </div>

        {testResult && (
          <div>
            <Title level={4}>测试结果</Title>
            <Input.TextArea
              value={testResult}
              rows={10}
              readOnly
              style={{ fontFamily: "monospace" }}
            />
          </div>
        )}

        <div>
          <Title level={4}>说明</Title>
          <Paragraph>
            <ul>
              <li>
                所有 <Text code>/api/</Text> 开头的请求都会自动添加{" "}
                <Text code>Authorization</Text> header
              </li>
              <li>Token 从 localStorage 读取</li>
              <li>拦截器会在控制台输出详细日志</li>
              <li>按 F12 打开开发者工具查看 Network 标签</li>
            </ul>
          </Paragraph>
        </div>
      </Space>
    </Card>
  );
};

export default TokenTest;
