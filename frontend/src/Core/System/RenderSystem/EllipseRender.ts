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
  }
  draw(entityId: string) {
    this.stateStore = this.core.stateStore;
    if (!this.stateStore) return;

    const state = this.getComponentsByEntityId(this.stateStore, entityId);

    // const { x, y } = state.position;
    // const { rx, ry } = state.ellipseRadius;
    const { width, height } = state.size;
    const { fillColor, strokeColor } = state.color;
    this.ctx.beginPath();
    this.ctx.ellipse(
      width / 2,
      height / 2,
      width / 2, // 水平半径
      height / 2, // 垂直半径
      0, // 旋转角度
      0,
      2 * Math.PI
    );
    this.ctx.strokeStyle = strokeColor || "transparent"; // 可以是颜色字符串、渐变、模式等
    this.ctx.stroke();
    this.ctx.fillStyle = fillColor || "transparent";
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.closePath();
  }
}
