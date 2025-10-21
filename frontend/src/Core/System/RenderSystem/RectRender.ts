import type { Engine } from "../../Core/Engine";
import type { DSL } from "../../DSL/DSL";
import type { StateStore } from "../../types";
import { System } from "../System";

export class RectRender extends System {
  engine: Engine;
  ctx: CanvasRenderingContext2D;
  stateStore: StateStore | null = null;
  constructor(ctx: CanvasRenderingContext2D, engine: Engine) {
    super();
    this.engine = engine;
    this.ctx = ctx;
  }
  draw(entityId: string) {
    this.stateStore = this.engine.stateStore;
    if (!this.stateStore) return;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);

    // const { x, y } = state.position;

    const { width, height } = state.size;
    const { fillColor, strokeColor } = state.color;

    this.ctx.fillStyle = fillColor || "transparent";
    this.ctx.strokeStyle = strokeColor || "transparent";
    this.ctx.strokeRect(0, 0, width, height);
    if (state.lineWidth.value) {
      this.ctx.lineWidth = state.lineWidth.value;
    }
    if (fillColor) this.ctx.fillRect(0, 0, width, height);
  }
}
