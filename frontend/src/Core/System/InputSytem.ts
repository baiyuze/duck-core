import type { Engine } from "../Core/Engine";
import type { StateStore } from "../types";
import { System } from "./System";

/**
 * 处理键盘输入的系统
 */
export class InputSystem extends System {
  engine: Engine;
  entityManager: any;
  stateStore: StateStore | null = null;
  pressedKeys: Set<string> = new Set();
  isWindows: boolean = false;

  constructor(engine: Engine) {
    super();
    this.engine = engine;

    // 检测操作系统
    this.isWindows = navigator.userAgent.indexOf("Windows") !== -1;

    document.addEventListener("keydown", (e) => {
      if (e.key) {
        let keyName = e.key;
        // 在 Windows 系统下，特别处理左侧 Ctrl 键
        if (
          this.isWindows &&
          e.key === "Control" &&
          e.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT
        ) {
          keyName = "LeftControl";
        }

        // 避免重复按键事件
        if (!this.pressedKeys.has(keyName)) {
          this.pressedKeys.add(keyName);
          this.handleKeyEvent();
        }
      }
    });

    document.addEventListener("keyup", (e) => {
      if (e.key) {
        let keyName = e.key;
        // 在 Windows 系统下，特别处理左侧 Ctrl 键
        if (
          this.isWindows &&
          e.key === "Control" &&
          e.location === KeyboardEvent.DOM_KEY_LOCATION_LEFT
        ) {
          keyName = "LeftControl";
        }

        // 只有当按键确实被按下过才处理抬起事件
        if (this.pressedKeys.has(keyName)) {
          this.pressedKeys.delete(keyName);
          this.handleKeyEvent();
        }
      }
    });
  }

  getKeysName = () => {
    // 获取当前按下的所有按键，并排序形成组合键字符串
    const keys = Array.from(this.pressedKeys).sort();
    return keys.join("+");
  };

  // 检查是否按下了多选修饰键
  isMultiSelectModifierPressed(): boolean {
    if (this.isWindows) {
      return this.pressedKeys.has("LeftControl");
    } else {
      return this.pressedKeys.has("Meta") || this.pressedKeys.has("Control");
    }
  }

  // 统一处理按键事件
  handleKeyEvent() {
    const keyString = this.getKeysName();
    // 处理多选修饰键状态
    this.engine.core.multiple = this.isMultiSelectModifierPressed();

    // 处理具体的组合键
    this.handleKeyboardShortcuts(keyString);
  }

  // 处理键盘快捷键
  handleKeyboardShortcuts(keyString: string) {
    const shortcuts = {
      // Windows 系统的快捷键
      "LeftControl+a": () => {
        if (this.isWindows) {
          console.log("Windows: 全选");
          // 这里可以添加全选逻辑
        }
      },
      "LeftControl+c": () => {
        if (this.isWindows) {
          console.log("Windows: 复制");
          // 这里可以添加复制逻辑
        }
      },
      "LeftControl+v": () => {
        if (this.isWindows) {
          console.log("Windows: 粘贴");
          // 这里可以添加粘贴逻辑
        }
      },

      // macOS 系统的快捷键
      "Meta+a": () => {
        if (!this.isWindows) {
          console.log("macOS: 全选");
          // 这里可以添加全选逻辑
        }
      },
      "Meta+c": () => {
        if (!this.isWindows) {
          console.log("macOS: 复制");
          // 这里可以添加复制逻辑
        }
      },
      "Meta+v": () => {
        if (!this.isWindows) {
          console.log("macOS: 粘贴");
          // 这里可以添加粘贴逻辑
        }
      },

      // Linux 系统的快捷键
      "Control+a": () => {
        if (!this.isWindows) {
          console.log("Linux: 全选");
          // 这里可以添加全选逻辑
        }
      },
      "Control+c": () => {
        if (!this.isWindows) {
          console.log("Linux: 复制");
          // 这里可以添加复制逻辑
        }
      },
      "Control+v": () => {
        if (!this.isWindows) {
          console.log("Linux: 粘贴");
          // 这里可以添加粘贴逻辑
        }
      },
    };

    const handler = shortcuts[keyString as keyof typeof shortcuts];
    if (handler) {
      handler();
    }
  }

  update(stateStore: StateStore) {
    this.stateStore = stateStore;
  }
}
