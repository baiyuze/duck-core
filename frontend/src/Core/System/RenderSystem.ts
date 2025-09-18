import type { Color, Position, Size } from "../Components";
import type { DSL } from "../DSL/DSL";
import type { ComponentStore } from "../types";
import { System } from "./System";

export class RenderSystem extends System {
  ctx: CanvasRenderingContext2D;
  constructor(ctx: CanvasRenderingContext2D) {
    super();
    this.ctx = ctx;
  }

  update(components: ComponentStore) {
    // 每帧先清空画布
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

    // 遍历所有 position 组件的实体
    components.position.forEach((pos, entityId) => {
      const size = components.size.get(entityId);
      const color = components.color.get(entityId);

      // 只有 position + size + color 都存在的实体才渲染
      if (size && color) {
        this.ctx.fillStyle = color.fillColor || "transparent";
        this.ctx.fillRect(pos.x, pos.y, size.width, size.height);
      }
    });
  }
}
