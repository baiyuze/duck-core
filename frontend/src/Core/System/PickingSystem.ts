import type { Core } from "../Core";
import { Entity } from "../Entity/Entity";
import type { ComponentStore } from "../types";
import { System } from "./System";
export class PickingSystem extends System {
  core: Core;
  ctx: CanvasRenderingContext2D;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  components: ComponentStore | null = null;
  isClearHover: boolean = false;
  constructor(ctx: CanvasRenderingContext2D, core: Core) {
    super();
    this.ctx = ctx;
    this.core = core;
    this.initOffscreenCanvas();
    ctx.canvas.addEventListener("click", this.onClick.bind(this));
  }

  initOffscreenCanvas() {
    const { width, height } = this.ctx.canvas;
    const offscreenCanvas = document.createElement("canvas");
    offscreenCanvas.width = width;
    offscreenCanvas.height = height;
    this.offCtx = offscreenCanvas.getContext("2d");
    return offscreenCanvas;
  }

  render(components: ComponentStore, ctx: CanvasRenderingContext2D) {
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
    this.onClick();
    this.onHover();
  }
  onSelectedById(id: string) {
    if (!this.components) return;
    return this.components.selected.get(id);
  }

  getColorId(x: number, y: number) {
    if (!this.offCtx) return;

    const pixel: ImageData = this.offCtx.getImageData(x, y, 1, 1);
    const [r, g, b, a] = pixel.data;
    return [r, g, b, a];
  }
  /**
   * 隐藏画布选择
   * @param event
   * @returns
   */
  setSelected(colorId?: number[]) {
    if (!colorId) return;
    if (!this.components) return;
    // 根据颜色获取实体id
    const entityId = this.entityManager.rgbaToId(colorId);
    const selected = this.components.selected.get(entityId);

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
   * 修改hover状态
   * @param event
   * @returns
   */
  setHoverState(colorId?: number[], hovered: boolean = false) {
    if (!colorId) return;
    if (!this.components) return;
    // 根据颜色获取实体id
    if (hovered) {
      const entityId = this.entityManager.rgbaToId(colorId);
      const selected = this.components.selected.get(entityId);

      if (selected) selected.hovered = true;
      // 单选
      this.components.selected.forEach((sel, id) => {
        if (id !== entityId) {
          sel.hovered = false;
        }
      });
    } else {
      //清空hover状态
      this.components.selected.forEach((sel) => {
        sel.hovered = false;
      });
    }
    // 直接清空所有，重新渲染状态
    this.core.update();
  }
  onClick() {
    if (!this.components) return;
    if (!this.offCtx) return;
    const coreEvent =
      this.components.eventQueue[this.components.eventQueue.length - 1];

    if (!coreEvent) return;
    const { type, event } = coreEvent;
    if (type !== "click") return;
    this.components.eventQueue.pop();
    // 先用离屏canvas渲染当前帧
    this.render(this.components, this.offCtx);
    // const renderSystem = this.core.getSystemByName("RenderSystem");
    // if (renderSystem) {
    // renderSystem.update(this.components);
    // }
    const rect = this.ctx.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const colorId = this.getColorId(x, y);

    if (colorId && colorId[3] === 0) {
      console.log("点击到了空白区域");
      return;
    }
    this.setSelected(colorId);
  }

  onHover() {
    if (!this.components) return;
    if (!this.offCtx) return;
    const coreEvent =
      this.components.eventQueue[this.components.eventQueue.length - 1];
    if (!coreEvent) return;
    const { type, event } = coreEvent;
    if (type !== "mousemove") return;
    this.components.eventQueue.pop();
    // 先用离屏canvas渲染当前帧
    this.render(this.components, this.offCtx);
    const rect = this.ctx.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const colorId = this.getColorId(x, y);
    const isNull = !colorId || colorId[3] === 0;
    if (this.isClearHover && isNull) return;
    if (colorId && isNull) {
      // console.log("hover到了空白区域");
      this.isClearHover = true;
      return this.setHoverState(colorId, false);
    }
    this.isClearHover = false;
    this.setHoverState(colorId, true);
  }
}
