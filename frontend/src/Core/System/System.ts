import type {
  Color,
  Font,
  LineWidth,
  Position,
  Rotation,
  Size,
} from "../Components";
import type { Img } from "../Components/Img";
import type { Core } from "../Core";
import type { DSL } from "../DSL/DSL";
import type { StateStore } from "../types";

export class System {
  update(components: StateStore) {}
  draw(entityId: string) {}
  /**
   * 根据 entityId 获取组件信息
   * @param components
   * @param entityId
   * @returns
   */
  getComponentsByEntityId(components: StateStore, entityId: string) {
    const size = components.size.get(entityId) as Size;
    const position = components.position.get(entityId) as Position;
    const color = components.color.get(entityId) as Color;
    const rotation = components.rotation.get(entityId) as Rotation;
    const type = components.type.get(entityId) as string;
    const lineWidth = components.lineWidth.get(entityId) as LineWidth;
    const font = components.font.get(entityId) as Font;
    const img = components.img.get(entityId) as Img;

    return {
      size,
      position,
      color,
      rotation,
      type,
      lineWidth,
      font,
      img,
    };
  }
}
