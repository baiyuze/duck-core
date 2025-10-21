import type { Engine } from "../Core/Engine";
import type { DSL } from "../DSL/DSL";
import { Entity } from "../Entity/Entity";
import type { StateStore } from "../types";
import { System } from "./System";

export class RenderSystem extends System {
  engine: Engine;
  ctx: CanvasRenderingContext2D;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  constructor(ctx: CanvasRenderingContext2D, engine: Engine) {
    super();
    this.engine = engine;
    this.ctx = ctx;
  }

  render(stateStore: StateStore, ctx: CanvasRenderingContext2D) {
    // 每帧先清空画布
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 遍历所有 position 组件的实体
    stateStore.position.forEach((pos, entityId) => {
      const size = stateStore.size.get(entityId);
      const color = stateStore.color.get(entityId);
      if (size && color) {
        // 只有 position + size + color 都存在的实体才渲染
        ctx.fillStyle = color.fillColor || "transparent";
        ctx.fillRect(pos.x, pos.y, size.width, size.height);
      }
    });
  }

  update(stateStore: StateStore) {
    this.render(stateStore, this.ctx);
  }
}
