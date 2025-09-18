import { DSL } from "./DSL/DSL";
import { System } from "./System/System";

export class Core {
  dsls: DSL[] = [];

  system: System;

  ctx: CanvasRenderingContext2D | null;
  constructor(dsls: any[], ctx: CanvasRenderingContext2D | null) {
    console.log("Core initialized");
    this.initDSL(dsls);
    this.initCore();
    this.system = new System(ctx);
    this.ctx = ctx;
  }

  initCore(dsl?: DSL[]) {
    if (dsl) {
      // this.DSL =
    }
  }

  initDSL(dsls: DSL[]) {
    dsls.forEach((dsl) => {
      this.dsls.push(new DSL(dsl.position, dsl.size, dsl.color));
    });
  }
}
