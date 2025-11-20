import { mergeWith } from "lodash";

export class Config {
  static container: HTMLDivElement | null = null;
  static width = 800;
  static height = 800;
  static drag = { enabled: true };
  static selected = { enabled: true };
  static hover = { enabled: true };
  static mode = "Canvaskit";
  static camera = {
    minX: 0,
    maxX: 800,
    minY: 0,
    maxY: 800,
    scale: true,
  };
  static scroll = {
    bar: {
      enabled: true,
    },
    enabled: true,
  };
  /**
   * Merge config
   * @param obj
   */
  static merge(obj: Partial<Config>) {
    mergeWith(Config, obj, (_objValue, srcValue) => {
      if (Array.isArray(srcValue)) {
        return srcValue;
      }
    });
  }
}
