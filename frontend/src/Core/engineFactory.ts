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
import CanvasKitInit, { type CanvasKit } from "canvaskit-wasm";
import { FpsSystem } from "./System/FpsSystem";

let canvasKitPromise: Promise<CanvasKit> | null = null;

export function createCanvasRenderer(engine: Engine) {
  const createCanvas = (config: DefaultConfig) => {
    const { canvasDom, dpr } = createCanvasDom(config);
    const ctx = canvasDom.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    canvasDom.style.zIndex = "10";
    canvasDom.style.position = "absolute";
    canvasDom.style.top = "0";
    canvasDom.style.left = "0";
    config.container?.appendChild?.(canvasDom);
    ctx.scale(dpr, dpr);
    return {
      canvasDom,
      canvas: ctx,
      ctx,
    };
  };

  const initCanvasKit = async (config: DefaultConfig) => {
    const { CanvasKit, FontMgr } = await createCanvasKit();

    const { dpr, canvasDom } = createCanvasDom(config);
    canvasDom.id = "canvasKitCanvas";
    canvasDom.style.zIndex = "10";
    canvasDom.style.position = "absolute";
    canvasDom.style.top = "0";
    canvasDom.style.left = "0";
    config.container?.appendChild?.(canvasDom);
    const surface = CanvasKit.MakeWebGLCanvasSurface(
      "canvasKitCanvas",
      CanvasKit.ColorSpace.SRGB,
      {
        alpha: 1,
      }
    );
    const canvas = surface!.getCanvas();
    canvas.scale(dpr, dpr);
    return {
      canvasDom,
      surface,
      canvas,
      FontMgr,
      ck: CanvasKit,
    };
  };

  return {
    createCanvas2D: createCanvas,
    createCanvasKitSkia: initCanvasKit,
  };
}

export function createCanvasDom(config: DefaultConfig) {
  const canvasDom = document.createElement("canvas");
  const dpr = window.devicePixelRatio || 1;
  canvasDom.style.width = config.width + "px";
  canvasDom.style.height = config.height + "px";
  canvasDom.width = config.width * dpr;
  canvasDom.height = config.height * dpr;

  return { canvasDom, dpr };
}

export async function createCanvasKit() {
  const CanvasKit = await initCanvasKit();
  const FontMgr = await loadFonts(CanvasKit);

  return { CanvasKit, FontMgr };
}

function initCanvasKit(): Promise<CanvasKit> {
  if (canvasKitPromise) {
    return canvasKitPromise;
  }

  const cdnUrl =
    "https://cdn.bootcdn.net/ajax/libs/canvaskit-wasm/0.40.0/";
  const localUrl =
    import.meta.env?.MODE === "production"
      ? "/design/canvaskit/"
      : "/node_modules/canvaskit-wasm/bin/";

  const load = async (prefix: string): Promise<CanvasKit> => {
    const wasmUrl = `${prefix}canvaskit.wasm`;
    const response = await fetch(wasmUrl);

    if (!response.ok) {
      throw new Error(
        `CanvasKit WASM 加载失败：${response.status} ${response.statusText}`
      );
    }

    // 公共 CDN 的 MIME 类型可能不是 application/wasm。
    // 先读取二进制再交给 CanvasKit，避免流式编译失败后重复请求。
    const wasmBinary = await response.arrayBuffer();

    return CanvasKitInit({
      wasmBinary,
      locateFile: (file: string) => `${prefix}${file}`,
    } as any);
  };

  canvasKitPromise = load(cdnUrl).catch((cdnError) => {
    console.warn(
      "CanvasKit CDN 加载失败，正在切换到本地资源：",
      cdnError
    );
    return load(localUrl);
  });

  // CDN 和本地都失败时允许后续调用重新尝试。
  canvasKitPromise.catch(() => {
    canvasKitPromise = null;
  });

  return canvasKitPromise;
}

async function loadFonts(CanvasKit: CanvasKit) {
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

export async function createEngine(dsls: any[], config: DefaultConfig) {
  const core = new Core(dsls);
  const mode = config.mode || "Canvaskit";
  const engine = new Engine(core, mode);
  const { createCanvas2D, createCanvasKitSkia } = createCanvasRenderer(engine);
  const map: {
    [key: string]: () => Promise<void>;
  } = {
    Canvaskit: async () => {
      const canvasInfo = await createCanvasKitSkia(config);
      engine.setEngine(canvasInfo, config);
    },
    Canvas2D: async () => {
      const canvasInfo = createCanvas2D(config);
      engine.setEngine(canvasInfo, config);
    },
  };
  const render = map[mode];
  await render?.();
  createSystem(engine);

  return engine;
}
