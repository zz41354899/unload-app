import React from 'react';
import { WizardLayout, MultiSelectGrid } from '../../components/StepWizard';
import { TaskPolarity } from '../../types';

interface NewTaskStep1CategoryProps {
  t: (key: string, options?: any) => string;
  step: number;
  polarity: TaskPolarity;
  categories: string[];
  setCategories: (value: string[]) => void;
  categoryOptions: string[];
  customCategory: string;
  setCustomCategory: (value: string) => void;
  categoryLimitMessage: string | null;
  setCategoryLimitMessage: (value: string | null) => void;
  CUSTOM_CATEGORY_KEY: string;
  onBack: () => void;
  onNext: () => void;
}

export const NewTaskStep1Category: React.FC<NewTaskStep1CategoryProps> = ({
  t,
  step,
  polarity,
  categories,
  setCategories,
  categoryOptions,
  customCategory,
  setCustomCategory,
  categoryLimitMessage,
  setCategoryLimitMessage,
  CUSTOM_CATEGORY_KEY,
  onBack,
  onNext,
}) => {
  const isOtherSelected = categories.includes(CUSTOM_CATEGORY_KEY);
  const isValid = categories.length > 0 && (!isOtherSelected || customCategory.trim().length > 0);

  return (
    <WizardLayout
      title={t('newTask.step1.title')}
      subtitle={t('newTask.step1.subtitle')}
      onBack={onBack}
      onNext={onNext}
      nextDisabled={!isValid}
      currentStep={1}
      totalSteps={5}
    >
      <div key={step}>
        <MultiSelectGrid
          options={categoryOptions}
          selected={categories}
          onSelect={(vals) => {
            let next = vals;
            if (vals.length > 2) {
              next = vals.slice(-2);
              setCategoryLimitMessage(t('wizard.maxSelections', { count: 2 }));
            } else {
              setCategoryLimitMessage(null);
            }
            setCategories(next);
            if (!next.includes(CUSTOM_CATEGORY_KEY)) setCustomCategory('');
          }}
          getLabel={(option, translate) =>
            option === CUSTOM_CATEGORY_KEY
              ? translate('taskCategory.Custom')
              : polarity === TaskPolarity.Positive
                ? translate(`taskCategoryPositive.${option}`)
                : translate(`taskCategory.${option}`)
          }
          getHintOverride={(option, translate) =>
            option === CUSTOM_CATEGORY_KEY
              ? translate('taskCategory.Custom_hint')
              : polarity === TaskPolarity.Positive
                ? translate(`taskCategoryPositive.${option}_hint`)
                : translate(`taskCategory.${option}_hint`)
          }
        />
        {categoryLimitMessage && (
          <p className="mt-3 text-xs text-red-500">{categoryLimitMessage}</p>
        )}
        {isOtherSelected && (
          <div>
            <input
              type="text"
              placeholder={t('newTask.step1.customPlaceholder')}
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="w-full mt-4 p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white text-text placeholder-gray-300"
              autoFocus
            />
          </div>
        )}
      </div>
    </WizardLayout>
  );
};
