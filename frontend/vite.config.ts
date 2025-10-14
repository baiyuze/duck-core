import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: "0.0.0.0",
    port: 9001,
    proxy: {
      "/api": {
        target: "http://192.168.50.1:8888",
        changeOrigin: true,
      },
      // "/compatible-mode/v1": {
      //   target: "https://dashscope.aliyuncs.com",
      //   changeOrigin: true,
      //   secure: true,
      //   rewrite: (path) =>
      //     path.replace(/^\/compatible-mode\/v1/, "/compatible-mode/v1"),
      //   headers: {
      //     Origin: "https://dashscope.aliyuncs.com",
      //     Referer: "https://dashscope.aliyuncs.com",
      //     "User-Agent":
      //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      //   },
      // },
    },
  },
});
