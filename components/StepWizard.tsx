import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft } from 'lucide-react';
import { TaskCategory, TaskWorry, ResponsibilityOwner } from '../types';

interface WizardLayoutProps {
  title: string;
  subtitle: string;
  onBack: () => void;
  children: React.ReactNode;
  onNext?: () => void;
  nextDisabled?: boolean;
  nextLabel?: string;
  showNext?: boolean;
  currentStep: number;
  totalSteps?: number;
}

export const WizardLayout: React.FC<WizardLayoutProps> = ({
  title,
  subtitle,
  onBack,
  children,
  onNext,
  nextDisabled,
  nextLabel,
  showNext = true,
  currentStep,
  totalSteps = 4
}) => {
  const { t } = useTranslation();
  const resolvedNextLabel = nextLabel ?? t('wizard.next');

  return (
    <div className="max-w-3xl mx-auto mt-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-text mb-6 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>{t('wizard.back')}</span>
      </button>

      {/* Progress Bar */}
      <div className="w-full h-1.5 flex gap-3 mb-10">
         {Array.from({ length: totalSteps }).map((_, index) => (
             <div 
                key={index} 
                className={`h-full flex-1 rounded-full transition-colors duration-300 ${
                    index < currentStep ? 'bg-primary' : 'bg-gray-200'
                }`}
             ></div>
         ))}
      </div>

      <h1 className="text-2xl md:text-3xl font-bold mb-8">{title}</h1>
      <p className="text-base md:text-lg text-gray-600 mb-8">{subtitle}</p>

      <div className="mb-12">
        {children}
      </div>

      {showNext && (
        <button
            onClick={onNext}
            disabled={nextDisabled}
            className="bg-primary text-white px-10 py-3 rounded-full font-medium hover:bg-[#1e2b1e] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
            {resolvedNextLabel}
        </button>
      )}
    </div>
  );
};

interface SelectionGridProps {
  options: string[];
  selected: string | null;
  onSelect: (value: string) => void;
}

interface MultiSelectGridProps {
  options: string[];
  selected: string[];
  onSelect: (values: string[]) => void;
}

