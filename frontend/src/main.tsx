import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { setupFetchInterceptor } from "./utils/fetchInterceptor";

// 安装全局 fetch 拦截器
setupFetchInterceptor();

createRoot(document.getElementById("root")!).render(<App />);
