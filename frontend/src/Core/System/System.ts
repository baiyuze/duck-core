import type {
  Color,
  Font,
  LineWidth,
  Position,
  Radius,
  Rotation,
  Size,
} from "../Components";
import type { EllipseRadius } from "../Components/EllipseRadius";
import type { Img } from "../Components/Img";
import type Polygon from "../Components/Polygon";
import type Scale from "../Components/Scale";
import type { Engine } from "../Core/Engine";
import { DSL } from "../DSL/DSL";
import type { StateStore } from "../types";
import type { DSLParams } from "../types/dsl";
import { hash } from "stable-hash-x";
import equal from "fast-deep-equal";
import { getComponentsByEntityId } from "../utils";

export class System {
  constructor() {}
  hashMap: Map<string, string | any> = new Map();
  update(components: StateStore) {}
  draw(entityId: string) {}
  /**
   * 根据 entityId 获取组件信息
   * @param components
   * @param entityId
   * @returns
   */
  getComponentsByEntityId = getComponentsByEntityId;
  /**
   * 将 (x, y, width, height) 转换为左上右下格式的矩形
   * @param state DSL
   * @returns
   */
  toLTRBRect(state: DSL) {
    // const { x, y } = state.position;
    const { width, height } = state.size;
    return { left: 0, top: 0, right: width, bottom: height };
  }
  /**
   * 将左上右下格式的矩形转换为 (x, y, width, height) 格式
   * @param left
   * @param top
   * @param right
   * @param bottom
   * @returns
   */

  toXYWHRect(left: number, top: number, right: number, bottom: number) {
    return { x: left, y: top, width: right - left, height: bottom - top };
  }
  /**
   * 获取状态的哈希值
   * @param state
   * @returns
   */
  getHash(state: DSL): string {
    return hash(state);
  }
  /**
   * 比较两个状态是否相等
   * @param state1
   * @param state2
   * @returns
   */
  isEqual(state1: DSL, state2: DSL): boolean {
    const hash1 = this.getHash(state1);
    const hash2 = this.getHash(state2);
    return hash1 === hash2;
  }
  /**
   * 判断状态是否脏
   * @param state1
   * @param state2
   * @returns
   */
  isDirty(entityId: string, newState: DSL): boolean {
    // const oldHash = this.hashMap.get(entityId);
    // if (oldHash === hash(newState)) return false;
    if (!this.isPositionDirty(entityId, newState)) return false;
    if (!this.isGeometryDirty(entityId, newState)) return false;

    // this.hashMap.set(entityId, this.getHash(newState));
    return true;
  }
  isPositionDirty(entityId: string, state: DSL): boolean {
    const oldPosition = this.hashMap.get(entityId + "_position");
    if (
      oldPosition &&
      oldPosition.x === state.position.x &&
      oldPosition.y === state.position.y
    )
      return false;
    this.hashMap.set(entityId + "_position", state.position);
    return true;
  }
  isGeometryDirty(entityId: string, state: DSL): boolean {
    const old = this.hashMap.get(entityId + "_geometry");
    const data: any = { ...state };
    delete data.position;
    if (equal(data, old)) return false;
    this.hashMap.set(entityId + "_geometry", data);
    return true;
  }
  /**
   * 销毁
   */
  destroyed() {}
}
