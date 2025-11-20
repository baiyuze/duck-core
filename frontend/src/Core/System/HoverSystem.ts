import type { Engine } from "../Core/Engine";
import { Entity } from "../Entity/Entity";
import { EventType, systemEum } from "../enum";
import type { PickEntity, StateStore } from "../types";
import type { PickingSystem } from "./PickingSystem";
import type { SelectionSystem } from "./SelectionSystem";
import { System } from "./System";
export class HoverSystem extends System {
  engine: Engine;
  entityManager: Entity = new Entity();
  stateStore: StateStore | null = null;
  isClearHover: boolean = false;
  constructor(engine: Engine) {
    super();
    this.engine = engine;
    // ctx.canvas.addEventListener("click", this.onClick.bind(this));
  }

  update(stateStore: StateStore) {
    if (this.engine.config.hover?.enabled) {
      this.stateStore = stateStore;
      this.onHover();
    }
  }
  /**
   * 清空hover状态
   * @returns
   */
  clearHoverState() {
    if (!this.stateStore) return;
    this.stateStore.selected.forEach((sel) => {
      sel.hovered = false;
    });
  }

  clear() {
    this.clearHoverState();
  }

  /**
   * 修改hover状态
   * @param event
   * @returns
   */
  setHoverState(pickEntity: PickEntity | null, hovered: boolean = false) {
    // 根据颜色获取实体id
    if (!this.stateStore) return;
    if (hovered) {
      if (pickEntity) pickEntity.selected.hovered = true;
      // 单选
      this.stateStore.selected.forEach((sel, id) => {
        if (id !== pickEntity?.entityId) {
          sel.hovered = false;
        }
      });
    } else {
      //清空hover状态
      this.clearHoverState();
    }
  }
  /**
   * hover事件处理
   * @returns
   */
  onHover() {
    const pickSystem = this.engine.getSystemByName<PickingSystem>(
      systemEum.PickingSystem
    );
    if (!pickSystem) return;
    if (pickSystem.checkEventTypeIsMatch(EventType.MouseMove) === false) return;
    const pickEntity = pickSystem.getEntityByEvent(EventType.MouseMove);
    if (this.isClearHover && !pickEntity) return;
    if (!pickEntity?.entityId) {
      this.isClearHover = true;
      return this.setHoverState(pickEntity, false);
    }
    this.isClearHover = false;
    this.setHoverState(pickEntity, true);
  }
}
