import type { Color, Position, Size } from "./Components";
import { DSL } from "./DSL/DSL";
import { Entity } from "./Entity/Entity";
import { RenderSystem } from "./System/RenderSystem";
import { System } from "./System/System";
import type { ComponentStore } from "./types";

export class Core {
  dsls: DSL[] = [];

  // renderSystem: RenderSystem;

  components: ComponentStore = {
    position: new Map<string, Position>(),
    size: new Map<string, Size>(),
    color: new Map<string, Color>(),
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
    this.dsls.forEach((dsl) => {
      this.components.position.set(dsl.id, dsl.position);
      this.components.size.set(dsl.id, dsl.size);
      this.components.color.set(dsl.id, dsl.color);
    });
  }

  addSystem(system: System) {
    this.system.push(system);
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
