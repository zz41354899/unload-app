import { TaskCategory, TaskWorry, ResponsibilityOwner } from '../types';

interface ControlLevelSuggestion {
  min: number;
  max: number;
  description: string;
}

/**
 * 根據責任歸屬自動建議控制力範圍
 * - 不在我範圍內的部分 → 0-20%
 * - 共同的影響部分 → 20-60%
 * - 我能掌控的部分 → 60-100%
 */
export function getControlLevelSuggestion(
  categories: string | string[],
  worries: string | string[],
  owner: string | null
): ControlLevelSuggestion {
  // 如果責任歸屬為「不在我範圍內的部分」，建議控制力較低
  if (owner === ResponsibilityOwner.Theirs) {
    return {
      min: 0,
      max: 20,
      description: '這主要是對方的課題，你的控制力應該在 0-20% 之間'
    };
  }

  // 如果責任歸屬為「共同的影響部分」，建議控制力在中等範圍
  if (owner === ResponsibilityOwner.Shared) {
    return {
      min: 20,
      max: 60,
      description: '這是共同課題，你的控制力應該在 20-60% 之間'
    };
  }

  // 如果責任歸屬為「我能掌控的部分」，建議控制力較高
  if (owner === ResponsibilityOwner.Mine) {
    return {
      min: 60,
      max: 100,
      description: '這主要是你的課題，你的控制力應該在 60-100% 之間'
    };
  }

  // 預設值
  return {
    min: 0,
    max: 100,
    description: '請先選擇責任歸屬'
  };
}

/**
 * 驗證控制力是否符合建議範圍
 */
export function isControlLevelValid(
  controlLevel: number,
  suggestion: ControlLevelSuggestion
): boolean {
  return controlLevel >= suggestion.min && controlLevel <= suggestion.max;
}

/**
 * 生成控制力警告訊息
 */
export function getControlLevelWarning(
  controlLevel: number,
  suggestion: ControlLevelSuggestion
): string {
  if (isControlLevelValid(controlLevel, suggestion)) {
    return '';
  }

  if (controlLevel < suggestion.min) {
    return `你的控制力 (${controlLevel}%) 低於建議範圍 (${suggestion.min}-${suggestion.max}%)。請重新考慮你對這個課題的掌控程度。`;
  }

  return `你的控制力 (${controlLevel}%) 高於建議範圍 (${suggestion.min}-${suggestion.max}%)。請重新考慮你對這個課題的掌控程度。`;
}

/**
 * 生成控制力建議訊息
 */
export function getControlLevelAdvice(
  suggestion: ControlLevelSuggestion
): string {
  return `建議範圍：${suggestion.min}-${suggestion.max}%。${suggestion.description}`;
}
