import React from 'react';
import { Calendar, BookOpen, TrendingUp } from 'lucide-react';
import { Task, ResponsibilityOwner } from '../../types';

export interface JournalStatsProps {
  t: (key: string, options?: any) => string;
  todayTasks: Task[];
  weekStats: {
    total: number;
    mine: number;
    theirs: number;
    shared: number;
  };
  monthStats: {
    total: number;
    mine: number;
    theirs: number;
    shared: number;
  };
}

export const JournalStats: React.FC<JournalStatsProps> = ({
  t,
  todayTasks,
  weekStats,
  monthStats,
}) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
    {/* Today's Summary */}
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <Calendar className="w-4 md:w-5 h-4 md:h-5 text-primary" />
        <h3 className="font-bold text-sm md:text-base">{t('journal.stats.today.title')}</h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs md:text-sm">{t('journal.stats.today.total')}</span>
          <span className="text-xl md:text-2xl font-bold text-text">{todayTasks.length}</span>
        </div>
        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>{t('journal.stats.today.mine')}</span>
            <span>{todayTasks.filter((t) => t.owner === ResponsibilityOwner.Mine).length}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>{t('journal.stats.today.shared')}</span>
            <span>{todayTasks.filter((t) => t.owner === ResponsibilityOwner.Shared).length}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{t('journal.stats.today.theirs')}</span>
            <span>{todayTasks.filter((t) => t.owner === ResponsibilityOwner.Theirs).length}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Week Stats */}
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-primary" />
        <h3 className="font-bold text-sm md:text-base">
          {t('journal.stats.week.title', { defaultValue: '本週思維探索趨勢' })}
        </h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs md:text-sm">
            {t('journal.stats.week.total', { defaultValue: '本週記錄數' })}
          </span>
          <span className="text-xl md:text-2xl font-bold text-text">{weekStats.total}</span>
        </div>
        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>{t('journal.stats.week.mine', { defaultValue: '聚焦於對自己的察覺' })}</span>
            <span>{weekStats.mine}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>{t('journal.stats.week.shared', { defaultValue: '聚焦於對彼此互動的察覺' })}</span>
            <span>{weekStats.shared}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{t('journal.stats.week.theirs', { defaultValue: '聚焦於對他人狀態的察覺' })}</span>
            <span>{weekStats.theirs}</span>
          </div>
        </div>
      </div>
    </div>

    {/* Month Stats */}
    <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4">
        <BookOpen className="w-4 md:w-5 h-4 md:h-5 text-primary" />
        <h3 className="font-bold text-sm md:text-base">
          {t('journal.stats.month.title', { defaultValue: '本月情緒焦點' })}
        </h3>
      </div>
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-xs md:text-sm">
            {t('journal.stats.month.total', { defaultValue: '本月記錄數' })}
          </span>
          <span className="text-xl md:text-2xl font-bold text-text">{monthStats.total}</span>
        </div>
        <div className="pt-3 border-t border-gray-100">
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>{t('journal.stats.month.mine', { defaultValue: '聚焦於對自己的察覺' })}</span>
            <span>{monthStats.mine}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mb-2">
            <span>{t('journal.stats.month.shared', { defaultValue: '聚焦於對彼此互動的察覺' })}</span>
            <span>{monthStats.shared}</span>
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>{t('journal.stats.month.theirs', { defaultValue: '聚焦於對他人狀態的察覺' })}</span>
            <span>{monthStats.theirs}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);
