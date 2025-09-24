import type { Core } from "../Core";
import { Entity } from "../Entity/Entity";
import type { ComponentStore } from "../types";
import { System } from "./System";
import { throttle } from "lodash";

export class EventSystem extends System {
  core: Core;
  ctx: CanvasRenderingContext2D;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  components: ComponentStore | null = null;
  constructor(ctx: CanvasRenderingContext2D, core: Core) {
    super();
    this.ctx = ctx;
    this.core = core;
    ctx.canvas.addEventListener("click", this.onClick.bind(this));
    ctx.canvas.addEventListener(
      "mousemove",
      throttle(this.onMouseMove.bind(this), 96)
    );
  }

  nextTick(cb: () => void) {
    return Promise.resolve().then(cb);
  }

  update(components: ComponentStore) {
    this.components = components;
  }

  render() {
    const pickingSystem = this.core.getSystemByName("PickingSystem");
    const selectionSystem = this.core.getSystemByName("SelectionSystem");
    this.nextTick(() => {
      if (!this.components) return;
      if (pickingSystem) {
        pickingSystem.update(this.components);
      }
      if (selectionSystem) {
        selectionSystem.update(this.components);
      }
      this.components.eventQueue = [];
    });
  }
  /**
   * 点击
   * @param event MouseEvent
   * @returns
   */
  onClick(event: MouseEvent) {
    if (!this.components) return;
    this.components.eventQueue.push({
      type: "click",
      event,
    });
    this.render();
  }
  onMouseMove(event: MouseEvent) {
    // 加一个节流
    if (!this.components) return;
    if (this.components.eventQueue.length) return;
    this.components.eventQueue.push({ type: "mousemove", event });
    // console.log(this.components.eventQueue.length, "-->");
    this.render();
  }
}
