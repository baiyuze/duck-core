import type { Engine } from "../../Core/Engine";
import type { StateStore } from "../../types";
import { System } from "../System";

export class RectRender extends System {
  engine: Engine;
  ctx: CanvasRenderingContext2D;
  stateStore: StateStore | null = null;

  constructor(ctx: CanvasRenderingContext2D, engine: Engine) {
    super();
    this.engine = engine;
    this.ctx = ctx;
  }

  /**
   * 计算像素对齐偏移量
   * 对于奇数线宽（特别是1px），需要0.5像素偏移以避免抗锯齿导致的模糊
   * @param lineWidth 线条宽度
   * @returns 偏移量
   */
  private getPixelOffset(lineWidth: number): number {
    // 奇数线宽需要0.5偏移，偶数线宽不需要
    return lineWidth % 2 === 1 ? 0.5 : 0;
  }

  /** 绘制填充圆角矩形 */
  fillRoundRect(
    width: number,
    height: number,
    radius: number | { lt?: number; rt?: number; rb?: number; lb?: number },
    fillColor?: string
  ) {
    const radiusObj = this.normalizeRadius(radius);
    if (!this.validateRadius(width, height, radiusObj)) return false;
    this.drawRoundRectPath(width, height, radiusObj);
    this.ctx.fillStyle = fillColor || "#000";
    this.ctx.fill();
  }

  /** 绘制描边圆角矩形（统一线宽和颜色） */
  strokeRoundRect(
    width: number,
    height: number,
    radius: number | { lt?: number; rt?: number; rb?: number; lb?: number },
    lineWidth?: number,
    strokeColor?: string
  ) {
    const radiusObj = this.normalizeRadius(radius);
    if (!this.validateRadius(width, height, radiusObj)) return false;
    this.drawRoundRectPath(width, height, radiusObj);
    this.ctx.lineWidth = lineWidth || 2;
    this.ctx.strokeStyle = strokeColor || "#000";
    this.ctx.stroke();
  }

  /** 标准化半径参数 */
  private normalizeRadius(
    radius: number | { lt?: number; rt?: number; rb?: number; lb?: number }
  ): { lt: number; rt: number; rb: number; lb: number } {
    if (typeof radius === "number") {
      return { lt: radius, rt: radius, rb: radius, lb: radius };
    }
    return {
      lt: radius.lt || 0,
      rt: radius.rt || 0,
      rb: radius.rb || 0,
      lb: radius.lb || 0,
    };
  }

  /** 验证圆角半径是否合理 */
  private validateRadius(
    width: number,
    height: number,
    radius: { lt: number; rt: number; rb: number; lb: number }
  ): boolean {
    const maxRadius = Math.min(width, height) / 2;
    return (
      radius.lt <= maxRadius &&
      radius.rt <= maxRadius &&
      radius.rb <= maxRadius &&
      radius.lb <= maxRadius
    );
  }

  /** 绘制圆角矩形路径（填充用） */
  drawRoundRectPath(
    width: number,
    height: number,
    radius: { lt: number; rt: number; rb: number; lb: number }
  ) {
    const ctx = this.ctx;
    ctx.beginPath();
    ctx.moveTo(radius.lt, 0);
    ctx.lineTo(width - radius.rt, 0);
    if (radius.rt > 0) ctx.arcTo(width, 0, width, radius.rt, radius.rt);
    ctx.lineTo(width, height - radius.rb);
    if (radius.rb > 0)
      ctx.arcTo(width, height, width - radius.rb, height, radius.rb);
    ctx.lineTo(radius.lb, height);
    if (radius.lb > 0) ctx.arcTo(0, height, 0, height - radius.lb, radius.lb);
    ctx.lineTo(0, radius.lt);
    if (radius.lt > 0) ctx.arcTo(0, 0, radius.lt, 0, radius.lt);
    ctx.closePath();
  }

