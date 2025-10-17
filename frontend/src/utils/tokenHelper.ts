/**
 * Token 修复工具
 * 用于清理和修复可能存在问题的 token
 */

/**
 * 清理所有存储，重新开始
 */
export const cleanStorage = () => {
  console.log("🧹 清理 localStorage...");

  // 保存可能需要的其他数据
  const backupKeys = ["theme", "language", "settings"];
  const backup: Record<string, string> = {};

  backupKeys.forEach((key) => {
    const value = localStorage.getItem(key);
    if (value) backup[key] = value;
  });

  // 清空
  localStorage.clear();

  // 恢复备份
  Object.entries(backup).forEach(([key, value]) => {
    localStorage.setItem(key, value);
  });

  console.log("✅ localStorage 已清理");
};

/**
 * 修复可能被 JSON.stringify 包装的 token
 */
export const fixToken = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    console.log("ℹ️ 没有找到 token");
    return null;
  }

  console.log("原始 token:", token);

  // 如果被 JSON.stringify 包装了
  if (token.startsWith('"') && token.endsWith('"')) {
    try {
      const fixed = JSON.parse(token);
      console.log("🔧 修复后的 token:", fixed);
      localStorage.setItem("token", fixed);
      return fixed;
    } catch (error) {
      console.error("❌ 无法修复 token:", error);
      return null;
    }
  }

  console.log("✅ Token 格式正常");
  return token;
};

/**
 * 验证 token 是否有效
 */
export const validateToken = (token: string): boolean => {
  if (!token) return false;

  // 检查是否包含非法字符
  // JWT token 应该只包含 base64 字符: A-Z, a-z, 0-9, -, _, .
  const jwtPattern = /^[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+$/;

  const isValid = jwtPattern.test(token);

  if (!isValid) {
    console.warn("⚠️ Token 格式无效:", token);
  } else {
    console.log("✅ Token 格式有效");
  }

  return isValid;
};

/**
 * 获取 token 信息（解码 JWT）
 */
export const getTokenInfo = (token: string) => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    const payload = JSON.parse(atob(parts[1]));

    return {
      payload,
      isExpired: payload.exp ? Date.now() >= payload.exp * 1000 : false,
      expiresAt: payload.exp ? new Date(payload.exp * 1000) : null,
    };
  } catch (error) {
    console.error("❌ 无法解析 token:", error);
    return null;
  }
};

export default {
  cleanStorage,
  fixToken,
  validateToken,
  getTokenInfo,
};
