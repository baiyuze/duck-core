import type { Engine } from "../../Core/Engine";
import type { DSL } from "../../DSL/DSL";
import type { StateStore } from "../../types";
import type { DSLParams } from "../../types/dsl";
import { System } from "../System";
import { Graphics } from "pixi.js";

export class EllipseRender extends System {
  engine: Engine;
  stateStore: StateStore | null = null;
  constructor(engine: Engine) {
    super();
    this.engine = engine;
    // this.ctx = ctx;
  }
  draw(entityId: string) {
    this.stateStore = this.engine.stateStore;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);
    const { width, height } = state.size;
    const { fillColor, strokeColor } = state.color;
    // 脏检查
    // console.log(
    //   !this.isDirty(entityId, state),
    //   "-this.isDirty(entityId, state)-->"
    // );
    // if (!this.isDirty(entityId, state)) return;
    let graphics = this.graphicsMap.get(entityId) as Graphics;
    if (!graphics) {
      graphics = new Graphics();
      this.graphicsMap.set(entityId, graphics);
    }

    const isDirty = this.isPositionDirty(entityId, state);
    if (!isDirty) return;
    graphics.position.set(state.position.x, state.position.y);
    // console.log(123, !isDirty, "ellipse position", state.position);
    const isGeometryDirty = this.isGeometryDirty(entityId, state);

    if (!isGeometryDirty) return;
    // console.log(456, "ellipse geometrydirty", state.position);

    graphics.ellipse(
      width / 2,
      height / 2,
      width / 2, // 水平半径
      height / 2
    ); // 垂直半径
    if (fillColor) {
      graphics.fill(fillColor);
    }
    if (strokeColor) {
      graphics.stroke({ width: 2, color: strokeColor });
    }
    this.engine.addChild(graphics);
  }
}
