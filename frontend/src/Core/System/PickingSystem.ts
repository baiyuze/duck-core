import type { Color, Position, Size } from "../Components";
import type { DSL } from "../DSL/DSL";
import { Entity } from "../Entity/Entity";
import type { ComponentStore } from "../types";
import { System } from "./System";

export class PickingSystem extends System {
  ctx: CanvasRenderingContext2D;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  components: ComponentStore | null = null;
  constructor(ctx: CanvasRenderingContext2D) {
    super();
    this.ctx = ctx;
    this.initOffscreenCanvas();
    ctx.canvas.addEventListener("click", this.onClick.bind(this));
  }

  initOffscreenCanvas() {
    const { width, height } = this.ctx.canvas;
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    this.offCtx = offscreenCanvas.getContext("2d");
    return offscreenCanvas;
  }

  render(components: ComponentStore, ctx: CanvasRenderingContext2D) {
    // 每帧先清空画布
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 遍历所有 position 组件的实体
    components.position.forEach((pos, entityId) => {
      const size = components.size.get(entityId);
      // 离屏渲染颜色
      const fillColor = this.entityManager.getColorById(entityId);
      ctx.fillStyle = fillColor;
      if (size) {
        ctx.fillRect(pos.x, pos.y, size.width, size.height);
      }
    });
  }

  update(components: ComponentStore) {
    this.components = components;
  }
  onClick(event: MouseEvent) {
    if (!this.offCtx) return;
    this.render(this?.components!, this.offCtx);
    const rect = this.ctx.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const pixel: ImageData = this.offCtx.getImageData(x, y, 1, 1);
    const [r, g, b, a] = pixel.data;
    console.log([r, g, b, a], x, y, pixel, "---");
    if (a === 0) {
      console.log("点击到了空白区域");
      return;
    }
    const colorId = `${r},${g},${b}`;
    console.log(colorId, "colorId");
    // 根据颜色获取实体id
    // const entityId = this.entityManager.getIdByColor(colorId);
  }
}
