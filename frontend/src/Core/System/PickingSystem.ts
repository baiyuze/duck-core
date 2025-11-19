import type { Position, Size } from "../Components";
import type { Selected } from "../Components/Selected";
import type { Engine } from "../Core/Engine";
import { Entity } from "../Entity/Entity";
import { EventType } from "../enum";
import type { PickEntity, StateStore } from "../types";
import { System } from "./System";
export class PickingSystem extends System {
  engine: Engine;
  offCtx: CanvasRenderingContext2D;
  entityManager: Entity = new Entity();
  stateStore: StateStore | null = null;
  isClearHover: boolean = false;
  isRendered: boolean = false;
  offscreenCanvas: HTMLCanvasElement | null = null;
  constructor(engine: Engine) {
    super();
    this.engine = engine;
    this.offCtx = this.initOffscreenCanvas() as CanvasRenderingContext2D;
  }

  initOffscreenCanvas() {
    const { width, height } = this.engine.canvasDom!;
    const offscreenCanvas = document.createElement("canvas");
    this.offscreenCanvas = offscreenCanvas;
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    // this.engine.canvasDom?.parentElement?.appendChild(offscreenCanvas);
    return offscreenCanvas.getContext("2d", {
      willReadFrequently: true,
    });
  }

  /**
   * 获取可视区域边界（世界坐标系）
   */
  getViewport() {
    const { camera, defaultConfig } = this.engine;
    const zoom = camera.zoom;

    // 将画布坐标转换为世界坐标
    const left = -camera.translateX / zoom;
    const top = -camera.translateY / zoom;
    const right = left + defaultConfig.width / zoom;
    const bottom = top + defaultConfig.height / zoom;

    return { left, top, right, bottom };
  }

  /**
   * 判断实体是否在可视区域内
   */
  isInViewport(
    position: Position,
    size: Size | undefined,
    viewport: ReturnType<typeof this.getViewport>
  ): boolean {
    const { x, y } = position;
    const width = size?.width || 0;
    const height = size?.height || 0;

    // 实体的边界框
    const entityLeft = x;
    const entityTop = y;
    const entityRight = x + width;
    const entityBottom = y + height;

    // 判断是否有交集（使用边界框碰撞检测）
    return !(
      entityRight < viewport.left ||
      entityLeft > viewport.right ||
      entityBottom < viewport.top ||
      entityTop > viewport.bottom
    );
  }

  render(stateStore: StateStore) {
    if (!this.offCtx) return;
    const ctx = this.offCtx;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.save();
    ctx.translate(this.engine.camera.translateX, this.engine.camera.translateY);
    ctx.scale(this.engine.camera.zoom, this.engine.camera.zoom);
    const viewport = this.getViewport();

    // 遍历所有 position 组件的实体
    stateStore.position.forEach((pos, entityId) => {
      const size = stateStore.size.get(entityId);
      // 只渲染可视区域内的实体
      if (!this.isInViewport(pos, size, viewport)) {
        return;
      }
      ctx.save();
      // 获取实体的 size 组件
      // 离屏渲染颜色
      const fillColor = this.entityManager.getColorById(entityId);
      ctx.fillStyle = fillColor;
      if (size) {
        ctx.fillRect(pos.x, pos.y, size.width, size.height);
      }
      ctx.restore();
    });
    ctx.restore();
  }

  update(stateStore: StateStore) {
    this.stateStore = stateStore;
    this.render(stateStore);
  }
  /**
   * 根据ID获取选中状态
   * @param id
   * @returns
   */
  onSelectedById(id: string) {
    if (!this.stateStore) return;
    return this.stateStore.selected.get(id);
  }
  /**
   * 根据颜色获取选中实体
   * @param colorId
   * @returns
   */
  getSelectedByColorId(colorId: number[]) {
    const entityId = this.entityManager.rgbaToId(colorId);
    const selected = this.stateStore!.selected.get(entityId);
    return { selected, entityId };
  }

  /**
   * 根据坐标获取ColorId
   * @param x
   * @param y
   * @returns
   */
  getColorId(x: number, y: number) {
    if (!this.offCtx) return;

    const pixel: ImageData = this.offCtx.getImageData(x, y, 1, 1);
    const [r, g, b, a] = pixel.data;
    return [r, g, b, a];
  }
  /**
   * 获取鼠标位置
   */
  getPosition(
    eventType: EventType[keyof EventType]
  ): { x: number; y: number } | undefined {
    if (!this.stateStore) return;
    const coreEvent =
      this.stateStore.eventQueue[this.stateStore.eventQueue.length - 1];

    if (!coreEvent) return;
    const { type, event } = coreEvent;
    if (!event) return;
    if (type !== eventType) return;
    // 暂时一次只有一个事件
    const rect = this.engine.canvasDom!.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  }
  /**
   * 获取拾取结果，返回选中状态和实体ID
   * @param x
   * @param y
   * @returns
   */
  pick(x: number, y: number): PickEntity | null {
    const colorId = this.getColorId(x, y);
    if (!colorId) return null;
    const { selected, entityId } = this.getSelectedByColorId(colorId);
    if (!selected) return null;
    return { selected, entityId };
  }
  /**
   * 根据事件类型获取实体
   * @param eventType
   * @returns PickEntity | null
   */
  getEntityByEvent(eventType: EventType[keyof EventType]): PickEntity | null {
    const position = this.getPosition(eventType);
    if (!position) return null;
    const { x, y } = position;
    const pickEntity = this.pick(x, y);
    return pickEntity;
  }
  /**
   * 检查事件类型是否匹配
   * @param eventType - 单个事件类型
   * @param eventTypes - 多个事件类型（数组或联合）
   * @returns 是否匹配
   */
  checkEventTypeIsMatch(
    eventType: EventType[keyof EventType] | EventType[keyof EventType][]
  ): boolean {
    if (!this.stateStore) return false;
    const eventQueue = this.stateStore.eventQueue;
    if (eventQueue.length === 0) return false;
    const lastEventType = eventQueue[eventQueue.length - 1]?.type;
    if (Array.isArray(eventType)) {
      return eventType.includes(lastEventType);
    }
    if (lastEventType !== eventType) return false;
    return true;
  }
  /**
   * 获取当前选中的实体
   * @returns
   */
  getCurrentPickSelectedEntitys(): PickEntity[] | null {
    if (!this.stateStore) return null;
    const selectedEntitys: PickEntity[] = [];
    this.stateStore.selected.forEach((sel, id) => {
      if (sel.value) {
        selectedEntitys.push({ selected: sel, entityId: id });
      }
    });
    return selectedEntitys.length > 0 ? selectedEntitys : null;
  }

  destroyed(): void {
    this.offscreenCanvas = null;
    this.offCtx = null as any;
    this.stateStore = null;
    this.entityManager = null as any;
    this.engine = null as any;
  }
}
