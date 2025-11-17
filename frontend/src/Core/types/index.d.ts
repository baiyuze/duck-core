import type { Color, Font, Position, Size, Img } from "../Components";
import type { EllipseRadius } from "../Components/EllipseRadius";
import type {} from "../Components/Img";
import type Polygon from "../Components/Polygon";
import type { Radius } from "../Components/Radius";
import type Scale from "../Components/Scale";
import type { Selected } from "../Components/Selected";
import type { Engine } from "../Core/Engine";

export type StateStore = {
  position: Map<string, Position>;
  size: Map<string, Size>;
  color: Map<string, Color>;
  selected: Map<string, Selected>;
  eventQueue: { type: string; event: MouseEvent | WheelEvent }[];
  rotation: Map<string, { value: number }>;
  type: Map<string, string>;
  font: Map<string, Font>;
  lineWidth: Map<string, { value: number }>;
  img: Map<string, Img>;
  scale: Map<string, Scale>;
  polygon: Map<string, Polygon>;
  // ellipseRadius: Map<string, EllipseRadius>;
  radius: Map<string, Radius>;
};

export type PickEntity = {
  selected: Selected;
  entityId: string;
};

export type DefaultConfig = {
  width: number;
  height: number;
  container: HTMLDivElement;
  mode?: string;
};

export type RendererPromise = {
  default: RendererModule;
};

export type RendererModule = {
  [key: string]: SystemConstructor;
};

export type SystemConstructor = new (engine: Engine) => System;

export type CanvasInfo = {
  canvasDom: HTMLCanvasElement;
  canvas: any;
  ctx?: CanvasRenderingContext2D;
  [key: string]: any;
};
