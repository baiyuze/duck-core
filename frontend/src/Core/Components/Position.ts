export class Position {
  x: number = 0;
  y: number = 0;
  constructor(data: Partial<Position>) {
    this.x = data.x || 0;
    this.y = data.y || 0;
  }
}
