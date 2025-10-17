/**
 * Fetch 拦截器
 * 自动为所有API请求添加 Authorization header
 */

import { getToken, removeToken } from "./request";

// 保存原始的 fetch
const originalFetch = window.fetch;

/**
 * 自定义 fetch 函数，自动添加 token
 */
const interceptedFetch: typeof fetch = async (...args) => {
  const [url, config] = args;

  // 只拦截 API 请求
  const shouldAddToken = typeof url === "string" && url.includes("/api/");

  // 不需要 token 的接口白名单
  const noTokenUrls = [
    "/api/users/login", // 登录
    "/api/users/register", // 注册
  ];

  // 检查是否是白名单中的接口
  const isNoTokenUrl =
    typeof url === "string" &&
    noTokenUrls.some((noTokenUrl) => url.includes(noTokenUrl));

  if (shouldAddToken && !isNoTokenUrl) {
    const token = getToken();

    console.log("🔍 API请求拦截:", {
      url,
      method: config?.method || "GET",
      hasToken: !!token,
    });

    if (token) {
      // 创建新的 headers 对象
      const headers = new Headers(config?.headers);

      // 添加 Authorization header
      if (!headers.has("Authorization")) {
        headers.set("Authorization", `Bearer ${token}`);
        console.log("✅ 已添加 Authorization header");
      }

      try {
        // 发起请求
        const response = await originalFetch(url, {
          ...config,
          headers,
        });

        console.log("📡 API响应:", {
          url,
          status: response.status,
          statusText: response.statusText,
          ok: response.ok,
        });

        // 处理 401 未授权响应
        if (response.status === 401) {
          console.warn("⚠️ Token 已过期或无效，跳转到登录页");
          removeToken();

          // 如果不在登录页，跳转到登录页
          if (window.location.pathname !== "/login") {
            window.location.href = "/login";
          }
        }

        return response;
      } catch (error) {
        console.error("❌ API请求失败:", error);
        throw error;
      }
    }
  }

  // 没有 token 或不是 API 请求，使用原始 fetch
  return originalFetch(...args);
};

/**
 * 安装拦截器
 */
export const setupFetchInterceptor = () => {
  window.fetch = interceptedFetch;
  console.log("✅ Fetch 拦截器已安装");
};

/**
 * 移除拦截器
 */
export const removeFetchInterceptor = () => {
  window.fetch = originalFetch;
  console.log("❌ Fetch 拦截器已移除");
};

export default {
  setup: setupFetchInterceptor,
  remove: removeFetchInterceptor,
};
