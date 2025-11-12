import type { Canvas, Image } from "canvaskit-wasm";
import type { Engine } from "../../Core/Engine";
import type { DSL } from "../../DSL/DSL";
import type { StateStore } from "../../types";
import { System } from "../System";
import svgPathBounds from "svg-path-bounds";
// import { parseSVG } from "svg-path-parser";

export class ImgRender extends System {
  engine: Engine;
  ctx: CanvasRenderingContext2D;
  stateStore: StateStore | null = null;
  imgCache: Map<string, HTMLImageElement | Image> = new Map();
  imgDataCache: Map<string, Image> = new Map();
  constructor(ctx: CanvasRenderingContext2D, engine: Engine) {
    super();
    this.engine = engine;
    this.ctx = ctx;
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
    const size = this.getSvgSize(state.img.path);
    if (size) {
      const { scale } = this.getScale(
        nowWidth,
        nowHeight,
        size.width,
        size.height
      );
      this.ctx.scale(scale, scale);
      this.ctx.fill(p2d);
      this.ctx.stroke(p2d);
    }
  }

  async draw(entityId: string) {
    this.stateStore = this.engine.stateStore;
    if (!this.stateStore) return;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);

    if (!state) return;
    const { width, height } = state.size;
    const imgComponent = state.img;
    if (imgComponent.path) {
      return this.drawSvg(state as DSL);
    }
    if (!imgComponent || !imgComponent.src) return;
    try {
      const img = (await this.getImage(
        imgComponent.src,
        width,
        height
      )) as HTMLImageElement;
      this.ctx.drawImage(img, 0, 0, width, height);
    } catch (error) {
      console.error("Error loading image:", error);
    }
  }
  makeImage(img: HTMLImageElement) {
    const data = this.engine.ck.MakeImageFromCanvasImageSource(img);

    return data;
  }
  /**
   * 获取图片
   * @param url
   * @param width
   * @param height
   * @returns
   */
  async getImage(
    url: string,
    width: number,
    height: number,
    isOriginal: boolean = false
  ): Promise<HTMLImageElement | Image> {
    return new Promise<HTMLImageElement | Image>(async (resolve, reject) => {
      if (isOriginal && this.imgDataCache.has(url)) {
        const img = this.imgDataCache.get(url);
        return img && resolve(img);
      }
      if (this.imgCache.has(url)) {
        const img = this.imgCache.get(url);
        return img && resolve(img);
      }

      if (isOriginal) {
        const imgData = await fetch(url).then((r) => r.arrayBuffer());
        console.log("imgData", imgData);
        const img = this.engine.ck.MakeImageFromEncoded(imgData);
        if (img) {
          this.imgDataCache.set(url, img);
          return resolve(img);
        }
        return reject(null);
      }
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = url;
      // img.width = width;
      // img.height = height;
      img.onload = () => {
        this.imgCache.set(url, img);
        resolve(img);
      };
      console.log(img.width, img.height, "---");
      img.onerror = () => {
        reject(img);
      };
    });
  }
  /**
   * 获取图片
   * @param url
   * @param width
   * @param height
   * @returns
   */
  async getImageData(
    url: string,
    width: number,
    height: number
  ): Promise<Image> {
    return new Promise<Image>(async (resolve, reject) => {
      if (this.imgDataCache.has(url)) {
        const img = this.imgDataCache.get(url);
        return img && resolve(img);
      }

      const imgData = await fetch(url).then((r) => r.arrayBuffer());
      console.log("imgData", imgData);
      const img = this.engine.ck.MakeImageFromEncoded(imgData);
      if (img) {
        this.imgDataCache.set(url, img);
        return resolve(img);
      }
      return reject(null);
    });
  }
  draw1(entityId: string) {
    return new Promise<void>(async (resolve, reject) => {
      const canvas = this.engine.canvas as Canvas;
      this.stateStore = this.engine.stateStore;
      if (!this.stateStore) return;
      const state = this.getComponentsByEntityId(this.stateStore, entityId);

      if (!state) return;
      const { width, height } = state.size;
      const imgComponent = state.img;
      const ck = this.engine.ck;
      if (imgComponent.svg && imgComponent.path) {
        const path = new ck.Path();
        const svgPath = ck.Path.MakeFromSVGString(imgComponent.path);

        if (svgPath) {
          path.addPath(svgPath);
          const fillColor = state.color.fillColor;
          const strokeColor = state.color.strokeColor;

          if (fillColor) {
            const paint = new ck.Paint();
            paint.setColor(ck.parseColorString(fillColor));
            paint.setAntiAlias(true);
            canvas.drawPath(path, paint);
          }
          if (strokeColor && strokeColor !== "transparent") {
            const strokePaint = new ck.Paint();
            strokePaint.setColor(ck.parseColorString(strokeColor));
            strokePaint.setStyle(ck.PaintStyle.Stroke);
            strokePaint.setAntiAlias(true);
            canvas.drawPath(path, strokePaint);
          }
        }

        resolve();
        return;
      }
      if (!imgComponent || !imgComponent.src) return;
      try {
        const paint = new ck.Paint();
        const img = (await this.getImageData(
          imgComponent.src,
          width,
          height
        )) as Image;
        if (img) {
          const src = ck.XYWHRect(0, 0, img.width(), img.height());
          const dst = ck.XYWHRect(0, 0, width, height);
          canvas.drawImageRect(img, src, dst, paint);
        }
        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }
}
