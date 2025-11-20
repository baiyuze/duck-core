import { isNil } from "lodash";
import type { Engine } from "../Core/Engine";
import { Entity } from "../Entity/Entity";
import type { StateStore } from "../types";
import { System } from "./System";

export class ScrollSystem extends System {
  engine: Engine;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  private readonly scrollSensitivity = 1;
  private horizontalScrollbar: HTMLDivElement | null = null;
  private verticalScrollbar: HTMLDivElement | null = null;
  private readonly scrollbarWidth = 10;
  private readonly scrollbarColor = "rgba(0, 0, 0, 0.3)";
  private readonly scrollbarHoverColor = "rgba(0, 0, 0, 0.5)";
  private isDraggingHorizontal = false;
  private isDraggingVertical = false;
  private dragStartX = 0;
  private dragStartY = 0;
  private dragStartTranslateX = 0;
  private dragStartTranslateY = 0;
  private readonly minThumbSize = 30;
  private hThumb: HTMLDivElement | null = null;
  private vThumb: HTMLDivElement | null = null;
  private rafId: number | null = null;
  private mouseMoveHandler: ((e: MouseEvent) => void) | null = null;
  private mouseUpHandler: (() => void) | null = null;
  private currentMouseX = 0;
  private currentMouseY = 0;

  constructor(engine: Engine) {
    super();
    this.engine = engine;
    engine.config.scroll?.bar?.enabled && this.initScrollBar();
  }

  /**
   * 创建滚动条滑块
   */
  private createThumb(): HTMLDivElement {
    const thumb = document.createElement("div");
    thumb.style.position = "absolute";
    thumb.style.background = this.scrollbarColor;
    thumb.style.borderRadius = "6px";
    thumb.style.transition = "background 0.2s";
    thumb.addEventListener("mouseenter", () => {
      thumb.style.background = this.scrollbarHoverColor;
    });
    thumb.addEventListener("mouseleave", () => {
      if (!this.isDraggingHorizontal && !this.isDraggingVertical) {
        thumb.style.background = this.scrollbarColor;
      }
    });
    return thumb;
  }

  initScrollBar() {
    const canvasDom = this.engine.canvasDom!;
    const { width, height } = this.engine.config;

    // 创建横向滚动条
    this.horizontalScrollbar = document.createElement("div");
    Object.assign(this.horizontalScrollbar.style, {
      position: "absolute",
      bottom: "0",
      left: "0",
      width: `${width}px`,
      height: `${this.scrollbarWidth}px`,
      pointerEvents: "none",
      zIndex: "99",
    });

    // 横向滚动条滑块
    this.hThumb = this.createThumb();
    this.hThumb.style.height = "100%";
    this.hThumb.style.minWidth = `${this.minThumbSize}px`;
    this.hThumb.style.pointerEvents = "auto";
    this.hThumb.style.willChange = "transform";
    this.hThumb.addEventListener("mousedown", (e: MouseEvent) => {
      e.preventDefault();
      this.isDraggingHorizontal = true;
      this.dragStartX = e.clientX;
      this.dragStartTranslateX = this.engine.camera.translateX;
      this.hThumb!.style.background = this.scrollbarHoverColor;
    });
    this.horizontalScrollbar.appendChild(this.hThumb);

    // 创建纵向滚动条
    this.verticalScrollbar = document.createElement("div");
    Object.assign(this.verticalScrollbar.style, {
      position: "absolute",
      top: "0",
      right: "0",
      width: `${this.scrollbarWidth}px`,
      height: `${height}px`,
      pointerEvents: "none",
      zIndex: "99",
    });

    // 纵向滚动条滑块
    this.vThumb = this.createThumb();
    this.vThumb.style.width = "100%";
    this.vThumb.style.minHeight = `${this.minThumbSize}px`;
    this.vThumb.style.pointerEvents = "auto";
    this.vThumb.style.willChange = "transform";
    this.vThumb.addEventListener("mousedown", (e: MouseEvent) => {
      e.preventDefault();
      this.isDraggingVertical = true;
      this.dragStartY = e.clientY;
      this.dragStartTranslateY = this.engine.camera.translateY;
      this.vThumb!.style.background = this.scrollbarHoverColor;
    });
    this.verticalScrollbar.appendChild(this.vThumb);

    // 插入到DOM
    const parent = canvasDom.parentElement;
    if (parent) {
      parent.style.position = "relative";
      parent.appendChild(this.horizontalScrollbar);
      parent.appendChild(this.verticalScrollbar);
    }

    // 全局鼠标移动和释放事件
    this.setupGlobalDragEvents();

    // 更新滚动条位置
    this.updateScrollbars();
  }

