import type {
  Canvas,
  CanvasKit,
  Paragraph,
  ParagraphStyle,
} from "canvaskit-wasm";
import type { Engine } from "../../Core/Engine";
import type { StateStore } from "../../types";
import { System } from "../System";
import type { DSL } from "../../DSL/DSL";

export class TextRender extends System {
  engine: Engine;
  stateStore: StateStore | null = null;
  fontCache: Map<string, any> = new Map();

  constructor(engine: Engine) {
    super();
    this.engine = engine;
  }

  parseColor(colorStr: string) {
    const CanvasKit = this.engine.ck;
    const color = CanvasKit.parseColorString(colorStr);
    return color;
  }

  getFontStyle(state: DSL, text: string) {
    const CanvasKit = this.engine.ck;
    const fontWeight = state.font.weight || "400";
    let fontWeightValue = CanvasKit.FontWeight.Normal;
    const align = state.font.textAlign;
    const color = state.font.fillColor || "#000000";
    const fontSize = state.font.size || 16;
    const fontFamilies = ["Noto Sans SC"];
    if (fontWeight) {
      const weightMap: { [key: string]: any } = {
        "100": CanvasKit.FontWeight.Thin,
        "200": CanvasKit.FontWeight.ExtraLight,
        "300": CanvasKit.FontWeight.Light,
        "400": CanvasKit.FontWeight.Normal,
        "500": CanvasKit.FontWeight.Medium,
        "600": CanvasKit.FontWeight.SemiBold,
        "700": CanvasKit.FontWeight.Bold,
        "800": CanvasKit.FontWeight.ExtraBold,
        "900": CanvasKit.FontWeight.Black,
      };
      fontWeightValue = weightMap[fontWeight] || CanvasKit.FontWeight.Normal;
    }
    const paraStyle = {
      textAlign:
        align === "center"
          ? CanvasKit.TextAlign.Center
          : align === "right"
          ? CanvasKit.TextAlign.Right
          : CanvasKit.TextAlign.Left,
      textStyle: {
        color: this.parseColor(color),
        fontFamilies,
        fontSize,
        fontStyle: {
          weight: fontWeightValue,
        },
        fontVariations: [
          { axis: "wght", value: Number(fontWeight) }, // 例如 700
        ],
      },
    };
    return paraStyle;
  }

  getParagraphStyle(state: DSL, text: string): Paragraph {
    const fontStyle = this.getFontStyle(state, text);
    const key = JSON.stringify(fontStyle);
    if (this.fontCache.has(key)) {
      return this.fontCache.get(key);
    }
    const paraStyle = new this.engine.ck.ParagraphStyle(fontStyle);
    const builder = this.engine.ck.ParagraphBuilder.Make(
      paraStyle,
      this.engine.fontMgr
    );
    builder.addText(text);
    const paragraph = builder.build();
    builder.delete();
    paragraph.layout(state.size.width);
    this.fontCache.set(key, paragraph);
    return paragraph;
  }

  drawSystemText(
    canvas: Canvas,
    text: string,
    x: number,
    y: number,
    state: DSL
  ) {
    const CanvasKit = this.engine.ck;
    if (
      !CanvasKit
      // !DefaultFont
    ) {
      console.warn("CanvasKit 或默认字体未初始化");
      return;
    }
    // 解析字体粗细
    const textBaseline = state.font.textBaseline || "top";
    const fontSize = state.font.size || 16;
    const paragraph = this.getParagraphStyle(state, text);

    let textY = y;
    if (textBaseline === "middle") {
      textY = y - fontSize / 2;
    } else if (textBaseline === "bottom") {
      textY = y - fontSize;
    }

    canvas.drawParagraph(paragraph, x, textY);
  }
  draw1(entityId: string): void {
    this.stateStore = this.engine.stateStore;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);
    if (!state) return;

    const font = state.font;
    const canvas = this.engine.canvas;

    this.drawSystemText(canvas, font.text, 0, 0, state);
  }

  destroyed(): void {
    // 清理字体缓存
    this.fontCache.forEach((paragraph) => {
      paragraph.delete();
    });
    this.fontCache.clear();
  }
}
