import type { Engine } from "../Core/Engine";
import { Entity } from "../Entity/Entity";
import type { StateStore } from "../types";
import type { ClickSystem } from "./ClickSystem";
import type { DragSystem } from "./DragSystem";
import type { HoverSystem } from "./HoverSystem";
import type { SelectionSystem } from "./SelectionSystem";
import { System } from "./System";
import { throttle } from "lodash";
import type { ZoomSystem } from "./ZoomSystem";

export class EventSystem extends System {
  engine: Engine;
  ctx: CanvasRenderingContext2D;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  stateStore: StateStore | null = null;
  throttledMouseMove: ReturnType<typeof throttle>;
  throttledWheel: ReturnType<typeof throttle> | null = null;

  constructor(ctx: CanvasRenderingContext2D, engine: Engine) {
    super();
    this.ctx = ctx;
    this.engine = engine;
    this.dispose();
    this.throttledMouseMove = throttle(this.onMouseMove.bind(this), 16);
    this.throttledWheel = throttle(this.onWheel.bind(this), 3);
    // this.throttledWheel = throttle(this.onWheel.bind(this), 16);
    // ctx.canvas.addEventListener("click", this.onClick.bind(this));
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
    ctx.canvas.addEventListener("mousedown", this.onMouseDown.bind(this));
    document.addEventListener("mousemove", this.throttledMouseMove);
    // Listen for wheel events to support zooming. passive:false so we can preventDefault()
    this.ctx.canvas.addEventListener("wheel", this.throttledWheel, {
      passive: false,
    });
  }

  dispose() {
    // this.ctx.canvas.removeEventListener("click", this.onClick.bind(this));
    document.removeEventListener("mousemove", this.throttledMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp.bind(this));
    this.ctx.canvas.removeEventListener(
      "mousedown",
      this.onMouseDown.bind(this)
    );
    this.ctx.canvas.removeEventListener(
      "wheel",
      this.throttledWheel as EventListener
    );
    this.throttledMouseMove?.cancel();
    this.throttledWheel?.cancel();
  }

  onMouseUp(event: MouseEvent) {
    if (!this.stateStore) return;
    this.stateStore.eventQueue = [
      {
        type: "mouseup",
        event,
      },
    ];
    this.engine.requestFrame();
  }
  onMouseDown(event: MouseEvent) {
    if (!this.stateStore) return;
    this.stateStore.eventQueue = [
      {
        type: "mousedown",
        event,
      },
    ];
    this.engine.requestFrame();
  }

  nextTick(cb: () => void) {
    return Promise.resolve().then(cb);
  }

  update(stateStore: StateStore) {
    this.stateStore = stateStore;
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
    this.engine.requestFrame();
  }
  onMouseMove(event: MouseEvent) {
    // 只有数据进行变化的时候，才需要调用renderSystem，其他只需要render其他系统即可
    if (!this.stateStore) return;
    this.stateStore.eventQueue = [{ type: "mousemove", event }];
    if (this.engine.core.isDragging) {
      this.engine.dirtyRender = true;
    }
    this.engine.requestFrame();
  }

  /**
   * Wheel event: used for zoom in/out
   */
  onWheel(event: WheelEvent) {
    if (!this.stateStore) return;
    try {
      event.preventDefault();
    } catch (e) {
      console.error(e);
    }

    let eventType: string;
    const eventKey = window.navigator.userAgent.toLowerCase().includes("mac")
      ? "metaKey"
      : "ctrlKey";
    if (event[eventKey] || event.ctrlKey) {
      eventType = "zoom";
    } else {
      eventType = "scroll";
    }
    this.stateStore.eventQueue = [{ type: eventType, event: event as any }];
    this.engine.requestFrame();
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
