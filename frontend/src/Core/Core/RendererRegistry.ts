// import { TextRender } from "./canvaskit/TextRender";
// import { TextRender as CanvasTextRender } from "./canvas/TextRender";
// import { EllipseRender } from "./canvaskit/EllipseRender";
// import { RectRender } from "./canvaskit/RectRender";
// import { ImgRender } from "./canvaskit/ImgRender";
// import { ShapeType } from "../../enum";
// import { PolygonRender } from "./canvaskit/PolygonRender";

import type { System } from "../System/System";
import type { RendererPromise, SystemConstructor } from "../types";

interface RendererMgr {
  name: string;
  desc?: string;
  renderer: RendererPromise;
}

export class RendererRegistry {
  constructor() {
    this.initRenderer();
  }
  /**
   * 渲染器管理
   */
  private rendererMgr: RendererMgr[] = [];
  /**
   * 注册渲染器
   * @param renderer
   */
  register(renderer: RendererMgr) {
    this.rendererMgr.push(renderer);
  }
  /**
   * 初始化渲染器
   */
  initRenderer() {
    const rendererMap = import.meta.glob(
      "../System/RenderSystem/Renderer/**/index.ts",
      { eager: true }
    );
    const rendererArray = Object.entries(rendererMap);
    rendererArray.forEach(([path, resolver]) => {
      this.rendererMgr.push({
        name: path,
        renderer: resolver as RendererPromise,
      });
    });
  }
  /**
   * 获取渲染器
   * @param type 渲染器类型
   * @returns RendererMgr | undefined
   */
  getRenderers(type?: string): RendererMgr | undefined {
    if (type) {
      return this.rendererMgr.find((mgr) => mgr.name.includes(type));
    }
    throw new Error("Renderer type is required");
  }
}
