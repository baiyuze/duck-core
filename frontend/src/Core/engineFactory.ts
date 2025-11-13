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

export async function createEngine(dsls: any[], defaultConfig: DefaultConfig) {
  const core = new Core(dsls);
  const engine = new Engine(core);

  // 初始化 canvas
  await engine.initCanvasKit(defaultConfig);

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

  return engine;
}

export async function createCanvasKit() {
  const CanvasKit = await initCanvasKit();
  const fontMgr = await loadFonts(CanvasKit);

  return { CanvasKit, fontMgr };
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
    fetch("https://cdn.skia.org/misc/Roboto-Regular.ttf").then((response) =>
      response.arrayBuffer()
    ),
    fetch(`${fontsBase}NotoSansSC-VariableFont_wght_2.ttf`).then((response) =>
      response.arrayBuffer()
    ),
  ]);

  return CanvasKit.FontMgr.FromData(robotoFont, notoSansFont);
}
