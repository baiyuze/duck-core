import { Base } from "./Base";

export class Position extends Base {
  x: number = 0;
  y: number = 0;
  constructor(x: number, y: number) {
    super();
    this.x = x;
    this.y = y;
  }
  setPosition(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
  getPosition() {
    return { x: this.x, y: this.y };
  }
}
