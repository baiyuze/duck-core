import { Text, TextStyle, type TextStyleFontWeight } from "pixi.js";
import type { Engine } from "../../Core/Engine";
import type { StateStore } from "../../types";
import { System } from "../System";
import type { Font } from "../../Components";

export class TextRender extends System {
  engine: Engine;
  ctx: CanvasRenderingContext2D;
  stateStore: StateStore | null = null;
  constructor(ctx: CanvasRenderingContext2D, engine: Engine) {
    super();
    this.engine = engine;
    this.ctx = ctx;
  }
  draw(entityId: string) {
    this.stateStore = this.engine.stateStore;
    if (!this.stateStore) return;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);
    if (!state) return;

    const font = state.font;
    const size = state.size;
    const textAlign = font.textAlign || "start";
    const textBaseline = font.textBaseline || "top";
    this.ctx.textAlign = textAlign;
    this.ctx.textBaseline = textBaseline;
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

    // 计算 y 偏移：当 textBaseline 为 middle 时，需要将文字向下偏移半个容器高度
    // 因为 translate 已经移动到了元素的左上角，而 middle 会让文字中心对齐到 y=0
    let offsetY = 0;
    if (textBaseline === "middle" && size) {
      offsetY = size.height / 2;
    }

    // 计算 x 偏移：当 textAlign 为 center 或 right 时，需要调整 x 轴位置
    // 因为 translate 已经移动到了元素的左上角
    let offsetX = 0;
    if (size) {
      if (textAlign === "center") {
        offsetX = size.width / 2;
      } else if (textAlign === "right" || textAlign === "end") {
        offsetX = size.width;
      }
    }

    if (font.strokeColor) this.ctx.strokeText(font.text, offsetX, offsetY);
    this.ctx.fillText(font.text, offsetX, offsetY);
  }

  getTextStyle(font: Font): TextStyle {
    let textAlign = font.textAlign || "left";

    if (textAlign === "start") textAlign = "left";
    if (textAlign === "end") textAlign = "right";

    const style = new TextStyle({
      fontFamily: font.family || "Arial",
      fontSize: font.size || 16,
      fill: font.fillColor || "#000",
      stroke: font.strokeColor || "transparent",
      align: textAlign,
      fontWeight: (font.weight.toString() || "normal") as TextStyleFontWeight,
    });
    return style;
  }
  draw1(entityId: string) {
    this.stateStore = this.engine.stateStore;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);

    const size = state.size;
    let textGraphic = this.graphicsMap.get(entityId) as Text;
    if (!textGraphic) {
      const style = this.getTextStyle(state.font);
      textGraphic = new Text({
        text: state.font.text,
        style,
      });
      this.graphicsMap.set(entityId, textGraphic);
    }
    if (!this.isPositionDirty(entityId, state)) return;
    textGraphic.position.set(state.position.x, state.position.y);

    if (!this.isGeometryDirty(entityId, state)) return;

    const style = this.getTextStyle(state.font);
    let textBaseline = state.font.textBaseline || "top";
    if (textBaseline === "alphabetic") textBaseline = "bottom";
    textGraphic.style = style;
    textGraphic.anchor.set(0, 0);
    textGraphic.resolution = window.devicePixelRatio;
    const textAlign = style.align;
    // 根据 textAlign 和 textBaseline 调整位置
    let offsetX = 0;
    let offsetY = 0;
    if (textAlign === "center") {
      offsetX = size.width / 2;
      textGraphic.anchor.x = 0.5;
    } else if (textAlign === "right") {
      offsetX = size.width;
      textGraphic.anchor.x = 1;
    }

    if (textBaseline === "middle") {
      offsetY = size.height / 2;
      textGraphic.anchor.y = 0.5;
    } else if (textBaseline === "bottom") {
      offsetY = size.height;
      textGraphic.anchor.y = 1;
    }

    textGraphic.x = offsetX;
    textGraphic.y = offsetY;
    textGraphic.position.set(state.position.x, state.position.y);
    this.engine.addChild(textGraphic);
  }
}
