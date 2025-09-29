import { useEffect, useRef, useState } from "react";
import type { CanvasProps } from "./Canvas.d";
import { Core } from "../Core/Core";
import type { DSL } from "../Core/DSL/DSL";
import { RenderSystem } from "../Core/System/RenderSystem";
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
        position: {
          x: 10,
          y: 310,
        },
        size: {
          width: 165,
          height: 165,
        },
        color: {
          filelColor: "#FFFFFF",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "2",
        type: "rect",
        position: {
          x: 20,
          y: 320,
        },
        size: {
          width: 145,
          height: 100,
        },
        color: {
          filelColor: "#FFCC80",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "3",
        type: "ellipse",
        position: {
          x: 130,
          y: 330,
        },
        size: {
          width: 20,
          height: 20,
        },
        color: {
          filelColor: "#FFA500",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "4",
        type: "rect",
        position: {
          x: 20,
          y: 425,
        },
        size: {
          width: 120,
          height: 15,
        },
        color: {
          filelColor: "#FF8A65",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "5",
        type: "rect",
        position: {
          x: 20,
          y: 445,
        },
        size: {
          width: 60,
          height: 15,
        },
        color: {
          filelColor: "#FF5722",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "6",
        type: "rect",
        position: {
          x: 20,
          y: 465,
        },
        size: {
          width: 145,
          height: 5,
        },
        color: {
          filelColor: "#EEEEEE",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "7",
        type: "rect",
        position: {
          x: 180,
          y: 310,
        },
        size: {
          width: 165,
          height: 165,
        },
        color: {
          filelColor: "#FFFFFF",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "8",
        type: "rect",
        position: {
          x: 190,
          y: 320,
        },
        size: {
          width: 145,
          height: 100,
        },
        color: {
          filelColor: "#FFCC80",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "9",
        type: "ellipse",
        position: {
          x: 300,
          y: 330,
        },
        size: {
          width: 20,
          height: 20,
        },
        color: {
          filelColor: "#FFA500",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "10",
        type: "rect",
        position: {
          x: 190,
          y: 425,
        },
        size: {
          width: 120,
          height: 15,
        },
        color: {
          filelColor: "#FF8A65",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "11",
        type: "rect",
        position: {
          x: 190,
          y: 445,
        },
        size: {
          width: 60,
          height: 15,
        },
        color: {
          filelColor: "#FF5722",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "12",
        type: "rect",
        position: {
          x: 190,
          y: 465,
        },
        size: {
          width: 145,
          height: 5,
        },
        color: {
          filelColor: "#EEEEEE",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "13",
        type: "rect",
        position: {
          x: 10,
          y: 490,
        },
        size: {
          width: 165,
          height: 165,
        },
        color: {
          filelColor: "#FFFFFF",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "14",
        type: "rect",
        position: {
          x: 20,
          y: 500,
        },
        size: {
          width: 145,
          height: 100,
        },
        color: {
          filelColor: "#FFCC80",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "15",
        type: "ellipse",
        position: {
          x: 130,
          y: 510,
        },
        size: {
          width: 20,
          height: 20,
        },
        color: {
          filelColor: "#FFA500",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "16",
        type: "rect",
        position: {
          x: 20,
          y: 605,
        },
        size: {
          width: 120,
          height: 15,
        },
        color: {
          filelColor: "#FF8A65",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "17",
        type: "rect",
        position: {
          x: 20,
          y: 625,
        },
        size: {
          width: 60,
          height: 15,
        },
        color: {
          filelColor: "#FF5722",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "18",
        type: "rect",
        position: {
          x: 20,
          y: 645,
        },
        size: {
          width: 145,
          height: 5,
        },
        color: {
          filelColor: "#EEEEEE",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "19",
        type: "rect",
        position: {
          x: 180,
          y: 490,
        },
        size: {
          width: 165,
          height: 165,
        },
        color: {
          filelColor: "#FFFFFF",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "20",
        type: "rect",
        position: {
          x: 190,
          y: 500,
        },
        size: {
          width: 145,
          height: 100,
        },
        color: {
          filelColor: "#FFCC80",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "21",
        type: "ellipse",
        position: {
          x: 300,
          y: 510,
        },
        size: {
          width: 20,
          height: 20,
        },
        color: {
          filelColor: "#FFA500",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "22",
        type: "rect",
        position: {
          x: 190,
          y: 605,
        },
        size: {
          width: 120,
          height: 15,
        },
        color: {
          filelColor: "#FF8A65",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "23",
        type: "rect",
        position: {
          x: 190,
          y: 625,
        },
        size: {
          width: 60,
          height: 15,
        },
        color: {
          filelColor: "#FF5722",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "24",
        type: "rect",
        position: {
          x: 190,
          y: 645,
        },
        size: {
          width: 145,
          height: 5,
        },
        color: {
          filelColor: "#EEEEEE",
        },
        selected: {
          value: false,
        },
      },
      // 顶部
      {
        id: "200",
        type: "rect",
        position: {
          x: 0,
          y: 0,
        },
        size: {
          width: 375,
          height: 44,
        },
        color: {
          filelColor: "#F8F8F8",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "201",
        type: "rect",
        position: {
          x: 10,
          y: 19,
        },
        size: {
          width: 4,
          height: 4,
        },
        color: {
          filelColor: "#4FC3F7",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "202",
        type: "rect",
        position: {
          x: 16,
          y: 18,
        },
        size: {
          width: 4,
          height: 7,
        },
        color: {
          filelColor: "#4FC3F7",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "203",
        type: "rect",
        position: {
          x: 22,
          y: 17,
        },
        size: {
          width: 4,
          height: 10,
        },
        color: {
          filelColor: "#4FC3F7",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "204",
        type: "rect",
        position: {
          x: 28,
          y: 16,
        },
        size: {
          width: 4,
          height: 13,
        },
        color: {
          filelColor: "#4FC3F7",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "205",
        type: "rect",
        position: {
          x: 34,
          y: 15,
        },
        size: {
          width: 4,
          height: 16,
        },
        color: {
          filelColor: "#4FC3F7",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "206",
        type: "rect",
        position: {
          x: 45,
          y: 18,
        },
        size: {
          width: 20,
          height: 8,
        },
        color: {
          filelColor: "#FF8A65",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "207",
        type: "ellipse",
        position: {
          x: 70,
          y: 22,
        },
        size: {
          width: 6,
          height: 6,
        },
        color: {
          filelColor: "#FF8A65",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "208",
        type: "rect",
        position: {
          x: 150,
          y: 18,
        },
        size: {
          width: 70,
          height: 8,
        },
        color: {
          filelColor: "#333333",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "209",
        type: "rect",
        position: {
          x: 300,
          y: 20,
        },
        size: {
          width: 4,
          height: 4,
        },
        color: {
          filelColor: "#4FC3F7",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "210",
        type: "rect",
        position: {
          x: 306,
          y: 18,
        },
        size: {
          width: 4,
          height: 8,
        },
        color: {
          filelColor: "#4FC3F7",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "211",
        type: "rect",
        position: {
          x: 312,
          y: 16,
        },
        size: {
          width: 4,
          height: 12,
        },
        color: {
          filelColor: "#4FC3F7",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "212",
        type: "rect",
        position: {
          x: 340,
          y: 16,
        },
        size: {
          width: 25,
          height: 12,
        },
        color: {
          filelColor: "#FFFFFF",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "213",
        type: "rect",
        position: {
          x: 365,
          y: 20,
        },
        size: {
          width: 3,
          height: 4,
        },
        color: {
          filelColor: "#FFFFFF",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "214",
        type: "rect",
        position: {
          x: 342,
          y: 18,
        },
        size: {
          width: 20,
          height: 8,
        },
        color: {
          filelColor: "#4FC3F7",
        },
        selected: {
          value: false,
        },
      },
      // 快捷入口
      {
        id: "301",
        type: "rect",
        position: {
          x: 0,
          y: 180,
        },
        size: {
          width: 375,
          height: 100,
        },
        color: {
          filelColor: "#F5F5F5",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "302",
        type: "ellipse",
        position: {
          x: 30,
          y: 200,
        },
        size: {
          width: 50,
          height: 50,
        },
        color: {
          filelColor: "#CCCCCC",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "303",
        type: "rect",
        position: {
          x: 30,
          y: 260,
        },
        size: {
          width: 50,
          height: 10,
        },
        color: {
          filelColor: "#AAAAAA",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "304",
        type: "ellipse",
        position: {
          x: 115,
          y: 200,
        },
        size: {
          width: 50,
          height: 50,
        },
        color: {
          filelColor: "#CCCCCC",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "305",
        type: "rect",
        position: {
          x: 115,
          y: 260,
        },
        size: {
          width: 50,
          height: 10,
        },
        color: {
          filelColor: "#AAAAAA",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "306",
        type: "ellipse",
        position: {
          x: 200,
          y: 200,
        },
        size: {
          width: 50,
          height: 50,
        },
        color: {
          filelColor: "#CCCCCC",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "307",
        type: "rect",
        position: {
          x: 200,
          y: 260,
        },
        size: {
          width: 50,
          height: 10,
        },
        color: {
          filelColor: "#AAAAAA",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "308",
        type: "ellipse",
        position: {
          x: 285,
          y: 200,
        },
        size: {
          width: 50,
          height: 50,
        },
        color: {
          filelColor: "#CCCCCC",
        },
        selected: {
          value: false,
        },
      },
      {
        id: "309",
        type: "rect",
        position: {
          x: 285,
          y: 260,
        },
        size: {
          width: 50,
          height: 10,
        },
        color: {
          filelColor: "#AAAAAA",
        },
        selected: {
          value: false,
        },
      },

      // 大 Banner
      {
        id: "401",
        type: "rect",
        position: {
          x: 10,
          y: 54, // 顶部导航栏下方
        },
        size: {
          width: 355,
          height: 120, // 原 150，变小
        },
        color: {
          filelColor: "#CCCCCC",
        },
        selected: {
          value: false,
        },
      },
      // Banner 指示器
      {
        id: "402",
        type: "rect",
        position: {
          x: 142.5,
          y: 162, // 54 + 120 - 12，指示器上移一点
        },
        size: {
          width: 15,
          height: 5,
        },
        color: { filelColor: "#888888" },
        selected: { value: false },
      },
      {
        id: "403",
        type: "rect",
        position: {
          x: 167.5,
          y: 162,
        },
        size: { width: 15, height: 5 },
        color: { filelColor: "#DDDDDD" },
        selected: { value: false },
      },
      {
        id: "404",
        type: "rect",
        position: {
          x: 192.5,
          y: 162,
        },
        size: { width: 15, height: 5 },
        color: { filelColor: "#DDDDDD" },
        selected: { value: false },
      },
      {
        id: "405",
        type: "rect",
        position: {
          x: 217.5,
          y: 162,
        },
        size: { width: 15, height: 5 },
        color: { filelColor: "#DDDDDD" },
        selected: { value: false },
      },
      // 底部状态栏
      // 底部状态栏背景
      {
        id: "501",
        type: "rect",
        position: { x: 0, y: 607 }, // 667 - 60
        size: { width: 375, height: 60 },
        color: { filelColor: "#FFFFFF" },
        selected: { value: false },
      },
      // 图标 1
      {
        id: "502",
        type: "ellipse",
        position: { x: 30, y: 620 },
        size: { width: 30, height: 30 },
        color: { filelColor: "#4FC3F7" },
        selected: { value: false },
      },
      // 图标 1 文字
      {
        id: "503",
        type: "rect",
        position: { x: 20, y: 655 },
        size: { width: 40, height: 6 },
        color: { filelColor: "#999999" },
        selected: { value: false },
      },
      // 图标 2
      {
        id: "504",
        type: "ellipse",
        position: { x: 115, y: 620 },
        size: { width: 30, height: 30 },
        color: { filelColor: "#FFB74D" },
        selected: { value: false },
      },
      // 图标 2 文字
      {
        id: "505",
        type: "rect",
        position: { x: 105, y: 655 },
        size: { width: 40, height: 6 },
        color: { filelColor: "#999999" },
        selected: { value: false },
      },
      // 图标 3
      {
        id: "506",
        type: "ellipse",
        position: { x: 200, y: 620 },
        size: { width: 30, height: 30 },
        color: { filelColor: "#81C784" },
        selected: { value: false },
      },
      // 图标 3 文字
      {
        id: "507",
        type: "rect",
        position: { x: 190, y: 655 },
        size: { width: 40, height: 6 },
        color: { filelColor: "#999999" },
        selected: { value: false },
      },
      // 图标 4
      {
        id: "508",
        type: "ellipse",
        position: { x: 285, y: 620 },
        size: { width: 30, height: 30 },
        color: { filelColor: "#FF8A65" },
        selected: { value: false },
      },
      // 图标 4 文字
      {
        id: "509",
        type: "rect",
        position: { x: 275, y: 655 },
        size: { width: 40, height: 6 },
        color: { filelColor: "#999999" },
        selected: { value: false },
      },
      // 上方分隔线
      {
        id: "510",
        type: "rect",
        position: { x: 0, y: 607 },
        size: { width: 375, height: 1 },
        color: { filelColor: "#DDDDDD" },
        selected: { value: false },
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
