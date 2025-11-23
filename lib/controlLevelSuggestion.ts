import { TaskCategory, TaskWorry, ResponsibilityOwner } from '../types';
import i18n from '../i18n';

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
      description: i18n.t('control.description.theirs')
    };
  }

  // 如果責任歸屬為「共同的影響部分」，建議控制力在中等範圍
  if (owner === ResponsibilityOwner.Shared) {
    return {
      min: 20,
      max: 60,
      description: i18n.t('control.description.shared')
    };
  }

  // 如果責任歸屬為「我能掌控的部分」，建議控制力較高
  if (owner === ResponsibilityOwner.Mine) {
    return {
      min: 60,
      max: 100,
      description: i18n.t('control.description.mine')
    };
  }

  // 預設值
  return {
    min: 0,
    max: 100,
    description: i18n.t('control.description.unknown')
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
    return i18n.t('control.warning.low', {
      control: controlLevel,
      min: suggestion.min,
      max: suggestion.max,
    });
  }

  return i18n.t('control.warning.high', {
    control: controlLevel,
    min: suggestion.min,
    max: suggestion.max,
  });
}

/**
 * 生成控制力建議訊息
 */
export function getControlLevelAdvice(
  suggestion: ControlLevelSuggestion
): string {
  return i18n.t('control.advice', {
    min: suggestion.min,
    max: suggestion.max,
    description: suggestion.description,
  });
}
