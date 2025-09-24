import type { Core } from "../Core";
import type { ComponentStore } from "../types";
import type { System } from "./System";

export class SelectionSystem implements System {
  core: Core;
  ctx: CanvasRenderingContext2D;
  components?: ComponentStore;
  constructor(ctx: CanvasRenderingContext2D, core: Core) {
    this.ctx = ctx;
    this.core = core;
  }

  render(components: ComponentStore, entityId: string) {
    const position = components.position.get(entityId);
    const size = components.size.get(entityId);
    if (position && size) {
      this.ctx.strokeStyle = "rgb(90, 132, 255)";
      this.ctx.lineWidth = 2;
      this.ctx.strokeRect(
        position.x - 2,
        position.y - 2,
        size.width + 4,
        size.height + 4
      );
    }
  }

  update(components: ComponentStore) {
    // 渲染之前应该清理之前的选中状态，而不是清理画布
    this.components = components;
    components.selected.forEach((selected, entityId) => {
      if (!selected.value) return;
      this.render(components, entityId);
    });

    components.selected.forEach((selected, entityId) => {
      if (!selected.hovered) return;
      this.render(components, entityId);
    });
  }
}
