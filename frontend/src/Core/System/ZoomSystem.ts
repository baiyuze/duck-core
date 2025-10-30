import type { Engine } from "../Core/Engine";
import type { DSL } from "../DSL/DSL";
import { Entity } from "../Entity/Entity";
import type { StateStore } from "../types";
import { System } from "./System";

export class ZoomSystem extends System {
  engine: Engine;
  ctx: CanvasRenderingContext2D;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  constructor(ctx: CanvasRenderingContext2D, engine: Engine) {
    super();
    this.engine = engine;
    this.ctx = ctx;
  }

  update(stateStore: StateStore) {
    if (stateStore.eventQueue.length === 0) return;
    this.engine.camera.isZooming = false;

    const { type, event } =
      stateStore.eventQueue[stateStore.eventQueue.length - 1];

    // 确保只有缩放事件会触发缩放逻辑
    if (type !== "zoom" || !(event instanceof WheelEvent)) return;

    const camera = this.engine.camera;
    const rect = this.ctx.canvas.getBoundingClientRect();
    const { deltaY, x, y } = event; // x,y: 鼠标坐标
    const delta = deltaY ?? 0;
    const prevZoom = camera.zoom;
    const sensitivity = Math.max(0.1, 1 - prevZoom * 0.05);
    const scale = 1 - delta * 0.001 * sensitivity;
    const canvasX = x - rect.left;
    const canvasY = y - rect.top;
    // 限制 zoom 范围
    const newZoom = Math.min(
      camera.maxZoom,
      Math.max(camera.minZoom, prevZoom * scale)
    );

    if (newZoom === prevZoom) {
      this.engine.camera.isZooming = false;
      return;
    }

    // 缩放围绕鼠标点
    camera.translateX =
      // canvas x，减去 当前坐标原点在画布上的位置 乘以 新旧缩放比
      canvasX - (canvasX - camera.translateX) * (newZoom / prevZoom);
    camera.translateY =
      canvasY - (canvasY - camera.translateY) * (newZoom / prevZoom);

    camera.zoom = newZoom;

    // 标记需要渲染
    this.engine.camera.isZooming = true;
    this.engine.dirtyRender = true;
  }
}
