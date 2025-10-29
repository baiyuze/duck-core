import type { Size } from "../Components";
import type { DSL } from "../DSL/DSL";
import type { Entity } from "../Entity/Entity";
import type { System } from "../System/System";
import type { StateStore } from "../types";
// import { Engine } from "./Engine";

// Engine Context 接口定义
export interface EngineContext {
  isFirstInit: boolean;
  dirtyRender: boolean;
  dirtyOverlay: boolean;
  defaultSize: Size;

  SystemMap: Map<string, System>;

  stateStore: StateStore;

  system: System[];

  entityManager: Entity;
  initCanvas: (
    canvas: HTMLCanvasElement,
    size: { width: number; height: number }
  ) => CanvasRenderingContext2D | null;
  update: () => void;
  destroyed: () => void;
  addSystem: (system: any) => void;
  getSystemByName: (name: string) => any;
}
