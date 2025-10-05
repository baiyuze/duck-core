import { throttle } from "lodash";
import type { Color, Position, Size } from "../../Components";
import type { Core } from "../../Core";
import { DSL } from "../../DSL/DSL";
import { Entity } from "../../Entity/Entity";
import { ShapeType } from "../../enum";
import type { StateStore } from "../../types";
import { System } from "../System";
import renderRegistry from "./renderRegistry";

export class RenderSystem extends System {
  core: Core;
  ctx: CanvasRenderingContext2D;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  renderMap = new Map<string, System>();

  constructor(ctx: CanvasRenderingContext2D, core: Core) {
    super();
    this.core = core;
    this.ctx = ctx;
    this.initRenderMap();
  }

  initRenderMap() {
    Object.entries(renderRegistry).forEach(([key, SystemClass]) => {
      this.renderMap.set(key, new SystemClass(this.ctx, this.core));
    });
  }

  throttledRender = throttle((stateStore: StateStore) => {
    this.render(stateStore, this.ctx);
  }, 100);

  drawShape(stateStore: StateStore, entityId: string) {
    const type = stateStore.type.get(entityId);
    if (!type) return;
    this.renderMap.get(type)?.draw(entityId);
  }

  render(stateStore: StateStore, ctx: CanvasRenderingContext2D) {
    // 每帧先清空画布
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 遍历所有 position 组件的实体
    stateStore.position.forEach((pos, entityId) => {
      ctx.save();
      this.drawShape(stateStore, entityId);
      ctx.restore();
    });
  }
  /**
   * 渲染
   * ToDo 需要优化当在选中区时，也要停止更新update
   * @param stateStore
   */
  update(stateStore: StateStore) {
    this.throttledRender(stateStore);
  }
}
