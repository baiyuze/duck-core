export class Help {
  iframe: HTMLIFrameElement | null = null;
  dsls: any[] = [];
  id = 1;
  constructor() {}

  clear() {
    this.dsls = [];
    this.id = 1;
    this.destroyed();
  }

  public init(html: string) {
    return new Promise<any[]>((resolve) => {
      const iframe = (this.iframe = document.createElement("iframe"));
      // iframe.style.visibility = "hidden";
      iframe.style.width = "370px";
      iframe.style.height = "800px";
      iframe.style.position = "fixed";
      iframe.style.right = "425px";
      iframe.style.top = "0px";
      iframe.style.border = "1px solid #ccc";
      // 将 HTML 内容写入 iframe
      iframe.onload = () => {
        if (iframe.contentDocument) {
          iframe.contentDocument.open();
          iframe.contentDocument.write(html);

          iframe.contentDocument.close();
          this.transform(iframe);
          console.log(this.dsls, "this.dsls");
          resolve(this.dsls);
        }
      };
      document.body.appendChild(iframe);
    });
  }

  transform(iframe: HTMLIFrameElement) {
    const body = iframe.contentDocument?.body;

    const bodyStyle = this.getStyleConfig(body!);
    const rootElement = {
      ...bodyStyle,
      children: [],
    };

    for (let i = 0; i < body!.children.length; i++) {
      const child = body!.children[i] as HTMLElement;
      const childElement = this.transformElement(child);
      rootElement.children.push(childElement);
    }
    this.transformToDSL([rootElement]);
  }

  transformElement(element: HTMLElement): any {
    const style = this.getStyleConfig(element);
    const elementData = {
      ...style,
      children: [] as any[],
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

  getStyleConfig(dom: HTMLElement) {
    const styleConfig = window.getComputedStyle(dom);
    // 只保留有value的样式属性
    const filteredStyles = Object.entries(styleConfig).filter(
      ([key, value]) => {
        const isNumericKey = !isNaN(Number(key));
        return !isNumericKey;
      }
    );
    const style = {} as any;
    for (let i = 0; i < filteredStyles.length; i++) {
      const [key, value] = filteredStyles[i];

      if (value && !key.startsWith("-")) {
        style[key] = value;
        style.dom = dom;
      }
    }
    return style;
  }
  // 转换dsl
  transformToDSL(elements: any[]): any {
    elements.forEach((style: any) => {
      // 获取当前元素距离屏幕左上角的位置
      const rect = style.dom.getBoundingClientRect();
      const dom = style.dom as HTMLElement;
      this.id += 1;
      // const tagName = style.dom.tagName.toLowerCase();
      let type = "rect";
      let src = "";
      let svgContent = "";

      if (dom.nodeType === Node.ELEMENT_NODE) {
        const tagName = dom.tagName.toLowerCase();

        // 判断dom是否是圆形
        const width = rect.width;
        const height = rect.height;

        // 处理 borderRadius，支持百分比和像素值
        let borderRadius = 0;
        const borderRadiusValue = style.borderTopLeftRadius;

        if (borderRadiusValue.includes("%")) {
          // 百分比情况：相对于元素自身的尺寸
          const percentage = parseFloat(borderRadiusValue) / 100;
          // 圆角百分比是相对于宽高中较小的那个
          borderRadius = Math.min(width, height) * percentage;
        } else {
          // 像素值情况
          borderRadius = parseFloat(borderRadiusValue) || 0;
        }

        // 只有当圆角半径接近宽高的一半，且宽高相等时，才认为是圆形
        if (borderRadius > 0 && Math.abs(width - height) < 1) {
          const minSize = Math.min(width, height);
          // 圆角半径必须接近半径大小才算圆形
          if (Math.abs(borderRadius - minSize / 2) < 2) {
            type = "ellipse";
          }
        }

        if (dom.children.length === 0 && dom.childNodes[0]) {
          type = "rect";
        }

        if (style.domChildType === "text") {
          type = "text";
        }
        if (tagName === "img") {
          type = "img";
          src = (dom as HTMLImageElement).src;
        }

        if (tagName === "svg") {
          type = "img";
          src = "";
          svgContent = dom.outerHTML;
        }
      } else if (dom.nodeType === Node.TEXT_NODE) {
        type = "text";
      }
      let strokeColor = "";
      if (style.borderStyle !== "none") {
        if (
          style.borderTopWidth ||
          style.borderRightWidth ||
          style.borderBottomWidth ||
          style.borderLeftWidth
        ) {
          // 处理color为多个情况，分别取对应边的颜色
          // 需要判断当前边框宽度是否大于0
          const bordersColorMap: { [key: string]: string } = {};
          if (parseFloat(style.borderTopWidth) > 0) {
            bordersColorMap["strokeTColor"] = style.borderTopColor;
          }
          if (parseFloat(style.borderRightWidth) > 0) {
            bordersColorMap["strokeRColor"] = style.borderRightColor;
          }
          if (parseFloat(style.borderBottomWidth) > 0) {
            bordersColorMap["strokeBColor"] = style.borderBottomColor;
          }
          if (parseFloat(style.borderLeftWidth) > 0) {
            bordersColorMap["strokeLColor"] = style.borderLeftColor;
          }
          // 优先取第一个边框颜色作为strokeColor
          const colors = style.borderColor.split(" rgb");
          if (colors.length === 1) {
            strokeColor = style.borderColor;
          } else {
            strokeColor = bordersColorMap["strokeTColor"] || "";
          }
        }
      }
      // 抽象构建 dsl 对象，便于后续维护与扩展
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
      const font = {
        size: parseFloat(style.fontSize) || 16,
        fillColor: style.color,
        fontWeight: style.fontWeight,
        fontFamily: style.fontFamily,
        text: type === "text" ? (dom as any).innerText || "" : "",
      };
      const color = {
        fillColor: style.backgroundColor,
        strokeColor: strokeColor || null,
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
        font,
        color,
        selected: { value: false, hovered: false },
        radius,
        img: src ? { src } : null,
        id: this.id.toString(),
        rotation: { value: 0 },
        zIndex: 30,
        lineWidth,
        eventQueue: [],
        type,
      };
      this.dsls.push(dsl);
      if (style.children && style.children.length > 0) {
        this.transformToDSL(style.children);
      }
    });
  }

  destroyed() {
    // 清空iframe
    const iframe = this.iframe;
    if (iframe) {
      iframe.parentNode?.removeChild(iframe);
    }
  }
}
