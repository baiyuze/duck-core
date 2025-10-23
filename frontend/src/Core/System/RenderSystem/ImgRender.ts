import type { Engine } from "../../Core/Engine";
import type { DSL } from "../../DSL/DSL";
import type { StateStore } from "../../types";
import { System } from "../System";
import svgPathBounds from "svg-path-bounds";

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

  getSvgSize(path: string): { width: number; height: number } {
    const bounds = svgPathBounds(path);
    const width = bounds[2] - bounds[0];
    const height = bounds[3] - bounds[1];
    return { width, height };
  }

  getScale(
    nowWidth: number,
    nowHeight: number,
    svgWidth: number,
    svgHeight: number
  ): number {
    const scaleX = nowWidth / svgWidth;
    const scaleY = nowHeight / svgHeight;
    return Math.min(scaleX, scaleY);
  }

  async drawSvg(state: DSL) {
    if (!state.img?.path) return;
    const p2d = new Path2D(state.img.path);
    const { width: nowWidth, height: nowHeight } = state.size;
    if (state.color.fillColor) {
      this.ctx.fillStyle = state.color.fillColor;
    }
    if (state.color.strokeColor) {
      this.ctx.strokeStyle = state.color.strokeColor;
    }
    const { width, height } = this.getSvgSize(state.img.path);
    const scale = this.getScale(nowWidth, nowHeight, width, height);
    this.ctx.scale(scale, scale);
    this.ctx.fill(p2d);
    this.ctx.stroke(p2d);
  }

  draw(entityId: string) {
    this.stateStore = this.engine.stateStore;
    if (!this.stateStore) return;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);

    if (!state) return;
    // const { x, y } = state.position;
    const { width, height } = state.size;
    const imgComponent = state.img;
    if (imgComponent.path) {
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
