import type { Engine } from "../Core/Engine";
import { Entity } from "../Entity/Entity";
import { EventType, systemEum } from "../enum";
import type { StateStore } from "../types";
import type { RenderSystem } from "./OffsetSystem";
import type { PickingSystem } from "./PickingSystem";
import type { SelectionSystem } from "./SelectionSystem";
import { System } from "./System";
export class DragSystem extends System {
  engine: Engine;
  entityManager: Entity = new Entity();
  stateStore: StateStore | null = null;
  isMouseDown: boolean = false;
  isMouseMove: boolean = false;
  isMouseUp: boolean = false;
  offset: { x: number; y: number } = { x: 0, y: 0 };
  dragStarted: boolean = false; // 标记是否已经开始拖拽
  constructor(engine: Engine) {
    super();
    this.engine = engine;
  }

  update(stateStore: StateStore) {
    if (this.engine.config.drag?.enabled) {
      this.stateStore = stateStore;
      this.onDrag();
    }
  }

  onDrag() {
    const pickSystem = this.engine.getSystemByName<PickingSystem>(
      systemEum.PickingSystem
    );
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
      this.isMouseMove = false;
      this.dragStarted = false;
    }
    if (pickSystem.checkEventTypeIsMatch(EventType.MouseMove)) {
      this.isMouseMove = true;
      if (this.isMouseDown) {
        this.engine.core.isDragging = true;
      }
    }
    if (pickSystem.checkEventTypeIsMatch(EventType.MouseUp)) {
      this.engine.core.isDragging = false;
      this.isMouseUp = true;
      this.isMouseDown = false;
      this.isMouseMove = false;
    }

    // 鼠标按下但还没有移动时，初始化拖拽
    if (this.isMouseDown && !this.dragStarted) {
      this.onDragStart(pickSystem);
      this.dragStarted = true;
    }

    // 鼠标按下并移动时，执行拖拽
    if (this.isMouseDown && this.isMouseMove && this.dragStarted) {
      this.onDragShape(pickSystem);
    }

    // 鼠标抬起时，结束拖拽
    if (this.isMouseUp && this.dragStarted) {
      this.onDragEnd();
      this.dragStarted = false;
    }
  }

  onDragStart(pickSystem: PickingSystem) {
    const selectedEntitys = pickSystem.getCurrentPickSelectedEntitys();
    if (!this.stateStore || !selectedEntitys) return;
    const eventQueue = this.stateStore.eventQueue;
    const lastEvent = eventQueue[eventQueue.length - 1];

    // 获取画布坐标（不是屏幕坐标）
    const rect = this.engine.canvasDom!.getBoundingClientRect();
    const { zoom, translateX, translateY } = this.engine.camera;
    const canvasX = lastEvent.event.clientX - rect.left;
    const canvasY = lastEvent.event.clientY - rect.top;
    // worldX = (ScreenX - TranslateX) / Zoom
    // $$\text{WorldX} = \frac{\text{ScreenX} - \text{TranslateX}}{\text{Zoom}}$$
    selectedEntitys.forEach((pickEntity) => {
      const position = this.stateStore!.position.get(pickEntity.entityId);
      if (position) {
        // 计算鼠标在元素内的偏移量 translateX 不参与后续的scale计算，先要减去translate
        this.offset.x = (canvasX - translateX) / zoom - position.x;
        this.offset.y = (canvasY - translateY) / zoom - position.y;
      }
    });
  }

  onDragShape(pickSystem: PickingSystem) {
    const selectedEntitys = pickSystem.getCurrentPickSelectedEntitys();
    if (!this.stateStore || !selectedEntitys) return;
    const eventQueue = this.stateStore.eventQueue;
    const lastEvent = eventQueue[eventQueue.length - 1];

    // 获取当前鼠标的画布坐标
    const rect = this.engine.canvasDom!.getBoundingClientRect();

    const { zoom, translateX, translateY } = this.engine.camera;
    const canvasX = lastEvent.event.clientX - rect.left;
    const canvasY = lastEvent.event.clientY - rect.top;
    selectedEntitys.forEach((pickEntity) => {
      const position = this.stateStore!.position.get(pickEntity.entityId);

      if (position) {
        // 计算鼠标在元素内的偏移量 translateX 不参与后续的scale计算，先要减去translate
        // 新位置 = 当前鼠标在画布位置 - 初始偏移量
        position.x = (canvasX - translateX) / zoom - this.offset.x;
        position.y = (canvasY - translateY) / zoom - this.offset.y;
      }
    });
  }

  onDragEnd() {
    const pickSystem = this.engine.getSystemByName<PickingSystem>(
      systemEum.PickingSystem
    );
    if (!pickSystem) return;

    const selectedEntitys = pickSystem.getCurrentPickSelectedEntitys();
    if (!this.stateStore || !selectedEntitys) return;

    // 记录拖拽结束时的最终位置
    const finalPositions: { entityId: string; x: number; y: number }[] = [];
    selectedEntitys.forEach((pickEntity) => {
      const position = this.stateStore!.position.get(pickEntity.entityId);
      if (position) {
        finalPositions.push({
          entityId: pickEntity.entityId,
          x: position.x,
          y: position.y,
        });
      }
    });

    this.offset = { x: 0, y: 0 };

    this.onDragEndEvent(selectedEntitys, finalPositions);
  }

  private onDragEndEvent(
    _selectedEntitys: any[],
    finalPositions: { entityId: string; x: number; y: number }[]
  ) {}
}
