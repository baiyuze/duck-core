import type { Core } from "../Core";
import { Entity } from "../Entity/Entity";
import { EventType } from "../enum";
import type { StateStore } from "../types";
import type { RenderSystem } from "./OffsetSystem";
import type { PickingSystem } from "./PickingSystem";
import { System } from "./System";
export class DragSystem extends System {
  core: Core;
  ctx: CanvasRenderingContext2D;
  entityManager: Entity = new Entity();
  stateStore: StateStore | null = null;
  isMouseDown: boolean = false;
  isMouseMove: boolean = false;
  isMouseUp: boolean = false;
  constructor(ctx: CanvasRenderingContext2D, core: Core) {
    super();
    this.ctx = ctx;
    this.core = core;
  }

  update(stateStore: StateStore) {
    this.stateStore = stateStore;
    this.onDrag();
  }

  onDrag() {
    const pickSystem =
      this.core.getSystemByName<PickingSystem>("PickingSystem");
    if (!pickSystem) return;
    if (
      pickSystem.checkEventTypeIsMatch([
        EventType.MouseUp,
        EventType.MouseMove,
        EventType.MouseDown,
      ]) === false
    )
      return;
    if (pickSystem.checkEventTypeIsMatch(EventType.MouseDown)) {
      this.isMouseUp = false;
      this.isMouseDown = true;
    }
    if (pickSystem.checkEventTypeIsMatch(EventType.MouseMove)) {
      this.isMouseMove = true;
      this.core.isDragging = true;
    }
    if (pickSystem.checkEventTypeIsMatch(EventType.MouseUp)) {
      this.core.isDragging = false;
      this.isMouseUp = true;
      this.isMouseDown = false;
      this.isMouseMove = false;
    }
    console.log(this.isMouseDown, this.isMouseMove, this.isMouseUp, "---->");
    if (this.isMouseDown && this.isMouseMove && !this.isMouseUp) {
      // 拖拽中
      this.onDragShape(pickSystem);
    }
  }

  onDragShape(pickSystem: PickingSystem) {
    const renderSystem =
      this.core.getSystemByName<RenderSystem>("RenderSystem");
    const selectedEntitys = pickSystem.getCurrentPickSelectedEntitys();
    if (!this.stateStore || !selectedEntitys) return;
    const eventQueue = this.stateStore.eventQueue;
    const lastEvent = eventQueue[eventQueue.length - 1];
    console.log(selectedEntitys, "selectedEntitys");
    selectedEntitys.forEach((pickEntity) => {
      const position = this.stateStore!.position.get(pickEntity.entityId);

      if (position) {
        position.x = lastEvent.event.x;
        position.y = lastEvent.event.y;
        console.log(position, "-----=>");
      }
    });
    if (renderSystem) {
      renderSystem?.update(this.stateStore);
    }
  }
}
