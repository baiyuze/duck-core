import type { Core } from "../../Core";
import type { StateStore } from "../../types";
import { System } from "../System";

export class PolygonRender extends System {
  core: Core;
  ctx: CanvasRenderingContext2D;
  stateStore: StateStore | null = null;
  constructor(ctx: CanvasRenderingContext2D, core: Core) {
    super();
    this.core = core;
    this.ctx = ctx;
  }
  draw(entityId: string) {
    this.stateStore = this.core.stateStore;
    if (!this.stateStore) return;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);

    // const { x, y } = state.position;
    // const { width, height } = state.size;
    const { fillColor, strokeColor } = state.color;
    const { vertexs } = state.polygon;

    const ctx = this.ctx;
    // 需要注意translate和rotate的顺序，先translate再rotate
    ctx.beginPath();
    if (vertexs.length > 0) {
      const movePoint =
        vertexs[0].type === "M"
          ? vertexs[0]
          : vertexs.find((v) => v.type === "M");
      if (!movePoint) return;
      if (!movePoint.point) return;
      const { point } = movePoint;
      ctx.moveTo(point.x, point.y);

      // 需要按照点的顺序进行绘制，先判断类型，如果是L，直接lineTo，如果是Q，quadraticCurveTo，如果是C，bezierCurveTo
      for (let i = 1; i < vertexs.length; i++) {
        const vertex = vertexs[i];
        console.log("vertex", vertex);
        switch (vertex.type) {
          case "L":
            if (vertex.point) {
              ctx.lineTo(vertex.point?.x, vertex.point.y);
            }
            break;
          case "Q":
            if (vertex.controlPoint && vertex.endPoint) {
              ctx.quadraticCurveTo(
                vertex.controlPoint.x,
                vertex.controlPoint.y,
                vertex.endPoint.x,
                vertex.endPoint.y
              );
            }
            break;
          case "C":
            if (vertex.startPoint && vertex.endPoint && vertex.point) {
              ctx.bezierCurveTo(
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
      ctx.closePath();
      // 需要将fill和stroke分开和scale和rotation分开，分别渲染。
      if (fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
      }
      if (strokeColor) {
        ctx.strokeStyle = strokeColor;
        if (state.lineWidth.value) {
          ctx.lineWidth = state.lineWidth.value;
        }
        ctx.stroke();
      }
    }
  }
}
