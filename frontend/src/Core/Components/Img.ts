export class Img {
  src?: string;
  path?: string;
  constructor(data?: Partial<Img>) {
    this.src = data?.src || "";
    this.path = data?.path || "";
  }
}
