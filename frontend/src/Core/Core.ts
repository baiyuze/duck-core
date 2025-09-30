import type { Color, Position, Size } from "./Components";
import type { Font } from "./Components/Font";
import type { Img } from "./Components/Img";
import { DSL } from "./DSL/DSL";
import { Entity } from "./Entity/Entity";
import { RenderSystem } from "./System/RenderSystem/RenderSystem";
import { System } from "./System/System";
import type { StateStore } from "./types";

export class Core {
  /**
   * 是否多选
   */
  multiple: boolean = false;
  dsls: DSL[] = [];

  SystemMap: Map<string, System> = new Map();

  stateStore: StateStore = {
    position: new Map<string, Position>(),
    size: new Map<string, Size>(),
    color: new Map<string, Color>(),
    selected: new Map<string, { value: boolean; hovered: boolean }>(),
    eventQueue: [],
    rotation: new Map<string, { value: number }>(),
    type: new Map<string, string>(),
    font: new Map<string, Font>(),
    lineWidth: new Map<string, { value: number }>(),
    img: new Map<string, Img>(),
  };

  system: System[] = [];

  entityManager = new Entity();

  // ctx: CanvasRenderingContext2D | null;
  constructor(dsls: any[]) {
    // this.ctx = ctx;
    this.dsls = dsls.map((dsl) => new DSL(dsl));
    this.initComponents();
  }

  initCanvas(canvas: HTMLCanvasElement) {
    const dpr = window.devicePixelRatio || 1;

    // 设置 CSS 尺寸：保持在逻辑尺寸（用户看到的大小）
    canvas.style.width = canvas.width + "px";
    canvas.style.height = canvas.height + "px";

    // 设置实际像素尺寸：乘以 dpr，保证清晰
    canvas.width = canvas.width * dpr;
    canvas.height = canvas.height * dpr;

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr); // 缩放回逻辑大小

    return ctx;
  }

  initComponents() {
    this.dsls.forEach((dsl: DSL) => {
      this.stateStore.position.set(dsl.id, dsl.position);
      this.stateStore.size.set(dsl.id, dsl.size);
      this.stateStore.color.set(dsl.id, dsl.color);
      this.stateStore.selected.set(dsl.id, {
        value: dsl?.selected?.value as boolean,
        hovered: false,
      });
      this.stateStore.type.set(dsl.id, dsl.type);
      this.stateStore.rotation.set(dsl.id, dsl.rotation);
      this.stateStore.font.set(dsl.id, dsl.font);
      this.stateStore.lineWidth.set(dsl.id, dsl.lineWidth);
      this.stateStore.img.set(dsl.id, dsl.img);
    });
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
  getSystemByName(name: string) {
    return this.SystemMap.get(name);
  }

  update() {
    this.system.forEach((sys) => {
      sys.update(this.stateStore);
    });
  }

  // initDSL(dsls: DSL[]) {
  //   dsls.forEach((dsl) => {
  //     const id = this.entityManager.createEntity();
  //     dsl.id = id;

  //     this.dsls.push(new DSL(dsl));
  //   });
  // }
}
