import type { Engine } from "../Core/Engine";
import { Entity } from "../Entity/Entity";
import { EventType } from "../enum";
import type { PickEntity, StateStore } from "../types";
import type { PickingSystem } from "./PickingSystem";
import { System } from "./System";
export class ClickSystem extends System {
  engine: Engine;
  ctx: CanvasRenderingContext2D;
  entityManager: Entity = new Entity();
  stateStore: StateStore | null = null;
  constructor(ctx: CanvasRenderingContext2D, engine: Engine) {
    super();
    this.ctx = ctx;
    this.engine = engine;
  }

  update(stateStore: StateStore) {
    this.stateStore = stateStore;
    this.onClick();
  }

  /**
   * 隐藏画布选择
   * @param event
   * @returns
   */
  setSelected(pickEntity: PickEntity | null) {
    if (!pickEntity) return;
    if (!this.stateStore) return;
    const { selected, entityId } = pickEntity;
    if (selected) selected.value = true;
    // 单选
    if (!this.engine.core.multiple) {
      this.stateStore.selected.forEach((sel, id) => {
        if (id !== entityId) {
          sel.value = false;
        }
      });
    }
    // 直接清空所有，重新渲染状态
  }

  /**
   * 清空选中状态
   * @returns
   */
  clearSelectedState() {
    if (!this.stateStore) return;
    this.stateStore.selected.forEach((sel) => {
      sel.value = false;
    });
  }

  clear() {
    this.clearSelectedState();
  }

  onClick() {
    if (!this.stateStore) return;
    const pickSystem =
      this.engine.getSystemByName<PickingSystem>("PickingSystem");
    if (!pickSystem) return;
    if (pickSystem.checkEventTypeIsMatch(EventType.MouseDown) === false) return;
    const pickEntity = pickSystem.getEntityByEvent(EventType.MouseDown);
    if (!pickEntity) {
      // 清空选择
      this.clear();
      return;
    }
    this.setSelected(pickEntity);
  }
}
