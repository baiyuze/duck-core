import { isNil } from "lodash";
import type { Engine } from "../Core/Engine";
import { Entity } from "../Entity/Entity";
import type { StateStore } from "../types";
import { System } from "./System";

export class ScrollSystem extends System {
  engine: Engine;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  private readonly scrollSensitivity = 1;

  constructor(engine: Engine) {
    super();
    this.engine = engine;
  }

  /**
   * 计算带缩放的边界值
   */
  private calculateRealBoundary(
    min: number | null | undefined,
    max: number | null | undefined,
    zoom: number
  ): { realMin: number; realMax: number } {
    return {
      realMin: isNil(min) ? 0 : min * zoom,
      realMax: isNil(max) ? 0 : max * zoom,
    };
  }

  /**
   * 应用滚动并限制在边界内
   */
  private applyScrollWithBoundary(
    currentValue: number,
    delta: number,
    min: number | null | undefined,
    max: number | null | undefined,
    realMin: number,
    realMax: number
  ): number {
    const newValue = currentValue - delta * this.scrollSensitivity;

    if (!isNil(min) && !isNil(max)) {
      return Math.max(-realMax, Math.min(-realMin, newValue));
    }

    return newValue;
  }

  update(stateStore: StateStore) {
    if (stateStore.eventQueue.length === 0) return;

    const { type, event } =
      stateStore.eventQueue[stateStore.eventQueue.length - 1];

    if (type !== "scroll" || !(event instanceof WheelEvent)) return;

    const camera = this.engine.camera;
    const { deltaY, deltaX } = event;
    const { minX, maxX, minY, maxY, zoom } = camera;

    // 计算实际边界值
    const { realMin: realMinX, realMax: realMaxX } = this.calculateRealBoundary(
      minX,
      maxX,
      zoom
    );
    const { realMin: realMinY, realMax: realMaxY } = this.calculateRealBoundary(
      minY,
      maxY,
      zoom
    );

    if (event.shiftKey) {
      // 按住shift键时,纵向滚动变为横向滚动
      if (deltaY !== 0) {
        camera.translateX = this.applyScrollWithBoundary(
          camera.translateX,
          deltaY,
          minX,
          maxX,
          realMinX,
          realMaxX
        );
      }
    } else {
      // 纵向滚动
      if (deltaY !== 0) {
        camera.translateY = this.applyScrollWithBoundary(
          camera.translateY,
          deltaY,
          minY,
          maxY,
          realMinY,
          realMaxY
        );
      }
      // 横向滚动
      if (deltaX !== 0) {
        camera.translateX = this.applyScrollWithBoundary(
          camera.translateX,
          deltaX,
          minX,
          maxX,
          realMinX,
          realMaxX
        );
      }
    }

    this.engine.dirtyRender = true;
  }
}
