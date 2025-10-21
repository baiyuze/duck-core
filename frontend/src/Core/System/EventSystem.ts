import type { Engine } from "../Core/Engine";
import { Entity } from "../Entity/Entity";
import type { StateStore } from "../types";
import type { ClickSystem } from "./ClickSystem";
import type { DragSystem } from "./DragSystem";
import type { HoverSystem } from "./HoverSystem";
import type { SelectionSystem } from "./SelectionSystem";
import { System } from "./System";
import { throttle } from "lodash";

export class EventSystem extends System {
  engine: Engine;
  ctx: CanvasRenderingContext2D;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  stateStore: StateStore | null = null;
  throttledMouseMove: ReturnType<typeof throttle>;

  constructor(ctx: CanvasRenderingContext2D, engine: Engine) {
    super();
    this.ctx = ctx;
    this.engine = engine;
    this.dispose();
    this.throttledMouseMove = throttle(this.onMouseMove.bind(this), 16);
    ctx.canvas.addEventListener("click", this.onClick.bind(this));
    ctx.canvas.addEventListener("mouseup", this.onMouseUp.bind(this));
    ctx.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mousemove", this.throttledMouseMove);
  }

  dispose() {
    this.ctx.canvas.removeEventListener("click", this.onClick.bind(this));
    document.removeEventListener("mousemove", this.throttledMouseMove);
    this.ctx.canvas.removeEventListener("mouseup", this.onMouseUp.bind(this));
    this.ctx.canvas.removeEventListener(
      "mousedown",
      this.onMouseDown.bind(this)
    );
    this.throttledMouseMove?.cancel();
  }

  onMouseUp(event: MouseEvent) {
    if (!this.stateStore) return;
    this.stateStore.eventQueue.push({
      type: "mouseup",
      event,
    });
    this.render();
  }
  onMouseDown(event: MouseEvent) {
    if (!this.stateStore) return;
    this.stateStore.eventQueue.push({
      type: "mousedown",
      event,
    });
    this.render();
  }

  nextTick(cb: () => void) {
    return Promise.resolve().then(cb);
  }

  update(stateStore: StateStore) {
    this.stateStore = stateStore;
  }

  render() {
    const engine = this.engine;
    const selectionSystem =
      engine.getSystemByName<SelectionSystem>("SelectionSystem");
    const hoverSystem = engine.getSystemByName<HoverSystem>("HoverSystem");
    const clickSystem = engine.getSystemByName<ClickSystem>("ClickSystem");
    const dragSystem = engine.getSystemByName<DragSystem>("DragSystem");

    if (!this.stateStore) return;
    if (hoverSystem) {
      hoverSystem.update(this.stateStore);
    }
    if (clickSystem) {
      clickSystem.update(this.stateStore);
    }
    if (selectionSystem) {
      selectionSystem.update(this.stateStore);
    }
    if (dragSystem) {
      dragSystem.update(this.stateStore);
    }
    this.stateStore.eventQueue = [];
  }
  /**
   * 点击
   * @param event MouseEvent
   * @returns
   */
  onClick(event: MouseEvent) {
    if (!this.stateStore) return;
    this.stateStore.eventQueue = [
      {
        type: "click",
        event,
      },
    ];
    this.render();
  }
  onMouseMove(event: MouseEvent) {
    if (!this.stateStore) return;
    if (this.stateStore.eventQueue.length) return;
    this.stateStore.eventQueue = [{ type: "mousemove", event }];
    this.render();
  }

  destroyed(): void {
    this.dispose();
    this.offCtx = null;
    this.stateStore = null;
    this.entityManager = null as any;
    this.engine = null as any;
    this.ctx = null as any;
  }
}
