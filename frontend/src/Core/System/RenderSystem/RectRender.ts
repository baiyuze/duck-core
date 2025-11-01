import { Color, Graphics, type ColorSource } from "pixi.js";
import type { Engine } from "../../Core/Engine";
import type { StateStore } from "../../types";
import { System } from "../System";
import type { Radius } from "../../Components";
interface CustomRectParams {
  x: number;
  y: number;
  width: number;
  height: number;
  radius: Radius;
  strokeWidth: number;

  // 颜色参数
  fillColor?: ColorSource;
  strokeColor?: ColorSource; // 通用描边颜色 (当单边颜色未指定时使用)
  strokeTColor?: ColorSource; // 顶部描边颜色
  strokeRColor?: ColorSource; // 右侧描边颜色
  strokeBColor?: ColorSource; // 底部描边颜色
  strokeLColor?: ColorSource; // 左侧描边颜色
}
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
        strokeObj = {
          top: strokeTColor,
          bottom: strokeBColor,
          left: strokeLColor,
          right: strokeRColor,
        };
      }
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
  /**
   * 内部函数：仅用于绘制自定义圆角矩形的路径。
   * @param graphics - PIXI Graphics 实例
   * @param x - 矩形左上角X坐标
   * @param y - 矩形左上角Y坐标
   * @param width - 宽度
   * @param height - 高度
   * @param radius - 圆角半径对象
   */
  drawCustomRoundedPath(
    graphics: Graphics,
    x: number,
    y: number,
    width: number,
    height: number,
    radius: Radius
  ): void {
    // 提取半径 (使用 ?? 运算符确保默认值为 0)
    const rTL = radius.lt ?? 0; // Top-Left
    const rTR = radius.rt ?? 0; // Top-Right
    const rBR = radius.rb ?? 0; // Bottom-Right
    const rBL = radius.lb ?? 0; // Bottom-Left

    // 绘制起点：顶部直线的起点
    graphics.moveTo(x + rTL, y);

    // 1. 顶部直线 & 右上圆角
    graphics.lineTo(x + width - rTR, y);
    // arcTo(x1, y1, x2, y2, radius)
    graphics.arcTo(x + width, y, x + width, y + rTR, rTR);

    // 2. 右侧直线 & 右下圆角
    graphics.lineTo(x + width, y + height - rBR);
    graphics.arcTo(x + width, y + height, x + width - rBR, y + height, rBR);

    // 3. 底部直线 & 左下圆角
    graphics.lineTo(x + rBL, y + height);
    graphics.arcTo(x, y + height, x, y + height - rBL, rBL);

    // 4. 左侧直线 & 左上圆角
    graphics.lineTo(x, y + rTL);
    graphics.arcTo(x, y, x + rTL, y, rTL);

    graphics.closePath();
  }

  /**
   * 绘制一个具有自定义圆角和自定义四边描边颜色的矩形。
   * 填充和四边描边是分段绘制的，以实现不同的描边颜色。
   * @param g - PIXI Graphics 实例
   * @param params - 包含所有绘图和样式参数的对象
   */
  drawCustomRect(g: Graphics, params: CustomRectParams): void {
    const {
      x,
      y,
      width,
      height,
      radius,
      strokeWidth,
      fillColor,
      strokeColor,
      strokeTColor,
      strokeRColor,
      strokeBColor,
      strokeLColor,
    } = params;

    // 1. 清除上一次绘制的图形
    g.clear();

    // ----------------------------------------------------
    // A. 填充 (Fill) - 始终绘制
    // ----------------------------------------------------

    g.fill({ color: fillColor });
    this.drawCustomRoundedPath(g, x, y, width, height, radius);
    g.fill();

    // ----------------------------------------------------
    // B. 描边 (Stroke) - 只有当 strokeWidth > 0 时才绘制
    // ----------------------------------------------------

    if (strokeWidth > 0) {
      // 提取半径
      const rTL = radius.lt ?? 0;
      const rTR = radius.rt ?? 0;
      const rBR = radius.rb ?? 0;
      const rBL = radius.lb ?? 0;

      // 检查是否存在任何自定义描边颜色（使用 !! 确保 ColorSource 类型可以被判断为 '存在'）
      const hasCustomStroke =
        !!strokeTColor || !!strokeRColor || !!strokeBColor || !!strokeLColor;

      if (hasCustomStroke) {
        // --- 分段描边：使用 ?? 运算符进行颜色回退 ---

        // 顶部描边 (Top Line + Top-Right Corner)
        // 使用 strokeTColor；如果 strokeTColor 为 null/undefined，则使用 strokeColor
        g.stroke({ width: strokeWidth, color: strokeTColor ?? strokeColor });
        g.moveTo(x + rTL, y);
        g.lineTo(x + width - rTR, y);
        g.arcTo(x + width, y, x + width, y + rTR, rTR);
        g.stroke();

        // 右侧描边 (Right Line + Bottom-Right Corner)
        g.stroke({ width: strokeWidth, color: strokeRColor ?? strokeColor });
        g.moveTo(x + width, y + rTR);
        g.lineTo(x + width, y + height - rBR);
        g.arcTo(x + width, y + height, x + width - rBR, y + height, rBR);
        g.stroke();

        // 底部描边 (Bottom Line + Bottom-Left Corner)
        g.stroke({ width: strokeWidth, color: strokeBColor ?? strokeColor });
        g.moveTo(x + width - rBR, y + height);
        g.lineTo(x + rBL, y + height);
        g.arcTo(x, y + height, x, y + height - rBL, rBL);
        g.stroke();

        // 左侧描边 (Left Line + Top-Left Corner)
        g.stroke({ width: strokeWidth, color: strokeLColor ?? strokeColor });
        g.moveTo(x, y + height - rBL);
        g.lineTo(x, y + rTL);
        g.arcTo(x, y, x + rTL, y, rTL);
        g.stroke();
      } else if (strokeColor) {
        // --- 整体描边：只有通用 strokeColor 有值，且没有单独设置的颜色时 ---
        g.stroke({ width: strokeWidth, color: strokeColor });
        this.drawCustomRoundedPath(g, x, y, width, height, radius);
        g.stroke();
      }
      // 否则 (strokeColor 也没有值)，不绘制描边
    }
  }
  /** 绘制单个实体 */
  draw1(entityId: string) {
    this.stateStore = this.engine.stateStore;
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

    let graphics = this.graphicsMap.get(entityId) as Graphics;
    if (!graphics) {
      graphics = new Graphics();
      this.graphicsMap.set(entityId, graphics);
    }
    if (!this.isPositionDirty(entityId, state)) return;
    graphics.position.set(state.position.x, state.position.y);

    if (!this.isGeometryDirty(entityId, state)) return;
    let strokeObj:
      | {
          top?: string;
          bottom?: string;
          left?: string;
          right?: string;
        }
      | string = {};
    const hasStrokeColor =
      strokeTColor || strokeBColor || strokeLColor || strokeRColor;
    if (strokeColor && typeof strokeColor === "string" && !hasStrokeColor) {
      strokeObj = {
        top: strokeColor,
        bottom: strokeColor,
        left: strokeColor,
        right: strokeColor,
      };
    } else {
      strokeObj = {
        top: strokeTColor,
        bottom: strokeBColor,
        left: strokeLColor,
        right: strokeRColor,
      };
    }
    const params: CustomRectParams = {
      x: 0,
      y: 0,
      width,
      height,
      radius: state.radius,
      strokeWidth: state.lineWidth.value,

      fillColor: fillColor || "transparent", // 填充颜色
      strokeColor: strokeColor || "transparent", // fallback color

      // 自定义四边颜色
      strokeTColor: strokeObj.top, // 顶部：红色
      strokeRColor: strokeObj.right, // 右侧：黄色
      strokeBColor: strokeObj.bottom, // 底部：绿色
      strokeLColor: strokeObj.left, // 左侧：蓝色
    };
    this.drawCustomRect(graphics, params);
    this.engine.addChild(graphics);
  }
}
