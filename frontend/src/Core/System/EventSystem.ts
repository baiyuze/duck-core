import type { Core } from "../Core";
import { Entity } from "../Entity/Entity";
import type { StateStore } from "../types";
import { System } from "./System";
import { throttle } from "lodash";

export class EventSystem extends System {
  core: Core;
  ctx: CanvasRenderingContext2D;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  stateStore: StateStore | null = null;
  throttledMouseMove: ReturnType<typeof throttle>;

  constructor(ctx: CanvasRenderingContext2D, core: Core) {
    super();
    this.ctx = ctx;
    this.core = core;
    this.dispose();
    this.throttledMouseMove = throttle(this.onMouseMove.bind(this), 96);
    ctx.canvas.addEventListener("click", this.onClick.bind(this));
    ctx.canvas.addEventListener("mousemove", this.throttledMouseMove);
  }

  dispose() {
    this.ctx.canvas.removeEventListener("click", this.onClick.bind(this));
    this.ctx.canvas.removeEventListener("mousemove", this.throttledMouseMove);
    this.throttledMouseMove?.cancel();
  }

  nextTick(cb: () => void) {
    return Promise.resolve().then(cb);
  }

  update(stateStore: StateStore) {
    this.stateStore = stateStore;
  }

  render() {
    const pickingSystem = this.core.getSystemByName("PickingSystem");
    const selectionSystem = this.core.getSystemByName("SelectionSystem");
    this.nextTick(() => {
      if (!this.stateStore) return;
      if (pickingSystem) {
        pickingSystem.update(this.stateStore);
      }
      if (selectionSystem) {
        selectionSystem.update(this.stateStore);
      }
      this.stateStore.eventQueue = [];
    });
  }
  /**
   * 点击
   * @param event MouseEvent
   * @returns
   */
  onClick(event: MouseEvent) {
    if (!this.stateStore) return;
    this.stateStore.eventQueue.push({
      type: "click",
      event,
    });
    this.render();
  }
  onMouseMove(event: MouseEvent) {
    // 加一个节流
    if (!this.stateStore) return;
    if (this.stateStore.eventQueue.length) return;
    this.stateStore.eventQueue.push({ type: "mousemove", event });
    this.render();
  }
}
