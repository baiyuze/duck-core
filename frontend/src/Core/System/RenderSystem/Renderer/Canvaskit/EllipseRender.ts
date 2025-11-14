import type { Paint } from "canvaskit-wasm";
import type { Engine } from "../../../../Core/Engine";
import type { DSL } from "../../../../DSL/DSL";
import type { StateStore } from "../../../../types";
import { System } from "../../../System";

export class EllipseRender extends System {
  engine: Engine;
  stateStore: StateStore | null = null;
  paint: Paint;
  constructor(engine: Engine) {
    super();
    this.engine = engine;
    this.paint = new this.engine.ck.Paint();
  }

  draw(entityId: string): void {
    this.stateStore = this.engine.stateStore;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);
    if (!state) return;
    const canvas = this.engine.canvas;
    const ck = this.engine.ck;
    const rect = ck.XYWHRect(0, 0, state.size.width, state.size.height);

    // 绘制填充
    if (state.color.fillColor && state.color.fillColor !== "transparent") {
      const paint = this.paint;
      paint.setStyle(ck.PaintStyle.Fill);
      paint.setColor(ck.parseColorString(state.color.fillColor));
      paint.setAntiAlias(true);
      canvas.drawOval(rect, paint);
    }

    // 绘制描边
    if (state.color.strokeColor && state.color.strokeColor !== "transparent") {
      const strokePaint = this.paint;
      strokePaint.setAntiAlias(true);
      strokePaint.setStyle(ck.PaintStyle.Stroke);
      strokePaint.setStrokeWidth(state.lineWidth.value);
      strokePaint.setColor(ck.parseColorString(state.color.strokeColor));
      canvas.drawOval(rect, strokePaint);
    }
  }
  destroyed(): void {
    this.paint.delete();
  }
}
