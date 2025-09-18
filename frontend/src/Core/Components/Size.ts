import { Base } from "./Base";

export class Size extends Base {
  width: number = 0;
  height: number = 0;
  constructor(width: number, height: number) {
    super();
    this.width = width;
    this.height = height;
  }
  setSize(width: number, height: number) {
    this.width = width;
    this.height = height;
  }
  getSize() {
    return { width: this.width, height: this.height };
  }
}
