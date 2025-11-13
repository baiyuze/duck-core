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

    // 绘制填充
    if (state.color.fillColor && state.color.fillColor !== "transparent") {
      const paint = new ck.Paint();
      paint.setStyle(ck.PaintStyle.Fill);
      paint.setColor(ck.parseColorString(state.color.fillColor));
      paint.setAntiAlias(true);
      canvas.drawOval(rect, paint);
      paint.delete();
    }

    // 绘制描边
    if (state.color.strokeColor && state.color.strokeColor !== "transparent") {
      const strokePaint = new ck.Paint();
      strokePaint.setAntiAlias(true);
      strokePaint.setStyle(ck.PaintStyle.Stroke);
      strokePaint.setStrokeWidth(state.lineWidth.value);
      strokePaint.setColor(ck.parseColorString(state.color.strokeColor));
      canvas.drawOval(rect, strokePaint);
      strokePaint.delete();
    }
  }
}
