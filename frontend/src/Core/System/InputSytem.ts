import type { Core } from "../Core";
import type { ComponentStore } from "../types";
import { System } from "./System";

/**
 * 处理键盘输入的系统
 */
export class InputSystem extends System {
  ctx: CanvasRenderingContext2D;
  core: Core;
  entityManager: any;
  components: ComponentStore | null = null;
  keys: string[] = [];
  constructor(ctx: CanvasRenderingContext2D, core: Core) {
    super();
    this.ctx = ctx;
    this.core = core;
    document.addEventListener("keydown", (e) => {
      if (e.key) {
        this.keys.push(e.key);
        const t = setTimeout(() => {
          this.keyDownHandler();
          clearTimeout(t);
        }, 500);
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key) {
        this.keys.push(e.key);
        const t = setTimeout(() => {
          this.keyUpHandler();
          clearTimeout(t);
        }, 500);
      }
    });
  }

  getKeysName = () => {
    const keys = Array.from(new Set(this.keys));
    const keyString = keys.sort().join("+");
    this.keys = [];
    if (keys.length === 0) return;
    return keyString;
  };

  keyDownHandler() {
    const keyString = this.getKeysName();
    this.keys = [];
    const keyFn = {
      Meta: () => {
        this.core.multiple = true;
      },
    };
    const fn = keyFn[keyString as keyof typeof keyFn];
    if (fn) fn();
  }
  keyUpHandler() {
    const keyString = this.getKeysName();
    this.keys = [];
    const keyFn = {
      Meta: () => {
        this.core.multiple = false;
      },
    };
    const fn = keyFn[keyString as keyof typeof keyFn];
    if (fn) fn();
  }

  update(components: ComponentStore) {
    this.components = components;
  }
}
