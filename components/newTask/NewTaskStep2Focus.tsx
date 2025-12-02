import React from 'react';
import { WizardLayout } from '../../components/StepWizard';
import { TaskPolarity } from '../../types';

interface NewTaskStep2FocusProps {
  t: (key: string, options?: any) => string;
  i18nLanguage: string;
  step: number;
  categories: string[];
  CUSTOM_CATEGORY_KEY: string;
  customCategory: string;
  polarity: TaskPolarity;
  focusSentence: string;
  setFocusSentence: (value: string) => void;
  focusAspect: string | null;
  setFocusAspect: (value: string | null) => void;
  onBack: () => void;
  onNext: () => void;
}

export const NewTaskStep2Focus: React.FC<NewTaskStep2FocusProps> = ({
  t,
  i18nLanguage,
  step,
  categories,
  CUSTOM_CATEGORY_KEY,
  customCategory,
  polarity,
  focusSentence,
  setFocusSentence,
  focusAspect,
  setFocusAspect,
  onBack,
  onNext,
}) => {
  const isValid = focusSentence.trim().length > 0;

  const primaryKeys = categories.slice(0, 2);
  const emotionLabels: string[] = [];

  primaryKeys.forEach((key) => {
    if (!key) return;
    if (key === CUSTOM_CATEGORY_KEY) {
      const label = customCategory.trim() || t('taskCategory.Custom');
      if (label) emotionLabels.push(label);
    } else {
      const label =
        polarity === TaskPolarity.Positive
          ? t(`taskCategoryPositive.${key}`)
          : t(`taskCategory.${key}`);
      if (label) emotionLabels.push(label);
    }
  });

  let selectedEmotionHint: string | null = null;
  if (emotionLabels.length > 0) {
    const joined = i18nLanguage === 'en'
      ? emotionLabels.join(' and ')
      : emotionLabels.join('、');

    if (i18nLanguage === 'en') {
      const plural = emotionLabels.length > 1 ? 'emotions' : 'emotion';
      selectedEmotionHint = `You are currently focusing on the ${plural} "${joined}".`;
    } else {
      selectedEmotionHint = t('newTask.step2.selectedEmotionHint', { emotion: joined });
    }
  }

  return (
    <WizardLayout
      title={t('newTask.step2.title')}
      subtitle={t('newTask.step2.subtitle')}
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!isValid}
      currentStep={2}
      totalSteps={5}
    >
      <div key={step}>
        <div className="space-y-3">
          {selectedEmotionHint && (
            <p className="text-xs md:text-sm text-primary/60">
              {selectedEmotionHint}
            </p>
          )}
          <textarea
            value={focusSentence}
            onChange={(e) => setFocusSentence(e.target.value)}
            placeholder={t('newTask.step2.customPlaceholder')}
            className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white text-text placeholder-gray-300 resize-none min-h-[96px]"
          />
          <div className="space-y-2">
            <div className="text-[11px] md:text-xs text-gray-400">
              {t('newTask.step2.aspect.title')}
            </div>
            <div className="flex flex-wrap gap-2">
              {['self', 'view', 'future'].map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setFocusAspect(focusAspect === key ? null : key)}
                  className={`px-3 py-1 rounded-full text-xs md:text-sm border transition-colors ${
                    focusAspect === key
                      ? 'bg-primary/10 border-primary text-primary'
                      : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  {t(`newTask.step2.aspect.${key}`)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </WizardLayout>
  );
};
