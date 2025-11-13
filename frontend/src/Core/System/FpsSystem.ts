import type { Engine } from "../Core/Engine";
import type { StateStore } from "../types";
import { System } from "./System";

export class FpsSystem extends System implements System {
  private fpsHistory: number[] = [];
  private maxHistoryLength: number = 60;
  private minFps: number = Infinity;
  private maxFps: number = 0;
  private fpsSum: number = 0;
  private fpsCount: number = 0;
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;
  stateStore: StateStore | null = null;
  private lastFrameTime: number = performance.now();
  private updateTimeout: number = 1000; // 超过1秒没有更新则认为停止

  constructor(private engine: Engine) {
    super();
    this.createFPSText();
  }

  update(stateStore: StateStore) {
    this.stateStore = stateStore;
    this.calculateFPS();
  }

  private calculateFPS() {
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastFrameTime;

    // 如果超过超时时间没有更新，设置FPS为1
    if (deltaTime > this.updateTimeout) {
      this.updateFPSText(1);
      this.lastFrameTime = currentTime;
      return;
    }

    // 计算当前帧的FPS
    if (deltaTime > 0) {
      const fps = 1000 / deltaTime;
      this.updateFPSText(fps);
    }

    this.lastFrameTime = currentTime;
  }

  createFPSText() {
    // 创建容器
    const container = document.createElement("div");
    container.id = "fps-stats-container";
    container.style.position = "fixed";
    container.style.top = "4px";
    container.style.left = "4px";
    container.style.width = "70px";
    container.style.height = "38px";
    container.style.zIndex = "9999";
    container.style.fontFamily = "'Roboto Mono', 'Consolas', monospace";
    container.style.fontSize = "9px";
    container.style.fontWeight = "600";
    container.style.cursor = "pointer";
    container.style.userSelect = "none";
    container.style.background = "rgba(0, 0, 0, 0.85)";
    container.style.borderRadius = "4px";
    container.style.backdropFilter = "blur(10px)";
    container.style.border = "1px solid rgba(255, 255, 255, 0.1)";
    container.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
    container.style.padding = "4px";
    container.style.transition = "all 0.2s ease";

    // 添加 hover 效果
    container.addEventListener("mouseenter", () => {
      container.style.background = "rgba(0, 0, 0, 0.95)";
      container.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.5)";
    });
    container.addEventListener("mouseleave", () => {
      container.style.background = "rgba(0, 0, 0, 0.85)";
      container.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.3)";
    });

    // 创建顶部信息行
    const infoRow = document.createElement("div");
    infoRow.style.display = "flex";
    infoRow.style.justifyContent = "space-between";
    infoRow.style.alignItems = "center";
    infoRow.style.marginBottom = "3px";

    // 创建文本显示
    const textDom = document.createElement("span");
    textDom.id = "fps-text";
    textDom.style.color = "#00ffff";
    textDom.style.lineHeight = "1";
    textDom.style.fontSize = "8px";
    textDom.style.letterSpacing = "0.5px";
    textDom.style.textTransform = "uppercase";
    textDom.innerText = "FPS";

    // 创建数值显示
    const valueDom = document.createElement("span");
    valueDom.id = "fps-value";
    valueDom.style.color = "#00ffff";
    valueDom.style.fontSize = "13px";
    valueDom.style.lineHeight = "1";
    valueDom.style.fontWeight = "700";
    valueDom.style.textShadow = "0 0 6px currentColor";
    valueDom.innerText = "0";

    infoRow.appendChild(textDom);
    infoRow.appendChild(valueDom);

    // 创建 canvas 用于绘制图表
    this.canvas = document.createElement("canvas");
    this.canvas.id = "fps-graph";
    this.canvas.width = 124; // 增加分辨率用于更清晰的渲染
    this.canvas.height = 32;
    this.canvas.style.display = "block";
    this.canvas.style.width = "62px";
    this.canvas.style.height = "16px";
    this.canvas.style.borderRadius = "2px";
    this.canvas.style.overflow = "hidden";
    this.ctx = this.canvas.getContext("2d");

    container.appendChild(infoRow);
    container.appendChild(this.canvas);
    document.body.appendChild(container);

    // 初始化历史数据
    this.fpsHistory = new Array(this.maxHistoryLength).fill(0);
  }

  updateFPSText(fps: number) {
    // 更新统计数据
    this.minFps = Math.min(this.minFps, fps);
    this.maxFps = Math.max(this.maxFps, fps);
    this.fpsSum += fps;
    this.fpsCount++;

    // 更新历史数据
    this.fpsHistory.shift();
    this.fpsHistory.push(fps);

    // 更新数值显示
    const valueDom = document.getElementById("fps-value");
    if (valueDom) {
      const displayFps = Math.round(fps);
      valueDom.innerText = displayFps.toString();

      // 根据性能设置颜色
      let color = "#00ffff"; // 青色 (默认)
      if (fps >= 55) {
        color = "#00ff88"; // 翠绿色 (极佳)
      } else if (fps >= 45) {
        color = "#00ff00"; // 绿色 (好)
      } else if (fps >= 30) {
        color = "#ffcc00"; // 琥珀色 (一般)
      } else if (fps >= 20) {
        color = "#ff8800"; // 橙色 (较差)
      } else {
        color = "#ff3366"; // 粉红色 (差)
      }

      valueDom.style.color = color;
      valueDom.style.textShadow = `0 0 8px ${color}`;

      const textDom = document.getElementById("fps-text");
      if (textDom) {
        textDom.style.color = color;
      }
    }

    // 绘制图表
    this.drawGraph();
  }

  private drawGraph() {
    if (!this.ctx || !this.canvas) return;

    const width = this.canvas.width;
    const height = this.canvas.height;
    const maxFps = 60; // 假设最大 60 FPS

    // 清空画布，使用深色背景
    this.ctx.fillStyle = "rgba(10, 10, 15, 0.95)";
    this.ctx.fillRect(0, 0, width, height);

    // 绘制网格线
    this.ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
    this.ctx.lineWidth = 1;

    // 绘制水平参考线 (60 FPS, 30 FPS)
    this.ctx.beginPath();
    const y60 = height - (60 / maxFps) * height;
    this.ctx.moveTo(0, y60);
    this.ctx.lineTo(width, y60);

    const y30 = height - (30 / maxFps) * height;
    this.ctx.moveTo(0, y30);
    this.ctx.lineTo(width, y30);
    this.ctx.stroke();

    // 获取当前 FPS
    const currentFps = this.fpsHistory[this.fpsHistory.length - 1];

    // 绘制填充区域（先绘制，以便曲线在上面）
    this.ctx.beginPath();
    for (let i = 0; i < this.fpsHistory.length; i++) {
      const fps = this.fpsHistory[i];
      const x = (i / (this.maxHistoryLength - 1)) * width;
      const y = height - (Math.min(fps, maxFps) / maxFps) * height;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    // 填充区域
    this.ctx.lineTo(width, height);
    this.ctx.lineTo(0, height);
    this.ctx.closePath();

    // 根据性能创建渐变填充
    const gradient = this.ctx.createLinearGradient(0, 0, 0, height);
    if (currentFps >= 55) {
      gradient.addColorStop(0, "rgba(0, 255, 136, 0.4)");
      gradient.addColorStop(1, "rgba(0, 255, 136, 0)");
    } else if (currentFps >= 45) {
      gradient.addColorStop(0, "rgba(0, 255, 0, 0.4)");
      gradient.addColorStop(1, "rgba(0, 255, 0, 0)");
    } else if (currentFps >= 30) {
      gradient.addColorStop(0, "rgba(255, 204, 0, 0.4)");
      gradient.addColorStop(1, "rgba(255, 204, 0, 0)");
    } else if (currentFps >= 20) {
      gradient.addColorStop(0, "rgba(255, 136, 0, 0.4)");
      gradient.addColorStop(1, "rgba(255, 136, 0, 0)");
    } else {
      gradient.addColorStop(0, "rgba(255, 51, 102, 0.4)");
      gradient.addColorStop(1, "rgba(255, 51, 102, 0)");
    }

    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    // 绘制 FPS 曲线（在填充之上）
    this.ctx.beginPath();
    for (let i = 0; i < this.fpsHistory.length; i++) {
      const fps = this.fpsHistory[i];
      const x = (i / (this.maxHistoryLength - 1)) * width;
      const y = height - (Math.min(fps, maxFps) / maxFps) * height;

      if (i === 0) {
        this.ctx.moveTo(x, y);
      } else {
        this.ctx.lineTo(x, y);
      }
    }

    // 根据当前 FPS 设置曲线颜色和发光效果
    let strokeColor: string;
    if (currentFps >= 55) {
      strokeColor = "#00ff88";
    } else if (currentFps >= 45) {
      strokeColor = "#00ff00";
    } else if (currentFps >= 30) {
      strokeColor = "#ffcc00";
    } else if (currentFps >= 20) {
      strokeColor = "#ff8800";
    } else {
      strokeColor = "#ff3366";
    }

    // 添加发光效果
    this.ctx.shadowBlur = 4;
    this.ctx.shadowColor = strokeColor;
    this.ctx.strokeStyle = strokeColor;
    this.ctx.lineWidth = 2;
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
    this.ctx.stroke();

    // 重置阴影
    this.ctx.shadowBlur = 0;
  }

  destroyed() {
    const container = document.getElementById("fps-stats-container");
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }

    // 重置统计数据
    this.fpsHistory = [];
    this.minFps = Infinity;
    this.maxFps = 0;
    this.fpsSum = 0;
    this.fpsCount = 0;
    this.canvas = null;
    this.ctx = null;
  }
}
