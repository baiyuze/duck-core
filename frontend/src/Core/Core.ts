import type { Color, Position, Size } from "./Components";
import { DSL } from "./DSL/DSL";
import { Entity } from "./Entity/Entity";
import { RenderSystem } from "./System/RenderSystem";
import { System } from "./System/System";
import type { ComponentStore } from "./types";

export class Core {
  /**
   * 是否多选
   */
  multiple: boolean = false;
  dsls: DSL[] = [];

  SystemMap: Map<string, System> = new Map();

  components: ComponentStore = {
    position: new Map<string, Position>(),
    size: new Map<string, Size>(),
    color: new Map<string, Color>(),
    selected: new Map<string, { value: boolean; hovered: boolean }>(),
    eventQueue: [],
    rotation: new Map<string, { value: number }>(),
    type: new Map<string, string>(),
  };

  system: System[] = [];

  entityManager = new Entity();

  ctx: CanvasRenderingContext2D | null;
  constructor(dsls: any[], ctx: CanvasRenderingContext2D | null) {
    this.ctx = ctx;
    this.dsls = dsls.map((dsl) => new DSL(dsl));
    this.initComponents();
  }

  initComponents() {
    this.dsls.forEach((dsl: DSL) => {
      this.components.position.set(dsl.id, dsl.position);
      this.components.size.set(dsl.id, dsl.size);
      this.components.color.set(dsl.id, dsl.color);
      this.components.selected.set(dsl.id, {
        value: dsl.selected.value,
        hovered: false,
      });
      this.components.type.set(dsl.id, dsl.type);
      this.components.rotation.set(dsl.id, dsl.rotation);
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
      sys.update(this.components);
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
