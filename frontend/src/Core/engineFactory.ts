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

export async function createEngine(dsls: any[], defaultConfig: DefaultConfig) {
  const core = new Core(dsls);
  const engine = new Engine(core);

  // 初始化 canvas
  await engine.createRenderEngine(defaultConfig);

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

  return engine;
}
