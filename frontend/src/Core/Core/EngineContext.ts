import type { Application } from "pixi.js";
import type { Size } from "../Components";
import type { DSL } from "../DSL/DSL";
import type { Entity } from "../Entity/Entity";
import type { System } from "../System/System";
import type { DefaultConfig, StateStore } from "../types";
import type { Camera } from "./Camera";
// import { Engine } from "./Engine";

// Engine Context 接口定义
export interface EngineContext {
  camera: Camera;
  app: Application;
  isFirstInit: boolean;
  dirtyRender: boolean;
  dirtyOverlay: boolean;
  defaultConfig: Size;

  SystemMap: Map<string, System>;

  stateStore: StateStore;

  system: System[];

  entityManager: Entity;
  // createCanvas: (defaultConfig: DefaultConfig) => CanvasRenderingContext2D;
  createRenderEngine: (defaultConfig: DefaultConfig) => Promise<void>;
  initCanvas: (defaultConfig: DefaultConfig) => Promise<void>;
  update: () => void;
  destroyed: () => void;
  addSystem: (system: any) => void;
  getSystemByName: (name: string) => any;
}
