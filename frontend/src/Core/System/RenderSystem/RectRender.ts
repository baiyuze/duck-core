import type { Engine } from "../../Core/Engine";
import type { StateStore } from "../../types";
import { System } from "../System";

export class RectRender extends System {
  engine: Engine;
  stateStore: StateStore | null = null;

  constructor(engine: Engine) {
    super();
    this.engine = engine;
  }

  /** 标准化半径参数 */
  private normalizeRadius(
    radius: number | { lt?: number; rt?: number; rb?: number; lb?: number }
  ): { lt: number; rt: number; rb: number; lb: number } {
    if (typeof radius === "number") {
      return { lt: radius, rt: radius, rb: radius, lb: radius };
    }
    return {
      lt: radius.lt || 0,
      rt: radius.rt || 0,
      rb: radius.rb || 0,
      lb: radius.lb || 0,
    };
  }

  draw1(entityId: string) {
    const ck = this.engine.ck;
    this.stateStore = this.engine.stateStore;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);

    // const { width, height } = state.size;
    const {
      fillColor,
      // strokeColor,
      // strokeBColor,
      // strokeLColor,
      // strokeRColor,
      // strokeTColor,
    } = state.color;
    // const lineWidth = state.lineWidth;
    const radius = state.radius;
    const radiusObj = this.normalizeRadius(radius);
    const { lt, rt, rb, lb } = radiusObj;
    const paint = new ck.Paint();
    paint.setAntiAlias(true);
    paint.setStyle(ck.PaintStyle.Fill);
    if (fillColor) paint.setColor(ck.parseColorString(fillColor)); // 任意颜色
    const radii = [lt, lt, rt, rt, rb, rb, lb, lb];
    const { left, top, right, bottom } = this.toLTRBRect(state);
    const rrect = Float32Array.of(left, top, right, bottom, ...radii);
    this.engine.canvas.drawRRect(rrect, paint);
    paint.delete();
  }
}
