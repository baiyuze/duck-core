import { useEffect } from "react";
import type { CanvasProps } from "./Canvas.d";

function Canvas(props: CanvasProps) {
  return (
    <div className="canvas">
      <canvas id="canvas" width={props.width} height={props.height}></canvas>
    </div>
  );
}
export default Canvas;
