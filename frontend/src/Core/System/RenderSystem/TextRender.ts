import type { Canvas, CanvasKit } from "canvaskit-wasm";
import type { Engine } from "../../Core/Engine";
import type { StateStore } from "../../types";
import { System } from "../System";

export class TextRender extends System {
  engine: Engine;
  stateStore: StateStore | null = null;
  constructor(engine: Engine) {
    super();
    this.engine = engine;
  }

  drawSystemText(
    canvas: Canvas,
    text: string,
    x: number,
    y: number,
    options: {
      fontSize?: number;
      fontFamilies?: string[];
      color?: string;
      maxWidth?: number;
      align?: "left" | "center" | "right";
      textBaseline?: "top" | "middle" | "bottom";
      fontWeight?: string;
    } = {}
  ) {
    const CanvasKit = this.engine.ck;
    if (
      !CanvasKit
      // !DefaultFont
    ) {
      console.warn("CanvasKit 或默认字体未初始化");
      return;
    }

    const parseColor = (colorStr: string) => {
      const color = CanvasKit.parseColorString(colorStr);
      return color;
    };

    const {
      fontSize = 16,
      fontFamilies,
      color = "#000000",
      maxWidth = 9999,
      align = "left",
      textBaseline,
      fontWeight = 400,
    } = options;

    // 解析字体粗细
    let fontWeightValue = CanvasKit.FontWeight.Normal;
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
    const paraStyle = new CanvasKit.ParagraphStyle({
      textAlign:
        align === "center"
          ? CanvasKit.TextAlign.Center
          : align === "right"
          ? CanvasKit.TextAlign.Right
          : CanvasKit.TextAlign.Left,
      textStyle: {
        color: parseColor(color),
        fontFamilies,
        fontSize,
        fontStyle: {
          weight: fontWeightValue,
        },
        fontVariations: [
          { axis: "wght", value: Number(fontWeight) }, // 例如 700
        ],
      },
    });

    let textY = y;
    if (textBaseline === "middle") {
      textY = y - fontSize / 2;
    } else if (textBaseline === "bottom") {
      textY = y - fontSize;
    }

    const builder = CanvasKit.ParagraphBuilder.Make(
      paraStyle,
      this.engine.fontMgr
    );
    builder.addText(text);
    const paragraph = builder.build();
    paragraph.layout(maxWidth);

    canvas.drawParagraph(paragraph, x, textY);

    // 释放 CanvasKit 对象内存
    paragraph.delete();
    builder.delete();
  }
  draw1(entityId: string): void {
    // Skia 渲染逻辑待实现
    this.stateStore = this.engine.stateStore;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);
    if (!state) return;

    const font = state.font;
    const size = state.size;
    const textAlign = font.textAlign || "start";
    const textBaseline = font.textBaseline || "top";
    const canvas = this.engine.canvas;

    this.drawSystemText(canvas, font.text, 0, 0, {
      fontSize: font.size,
      color: font.fillColor || "#000",
      align: textAlign as "left" | "center" | "right",
      maxWidth: size.width,
      fontFamilies:
        // 需要设置字体,目前没有可用字体
        ["Noto Sans SC"],
      textBaseline: textBaseline as "top" | "middle" | "bottom",
      fontWeight: String(font.weight || "normal"),
    });
  }
}
