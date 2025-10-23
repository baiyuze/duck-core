import { Canvg } from "canvg";
import type { Engine } from "../../Core/Engine";
import type { DSL } from "../../DSL/DSL";
import type { StateStore } from "../../types";
import { System } from "../System";

export class ImgRender extends System {
  engine: Engine;
  ctx: CanvasRenderingContext2D;
  stateStore: StateStore | null = null;
  imgCache: Map<string, HTMLImageElement> = new Map();
  constructor(ctx: CanvasRenderingContext2D, engine: Engine) {
    super();
    this.engine = engine;
    this.ctx = ctx;
  }

  async drawSvg(state: DSL) {
    if (!state.img?.svgContent) return;
    const canvg = await Canvg.fromString(this.ctx, state.img.svgContent);
    await canvg.render();
  }

  draw(entityId: string) {
    this.stateStore = this.engine.stateStore;
    if (!this.stateStore) return;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);

    if (!state) return;
    // const { x, y } = state.position;
    const { width, height } = state.size;
    const imgComponent = state.img;
    if (imgComponent.svgContent) {
      return this.drawSvg(state as DSL);
    }
    if (!imgComponent || !imgComponent.src) return;
    if (this.imgCache.has(imgComponent.src)) {
      const cachedImg = this.imgCache.get(imgComponent.src);
      if (cachedImg) {
        this.ctx.drawImage(cachedImg, 0, 0, width, height);
      }
      return;
    }
    const img = new Image();
    img.src = imgComponent.src;
    img.onload = () => {
      this.ctx.drawImage(img, 0, 0, width, height);
      this.imgCache.set(img.src, img);
    };
  }
}
