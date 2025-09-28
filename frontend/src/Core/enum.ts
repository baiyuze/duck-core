export const EventType = {
  Click: "click",
  MouseMove: "mousemove",
  MouseDown: "mousedown",
  MouseUp: "mouseup",
  TouchStart: "touchstart",
  TouchMove: "touchmove",
  TouchEnd: "touchend",
} as const;

export type EventType = (typeof EventType)[keyof typeof EventType];

export const ShapeType = {
  // 矩形
  Rectangle: "rect",
  // 圆形
  Circle: "circle",
  // 椭圆形
  Ellipse: "ellipse",
  // 三角形
  Triangle: "triangle",
} as const;

export type ShapeType = (typeof ShapeType)[keyof typeof ShapeType];
