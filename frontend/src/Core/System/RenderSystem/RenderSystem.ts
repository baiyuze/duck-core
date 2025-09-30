import { throttle } from "lodash";
import type { Color, Position, Size } from "../../Components";
import type { Core } from "../../Core";
import type { DSL } from "../../DSL/DSL";
import { Entity } from "../../Entity/Entity";
import { ShapeType } from "../../enum";
import type { ComponentStore } from "../../types";
import { System } from "../System";

export class RenderSystem extends System {
  core: Core;
  ctx: CanvasRenderingContext2D;
  offCtx: CanvasRenderingContext2D | null = null;
  entityManager: Entity = new Entity();
  // private throttledRender: (components: ComponentStore) => void;

  constructor(ctx: CanvasRenderingContext2D, core: Core) {
    super();
    this.core = core;
    this.ctx = ctx;
    // 在构造函数中创建节流函数，这样它会在整个实例生命周期中保持状态
    // this.throttledRender = throttle((components: ComponentStore) => {
    //   console.log(2);
    //   this.render(components, this.ctx);
    // }, 100);
  }

  throttledRender = throttle((components: ComponentStore) => {
    this.render(components, this.ctx);
  }, 100);

  drawShape(components: ComponentStore, entityId: string) {
    const size = components.size.get(entityId) as Size;
    const position = components.position.get(entityId) as Position;
    const color = components.color.get(entityId) as Color;
    const rotation = components.rotation.get(entityId) as { value: number };
    const type = components.type.get(entityId);
    if (!size || !position) return;

    if (type === ShapeType.Rectangle) {
      const { x, y } = position;
      const { width, height } = size;
      const { fillColor } = color;
      this.ctx.fillStyle = fillColor || "transparent";
      this.ctx.fillRect(x, y, width, height);
    }
    if (type === ShapeType.Ellipse) {
      const { x, y } = position;
      const { width, height } = size;
      const { fillColor, strokeColor } = color;
      this.ctx.fillStyle = fillColor || "transparent";
      this.ctx.beginPath();
      this.ctx.ellipse(
        x + width / 2,
        y + height / 2,
        width / 2,
        height / 2,
        (rotation.value * Math.PI) / 180,
        0,
        2 * Math.PI
      );
      this.ctx.fill();
      this.ctx.strokeStyle = strokeColor || "transparent"; // 可以是颜色字符串、渐变、模式等
      this.ctx.lineWidth = 2;
      this.ctx.stroke();
      this.ctx.closePath();
    }

    if (type === ShapeType.Text) {
      const { x, y } = position;
      // const { width, height } = size;
      // const { fillColor } = color;
      const font = components.font.get(entityId);
      // this.ctx.font = `${font.style} ${font.weight} ${font.size}px/${font.lineHeight} ${font.family}`;
      // this.ctx.fillStyle = font.fillColor;
      // this.ctx.strokeStyle = font.strokeColor;
      // this.ctx.strokeText(font.text, x, y);
      // this.ctx.fillText(font.text, x, y);
      const parts = [
        font.style || "",
        font.variant || "",
        font.weight || "",
        `${font.size || 16}px`,
        font.family || "Arial",
      ];
      this.ctx.font = parts.filter((v) => v).join(" ");
      this.ctx.fillStyle = font.fillColor || "#000";
      this.ctx.strokeStyle = font.strokeColor || "transparent";

      // 2️⃣ 文字渲染（fill + stroke）
      if (font.strokeColor) this.ctx.strokeText(font.text, x, y + font.size);
      this.ctx.fillText(font.text, x, y + font.size);
    }
  }

  render(components: ComponentStore, ctx: CanvasRenderingContext2D) {
    // 每帧先清空画布
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    // 遍历所有 position 组件的实体
    components.position.forEach((pos, entityId) => {
      this.drawShape(components, entityId);
    });
  }
  /**
   * 渲染
   * ToDo 需要优化当在选中区时，也要停止更新update
   * @param components
   */
  update(components: ComponentStore) {
    this.throttledRender(components);
  }
}
