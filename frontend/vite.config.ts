import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import viteCompression from "vite-plugin-compression";
import { copyFileSync, existsSync, mkdirSync } from "fs";
import path, { join } from "path";
import dts from "vite-plugin-dts";

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
    // 复制 canvaskit-wasm 文件到 public 目录
    {
      name: "copy-canvaskit-wasm",
      buildStart() {
        const sourceDir = "node_modules/canvaskit-wasm/bin";
        const targetDir = "public/canvaskit";

        if (!existsSync(targetDir)) {
          mkdirSync(targetDir, { recursive: true });
        }

        const files = ["canvaskit.wasm", "canvaskit.js"];
        files.forEach((file) => {
          const source = join(sourceDir, file);
          const target = join(targetDir, file);
          if (existsSync(source)) {
            copyFileSync(source, target);
            console.log(`Copied ${file} to ${targetDir}`);
          }
        });
      },
    },
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
  // 确保 wasm 文件被正确处理
  assetsInclude: ["**/*.wasm"],
});
