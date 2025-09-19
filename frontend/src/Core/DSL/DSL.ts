// import type { Color } from "../Widgets/Color";
// import type { Position } from "../Widgets/Position";
// import type { Size } from "../Widgets/Size";

import { Position } from "../Components/Position";
import { Size } from "../Components/Size";
import { Color } from "../Components/Color";
import { Entity } from "../Entity/Entity";

interface DSLParams {
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: { filelColor?: string; strokeColor?: string };
  id: string;
  selected: { value: boolean };
}
export class DSL {
  position: Position;

  size: Size;

  color: Color;

  id: string;

  selected: { value: boolean } = { value: false };

  constructor({ position, size, color, id, selected }: DSLParams) {
    this.position = new Position(position.x, position.y);
    this.size = new Size(size.width, size.height);
    this.color = new Color(color.filelColor, color.strokeColor);
    this.id = id;
    this.selected = selected;
  }
}
