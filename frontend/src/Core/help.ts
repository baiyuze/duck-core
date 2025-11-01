import type { DSL } from "./DSL/DSL";

interface Style extends CSSStyleDeclaration {
  [key: string]: any;
  dom: HTMLElement;
  children: Style[];
  domChildType?: string; // 标记是否为文本节点
}
export class Help {
  iframe: HTMLIFrameElement | null = null;
  dsls: DSL[] = [];
  id = 1;
  constructor() {}

  clear() {
    this.dsls = [];
    this.id = 1;
    this.destroyed();
  }

  public init(html: string) {
    return new Promise<DSL[]>((resolve) => {
      const iframe = (this.iframe = document.createElement("iframe"));
      // iframe.style.visibility = "hidden";
      iframe.style.width = "370px";
      iframe.style.height = "800px";
      iframe.style.position = "fixed";
      iframe.style.right = "425px";
      iframe.style.top = "0px";
      iframe.style.border = "1px solid #ccc";
      iframe.onload = () => {
        if (iframe.contentDocument) {
          iframe.contentDocument.open();
          iframe.contentDocument.write(html);

          iframe.contentDocument.close();
          this.transform(iframe);
          // console.log(this.dsls, "this.dsls");
          resolve(this.dsls);
        }
      };
      document.body.appendChild(iframe);
    });
  }
  /**
   * 将iframe中的内容转换为DSL格式
   * @param iframe
   */
  transform(iframe: HTMLIFrameElement) {
    const body = iframe.contentDocument?.body;

    const bodyStyle = this.getStyleConfig(body!);
    const rootElement = {
      ...bodyStyle,
      children: [] as Style[],
    };

    for (let i = 0; i < body!.children.length; i++) {
      const child = body!.children[i] as HTMLElement;
      const childElement = this.transformElement(child);
      rootElement.children.push(childElement);
    }
    this.transformToDSL([rootElement]);
  }

  /**
   * 将元素转换为children
   * @param element
   * @returns
   */
  transformElement(element: HTMLElement): Style {
    const style = this.getStyleConfig(element);
    const elementData = {
      ...style,
      children: [] as Style[],
    };

    // 如果有子元素，递归处理
    if (element.children.length > 0) {
      for (let i = 0; i < element.children.length; i++) {
        const child = element.children[i] as HTMLElement;
        const childElement = this.transformElement(child);
        elementData.children.push(childElement);
      }
    } else if (element.childNodes.length > 0) {
      // 处理文本节点
      for (let i = 0; i < element.childNodes.length; i++) {
        const node = element.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
          const textElement = {
            ...this.getStyleConfig(element),
            domChildType: "text",
            children: [],
          };
          elementData.children.push(textElement);
        }
      }
    }

