import type { Engine } from "../../Core/Engine";
import type { DSL } from "../../DSL/DSL";
import type { StateStore } from "../../types";
import { System } from "../System";

export class EllipseRender extends System {
  engine: Engine;
  stateStore: StateStore | null = null;
  constructor(engine: Engine) {
    super();
    this.engine = engine;
  }

  draw1(entityId: string): void {
    this.stateStore = this.engine.stateStore;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);
    if (!state) return;
    const canvas = this.engine.canvas;
    const ck = this.engine.ck;
    const rect = ck.XYWHRect(0, 0, state.size.width, state.size.height);
    const paint = new ck.Paint();
    paint.setStyle(ck.PaintStyle.Fill);
    if (state.color.fillColor && state.color.fillColor !== "transparent") {
      paint.setColor(ck.parseColorString(state.color.fillColor));
      paint.setAntiAlias(true);
    }
    canvas.drawOval(rect, paint);
    if (state.color.strokeColor && state.color.strokeColor !== "transparent") {
      const paint = new ck.Paint();
      paint.setAntiAlias(true);
      paint.setStyle(ck.PaintStyle.Stroke);
      paint.setStrokeWidth(state.lineWidth.value);
      paint.setColor(ck.parseColorString(state.color.strokeColor));
    }
    canvas.drawOval(rect, paint);
  }
}
