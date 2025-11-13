import type { CanvasKit, EmbindEnumEntity, Paint, Path } from "canvaskit-wasm";
import type { Engine } from "../../Core/Engine";
import type { StateStore } from "../../types";
import { System } from "../System";

export class PolygonRender extends System {
  engine: Engine;
  stateStore: StateStore | null = null;
  path: Path;
  paint: Paint;
  constructor(engine: Engine) {
    super();
    this.engine = engine;
    this.path = new this.engine.ck.Path();
    this.paint = new this.engine.ck.Paint();
  }

  setPaintStyle(ck: CanvasKit, color: string, type: EmbindEnumEntity) {
    const paint = this.paint;
    paint.setStyle(type);
    paint.setColor(ck.parseColorString(color));
    paint.setAntiAlias(true);
    return paint;
  }

  draw(entityId: string): void {
    this.stateStore = this.engine.stateStore;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);
    if (!state) return;
    const canvas = this.engine.canvas;
    const ck = this.engine.ck;
    const { vertexs } = state.polygon;
    const { fillColor, strokeColor } = state.color;
    const path = this.path;
    path.reset();
    if (vertexs.length > 0) {
      const movePoint =
        vertexs[0].type === "M"
          ? vertexs[0]
          : vertexs.find((v) => v.type === "M");
      if (!movePoint) return;
      if (!movePoint.point) return;
      const { point } = movePoint;
      path.moveTo(point.x, point.y);

      // 需要按照点的顺序进行绘制，先判断类型，如果是L，直接lineTo，如果是Q，quadraticCurveTo，如果是C，bezierCurveTo
      for (let i = 1; i < vertexs.length; i++) {
        const vertex = vertexs[i];
        switch (vertex.type) {
          case "L":
            if (vertex.point) {
              path.lineTo(vertex.point?.x, vertex.point.y);
            }
            break;
          case "Q":
            if (vertex.controlPoint && vertex.endPoint) {
              path.quadTo(
                vertex.controlPoint.x,
                vertex.controlPoint.y,
                vertex.endPoint.x,
                vertex.endPoint.y
              );
            }
            break;
          case "C":
            if (vertex.startPoint && vertex.endPoint && vertex.point) {
              path.cubicTo(
                vertex.startPoint.x,
                vertex.startPoint.y,
                vertex.endPoint.x,
                vertex.endPoint.y,
                vertex.point.x,
                vertex.point.y
              );
            }
            break;
          default:
            break;
        }
      }
      // 需要将fill和stroke分开和scale和rotation分开，分别渲染。
      if (fillColor && fillColor !== "transparent") {
        const paint = this.setPaintStyle(ck, fillColor, ck.PaintStyle.Fill);
        canvas.drawPath(path, paint);
      }
      if (strokeColor && strokeColor !== "transparent") {
        const paint = this.setPaintStyle(ck, strokeColor, ck.PaintStyle.Stroke);
        canvas.drawPath(path, paint);
        paint.delete();
      }
    }
  }
  destroyed(): void {
    this.path.delete();
    this.paint.delete();
  }
}
