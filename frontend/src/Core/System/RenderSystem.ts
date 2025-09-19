import type { Color, Position, Size } from "../Components";
import type { DSL } from "../DSL/DSL";
import { Entity } from "../Entity/Entity";
import type { ComponentStore } from "../types";
import { System } from "./System";

export class RenderSystem extends System {
  ctx: CanvasRenderingContext2D;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  constructor(ctx: CanvasRenderingContext2D) {
    super();
    this.ctx = ctx;
  }

  render(components: ComponentStore, ctx: CanvasRenderingContext2D) {
    // 每帧先清空画布
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 遍历所有 position 组件的实体
    components.position.forEach((pos, entityId) => {
      const size = components.size.get(entityId);
      const color = components.color.get(entityId);
      if (size && color) {
        // 只有 position + size + color 都存在的实体才渲染
        ctx.fillStyle = color.fillColor || "transparent";
        ctx.fillRect(pos.x, pos.y, size.width, size.height);
      }
    });
  }

  update(components: ComponentStore) {
    this.render(components, this.ctx);
  }
}
