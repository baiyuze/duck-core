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
import type { Size } from "./Components";
import { ZoomSystem } from "./System/ZoomSystem";
import { ScrollSystem } from "./System/ScrollSystem";

export function createEngine(
  dsls: any[],
  canvas: HTMLCanvasElement,
  defaultSize: Size
) {
  const core = new Core(dsls);
  const engine = new Engine(core);

  // 初始化 canvas
  const ctx = engine.initCanvas(canvas, defaultSize);

  engine.addSystem(new PickingSystem(ctx, engine));
  engine.addSystem(new HoverSystem(ctx, engine));
  engine.addSystem(new ClickSystem(ctx, engine));
  engine.addSystem(new SelectionSystem(ctx, engine));
  engine.addSystem(new EventSystem(ctx, engine));
  engine.addSystem(new InputSystem(ctx, engine));
  engine.addSystem(new DragSystem(ctx, engine));
  engine.addSystem(new ZoomSystem(ctx, engine));
  engine.addSystem(new ScrollSystem(ctx, engine));
  engine.addSystem(new RenderSystem(ctx, engine));

  return engine;
}
