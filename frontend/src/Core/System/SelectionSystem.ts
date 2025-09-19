import type { ComponentStore } from "../types";
import type { System } from "./System";

export class SelectionSystem implements System {
  ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  update(components: ComponentStore) {
    components.selected.forEach((selected, entityId) => {
      if (!selected.value) return;

      const pos = components.position.get(entityId);
      const size = components.size.get(entityId);
      if (pos && size) {
        this.ctx.strokeStyle = "rgb(90, 132, 255)";
        this.ctx.lineWidth = 2;
        this.ctx.strokeRect(
          pos.x - 2,
          pos.y - 2,
          size.width + 4,
          size.height + 4
        );
      }
    });
  }
}
