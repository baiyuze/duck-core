import type { Entity } from "../Entity/Entity";
import type { System } from "../System/System";
import type { CanvasInfo, DefaultConfig, StateStore } from "../types";
import type { Camera } from "./Camera";
import type { Config } from "./Config";

export interface EngineContext {
  camera: Camera;
  isFirstInit: boolean;
  dirtyRender: boolean;
  dirtyOverlay: boolean;
  config: Config;

  SystemMap: Map<string, System>;

  stateStore: StateStore;

  system: System[];

  entityManager: Entity;
  setEngine(canvasInfo: CanvasInfo, config: DefaultConfig): void;
  // createCanvas: (config: DefaultConfig) => CanvasRenderingContext2D;
  // initCanvas: (
  //   config: DefaultConfig
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
