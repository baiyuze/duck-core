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
  ctx: CanvasRenderingContext2D;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  renderMap = new Map<string, System>();
  private animationId: number | null = null;
  private pendingRender = false;

  // FPS 相关属性
  private fps = 0;
  private frameCount = 0;
  private lastTime = performance.now();
  private showFPS = true; // 控制是否显示 FPS

  constructor(ctx: CanvasRenderingContext2D, engine: Engine) {
    super();
    this.engine = engine;
    this.ctx = ctx;
    this.initRenderMap();
  }

  initRenderMap() {
    Object.entries(renderRegistry).forEach(([key, SystemClass]) => {
      this.renderMap.set(key, new SystemClass(this.ctx, this.engine));
    });
  }

  drawShape(stateStore: StateStore, entityId: string) {
    const type = stateStore.type.get(entityId);
    if (!type) return;
    this.renderMap.get(type)?.draw(entityId);
    this.renderMap.get(type)?.draw1?.(entityId);
  }

  renderer(stateStore: StateStore, ctx: CanvasRenderingContext2D) {
    // 每帧先清空画布
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // 清空 CanvasKit 画布
    this.engine.canvas.clear(this.engine.ck.WHITE);
    console.log(
      `RenderSystem: 开始渲染，共有 ${stateStore.position.size} 个实体`
    );

    ctx.save();
    ctx.translate(this.engine.camera.translateX, this.engine.camera.translateY);
    ctx.scale(this.engine.camera.zoom, this.engine.camera.zoom);

    this.engine.canvas.save();
    this.engine.canvas.translate(
      this.engine.camera.translateX,
      this.engine.camera.translateY
    );
    this.engine.canvas.scale(this.engine.camera.zoom, this.engine.camera.zoom);
    this.render(stateStore, ctx);
    // CanvasKit 也需要应用相机变换
    // 遍历所有 position 组件的实体

    this.engine.canvas.restore();
    ctx.restore();
    console.log(`RenderSystem: 渲染完成`);
  }

  render(stateStore: StateStore, ctx: CanvasRenderingContext2D) {
    let entityCount = 0;

    stateStore.position.forEach((pos, entityId) => {
      ctx.save();
      this.engine.canvas.save();
      const { x, y } = pos as Position;
      const type = stateStore.type.get(entityId);
      console.log(
        `  绘制实体 ${entityCount++}: ${entityId}, 类型: ${type}, 位置: (${x}, ${y})`
      );
      ctx.translate(x, y);
      this.engine.canvas.translate(x, y);

      // 中心原点应该是图形的中心点
      this.drawShape(stateStore, entityId);
      this.engine.canvas.restore();
      ctx.restore();
    });
  }

  update(stateStore: StateStore) {
    this.renderer(stateStore, this.ctx);
  }

  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}
