import type { Core } from "../Core";
import { Entity } from "../Entity/Entity";
import { EventType } from "../enum";
import type { StateStore } from "../types";
import { System } from "./System";
export class PickingSystem extends System {
  core: Core;
  ctx: CanvasRenderingContext2D;
  offCtx: CanvasRenderingContext2D;
  entityManager: Entity = new Entity();
  stateStore: StateStore | null = null;
  isClearHover: boolean = false;
  isRendered: boolean = false;
  constructor(ctx: CanvasRenderingContext2D, core: Core) {
    super();
    this.ctx = ctx;
    this.core = core;
    this.offCtx = this.initOffscreenCanvas() as CanvasRenderingContext2D;
    // ctx.canvas.addEventListener("click", this.onClick.bind(this));
  }

  initOffscreenCanvas() {
    const { width, height } = this.ctx.canvas;
    const offscreenCanvas = document.createElement("canvas");
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
    this.onClick();
    this.onHover();
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
    this.stateStore.eventQueue.pop();
    const rect = this.ctx.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    return { x, y };
  }

  /**
   * 隐藏画布选择
   * @param event
   * @returns
   */
  setSelected(colorId?: number[]) {
    if (!colorId) return;
    if (!this.stateStore) return;
    const { selected, entityId } = this.getSelectedByColorId(colorId);
    console.log(entityId, "entityId");

    if (selected) selected.value = true;
    // 单选
    if (!this.core.multiple) {
      this.stateStore.selected.forEach((sel, id) => {
        if (id !== entityId) {
          sel.value = false;
        }
      });
    }
    // 直接清空所有，重新渲染状态
  }

  /**
   * 清空选中状态
   * @returns
   */
  clearSelectedState() {
    if (!this.stateStore) return;
    this.stateStore.selected.forEach((sel) => {
      sel.value = false;
    });
  }
  /**
   * 清空hover状态
   * @returns
   */
  clearHoverState() {
    if (!this.stateStore) return;
    this.stateStore.selected.forEach((sel) => {
      sel.hovered = false;
    });
  }

  clear() {
    this.clearSelectedState();
    this.clearHoverState();
  }

  onClick() {
    if (!this.stateStore) return;
    const position = this.getPosition(EventType.Click);
    if (!position) return;
    const { x, y } = position;
    const colorId = this.getColorId(x, y);
    if (colorId && colorId[3] === 0) {
      // 清空选择
      this.clear();
      return;
    }
    this.setSelected(colorId);
  }
  /**
   * 修改hover状态
   * @param event
   * @returns
   */
  setHoverState(colorId?: number[], hovered: boolean = false) {
    if (!colorId) return;
    if (!this.stateStore) return;
    // 根据颜色获取实体id
    if (hovered) {
      const { selected, entityId } = this.getSelectedByColorId(colorId);
      if (selected) selected.hovered = true;
      // 单选
      this.stateStore.selected.forEach((sel, id) => {
        if (id !== entityId) {
          sel.hovered = false;
        }
      });
    } else {
      //清空hover状态
      this.clearHoverState();
    }
  }
  onHover() {
    const position = this.getPosition(EventType.MouseMove);
    if (!position) return;
    const { x, y } = position;
    const colorId = this.getColorId(x, y);
    const isNull = !colorId || colorId[3] === 0;
    if (this.isClearHover && isNull) return;
    if (colorId && isNull) {
      this.isClearHover = true;
      return this.setHoverState(colorId, false);
    }
    this.isClearHover = false;
    this.setHoverState(colorId, true);
  }
}
