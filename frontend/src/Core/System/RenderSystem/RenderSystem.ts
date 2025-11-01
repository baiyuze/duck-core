import type { Color, Position, Size } from "../../Components";
import type { Engine } from "../../Core/Engine";
import { DSL } from "../../DSL/DSL";
import { Entity } from "../../Entity/Entity";
import { ShapeType } from "../../enum";
import type { StateStore } from "../../types";
import { System } from "../System";
import renderRegistry from "./renderRegistry";

export class RenderSystem extends System {
  engine: Engine;
  ctx: CanvasRenderingContext2D;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  renderMap = new Map<string, System>();
  private animationId: number | null = null;
  private pendingRender = false;

  // FPS 相关属性
  private fps = 0;
  private frameCount = 0;
  private lastTime = performance.now();
  private showFPS = true; // 控制是否显示 FPS

  constructor(ctx: CanvasRenderingContext2D, engine: Engine) {
    super();
    this.engine = engine;
    this.ctx = ctx;
    this.initRenderMap();
  }

  initRenderMap() {
    Object.entries(renderRegistry).forEach(([key, SystemClass]) => {
      this.renderMap.set(key, new SystemClass(this.ctx, this.engine));
    });
  }

  drawShape(stateStore: StateStore, entityId: string) {
    const type = stateStore.type.get(entityId);
    if (!type) return;
    this.renderMap.get(type)?.draw(entityId);
    this.renderMap.get(type)?.draw1(entityId);
  }

  /**
   * 计算 FPS
   */
  private calculateFPS() {
    this.frameCount++;
    const currentTime = performance.now();
    const deltaTime = currentTime - this.lastTime;

    // 每秒更新一次 FPS
    if (deltaTime >= 1000) {
      this.fps = Math.round((this.frameCount * 1000) / deltaTime);
      this.frameCount = 0;
      this.lastTime = currentTime;
    }
  }

  /**
   * 绘制 FPS 显示
   */
  private drawFPS(ctx: CanvasRenderingContext2D) {
    if (!this.showFPS) return;

    ctx.save();
    ctx.resetTransform(); // 重置变换矩阵，确保 FPS 显示在固定位置

    // 设置文本样式
    ctx.font = "16px Arial";
    ctx.fillStyle = "#237d23ff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;

    const text = `FPS: ${this.fps}`;
    const x = 10;
    const y = 25;

    // 绘制文本描边
    ctx.strokeText(text, x, y);
    // 绘制文本填充
    ctx.fillText(text, x, y);

    ctx.restore();
  }

  render(stateStore: StateStore, ctx: CanvasRenderingContext2D) {
    // 每帧先清空画布
    const size = this.engine.defaultConfig;
    ctx.clearRect(0, 0, size.width, size.height);
    ctx.save();
    ctx.translate(this.engine.camera.translateX, this.engine.camera.translateY);
    ctx.scale(this.engine.camera.zoom, this.engine.camera.zoom);

    // 遍历所有 position 组件的实体
    stateStore.position.forEach((pos, entityId) => {
      ctx.save();
      const { x, y } = pos as Position;
      ctx.translate(x, y);
      // 中心原点应该是图形的中心点
      this.drawShape(stateStore, entityId);
      ctx.restore();
    });
    ctx.restore();
  }

  /**
   * 渲染
   * ToDo 需要优化当在选中区时，也要停止更新update
   * @param stateStore
   */
  private scheduleRender = (stateStore: StateStore) => {
    if (this.pendingRender) return;

    this.pendingRender = true;
    this.animationId = requestAnimationFrame(() => {
      // 计算 FPS
      this.calculateFPS();
      this.render(stateStore, this.ctx);
      // 绘制 FPS 显示
      this.drawFPS(this.ctx);
      this.pendingRender = false;
    });
  };

  /**
   * 切换 FPS 显示
   */
  toggleFPS(show?: boolean) {
    this.showFPS = show !== undefined ? show : !this.showFPS;
  }

  update(stateStore: StateStore) {
    this.scheduleRender(stateStore);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
