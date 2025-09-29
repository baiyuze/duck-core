// import type { Color } from "../Widgets/Color";
// import type { Position } from "../Widgets/Position";
// import type { Size } from "../Widgets/Size";

import { Position } from "../Components/Position";
import { Size } from "../Components/Size";
import { Color } from "../Components/Color";
import { Entity } from "../Entity/Entity";
import { Rotation } from "../Components/Rotation";
import { Font } from "../Components/Font";
import { Name } from "../Components/Name";
import type { DSLParams } from "../types/dsl";

export class DSL {
  type: string;

  position: Position;

  size: Size;

  color: Color;

  id: string;

  selected: { value: boolean } = { value: false };

  eventQueue: { type: string; event: MouseEvent }[] = [];

  hovered: boolean = false;

  rotation: Rotation = new Rotation(0);

  font: Font;

  name: Name;

  // ctx.ellipse(x, y, rx, ry, rotation, 0, 2*Math.PI);

  // event: Event

  constructor({
    position,
    size,
    color,
    id,
    selected,
    eventQueue,
    hovered,
    type,
    rotation,
    font,
    name,
  }: DSLParams) {
    this.position = new Position(position.x, position.y);
    this.size = new Size(size.width, size.height);
    this.color = new Color(color.filelColor, color.strokeColor);
    this.rotation = new Rotation(rotation?.value || 0);
    this.id = id;
    this.selected = selected;
    this.eventQueue = eventQueue || [];
    this.hovered = hovered || false;
    this.type = type;
    this.font = new Font(font);
    this.name = new Name(name);
  }
}
