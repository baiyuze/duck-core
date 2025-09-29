export interface DSLParams {
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: { filelColor?: string; strokeColor?: string };
  id: string;
  selected: { value: boolean };
  eventQueue?: { type: string; event: MouseEvent }[];
  hovered?: boolean;
  type: string;
  rotation: Rotation;
  font: Font;
  name?: string;
}
