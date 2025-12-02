import React from 'react';
import { ChevronDown } from 'lucide-react';
import { TaskCategory, ResponsibilityOwner } from '../../types';

export interface HistoryFiltersProps {
  t: (key: string) => string;
  timeFilter: string;
  setTimeFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  ownerFilter: string;
  setOwnerFilter: (value: string) => void;
  sortOrder: string;
  setSortOrder: (value: string) => void;
  getCategoryLabel: (cat: string) => string;
  getOwnerLabel: (owner: string) => string;
}

export const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  t,
  timeFilter,
  setTimeFilter,
  categoryFilter,
  setCategoryFilter,
  ownerFilter,
  setOwnerFilter,
  sortOrder,
  setSortOrder,
  getCategoryLabel,
  getOwnerLabel,
}) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
    <div className="relative">
      <select
        value={timeFilter}
        onChange={(e) => setTimeFilter(e.target.value)}
        className="w-full py-2 md:py-3 px-2 md:px-4 pr-8 md:pr-10 border border-gray-200 rounded-lg md:rounded-xl text-left text-gray-600 text-xs md:text-sm bg-white hover:bg-gray-50 transition-colors shadow-sm appearance-none cursor-pointer focus:outline-none focus:border-primary"
      >
        <option value="all">{t('history.filter.time.all')}</option>
        <option value="today">{t('history.filter.time.today')}</option>
        <option value="week">{t('history.filter.time.week')}</option>
        <option value="month">{t('history.filter.time.month')}</option>
      </select>
      <ChevronDown className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-3 md:w-4 h-3 md:h-4 text-gray-400 pointer-events-none" />
    </div>

    <div className="relative">
      <select
        value={categoryFilter}
        onChange={(e) => setCategoryFilter(e.target.value)}
        className="w-full py-2 md:py-3 px-2 md:px-4 pr-8 md:pr-10 border border-gray-200 rounded-lg md:rounded-xl text-left text-gray-600 text-xs md:text-sm bg-white hover:bg-gray-50 transition-colors shadow-sm appearance-none cursor-pointer focus:outline-none focus:border-primary"
      >
        <option value="all">{t('history.filter.category.all')}</option>
        {Object.values(TaskCategory).map((cat) => (
          <option key={cat} value={cat}>
            {getCategoryLabel(cat)}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-3 md:w-4 h-3 md:h-4 text-gray-400 pointer-events-none" />
    </div>

    <div className="relative">
      <select
        value={ownerFilter}
        onChange={(e) => setOwnerFilter(e.target.value)}
        className="w-full py-2 md:py-3 px-2 md:px-4 pr-8 md:pr-10 border border-gray-200 rounded-lg md:rounded-xl text-left text-gray-600 text-xs md:text-sm bg-white hover:bg-gray-50 transition-colors shadow-sm appearance-none cursor-pointer focus:outline-none focus:border-primary"
      >
        <option value="all">{t('history.filter.owner.all')}</option>
        {Object.values(ResponsibilityOwner).map((owner) => (
          <option key={owner} value={owner}>
            {getOwnerLabel(owner)}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-3 md:w-4 h-3 md:h-4 text-gray-400 pointer-events-none" />
    </div>

    <div className="relative">
      <select
        value={sortOrder}
        onChange={(e) => setSortOrder(e.target.value)}
        className="w-full py-2 md:py-3 px-2 md:px-4 pr-8 md:pr-10 border border-gray-200 rounded-lg md:rounded-xl text-left text-gray-600 text-xs md:text-sm bg-white hover:bg-gray-50 transition-colors shadow-sm appearance-none cursor-pointer focus:outline-none focus:border-primary"
      >
        <option value="newest">{t('history.filter.sort.newest')}</option>
        <option value="oldest">{t('history.filter.sort.oldest')}</option>
      </select>
      <ChevronDown className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-3 md:w-4 h-3 md:h-4 text-gray-400 pointer-events-none" />
    </div>
  </div>
);
