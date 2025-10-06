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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initCanvas = () => {
    const dsls: any = [
      // {
      //   id: "1",
      //   type: "rect",
      //   position: { x: 0, y: 0 },
      //   size: { width: 375, height: 60 },
      //   color: { fillColor: "#FF5000", strokeColor: "#FF5000" },
      //   selected: { value: false },
      // },
      // {
      //   id: "2",
      //   type: "text",
      //   position: { x: 20, y: 15 },
      //   size: { width: 200, height: 30 },
      //   color: { fillColor: "", strokeColor: "" },
      //   selected: { value: false },
      //   font: {
      //     family: "Arial",
      //     size: 20,
      //     weight: "bold",
      //     text: "淘宝 Taobao",
      //     fillColor: "#FFFFFF",
      //   },
      // },
      // {
      //   id: "3",
      //   type: "rect",
      //   position: { x: 20, y: 70 },
      //   size: { width: 335, height: 40 },
      //   color: { fillColor: "#FFFFFF", strokeColor: "#CCCCCC" },
      //   selected: { value: false },
      // },
      // {
      //   id: "4",
      //   type: "text",
      //   position: { x: 35, y: 78 },
      //   size: { width: 200, height: 25 },
      //   color: { fillColor: "", strokeColor: "" },
      //   selected: { value: false },
      //   font: {
      //     family: "Arial",
      //     size: 14,
      //     weight: "normal",
      //     text: "搜索宝贝、店铺",
      //     fillColor: "#999999",
      //   },
      // },
      // {
      //   id: "5",
      //   type: "ellipse",
      //   position: { x: 335, y: 75 },
      //   size: { width: 25, height: 25 },
      //   color: { fillColor: "#FF5000", strokeColor: "#FF5000" },
      //   selected: { value: false },
      // },
      // {
      //   id: "6",
      //   type: "img",
      //   position: { x: 0, y: 120 },
      //   size: { width: 375, height: 150 },
      //   color: { fillColor: "#FFD700", strokeColor: "#FFD700" },
      //   selected: { value: false },
      //   img: {
      //     src: "https://gw.alicdn.com/imgextra/i2/O1CN01nlPQ9s1y3aKUb5tDo_!!6000000006523-0-tps-800-450.jpg",
      //   },
      // },
      // {
      //   id: "7",
      //   type: "text",
      //   position: { x: 30, y: 180 },
      //   size: { width: 300, height: 40 },
      //   color: { fillColor: "", strokeColor: "" },
      //   selected: { value: false },
      //   font: {
      //     family: "Arial",
      //     size: 18,
      //     weight: "bold",
      //     text: "双十一狂欢大促",
      //     fillColor: "#FF5000",
      //   },
      // },
      // {
      //   id: "8",
      //   type: "rect",
      //   position: { x: 0, y: 280 },
      //   size: { width: 375, height: 100 },
      //   color: { fillColor: "#FFFFFF", strokeColor: "#E5E5E5" },
      //   selected: { value: false },
      // },
      // {
      //   id: "9",
      //   type: "rect",
      //   position: { x: 15, y: 290 },
      //   size: { width: 60, height: 60 },
      //   color: { fillColor: "#FFCC00", strokeColor: "#FFCC00" },
      //   selected: { value: false },
      // },
      // {
      //   id: "10",
      //   type: "text",
      //   position: { x: 25, y: 355 },
      //   size: { width: 40, height: 20 },
      //   color: { fillColor: "", strokeColor: "" },
      //   selected: { value: false },
      //   font: {
      //     family: "Arial",
      //     size: 12,
      //     weight: "normal",
      //     text: "天猫",
      //     fillColor: "#333333",
      //   },
      // },
      // {
      //   id: "11",
      //   type: "rect",
      //   position: { x: 90, y: 290 },
      //   size: { width: 60, height: 60 },
      //   color: { fillColor: "#00CCFF", strokeColor: "#00CCFF" },
      //   selected: { value: false },
      // },
      // {
      //   id: "12",
      //   type: "text",
      //   position: { x: 100, y: 355 },
      //   size: { width: 40, height: 20 },
      //   color: { fillColor: "", strokeColor: "" },
      //   selected: { value: false },
      //   font: {
      //     family: "Arial",
      //     size: 12,
      //     weight: "normal",
      //     text: "聚划算",
      //     fillColor: "#333333",
      //   },
      // },
      // {
      //   id: "13",
      //   type: "rect",
      //   position: { x: 0, y: 400 },
      //   size: { width: 375, height: 350 },
      //   color: { fillColor: "#FFFFFF", strokeColor: "#E5E5E5" },
      //   selected: { value: false },
      // },
      // {
      //   id: "14",
      //   type: "text",
      //   position: { x: 20, y: 410 },
      //   size: { width: 150, height: 30 },
      //   color: { fillColor: "", strokeColor: "" },
      //   selected: { value: false },
      //   font: {
      //     family: "Arial",
      //     size: 16,
      //     weight: "bold",
      //     text: "猜你喜欢",
      //     fillColor: "#333333",
      //   },
      // },
      // {
      //   id: "15",
      //   type: "rect",
      //   position: { x: 20, y: 450 },
      //   size: { width: 150, height: 150 },
      //   color: { fillColor: "#F5F5F5", strokeColor: "#CCCCCC" },
      //   selected: { value: false },
      // },
      // {
      //   id: "16",
      //   type: "text",
      //   position: { x: 25, y: 605 },
      //   size: { width: 140, height: 20 },
      //   color: { fillColor: "", strokeColor: "" },
      //   selected: { value: false },
      //   font: {
      //     family: "Arial",
      //     size: 12,
      //     weight: "normal",
      //     text: "热销商品示例",
      //     fillColor: "#666666",
      //   },
      // },
      // {
      //   id: "17",
      //   type: "rect",
      //   position: { x: 0, y: 710 },
      //   size: { width: 375, height: 60 },
      //   color: { fillColor: "#FFFFFF", strokeColor: "#E5E5E5" },
      //   selected: { value: false },
      // },
      // {
      //   id: "18",
      //   type: "text",
      //   position: { x: 25, y: 725 },
      //   size: { width: 40, height: 20 },
      //   color: { fillColor: "", strokeColor: "" },
      //   selected: { value: false },
      //   font: {
      //     family: "Arial",
      //     size: 12,
      //     weight: "normal",
      //     text: "首页",
      //     fillColor: "#FF5000",
      //   },
      // },
      // {
      //   id: "19",
      //   type: "text",
      //   position: { x: 115, y: 725 },
      //   size: { width: 40, height: 20 },
      //   color: { fillColor: "", strokeColor: "" },
      //   selected: { value: false },
      //   font: {
      //     family: "Arial",
      //     size: 12,
      //     weight: "normal",
      //     text: "分类",
      //     fillColor: "#666666",
      //   },
      // },
      // {
      //   id: "20",
      //   type: "text",
      //   position: { x: 205, y: 725 },
      //   size: { width: 40, height: 20 },
      //   color: { fillColor: "", strokeColor: "" },
      //   selected: { value: false },
      //   font: {
      //     family: "Arial",
      //     size: 12,
      //     weight: "normal",
      //     text: "购物车",
      //     fillColor: "#666666",
      //   },
      // },
      // {
      //   id: "21",
      //   type: "text",
      //   position: { x: 295, y: 725 },
      //   size: { width: 40, height: 20 },
      //   color: { fillColor: "", strokeColor: "" },
      //   selected: { value: false },
      //   font: {
      //     family: "Arial",
      //     size: 12,
      //     weight: "normal",
      //     text: "我的淘宝",
      //     fillColor: "#666666",
      //   },
      // },
      // {
      //   id: "90",
      //   type: "polygon",
      //   position: { x: 295, y: 725 },
      //   size: { width: 40, height: 20 },
      //   color: { fillColor: "#666", strokeColor: "" },
      //   selected: { value: false },
      //   scale: { value: 1 },
      //   polygon: {
      //     vertexs: [
      //       {
      //         type: "M",
      //         point: { x: 10, y: 10 },
      //       },
      //       { type: "L", point: { x: 20, y: 30 } },
      //       {
      //         type: "Q",
      //         controlPoint: { x: 30, y: 10 },
      //         point: { x: 40, y: 30 },
      //       },
      //     ],
      //   },
      // },

      // ===============================================
      // 1. 二次贝塞尔曲线 (Q) 图标 - 位于左侧
      // ===============================================

      // 1.1 头部 (Head) - 椭圆形 (Q)
      // {
      //   id: "101",
      //   type: "ellipse",
      //   position: { x: 100, y: 100 },
      //   size: { width: 40, height: 50 },
      //   rx: 20,
      //   ry: 25,
      //   color: { fillColor: "#666666", strokeColor: "" },
      //   selected: { value: false },
      //   scale: { value: 1 },
      // },

      // // 1.2 身体/肩部 (Body) - 使用二次贝塞尔曲线 (Q)
      // {
      //   id: "102",
      //   type: "polygon",
      //   position: { x: 60, y: 125 },
      //   size: { width: 80, height: 40 },
      //   color: { fillColor: "#666666", strokeColor: "" },
      //   selected: { value: false },
      //   scale: { value: 1 },
      //   polygon: {
      //     vertexs: [
      //       { type: "M", point: { x: 0, y: 20 } },
      //       { type: "L", point: { x: 0, y: 40 } },
      //       { type: "L", point: { x: 80, y: 40 } },
      //       { type: "L", point: { x: 80, y: 20 } },

      //       // Q: 右侧颈部弧线
      //       {
      //         type: "Q",
      //         controlPoint: { x: 65, y: 10 },
      //         endPoint: { x: 40, y: 20 },
      //       },

      //       // Q: 左侧颈部弧线
      //       {
      //         type: "Q",
      //         controlPoint: { x: 15, y: 10 },
      //         endPoint: { x: 0, y: 20 },
      //       },
      //     ],
      //   },
      // },

      // // ===============================================
      // // 2. 三次贝塞尔曲线 (C) 图标 - 位于右侧
      // // ===============================================

      // // 2.1 头部 (Head) - 椭圆形 (C)
      // // 1. 头部 (Head) - 椭圆形 (Q)
      // {
      //   id: "101",
      //   type: "ellipse",
      //   position: { x: 100, y: 100 },
      //   size: { width: 40, height: 50 },
      //   rx: 20,
      //   ry: 25,
      //   color: { fillColor: "#666666", strokeColor: "" },
      //   selected: { value: false },
      //   scale: { value: 1 },
      // },

      // // 2. 身体/肩部 (Body) - 使用二次贝塞尔曲线 (Q)
      // {
      //   id: "102",
      //   type: "polygon",
      //   // 调整 position: 将多边形的左上角放置在 (80, 120) 附近，使其与头部底部对齐
      //   position: { x: 60, y: 120 },
      //   size: { width: 80, height: 40 },
      //   color: { fillColor: "#666666", strokeColor: "" },
      //   selected: { value: false },
      //   scale: { value: 1 },
      //   polygon: {
      //     vertexs: [
      //       // M: 移动到左肩起点。绝对坐标约为 (60 + 0, 120 + 25) = (60, 145)
      //       { type: "M", point: { x: 0, y: 25 } },

      //       // L: 绘制左侧身体
      //       { type: "L", point: { x: 0, y: 40 } },
      //       // L: 绘制底部身体
      //       { type: "L", point: { x: 80, y: 40 } },
      //       // L: 绘制右侧身体
      //       { type: "L", point: { x: 80, y: 25 } },

      //       // Q: 右侧颈部弧线
      //       // 从 (80, 25) 连到中间 (40, 25)，但控制点拉低到 y=10
      //       {
      //         type: "Q",
      //         controlPoint: { x: 65, y: 10 },
      //         endPoint: { x: 40, y: 25 },
      //       },

      //       // Q: 左侧颈部弧线
      //       // 从中间 (40, 25) 连回起点 (0, 25)
      //       {
      //         type: "Q",
      //         controlPoint: { x: 15, y: 10 },
      //         endPoint: { x: 0, y: 25 },
      //       },
      //     ],
      //   },
      // },
      // 2.1 头部 (Head) - 椭圆形 (C)
      // 1. 头部 (Head) - 使用 EllipseElement
      {
        id: "12",
        type: "ellipse",
        position: { x: 80, y: 40 }, // 向上微调，居中
        size: { width: 40, height: 40 }, // 缩小头部尺寸，更精致
        color: {
          fillColor: "#F0F0F0", // 稍微亮一点的填充色
          strokeColor: "#AAAAAA", // 柔和一点的描边色
        },
        selected: { value: false },
        scale: { value: 1 },
        rx: 20,
        ry: 20,
      },
      // 2. 身体/肩部 (Body/Shoulders) - 调整形状，更圆润、更具流线感
      {
        id: "32",
        type: "polygon",
        position: { x: 60, y: 70 }, // 调整位置以适应新头部
        size: { width: 80, height: 90 }, // 调整尺寸
        color: {
          fillColor: "#F0F0F0",
          strokeColor: "#AAAAAA",
        },
        selected: { value: false },
        scale: { value: 1 },
        polygon: {
          vertexs: [
            // 优化起始点，与头部下方对齐
            { type: "M", point: { x: 70, y: 80 } }, // 左肩顶部
            // 优化贝塞尔曲线，形成更流畅的颈部和肩部弧度
            {
              type: "C",
              startPoint: { x: 75, y: 95 }, // 控制点1，向外展开
              endPoint: { x: 125, y: 95 }, // 控制点2，向外展开
              point: { x: 130, y: 80 }, // 右肩顶部
            },
            // 扩展肩宽，使身体更稳重
            { type: "L", point: { x: 140, y: 160 } }, // 右下角，更宽一些
            // 连接到左下角
            { type: "L", point: { x: 60, y: 160 } }, // 左下角
            // 闭合路径，回到左肩顶部
            { type: "L", point: { x: 70, y: 80 } },
          ],
        },
      },
    ];
    if (canvasRef.current) {
      const core = new Core(dsls);
      const context = core.initCanvas(canvasRef.current);

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
    <div className={styles.canvas}>
      <canvas
        id="canvas"
        style={{ position: "absolute", left: "5px", top: "5px", zIndex: 1 }}
        width={props.width}
        height={props.height}
      ></canvas>
    </div>
  );
}
export default Canvas;
