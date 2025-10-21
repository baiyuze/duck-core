import type { Selected } from "../Components/Selected";
import type { Engine } from "../Core/Engine";
import { Entity } from "../Entity/Entity";
import { EventType } from "../enum";
import type { PickEntity, StateStore } from "../types";
import { System } from "./System";
export class PickingSystem extends System {
  engine: Engine;
  ctx: CanvasRenderingContext2D;
  offCtx: CanvasRenderingContext2D;
  entityManager: Entity = new Entity();
  stateStore: StateStore | null = null;
  isClearHover: boolean = false;
  isRendered: boolean = false;
  offscreenCanvas: HTMLCanvasElement | null = null;
  constructor(ctx: CanvasRenderingContext2D, engine: Engine) {
    super();
    this.ctx = ctx;
    this.engine = engine;
    this.offCtx = this.initOffscreenCanvas() as CanvasRenderingContext2D;
    // ctx.canvas.addEventListener("click", this.onClick.bind(this));
  }

  initOffscreenCanvas() {
    const { width, height } = this.ctx.canvas;
    const offscreenCanvas = document.createElement("canvas");
    this.offscreenCanvas = offscreenCanvas;
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;

    return offscreenCanvas.getContext("2d", {
      willReadFrequently: true,
    });
  }

  render(stateStore: StateStore) {
    if (!this.offCtx) return;
    const ctx = this.offCtx;

    // 每帧先清空画布
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 遍历所有 position 组件的实体
    stateStore.position.forEach((pos, entityId) => {
      ctx.save();
      // const { x, y } = pos;
      // ctx.translate(x, y);
      // 获取实体的 size 组件
      const size = stateStore.size.get(entityId);
      // 离屏渲染颜色
      const fillColor = this.entityManager.getColorById(entityId);

      ctx.fillStyle = fillColor;
      if (size) {
        ctx.fillRect(pos.x, pos.y, size.width, size.height);
      }
      ctx.restore();
    });
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
    const rect = this.ctx.canvas.getBoundingClientRect();
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
    this.ctx = null as any;
    // this.dispose();
  }
}
