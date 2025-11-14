import { RendererRegistry } from "./RendererRegistry";
import type { SystemConstructor } from "../types";

export class RendererManager {
  rendererName: string = "Canvaskit";
  rendererMgr: RendererRegistry = new RendererRegistry();
  renderer: {
    [key: string]: SystemConstructor;
  } = {};

  async setRenderer(name: string) {
    const manage = this.rendererMgr.getRenderers(name);
    if (manage) {
      const module = manage.renderer;
      this.renderer = module.default;
    }
  }
}
