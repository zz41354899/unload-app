import React from 'react';
import { Sparkles } from 'lucide-react';

interface DailyCueProps {
  stageTitle?: string | null;
  stageDescription: string;
  practiceName: string;
  actionSentence: string;
  anchorQuote: string;
}

export interface JournalHeaderProps {
  t: (key: string, options?: any) => string;
  i18n: { language: string };
  selectedDate: string;
  setSelectedDate: (value: string) => void;
  dailyCue: DailyCueProps;
}

export const JournalHeader: React.FC<JournalHeaderProps> = ({
  t,
  i18n,
  selectedDate,
  setSelectedDate,
  dailyCue,
}) => (
  <div className="bg-white rounded-2xl p-6 md:p-12 shadow-sm border border-gray-100">
    <div className="mb-6">
      <h1 className="text-xl md:text-2xl font-bold mb-2">{t('journal.title')}</h1>
      <p className="text-gray-600 text-sm md:text-base">{t('journal.subtitle')}</p>
    </div>

    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => setSelectedDate(e.target.value)}
        className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
      />
      <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
        {new Date(selectedDate).toLocaleDateString(i18n.language, {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </span>
    </div>

    <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl p-4 md:p-6 border border-primary/20">
      <div className="flex items-start gap-3">
        <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-primary shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-primary/60 font-medium mb-1">{t('journal.dailyQuote.title')}</p>
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
  </div>
);
