import { useEffect, useRef, useState } from "react";
import type { CanvasProps } from "./Canvas.d";
import { Core } from "../Core/Core";
import type { DSL } from "../Core/DSL/DSL";
import { RenderSystem } from "../Core/System/RenderSystem";
import { SelectionSystem } from "../Core/System/SelectionSystem";
import { PickingSystem } from "../Core/System/PickingSystem";

function Canvas(props: CanvasProps) {
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
  const offSetCtxRef = useRef<CanvasRenderingContext2D | null>(null);
  const posRef = useRef({ x: 10, y: 10 });

  const rect = () => {
    if (ctxRef.current) {
      ctxRef.current.clearRect(0, 0, props.width, props.height); // 清空画布
      ctxRef.current.fillStyle = "#f1f1f1";
      ctxRef.current.fillRect(posRef.current.x, posRef.current.y, 290, 290);

      ctxRef.current.strokeStyle = "blue";

      ctxRef.current.strokeRect(
        posRef.current.x - 3,
        posRef.current.y - 3,
        296,
        296
      );

      offSetCtxRef.current?.clearRect(0, 0, props.width, props.height); // 清空画布
      offSetCtxRef.current!.fillStyle = "rgb(0,0,255,255)";
      offSetCtxRef.current!.fillRect(
        posRef.current.x,
        posRef.current.y,
        290,
        290
      );

      // requestAnimationFrame(rect);
    }
  };
  const render = () => {
    requestAnimationFrame(rect);
  };
  useEffect(() => {
    // const offSetCanvasRef = document.createElement("canvas");
    // offSetCanvasRef.width = props.width;
    // offSetCanvasRef.height = props.height;
    // offSetCtxRef.current = offSetCanvasRef.getContext("2d");
    const canvasDom = document.getElementById("canvas") as HTMLCanvasElement;
    ctxRef.current = canvasDom.getContext("2d");
    // render();
    // setTimeout(() => {
    //   const pixel: ImageData = offSetCtxRef.current!.getImageData(
    //     posRef.current.x + 10,
    //     posRef.current.y + 10,
    //     1,
    //     1
    //   );
    //   console.log(pixel.data.join(","), 111);
    // }, 1000);
    const dsls: any = [
      {
        position: { x: 10, y: 10 },
        size: { width: 290, height: 290 },
        color: { filelColor: "#f1f1f1" },
        id: "1",
        selected: { value: true },
      },
      {
        position: { x: 50, y: 50 },
        size: { width: 290, height: 290 },
        color: { filelColor: "#f2f2f2" },
        id: "2",
        selected: { value: true },
      },
    ];
    if (ctxRef.current) {
      const core = new Core(dsls, ctxRef.current);
      core.addSystem(new RenderSystem(ctxRef.current));
      core.addSystem(new SelectionSystem(ctxRef.current));
      core.addSystem(new PickingSystem(ctxRef.current));
      core.update();
      console.log(core, "core");
    }
  }, []);
  return (
    <div className="canvas">
      <canvas id="canvas" width={props.width} height={props.height}></canvas>
    </div>
  );
}
export default Canvas;
