import type {
  Canvas,
  EmbindEnumEntity,
  Image,
  Paint,
  Path,
} from "canvaskit-wasm";
import type { Engine } from "../../../../Core/Engine";
import type { DSL } from "../../../../DSL/DSL";
import type { StateStore } from "../../../../types";
import { System } from "../../../System";
import svgPathBounds from "svg-path-bounds";
// import { parseSVG } from "svg-path-parser";

export class ImgRender extends System {
  engine: Engine;
  stateStore: StateStore | null = null;
  imgDataCache: Map<string, Image> = new Map();
  paint: Paint;
  path: Path;
  constructor(engine: Engine) {
    super();
    this.engine = engine;
    this.paint = new this.engine.ck.Paint();
    this.path = new this.engine.ck.Path();
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
  async getImageData(url: string): Promise<Image> {
    return new Promise<Image>(async (resolve, reject) => {
      if (this.imgDataCache.has(url)) {
        const img = this.imgDataCache.get(url);
        return img && resolve(img);
      }

      const imgData = await fetch(url).then((r) => r.arrayBuffer());
      const img = this.engine.ck.MakeImageFromEncoded(imgData);
      if (img) {
        this.imgDataCache.set(url, img);
        return resolve(img);
      }
      return reject(null);
    });
  }
  setPaintStyle(colorType: EmbindEnumEntity, color: string) {
    const ck = this.engine.ck;
    const paint = this.paint;
    paint.setStyle(colorType);
    paint.setColor(ck.parseColorString(color));
    paint.setAntiAlias(true);
    return paint;
  }
  draw(entityId: string) {
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
        this.path.reset();
        const path = this.path;
        const svgPath = ck.Path.MakeFromSVGString(imgComponent.path);

        if (svgPath) {
          path.addPath(svgPath);
          const fillColor = state.color.fillColor;
          const strokeColor = state.color.strokeColor;
          if (fillColor && fillColor !== "transparent") {
            const paint = this.setPaintStyle(ck.PaintStyle.Fill, fillColor);
            canvas.drawPath(path, paint);
          }
          if (strokeColor && strokeColor !== "transparent") {
            const paint = this.setPaintStyle(ck.PaintStyle.Stroke, strokeColor);
            canvas.drawPath(path, paint);
          }
          svgPath.delete();
        }

        resolve();
        return;
      }
      if (!imgComponent || !imgComponent.src) return;
      try {
        const paint = this.paint;
        const img = (await this.getImageData(imgComponent.src)) as Image;
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
  destroyed(): void {
    this.paint.delete();
    this.path.delete();
    this.imgDataCache.forEach((img) => {
      img.delete();
    });
    this.imgDataCache.clear();
  }
}
