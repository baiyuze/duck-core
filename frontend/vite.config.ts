import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteCompression from "vite-plugin-compression";

// https://vite.dev/config/

export default defineConfig({
  plugins: [
    react(),
    viteCompression({
      verbose: true, // 是否在控制台输出压缩结果
      disable: false, // 是否禁用
      threshold: 10240, // 体积大于 threshold 才会被压缩,单位 b
      algorithm: "gzip", // 压缩算法,可选 [ 'gzip' , 'brotliCompress' ,'deflate' , 'deflateRaw']
      ext: ".gz", // 生成的压缩包后缀
      deleteOriginFile: false, // 压缩后是否删除源文件
    }),
  ],
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
