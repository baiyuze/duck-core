import { useEffect, useRef, useState } from "react";
import type { CanvasProps } from "./Canvas.d";
import { Core } from "../Core/Core";
import { DSL } from "../Core/DSL/DSL";
import { RenderSystem } from "../Core/System/RenderSystem/RenderSystem";
import { SelectionSystem } from "../Core/System/SelectionSystem";
import { PickingSystem } from "../Core/System/PickingSystem";
import styles from "./Canvas.module.scss";
import { EventSystem } from "../Core/System/EventSystem";
import { InputSystem } from "../Core/System/InputSytem";
import CopilotDemo from "../Components/AiChat/AiChat";

function Canvas(props: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initCanvas = () => {
    const dsls = [];
    if (canvasRef.current) {
      const core = new Core(dsls);
      const context = core.initCanvas(canvasRef.current, {
        width: 800,
        height: 800,
      });

      core.addSystem(new RenderSystem(context, core));
      core.addSystem(new PickingSystem(context, core));
      core.addSystem(new SelectionSystem(context, core));
      core.addSystem(new EventSystem(context, core));
      core.addSystem(new InputSystem(context, core));
      core.update();
      console.log(core, "core");
    }
  };
  useEffect(() => {
    canvasRef.current = document.getElementById("canvas") as HTMLCanvasElement;
    initCanvas();
    // return () => {
    //   // 这里做一些清理工作
    //   canvasRef.current?.remove();
    //   initCanvas();
    // };
  }, []);

  return (
    <div className={styles.canvasContainer}>
      {/* <div className={styles.top}></div> */}
      <div className={styles.left}></div>
      <div className={styles.canvas}>
        <canvas id="canvas" width={800} height={800}></canvas>
      </div>
      <div className={styles.controls}>
        <CopilotDemo />
      </div>
    </div>
  );
}
export default Canvas;
