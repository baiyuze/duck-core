import type { Size } from "../Components";
import { DSL } from "../DSL/DSL";
import { EngineHelp } from "../engineHelp";
import { Entity } from "../Entity/Entity";
import { System } from "../System/System";
import type { DefaultConfig, StateStore } from "../types";
import { Camera } from "./Camera";
import type { Core } from "./Core";
import type { EngineContext } from "./EngineContext";
import { Application, Container, Graphics, Sprite } from "pixi.js";
const engineHelp = new EngineHelp();

export class Engine implements EngineContext {
  camera = new Camera();
  isFirstInit: boolean = true;
  dirtyRender = false;
  dirtyOverlay = false;
  defaultConfig: Size = { width: 800, height: 600 };
  dsls: DSL[] = [];
  SystemMap: Map<string, System> = new Map();
  system: System[] = [];
  entityManager = new Entity();
  app: Application = new Application();
  needsFrame: boolean = false;
  ctx: CanvasRenderingContext2D | null = null;
  fpsText: string = "";
  showFPS: boolean = false;

  constructor(public core: Core, { showFPS = false } = {}) {
    this.core = core;
    this.showFPS = showFPS;
  }

  get stateStore() {
    return this.core.stateStore;
  }

  async createRenderEngine(defaultConfig: DefaultConfig) {
    this.defaultConfig = defaultConfig;
    const resolution = engineHelp.getOptimalResolution();
    await this.app.init({
      width: defaultConfig.width,
      height: defaultConfig.height,
      autoStart: false,
      autoDensity: true,
      backgroundAlpha: 0,
      antialias: true, // 抗锯齿
      resolution,
    });
    this.app.ticker.maxFPS = defaultConfig.fps || 60;
    defaultConfig.container.appendChild(this.app.canvas);
  }

  /**
   * 画布静止帧率
   */
  setStaticFps() {
    this.app.ticker.minFPS = 1;
  }

  /**
   * 设置最大帧率
   * @param fps
   */
  setMaxFps(fps: number) {
    this.app.ticker.maxFPS = fps;
  }

  /**
   * 只存储组件数据为CLASS的属性
   */
  initComponents(dsls: any[] = []) {
    this.core.resetState();
    this.core.initComponents(dsls);
  }
  /**
   * 添加到舞台
   * @param graphics
   */
  addChild(graphics: Container) {
    // 检查 graphics 的父级是否是 this.app.stage
    if (graphics.parent === this.app.stage) {
      return;
    }
    // 仅当父级不是 stage 时才添加
    this.app.stage.addChild(graphics);
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
   * 清空引擎画布
   */
  clearEngineCanvas() {
    this.app.stage.removeChildren();
  }

  requestFrame() {
    if (!this.needsFrame) {
      this.needsFrame = true;
      requestAnimationFrame(() => this.ticker());
    }
  }

  ticker() {
    // if (!this.app.renderer) return;
    this.isFirstInit = true;
    this.needsFrame = false;
    // this.app.ticker.add((ticker) => {
    //   this.update();
    // });
    this.update();
    this.app.renderer.render(this.app.stage);
    this.dirtyRender = false;
  }

  tick() {
    this.isFirstInit = false;
    this.needsFrame = false;
    this.update();
    this.dirtyRender = false;
  }

  systemUpdate(systemName: string) {
    const update = (system: System) => {
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
    this.ctx?.canvas.remove();
    this.app.destroy(
      { removeView: true },
      {
        children: true,
        texture: true,
        textureSource: true,
        context: true,
      }
    );

    // 如果 Canvas DOM 没被移除
    // if (this.app.view.parentNode) {
    //   this.app.view.parentNode.removeChild(this.app.view);
    // }
  }

  // initDSL(dsls: DSL[]) {
  //   dsls.forEach((dsl) => {
  //     const id = this.entityManager.createEntity();
  //     dsl.id = id;

  //     this.dsls.push(new DSL(dsl));
  //   });
  // }
}
