export class Entity {
  id: number = 1; // 实体ID
  constructor() {}

  /**
   * 生成id
   */
  generateId() {
    const colorId = this.idToRGBA(this.id);
    this.id++;
    return colorId;
  }
  /**
   * 通过实体ID获取颜色值
   * @returns
   */
  getColorById(id: string) {
    const colorId = this.idToRGBA(parseInt(id));
    return `rgba(${colorId[0]}, ${colorId[1]}, ${colorId[2]}, ${
      colorId[3] / 255
    })`;
  }

  createEntity() {
    const colorId = this.generateId();
    return colorId.join("");
  }
  /**
   * 通过ID获取颜色
   * @param id 实体ID
   * @returns
   */
  idToRGBA(id: number): [r: number, g: number, b: number, a: number] {
    if (id > 0xffffff) throw new Error("ID exceeds 24-bit limit");
    const r = (id >> 16) & 0xff;
    const g = (id >> 8) & 0xff;
    const b = id & 0xff;
    const a = 255; // 固定不透明
    return [r, g, b, a];
  }

  /**
   * 将hex转成RGB
   * @param hex 颜色值
   * @returns
   */
  hexToRGB(hex: string): [r: number, g: number, b: number] {
    // 需要考虑0x开头的情况
    const hexLower = hex.toLowerCase();
    if (hexLower.startsWith("0x")) {
      hex = hexLower.slice(2);
    } else if (hexLower.startsWith("#")) {
      hex = hexLower.slice(1);
    }
    if (hex.length !== 6) {
      throw new Error("Invalid hex color");
    }
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return [r, g, b];
  }
}
