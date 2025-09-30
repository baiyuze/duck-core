import type { Core } from "../../Core";
import type { DSL } from "../../DSL/DSL";
import type { StateStore } from "../../types";
import { System } from "../System";

export class ImgRender extends System {
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
    if (!state) return;
    const { x, y } = state.position;
    const { width, height } = state.size;
    const imgComponent = state.img;
    if (!imgComponent || !imgComponent.src) return;
    const img = new Image();
    img.src = imgComponent.src;
    img.onload = () => {
      this.ctx.drawImage(img, x, y, width, height);
    };
  }
}
