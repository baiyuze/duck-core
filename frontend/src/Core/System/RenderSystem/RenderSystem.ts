import type { Color, Position, Size } from "../../Components";
import type { Engine } from "../../Core/Engine";
import { DSL } from "../../DSL/DSL";
import { Entity } from "../../Entity/Entity";
import { ShapeType } from "../../enum";
import type { StateStore } from "../../types";
import { System } from "../System";
import renderRegistry from "./renderRegistry";

export class RenderSystem extends System {
  engine: Engine;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  renderMap = new Map<string, System>();
  private animationId: number | null = null;

  constructor(engine: Engine) {
    super();
    this.engine = engine;
    this.initRenderMap();
  }

  initRenderMap() {
    Object.entries(renderRegistry).forEach(([key, SystemClass]) => {
      this.renderMap.set(key, new SystemClass(this.engine));
    });
  }

  async drawShape(stateStore: StateStore, entityId: string) {
    const type = stateStore.type.get(entityId);
    if (!type) return;
    await this.renderMap.get(type)?.draw1?.(entityId);
  }

  async renderer(stateStore: StateStore) {
    // 清空 CanvasKit 画布
    this.engine.canvas.clear(this.engine.ck.WHITE);
    this.engine.canvas.save();
    this.engine.canvas.translate(
      this.engine.camera.translateX,
      this.engine.camera.translateY
    );
    this.engine.canvas.scale(this.engine.camera.zoom, this.engine.camera.zoom);
    await this.render(stateStore);
    // CanvasKit 也需要应用相机变换
    // 遍历所有 position 组件的实体

    this.engine.canvas.restore();
  }

  async render(stateStore: StateStore) {
    let entityCount = 0;
    for (const [entityId, pos] of stateStore.position) {
      this.engine.canvas.save();
      const { x, y } = pos as Position;
      const type = stateStore.type.get(entityId);
      this.engine.canvas.translate(x, y);

      // 中心原点应该是图形的中心点
      await this.drawShape(stateStore, entityId);
      this.engine.canvas.restore();
    }
  }

  async update(stateStore: StateStore) {
    await this.renderer(stateStore);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
