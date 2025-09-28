import type { Core } from "../Core";
import { Entity } from "../Entity/Entity";
import { EventType } from "../enum";
import type { ComponentStore } from "../types";
import { System } from "./System";
export class PickingSystem extends System {
  core: Core;
  ctx: CanvasRenderingContext2D;
  offCtx: CanvasRenderingContext2D;
  entityManager: Entity = new Entity();
  components: ComponentStore | null = null;
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

    return offscreenCanvas.getContext("2d");
  }

  render(components: ComponentStore) {
    console.log("picking render");
    if (!this.offCtx) return;
    const ctx = this.offCtx;

    console.log("picking render");
    // 每帧先清空画布
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    // 遍历所有 position 组件的实体
    components.position.forEach((pos, entityId) => {
      const size = components.size.get(entityId);
      // 离屏渲染颜色
      const fillColor = this.entityManager.getColorById(entityId);

      ctx.fillStyle = fillColor;
      if (size) {
        ctx.fillRect(pos.x, pos.y, size.width, size.height);
      }
    });
  }

  update(components: ComponentStore) {
    this.components = components;
    // render只执行一次
    if (!this.isRendered) {
      this.isRendered = true;
      this.render(components);
    }
    this.onClick();
    this.onHover();
  }
  /**
   * 根据ID获取选中状态
   * @param id
   * @returns
   */
  onSelectedById(id: string) {
    if (!this.components) return;
    return this.components.selected.get(id);
  }
  /**
   * 根据颜色获取选中实体
   * @param colorId
   * @returns
   */
  getSelectedByColorId(colorId: number[]) {
    const entityId = this.entityManager.rgbaToId(colorId);
    const selected = this.components!.selected.get(entityId);
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
    if (!this.components) return;
    const coreEvent =
      this.components.eventQueue[this.components.eventQueue.length - 1];

    if (!coreEvent) return;
    const { type, event } = coreEvent;
    if (!event) return;
    if (type !== eventType) return;
    this.components.eventQueue.pop();
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
    if (!this.components) return;
    const { selected, entityId } = this.getSelectedByColorId(colorId);

    if (selected) selected.value = true;
    // 单选
    if (!this.core.multiple) {
      this.components.selected.forEach((sel, id) => {
        if (id !== entityId) {
          sel.value = false;
        }
      });
    }
    // console.log(1222);
    // 直接清空所有，重新渲染状态
    this.core.update();
  }

  /**
   * 清空选中状态与hover状态
   * @returns
   */
  clearNodeState() {
    if (!this.components) return;
    this.components.selected.forEach((sel) => {
      sel.value = false;
      sel.hovered = false;
    });
  }

  onClick() {
    if (!this.components) return;
    const position = this.getPosition(EventType.Click);
    if (!position) return;
    const { x, y } = position;
    const colorId = this.getColorId(x, y);

    if (colorId && colorId[3] === 0) {
      // 清空选择
      this.clearNodeState();
      this.core.update();
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
    if (!this.components) return;
    // 根据颜色获取实体id
    if (hovered) {
      const { selected, entityId } = this.getSelectedByColorId(colorId);
      if (selected) selected.hovered = true;
      // 单选
      this.components.selected.forEach((sel, id) => {
        if (id !== entityId) {
          sel.hovered = false;
        }
      });
    } else {
      //清空hover状态
      this.clearNodeState();
    }
    // 直接清空所有，重新渲染状态
    this.core.update();
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
