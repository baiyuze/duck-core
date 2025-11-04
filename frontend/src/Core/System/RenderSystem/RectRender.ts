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
  stateStore: StateStore | null = null;

  constructor(engine: Engine) {
    super();
    this.engine = engine;
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
        g.stroke({
          alignment: 1,
          width: strokeWidth,
          color: strokeTColor ?? strokeColor,
        });
        g.moveTo(x + rTL, y);
        g.lineTo(x + width - rTR, y);
        g.arcTo(x + width, y, x + width, y + rTR, rTR);
        g.stroke();

        // 右侧描边 (Right Line + Bottom-Right Corner)
        g.stroke({
          alignment: 1,
          width: strokeWidth,
          color: strokeRColor ?? strokeColor,
        });
        g.moveTo(x + width, y + rTR);
        g.lineTo(x + width, y + height - rBR);
        g.arcTo(x + width, y + height, x + width - rBR, y + height, rBR);
        g.stroke();

        // 底部描边 (Bottom Line + Bottom-Left Corner)
        g.stroke({
          alignment: 1,
          width: strokeWidth,
          color: strokeBColor ?? strokeColor,
        });
        g.moveTo(x + width - rBR, y + height);
        g.lineTo(x + rBL, y + height);
        g.arcTo(x, y + height, x, y + height - rBL, rBL);
        g.stroke();

        // 左侧描边 (Left Line + Top-Left Corner)
        g.stroke({
          alignment: 1,
          width: strokeWidth,
          color: strokeLColor ?? strokeColor,
        });
        g.moveTo(x, y + height - rBL);
        g.lineTo(x, y + rTL);
        g.arcTo(x, y, x + rTL, y, rTL);
        g.stroke();
      } else if (strokeColor) {
        // --- 整体描边：只有通用 strokeColor 有值，且没有单独设置的颜色时 ---
        g.stroke({ alignment: 1, width: strokeWidth, color: strokeColor });
        this.drawCustomRoundedPath(g, x, y, width, height, radius);
        g.stroke();
      }
      // 否则 (strokeColor 也没有值)，不绘制描边
    }
  }
  /** 绘制单个实体 */
  draw(entityId: string) {
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
