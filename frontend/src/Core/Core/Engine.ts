import type { Size } from "../Components";
import { Selected } from "../Components/Selected";
import { DSL } from "../DSL/DSL";
import { Entity } from "../Entity/Entity";
import type { EventSystem } from "../System/EventSystem";
import { System } from "../System/System";
import type { DefaultConfig, StateStore } from "../types";
import { Camera } from "./Camera";
import type { Core } from "./Core";
import type { EngineContext } from "./EngineContext";

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

  // ctx: CanvasRenderingContext2D | null;
  constructor(public core: Core) {
    // this.ctx = ctx;
    // this.initComponents(dsls);
  }

  get stateStore() {
    return this.core.stateStore;
  }

  createCanvas(defaultConfig: DefaultConfig) {
    const canvas = document.createElement("canvas");
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = defaultConfig.width + "px";
    canvas.style.height = defaultConfig.height + "px";
    canvas.width = defaultConfig.width * dpr;
    canvas.height = defaultConfig.height * dpr;
    defaultConfig.container.appendChild(canvas);
    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    ctx.scale(dpr, dpr);
    return ctx;
  }

  initCanvas(defaultConfig: DefaultConfig) {
    const ctx = this.createCanvas(defaultConfig);
    return ctx;
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

  requestFrame() {
    if (!this.needsFrame) {
      this.needsFrame = true;
      requestAnimationFrame(() => this.tick());
    }
  }

  tick() {
    this.isFirstInit = false;
    this.needsFrame = false;
    this.update();
    this.dirtyRender = false;
  }

  systemUpdate(systemName: string) {
    const update = (system: System) => {
      // 只有有脏数据时，才进行处理
      if (this.dirtyRender || this.isFirstInit) {
        system.update(this.stateStore);
      }
    };
    const systemMap: { [key: string]: (system: System) => void } = {
      RenderSystem: update,
    };
    return systemMap[systemName];
  }

  update() {
    this.system.forEach((sys) => {
      const fn = this.systemUpdate(sys.constructor.name);
      if (fn) {
        fn(sys);
        return;
      }

      sys.update(this.stateStore);
    });
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
  }

  // initDSL(dsls: DSL[]) {
  //   dsls.forEach((dsl) => {
  //     const id = this.entityManager.createEntity();
  //     dsl.id = id;

  //     this.dsls.push(new DSL(dsl));
  //   });
  // }
}
