//               ┌────────────────────────────┐
//               │          Engine            │
//               │ （统一容器与调度管理）     │
//               └────────────┬───────────────┘
//                            │
//          ┌─────────────────┴──────────────────┐
//          │                                    │
// ┌───────────────────────┐          ┌────────────────────────┐
// │   StaticContainer     │          │   DynamicContainer     │
// │ （静态层，稳定存储） │          │ （动态层，实时维护） │
// └────────────┬──────────┘          └─────────────┬──────────┘
//              │                                   │
//    ┌─────────┴─────────┐                ┌────────┴─────────┐
//    │ Chunk[1] ... [N]  │                │   Stag[1...M]    │
//    │ 每层最多150对象    │                │ 来自 pick 的对象  │
//    │ 被选中或脏数据更新 │                │ 动态更新、临时存活│
//    └────────────────────┘                └───────────────────┘

import { Container } from "pixi.js";

// 事件流：
//   pick() → 对象加入 DynamicContainer
//   selection() → 标记为脏，重新入 StaticContainer
//   appendChild() → 判断是否脏 → 分配至对应层

// 场景	静态层对象量	动态层对象量	总体性能	备注
// 空闲/浏览状态	10w	0	🟢 60 FPS	静态层合并渲染，GPU 负载极低
// 普通交互（选中、拖拽）	10w	100	🟢 60 FPS	正常编辑器使用场景
// 批量选中（局部重绘）	10w	100	🟡 50~60 FPS	有少量脏区更新
// 缩放画布（camera 变换）	10w	100	🟡 45~60 FPS	重建视图矩阵开销小
// 大场景（高端设备）	30w	100	🟡 40~55 FPS	受 GPU fillrate 限制
// 极限压力（实验）	50w	100	🔴 30~40 FPS	不建议常规使用
interface ContainerMapItem {
  container: Container;
  isStatic: boolean;
  parentUid: string | number;
  parentContainer: Container;
}
export class Scheduler {
  // 总容器
  container: Container = new Container();
  // 静态容器
  staticContainer: Container = new Container();
  // 动态容器
  dynamicContainer: Container = new Container();
  // 静态块容器
  staticChunks: Container = new Container();
  /**
   * 容器映射表
   */
  containerMap: Map<string | number, ContainerMapItem> = new Map();
  constructor() {}
  /**
   * 构建子静态容器
   * @param container
   */
  createChildStatic(container: Container) {
    if (this.containerMap.has(container.uid)) {
      console.warn(`Container with uid ${container.uid} already exists.`);
      return;
    }
    const setMapFn = () => {
      this.setContainer(container.uid, {
        container,
        isStatic: true,
        parentUid: this.staticContainer.uid,
        parentContainer: this.staticContainer,
      });
    };
    if (this.staticChunks.children.length < 150) {
      this.staticChunks.addChild(container);
    } else {
      this.staticContainer.addChild(this.staticChunks);
      this.staticChunks = new Container();
      this.staticChunks.addChild(container);
    }

    setMapFn();
  }

  /**
   * 完成静态块的构建（在 createBox 之前调用）
   */
  finishStaticChunks() {
    if (this.staticChunks.children.length > 0) {
      this.staticContainer.addChild(this.staticChunks);
      this.staticChunks = new Container();
    }
  }

  setContainer(
    uid: string | number,
    { container, isStatic, parentUid, parentContainer }: ContainerMapItem
  ) {
    this.containerMap.set(uid, {
      container,
      isStatic,
      parentUid,
      parentContainer,
    });
  }

  getContainer(uid: string | number): ContainerMapItem | undefined {
    return this.containerMap.get(uid);
  }

  createDynamic() {
    // this.dynamicContainer.addChild();
  }
  /**
   * 创建总容器
   */
  createBox(): Container {
    this.container.addChild(this.staticContainer, this.dynamicContainer);
    this.cacheAsTexture();
    return this.container;
  }
  /**
   * 创建缓存纹理
   * @param container
   */
  cacheAsTexture(
    container?: Container,
    options?: { resolution?: number; antialias?: boolean }
  ) {
    const targetContainer = container || this.staticContainer;
    if (targetContainer.isCachedAsTexture) return;
    targetContainer.cacheAsTexture(
      options
        ? {
            resolution: options?.resolution,
            antialias: true,
          }
        : true
    );
  }

  isCached(container?: Container) {
    const target = container ?? this.staticContainer;
    return !target.isCachedAsTexture;
  }

  /**
   * 释放缓存纹理
   * @param container
   */
  releaseCache(container?: Container) {
    const targetContainer = container || this.staticContainer;
    if (!targetContainer.isCachedAsTexture) {
      // 已经释放，无需重复操作
      return;
    }
    targetContainer.cacheAsTexture(false);
  }
}
