
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { WizardLayout, SelectionGrid, SelectionList, MultiSelectGrid } from '../components/StepWizard';
import { TaskCategory, TaskWorry, ResponsibilityOwner, TaskPolarity } from '../types';
import { useAppStore } from '../store';
import { getQuoteByControlLevel } from '../lib/quotes';
import { CheckCircle, ArrowRight, Brain } from 'lucide-react';

interface NewTaskProps {
  navigate: (page: string) => void;
}

export const NewTask: React.FC<NewTaskProps> = ({ navigate }) => {
  const { addTask, showToast, openNps } = useAppStore();
  const routerNavigate = useNavigate();
  const [step, setStep] = useState(1);
  const { t, i18n } = useTranslation();

  const [categories, setCategories] = useState<string[]>([]);
  const [categoryLimitMessage, setCategoryLimitMessage] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState<string>('');

  const [worries, setWorries] = useState<string[]>([]);
  const [customWorry, setCustomWorry] = useState<string>('');
  const [focusSentence, setFocusSentence] = useState<string>('');

  const [owner, setOwner] = useState<string | null>(null);
  const [control] = useState<number>(0);
  const [reflectionNote, setReflectionNote] = useState<string>('');
  const [reflectionReality, setReflectionReality] = useState<string>('');
  const [reflectionDistance, setReflectionDistance] = useState<string>('');
  const [reflectionValue, setReflectionValue] = useState<string>('');
  const [finalMessage, setFinalMessage] = useState<string>('');
  const [selectedPerspective, setSelectedPerspective] = useState<'reality' | 'distance' | 'value' | 'observe' | null>(null);
  const [polarity, setPolarity] = useState<TaskPolarity>(TaskPolarity.Negative);
  const [focusAspect, setFocusAspect] = useState<string | null>(null);

  // Step 1 pseudo option: extra "Other" entry mapped to custom text
  const CUSTOM_CATEGORY_KEY = '__custom__';
  const categoryOptions: string[] = [...Object.values(TaskCategory), CUSTOM_CATEGORY_KEY];

  const handleNext = () => setStep(prev => prev + 1);
  const handleBack = () => {
    if (step === 1) {
      navigate('dashboard');
      routerNavigate('/app/dashboard');
    } else {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Determine final values: use custom input if '其他' / 'Other' is selected
    let finalCategories = [...categories];
    const trimmedCustomCategory = customCategory.trim();
    const hasCustomCategory = categories.includes(CUSTOM_CATEGORY_KEY);
    if (hasCustomCategory && trimmedCustomCategory) {
      finalCategories = finalCategories.filter(c => c !== CUSTOM_CATEGORY_KEY);
      finalCategories.push(trimmedCustomCategory);
    }

    const trimmedFocus = focusSentence.trim();
    const trimmedCustomWorry = customWorry.trim();
    let finalWorries = [...worries];
    if (trimmedFocus) {
      finalWorries = [trimmedFocus];
    } else if (finalWorries.includes(TaskWorry.Other) && trimmedCustomWorry) {
      finalWorries = finalWorries.filter(w => w !== TaskWorry.Other);
      finalWorries.push(trimmedCustomWorry);
    }

    if (finalCategories.length > 0 && finalWorries.length > 0 && owner) {
      const trimmedFocusSentence = focusSentence.trim();
      const trimmedReflectionNote = reflectionNote.trim();
      const trimmedReality = reflectionReality.trim();
      const trimmedDistance = reflectionDistance.trim();
      const trimmedValue = reflectionValue.trim();
      const trimmedFinalMessage = finalMessage.trim();

      const blocks: Array<() => string | null> = [
        () => (trimmedFocusSentence ? `${t('newTask.step2.title')}\n${trimmedFocusSentence}` : null),
        () => {
          if (!focusAspect) return null;
          const aspectLabel = t(`newTask.step2.aspect.${focusAspect}`);
          return `${t('journal.focus.aspectTitle')}\n${aspectLabel}`;
        },
        () => (trimmedReflectionNote ? trimmedReflectionNote : null),
        () => (trimmedReality ? `${t('newTask.perspective.reality.title')}\n${trimmedReality}` : null),
        () => (trimmedDistance ? `${t('newTask.perspective.distance.title')}\n${trimmedDistance}` : null),
        () => (trimmedValue ? `${t('newTask.perspective.value.title')}\n${trimmedValue}` : null),
        () => (trimmedFinalMessage ? `${t('newTask.finalMessage.label')}\n${trimmedFinalMessage}` : null),
      ];

      const reflectionParts = blocks
        .map(fn => fn())
        .filter((part): part is string => Boolean(part));

      const combinedReflection = reflectionParts.length > 0 ? reflectionParts.join('\n\n') : undefined;

      addTask({
        category: finalCategories.length === 1 ? finalCategories[0] : finalCategories,
        worry: finalWorries.length === 1 ? finalWorries[0] : finalWorries,
        owner: owner as ResponsibilityOwner,
        controlLevel: control,
        reflection: combinedReflection,
        polarity,
        perspective: selectedPerspective ?? undefined,
        finalMessage: finalMessage.trim() || undefined,
      });
      // 進入結果頁面（語錄在結果頁依當前語言即時計算）
      setStep(6);
    }
  };

  // Step 1: Category
  if (step === 1) {
    const isOtherSelected = categories.includes(CUSTOM_CATEGORY_KEY);
    const isValid = categories.length > 0 && (!isOtherSelected || customCategory.trim().length > 0);

    return (
      <WizardLayout
        title={t('newTask.step1.title')}
        subtitle={t('newTask.step1.subtitle')}
        onBack={handleBack}
        onNext={handleNext}
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
                // 僅保留最近選取的兩個情緒，並顯示提示文字
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
  }

  // Step 2: Focus sentence
  if (step === 2) {
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
      const joined = i18n.language === 'en'
        ? emotionLabels.join(' and ')
        : emotionLabels.join('、');

      if (i18n.language === 'en') {
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
        onBack={handleBack}
        onNext={handleNext}
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
                    onClick={() => setFocusAspect(prev => (prev === key ? null : key))}
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
  }

  // Step 3: Owner
  if (step === 3) {
    return (
      <WizardLayout
        title={t('newTask.step3.title')}
        subtitle={t('newTask.step3.subtitle')}
        onBack={handleBack}
        onNext={handleNext}
        nextDisabled={!owner}
        currentStep={3}
        totalSteps={5}
      >
        <div key={step}>
          <SelectionList
            options={Object.values(ResponsibilityOwner)}
            selected={owner}
            onSelect={setOwner}
          />
          {owner && (
            <p className="mt-4 text-sm text-gray-500">
              {t('newTask.step3.boundaryReflection', {
                boundary: t(`owner.${owner as ResponsibilityOwner}`),
              })}
            </p>
          )}
        </div>
      </WizardLayout>
    );
  }

  // Step 4: Multi-perspective choice (A/B/C)
  if (step === 4) {
    return (
      <WizardLayout
        title={t('newTask.step4.title')}
        subtitle={t('newTask.step4.subtitle')}
        onBack={handleBack}
        onNext={() => setStep(5)}
        nextLabel={t('wizard.next')}
        nextDisabled={!selectedPerspective}
        currentStep={4}
        totalSteps={5}
      >
        <div key={step}>
          <div className="py-4 px-4">
            <div className="bg-white p-6 rounded-lg border border-gray-100 shadow-sm">
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => setSelectedPerspective('reality')}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                    selectedPerspective === 'reality'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold mb-1">{t('newTask.perspective.reality.title')}</div>
                  <div className="text-gray-500 text-xs">{t('newTask.perspective.reality.q1')}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPerspective('distance')}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                    selectedPerspective === 'distance'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold mb-1">{t('newTask.perspective.distance.title')}</div>
                  <div className="text-gray-500 text-xs">{t('newTask.perspective.distance.q1')}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPerspective('value')}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                    selectedPerspective === 'value'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold mb-1">{t('newTask.perspective.value.title')}</div>
                  <div className="text-gray-500 text-xs">{t('newTask.perspective.value.q1')}</div>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedPerspective('observe')}
                  className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-colors ${
                    selectedPerspective === 'observe'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-semibold mb-1">{t('newTask.perspective.observe.title')}</div>
                  <div className="text-gray-500 text-xs">{t('newTask.perspective.observe.q1')}</div>
                </button>
              </div>

              {selectedPerspective === 'reality' && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('newTask.perspective.reality.title')}
                  </label>
                  <textarea
                    value={reflectionReality}
                    onChange={(e) => setReflectionReality(e.target.value)}
                    placeholder={t('newTask.perspective.reality.q2')}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none min-h-[96px]"
                  />
                </div>
              )}

              {selectedPerspective === 'distance' && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('newTask.perspective.distance.title')}
                  </label>
                  <textarea
                    value={reflectionDistance}
                    onChange={(e) => setReflectionDistance(e.target.value)}
                    placeholder={t('newTask.perspective.distance.q2')}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none min-h-[96px]"
                  />
                </div>
              )}

              {selectedPerspective === 'value' && (
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('newTask.perspective.value.title')}
                  </label>
                  <textarea
                    value={reflectionValue}
                    onChange={(e) => setReflectionValue(e.target.value)}
                    placeholder={t('newTask.perspective.value.q2')}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm resize-none min-h-[96px]"
                  />
                </div>
              )}

              {selectedPerspective && (
                <p className="mt-4 text-xs md:text-sm text-gray-500">
                  {selectedPerspective === 'reality' && t('newTask.perspective.reality.hint')}
                  {selectedPerspective === 'distance' && t('newTask.perspective.distance.hint')}
                  {selectedPerspective === 'value' && t('newTask.perspective.value.hint')}
                  {selectedPerspective === 'observe' && t('newTask.perspective.observe.hint')}
                </p>
              )}
            </div>
          </div>
        </div>
      </WizardLayout>
    );
  }

  // Step 5: Final message
  if (step === 5) {
    const isValid = true;

    return (
      <WizardLayout
        title={t('newTask.finalMessage.label')}
        subtitle={t('newTask.finalMessage.placeholder')}
        onBack={handleBack}
        onNext={handleSubmit}
        nextLabel={t('newTask.step4.nextLabel')}
        nextDisabled={!isValid}
        currentStep={5}
        totalSteps={5}
      >
        <div key={step}>
          <textarea
            value={finalMessage}
            onChange={(e) => setFinalMessage(e.target.value)}
            placeholder={t('newTask.finalMessage.placeholder')}
            className="w-full p-4 rounded-xl border border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-white text-text placeholder-gray-300 resize-none min-h-[96px]"
          />
        </div>
      </WizardLayout>
    );
  }

  // Step 6: Result page
  if (step === 6) {
    // 獲取課題相關的回饋訊息
    const getResultFeedback = (): string => {
      const categoryLabels = (Array.isArray(categories) ? categories : [categories]).map((cat) => {
        if (!cat) return '';

        if (polarity === TaskPolarity.Positive) {
          const positiveKey = `taskCategoryPositive.${cat}`;
          const positiveLabel = t(positiveKey);
          if (positiveLabel !== positiveKey) {
            return positiveLabel;
          }
        }

        const defaultKey = `taskCategory.${cat}`;
        const defaultLabel = t(defaultKey);
        return defaultLabel !== defaultKey ? defaultLabel : '';
      });

      const worryLabels = (Array.isArray(worries) ? worries : [worries]).map((worry) => {
        if (!worry) return '';

        if (polarity === TaskPolarity.Positive) {
          const positiveKey = `taskWorryPositive.${worry}`;
          const positiveLabel = t(positiveKey);
          if (positiveLabel !== positiveKey) {
            return positiveLabel;
          }
        }

        const defaultKey = `taskWorry.${worry}`;
        const defaultLabel = t(defaultKey);
        return defaultLabel !== defaultKey ? defaultLabel : '';
      });

      const categoryStr = categoryLabels.filter(Boolean).join('\u3001');
      const worryStr = worryLabels.filter(Boolean).join('\u3001');

      if (polarity === TaskPolarity.Positive) {
        if (control < 20) {
          return t('newTask.result.feedbackPositive.low', { category: categoryStr, worry: worryStr, control });
        }
        if (control < 60) {
          return t('newTask.result.feedbackPositive.mid', { category: categoryStr, worry: worryStr, control });
        }

        return t('newTask.result.feedbackPositive.high', { category: categoryStr, worry: worryStr, control });
      }

      if (control < 20) {
        return t('newTask.result.feedback.low', { category: categoryStr, worry: worryStr, control });
      }
      if (control < 60) {
        return t('newTask.result.feedback.mid', { category: categoryStr, worry: worryStr, control });
      }

      return t('newTask.result.feedback.high', { category: categoryStr, worry: worryStr, control });
    };

    // 根據控制力與當前語言取得結果頁顯示的語錄
    const resultQuote = getQuoteByControlLevel(control);

    return (
      <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-background">
        <div className="max-w-2xl w-full">
          {/* Success Card */}
          <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-xl border border-gray-100">
            {/* Success Icon */}
            <div className="flex justify-center mb-6 md:mb-8">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl"></div>
                <CheckCircle className="w-16 md:w-20 h-16 md:h-20 text-primary relative" />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl md:text-3xl font-bold text-center mb-1 md:mb-2 text-text">{t('newTask.result.title')}</h1>
            <p className="text-center text-gray-500 text-sm md:text-base mb-6 md:mb-12">{t('newTask.result.subtitle')}</p>

            {/* Quote Section */}
            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl md:rounded-2xl p-4 md:p-8 mb-6 md:mb-8 border border-primary/10">
              <p className="text-center text-base md:text-lg leading-relaxed text-text font-medium mb-3">
                "{resultQuote}"
              </p>
              <p className="text-center text-xs md:text-sm text-gray-600">
                {t('newTask.closingQuote')}
              </p>
            </div>

            {/* Closing Message */}
            <div className="mb-8 md:mb-10 text-center text-xs md:text-sm text-gray-500">
              {t('newTask.closingMessage')}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-2 md:gap-3">
              <button
                type="button"
                onClick={() => {
                  navigate('journal');
                  routerNavigate('/app/journal');
                }}
                className="w-full bg-primary text-white px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl hover:bg-[#1e2b1e] transition-all font-medium flex items-center justify-center gap-2 shadow-lg shadow-primary/20 text-sm md:text-base"
              >
                <CheckCircle className="w-4 md:w-5 h-4 md:h-5" />
                {t('newTask.result.toJournal')}
              </button>
              <button
                type="button"
                onClick={() => {
                  navigate('dashboard');
                  routerNavigate('/app/dashboard');
                }}
                className="w-full bg-gray-100 text-text px-4 md:px-6 py-3 md:py-4 rounded-lg md:rounded-xl hover:bg-gray-200 transition-all font-medium flex items-center justify-center gap-2 text-sm md:text-base"
              >
                <ArrowRight className="w-4 md:w-5 h-4 md:h-5" />
                {t('newTask.result.toDashboard')}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
}
