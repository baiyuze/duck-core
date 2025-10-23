export class Color {
  fillColor?: string = "";
  strokeColor?: string = "";
  strokeTColor?: string = "";
  strokeBColor?: string = "";
  strokeLColor?: string = "";
  strokeRColor?: string = "";
  constructor(data?: Partial<Color>) {
    if (data) {
      this.fillColor = data.fillColor;
      this.strokeColor = data.strokeColor;
      this.strokeTColor = data.strokeTColor;
      this.strokeBColor = data.strokeBColor;
      this.strokeLColor = data.strokeLColor;
      this.strokeRColor = data.strokeRColor;
    }
  }
}
