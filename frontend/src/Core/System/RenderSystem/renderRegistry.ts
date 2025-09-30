import { TextRender } from "./TextRender";
import { EllipseRender } from "./EllipseRender";
import { RectRender } from "./RectRender";
import { ImgRender } from "./ImgRender";
import { ShapeType } from "../../enum";

export default {
  [ShapeType.Text]: TextRender,
  [ShapeType.Ellipse]: EllipseRender,
  [ShapeType.Rectangle]: RectRender,
  [ShapeType.Img]: ImgRender,
};
