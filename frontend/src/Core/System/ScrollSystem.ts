import type { Engine } from "../Core/Engine";
import type { DSL } from "../DSL/DSL";
import { Entity } from "../Entity/Entity";
import type { StateStore } from "../types";
import { System } from "./System";

export class ScrollSystem extends System {
  engine: Engine;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  constructor(engine: Engine) {
    super();
    this.engine = engine;
  }

  update(stateStore: StateStore) {
    if (stateStore.eventQueue.length === 0) return;
    const { type, event } =
      stateStore.eventQueue[stateStore.eventQueue.length - 1];
    if (type !== "scroll" || !(event instanceof WheelEvent)) return;
    const camera = this.engine.camera;
    const { deltaY, deltaX } = event;
    // 灵敏度
    const scrollSensitivity = 1;

    if (event.shiftKey) {
      // 按住shift键时，纵向滚动变为横向滚动
      if (deltaY !== 0) {
        camera.translateX -= deltaY * scrollSensitivity;
      }
    } else {
      if (deltaY !== 0) {
        // 支持X轴和Y轴滚动
        camera.translateY -= deltaY * scrollSensitivity;
      }
      if (deltaX !== 0) {
        camera.translateX -= deltaX * scrollSensitivity;
      }
    }

    this.engine.dirtyRender = true;
  }
}
