import { extend } from "lodash";
import type { Position, Size } from "../Components";
import type { Core } from "../Core";
import type { StateStore } from "../types";
import { System } from "./System";

export class SelectionSystem extends System {
  core: Core;
  ctx: CanvasRenderingContext2D;
  selectionCtx: CanvasRenderingContext2D | null = null;
  stateStore?: StateStore;
  constructor(ctx: CanvasRenderingContext2D, core: Core) {
    super();
    this.ctx = ctx;
    this.core = core;
    this.initSelectionCanvas();
  }

  initSelectionCanvas() {
    // 清理之前的selectionCtx
    const canvasDom = this.ctx.canvas;
    const parent = canvasDom.parentElement;
    if (!parent) return;

    // 查找并移除旧的 selection canvas
    const oldSelectionCanvas = parent.querySelector("#selection-canvas");
    if (oldSelectionCanvas) {
      parent.removeChild(oldSelectionCanvas);
    }

    // 创建一个新的canvas用于渲染选中状态
    const selectionCanvas = document.createElement("canvas");

    const dpr = window.devicePixelRatio || 1;

    const width = this.core.defaultSize.width;
    const height = this.core.defaultSize.height;
    selectionCanvas.style.width = width + "px";
    selectionCanvas.style.height = height + "px";

    selectionCanvas.width = width * dpr;
    selectionCanvas.height = height * dpr;
    selectionCanvas.id = "selection-canvas"; // 添加一个id以便查询
    selectionCanvas.style.position = "absolute";
    selectionCanvas.style.top = "0";
    selectionCanvas.style.left = "0";
    selectionCanvas.style.pointerEvents = "none";
    selectionCanvas.style.zIndex = "100";
    parent.appendChild(selectionCanvas);
    this.selectionCtx = selectionCanvas.getContext("2d");
    if (this.selectionCtx) {
      this.selectionCtx.scale(dpr, dpr); // 缩放回逻辑大小
    }
  }

  shapeRect({
    position,
    size,
    color,
    dash,
  }: {
    position: Position;
    size: Size;
    color: string;
    dash?: number[];
  }) {
    if (!this.selectionCtx) return;
    const ctx = this.selectionCtx;
    ctx.save();
    // 更新坐标原点位置
    // const { x, y } = position;
    // ctx.translate(x, y);
    ctx.setLineDash(dash || []);

    ctx.strokeStyle = color;

    ctx.lineWidth = 2;
    ctx.strokeRect(
      position.x - 2,
      position.y - 2,
      size.width + 4,
      size.height + 4
    );
    ctx.restore();
  }

  render(stateStore: StateStore, entityId: string, isHover = false) {
    if (!this.selectionCtx) return;
    const ctx = this.selectionCtx;
    const selected = stateStore.selected.get(entityId);
    const position = stateStore.position.get(entityId);
    const size = stateStore.size.get(entityId);
    if (position && size) {
      if (!selected?.value) {
        this.shapeRect({
          position,
          size,
          color: "rgba(90, 132, 255, 0.8)",
          dash: [2, 2],
        });
      } else if (!(selected.hovered && isHover)) {
        this.shapeRect({
          position,
          size,
          color: "rgba(90, 132, 255)",
          dash: [],
        });
      }

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
        // const { x, y } = position;
        // ctx.translate(x, y);
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

  update(stateStore: StateStore) {
    this.clearCanvas();
    // 渲染之前应该清理之前的选中状态，而不是清理画布
    this.stateStore = stateStore;

    stateStore.selected.forEach((selected, entityId) => {
      if (!selected.value) return;
      this.render(stateStore, entityId);
    });
    if (this.core.isDragging) return;
    stateStore.selected.forEach((selected, entityId) => {
      if (!selected.hovered) return;
      this.render(stateStore, entityId, true);
    });
  }

  destroyed(): void {
    this.clearCanvas();
    // 移除selection canvas
    const canvasDom = this.ctx.canvas;
    const parent = canvasDom.parentElement;
    if (!parent) return;
    const selectionCanvas = parent.querySelector("#selection-canvas");
    if (selectionCanvas) {
      parent.removeChild(selectionCanvas);
    }
    this.selectionCtx = null;
    this.stateStore = undefined;
    this.core = null as any;
    this.ctx = null as any;
  }
}
