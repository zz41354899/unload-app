import React from 'react';
import { Sparkles } from 'lucide-react';

interface DailyCueProps {
  stageTitle?: string | null;
  stageDescription: string;
  practiceName: string;
  actionSentence: string;
  anchorQuote: string;
}

interface DashboardDailyCueProps {
  t: (key: string, options?: any) => string;
  dailyCue: DailyCueProps;
}

export const DashboardDailyCue: React.FC<DashboardDailyCueProps> = ({ t, dailyCue }) => (
  <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-3 md:p-8 border border-primary/20 shadow-sm">
    <div className="flex items-start gap-3 md:gap-4">
      <Sparkles className="w-5 md:w-6 h-5 md:h-6 text-primary shrink-0 mt-0.5 md:mt-1" />
      <div className="flex-1 min-w-0">
        <p className="text-xs md:text-sm text-primary/60 font-medium mb-1 md:mb-2">{t('journal.dailyQuote.title')}</p>
        <div className="space-y-1 md:space-y-2">
          <p className="text-xs md:text-sm text-gray-600 font-medium">
            {dailyCue.stageTitle && (
              <span>
                {t('journal.dailyQuote.stagePrefix')}
                <span className="font-semibold text-text">{dailyCue.stageTitle}</span>
              </span>
            )}
          </p>
          <p className="text-sm md:text-base leading-relaxed text-text">
            {dailyCue.stageDescription}
          </p>
          <p className="text-xs md:text-sm text-gray-700">
            {t('journal.dailyQuote.practicePrefix')}
            <span className="font-semibold">{dailyCue.practiceName}</span>
            <span> — {dailyCue.actionSentence}</span>
          </p>
          <p className="text-[11px] md:text-xs text-gray-500">
            {dailyCue.anchorQuote}
          </p>
        </div>
      </div>
    </div>
  </div>
);
