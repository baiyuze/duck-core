import type { Color, Position, Size } from "../Components";
import type { Img } from "../Components/Img";
import type { LineWidth } from "../Components/LineWidth";
import type Polygon from "../Components/Polygon";
import type Scale from "../Components/Scale";
import type { ZIndex } from "../Components/ZIndex";

export interface DSLParams {
  position: Position;
  size: Size;
  color: Color;
  lineWidth?: LineWidth;
  id: string;
  selected?: { value: boolean; hovered?: boolean };
  eventQueue?: { type: string; event: MouseEvent }[];
  type: string;
  rotation: Rotation;
  font: Font;
  name?: string;
  img?: Img;
  zIndex: ZIndex;
  scale?: Scale;
  polygon?: Polygon;
}
