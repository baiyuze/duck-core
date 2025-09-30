export class Img {
  src?: string;
  constructor(data?: Partial<Img>) {
    this.src = data?.src || "";
  }
}
