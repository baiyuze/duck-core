import type { Color, Position, Size } from "../../Components";
import type { Engine } from "../../Core/Engine";
import { DSL } from "../../DSL/DSL";
import { Entity } from "../../Entity/Entity";
import { ShapeType } from "../../enum";
import type { StateStore } from "../../types";
import { System } from "../System";
import renderRegistry from "./renderRegistry";

export class RenderSystem extends System {
  engine: Engine;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  renderMap = new Map<string, System>();

  constructor(engine: Engine) {
    super();
    this.engine = engine;
    this.initRenderMap();
  }

  initRenderMap() {
    Object.entries(renderRegistry).forEach(([key, SystemClass]) => {
      this.renderMap.set(key, new SystemClass(this.engine));
    });
  }

  drawShape(stateStore: StateStore, entityId: string) {
    const type = stateStore.type.get(entityId);
    if (!type) return;
    this.renderMap.get(type)?.draw(entityId);
  }

  render(stateStore: StateStore) {
    stateStore.position.forEach((pos, entityId) => {
      this.drawShape(stateStore, entityId);
    });
  }

  update(stateStore: StateStore) {
    console.log("Updating render system");
    this.render(stateStore);
  }

  destroy() {}
}
