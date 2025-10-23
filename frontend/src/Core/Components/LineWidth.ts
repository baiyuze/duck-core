export class LineWidth {
  value: number = 0;
  top: number = 0;
  bottom: number = 0;
  left: number = 0;
  right: number = 0;
  // 线宽
  constructor(data?: Partial<LineWidth>) {
    this.value = data?.value || 0;
    this.top = data?.top || 0;
    this.bottom = data?.bottom || 0;
    this.left = data?.left || 0;
    this.right = data?.right || 0;
  }
}
