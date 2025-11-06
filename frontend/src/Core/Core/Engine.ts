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
import { Scheduler } from "./Scheduler";
const engineHelp = new EngineHelp();

export class Engine implements EngineContext {
  app: Application = new Application();
  camera = new Camera();
  entityManager = new Entity();
  scheduler = new Scheduler();
  isFirstInit: boolean = true;
  dirtyRender = false;
  dirtyOverlay = false;
  defaultConfig: Size = { width: 800, height: 600 };
  dsls: DSL[] = [];
  SystemMap: Map<string, System> = new Map();
  system: System[] = [];
  needsFrame: boolean = false;
  ctx: CanvasRenderingContext2D | null = null;
  fpsText: string = "";
  showFPS: boolean = false;
  resolution: number = engineHelp.getOptimalResolution();
  /**
   * 舞台对象
   */
  stage: Container[] = [];

  constructor(public core: Core, { showFPS = false } = {}) {
    this.core = core;
    this.showFPS = showFPS;
  }

  get stateStore() {
    return this.core.stateStore;
  }

  async createRenderEngine(defaultConfig: DefaultConfig) {
    this.defaultConfig = defaultConfig;
    const resolution = this.resolution;

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
    if (graphics.parent === this.app.stage) {
      return;
    }
    this.stage.push(graphics);
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

  render() {
    this.isFirstInit = true;
    this.update();
    this.createStage();
    this.app.renderer.render(this.app.stage);
  }
  requestFrame() {
    this.isFirstInit = false;
    this.update();
    this.ticker();
  }
  ticker() {
    this.app.renderer.render(this.app.stage);
  }

  createStage() {
    this.stage.forEach((graphics) => {
      this.scheduler.createChildStatic(graphics);
    });
    // 完成静态块的构建
    this.scheduler.finishStaticChunks();
    const stage = this.scheduler.createBox();
    this.app.stage.addChild(stage);
  }

  addSystem(system: System) {
    this.system.push(system);
    this.SystemMap.set(system.constructor.name, system);
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
  }
}
