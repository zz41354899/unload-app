
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { WizardLayout, SelectionGrid, SelectionList, MultiSelectGrid } from '../components/StepWizard';
import { TaskCategory, TaskWorry, ResponsibilityOwner, TaskPolarity } from '../types';
import { useAppStore } from '../store';
import { getQuoteByControlLevel } from '../lib/quotes';
import { CheckCircle, ArrowRight, Brain } from 'lucide-react';
import { NewTaskStep1Category } from '../components/newTask/NewTaskStep1Category';
import { NewTaskStep2Focus } from '../components/newTask/NewTaskStep2Focus';
import { NewTaskStep3Owner } from '../components/newTask/NewTaskStep3Owner';
import { NewTaskStep4Perspective } from '../components/newTask/NewTaskStep4Perspective';
import { NewTaskStep5FinalMessage } from '../components/newTask/NewTaskStep5FinalMessage';
import { NewTaskResult } from '../components/newTask/NewTaskResult';

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
    return (
      <div className="max-w-6xl mx-auto pb-12 px-4 md:px-0">
        <NewTaskStep1Category
          t={t}
          step={step}
          polarity={polarity}
          categories={categories}
          setCategories={setCategories}
          categoryOptions={categoryOptions}
          customCategory={customCategory}
          setCustomCategory={setCustomCategory}
          categoryLimitMessage={categoryLimitMessage}
          setCategoryLimitMessage={setCategoryLimitMessage}
          CUSTOM_CATEGORY_KEY={CUSTOM_CATEGORY_KEY}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    );
  }

  // Step 2: Focus sentence
  if (step === 2) {
    return (
      <div className="max-w-6xl mx-auto pb-12 px-4 md:px-0">
        <NewTaskStep2Focus
          t={t}
          i18nLanguage={i18n.language}
          step={step}
          categories={categories}
          CUSTOM_CATEGORY_KEY={CUSTOM_CATEGORY_KEY}
          customCategory={customCategory}
          polarity={polarity}
          focusSentence={focusSentence}
          setFocusSentence={setFocusSentence}
          focusAspect={focusAspect}
          setFocusAspect={setFocusAspect}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    );
  }

  // Step 3: Owner
  if (step === 3) {
    return (
      <div className="max-w-6xl mx-auto pb-12 px-4 md:px-0">
        <NewTaskStep3Owner
          t={t}
          step={step}
          owner={owner}
          setOwner={setOwner}
          onBack={handleBack}
          onNext={handleNext}
        />
      </div>
    );
  }

  // Step 4: Multi-perspective choice (A/B/C)
  if (step === 4) {
    return (
      <div className="max-w-6xl mx-auto pb-12 px-4 md:px-0">
        <NewTaskStep4Perspective
          t={t}
          step={step}
          selectedPerspective={selectedPerspective}
          setSelectedPerspective={setSelectedPerspective}
          reflectionReality={reflectionReality}
          setReflectionReality={setReflectionReality}
          reflectionDistance={reflectionDistance}
          setReflectionDistance={setReflectionDistance}
          reflectionValue={reflectionValue}
          setReflectionValue={setReflectionValue}
          onBack={handleBack}
          onNext={() => setStep(5)}
        />
      </div>
    );
  }

  // Step 5: Final message
  if (step === 5) {
    return (
      <div className="max-w-6xl mx-auto pb-12 px-4 md:px-0">
        <NewTaskStep5FinalMessage
          t={t}
          step={step}
          finalMessage={finalMessage}
          setFinalMessage={setFinalMessage}
          onBack={handleBack}
          onSubmit={handleSubmit}
        />
      </div>
    );
  }

  // Step 6: Result page
  if (step === 6) {
    const resultQuote = getQuoteByControlLevel(control);

    return (
      <div className="max-w-6xl mx-auto pb-12 px-4 md:px-0">
        <NewTaskResult
          t={t}
          polarity={polarity}
          control={control}
          categories={categories}
          worries={worries}
          resultQuote={resultQuote}
          navigate={navigate}
          routerNavigate={routerNavigate}
        />
      </div>
    );
  }

  return null;
}
