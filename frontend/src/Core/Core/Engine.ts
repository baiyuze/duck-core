import type { Size } from "../Components";
import { Selected } from "../Components/Selected";
import { DSL } from "../DSL/DSL";
import { Entity } from "../Entity/Entity";
import { System } from "../System/System";
import type { StateStore } from "../types";
import type { Core } from "./Core";
import type { EngineContext } from "./EngineContext";

export class Engine implements EngineContext {
  /**
   * 是否多选
   */
  defaultSize: Size = { width: 800, height: 800 };
  dsls: DSL[] = [];
  SystemMap: Map<string, System> = new Map();
  system: System[] = [];
  entityManager = new Entity();

  // ctx: CanvasRenderingContext2D | null;
  constructor(public core: Core) {
    // this.ctx = ctx;
    // this.initComponents(dsls);
  }

  get stateStore() {
    return this.core.stateStore;
  }

  initCanvas(
    canvas: HTMLCanvasElement,
    size: { width: number; height: number }
  ) {
    this.defaultSize = size;
    const dpr = window.devicePixelRatio || 1;
    canvas.style.width = size.width + "px";
    canvas.style.height = size.height + "px";
    // canvas.style.position = "absolute";
    // canvas.style.top = "0";
    // canvas.style.left = "0";

    canvas.width = size.width * dpr;
    canvas.height = size.height * dpr;

    const ctx = canvas.getContext("2d", {
      willReadFrequently: true,
    }) as CanvasRenderingContext2D;
    ctx.scale(dpr, dpr);

    return ctx;
  }

  /**
   * 只存储组件数据为CLASS的属性
   */
  initComponents(dsls: any[] = []) {
    this.core.resetState();
    this.dsls = dsls.map((dsl) => new DSL(dsl));

    this.dsls.forEach((dsl: DSL) => {
      for (const key in dsl) {
        if (key == "selected") {
          dsl.selected = new Selected();
        }
        const value = (dsl as any)[key];

        if (value === undefined) {
          throw new Error(`DSL属性${key}未定义`);
        }

        if (
          (typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)) ||
          key === "type"
        ) {
          const map = this.stateStore[key as keyof StateStore] as Map<
            string,
            DSL[keyof DSL]
          >;
          if (map && map instanceof Map) {
            map.set(dsl.id, value);
          }
        }
      }
    });
  }

  // resetState() {
  //   this.stateStore = Engine.getStateStore();
  //   this.entityManager = new Entity();
  // }

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

  update() {
    this.system.forEach((sys) => {
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
