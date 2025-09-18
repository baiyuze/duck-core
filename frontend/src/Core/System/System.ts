import type { DSL } from "../DSL/DSL";

export class System {
  ctx: CanvasRenderingContext2D | null = null;
  constructor(ctx: CanvasRenderingContext2D | null = null) {
    this.ctx = ctx;
  }
  renderTime(cb: Function) {
    console.time("----render----");
    cb();
    console.timeEnd("----render----");
  }
  render(dsls: DSL[]) {
    this.renderTime(() => {
      // 渲染逻辑
      requestAnimationFrame(() => {
        if (this.ctx) {
          dsls.forEach((dsl) => {
            this.ctx!.fillStyle = dsl.color.value;
            console.log(this.ctx, "this.ctx", dsl.color.value);
            this.ctx!.fillRect(
              dsl.position.x,
              dsl.position.y,
              dsl.size.width,
              dsl.size.height
            );
          });
        }
      });
    });
  }
}
