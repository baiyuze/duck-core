import type { Core } from "../../Core";
import type { DSL } from "../../DSL/DSL";
import type { StateStore } from "../../types";
import { System } from "../System";

export class EllipseRender extends System {
  core: Core;
  ctx: CanvasRenderingContext2D;
  stateStore: StateStore | null = null;
  constructor(ctx: CanvasRenderingContext2D, core: Core) {
    super();
    this.core = core;
    this.ctx = ctx;
    this.stateStore = core.stateStore;
  }
  draw(entityId: string) {
    if (!this.stateStore) return;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);

    const { x, y } = state.position;
    const { width, height } = state.size;
    const { fillColor, strokeColor } = state.color;
    this.ctx.fillStyle = fillColor || "transparent";
    this.ctx.beginPath();
    this.ctx.ellipse(
      x + width / 2,
      y + height / 2,
      width / 2,
      height / 2,
      (state.rotation.value * Math.PI) / 180,
      0,
      2 * Math.PI
    );
    this.ctx.fill();
    this.ctx.strokeStyle = strokeColor || "transparent"; // 可以是颜色字符串、渐变、模式等
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    this.ctx.closePath();
  }
}
