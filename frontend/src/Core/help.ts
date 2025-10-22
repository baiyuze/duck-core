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
      iframe.style.visibility = "hidden";
      iframe.style.width = "100px";
      iframe.style.height = "100px";
      iframe.style.position = "absolute";
      // 将 HTML 内容写入 iframe
      iframe.onload = () => {
        if (iframe.contentDocument) {
          iframe.contentDocument.open();
          iframe.contentDocument.write(html);

          iframe.contentDocument.close();
          this.transform(iframe);
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

      if (dom.nodeType === Node.ELEMENT_NODE) {
        const tagName = dom.tagName.toLowerCase();

        // 判断dom是否是圆形

        const borderRadius = parseFloat(style.borderTopLeftRadius) || 0;
        const width = rect.width;
        const height = rect.height;

        // 只有当圆角半径接近宽高的一半，且宽高相等时，才认为是圆形
        if (borderRadius > 0 && Math.abs(width - height) < 1) {
          const minSize = Math.min(width, height);
          // 圆角半径必须接近半径大小才算圆形
          if (Math.abs(borderRadius - minSize / 2) < 2) {
            type = "ellipse";
          }
        }

        if (dom.children.length === 0 && dom.childNodes[0]) {
          type = "text";
        }
        if (tagName === "img") {
          type = "img";
          src = (dom as HTMLImageElement).src;
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
          strokeColor = style.borderColor;
        }
      }
      // 抽象构建 dsl 对象，便于后续维护与扩展
      const position = {
        x: rect.left + window.scrollX + (parseFloat(style.marginLeft) || 0),
        y: rect.top + window.scrollY + (parseFloat(style.marginTop) || 0),
      };

      const size = {
        width:
          rect.width +
          (parseFloat(style.paddingLeft) || 0) +
          (parseFloat(style.paddingRight) || 0) +
          (parseFloat(style.borderLeftWidth) || 0) +
          (parseFloat(style.borderRightWidth) || 0),
        height:
          rect.height +
          (parseFloat(style.paddingTop) || 0) +
          (parseFloat(style.paddingBottom) || 0) +
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
