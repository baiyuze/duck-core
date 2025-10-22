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
import { LineWidth } from "../Components/LineWidth";
import { Img } from "../Components/Img";
import { ZIndex } from "../Components/ZIndex";
import Scale from "../Components/Scale";
import Polygon from "../Components/Polygon";
import { EllipseRadius } from "../Components/EllipseRadius";
import { Selected } from "../Components/Selected";
import { Radius } from "../Components/Radius";

export class DSL {
  type: string;

  position: Position;

  size: Size;

  color: Color;

  id: string;

  selected?: Selected;

  eventQueue: { type: string; event: MouseEvent }[] = [];

  hovered: boolean = false;

  rotation: Rotation = new Rotation(0);

  font: Font;

  name: Name;

  lineWidth: LineWidth = new LineWidth(0);

  img: Img = new Img();

  zIndex: ZIndex = new ZIndex(0);

  scale: Scale = new Scale(1);

  polygon: Polygon = new Polygon();

  ellipseRadius: EllipseRadius = new EllipseRadius();

  radius: Radius = new Radius();

  constructor({
    position,
    size,
    color,
    id,
    selected,
    eventQueue,
    type,
    rotation,
    font,
    name,
    lineWidth,
    img,
    zIndex,
    scale,
    polygon,
    radius,
  }: DSLParams) {
    this.position = new Position(position);
    this.size = new Size(size?.width, size?.height);
    this.color = new Color(color?.fillColor, color?.strokeColor);
    this.rotation = new Rotation(rotation?.value || 0);
    this.id = id;
    this.selected = new Selected(selected);
    this.eventQueue = eventQueue || [];
    this.type = type;
    this.font = new Font(font);
    this.name = new Name(name);
    this.lineWidth = new LineWidth(lineWidth?.value || 0);
    this.img = new Img(img);
    this.zIndex = new ZIndex(zIndex?.value);
    this.scale = new Scale(scale?.value);
    this.polygon = new Polygon(polygon);
    // this.ellipseRadius = new EllipseRadius(ellipseRadius);
    this.radius = new Radius(radius);
  }
}
