import type { Color, Position, Size } from "../Components";

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
};
