import type { Color } from "antd/es/color-picker";
import type {
  Font,
  Img,
  LineWidth,
  Position,
  Radius,
  Rotation,
  Size,
} from "./Components";
import type Polygon from "./Components/Polygon";
import type Scale from "./Components/Scale";
import { DSL } from "./DSL/DSL";
import type { StateStore } from "./types";
import type { DSLParams } from "./types/dsl";

export const getComponentsByEntityId = (
  components: StateStore,
  entityId: string
) => {
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
  const id = entityId;
  const radius = components.radius.get(entityId) as Radius;

  return new DSL({
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
    radius,
    id,
  } as unknown as DSLParams);
};
