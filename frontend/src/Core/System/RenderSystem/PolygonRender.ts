import { Graphics } from "pixi.js";
import type { Engine } from "../../Core/Engine";
import type { StateStore } from "../../types";
import { System } from "../System";

export class PolygonRender extends System {
  engine: Engine;
  stateStore: StateStore | null = null;
  constructor(engine: Engine) {
    super();
    this.engine = engine;
  }
  draw(entityId: string): void {
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
}
