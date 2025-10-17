import { useEffect, useState } from "react";
import { Button, Card, Space, Typography, message } from "antd";
import { getToken, removeToken } from "../../utils/request";
import {
  cleanStorage,
  fixToken,
  validateToken,
  getTokenInfo,
} from "../../utils/tokenHelper";

const { Title, Text, Paragraph } = Typography;

/**
 * Token 调试工具组件
 */
const TokenDebug = () => {
  const [token, setToken] = useState<string | null>(null);
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [rawValue, setRawValue] = useState<string>("");

  const refreshInfo = () => {
    const currentToken = getToken();
    setToken(currentToken);

    // 获取原始存储值
    const raw = localStorage.getItem("token");
    setRawValue(raw || "");

    if (currentToken) {
      const info = getTokenInfo(currentToken);
      setTokenInfo(info);
    } else {
      setTokenInfo(null);
    }
  };

  useEffect(() => {
    refreshInfo();
  }, []);

  const handleCleanStorage = () => {
    cleanStorage();
    message.success("存储已清理");
    refreshInfo();
  };

  const handleFixToken = () => {
    const fixed = fixToken();
    if (fixed) {
      message.success("Token 已修复");
    } else {
      message.warning("没有需要修复的 token");
    }
    refreshInfo();
  };

  const handleRemoveToken = () => {
    removeToken();
    message.success("Token 已删除");
    refreshInfo();
  };

  const handleValidateToken = () => {
    if (!token) {
      message.warning("没有 token");
      return;
    }

    const isValid = validateToken(token);
    if (isValid) {
      message.success("Token 格式有效");
    } else {
      message.error("Token 格式无效");
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 1200, margin: "0 auto" }}>
      <Card title="🔧 Token 调试工具">
        <Space direction="vertical" style={{ width: "100%" }} size="large">
          {/* 操作按钮 */}
          <div>
            <Title level={4}>操作</Title>
            <Space wrap>
              <Button onClick={refreshInfo}>刷新信息</Button>
              <Button onClick={handleFixToken} type="primary">
                修复 Token
              </Button>
              <Button onClick={handleValidateToken}>验证 Token</Button>
              <Button onClick={handleRemoveToken} danger>
                删除 Token
              </Button>
              <Button onClick={handleCleanStorage} danger>
                清理存储
              </Button>
            </Space>
          </div>

          {/* Token 状态 */}
          <div>
            <Title level={4}>Token 状态</Title>
            <Paragraph>
              <Text strong>存在: </Text>
              {token ? (
                <Text type="success">✅ 是</Text>
              ) : (
                <Text type="danger">❌ 否</Text>
              )}
            </Paragraph>
            <Paragraph>
              <Text strong>格式: </Text>
              {token && validateToken(token) ? (
                <Text type="success">✅ 有效</Text>
              ) : (
                <Text type="danger">❌ 无效</Text>
              )}
            </Paragraph>
          </div>

          {/* 原始存储值 */}
          <div>
            <Title level={4}>原始存储值</Title>
            <Paragraph>
              <Text code style={{ wordBreak: "break-all" }}>
                {rawValue || "(空)"}
              </Text>
            </Paragraph>
            {rawValue && rawValue.startsWith('"') && (
              <Paragraph type="warning">
                ⚠️ 检测到 token 被 JSON.stringify 包装，点击"修复 Token"按钮
              </Paragraph>
            )}
          </div>

          {/* 解析后的 Token */}
          {token && (
            <div>
              <Title level={4}>解析后的 Token</Title>
              <Paragraph>
                <Text code style={{ wordBreak: "break-all", fontSize: 12 }}>
                  {token}
                </Text>
              </Paragraph>
              <Paragraph>
                <Text strong>长度: </Text>
                <Text>{token.length} 字符</Text>
              </Paragraph>
            </div>
          )}

          {/* Token 信息 */}
          {tokenInfo && (
            <div>
              <Title level={4}>Token 信息</Title>
              <Paragraph>
                <Text strong>过期状态: </Text>
                {tokenInfo.isExpired ? (
                  <Text type="danger">❌ 已过期</Text>
                ) : (
                  <Text type="success">✅ 有效</Text>
                )}
              </Paragraph>
              {tokenInfo.expiresAt && (
                <Paragraph>
                  <Text strong>过期时间: </Text>
                  <Text>{tokenInfo.expiresAt.toLocaleString()}</Text>
                </Paragraph>
              )}
              <Paragraph>
                <Text strong>载荷: </Text>
                <pre
                  style={{
                    background: "#f5f5f5",
                    padding: 10,
                    borderRadius: 4,
                    fontSize: 12,
                  }}
                >
                  {JSON.stringify(tokenInfo.payload, null, 2)}
                </pre>
              </Paragraph>
            </div>
          )}

          {/* 字符检查 */}
          {token && (
            <div>
              <Title level={4}>字符检查</Title>
              {[...token].some((char) => char.charCodeAt(0) > 127) ? (
                <Paragraph type="danger">
                  ❌ 检测到非 ASCII 字符！这会导致 Headers 错误。
                </Paragraph>
              ) : (
                <Paragraph type="success">✅ 所有字符都是 ASCII 字符</Paragraph>
              )}
              <Paragraph>
                <Text strong>包含引号: </Text>
                {token.includes('"') ? (
                  <Text type="danger">❌ 是（需要修复）</Text>
                ) : (
                  <Text type="success">✅ 否</Text>
                )}
              </Paragraph>
            </div>
          )}

          {/* 说明 */}
          <div>
            <Title level={4}>常见问题</Title>
            <Paragraph>
              <ul>
                <li>
                  <Text strong>
                    "String contains non ISO-8859-1 code point" 错误：
                  </Text>
                  <br />
                  原因：Token 被 JSON.stringify 包装，或包含非 ASCII 字符
                  <br />
                  解决：点击"修复 Token"按钮
                </li>
                <li>
                  <Text strong>Token 格式无效：</Text>
                  <br />
                  原因：JWT token 应该是三段用 . 分隔的 base64 字符串
                  <br />
                  解决：删除 token 并重新登录
                </li>
                <li>
                  <Text strong>Token 已过期：</Text>
                  <br />
                  解决：删除 token 并重新登录
                </li>
              </ul>
            </Paragraph>
          </div>
        </Space>
      </Card>
    </div>
  );
};

export default TokenDebug;
