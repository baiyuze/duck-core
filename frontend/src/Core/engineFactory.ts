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

export async function createEngine(dsls: any[], defaultConfig: DefaultConfig) {
  const core = new Core(dsls);
  const engine = new Engine(core);

  // 初始化 canvas
  const ctx = await engine.initCanvas(defaultConfig);

  engine.addSystem(new PickingSystem(ctx, engine));
  engine.addSystem(new HoverSystem(ctx, engine));
  engine.addSystem(new ClickSystem(ctx, engine));
  engine.addSystem(new EventSystem(ctx, engine));
  engine.addSystem(new InputSystem(ctx, engine));
  engine.addSystem(new DragSystem(ctx, engine));
  engine.addSystem(new ZoomSystem(ctx, engine));
  engine.addSystem(new ScrollSystem(ctx, engine));
  engine.addSystem(new RenderSystem(ctx, engine));
  engine.addSystem(new SelectionSystem(ctx, engine));

  return engine;
}

export async function createCanvasKit() {
  let CanvasKit;
  const locateFile = (url: string, file: string) => {
    return url + file;
  };

  try {
    CanvasKit = await CanvasKitInit({
      locateFile: (file) =>
        locateFile(
          "https://cdn.bootcdn.net/ajax/libs/canvaskit-wasm/0.40.0/",
          file
        ),
    });
  } catch (error) {
    const url =
      import.meta.env?.MODE === "production"
        ? "/design/canvaskit/"
        : "/node_modules/canvaskit-wasm/bin/";
    CanvasKit = await CanvasKitInit({
      locateFile: (file) => locateFile(url, file),
    });
    return CanvasKit;
  }

  return CanvasKit;
}
