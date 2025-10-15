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
  const dsls: any[] = [
    {
      position: { x: 360, y: 300 },
      size: { width: 80, height: 60 },
      color: { fillColor: "red", strokeColor: null },
      lineWidth: null,
      id: "1",
      selected: { value: false, hovered: null },
      eventQueue: [],
      type: "polygon",
      rotation: { value: 0 },
      font: null,
      name: null,
      img: null,
      zIndex: { value: 30 },
      scale: null,
      polygon: {
        vertexs: [
          { type: "M", point: { x: 0, y: 60 } },
          { type: "L", point: { x: 40, y: 0 } },
          { type: "L", point: { x: 80, y: 60 } },
          { type: "L", point: { x: 0, y: 60 } },
        ],
      },
    },
    {
      position: { x: 360, y: 360 },
      size: { width: 80, height: 80 },
      color: { fillColor: "#333333", strokeColor: null },
      lineWidth: null,
      id: "2",
      selected: { value: false, hovered: null },
      eventQueue: [],
      type: "rect",
      rotation: { value: 0 },
      font: null,
      name: null,
      img: null,
      zIndex: { value: 30 },
      scale: null,
      polygon: null,
    },
    {
      position: { x: 385, y: 400 },
      size: { width: 30, height: 40 },
      color: { fillColor: "#FFFFFF", strokeColor: null },
      lineWidth: null,
      id: "3",
      selected: { value: false, hovered: null },
      eventQueue: [],
      type: "rect",
      rotation: { value: 0 },
      font: null,
      name: null,
      img: null,
      zIndex: { value: 31 },
      scale: null,
      polygon: null,
    },
    {
      position: { x: 370, y: 370 },
      size: { width: 20, height: 20 },
      color: { fillColor: "#FFFFFF", strokeColor: null },
      lineWidth: null,
      id: "4",
      selected: { value: false, hovered: null },
      eventQueue: [],
      type: "rect",
      rotation: { value: 0 },
      font: null,
      name: null,
      img: null,
      zIndex: { value: 31 },
      scale: null,
      polygon: null,
    },
    {
      position: { x: 410, y: 370 },
      size: { width: 20, height: 20 },
      color: { fillColor: "#FFFFFF", strokeColor: null },
      lineWidth: null,
      id: "5",
      selected: { value: false, hovered: null },
      eventQueue: [],
      type: "rect",
      rotation: { value: 0 },
      font: null,
      name: null,
      img: null,
      zIndex: { value: 31 },
      scale: null,
      polygon: null,
    },
  ];
  const coreRef = useRef<Core | null>(null);
  const initCanvas = () => {
    if (canvasRef.current) {
      coreRef.current = new Core(dsls);
      const context = coreRef.current.initCanvas(canvasRef.current, {
        width: 800,
        height: 800,
      });

      coreRef.current.addSystem(new RenderSystem(context, coreRef.current));
      coreRef.current.addSystem(new PickingSystem(context, coreRef.current));
      coreRef.current.addSystem(new SelectionSystem(context, coreRef.current));
      coreRef.current.addSystem(new EventSystem(context, coreRef.current));
      coreRef.current.addSystem(new InputSystem(context, coreRef.current));
      coreRef.current.update();
      console.log(coreRef.current, "core");
    }
  };
  const handlerApplyCode = (code: string) => {
    try {
      const parsedCode = JSON.parse(code);
      console.log("Applying code:", parsedCode);
      coreRef.current?.initComponents(parsedCode);
      coreRef.current?.update();
    } catch (error) {
      console.error("Error applying code:", error);
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
        <CopilotDemo onApplyCode={handlerApplyCode} />
      </div>
    </div>
  );
}
export default Canvas;
