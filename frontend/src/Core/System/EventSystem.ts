import type { Engine } from "../Core/Engine";
import { Entity } from "../Entity/Entity";
import type { StateStore } from "../types";
import { System } from "./System";
import { throttle } from "lodash";
export class EventSystem extends System {
  engine: Engine;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  stateStore: StateStore | null = null;
  throttledMouseMove: ReturnType<typeof throttle>;
  throttledWheel: ReturnType<typeof throttle> | null = null;
  isMouseDown: boolean = false;
  isMouseMoving: boolean = false;

  constructor(engine: Engine) {
    super();
    this.engine = engine;
    this.dispose();
    this.throttledMouseMove = throttle(this.onMouseMove.bind(this), 10);
    this.throttledWheel = throttle(this.onWheel.bind(this), 10);
    document.addEventListener("mouseup", this.onMouseUp.bind(this));
    this.engine.canvasDom!.addEventListener(
      "mousedown",
      this.onMouseDown.bind(this)
    );
    document.addEventListener("mousemove", this.throttledMouseMove);
    this.engine.canvasDom!.addEventListener("wheel", this.throttledWheel, {
      passive: false,
    });
  }

  dispose() {
    // this.ctx.canvas.removeEventListener("click", this.onClick.bind(this));
    document.removeEventListener("mousemove", this.throttledMouseMove);
    document.removeEventListener("mouseup", this.onMouseUp.bind(this));
    this.engine.canvasDom!.removeEventListener(
      "mousedown",
      this.onMouseDown.bind(this)
    );
    this.engine.canvasDom!.removeEventListener(
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
    this.isMouseDown = false;
    this.isMouseMoving = false;
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
    this.isMouseDown = true;
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
  /**
   * 设置鼠标是否在画布中
   * @param event
   */
  checkMouseIsCanvas(event?: MouseEvent): boolean {
    if (!this.engine.canvasDom) return false;

    const rect = this.engine.canvasDom.getBoundingClientRect();

    if (event) {
      const x = event.clientX;
      const y = event.clientY;
      return (
        x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom
      );
    }

    return this.engine.canvasDom.matches(":hover");
  }
  onMouseMove(event: MouseEvent) {
    if (!this.stateStore) return;
    this.stateStore.eventQueue = [{ type: "mousemove", event }];
    if (this.engine.core.isDragging) {
      this.engine.dirtyRender = true;
    }
    const hasMouseInCanvas = this.checkMouseIsCanvas();
    if (!hasMouseInCanvas) return;
    this.isMouseMoving = true;
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
  }
}
