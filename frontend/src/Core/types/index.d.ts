import type { Color, Font, Position, Size, Img } from "../Components";
import type {} from "../Components/Img";
import type Polygon from "../Components/Polygon";
import type Scale from "../Components/Scale";

export type StateStore = {
  position: Map<string, Position>;
  size: Map<string, Size>;
  color: Map<string, Color>;
  selected: Map<string, { value: boolean; hovered: boolean }>;
  eventQueue: { type: string; event: MouseEvent }[];
  rotation: Map<string, { value: number }>;
  type: Map<string, string>;
  font: Map<string, Font>;
  lineWidth: Map<string, { value: number }>;
  img: Map<string, Img>;
  scale: Map<string, Scale>;
  polygon: Map<string, Polygon>;
};
