import type { Core } from "../../Core";
import type { StateStore } from "../../types";
import { System } from "../System";

export class TextRender extends System {
  core: Core;
  ctx: CanvasRenderingContext2D;
  stateStore: StateStore | null = null;
  constructor(ctx: CanvasRenderingContext2D, core: Core) {
    super();
    this.core = core;
    this.ctx = ctx;
  }
  draw(entityId: string) {
    this.stateStore = this.core.stateStore;
    if (!this.stateStore) return;
    const state = this.getComponentsByEntityId(this.stateStore, entityId);
    if (!state) return;

    const { x, y } = state.position;
    const font = state.font;
    const parts = [
      font.style || "",
      font.variant || "",
      font.weight || "",
      `${font.size || 16}px`,
      font.family || "Arial",
    ];
    this.ctx.font = parts.filter((v) => v).join(" ");
    this.ctx.fillStyle = font.fillColor || "#000";
    this.ctx.strokeStyle = font.strokeColor || "transparent";
    if (font.strokeColor) this.ctx.strokeText(font.text, x, y + font.size);
    this.ctx.fillText(font.text, x, y + font.size);
  }
}
