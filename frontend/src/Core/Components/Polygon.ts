interface Point {
  type: "M" | "L" | "Q" | "C";
  controlPoint?: { x: number; y: number };
  startPoint?: { x: number; y: number };
  endPoint?: { x: number; y: number };
  point?: { x: number; y: number };
}
export default class Polygon {
  vertexs: Point[] = [];
  constructor(data?: Partial<Polygon>) {
    this.vertexs = data?.vertexs || [];
  }
}