    return elementData;
  }
  /**
   * 获取元素的样式配置
   * @param dom 元素
   * @returns 样式配置对象
   */
  getStyleConfig(dom: HTMLElement) {
    const styleConfig = window.getComputedStyle(dom);
    // 只保留有value的样式属性
    const filteredStyles = Object.entries(styleConfig).filter(([key]) => {
      const isNumericKey = !isNaN(Number(key));
      return !isNumericKey;
    });
    const style = {} as Style;
    for (let i = 0; i < filteredStyles.length; i++) {
      const [key, value]: [string, string] = filteredStyles[i];

      if (value && !key.startsWith("-")) {
        style[key] = value;
        style.dom = dom;
      }
    }
    return style;
  }
  /**
   * 获取文本对齐方式
   * @param style 元素的样式
   * @returns 文本对齐方式
   */
  getTextAlignment(style: CSSStyleDeclaration) {
    const display = style.display;
    const alignItems = style.alignItems;
    const justifyContent = style.justifyContent;
    const textAlign = style.textAlign;

    const height = parseFloat(style.height);
    const lineHeight = parseFloat(style.lineHeight);
    let vertical;
    if (display.includes("flex")) {
      if (alignItems === "center") vertical = "middle";
      else if (alignItems === "flex-start" || alignItems === "start")
        vertical = "top";
      else if (alignItems === "flex-end" || alignItems === "end")
        vertical = "bottom";
    } else if (!isNaN(height) && !isNaN(lineHeight)) {
      if (Math.abs(height - lineHeight) < 0.5) vertical = "middle";
      else if (lineHeight < height / 2) vertical = "top";
      else vertical = "bottom";
    }

    let horizontal;
    if (display.includes("flex")) {
      if (justifyContent === "center") horizontal = "center";
      else if (justifyContent === "flex-start" || justifyContent === "start")
        horizontal = "left";
      else if (justifyContent === "flex-end" || justifyContent === "end")
        horizontal = "right";
    } else {
      if (textAlign === "center") horizontal = "center";
      else if (textAlign === "right" || textAlign === "end")
        horizontal = "right";
      else horizontal = "left"; // 默认 left
    }

    return {
      vertical,
      horizontal,
      isVerticallyCentered: vertical === "middle",
      isHorizontallyCentered: horizontal === "center",
    };
  }

  /**
   * 获取有效的颜色值
   * @param attrValue 属性值
   * @param styleValue 样式值
   * @param fallback 默认值
   * @returns 有效的颜色值
   */
  getValidColor(
    attrValue: string,
    styleValue: string,
    fallback = "transparent"
  ): string {
    if (attrValue && attrValue !== "none") {
      return attrValue;
    }
    if (styleValue && styleValue !== "none") {
      return styleValue;
    }
    return fallback;
  }
  /**
   * 判断元素是否为圆形
   * @param style 元素的样式
   * @param rect 元素的边界矩形
   * @returns 如果是圆形返回true，否则返回false
   */
  isCircle(style: Style, rect: DOMRect): boolean {
    // 判断dom是否是圆形
    const width = rect.width;
    const height = rect.height;
    let type = "rect";
    let borderRadius = 0;
    const borderRadiusValue = style.borderTopLeftRadius;

    if (borderRadiusValue.includes("%")) {
      const percentage = parseFloat(borderRadiusValue) / 100;
      borderRadius = Math.min(width, height) * percentage;
    } else {
      borderRadius = parseFloat(borderRadiusValue) || 0;
    }

    if (borderRadius > 0 && Math.abs(width - height) < 1) {
      const minSize = Math.min(width, height);
      if (Math.abs(borderRadius - minSize / 2) < 2) {
        type = "ellipse";
      }
    }
    return type === "ellipse";
  }
  /**
   * 获取svg的path，fill，stroke
   * @param dom
   * @param style
   * @returns
   */
  getSvgData(
    dom: HTMLElement,
    style: Style
  ): { path: string; svg: string; fill: string; stroke: string } {
    let path = "";
    let fillColor = "";
    let strokeColor = "";
    const pathElement = dom.querySelector("path");

    if (pathElement) {
      path = pathElement.getAttribute("d") || "";

      const pathElementFill = pathElement.getAttribute("fill") || "";
      const pathElementStroke = pathElement.getAttribute("stroke") || "";
      const pathStyle = window.getComputedStyle(pathElement);

      fillColor = this.getValidColor(pathElementFill, pathStyle.fill);
      strokeColor = this.getValidColor(pathElementStroke, pathStyle.stroke);
    } else {
      fillColor = style.fill || "transparent";
      strokeColor = this.getValidColor("", style.stroke);
    }
    return { path, svg: dom.outerHTML, fill: fillColor, stroke: strokeColor };
  }
  /**
   * 获取边框颜色，仅限于单一颜色边框，如果有多边，默认取上边框颜色
   * @param style
   * @returns
   */
  getBorderColor(style: Style, strokeColor: string): string {
    if (style.borderStyle !== "none") {
      if (
        style.borderTopWidth ||
        style.borderRightWidth ||
        style.borderBottomWidth ||
        style.borderLeftWidth
      ) {
        const colors = style.borderColor.split(" rgb");
        if (colors.length === 1) {
          strokeColor = style.borderColor;
        } else {
          strokeColor = style["strokeTColor"] || "";
        }
      }
    }
    return strokeColor;
  }
  /**
   * 根据样式获取字体信息
   * @param style
   * @returns
   */
  getFontByStyle(style: Style) {
    const { vertical, horizontal } = this.getTextAlignment(style);
    const font = {
      size: parseFloat(style.fontSize) || 16,
      fillColor: style.color,
      weight: style.fontWeight,
      family: style.fontFamily,
      textAlign: horizontal,
      textBaseline: vertical,
      text: style.dom.innerText || "",
    };
    return font;
  }
  /**
   * 将元素转换为DSL格式
   * @param elements
   */
  transformToDSL(elements: Style[]) {
    elements.forEach((style: Style) => {
      const rect = style.dom.getBoundingClientRect();
      const dom = style.dom as HTMLElement;
      this.id += 1;
      let type = "rect";
      let src = "";
      let path = "";
      let svg = "";
      let fillColor = style.backgroundColor;
      let strokeColor = "";
      switch (dom.nodeType) {
        case Node.ELEMENT_NODE: {
          const tagName = dom.tagName.toLowerCase();
          type = this.isCircle(style, rect) ? "ellipse" : type;
          type = dom.children.length === 0 && dom.childNodes[0] ? "rect" : type;
          type = style.domChildType === "text" ? "text" : type;
          if (tagName === "img") {
            type = "img";
            src = (dom as HTMLImageElement).src;
          }
          if (tagName === "svg") {
            type = "img";
            const svgData = this.getSvgData(dom, style);
            fillColor = svgData.fill;
            strokeColor = svgData.stroke;
            path = svgData.path;
            svg = svgData.svg;
          }
          break;
        }
      }
      // 不需要计算margin，因为getBoundingClientRect已经包含margin了
      const position = {
        x: rect.left + window.scrollX,
        y: rect.top + window.scrollY,
      };
      // paddingtop和paddingleft不能计算进去，因为宽高不包括padding
      const size = {
        width:
          rect.width +
          (parseFloat(style.borderLeftWidth) || 0) +
          (parseFloat(style.borderRightWidth) || 0),
        height:
          rect.height +
          (parseFloat(style.borderTopWidth) || 0) +
          (parseFloat(style.borderBottomWidth) || 0),
      };
      // 根据css，判断文字的垂直对齐方式
      const color = {
        fillColor,
        strokeColor: this.getBorderColor(style, strokeColor),
        strokeTColor: style.borderTopColor,
        strokeBColor: style.borderBottomColor,
        strokeLColor: style.borderLeftColor,
        strokeRColor: style.borderRightColor,
      };

      const radius = {
        lt: parseFloat(style.borderTopLeftRadius) || 0,
        rt: parseFloat(style.borderTopRightRadius) || 0,
        rb: parseFloat(style.borderBottomRightRadius) || 0,
        lb: parseFloat(style.borderBottomLeftRadius) || 0,
      };

      const hasBorder = style.borderStyle !== "none";
      const defaultBorderWidth = hasBorder
        ? parseFloat(style["borderWidth"]) || 0
        : 0;
      const lineWidth = {
        value: defaultBorderWidth,
        top: hasBorder ? parseFloat(style["borderTopWidth"]) || 0 : 0,
        bottom: hasBorder ? parseFloat(style["borderBottomWidth"]) || 0 : 0,
        left: hasBorder ? parseFloat(style["borderLeftWidth"]) || 0 : 0,
        right: hasBorder ? parseFloat(style["borderRightWidth"]) || 0 : 0,
      };
      const dsl = {
        position,
        size,
        font: type === "text" ? this.getFontByStyle(style) : {},
        color,
        selected: { value: false, hovered: false },
        radius,
        img: src || path || svg ? { src, path, svg } : null,
        id: this.id.toString(),
        rotation: { value: 0 },
        zIndex: 30,
        lineWidth,
        eventQueue: [],
        type,
      };

      this.dsls.push(dsl as unknown as DSL);
      if (style.children && style.children.length > 0) {
        this.transformToDSL(style.children);
      }
    });
  }

  destroyed() {
    const iframe = this.iframe;
    if (iframe) {
      iframe.parentNode?.removeChild(iframe);
    }
  }
}
