import type { Engine } from "../../Core/Engine";
import type { DSL } from "../../DSL/DSL";
import type { StateStore } from "../../types";
import type { DSLParams } from "../../types/dsl";
import { System } from "../System";
import { Graphics } from "pixi.js";

export class EllipseRender extends System {
  engine: Engine;
  ctx: CanvasRenderingContext2D;
  stateStore: StateStore | null = null;
  constructor(ctx: CanvasRenderingContext2D, engine: Engine) {
    super();
    this.engine = engine;
    this.ctx = ctx;
  }
  draw1(entityId: string) {
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
  draw(entityId: string) {
    this.stateStore = this.engine.stateStore;
    if (!this.stateStore) return;

    const state = this.getComponentsByEntityId(this.stateStore, entityId);

    // const { x, y } = state.position;
    // const { rx, ry } = state.ellipseRadius;
    const { width, height } = state.size;
    const { fillColor, strokeColor } = state.color;
    this.ctx.beginPath();
    this.ctx.ellipse(
      width / 2,
      height / 2,
      width / 2, // 水平半径
      height / 2, // 垂直半径
      0, // 旋转角度
      0,
      2 * Math.PI
    );
    this.ctx.strokeStyle = strokeColor || "transparent"; // 可以是颜色字符串、渐变、模式等
    this.ctx.stroke();
    this.ctx.fillStyle = fillColor || "transparent";
    this.ctx.fill();
    this.ctx.lineWidth = 2;
    this.ctx.closePath();
  }
}
