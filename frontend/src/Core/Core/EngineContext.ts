import type { Size } from "../Components";
import type { DSL } from "../DSL/DSL";
import type { Entity } from "../Entity/Entity";
import type { System } from "../System/System";
import type { CanvasInfo, DefaultConfig, StateStore } from "../types";
import type { Camera } from "./Camera";
// import { Engine } from "./Engine";

// Engine Context 接口定义
export interface EngineContext {
  camera: Camera;
  isFirstInit: boolean;
  dirtyRender: boolean;
  dirtyOverlay: boolean;
  defaultConfig: Size;

  SystemMap: Map<string, System>;

  stateStore: StateStore;

  system: System[];

  entityManager: Entity;
  setEngine(canvasInfo: CanvasInfo, defaultConfig: DefaultConfig): void;
  // createCanvas: (defaultConfig: DefaultConfig) => CanvasRenderingContext2D;
  // initCanvas: (
  //   defaultConfig: DefaultConfig
  // ) => Promise<CanvasRenderingContext2D>;
  update: () => void;
  destroyed: () => void;
  addSystem: (system: any) => void;
  getSystemByName: (name: string) => any;
  /**
   * 清空画布，自定义renderer需要重写此方法
   * @returns
   */
  clear: () => void;
  flush: () => void;
}
