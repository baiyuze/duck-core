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
    this.stateStore = core.stateStore;
  }
  draw(entityId: string) {
    if (!this.stateStore) return;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);

    const { x, y } = state.position;
    // const { width, height } = state.size;
    const { fillColor, strokeColor } = state.color;
    const { vertexs } = state.polygon;

    // this.ctx.fillStyle = fillColor || "transparent";
    // this.ctx.strokeStyle = strokeColor || "transparent";
    // this.ctx.strokeRect(x, y, width, height);
    // if (state.lineWidth.value) {
    //   this.ctx.lineWidth = state.lineWidth.value;
    // }
    // if (fillColor) this.ctx.fillRect(x, y, width, height);
    // 绘制多边形
    // 先获取position，再获取scale，再获取rotation，最后开始执行绘制vertexs,需要获取原点。
    const ctx = this.ctx;
    ctx.translate(x, y);
    ctx.beginPath();
    if (vertexs.length > 0) {
      ctx.moveTo(vertexs[0].x, vertexs[0].y);
      for (let i = 1; i < vertexs.length; i++) {
        ctx.lineTo(vertexs[i].x, vertexs[i].y);
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
