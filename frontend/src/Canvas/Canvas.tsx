import { useEffect, useRef, useState } from "react";
import type { CanvasProps } from "./Canvas.d";
import { Core } from "../Core/Core";
import type { DSL } from "../Core/DSL/DSL";
import { RenderSystem } from "../Core/System/RenderSystem/RenderSystem";
import { SelectionSystem } from "../Core/System/SelectionSystem";
import { PickingSystem } from "../Core/System/PickingSystem";
import styles from "./Canvas.module.scss";
import { EventSystem } from "../Core/System/EventSystem";
import { InputSystem } from "../Core/System/InputSytem";

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
        id: "1",
        type: "rect",
        position: { x: 0, y: 0 },
        size: { width: 375, height: 60 },
        color: { filelColor: "#FF5000", strokeColor: "#FF5000" },
        selected: { value: false },
      },
      {
        id: "2",
        type: "text",
        position: { x: 20, y: 15 },
        size: { width: 200, height: 30 },
        color: { filelColor: "", strokeColor: "" },
        selected: { value: false },
        font: {
          family: "Arial",
          size: 20,
          weight: "bold",
          text: "淘宝 Taobao",
          fillColor: "#FFFFFF",
        },
      },
      {
        id: "3",
        type: "rect",
        position: { x: 20, y: 70 },
        size: { width: 335, height: 40 },
        color: { filelColor: "#FFFFFF", strokeColor: "#CCCCCC" },
        selected: { value: false },
      },
      {
        id: "4",
        type: "text",
        position: { x: 35, y: 78 },
        size: { width: 200, height: 25 },
        color: { filelColor: "", strokeColor: "" },
        selected: { value: false },
        font: {
          family: "Arial",
          size: 14,
          weight: "normal",
          text: "搜索宝贝、店铺",
          fillColor: "#999999",
        },
      },
      {
        id: "5",
        type: "ellipse",
        position: { x: 335, y: 75 },
        size: { width: 25, height: 25 },
        color: { filelColor: "#FF5000", strokeColor: "#FF5000" },
        selected: { value: false },
      },
      {
        id: "6",
        type: "rect",
        position: { x: 0, y: 120 },
        size: { width: 375, height: 150 },
        color: { filelColor: "#FFD700", strokeColor: "#FFD700" },
        selected: { value: false },
      },
      {
        id: "7",
        type: "text",
        position: { x: 30, y: 180 },
        size: { width: 300, height: 40 },
        color: { filelColor: "", strokeColor: "" },
        selected: { value: false },
        font: {
          family: "Arial",
          size: 18,
          weight: "bold",
          text: "双十一狂欢大促",
          fillColor: "#FF5000",
        },
      },
      {
        id: "8",
        type: "rect",
        position: { x: 0, y: 280 },
        size: { width: 375, height: 100 },
        color: { filelColor: "#FFFFFF", strokeColor: "#E5E5E5" },
        selected: { value: false },
      },
      {
        id: "9",
        type: "rect",
        position: { x: 15, y: 290 },
        size: { width: 60, height: 60 },
        color: { filelColor: "#FFCC00", strokeColor: "#FFCC00" },
        selected: { value: false },
      },
      {
        id: "10",
        type: "text",
        position: { x: 25, y: 355 },
        size: { width: 40, height: 20 },
        color: { filelColor: "", strokeColor: "" },
        selected: { value: false },
        font: {
          family: "Arial",
          size: 12,
          weight: "normal",
          text: "天猫",
          fillColor: "#333333",
        },
      },
      {
        id: "11",
        type: "rect",
        position: { x: 90, y: 290 },
        size: { width: 60, height: 60 },
        color: { filelColor: "#00CCFF", strokeColor: "#00CCFF" },
        selected: { value: false },
      },
      {
        id: "12",
        type: "text",
        position: { x: 100, y: 355 },
        size: { width: 40, height: 20 },
        color: { filelColor: "", strokeColor: "" },
        selected: { value: false },
        font: {
          family: "Arial",
          size: 12,
          weight: "normal",
          text: "聚划算",
          fillColor: "#333333",
        },
      },
      {
        id: "13",
        type: "rect",
        position: { x: 0, y: 400 },
        size: { width: 375, height: 350 },
        color: { filelColor: "#FFFFFF", strokeColor: "#E5E5E5" },
        selected: { value: false },
      },
      {
        id: "14",
        type: "text",
        position: { x: 20, y: 410 },
        size: { width: 150, height: 30 },
        color: { filelColor: "", strokeColor: "" },
        selected: { value: false },
        font: {
          family: "Arial",
          size: 16,
          weight: "bold",
          text: "猜你喜欢",
          fillColor: "#333333",
        },
      },
      {
        id: "15",
        type: "rect",
        position: { x: 20, y: 450 },
        size: { width: 150, height: 150 },
        color: { filelColor: "#F5F5F5", strokeColor: "#CCCCCC" },
        selected: { value: false },
      },
      {
        id: "16",
        type: "text",
        position: { x: 25, y: 605 },
        size: { width: 140, height: 20 },
        color: { filelColor: "", strokeColor: "" },
        selected: { value: false },
        font: {
          family: "Arial",
          size: 12,
          weight: "normal",
          text: "热销商品示例",
          fillColor: "#666666",
        },
      },
      {
        id: "17",
        type: "rect",
        position: { x: 0, y: 710 },
        size: { width: 375, height: 60 },
        color: { filelColor: "#FFFFFF", strokeColor: "#E5E5E5" },
        selected: { value: false },
      },
      {
        id: "18",
        type: "text",
        position: { x: 25, y: 725 },
        size: { width: 40, height: 20 },
        color: { filelColor: "", strokeColor: "" },
        selected: { value: false },
        font: {
          family: "Arial",
          size: 12,
          weight: "normal",
          text: "首页",
          fillColor: "#FF5000",
        },
      },
      {
        id: "19",
        type: "text",
        position: { x: 115, y: 725 },
        size: { width: 40, height: 20 },
        color: { filelColor: "", strokeColor: "" },
        selected: { value: false },
        font: {
          family: "Arial",
          size: 12,
          weight: "normal",
          text: "分类",
          fillColor: "#666666",
        },
      },
      {
        id: "20",
        type: "text",
        position: { x: 205, y: 725 },
        size: { width: 40, height: 20 },
        color: { filelColor: "", strokeColor: "" },
        selected: { value: false },
        font: {
          family: "Arial",
          size: 12,
          weight: "normal",
          text: "购物车",
          fillColor: "#666666",
        },
      },
      {
        id: "21",
        type: "text",
        position: { x: 295, y: 725 },
        size: { width: 40, height: 20 },
        color: { filelColor: "", strokeColor: "" },
        selected: { value: false },
        font: {
          family: "Arial",
          size: 12,
          weight: "normal",
          text: "我的淘宝",
          fillColor: "#666666",
        },
      },
    ];
    if (canvasDom) {
      const core = new Core(dsls);
      const context = core.initCanvas(canvasDom);

      core.addSystem(new RenderSystem(context, core));
      core.addSystem(new PickingSystem(context, core));
      core.addSystem(new SelectionSystem(context, core));
      core.addSystem(new EventSystem(context, core));
      core.addSystem(new InputSystem(context, core));
      core.update();
      console.log(core, "core");
    }
  }, []);
  return (
    <div className={styles.canvas}>
      <canvas
        id="canvas"
        style={{ position: "absolute", left: 0, top: 0, zIndex: 1 }}
        width={props.width}
        height={props.height}
      ></canvas>
    </div>
  );
}
export default Canvas;
