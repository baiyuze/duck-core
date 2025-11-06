import {
  SCALE_MODES,
  Text,
  TextStyle,
  type TextStyleFontWeight,
} from "pixi.js";
import type { Engine } from "../../Core/Engine";
import type { StateStore } from "../../types";
import { System } from "../System";
import type { Font } from "../../Components";
import type { DSL } from "../../DSL/DSL";

export class TextRender extends System {
  engine: Engine;
  stateStore: StateStore | null = null;
  constructor(engine: Engine) {
    super();
    this.engine = engine;
  }

  /**
   * 获取文本样式
   * @param font 字体信息
   * @returns 文本样式
   */
  getTextStyle(font: Font): TextStyle {
    let textAlign = font.textAlign || "left";

    if (textAlign === "start") textAlign = "left";
    if (textAlign === "end") textAlign = "right";

    const style = new TextStyle({
      fontFamily: font.family,
      fontSize: font.size || 16,
      fill: font.fillColor || "#000",
      stroke: font.strokeColor || "transparent",
      align: textAlign,
      fontWeight: (font.weight.toString() || "normal") as TextStyleFontWeight,
    });
    return style;
  }
  /**
   * 设置文本对齐方式
   * @param state
   * @param textGraphic
   */
  setTextAlign(state: DSL, textGraphic: Text) {
    const style = this.getTextStyle(state.font);

    let textBaseline = state.font.textBaseline || "top";
    if (textBaseline === "alphabetic") textBaseline = "bottom";
    textGraphic.text = state.font.text;
    textGraphic.style = style;

    const textAlign = style.align;

    // 设置锚点
    if (textAlign === "center") {
      textGraphic.anchor.x = 0.5;
    } else if (textAlign === "right") {
      textGraphic.anchor.x = 1;
    } else {
      textGraphic.anchor.x = 0;
    }

    if (textBaseline === "middle") {
      textGraphic.anchor.y = 0.5;
    } else if (textBaseline === "bottom") {
      textGraphic.anchor.y = 1;
    } else {
      textGraphic.anchor.y = 0;
    }
  }

  setTextPosition(state: DSL, textGraphic: Text) {
    const size = state.size;
    const style = this.getTextStyle(state.font);
    const textAlign = style.align;
    let textBaseline = state.font.textBaseline || "top";
    if (textBaseline === "alphabetic") textBaseline = "bottom";

    let offsetX = 0;
    let offsetY = 0;
    if (textAlign === "center") {
      offsetX = Math.round(size.width / 2);
    } else if (textAlign === "right") {
      offsetX = Math.round(size.width);
    }
    if (textBaseline === "middle") {
      offsetY = Math.round(size.height / 2);
    } else if (textBaseline === "bottom") {
      offsetY = Math.round(size.height);
    }

    textGraphic.position.set(
      state.position.x + offsetX,
      state.position.y + offsetY
    );
  }
  draw(entityId: string) {
    this.stateStore = this.engine.stateStore;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);

    let textGraphic = this.graphicsMap.get(entityId) as Text;
    if (!textGraphic) {
      const style = this.getTextStyle(state.font);
      textGraphic = new Text({
        text: state.font.text,
        style,
      });
      this.graphicsMap.set(entityId, textGraphic);
    }

    if (!this.isGeometryDirty(entityId, state)) {
      // 即使几何形状没变,位置可能变了,需要更新位置
      if (this.isPositionDirty(entityId, state)) {
        this.setTextPosition(state, textGraphic);
      }
      return;
    }

    this.setTextAlign(state, textGraphic);
    // 计算偏移量(用于定位到容器内的正确位置)
    this.setTextPosition(state, textGraphic);

    this.engine.addChild(textGraphic);
  }
}
