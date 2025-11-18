import type { Color, Position, Size } from "../../Components";
import type { Engine } from "../../Core/Engine";
import { Entity } from "../../Entity/Entity";
import type { StateStore } from "../../types";
import { System } from "../System";

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
    Object.entries(this.engine.rendererManager.renderer).forEach(
      ([key, SystemClass]) => {
        this.renderMap.set(key, new SystemClass(this.engine));
      }
    );
  }

  async drawShape(stateStore: StateStore, entityId: string) {
    const type = stateStore.type.get(entityId);
    if (!type) return;
    await this.renderMap.get(type)?.draw?.(entityId);
  }

  async renderer(stateStore: StateStore) {
    // 清空 CanvasKit 画布
    this.engine.clear();
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

  /**
   * 获取可视区域边界（世界坐标系）
   */
  getViewport() {
    const { camera, defaultConfig } = this.engine;
    const zoom = camera.zoom;

    // 将画布坐标转换为世界坐标
    const left = -camera.translateX / zoom;
    const top = -camera.translateY / zoom;
    const right = left + defaultConfig.width / zoom;
    const bottom = top + defaultConfig.height / zoom;

    return { left, top, right, bottom };
  }

  /**
   * 判断实体是否在可视区域内
   */
  isInViewport(
    position: Position,
    size: Size | undefined,
    viewport: ReturnType<typeof this.getViewport>
  ): boolean {
    const { x, y } = position;
    const width = size?.width || 0;
    const height = size?.height || 0;

    // 实体的边界框
    const entityLeft = x;
    const entityTop = y;
    const entityRight = x + width;
    const entityBottom = y + height;

    // 判断是否有交集（使用边界框碰撞检测）
    return !(
      entityRight < viewport.left ||
      entityLeft > viewport.right ||
      entityBottom < viewport.top ||
      entityTop > viewport.bottom
    );
  }

  async render(stateStore: StateStore) {
    const viewport = this.getViewport();

    for (const [entityId, pos] of stateStore.position) {
      const position = pos as Position;
      const size = stateStore.size.get(entityId) as Size | undefined;

      // 只渲染可视区域内的实体
      if (!this.isInViewport(position, size, viewport)) {
        continue;
      }

      this.engine.canvas.save();
      const { x, y } = position;
      this.engine.canvas.translate(x, y);
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
