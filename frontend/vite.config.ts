import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV !== "development" ? "/design" : "/",
  server: {
    host: "0.0.0.0",
    port: 9001,
    proxy: {
      "/api": {
        target: "http://localhost:8889", // 使用localhost连接本地后端
        changeOrigin: true,
      },
    },
  },
});