  /**
   * 支持单独边框宽度和颜色的圆角矩形
   */
  strokeRectWithSeparateBorders(
    width: number,
    height: number,
    radius: { lt: number; rt: number; rb: number; lb: number },
    lineWidth: { top?: number; bottom?: number; left?: number; right?: number },
    strokeColor: {
      top?: string;
      bottom?: string;
      left?: string;
      right?: string;
    }
  ) {
    const ctx = this.ctx;

    const r = {
      lt: radius.lt || 0,
      rt: radius.rt || 0,
      rb: radius.rb || 0,
      lb: radius.lb || 0,
    };
    const lw = {
      top: lineWidth.top || 0,
      bottom: lineWidth.bottom || 0,
      left: lineWidth.left || 0,
      right: lineWidth.right || 0,
    };
    const sc = {
      top: strokeColor.top || "transparent",
      bottom: strokeColor.bottom || "transparent",
      left: strokeColor.left || "transparent",
      right: strokeColor.right || "transparent",
    };

    // 上边
    if (lw.top > 0 && sc.top !== "transparent") {
      const offset = this.getPixelOffset(lw.top);
      ctx.beginPath();
      ctx.lineWidth = lw.top;
      ctx.strokeStyle = sc.top;
      ctx.moveTo(r.lt, offset);
      ctx.lineTo(width - r.rt, offset);
      ctx.stroke();
    }
    // 右边
    if (lw.right > 0 && sc.right !== "transparent") {
      const offset = this.getPixelOffset(lw.right);
      ctx.beginPath();
      ctx.lineWidth = lw.right;
      ctx.strokeStyle = sc.right;
      ctx.moveTo(width - offset, r.rt);
      ctx.lineTo(width - offset, height - r.rb);
      ctx.stroke();
    }
    // 下边
    if (lw.bottom > 0 && sc.bottom !== "transparent") {
      const offset = this.getPixelOffset(lw.bottom);
      ctx.beginPath();
      ctx.lineWidth = lw.bottom;
      ctx.strokeStyle = sc.bottom;
      console.log(sc.bottom, "sc.bottom1111");
      ctx.moveTo(width - r.rb, height - offset);
      ctx.lineTo(r.lb, height - offset);
      ctx.stroke();
    }
    // 左边
    if (lw.left > 0 && sc.left !== "transparent") {
      const offset = this.getPixelOffset(lw.left);
      ctx.beginPath();
      ctx.lineWidth = lw.left;
      ctx.strokeStyle = sc.left;
      ctx.moveTo(offset, height - r.lb);
      ctx.lineTo(offset, r.lt);
      ctx.stroke();
    }

    // 四个圆角
    const drawCorner = (
      cx: number,
      cy: number,
      rad: number,
      startAngle: number,
      endAngle: number,
      color: string,
      lw: number
    ) => {
      if (rad > 0 && lw > 0 && color !== "transparent") {
        ctx.beginPath();
        ctx.lineWidth = lw;
        ctx.strokeStyle = color;
        ctx.arc(cx, cy, rad, startAngle, endAngle);
        ctx.stroke();
      }
    };

    drawCorner(r.lt, r.lt, r.lt, Math.PI, -Math.PI / 2, sc.top, lw.top); // 左上
    drawCorner(width - r.rt, r.rt, r.rt, -Math.PI / 2, 0, sc.right, lw.right); // 右上
    drawCorner(
      width - r.rb,
      height - r.rb,
      r.rb,
      0,
      Math.PI / 2,
      sc.bottom,
      lw.bottom
    ); // 右下
    drawCorner(
      r.lb,
      height - r.lb,
      r.lb,
      Math.PI / 2,
      Math.PI,
      sc.left,
      lw.left
    ); // 左下
  }

  /** 绘制单个实体 */
  draw(entityId: string) {
    this.stateStore = this.engine.stateStore;
    if (!this.stateStore) return;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);

    const { width, height } = state.size;
    const {
      fillColor,
      strokeColor,
      strokeBColor,
      strokeLColor,
      strokeRColor,
      strokeTColor,
    } = state.color;
    const lineWidth = state.lineWidth;
    const radius = state.radius;
    // 绘制填充
    if (fillColor && fillColor !== "transparent") {
      this.fillRoundRect(width, height, radius, fillColor);
    }

    // 绘制描边
    if (lineWidth) {
      const radiusObj = this.normalizeRadius(radius);
      // 判断是否有对应四边描边颜色
      const hasStrokeColor =
        strokeTColor || strokeBColor || strokeLColor || strokeRColor;
      // 如果 strokeColor 是字符串（统一颜色），转换为四边对象
      let strokeObj:
        | {
            top?: string;
            bottom?: string;
            left?: string;
            right?: string;
          }
        | string = {};
      if (strokeColor && typeof strokeColor === "string" && !hasStrokeColor) {
        strokeObj = {
          top: strokeColor,
          bottom: strokeColor,
          left: strokeColor,
          right: strokeColor,
        };
      } else {
        if (strokeColor)
          strokeObj = {
            top: strokeTColor,
            bottom: strokeBColor,
            left: strokeLColor,
            right: strokeRColor,
          };
      }
      console.log(strokeObj, "strokeObj");

      // 统一线宽 value 转四边
      let lwObj: {
        top?: number;
        bottom?: number;
        left?: number;
        right?: number;
      } = {};

      if (
        !lineWidth.top &&
        !lineWidth.bottom &&
        !lineWidth.left &&
        !lineWidth.right
      ) {
        const w = lineWidth.value;
        lwObj = { top: w, bottom: w, left: w, right: w };
      } else {
        lwObj = lineWidth;
      }

      this.strokeRectWithSeparateBorders(
        width,
        height,
        radiusObj,
        lwObj,
        strokeObj
      );
    }
  }
}
