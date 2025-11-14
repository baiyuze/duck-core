import type { setEngine } from "crypto";
import type { Size } from "../Components";
import { Selected } from "../Components/Selected";
import { DSL } from "../DSL/DSL";
import { createCanvasKit } from "../engineFactory";
import { Entity } from "../Entity/Entity";
import { RendererRegistry } from "./RendererRegistry";
import type { EventSystem } from "../System/EventSystem";
import { System } from "../System/System";
import type {
  CanvasInfo,
  DefaultConfig,
  StateStore,
  SystemConstructor,
} from "../types";
import { Camera } from "./Camera";
import type { Core } from "./Core";
import type { EngineContext } from "./EngineContext";
import CanvasKitInit, {
  type Canvas,
  type CanvasKit,
  type Surface,
} from "canvaskit-wasm";
import { RendererManager } from "./RendererManager";

export class Engine implements EngineContext {
  camera = new Camera();
  isFirstInit: boolean = true;
  dirtyRender = false;
  dirtyOverlay = false;
  /**
   * 是否多选
   */
  defaultSize: Size = { width: 800, height: 800 };
  dsls: DSL[] = [];
  SystemMap: Map<string, System> = new Map();
  system: System[] = [];
  entityManager = new Entity();
  needsFrame: boolean = false;
  ctx!: CanvasRenderingContext2D;
  ck!: CanvasKit;
  canvas!: Canvas;
  surface!: Surface;
  canvasDom: HTMLCanvasElement | null = null;
  FontMgr: any | null = null;
  rendererManager: RendererManager = new RendererManager();

  constructor(public core: Core, rendererName?: string) {
    this.rendererManager.rendererName = rendererName || "Canvaskit";
    this.rendererManager.setRenderer(this.rendererManager.rendererName);
  }

  get stateStore() {
    return this.core.stateStore;
  }
  /**
   * 清理画布
   * 自定义renderer需要重写此方法
   */
  clear() {
    const canvas = this.canvas as any;
    if (canvas?.clearRect) {
      (canvas as CanvasRenderingContext2D).clearRect(
        0,
        0,
        this.defaultSize.width,
        this.defaultSize.height
      );
    } else {
      this.canvas.clear(this.ck.WHITE);
    }
  }

  /**
   * 设置引擎相关属性
   * @param canvasInfo
   */
  setEngine(canvasInfo: CanvasInfo) {
    this.canvasDom = canvasInfo.canvasDom;
    Object.assign(this, canvasInfo);
  }

  /**
   * 只存储组件数据为CLASS的属性
   */
  initComponents(dsls: any[] = []) {
    this.core.resetState();
    this.core.initComponents(dsls);
  }

  addSystem(system: System) {
    this.system.push(system);
    this.SystemMap.set(system.constructor.name, system);
  }
  /**
   * 获取系统
   * @param name 系统名称
   * @returns
   */
  getSystemByName<T extends System>(name: string): T | undefined {
    return this.SystemMap.get(name) as T | undefined;
  }
  /**
   * 请求下一帧渲染
   */
  requestFrame() {
    if (!this.needsFrame) {
      this.needsFrame = true;
      this.requestAnimationFrame();
    }
  }
  requestAnimationFrame() {
    if (this.surface) {
      this.surface.requestAnimationFrame(() => this._tick());
    } else {
      requestAnimationFrame(() => this._tick());
    }
  }
  /**
   * 刷新画布
   * 自定义renderer，如有需要需要重写此方法
   */
  flush() {
    this.surface?.flush?.();
  }
  /**
   * 渲染函数
   * @returns
   */
  async render() {
    if (!this.isFirstInit) return;
    await this.update();
    this.flush();
    this.isFirstInit = false;
  }
  /**
   * 引擎渲染主循环
   */
  async _tick() {
    this.needsFrame = false;
    try {
      await this.update();
      this.flush();
      this.dirtyRender = false;
    } catch (error) {
      console.error("Engine tick error:", error);
    }
  }
  /**
   * 系统更新分发
   * @param systemName
   * @returns
   */
  systemUpdate(systemName: string) {
    const update = async (system: System) => {
      // 只有有脏数据时，才进行处理
      if (this.dirtyRender || this.isFirstInit) {
        await system.update(this.stateStore);
      }
    };
    const systemMap: { [key: string]: (system: System) => void } = {
      RenderSystem: update,
    };
    return systemMap[systemName];
  }

  async update() {
    for (const sys of this.system) {
      const fn = this.systemUpdate(sys.constructor.name);
      if (fn) {
        await fn(sys);
        continue;
      }

      await sys.update(this.stateStore);
    }
  }
  /**
   * 统一销毁
   */
  destroyed(): void {
    this.system.forEach((sys) => {
      sys.destroyed();
    });
    this.system = [];
    this.SystemMap.clear();
    this.core.resetState();
    this.surface?.dispose();
    this.canvasDom?.remove();
  }
  /**
   * 重置引擎
   */
  reset() {
    this.destroyed();
    this.isFirstInit = true;
  }
}
