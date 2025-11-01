import { Graphics } from "pixi.js";
import type { Engine } from "../../Core/Engine";
import type { StateStore } from "../../types";
import { System } from "../System";

export class PolygonRender extends System {
  engine: Engine;
  ctx: CanvasRenderingContext2D;
  stateStore: StateStore | null = null;
  constructor(ctx: CanvasRenderingContext2D, engine: Engine) {
    super();
    this.engine = engine;
    this.ctx = ctx;
  }
  draw1(entityId: string): void {
    this.stateStore = this.engine.stateStore;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);
    // const { width, height } = state.size;
    const { fillColor, strokeColor } = state.color;
    const { vertexs } = state.polygon;

    let graphics = this.graphicsMap.get(entityId) as Graphics;

    if (!graphics) {
      graphics = new Graphics();
      this.graphicsMap.set(entityId, graphics);
    }
    if (!this.isPositionDirty(entityId, state)) return;
    graphics.position.set(state.position.x, state.position.y);

    if (!this.isGeometryDirty(entityId, state)) return;

    graphics.fill({ color: fillColor });
    graphics.stroke({ color: strokeColor, width: state.lineWidth.value });

    // 解析 path 命令
    vertexs.forEach((v) => {
      switch (v.type) {
        case "M":
          if (v.point) graphics.moveTo(v.point.x, v.point.y);
          break;
        case "L":
          if (v.point) graphics.lineTo(v.point.x, v.point.y);
          break;
        case "Q":
          if (v.controlPoint && v.endPoint)
            graphics.quadraticCurveTo(
              v.controlPoint.x,
              v.controlPoint.y,
              v.endPoint.x,
              v.endPoint.y
            );
          break;
        case "C":
          if (v.startPoint && v.endPoint && v.point)
            graphics.bezierCurveTo(
              v.startPoint.x,
              v.startPoint.y,
              v.endPoint.x,
              v.endPoint.y,
              v.point.x,
              v.point.y
            );
          break;
      }
    });
    // 关闭路径（回到起点）
    graphics.closePath();
    graphics.fill();
    graphics.stroke();
    this.engine.addChild(graphics);
  }
  draw(entityId: string) {
    this.stateStore = this.engine.stateStore;
    if (!this.stateStore) return;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);

    // const { width, height } = state.size;
    const { fillColor, strokeColor } = state.color;
    const { vertexs } = state.polygon;

    const ctx = this.ctx;
    // ctx.translate(state.position.x, state.position.y);
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
