// import type { Color } from "../Widgets/Color";
// import type { Position } from "../Widgets/Position";
// import type { Size } from "../Widgets/Size";

import { Position } from "../Components/Position";
import { Size } from "../Components/Size";
import { Color } from "../Components/Color";
import { Entity } from "../Entity/Entity";
import { Rotation } from "../Components/Rotation";

interface DSLParams {
  position: { x: number; y: number };
  size: { width: number; height: number };
  color: { filelColor?: string; strokeColor?: string };
  id: string;
  selected: { value: boolean };
  eventQueue?: { type: string; event: MouseEvent }[];
  hovered?: boolean;
  type: string;
  rotation: Rotation;
}
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
  }
}
