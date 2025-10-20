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
import { HoverSystem } from "../Core/System/HoverSystem";
import { ClickSystem } from "../Core/System/ClickSystem";
import { DragSystem } from "../Core/System/DragSystem";

function Canvas(props: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // const dsls: any[] = [
  //   {
  //     position: { x: 0, y: 0 },
  //     size: { width: 375, height: 812 },
  //     color: { fillColor: "#ffffff", strokeColor: null },
  //     lineWidth: null,
  //     id: "1",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "rect",
  //     rotation: { value: 0 },
  //     font: null,
  //     name: "页面背景",
  //     img: null,
  //     zIndex: { value: 0 },
  //     scale: null,
  //     polygon: null,
  //   },
  //   {
  //     position: { x: 0, y: 0 },
  //     size: { width: 375, height: 44 },
  //     color: { fillColor: "#ffffff", strokeColor: "#e0e0e0" },
  //     lineWidth: { value: 1 },
  //     id: "2",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "rect",
  //     rotation: { value: 0 },
  //     font: null,
  //     name: "顶部导航栏",
  //     img: null,
  //     zIndex: { value: 10 },
  //     scale: null,
  //     polygon: null,
  //   },
  //   {
  //     position: { x: 16, y: 8 },
  //     size: { width: 280, height: 28 },
  //     color: { fillColor: "#f5f5f5", strokeColor: null },
  //     lineWidth: null,
  //     id: "3",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "rect",
  //     rotation: { value: 0 },
  //     font: null,
  //     name: "搜索框背景",
  //     img: null,
  //     zIndex: { value: 11 },
  //     scale: null,
  //     polygon: null,
  //   },
  //   {
  //     position: { x: 40, y: 14 },
  //     size: { width: 200, height: 20 },
  //     color: { fillColor: "#9e9e9e", strokeColor: null },
  //     lineWidth: null,
  //     id: "4",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "text",
  //     rotation: { value: 0 },
  //     font: {
  //       family: "Arial",
  //       size: 14,
  //       weight: "400",
  //       style: "normal",
  //       variant: "normal",
  //       lineHeight: "1.5",
  //       text: "搜索小红书内容",
  //       fillColor: "#9e9e9e",
  //       strokeColor: null,
  //     },
  //     name: "搜索提示文字",
  //     img: null,
  //     zIndex: { value: 12 },
  //     scale: null,
  //     polygon: null,
  //   },
  //   {
  //     position: { x: 320, y: 12 },
  //     size: { width: 24, height: 24 },
  //     color: { fillColor: null, strokeColor: "#333333" },
  //     lineWidth: { value: 1 },
  //     id: "5",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "polygon",
  //     rotation: { value: 0 },
  //     font: null,
  //     name: "消息图标",
  //     img: null,
  //     zIndex: { value: 12 },
  //     scale: null,
  //     polygon: {
  //       vertexs: [
  //         { type: "M", point: { x: 320, y: 12 } },
  //         { type: "L", point: { x: 344, y: 12 } },
  //         { type: "L", point: { x: 344, y: 36 } },
  //         { type: "L", point: { x: 320, y: 36 } },
  //         { type: "L", point: { x: 320, y: 30 } },
  //         { type: "L", point: { x: 332, y: 24 } },
  //         { type: "L", point: { x: 320, y: 18 } },
  //       ],
  //     },
  //   },
  //   {
  //     position: { x: 16, y: 60 },
  //     size: { width: 167, height: 280 },
  //     color: { fillColor: "#ffffff", strokeColor: "#e0e0e0" },
  //     lineWidth: { value: 1 },
  //     id: "6",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "rect",
  //     rotation: { value: 0 },
  //     font: null,
  //     name: "内容卡片1",
  //     img: null,
  //     zIndex: { value: 20 },
  //     scale: null,
  //     polygon: null,
  //   },
  //   {
  //     position: { x: 20, y: 68 },
  //     size: { width: 24, height: 24 },
  //     color: { fillColor: null, strokeColor: null },
  //     lineWidth: null,
  //     id: "7",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "img",
  //     rotation: { value: 0 },
  //     font: null,
  //     name: "用户头像",
  //     img: {
  //       src: "https://cdn.pixabay.com/photo/2025/07/20/08/07/alley-9723861_1280.jpg",
  //     },
  //     zIndex: { value: 21 },
  //     scale: null,
  //     polygon: null,
  //   },
  //   {
  //     position: { x: 16, y: 68 },
  //     size: { width: 50, height: 20 },
  //     color: { fillColor: "#ff2442", strokeColor: null },
  //     lineWidth: null,
  //     id: "8",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "rect",
  //     rotation: { value: 0 },
  //     font: null,
  //     name: "标签背景",
  //     img: null,
  //     zIndex: { value: 21 },
  //     scale: null,
  //     polygon: null,
  //   },
  //   {
  //     position: { x: 26, y: 72 },
  //     size: { width: 30, height: 16 },
  //     color: { fillColor: "#ffffff", strokeColor: null },
  //     lineWidth: null,
  //     id: "9",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "text",
  //     rotation: { value: 0 },
  //     font: {
  //       family: "Arial",
  //       size: 12,
  //       weight: "600",
  //       style: "normal",
  //       variant: "normal",
  //       lineHeight: "1.5",
  //       text: "推荐",
  //       fillColor: "#ffffff",
  //       strokeColor: null,
  //     },
  //     name: "标签文字",
  //     img: null,
  //     zIndex: { value: 22 },
  //     scale: null,
  //     polygon: null,
  //   },
  //   {
  //     position: { x: 16, y: 100 },
  //     size: { width: 167, height: 167 },
  //     color: { fillColor: null, strokeColor: null },
  //     lineWidth: null,
  //     id: "10",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "img",
  //     rotation: { value: 0 },
  //     font: null,
  //     name: "内容图片",
  //     img: {
  //       src: "https://cdn.pixabay.com/photo/2025/09/12/15/10/small-copper-9830647_1280.jpg",
  //     },
  //     zIndex: { value: 21 },
  //     scale: null,
  //     polygon: null,
  //   },
  //   {
  //     position: { x: 20, y: 275 },
  //     size: { width: 150, height: 40 },
  //     color: { fillColor: "#333333", strokeColor: null },
  //     lineWidth: null,
  //     id: "11",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "text",
  //     rotation: { value: 0 },
  //     font: {
  //       family: "Arial",
  //       size: 14,
  //       weight: "400",
  //       style: "normal",
  //       variant: "normal",
  //       lineHeight: "1.5",
  //       text: "发现好物分享，生活美学指南",
  //       fillColor: "#333333",
  //       strokeColor: null,
  //     },
  //     name: "内容描述",
  //     img: null,
  //     zIndex: { value: 22 },
  //     scale: null,
  //     polygon: null,
  //   },
  //   {
  //     position: { x: 20, y: 320 },
  //     size: { width: 16, height: 16 },
  //     color: { fillColor: "#333333", strokeColor: null },
  //     lineWidth: { value: 1 },
  //     id: "12",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "polygon",
  //     rotation: { value: 0 },
  //     font: null,
  //     name: "点赞图标",
  //     img: null,
  //     zIndex: { value: 22 },
  //     scale: null,
  //     polygon: {
  //       vertexs: [
  //         { type: "M", point: { x: 22, y: 328 } },
  //         { type: "L", point: { x: 28, y: 320 } },
  //         { type: "L", point: { x: 34, y: 328 } },
  //         { type: "L", point: { x: 30, y: 336 } },
  //         { type: "L", point: { x: 26, y: 336 } },
  //       ],
  //     },
  //   },
  //   {
  //     position: { x: 40, y: 320 },
  //     size: { width: 30, height: 16 },
  //     color: { fillColor: "#9e9e9e", strokeColor: null },
  //     lineWidth: null,
  //     id: "13",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "text",
  //     rotation: { value: 0 },
  //     font: {
  //       family: "Arial",
  //       size: 12,
  //       weight: "400",
  //       style: "normal",
  //       variant: "normal",
  //       lineHeight: "1.5",
  //       text: "1.2k",
  //       fillColor: "#9e9e9e",
  //       strokeColor: null,
  //     },
  //     name: "点赞数",
  //     img: null,
  //     zIndex: { value: 22 },
  //     scale: null,
  //     polygon: null,
  //   },
  //   {
  //     position: { x: 0, y: 762 },
  //     size: { width: 375, height: 50 },
  //     color: { fillColor: "#ffffff", strokeColor: "#e0e0e0" },
  //     lineWidth: { value: 1 },
  //     id: "14",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "rect",
  //     rotation: { value: 0 },
  //     font: null,
  //     name: "底部导航栏",
  //     img: null,
  //     zIndex: { value: 100 },
  //     scale: null,
  //     polygon: null,
  //   },
  //   {
  //     position: { x: 37, y: 772 },
  //     size: { width: 24, height: 24 },
  //     color: { fillColor: "#ff2442", strokeColor: null },
  //     lineWidth: { value: 1 },
  //     id: "15",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "polygon",
  //     rotation: { value: 0 },
  //     font: null,
  //     name: "首页图标",
  //     img: null,
  //     zIndex: { value: 101 },
  //     scale: null,
  //     polygon: {
  //       vertexs: [
  //         { type: "M", point: { x: 45, y: 776 } },
  //         { type: "L", point: { x: 53, y: 772 } },
  //         { type: "L", point: { x: 61, y: 776 } },
  //         { type: "L", point: { x: 61, y: 788 } },
  //         { type: "L", point: { x: 45, y: 788 } },
  //       ],
  //     },
  //   },
  //   {
  //     position: { x: 112, y: 772 },
  //     size: { width: 24, height: 24 },
  //     color: { fillColor: "#333333", strokeColor: null },
  //     lineWidth: { value: 1 },
  //     id: "16",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "ellipse",
  //     rotation: { value: 0 },
  //     font: null,
  //     name: "搜索图标",
  //     img: null,
  //     zIndex: { value: 101 },
  //     scale: null,
  //     polygon: null,
  //   },
  //   {
  //     position: { x: 187, y: 764 },
  //     size: { width: 24, height: 24 },
  //     color: { fillColor: "#ff2442", strokeColor: null },
  //     lineWidth: null,
  //     id: "17",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "rect",
  //     rotation: { value: 0 },
  //     font: null,
  //     name: "发布按钮",
  //     img: null,
  //     zIndex: { value: 101 },
  //     scale: null,
  //     polygon: null,
  //   },
  //   {
  //     position: { x: 262, y: 772 },
  //     size: { width: 24, height: 24 },
  //     color: { fillColor: "#333333", strokeColor: null },
  //     lineWidth: { value: 1 },
  //     id: "18",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "polygon",
  //     rotation: { value: 0 },
  //     font: null,
  //     name: "消息图标",
  //     img: null,
  //     zIndex: { value: 101 },
  //     scale: null,
  //     polygon: {
  //       vertexs: [
  //         { type: "M", point: { x: 262, y: 772 } },
  //         { type: "L", point: { x: 286, y: 772 } },
  //         { type: "L", point: { x: 286, y: 796 } },
  //         { type: "L", point: { x: 262, y: 796 } },
  //         { type: "L", point: { x: 262, y: 786 } },
  //         { type: "L", point: { x: 274, y: 780 } },
  //         { type: "L", point: { x: 262, y: 774 } },
  //       ],
  //     },
  //   },
  //   {
  //     position: { x: 337, y: 772 },
  //     size: { width: 24, height: 24 },
  //     color: { fillColor: "#333333", strokeColor: null },
  //     lineWidth: { value: 1 },
  //     id: "19",
  //     selected: { value: false, hovered: false },
  //     eventQueue: [],
  //     type: "ellipse",
  //     rotation: { value: 0 },
  //     font: null,
  //     name: "个人中心",
  //     img: null,
  //     zIndex: { value: 101 },
  //     scale: null,
  //     polygon: null,
  //   },
  // ];
  const dsls: any[] = [
    {
      position: { x: 0, y: 0 },
      size: { width: 375, height: 800 },
      color: { fillColor: "#f6f6f6", strokeColor: null },
      lineWidth: null,
      id: "1",
      selected: { value: false, hovered: false },
      eventQueue: [],
      type: "rect",
      rotation: { value: 0 },
      font: {},
      name: null,
      img: null,
      zIndex: { value: 0 },
      scale: null,
      polygon: null,
    },
    {
      position: { x: 100, y: 200 },
      size: { width: 175, height: 100 },
      color: { fillColor: "#333333", strokeColor: null },
      lineWidth: null,
      id: "2",
      selected: { value: false, hovered: false },
      eventQueue: [],
      type: "rect",
      rotation: { value: 0 },
      font: {},
      name: null,
      img: null,
      zIndex: { value: 30 },
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
      coreRef.current.addSystem(new HoverSystem(context, coreRef.current));
      coreRef.current.addSystem(new ClickSystem(context, coreRef.current));
      coreRef.current.addSystem(new SelectionSystem(context, coreRef.current));
      coreRef.current.addSystem(new EventSystem(context, coreRef.current));
      coreRef.current.addSystem(new InputSystem(context, coreRef.current));
      coreRef.current.addSystem(new DragSystem(context, coreRef.current));
      coreRef.current.update();
      console.log(coreRef.current, "core");
    }
  };
  const handlerApplyCode = (code: string) => {
    try {
      const parsedCode = JSON.parse(code);
      coreRef.current?.initComponents(parsedCode);
      coreRef.current?.update();
    } catch (error) {
      console.error("Error applying code:", error);
    }
  };
  useEffect(() => {
    canvasRef.current = document.getElementById("canvas") as HTMLCanvasElement;
    initCanvas();
    return () => {
      coreRef.current?.destroyed();
      coreRef.current = null;
      canvasRef.current = null;
    };
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
