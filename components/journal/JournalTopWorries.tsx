import React from 'react';
import { Lightbulb } from 'lucide-react';

interface TopWorryItem {
  worry: string;
  count: number;
  isPositive: boolean;
}

export interface JournalTopWorriesProps {
  t: (key: string, options?: any) => string;
  topWorries: TopWorryItem[];
  getWorryLabel: (w: string, usePositive?: boolean) => string;
}

export const JournalTopWorries: React.FC<JournalTopWorriesProps> = ({
  t,
  topWorries,
  getWorryLabel,
}) => {
  if (topWorries.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Lightbulb className="w-4 md:w-5 h-4 md:h-5 text-primary" />
        <h3 className="font-bold text-base md:text-lg">
          {t('journal.topWorries.title.all')}
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
        {topWorries.map((item, idx) => (
          <div
            key={`${item.worry}-${item.isPositive ? 'pos' : 'neg'}`}
            className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-3 md:p-4 border border-primary/10"
          >
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs md:text-sm font-bold text-primary shrink-0">
                {idx + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-text mb-1 text-sm">
                  {getWorryLabel(item.worry, item.isPositive)}
                </div>
                <div className="text-xs text-gray-500">
                  {t('journal.topWorries.countLabel', { count: item.count })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
