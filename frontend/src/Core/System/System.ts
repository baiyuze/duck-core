import type {
  Color,
  Font,
  LineWidth,
  Position,
  Rotation,
  Size,
} from "../Components";
import type { EllipseRadius } from "../Components/EllipseRadius";
import type { Img } from "../Components/Img";
import type Polygon from "../Components/Polygon";
import type Scale from "../Components/Scale";
import type { Engine } from "../Core/Engine";
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
    const scale = components.scale.get(entityId) as Scale;
    const polygon = components.polygon.get(entityId) as Polygon;
    const ellipseRadius = components.ellipseRadius.get(
      entityId
    ) as EllipseRadius;

    return {
      size,
      position,
      color,
      rotation,
      type,
      lineWidth,
      font,
      img,
      scale,
      polygon,
      ellipseRadius,
    };
  }
  /**
   * 销毁
   */
  destroyed() {}
}
