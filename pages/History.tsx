
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { Search, Trash2, AlertCircle, ChevronDown } from 'lucide-react';
import { TaskCategory, TaskWorry, ResponsibilityOwner } from '../types';

interface HistoryProps {
  navigate: (page: string) => void;
}

export const History: React.FC<HistoryProps> = () => {
  const { tasks, deleteTask, showToast } = useAppStore();
  const { t, i18n } = useTranslation();
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  // Filter States
  const [timeFilter, setTimeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [ownerFilter, setOwnerFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('newest');

  // Helper to identify standard categories
  const standardCategories = Object.values(TaskCategory).filter(c => c !== TaskCategory.Other) as string[];

  // Filtering Logic
  const filteredTasks = tasks.filter(task => {
    // 1. Search Text
    const categories = Array.isArray(task.category) ? task.category : [task.category];
    const worries = Array.isArray(task.worry) ? task.worry : [task.worry];
    const matchesSearch = 
      categories.some(cat => cat.includes(search)) || 
      worries.some(worry => worry.includes(search));
    if (!matchesSearch) return false;

    // 2. Time Filter
    if (timeFilter !== 'all') {
        const taskDate = new Date(task.date);
        const today = new Date();
        if (timeFilter === 'today') {
             if (taskDate.toDateString() !== today.toDateString()) return false;
        } else if (timeFilter === 'week') {
             const weekAgo = new Date();
             weekAgo.setDate(today.getDate() - 7);
             if (taskDate < weekAgo) return false;
        } else if (timeFilter === 'month') {
             const monthAgo = new Date();
             monthAgo.setMonth(today.getMonth() - 1);
             if (taskDate < monthAgo) return false;
        }
    }

    // 3. Category Filter
    if (categoryFilter !== 'all') {
        const taskCategories = Array.isArray(task.category) ? task.category : [task.category];
        if (categoryFilter === TaskCategory.Other) {
            // "Other" filter captures both explicit '其他' AND custom strings that aren't in standard list
            const hasNonStandard = taskCategories.some(cat => !standardCategories.includes(cat));
            if (!hasNonStandard) return false;
        } else {
            // Standard Exact Match - check if any category matches
            if (!taskCategories.includes(categoryFilter)) {
                return false;
            }
        }
    }

    // 4. Owner Filter (Task Type)
    if (ownerFilter !== 'all' && task.owner !== ownerFilter) {
        return false;
    }

    return true;
  }).sort((a, b) => {
      // 5. Sort Order
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case TaskCategory.Interview: return t('taskCategory.Interview');
      case TaskCategory.CareerPlanning: return t('taskCategory.CareerPlanning');
      case TaskCategory.SelfConfusion: return t('taskCategory.SelfConfusion');
      case TaskCategory.ProgressAnxiety: return t('taskCategory.ProgressAnxiety');
      case TaskCategory.ExpectationPressure: return t('taskCategory.ExpectationPressure');
      case TaskCategory.FinancialPressure: return t('taskCategory.FinancialPressure');
      case TaskCategory.MarketChange: return t('taskCategory.MarketChange');
      case TaskCategory.Other: return t('taskCategory.Other');
      default: return cat;
    }
  };

  const getWorryLabel = (w: string) => {
    switch (w) {
      case TaskWorry.Performance: return t('taskWorry.Performance');
      case TaskWorry.Rejection: return t('taskWorry.Rejection');
      case TaskWorry.OthersThoughts: return t('taskWorry.OthersThoughts');
      case TaskWorry.Pressure: return t('taskWorry.Pressure');
      case TaskWorry.Comparison: return t('taskWorry.Comparison');
      case TaskWorry.TimeStress: return t('taskWorry.TimeStress');
      case TaskWorry.Decision: return t('taskWorry.Decision');
      case TaskWorry.Uncertainty: return t('taskWorry.Uncertainty');
      case TaskWorry.Other: return t('taskWorry.Other');
      default: return w;
    }
  };

  const getOwnerLabel = (owner: string) => {
    switch (owner) {
      case ResponsibilityOwner.Mine: return t('owner.Mine');
      case ResponsibilityOwner.Theirs: return t('owner.Theirs');
      case ResponsibilityOwner.Shared: return t('owner.Shared');
      default: return owner;
    }
  };

  const getOwnerColor = (owner: string) => {
     if (owner === ResponsibilityOwner.Shared) return '#1ABC9C';
     if (owner === ResponsibilityOwner.Mine) return '#2C3E2C';
     return '#9CA3AF'; // Theirs
  };

  const confirmDelete = () => {
    if (deleteId) {
      deleteTask(deleteId);
      setDeleteId(null);
      showToast(t('history.toast.deleted'), 'success');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl md:rounded-3xl p-4 md:p-10 shadow-sm border border-gray-100 min-h-[600px]">
          <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-8 tracking-wide text-text">{t('history.title')}</h1>

          {/* Search Bar */}
          <div className="relative mb-4 md:mb-6">
            <Search className="absolute left-4 md:left-5 top-1/2 transform -translate-y-1/2 w-4 md:w-5 h-4 md:h-5 text-gray-300" />
            <input 
              type="text"
              placeholder={t('history.search.placeholder')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 md:pl-14 pr-4 py-2.5 md:py-4 rounded-lg md:rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700 placeholder-gray-300 shadow-sm text-sm md:text-base transition-shadow"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
             {/* Time Filter */}
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

             {/* Category Filter */}
             <div className="relative">
                 <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full py-2 md:py-3 px-2 md:px-4 pr-8 md:pr-10 border border-gray-200 rounded-lg md:rounded-xl text-left text-gray-600 text-xs md:text-sm bg-white hover:bg-gray-50 transition-colors shadow-sm appearance-none cursor-pointer focus:outline-none focus:border-primary"
                 >
                     <option value="all">{t('history.filter.category.all')}</option>
                     {Object.values(TaskCategory).map(cat => (
                         <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
                     ))}
                 </select>
                 <ChevronDown className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-3 md:w-4 h-3 md:h-4 text-gray-400 pointer-events-none" />
             </div>

             {/* Owner Filter */}
             <div className="relative">
                 <select
                    value={ownerFilter}
                    onChange={(e) => setOwnerFilter(e.target.value)}
                    className="w-full py-2 md:py-3 px-2 md:px-4 pr-8 md:pr-10 border border-gray-200 rounded-lg md:rounded-xl text-left text-gray-600 text-xs md:text-sm bg-white hover:bg-gray-50 transition-colors shadow-sm appearance-none cursor-pointer focus:outline-none focus:border-primary"
                 >
                     <option value="all">{t('history.filter.owner.all')}</option>
                     {Object.values(ResponsibilityOwner).map(owner => (
                         <option key={owner} value={owner}>{getOwnerLabel(owner)}</option>
                     ))}
                 </select>
                 <ChevronDown className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-3 md:w-4 h-3 md:h-4 text-gray-400 pointer-events-none" />
             </div>

             {/* Sort Order */}
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

          {/* Task List */}
          <div className="space-y-3 md:space-y-4">
            {filteredTasks.map((task, index) => (
              <div 
                key={task.id} 
                className="bg-[#F4F4F4] p-4 md:p-6 md:px-8 rounded-lg md:rounded-xl hover:shadow-md transition-all duration-300 group"
              >
                {/* Top Row: Tags + Date */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-3 md:mb-4 gap-2 md:gap-4">
                  <div className="flex items-center gap-2 md:gap-3 flex-wrap">
                    {Array.isArray(task.category) ? (
                      task.category.map((cat, idx) => (
                        <span key={idx} className="bg-[#E5E7EB] text-gray-700 px-3 md:px-4 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-medium tracking-wide">
                          {getCategoryLabel(cat)}
                        </span>
                      ))
                    ) : (
                      <span className="bg-[#E5E7EB] text-gray-700 px-3 md:px-4 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-medium tracking-wide">
                        {getCategoryLabel(task.category)}
                      </span>
                    )}
                    <span 
                        className="px-3 md:px-4 py-1 md:py-1.5 rounded-lg text-xs md:text-sm font-medium text-white tracking-wide"
                        style={{ backgroundColor: getOwnerColor(task.owner) }}
                    >
                      {getOwnerLabel(task.owner)}
                    </span>
                  </div>
                  <span className="text-xs md:text-sm text-gray-500 font-medium tracking-wide">
                    {formatDate(task.date)}
                  </span>
                </div>

                {/* Worry Row */}
                <div className="mb-3 md:mb-4">
                  <p className="text-xs md:text-sm text-gray-600 font-medium mb-1">{t('history.worry.label')}</p>
                  <p className="text-xs md:text-sm text-gray-700">
                    {Array.isArray(task.worry)
                      ? task.worry.map(getWorryLabel).join('、')
                      : getWorryLabel(task.worry as string)}
                  </p>
                </div>
                
                {/* Bottom Row: Control Bar + Trash */}
                <div className="flex items-center justify-between gap-3 md:gap-6">
                   <div className="flex items-center gap-2 md:gap-4 flex-1 min-w-0">
                      <span className="text-xs md:text-sm font-bold text-text whitespace-nowrap tracking-wide">{t('history.control.label')}</span>
                      <div className="flex-1 h-1.5 bg-gray-300/80 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-700 ease-out" 
                            style={{ width: `${task.controlLevel}%` }}
                          ></div>
                      </div>
                      <span className="text-xs md:text-sm font-bold text-text w-10 md:w-12 text-right">{task.controlLevel}%</span>
                   </div>
                   
                   <button 
                     onClick={() => setDeleteId(task.id)}
                     className="text-gray-400 hover:text-red-500 transition-colors p-2 md:p-2 rounded-full hover:bg-white/50 flex-shrink-0"
                   >
                     <Trash2 className="w-5 md:w-5 h-5 md:h-5" />
                   </button>
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
      </div>

      {/* Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm w-full transform transition-all scale-100">
               <div className="flex flex-col items-center text-center">
                   <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                       <AlertCircle className="w-6 h-6 text-red-500" />
                   </div>
                   <h3 className="text-xl font-bold text-text mb-2">{t('history.modal.title')}</h3>
                   <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                       {t('history.modal.message')}
                   </p>
                   <div className="flex w-full gap-3">
                       <button 
                           onClick={() => setDeleteId(null)}
                           className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors text-sm"
                       >
                           {t('history.modal.cancel')}
                       </button>
                       <button 
                           onClick={confirmDelete}
                           className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 text-sm"
                       >
                           {t('history.modal.confirm')}
                       </button>
                   </div>
               </div>
           </div>
        </div>
      )}
    </div>
  );
};
