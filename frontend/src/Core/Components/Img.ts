export class Img {
  src?: string;
  path?: string;
  svg?: string;
  constructor(data?: Partial<Img>) {
    this.src = data?.src || "";
    this.path = data?.path || "";
    this.svg = data?.svg || "";
  }
}
