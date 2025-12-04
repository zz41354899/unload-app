import React from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';
import { TaskPolarity } from '../../types';

interface NewTaskResultProps {
  t: (key: string, options?: any) => string;
  polarity: TaskPolarity;
  control: number;
  categories: string[];
  worries: string[];
  resultQuote: string;
  navigate: (page: string) => void;
  routerNavigate: (path: string) => void;
}

export const NewTaskResult: React.FC<NewTaskResultProps> = ({
  t,
  polarity,
  control,
  categories,
  worries,
  resultQuote,
  navigate,
  routerNavigate,
}) => {
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

    const categoryStr = categoryLabels.filter(Boolean).join('、');
    const worryStr = worryLabels.filter(Boolean).join('、');

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

  const feedback = getResultFeedback();

  return (
    <div className="max-w-2xl w-full mx-auto">
      <div className="bg-white rounded-2xl md:rounded-3xl p-6 md:p-12 shadow-xl border border-gray-100">
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl" />
              <CheckCircle className="w-16 md:w-20 h-16 md:h-20 text-primary relative" />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-center mb-1 md:mb-2 text-text">
            {t('newTask.result.title')}
          </h1>
          <p className="text-center text-gray-500 text-sm md:text-base mb-6 md:mb-12">
            {t('newTask.result.subtitle')}
          </p>

          <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-xl md:rounded-2xl p-4 md:p-8 mb-6 md:mb-4 border border-primary/10">
            <p className="text-center text-base md:text-lg leading-relaxed text-text font-medium mb-3">
              "{resultQuote}"
            </p>
            <p className="text-center text-xs md:text-sm text-gray-600">
              {t('newTask.closingQuote')}
            </p>
          </div>

          <div className="mb-6 md:mb-8 text-center text-xs md:text-sm text-gray-500">
            {feedback}
          </div>

          <div className="mb-8 md:mb-10 text-center text-xs md:text-sm text-gray-500">
            {t('newTask.closingMessage')}
          </div>

          <div className="mb-8 md:mb-10 text-center text-[11px] md:text-xs text-gray-400">
            <span>{t('newTask.result.surveyIntro')}</span>
            {' '}
            <a
              href="https://forms.gle/WwKZqVow5mav8R9W6"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 text-primary hover:text-primary/80"
            >
              {t('newTask.result.surveyLinkLabel')}
            </a>
          </div>

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
  );
};
