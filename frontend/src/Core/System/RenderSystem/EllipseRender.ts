import type { Engine } from "../../Core/Engine";
import type { DSL } from "../../DSL/DSL";
import type { StateStore } from "../../types";
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
    if (!this.stateStore) return;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);
    const { width, height } = state.size;
    const { fillColor, strokeColor } = state.color;
    const graphics = state.graphics;

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
