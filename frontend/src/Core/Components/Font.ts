export class Font {
  family: string = "Arial";
  size: number = 12;
  weight: "normal" | "bold" | "bolder" | "lighter" | number = "normal";
  style: "normal" | "italic" | "oblique" = "normal";
  variant: "normal" | "small-caps" = "normal";
  lineHeight: "normal" | number = "normal";
  text: string = "Text";
  fillColor: string = "#000000";
  strokeColor?: string;
  constructor(data?: Partial<Font>) {
    this.family = data?.family || this.family;
    this.size = data?.size || this.size;
    this.weight = data?.weight || this.weight;
    this.style = data?.style || this.style;
    this.variant = data?.variant || this.variant;
    this.lineHeight = data?.lineHeight || this.lineHeight;
    this.text = data?.text || this.text;
    this.fillColor = data?.fillColor || this.fillColor;
    this.strokeColor = data?.strokeColor;
  }
}
