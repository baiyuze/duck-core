export class Help {
  iframe: HTMLIFrameElement | null = null;
  constructor() {}

  public init(html: string) {
    const iframe = (this.iframe = document.createElement("iframe"));
    console.log(iframe, "iframe");
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
      }
    };
    document.body.appendChild(iframe);
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
    console.log(rootElement, "iframe content");
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
    const style = {} as any;
    for (let i = 0; i < styleConfig.length; i++) {
      const key = styleConfig[i];
      const value = styleConfig.getPropertyValue(key);
      if (value && !key.startsWith("-")) {
        style[key] = value;
        style.dom = dom;
      }
    }
    return style;
  }
  // 转换dsl
  transformToDSL(elements: HTMLElement[]): any {
    const dsls = [];
    elements.forEach((element) => {
      // 获取当前元素距离屏幕左上角的位置
      const rect = element.getBoundingClientRect();

      const dsl = {
        position: {
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
        },
      };
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
