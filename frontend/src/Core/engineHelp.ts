export class EngineHelp {
  /**
   * 计算并返回渲染的最佳分辨率（DPR）。
   * 该方法考虑了“高分屏低报 DPR”的特殊情况，以确保在这些设备上仍能获得良好的视觉效果。
   * @param minClarityThreshold 最低清晰度阈值
   * @param highResWidthThreshold 高分辨率宽度阈值
   * @returns 最佳分辨率
   */
  getOptimalResolution(
    minClarityThreshold: number = 2,
    highResWidthThreshold: number = 1920
  ): number {
    // 1. 获取浏览器报告的原始 DPR 值
    const actualDPR = window.devicePixelRatio || 1;

    // 2. 检查是否符合“高分屏低报 DPR”的特殊情况
    // (a) 浏览器报告 DPR 为 1 AND
    // (b) 屏幕物理宽度超过了高分屏阈值
    const isHighResLowReporting =
      actualDPR === 1 && window.screen.width >= highResWidthThreshold;

    let finalResolution: number;

    if (isHighResLowReporting) {
      // 满足特殊情况：强制使用设定的最小清晰度进行超采样。
      finalResolution = minClarityThreshold;
    } else {
      // 正常情况：采用 Math.max 逻辑。
      // - 如果实际 DPR 很高 (例如 3)，使用 3 (性能准确)。
      // - 如果实际 DPR 低 (例如 1)，则使用 minClarityThreshold (例如 2)，以消除锯齿。
      finalResolution = Math.max(actualDPR, minClarityThreshold);
    }

    return finalResolution;
  }
}
