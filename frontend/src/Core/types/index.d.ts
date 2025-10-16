import type { Color, Font, Position, Size, Img } from "../Components";
import type { EllipseRadius } from "../Components/EllipseRadius";
import type {} from "../Components/Img";
import type Polygon from "../Components/Polygon";
import type Scale from "../Components/Scale";
import type { Selected } from "../Components/Selected";

export type StateStore = {
  position: Map<string, Position>;
  size: Map<string, Size>;
  color: Map<string, Color>;
  selected: Map<string, Selected>;
  eventQueue: { type: string; event: MouseEvent }[];
  rotation: Map<string, { value: number }>;
  type: Map<string, string>;
  font: Map<string, Font>;
  lineWidth: Map<string, { value: number }>;
  img: Map<string, Img>;
  scale: Map<string, Scale>;
  polygon: Map<string, Polygon>;
  ellipseRadius: Map<string, EllipseRadius>;
};

export type PickEntity = {
  selected: Selected;
  entityId: string;
};
