import React from 'react';
import { ArrowLeft } from 'lucide-react';

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
  nextLabel = "下一步",
  showNext = true,
  currentStep,
  totalSteps = 4
}) => {
  return (
    <div className="max-w-3xl mx-auto mt-4">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-text mb-6 transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>返回</span>
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
            {nextLabel}
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
          {option}
        </button>
      ))}
    </div>
  );
};

export const MultiSelectGrid: React.FC<MultiSelectGridProps> = ({ options, selected, onSelect }) => {
  const toggleOption = (option: string) => {
    if (selected.includes(option)) {
      onSelect(selected.filter(item => item !== option));
    } else {
      onSelect([...selected, option]);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {options.map((option) => (
        <button
          key={option}
          onClick={() => toggleOption(option)}
          className={`
            p-5 text-left rounded-lg border transition-all duration-200 flex items-center
            ${selected.includes(option)
              ? 'border-accent text-accent bg-accent/5 font-medium ring-1 ring-accent' 
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
          <span>{option}</span>
        </button>
      ))}
    </div>
  );
};

export const SelectionList: React.FC<SelectionGridProps> = ({ options, selected, onSelect }) => {
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
            {option}
          </button>
        ))}
      </div>
    );
  };