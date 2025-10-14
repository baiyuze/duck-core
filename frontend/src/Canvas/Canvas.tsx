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
  const dsls = [
    {
      position: { x: 10, y: 284 },
      size: { width: 355, height: 60 },
      color: { fillColor: null, strokeColor: null },
      lineWidth: null,
      id: "11",
      selected: null,
      eventQueue: [],
      type: "text",
      rotation: { value: 0 },
      font: {
        // family: "PingFang SC",
        size: 16,
        weight: "400",
        style: "normal",
        variant: "normal",
        lineHeight: "1.6",
        text: "发现生活中的美好瞬间，分享你的独特视角...",
        fillColor: "#333333",
        strokeColor: null,
      },
      name: null,
      img: null,
      zIndex: { value: 30 },
      scale: null,
      polygon: null,
    },
    {
      position: { x: 70, y: 14 },
      size: { width: 0, height: 0 },
      color: { fillColor: null, strokeColor: null },
      lineWidth: null,
      id: "5",
      selected: { value: false, hovered: false },
      eventQueue: [],
      type: "text",
      rotation: { value: 0 },
      font: {
        family: "Arial",
        size: 14,
        weight: "900",
        style: "normal",
        variant: "normal",
        lineHeight: "1.5",
        text: "搜索笔记/用户",
        fillColor: "#999999",
        strokeColor: null,
      },
      name: null,
      img: null,
      zIndex: { value: 12 },
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
