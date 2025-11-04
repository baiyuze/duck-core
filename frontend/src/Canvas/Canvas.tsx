import { useEffect, useRef, useState } from "react";
import type { CanvasProps } from "./Canvas.d";
import { Engine } from "../Core/Core/Engine";
import styles from "./Canvas.module.scss";
import CopilotDemo from "../Components/AiChat/AiChat";
import { createEngine } from "../Core/engineFactory";

function Canvas(props: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [length, setLength] = useState(0);
  const dsls: any[] = [
    {
      position: {
        x: 0,
        y: 0,
      },
      size: {
        width: 375,
        height: 713.7999877929688,
      },
      font: {},
      color: {
        fillColor: "rgb(255, 255, 255)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "2",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 0,
        y: 0,
      },
      size: {
        width: 375,
        height: 713.7999877929688,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "3",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 0,
        y: 0,
      },
      size: {
        width: 375,
        height: 56.8,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(224, 224, 224)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "4",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0.8,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 16,
        y: 15.600000381469727,
      },
      size: {
        width: 90,
        height: 24,
      },
      font: {},
      color: {
        fillColor: "rgb(255, 36, 66)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 4,
        rt: 4,
        rb: 4,
        lb: 4,
      },
      img: null,
      id: "5",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 291,
        y: 15.600000381469727,
      },
      size: {
        width: 68,
        height: 24,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "6",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 291,
        y: 15.600000381469727,
      },
      size: {
        width: 24,
        height: 24,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "7",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 291,
        y: 15.600000381469727,
      },
      size: {
        width: 24,
        height: 24,
      },
      font: {},
      color: {
        fillColor: "#222222",
        strokeColor: "transparent",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: {
        src: "",
        path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z",
        svg: '<svg viewBox="0 0 24 24" width="24" height="24">\n            <path fill="#222222" d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"></path>\n          </svg>',
      },
      id: "8",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "img",
    },
    {
      position: {
        x: 296,
        y: 17.600000381469727,
      },
      size: {
        width: 14,
        height: 20,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "9",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 335,
        y: 15.600000381469727,
      },
      size: {
        width: 24,
        height: 24,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "10",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 335,
        y: 15.600000381469727,
      },
      size: {
        width: 24,
        height: 24,
      },
      font: {},
      color: {
        fillColor: "#222222",
        strokeColor: "transparent",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: {
        src: "",
        path: "M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z",
        svg: '<svg viewBox="0 0 24 24" width="24" height="24">\n            <path fill="#222222" d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"></path>\n          </svg>',
      },
      id: "11",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "img",
    },
    {
      position: {
        x: 339,
        y: 21.600000381469727,
      },
      size: {
        width: 16,
        height: 12,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "12",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 0,
        y: 56,
      },
      size: {
        width: 375,
        height: 597.7999877929688,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "13",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 0,
        y: 56,
      },
      size: {
        width: 375,
        height: 598.5999877929687,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(224, 224, 224)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "14",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0.8,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 16,
        y: 72,
      },
      size: {
        width: 343,
        height: 32,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "15",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 16,
        y: 72,
      },
      size: {
        width: 32,
        height: 32,
      },
      font: {},
      color: {
        fillColor: "rgb(245, 245, 247)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 16,
        rt: 16,
        rb: 16,
        lb: 16,
      },
      img: null,
      id: "16",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "ellipse",
    },
    {
      position: {
        x: 58,
        y: 80,
      },
      size: {
        width: 80,
        height: 16,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "17",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 58,
        y: 80,
      },
      size: {
        width: 80,
        height: 16,
      },
      font: {
        size: 16,
        fillColor: "rgb(34, 34, 34)",
        weight: "600",
        family:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        textAlign: "left",
        textBaseline: "middle",
        text: "旅行日记本",
      },
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "18",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "text",
    },
    {
      position: {
        x: 16,
        y: 116,
      },
      size: {
        width: 343,
        height: 343,
      },
      font: {},
      color: {
        fillColor: "rgb(245, 245, 247)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 12,
        rt: 12,
        rb: 12,
        lb: 12,
      },
      img: null,
      id: "19",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 16,
        y: 471,
      },
      size: {
        width: 343,
        height: 40,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "20",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 16,
        y: 479,
      },
      size: {
        width: 24,
        height: 24,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "21",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 16,
        y: 479,
      },
      size: {
        width: 24,
        height: 24,
      },
      font: {},
      color: {
        fillColor: "#222222",
        strokeColor: "transparent",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: {
        src: "",
        path: "M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z",
        svg: '<svg viewBox="0 0 24 24" width="24" height="24">\n              <path fill="#222222" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"></path>\n            </svg>',
      },
      id: "22",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "img",
    },
    {
      position: {
        x: 18,
        y: 482,
      },
      size: {
        width: 20,
        height: 18.350000381469727,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "23",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 335,
        y: 479,
      },
      size: {
        width: 24,
        height: 24,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "24",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 335,
        y: 479,
      },
      size: {
        width: 24,
        height: 24,
      },
      font: {},
      color: {
        fillColor: "#222222",
        strokeColor: "transparent",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: {
        src: "",
        path: "M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z",
        svg: '<svg viewBox="0 0 24 24" width="24" height="24">\n              <path fill="#222222" d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"></path>\n            </svg>',
      },
      id: "25",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "img",
    },
    {
      position: {
        x: 340,
        y: 482,
      },
      size: {
        width: 14,
        height: 18,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "26",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 16,
        y: 523,
      },
      size: {
        width: 343,
        height: 74,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "27",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 16,
        y: 523,
      },
      size: {
        width: 343,
        height: 18,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "28",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 16,
        y: 523,
      },
      size: {
        width: 343,
        height: 18,
      },
      font: {
        size: 18,
        fillColor: "rgb(34, 34, 34)",
        weight: "400",
        family:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        textAlign: "left",
        textBaseline: "middle",
        text: "在东京街头偶遇一场樱花雨",
      },
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "29",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "text",
    },
    {
      position: {
        x: 16,
        y: 551,
      },
      size: {
        width: 343,
        height: 18,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "30",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 16,
        y: 551,
      },
      size: {
        width: 343,
        height: 18,
      },
      font: {
        size: 18,
        fillColor: "rgb(34, 34, 34)",
        weight: "400",
        family:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        textAlign: "left",
        textBaseline: "middle",
        text: "粉色花瓣随风飘落，仿佛置身梦境",
      },
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "31",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "text",
    },
    {
      position: {
        x: 16,
        y: 579,
      },
      size: {
        width: 343,
        height: 18,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "32",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 16,
        y: 579,
      },
      size: {
        width: 343,
        height: 18,
      },
      font: {
        size: 18,
        fillColor: "rgb(34, 34, 34)",
        weight: "400",
        family:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        textAlign: "left",
        textBaseline: "middle",
        text: "这一刻只想按下暂停键",
      },
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "33",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "text",
    },
    {
      position: {
        x: 16,
        y: 613,
      },
      size: {
        width: 343,
        height: 24,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "34",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 16,
        y: 613,
      },
      size: {
        width: 84.2750015258789,
        height: 24,
      },
      font: {},
      color: {
        fillColor: "rgb(245, 245, 247)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 12,
        rt: 12,
        rb: 12,
        lb: 12,
      },
      img: null,
      id: "35",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 16,
        y: 613,
      },
      size: {
        width: 84.2750015258789,
        height: 24,
      },
      font: {
        size: 14,
        fillColor: "rgb(34, 34, 34)",
        weight: "400",
        family:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        textAlign: "left",
        textBaseline: "middle",
        text: "#东京旅行",
      },
      color: {
        fillColor: "rgb(245, 245, 247)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 12,
        rt: 12,
        rb: 12,
        lb: 12,
      },
      img: null,
      id: "36",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "text",
    },
    {
      position: {
        x: 112.2750015258789,
        y: 613,
      },
      size: {
        width: 70.2750015258789,
        height: 24,
      },
      font: {},
      color: {
        fillColor: "rgb(245, 245, 247)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 12,
        rt: 12,
        rb: 12,
        lb: 12,
      },
      img: null,
      id: "37",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 112.2750015258789,
        y: 613,
      },
      size: {
        width: 70.2750015258789,
        height: 24,
      },
      font: {
        size: 14,
        fillColor: "rgb(34, 34, 34)",
        weight: "400",
        family:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        textAlign: "left",
        textBaseline: "middle",
        text: "#樱花季",
      },
      color: {
        fillColor: "rgb(245, 245, 247)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 12,
        rt: 12,
        rb: 12,
        lb: 12,
      },
      img: null,
      id: "38",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "text",
    },
    {
      position: {
        x: 194.5500030517578,
        y: 613,
      },
      size: {
        width: 84.2750015258789,
        height: 24,
      },
      font: {},
      color: {
        fillColor: "rgb(245, 245, 247)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 12,
        rt: 12,
        rb: 12,
        lb: 12,
      },
      img: null,
      id: "39",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 194.5500030517578,
        y: 613,
      },
      size: {
        width: 84.2750015258789,
        height: 24,
      },
      font: {
        size: 14,
        fillColor: "rgb(34, 34, 34)",
        weight: "400",
        family:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        textAlign: "left",
        textBaseline: "middle",
        text: "#街头摄影",
      },
      color: {
        fillColor: "rgb(245, 245, 247)",
        strokeColor: "",
        strokeTColor: "rgb(34, 34, 34)",
        strokeBColor: "rgb(34, 34, 34)",
        strokeLColor: "rgb(34, 34, 34)",
        strokeRColor: "rgb(34, 34, 34)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 12,
        rt: 12,
        rb: 12,
        lb: 12,
      },
      img: null,
      id: "40",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0,
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "text",
    },
    {
      position: {
        x: 0,
        y: 653.7999877929688,
      },
      size: {
        width: 375,
        height: 60.8,
      },
      font: {},
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(224, 224, 224)",
        strokeBColor: "rgb(136, 136, 136)",
        strokeLColor: "rgb(136, 136, 136)",
        strokeRColor: "rgb(136, 136, 136)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "41",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0.8,
        top: 0.8,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "rect",
    },
    {
      position: {
        x: 0,
        y: 653.7999877929688,
      },
      size: {
        width: 375,
        height: 60.8,
      },
      font: {
        size: 12,
        fillColor: "rgb(136, 136, 136)",
        weight: "400",
        family:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif',
        textAlign: "center",
        textBaseline: "middle",
        text: "© 2023 小红书风格示例页面",
      },
      color: {
        fillColor: "rgba(0, 0, 0, 0)",
        strokeColor: "",
        strokeTColor: "rgb(224, 224, 224)",
        strokeBColor: "rgb(136, 136, 136)",
        strokeLColor: "rgb(136, 136, 136)",
        strokeRColor: "rgb(136, 136, 136)",
      },
      selected: {
        value: false,
        hovered: false,
      },
      radius: {
        lt: 0,
        rt: 0,
        rb: 0,
        lb: 0,
      },
      img: null,
      id: "42",
      rotation: {
        value: 0,
      },
      zIndex: 30,
      lineWidth: {
        value: 0.8,
        top: 0.8,
        bottom: 0,
        left: 0,
        right: 0,
      },
      eventQueue: [],
      type: "text",
    },
  ];
  const engineRef = useRef<Engine | null>(null);
  const initCanvas = async () => {
    const container = document.querySelector(
      `.${styles.canvas}`
    ) as HTMLDivElement;
    // if (canvasRef.current) {
    engineRef.current = await createEngine(dsls, {
      width: 800,
      height: 800,
      container,
    });
    // engineRef.current.update();
    setTimeout(() => {
      engineRef.current!.ticker();
    }, 0);
  };
  const handlerApplyCode = (data: any[]) => {
    engineRef.current?.core.initComponents(data);
    setLength(data.length);
    if (engineRef.current) {
      engineRef.current.dirtyRender = true;
      engineRef.current.clearEngineCanvas();
      engineRef.current?.update();
    }
  };
  useEffect(() => {
    canvasRef.current = document.getElementById("canvas") as HTMLCanvasElement;
    initCanvas();
    return () => {
      engineRef.current?.destroyed();
      engineRef.current = null;
    };
  }, []);

  return (
    <div className={styles.canvasContainer}>
      {length}
      {/* <div className={styles.top}></div> */}
      <div className={styles.left}></div>
      <div className={styles.canvas}>
        {/* <canvas id="canvas" width={800} height={800}></canvas> */}
      </div>
      <div className={styles.controls}>
        <CopilotDemo onApplyCode={handlerApplyCode} />
      </div>
    </div>
  );
}
export default Canvas;
