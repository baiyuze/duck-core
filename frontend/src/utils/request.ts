/**
 * 统一的API请求工具
 * 自动添加token到请求头
 */

interface RequestConfig extends RequestInit {
  params?: Record<string, string | number>;
}

interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

/**
 * 获取存储的token
 */
export const getToken = (): string | null => {
  const token = localStorage.getItem("token");
  // 如果token被JSON.stringify包装了，需要解析
  if (token && token.startsWith('"') && token.endsWith('"')) {
    try {
      return JSON.parse(token);
    } catch {
      return token;
    }
  }
  return token;
};

/**
 * 设置token
 */
export const setToken = (token: string): void => {
  // 直接存储token字符串，不使用JSON.stringify
  localStorage.setItem("token", token);
};

/**
 * 清除token
 */
export const removeToken = (): void => {
  localStorage.removeItem("token");
};

/**
 * 检查是否已登录
 */
export const isAuthenticated = (): boolean => {
  return !!getToken();
};

/**
 * 构建请求URL（带查询参数）
 */
const buildUrl = (
  url: string,
  params?: Record<string, string | number>
): string => {
  if (!params) return url;

  const queryString = Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");

  return `${url}${url.includes("?") ? "&" : "?"}${queryString}`;
};

/**
 * 统一的请求方法
 */
export const request = async <T = any>(
  url: string,
  config: RequestConfig = {}
): Promise<ApiResponse<T>> => {
  const { params, headers = {}, ...restConfig } = config;

  // 构建完整URL
  const fullUrl = buildUrl(url, params);

  // 构建请求头
  const requestHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers as Record<string, string>),
  };

  // 不需要 token 的接口白名单
  const noTokenUrls = ["/api/users/login", "/api/users/register"];
  const isNoTokenUrl = noTokenUrls.some((noTokenUrl) =>
    fullUrl.includes(noTokenUrl)
  );

  // 添加token到Authorization头（登录和注册接口除外）
  if (!isNoTokenUrl) {
    const token = getToken();
    if (token) {
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }
  }

  try {
    const response = await fetch(fullUrl, {
      ...restConfig,
      headers: requestHeaders,
    });

    // 处理token过期或未授权（在解析JSON之前）
    if (response.status === 401) {
      removeToken();
      // 跳转到登录页
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      throw new Error("未授权，请重新登录");
    }

    // 检查响应状态
    if (!response.ok) {
      // 尝试解析错误信息
      let errorMessage = `请求失败: ${response.status} ${response.statusText}`;
      try {
        const errorData = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // JSON解析失败，使用默认错误信息
      }
      throw new Error(errorMessage);
    }

    // 检查响应体是否为空
    const text = await response.text();
    if (!text) {
      throw new Error("服务器返回空响应");
    }

    // 解析JSON
    let data: ApiResponse<T>;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("JSON解析失败:", text);
      throw new Error("服务器返回的数据格式错误");
    }

    // 检查业务状态码
    if (data.code === 401) {
      removeToken();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      throw new Error("未授权，请重新登录");
    }

    if (data.code !== 200) {
      throw new Error(data.message || "请求失败");
    }

    return data;
  } catch (error) {
    console.error("Request error:", error);
    throw error;
  }
};

/**
 * GET 请求
 */
export const get = <T = any>(
  url: string,
  params?: Record<string, string | number>,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return request<T>(url, {
    ...config,
    method: "GET",
    params,
  });
};

/**
 * POST 请求
 */
export const post = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  console.log(data, "data");
  return request<T>(url, {
    ...config,
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * PUT 请求
 */
export const put = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return request<T>(url, {
    ...config,
    method: "PUT",
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * DELETE 请求
 */
export const del = <T = any>(
  url: string,
  data?: any,
  config?: RequestConfig
): Promise<ApiResponse<T>> => {
  return request<T>(url, {
    ...config,
    method: "DELETE",
    body: data ? JSON.stringify(data) : undefined,
  });
};

export default {
  get,
  post,
  put,
  delete: del,
  request,
  getToken,
  setToken,
  removeToken,
  isAuthenticated,
};