  /**
   * 设置全局拖动事件监听
   */
  private setupGlobalDragEvents() {
    this.mouseMoveHandler = (e: MouseEvent) => {
      if (!this.isDraggingHorizontal && !this.isDraggingVertical) return;

      // 保存最新的鼠标位置
      this.currentMouseX = e.clientX;
      this.currentMouseY = e.clientY;

      // 使用 requestAnimationFrame 节流更新
      if (this.rafId === null) {
        this.rafId = requestAnimationFrame(() => {
          if (this.isDraggingHorizontal) this.handleHorizontalDrag();
          if (this.isDraggingVertical) this.handleVerticalDrag();
          this.rafId = null;
        });
      }
    };

    this.mouseUpHandler = () => {
      if (this.isDraggingHorizontal || this.isDraggingVertical) {
        if (this.hThumb) this.hThumb.style.background = this.scrollbarColor;
        if (this.vThumb) this.vThumb.style.background = this.scrollbarColor;
      }
      this.isDraggingHorizontal = false;
      this.isDraggingVertical = false;
      if (this.rafId !== null) {
        cancelAnimationFrame(this.rafId);
        this.rafId = null;
      }
    };

    document.addEventListener("mousemove", this.mouseMoveHandler);
    document.addEventListener("mouseup", this.mouseUpHandler);
  }

  /**
   * 处理横向滚动条拖动
   */
  private handleHorizontalDrag() {
    const {
      camera,
      config: { width },
    } = this.engine;
    const { minX, maxX, zoom } = camera;

    if (isNil(minX) || isNil(maxX)) return;

    const contentWidth = (maxX - minX) * zoom;
    const scrollRange = contentWidth - width;
    if (scrollRange <= 0) return;

    const deltaX = this.currentMouseX - this.dragStartX;
    const thumbWidth = Math.max(
      this.minThumbSize,
      (width / contentWidth) * width
    );
    const translateDelta = (deltaX / (width - thumbWidth)) * scrollRange;

    camera.translateX = Math.max(
      -maxX * zoom,
      Math.min(-minX * zoom, this.dragStartTranslateX - translateDelta)
    );

    // 直接更新滑块位置,避免完整的 updateScrollbars 调用
    const scrollPosition =
      scrollRange > 0
        ? (-camera.translateX / scrollRange) * (width - thumbWidth)
        : 0;

    if (this.hThumb) {
      const clampedPosition = Math.max(
        0,
        Math.min(width - thumbWidth, scrollPosition)
      );
      this.hThumb.style.transform = `translateX(${clampedPosition}px)`;
    }

    this.engine.dirtyRender = true;
  }

  /**
   * 处理纵向滚动条拖动
   */
  private handleVerticalDrag() {
    const {
      camera,
      config: { height },
    } = this.engine;
    const { minY, maxY, zoom } = camera;

    if (isNil(minY) || isNil(maxY)) return;

    const contentHeight = (maxY - minY) * zoom;
    const scrollRange = contentHeight - height;
    if (scrollRange <= 0) return;

    const deltaY = this.currentMouseY - this.dragStartY;
    const thumbHeight = Math.max(
      this.minThumbSize,
      (height / contentHeight) * height
    );
    const translateDelta = (deltaY / (height - thumbHeight)) * scrollRange;

    camera.translateY = Math.max(
      -maxY * zoom,
      Math.min(-minY * zoom, this.dragStartTranslateY - translateDelta)
    );

    // 直接更新滑块位置,避免完整的 updateScrollbars 调用
    const scrollPosition =
      scrollRange > 0
        ? (-camera.translateY / scrollRange) * (height - thumbHeight)
        : 0;
    if (this.vThumb) {
      const clampedPosition = Math.max(
        0,
        Math.min(height - thumbHeight, scrollPosition)
      );
      this.vThumb.style.transform = `translateY(${clampedPosition}px)`;
    }

    this.engine.dirtyRender = true;
  }

