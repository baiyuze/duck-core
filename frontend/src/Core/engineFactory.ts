// engineFactory.ts

import { HoverSystem } from "./System/HoverSystem";
import { ClickSystem } from "./System/ClickSystem";
import { SelectionSystem } from "./System/SelectionSystem";
import { EventSystem } from "./System/EventSystem";
import { InputSystem } from "./System/InputSytem";
import { Core } from "./Core/Core";
import { Engine } from "./Core/Engine";
import { RenderSystem } from "./System/RenderSystem/RenderSystem";
import { PickingSystem } from "./System/PickingSystem";
import { DragSystem } from "./System/DragSystem";
import { ZoomSystem } from "./System/ZoomSystem";
import { ScrollSystem } from "./System/ScrollSystem";
import type { DefaultConfig } from "./types";
import CanvasKitInit from "canvaskit-wasm";
import { FpsSystem } from "./System/FpsSystem";

export function createCanvasRenderer(engine: Engine) {
  const createCanvas = (defaultConfig: DefaultConfig) => {
    const canvas = document.createElement("canvas");
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = defaultConfig.width + "px";
    canvas.style.height = defaultConfig.height + "px";
    canvas.width = defaultConfig.width * dpr;
    canvas.height = defaultConfig.height * dpr;
    defaultConfig.container.appendChild(canvas);
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    ctx.scale(dpr, dpr);
    return {
      canvasDom: canvas,
      canvas: ctx,
      ctx,
    };
  };

  const initCanvasKit = async (defaultConfig: DefaultConfig) => {
    const { CanvasKit, FontMgr } = await createCanvasKit();
    const canvasDom = document.createElement("canvas") as HTMLCanvasElement;
    const dpr = window.devicePixelRatio || 1;
    canvasDom.style.width = defaultConfig.width + "px";
    canvasDom.style.height = defaultConfig.height + "px";
    canvasDom.width = defaultConfig.width * dpr;
    canvasDom.height = defaultConfig.height * dpr;
    canvasDom.id = "canvasKitCanvas";
    defaultConfig.container.appendChild(canvasDom);
    const surface = CanvasKit.MakeWebGLCanvasSurface("canvasKitCanvas");
    const canvas = surface!.getCanvas();
    canvas.scale(dpr, dpr);

    return {
      canvasDom,
      surface,
      canvas: canvas,
      FontMgr: FontMgr,
      ck: CanvasKit,
    };
  };
  return {
    createCanvas2D: createCanvas,
    createCanvasKitSkia: initCanvasKit,
  };
}

export async function createCanvasKit() {
  const CanvasKit = await initCanvasKit();
  const FontMgr = await loadFonts(CanvasKit);

  return { CanvasKit, FontMgr };
}

async function initCanvasKit() {
  const cdnUrl = "https://cdn.bootcdn.net/ajax/libs/canvaskit-wasm/0.40.0/";
  const localUrl =
    import.meta.env?.MODE === "production"
      ? "/design/canvaskit/"
      : "/node_modules/canvaskit-wasm/bin/";

  try {
    return await CanvasKitInit({
      locateFile: (file) => cdnUrl + file,
    });
  } catch (error) {
    return await CanvasKitInit({
      locateFile: (file) => localUrl + file,
    });
  }
}

async function loadFonts(CanvasKit: any) {
  const fontsBase =
    import.meta.env?.MODE === "production" ? "/design/fonts/" : "/fonts/";

  const [robotoFont, notoSansFont] = await Promise.all([
    fetch(`${fontsBase}Roboto-Regular.ttf`).then((response) =>
      response.arrayBuffer()
    ),
    fetch(`${fontsBase}NotoSansSC-VariableFont_wght_2.ttf`).then((response) =>
      response.arrayBuffer()
    ),
  ]);

  return CanvasKit.FontMgr.FromData(robotoFont, notoSansFont);
}

export const createSystem = (engine: Engine) => {
  engine.addSystem(new PickingSystem(engine));
  engine.addSystem(new HoverSystem(engine));
  engine.addSystem(new ClickSystem(engine));
  engine.addSystem(new EventSystem(engine));
  engine.addSystem(new InputSystem(engine));
  engine.addSystem(new DragSystem(engine));
  engine.addSystem(new ZoomSystem(engine));
  engine.addSystem(new ScrollSystem(engine));
  engine.addSystem(new RenderSystem(engine));
  engine.addSystem(new SelectionSystem(engine));
  engine.addSystem(new FpsSystem(engine));
};

export async function createEngine(dsls: any[], defaultConfig: DefaultConfig) {
  const core = new Core(dsls);
  const rendererName = defaultConfig.rendererName || "Canvaskit";
  const engine = new Engine(core, rendererName);
  const { createCanvas2D, createCanvasKitSkia } = createCanvasRenderer(engine);
  const map: {
    [key: string]: () => Promise<void>;
  } = {
    Canvaskit: async () => {
      const canvasInfo = await createCanvasKitSkia(defaultConfig);
      engine.setEngine(canvasInfo);
    },
    Canvas2D: async () => {
      const canvasInfo = createCanvas2D(defaultConfig);
      engine.setEngine(canvasInfo);
    },
  };
  const render = map[rendererName];
  await render?.();
  createSystem(engine);

  return engine;
}
