export default class Polygon {
  vertexs: { x: number; y: number }[] = [];
  constructor(data?: Partial<Polygon>) {
    this.vertexs = data?.vertexs || [];
  }
}