  /**
   * 更新滚动条的位置和大小
   */
  private updateScrollbars() {
    if (!this.horizontalScrollbar || !this.verticalScrollbar) return;

    const {
      camera,
      config: { width, height },
    } = this.engine;
    const { minX, maxX, minY, maxY, zoom, translateX, translateY } = camera;

    // 更新横向滚动条
    if (!isNil(minX) && !isNil(maxX)) {
      const contentWidth = (maxX - minX) * zoom;
      const scrollRange = contentWidth - width;
      const thumbWidth = Math.max(
        this.minThumbSize,
        (width / contentWidth) * width
      );

      const scrollPosition =
        scrollRange > 0
          ? (-translateX / contentWidth) * (width - thumbWidth)
          : 0;

      if (this.hThumb) {
        this.hThumb.style.width = `${thumbWidth}px`;
        const clampedPosition = Math.max(
          0,
          Math.min(width - thumbWidth, scrollPosition)
        );

        this.hThumb.style.transform = `translateX(${clampedPosition}px)`;
      }
      this.horizontalScrollbar.style.display =
        contentWidth > width ? "block" : "none";
    } else {
      this.horizontalScrollbar.style.display = "none";
    }

    // 更新纵向滚动条
    if (!isNil(minY) && !isNil(maxY)) {
      const contentHeight = (maxY - minY) * zoom;
      const scrollRange = contentHeight - height;
      const thumbHeight = Math.max(
        this.minThumbSize,
        (height / contentHeight) * height
      );
      const scrollPosition =
        scrollRange > 0
          ? (-translateY / contentHeight) * (height - thumbHeight)
          : 0;

      if (this.vThumb) {
        this.vThumb.style.height = `${thumbHeight}px`;
        const clampedPosition = Math.max(
          0,
          Math.min(height - thumbHeight, scrollPosition)
        );
        this.vThumb.style.transform = `translateY(${clampedPosition}px)`;
      }
      this.verticalScrollbar.style.display =
        contentHeight > height ? "block" : "none";
    } else {
      this.verticalScrollbar.style.display = "none";
    }
  }

  /**
   * 计算带缩放的边界值
   */
  private calculateRealBoundary(
    min: number | null | undefined,
    max: number | null | undefined,
    zoom: number
  ): { realMin: number; realMax: number } {
    return {
      realMin: isNil(min) ? 0 : min * zoom,
      realMax: isNil(max) ? 0 : max * zoom,
    };
  }

  /**
   * 应用滚动并限制在边界内
   */
  private applyScrollWithBoundary(
    currentValue: number,
    delta: number,
    min: number | null | undefined,
    max: number | null | undefined,
    realMin: number,
    realMax: number
  ): number {
    const newValue = currentValue - delta * this.scrollSensitivity;

    if (!isNil(min) && !isNil(max)) {
      return Math.max(-realMax, Math.min(-realMin, newValue));
    }

    return newValue;
  }

  update(stateStore: StateStore) {
    if (!this.engine.config.scroll?.enabled) return;
    if (stateStore.eventQueue.length === 0) return;

    const { type, event } =
      stateStore.eventQueue[stateStore.eventQueue.length - 1];

    if (type !== "scroll" || !(event instanceof WheelEvent)) return;

    const camera = this.engine.camera;
    const { deltaY, deltaX } = event;
    const { minX, maxX, minY, maxY, zoom } = camera;

    // 计算实际边界值
    const { realMin: realMinX, realMax: realMaxX } = this.calculateRealBoundary(
      minX,
      maxX,
      zoom
    );
    const { realMin: realMinY, realMax: realMaxY } = this.calculateRealBoundary(
      minY,
      maxY,
      zoom
    );

    if (event.shiftKey) {
      // 按住shift键时,纵向滚动变为横向滚动
      if (deltaY !== 0) {
        camera.translateX = this.applyScrollWithBoundary(
          camera.translateX,
          deltaY,
          minX,
          maxX,
          realMinX,
          realMaxX
        );
      }
    } else {
      // 纵向滚动
      if (deltaY !== 0) {
        camera.translateY = this.applyScrollWithBoundary(
          camera.translateY,
          deltaY,
          minY,
          maxY,
          realMinY,
          realMaxY
        );
      }
      // 横向滚动
      if (deltaX !== 0) {
        camera.translateX = this.applyScrollWithBoundary(
          camera.translateX,
          deltaX,
          minX,
          maxX,
          realMinX,
          realMaxX
        );
      }
    }

    this.engine.dirtyRender = true;
    this.engine.config.scroll?.bar?.enabled && this.updateScrollbars();
  }
}
