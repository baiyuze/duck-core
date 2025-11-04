import { Assets, Graphics, Sprite, Texture } from "pixi.js";
import type { Engine } from "../../Core/Engine";
import type { DSL } from "../../DSL/DSL";
import type { StateStore } from "../../types";
import { System } from "../System";
import svgPathBounds from "svg-path-bounds";

export class ImgRender extends System {
  engine: Engine;
  stateStore: StateStore | null = null;
  imgCache: Map<string, HTMLImageElement> = new Map();
  constructor(engine: Engine) {
    super();
    this.engine = engine;
  }

  getSvgSize(path: string): { width: number; height: number } | null {
    try {
      const bounds = svgPathBounds(path);
      const width = bounds[2] - bounds[0];
      const height = bounds[3] - bounds[1];
      return { width, height };
    } catch (error) {
      return null;
    }
  }

  getScale(
    nowWidth: number,
    nowHeight: number,
    svgWidth: number,
    svgHeight: number
  ): { scaleX: number; scaleY: number; scale: number } {
    const scaleX = nowWidth / svgWidth;
    const scaleY = nowHeight / svgHeight;
    const minScale = Math.min(scaleX, scaleY) - 0.2;
    const scale = minScale <= 0 ? Math.min(scaleX, scaleY) : minScale;
    return { scaleX, scaleY, scale };
  }

  async draw(entityId: string) {
    this.stateStore = this.engine.stateStore;
    // if (!this.stateStore) return;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);
    const { img, size } = state;
    let graphics;

    // SVG渲染
    if (img.svg) {
      graphics = this.graphicsMap.get(entityId) as Graphics;
      if (!graphics) {
        graphics = new Graphics();
        this.graphicsMap.set(entityId, graphics);
      }

      if (!this.isPositionDirty(entityId, state)) return;
      graphics.position.set(state.position.x, state.position.y);

      if (!this.isGeometryDirty(entityId, state)) return;
      graphics.svg(img.svg);
      graphics.width = size.width;
      graphics.height = size.height;
      this.engine.addChild(graphics);
      return;
    }
    // 图片
    if (img.src) {
      graphics = this.graphicsMap.get(entityId) as Sprite;
      if (!graphics) {
        const texture = await Assets.load(img.src);
        graphics = new Sprite(texture);
        this.graphicsMap.set(entityId, graphics);
      }
      if (!this.isPositionDirty(entityId, state)) return;
      graphics.position.set(state.position.x, state.position.y);

      if (!this.isGeometryDirty(entityId, state)) return;
      graphics.width = size.width;
      graphics.height = size.height;
      this.engine.addChild(graphics);
    }
  }
}
