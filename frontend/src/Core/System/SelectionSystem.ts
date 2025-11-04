import type { Position, Size } from "../Components";
import type { Engine } from "../Core/Engine";
import type { StateStore } from "../types";
import { System } from "./System";

export class SelectionSystem extends System {
  engine: Engine;
  selectionCtx: CanvasRenderingContext2D | null = null;
  stateStore?: StateStore;
  isZoomChange: boolean = false;
  oldZoom: number = 1;
  constructor(engine: Engine) {
    super();
    this.engine = engine;
    this.initSelectionCanvas();
  }

  initSelectionCanvas() {
    // 清理之前的selectionCtx
    const canvasDom = this.engine.app.canvas;
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

    const width = this.engine.defaultConfig.width;
    const height = this.engine.defaultConfig.height;
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
    const { x, y } = position;
    ctx.translate(x, y);
    ctx.setLineDash(dash || []);

    ctx.strokeStyle = color;

    ctx.lineWidth = 1;
    ctx.strokeRect(-2, -2, size.width + 4, size.height + 4);
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
          color: "rgba(6, 66, 247)",
          dash: [],
        });
      }

      // 选中的时候，标记4个角，用于后续的缩放操作
      if (!isHover) {
        const handleSize = 8;
        const half = handleSize / 2;
        ctx.save();
        const corners = [
          [-2, -2], // 左上
          [size.width + 2, -2], // 右上
          [-2, size.height + 2], // 左下
          [size.width + 2, size.height + 2], // 右下
        ];
        const { x, y } = position;
        ctx.translate(x, y);
        ctx.shadowColor = "rgba(0,0,0,0)"; // 禁用阴影
        ctx.fillStyle = "white";
        ctx.strokeStyle = "rgb(90, 132, 255)";
        ctx.lineWidth = 1;
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
    const width = this.engine.defaultConfig.width;
    const height = this.engine.defaultConfig.height;
    this.selectionCtx.clearRect(0, 0, width, height);
  }

  update(stateStore: StateStore) {
    if (!stateStore) return;
    if (!this.selectionCtx) return;

    this.clearCanvas();
    // 缩放过程中不进行selection渲染，避免卡顿
    if (this.engine.core.isDragging) return;
    if (this.engine.camera.isZooming) return;
    this.stateStore = stateStore;
    const camera = this.engine.camera;
    // 你应该不进行缩放，而是重新算出来坐标值，进行绘制。
    this.selectionCtx.save();
    this.selectionCtx.translate(camera.translateX, camera.translateY);
    this.selectionCtx.scale(camera.zoom, camera.zoom);
    stateStore.selected.forEach((selected, entityId) => {
      if (!selected.value) return;
      this.render(stateStore, entityId);
    });
    stateStore.selected.forEach((selected, entityId) => {
      if (!selected.hovered) return;
      this.render(stateStore, entityId, true);
    });
    this.selectionCtx.restore();
  }

  destroyed(): void {
    this.clearCanvas();
    // 移除selection canvas
    const canvasDom = this.engine.app.canvas;
    const parent = canvasDom.parentElement;
    if (!parent) return;
    const selectionCanvas = parent.querySelector("#selection-canvas");
    if (selectionCanvas) {
      parent.removeChild(selectionCanvas);
    }
    this.selectionCtx = null;
    this.stateStore = undefined;
    this.engine = null as any;
  }
}
