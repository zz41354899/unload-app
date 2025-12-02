import React from 'react';
import { Search, Trash2 } from 'lucide-react';
import type { Task } from '../../types';

export interface HistoryTaskListProps {
  t: (key: string) => string;
  filteredTasks: Task[];
  formatDate: (isoString: string) => string;
  getCategoryLabel: (cat: string) => string;
  getOwnerLabel: (owner: string) => string;
  getOwnerColor: (owner: string) => string;
  getWorryTitle: () => string;
  getWorryLabel: (worry: string) => string;
  extractFinalMessage: (reflection?: string | null) => string;
  timeFilter: string;
  categoryFilter: string;
  ownerFilter: string;
  search: string;
  setTimeFilter: (value: string) => void;
  setCategoryFilter: (value: string) => void;
  setOwnerFilter: (value: string) => void;
  setSearch: (value: string) => void;
  setDeleteId: React.Dispatch<React.SetStateAction<string | null>>;
}

export const HistoryTaskList: React.FC<HistoryTaskListProps> = ({
  t,
  filteredTasks,
  formatDate,
  getCategoryLabel,
  getOwnerLabel,
  getOwnerColor,
  getWorryTitle,
  getWorryLabel,
  extractFinalMessage,
  timeFilter,
  categoryFilter,
  ownerFilter,
  search,
  setTimeFilter,
  setCategoryFilter,
  setOwnerFilter,
  setSearch,
  setDeleteId,
}) => (
  <div className="space-y-3 md:space-y-4">
    {filteredTasks.map((task) => (
      <div
        key={task.id}
        className="bg-[#F4F4F4] p-4 md:p-6 md:px-8 rounded-lg md:rounded-xl hover:shadow-md transition-all duration-300 group"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-4 gap-2 md:gap-4">
          <div className="flex items-center gap-2 md:gap-3 flex-wrap">
            {Array.isArray(task.category) ? (
              task.category.map((cat, idx) => (
                <span
                  key={idx}
                  className="bg-[#E5E7EB] text-gray-700 px-3 md:px-4 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-medium tracking-wide"
                >
                  {getCategoryLabel(cat)}
                </span>
              ))
            ) : (
              <span className="bg-[#E5E7EB] text-gray-700 px-3 md:px-4 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-medium tracking-wide">
                {getCategoryLabel(task.category as string)}
              </span>
            )}
            <span
              className="px-3 md:px-4 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-medium text-white tracking-wide"
              style={{ backgroundColor: getOwnerColor(task.owner) }}
            >
              {getOwnerLabel(task.owner as string)}
            </span>
          </div>
          <span className="text-xs md:text-sm text-gray-500 font-medium tracking-wide self-start md:self-center">
            {formatDate(task.date)}
          </span>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-3 md:gap-4">
            <div className="flex-1 min-w-0 space-y-2">
              <div className="space-y-1">
                <div className="text-xs font-medium text-gray-500">{getWorryTitle()}</div>
                <div className="text-xs md:text-sm text-gray-700">
                  {Array.isArray(task.worry)
                    ? task.worry.map((w) => getWorryLabel(w as string)).join('、')
                    : getWorryLabel(task.worry as string)}
                </div>
              </div>

              {task.reflection && (
                <div className="pt-2 border-t border-gray-200 space-y-1">
                  <div className="text-[11px] md:text-xs font-medium text-gray-500">
                    {t('history.finalMessage.label')}
                  </div>
                  <div className="text-xs md:text-sm text-gray-700 whitespace-pre-line leading-relaxed">
                    {extractFinalMessage(task.reflection) || t('history.finalMessage.placeholder')}
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setDeleteId(task.id)}
              className="text-gray-400 hover:text-red-500 transition-colors p-2 md:p-2 rounded-full hover:bg-white/50 flex-shrink-0 self-start"
            >
              <Trash2 className="w-5 md:w-5 h-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    ))}

    {filteredTasks.length === 0 && (
      <div className="flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Search className="w-8 h-8 text-gray-300" />
        </div>
        <p className="text-sm font-medium text-gray-500">{t('history.empty.title')}</p>
        {(timeFilter !== 'all' || categoryFilter !== 'all' || ownerFilter !== 'all' || search) && (
          <button
            type="button"
            onClick={() => {
              setTimeFilter('all');
              setCategoryFilter('all');
              setOwnerFilter('all');
              setSearch('');
            }}
            className="mt-4 text-primary text-sm hover:underline"
          >
            {t('history.empty.clearFilters')}
          </button>
        )}
      </div>
    )}
  </div>
);
