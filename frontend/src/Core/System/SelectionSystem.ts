import type { Core } from "../Core";
import type { ComponentStore } from "../types";
import type { System } from "./System";

export class SelectionSystem implements System {
  core: Core;
  ctx: CanvasRenderingContext2D;
  selectionCtx: CanvasRenderingContext2D | null = null;
  components?: ComponentStore;
  constructor(ctx: CanvasRenderingContext2D, core: Core) {
    this.ctx = ctx;
    this.core = core;
    this.initSelectionCanvas();
  }

  initSelectionCanvas() {
    const canvasDom = this.ctx.canvas;
    const parent = canvasDom.parentElement;
    if (!parent) return;
    // 创建一个新的canvas用于渲染选中状态
    const selectionCanvas = document.createElement("canvas");
    selectionCanvas.width = this.ctx.canvas.width;
    selectionCanvas.height = this.ctx.canvas.height;
    selectionCanvas.style.position = "absolute";
    selectionCanvas.style.top = "0";
    selectionCanvas.style.left = "0";
    selectionCanvas.style.pointerEvents = "none";
    selectionCanvas.style.zIndex = "10";
    parent.appendChild(selectionCanvas);
    this.selectionCtx = selectionCanvas.getContext("2d");
  }

  render(components: ComponentStore, entityId: string, isHover = false) {
    if (!this.selectionCtx) return;
    const ctx = this.selectionCtx;
    const selected = components.selected.get(entityId);
    const position = components.position.get(entityId);
    const size = components.size.get(entityId);
    if (position && size) {
      // hover改为虚线
      // const strokeStyle = isHover ? "rgba(90, 132, 255, 0.8)" : "rgb(90, 132, 255)";
      // const lineWidth = isHover ? 1 : 2;
      if (!selected?.value) {
        ctx.setLineDash([2, 2]);
        ctx.strokeStyle = "rgba(90, 132, 255, 0.8)";
        ctx.lineWidth = 1;
      } else {
        ctx.setLineDash([]);
        ctx.strokeStyle = "rgb(90, 132, 255)";
        ctx.lineWidth = 2;
      }
      ctx.strokeRect(
        position.x - 2,
        position.y - 2,
        size.width + 4,
        size.height + 4
      );

      // 选中的时候，标记4个角，用于后续的缩放操作
      if (!isHover) {
        const handleSize = 8;
        const half = handleSize / 2;
        const corners = [
          [position.x - 2, position.y - 2], // 左上
          [position.x + size.width + 2, position.y - 2], // 右上
          [position.x - 2, position.y + size.height + 2], // 左下
          [position.x + size.width + 2, position.y + size.height + 2], // 右下
        ];
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0)"; // 禁用阴影
        ctx.fillStyle = "white";
        ctx.strokeStyle = "rgb(90, 132, 255)";
        ctx.lineWidth = 2;
        for (const [x, y] of corners) {
          ctx.fillRect(x - half, y - half, handleSize, handleSize);
          // ctx.fillStyle = "#fff";
          ctx.strokeRect(x - half, y - half, handleSize, handleSize);
        }
        ctx.restore();
      }
    }
  }

  clearCanvas() {
    if (!this.selectionCtx) return;
    this.selectionCtx.clearRect(
      0,
      0,
      this.selectionCtx.canvas.width,
      this.selectionCtx.canvas.height
    );
  }

  update(components: ComponentStore) {
    this.clearCanvas();
    // 渲染之前应该清理之前的选中状态，而不是清理画布
    this.components = components;
    components.selected.forEach((selected, entityId) => {
      if (!selected.value) return;
      this.render(components, entityId);
    });

    components.selected.forEach((selected, entityId) => {
      if (!selected.hovered) return;
      this.render(components, entityId, true);
    });
  }
}
