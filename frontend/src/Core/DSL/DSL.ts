// import type { Color } from "../Widgets/Color";
// import type { Position } from "../Widgets/Position";
// import type { Size } from "../Widgets/Size";

import { Position } from "../Widgets/Position";
import { Size } from "../Widgets/Size";
import { Color } from "../Widgets/Color";

export class DSL {
  position: Position;

  size: Size;

  color: Color;

  constructor(position: Position, size: Size, color: Color) {
    this.position = new Position(position.x, position.y);
    this.size = new Size(size.width, size.height);
    this.color = new Color(color.value);
  }
}