export const SelectionGrid: React.FC<SelectionGridProps> = ({ options, selected, onSelect }) => {
  const { t } = useTranslation();

  const getLabel = (option: string) => {
    switch (option) {
      case TaskCategory.Interview: return t('taskCategory.Interview');
      case TaskCategory.CareerPlanning: return t('taskCategory.CareerPlanning');
      case TaskCategory.SelfConfusion: return t('taskCategory.SelfConfusion');
      case TaskCategory.ProgressAnxiety: return t('taskCategory.ProgressAnxiety');
      case TaskCategory.ExpectationPressure: return t('taskCategory.ExpectationPressure');
      case TaskCategory.FinancialPressure: return t('taskCategory.FinancialPressure');
      case TaskCategory.MarketChange: return t('taskCategory.MarketChange');
      case TaskCategory.Other: return t('taskCategory.Other');
      case TaskWorry.Performance: return t('taskWorry.Performance');
      case TaskWorry.Rejection: return t('taskWorry.Rejection');
      case TaskWorry.OthersThoughts: return t('taskWorry.OthersThoughts');
      case TaskWorry.Pressure: return t('taskWorry.Pressure');
      case TaskWorry.Comparison: return t('taskWorry.Comparison');
      case TaskWorry.TimeStress: return t('taskWorry.TimeStress');
      case TaskWorry.Decision: return t('taskWorry.Decision');
      case TaskWorry.Uncertainty: return t('taskWorry.Uncertainty');
      case TaskWorry.Other: return t('taskWorry.Other');
      case ResponsibilityOwner.Mine: return t('owner.Mine');
      case ResponsibilityOwner.Theirs: return t('owner.Theirs');
      case ResponsibilityOwner.Shared: return t('owner.Shared');
      default: return option;
    }
  };

  const getHint = (option: string) => {
    switch (option) {
      case TaskCategory.Interview: return t('taskCategory.Interview_hint');
      case TaskCategory.CareerPlanning: return t('taskCategory.CareerPlanning_hint');
      case TaskCategory.SelfConfusion: return t('taskCategory.SelfConfusion_hint');
      case TaskCategory.ProgressAnxiety: return t('taskCategory.ProgressAnxiety_hint');
      case TaskCategory.ExpectationPressure: return t('taskCategory.ExpectationPressure_hint');
      case TaskCategory.FinancialPressure: return t('taskCategory.FinancialPressure_hint');
      case TaskCategory.MarketChange: return t('taskCategory.MarketChange_hint');
      case TaskCategory.Other: return t('taskCategory.Other_hint');
      default: return '';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`
            p-5 text-left rounded-lg border transition-all duration-200
            ${selected === option 
              ? 'border-accent text-accent bg-accent/5 font-medium ring-1 ring-accent' 
              : 'border-gray-200 hover:border-gray-300 bg-white text-gray-600'}
          `}
        >
          <div className="flex flex-col">
            <span>{getLabel(option)}</span>
            {getHint(option) && (
              <span className="mt-1 text-xs text-gray-400">
                {getHint(option)}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export const MultiSelectGrid: React.FC<MultiSelectGridProps> = ({ options, selected, onSelect }) => {
  const MAX_SELECTIONS = 2;
  const { t } = useTranslation();

  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onSelect(selected.filter(item => item !== option));
    } else {
      if (selected.length < MAX_SELECTIONS) {
        onSelect([...selected, option]);
      }
    }
  };

  const getLabel = (option: string) => {
    switch (option) {
      case TaskCategory.Interview: return t('taskCategory.Interview');
      case TaskCategory.CareerPlanning: return t('taskCategory.CareerPlanning');
      case TaskCategory.SelfConfusion: return t('taskCategory.SelfConfusion');
      case TaskCategory.ProgressAnxiety: return t('taskCategory.ProgressAnxiety');
      case TaskCategory.ExpectationPressure: return t('taskCategory.ExpectationPressure');
      case TaskCategory.FinancialPressure: return t('taskCategory.FinancialPressure');
      case TaskCategory.MarketChange: return t('taskCategory.MarketChange');
      case TaskCategory.Other: return t('taskCategory.Other');
      case TaskWorry.Performance: return t('taskWorry.Performance');
      case TaskWorry.Rejection: return t('taskWorry.Rejection');
      case TaskWorry.OthersThoughts: return t('taskWorry.OthersThoughts');
      case TaskWorry.Pressure: return t('taskWorry.Pressure');
      case TaskWorry.Comparison: return t('taskWorry.Comparison');
      case TaskWorry.TimeStress: return t('taskWorry.TimeStress');
      case TaskWorry.Decision: return t('taskWorry.Decision');
      case TaskWorry.Uncertainty: return t('taskWorry.Uncertainty');
      case TaskWorry.Other: return t('taskWorry.Other');
      case ResponsibilityOwner.Mine: return t('owner.Mine');
      case ResponsibilityOwner.Theirs: return t('owner.Theirs');
      case ResponsibilityOwner.Shared: return t('owner.Shared');
      default: return option;
    }
  };

  const getHint = (option: string) => {
    switch (option) {
      // 類別（Step1）提示
      case TaskCategory.Interview: return t('taskCategory.Interview_hint');
      case TaskCategory.CareerPlanning: return t('taskCategory.CareerPlanning_hint');
      case TaskCategory.SelfConfusion: return t('taskCategory.SelfConfusion_hint');
      case TaskCategory.ProgressAnxiety: return t('taskCategory.ProgressAnxiety_hint');
      case TaskCategory.ExpectationPressure: return t('taskCategory.ExpectationPressure_hint');
      case TaskCategory.FinancialPressure: return t('taskCategory.FinancialPressure_hint');
      case TaskCategory.MarketChange: return t('taskCategory.MarketChange_hint');
      case TaskCategory.Other: return t('taskCategory.Other_hint');
      // 擔憂（Step2）提示
      case TaskWorry.Performance: return t('taskWorry.Performance_hint');
      case TaskWorry.Rejection: return t('taskWorry.Rejection_hint');
      case TaskWorry.OthersThoughts: return t('taskWorry.OthersThoughts_hint');
      case TaskWorry.Pressure: return t('taskWorry.Pressure_hint');
      case TaskWorry.Comparison: return t('taskWorry.Comparison_hint');
      case TaskWorry.TimeStress: return t('taskWorry.TimeStress_hint');
      case TaskWorry.Decision: return t('taskWorry.Decision_hint');
      case TaskWorry.Uncertainty: return t('taskWorry.Uncertainty_hint');
      case TaskWorry.Other: return t('taskWorry.Other_hint');
      default: return '';
    }
  };

  return (
    <div>
      {selected.length >= MAX_SELECTIONS && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 flex gap-2">
          <span className="text-sm text-amber-800">{t('wizard.maxSelections', { count: MAX_SELECTIONS })}</span>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => toggleOption(option)}
            disabled={!selected.includes(option) && selected.length >= MAX_SELECTIONS}
            className={`
              p-5 text-left rounded-lg border transition-all duration-200 flex items-center
              ${selected.includes(option)
                ? 'border-accent text-accent bg-accent/5 font-medium ring-1 ring-accent' 
                : selected.length >= MAX_SELECTIONS
                ? 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed opacity-50'
                : 'border-gray-200 hover:border-gray-300 bg-white text-gray-600'}
            `}
          >
            <div className={`w-5 h-5 rounded border-2 mr-3 flex items-center justify-center flex-shrink-0 transition-all ${
              selected.includes(option)
                ? 'border-accent bg-accent'
                : 'border-gray-300'
            }`}>
              {selected.includes(option) && (
                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              )}
            </div>
            <div className="flex flex-col">
              <span>{getLabel(option)}</span>
              {getHint(option) && (
                <span className="mt-1 text-xs text-gray-400">
                  {getHint(option)}
                </span>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export const SelectionList: React.FC<SelectionGridProps> = ({ options, selected, onSelect }) => {
  const { t } = useTranslation();
  const getLabel = (option: string) => {
    switch (option) {
      case ResponsibilityOwner.Mine: return t('owner.Mine');
      case ResponsibilityOwner.Theirs: return t('owner.Theirs');
      case ResponsibilityOwner.Shared: return t('owner.Shared');
      default: return option;
    }
  };

  const getHint = (option: string) => {
    switch (option) {
      case ResponsibilityOwner.Mine: return t('owner.Mine_hint');
      case ResponsibilityOwner.Theirs: return t('owner.Theirs_hint');
      case ResponsibilityOwner.Shared: return t('owner.Shared_hint');
      default: return '';
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onSelect(option)}
          className={`
            p-5 text-left rounded-lg border transition-all duration-200 w-full
            ${selected === option 
              ? 'border-accent text-accent bg-accent/5 font-medium ring-1 ring-accent' 
              : 'border-gray-200 hover:border-gray-300 bg-white text-gray-600'}
          `}
        >
          <div className="flex flex-col">
            <span>{getLabel(option)}</span>
            {getHint(option) && (
              <span className="mt-1 text-xs text-gray-400">
                {getHint(option)}
              </span>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};