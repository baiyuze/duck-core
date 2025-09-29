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
  // 文字
  Text: "text",
  // 图片
  Image: "image",
  // 线段
  Line: "line",
  // 折线
  Polyline: "polyline",
  // 多边形
  Polygon: "polygon",
  // 贝塞尔曲线
  BezierCurve: "beziercurve",
  // 路径
  Path: "path",
} as const;

export type ShapeType = (typeof ShapeType)[keyof typeof ShapeType];
