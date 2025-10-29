import type { Color, Position, Size } from "../Components";
import type { EllipseRadius } from "../Components/EllipseRadius";
import type { Font } from "../Components/Font";
import type { Img } from "../Components/Img";
import type Polygon from "../Components/Polygon";
import type { Radius } from "../Components/Radius";
import type Scale from "../Components/Scale";
import { Selected } from "../Components/Selected";
import { DSL } from "../DSL/DSL";
import { Entity } from "../Entity/Entity";
import type { StateStore } from "../types";

export class Core {
  defaultSize: Size = { width: 800, height: 800 };
  multiple: boolean = false;
  isDragging: boolean = false;
  dsls: DSL[] = [];
  entityManager = new Entity();
  stateStore: StateStore = Core.createStateStore();

  static createStateStore(): StateStore {
    return {
      position: new Map<string, Position>(),
      size: new Map<string, Size>(),
      color: new Map<string, Color>(),
      selected: new Map<string, Selected>(),
      eventQueue: [],
      rotation: new Map<string, { value: number }>(),
      type: new Map<string, string>(),
      font: new Map<string, Font>(),
      lineWidth: new Map<string, { value: number }>(),
      img: new Map<string, Img>(),
      scale: new Map<string, Scale>(),
      polygon: new Map<string, Polygon>(),
      radius: new Map<string, Radius>(),
    };
  }

  constructor(dsls: any[] = []) {
    this.initComponents(dsls);
  }

  sortDSLByZIndex(dsls: any[] = this.dsls) {
    return dsls.sort((a, b) => {
      const zIndexA = a.zIndex.value || 0;
      const zIndexB = b.zIndex.value || 0;
      return zIndexA - zIndexB;
    });
  }

  initComponents(dsls: any[] = []) {
    this.resetState();
    const sortedDSLS = this.sortDSLByZIndex(dsls);
    this.dsls = sortedDSLS.map((dsl) => new DSL(dsl));
    this.dsls.forEach((dsl: DSL) => {
      for (const key in dsl) {
        if (key === "selected") {
          dsl.selected = new Selected();
        }
        const value = (dsl as any)[key];

        if (value === undefined) {
          throw new Error(`DSL属性${key}未定义`);
        }

        if (
          (typeof value === "object" &&
            value !== null &&
            !Array.isArray(value)) ||
          key === "type"
        ) {
          const map = this.stateStore[key as keyof StateStore] as Map<
            string,
            DSL[keyof DSL]
          >;
          if (map && map instanceof Map) {
            map.set(dsl.id, value);
          }
        }
      }
    });
  }

  resetState() {
    this.stateStore = Core.createStateStore();
    this.entityManager = new Entity();
  }
}
