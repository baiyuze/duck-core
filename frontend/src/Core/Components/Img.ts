export class Img {
  src?: string;
  svgContent?: string;
  constructor(data?: Partial<Img>) {
    this.src = data?.src || "";
    this.svgContent = data?.svgContent || "";
  }
}
