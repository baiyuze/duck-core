export class EllipseRadius {
  // 水平半径
  rx: number = 0;
  // 垂直半径
  ry: number = 0;

  constructor(data?: Partial<EllipseRadius>) {
    this.rx = data?.rx || 0;
    this.ry = data?.ry || 0;
  }
}
