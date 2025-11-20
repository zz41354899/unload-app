
import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Search, Trash2, AlertCircle, ChevronDown } from 'lucide-react';
import { TaskCategory, ResponsibilityOwner } from '../types';

interface HistoryProps {
  navigate: (page: string) => void;
}

export const History: React.FC<HistoryProps> = () => {
  const { tasks, deleteTask, showToast } = useAppStore();
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
    const matchesSearch = 
      task.category.includes(search) || 
      task.worry.includes(search);
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
        if (categoryFilter === TaskCategory.Other) {
            // "Other" filter captures both explicit '其他' AND custom strings that aren't in standard list
            const isStandard = standardCategories.includes(task.category);
            if (isStandard) return false;
        } else {
            // Standard Exact Match
            if (task.category !== categoryFilter) {
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
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
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
      showToast('紀錄已成功刪除', 'success');
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-3xl p-8 md:p-10 shadow-sm border border-gray-100 min-h-[600px]">
          <h1 className="text-2xl font-bold mb-8 tracking-wide text-text">歷史紀錄</h1>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input 
              type="text"
              placeholder="搜尋事件名稱或課題來源"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-14 pr-4 py-4 rounded-xl border border-gray-200 bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary text-gray-700 placeholder-gray-300 shadow-sm text-base transition-shadow"
            />
          </div>

          {/* Filters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
             {/* Time Filter */}
             <div className="relative">
                 <select
                    value={timeFilter}
                    onChange={(e) => setTimeFilter(e.target.value)}
                    className="w-full py-3 pl-4 pr-10 border border-gray-200 rounded-xl text-left text-gray-600 text-sm bg-white hover:bg-gray-50 transition-colors shadow-sm appearance-none cursor-pointer focus:outline-none focus:border-primary"
                 >
                     <option value="all">所有時間</option>
                     <option value="today">今天</option>
                     <option value="week">過去 7 天</option>
                     <option value="month">過去 30 天</option>
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
             </div>

             {/* Category Filter */}
             <div className="relative">
                 <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full py-3 pl-4 pr-10 border border-gray-200 rounded-xl text-left text-gray-600 text-sm bg-white hover:bg-gray-50 transition-colors shadow-sm appearance-none cursor-pointer focus:outline-none focus:border-primary"
                 >
                     <option value="all">所有分類</option>
                     {Object.values(TaskCategory).map(cat => (
                         <option key={cat} value={cat}>{cat}</option>
                     ))}
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
             </div>

             {/* Owner Filter */}
             <div className="relative">
                 <select
                    value={ownerFilter}
                    onChange={(e) => setOwnerFilter(e.target.value)}
                    className="w-full py-3 pl-4 pr-10 border border-gray-200 rounded-xl text-left text-gray-600 text-sm bg-white hover:bg-gray-50 transition-colors shadow-sm appearance-none cursor-pointer focus:outline-none focus:border-primary"
                 >
                     <option value="all">所有課題類型</option>
                     {Object.values(ResponsibilityOwner).map(owner => (
                         <option key={owner} value={owner}>{owner}</option>
                     ))}
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
             </div>

             {/* Sort Order */}
             <div className="relative">
                 <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full py-3 pl-4 pr-10 border border-gray-200 rounded-xl text-left text-gray-600 text-sm bg-white hover:bg-gray-50 transition-colors shadow-sm appearance-none cursor-pointer focus:outline-none focus:border-primary"
                 >
                     <option value="newest">由新到舊</option>
                     <option value="oldest">由舊到新</option>
                 </select>
                 <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
             </div>
          </div>

          {/* Task List */}
          <div className="space-y-4">
            {filteredTasks.map((task, index) => (
              <div 
                key={task.id} 
                className="bg-[#F4F4F4] p-6 md:px-8 md:py-6 rounded-xl hover:shadow-md transition-all duration-300 group"
              >
                {/* Top Row: Tags + Date */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
                  <div className="flex items-center gap-3">
                    <span className="bg-[#E5E7EB] text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium tracking-wide">
                      {task.category}
                    </span>
                    <span 
                        className="px-4 py-1.5 rounded-lg text-sm font-medium text-white tracking-wide"
                        style={{ backgroundColor: getOwnerColor(task.owner) }}
                    >
                      {task.owner}
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 font-medium tracking-wide">
                    {formatDate(task.date)}
                  </span>
                </div>
                
                {/* Bottom Row: Control Bar + Trash */}
                <div className="flex items-center justify-between gap-6">
                   <div className="flex items-center gap-4 flex-1">
                      <span className="text-sm font-bold text-text whitespace-nowrap tracking-wide">控制力</span>
                      <div className="flex-1 h-1.5 bg-gray-300/80 rounded-full overflow-hidden max-w-md">
                          <div 
                            className="h-full bg-primary rounded-full transition-all duration-700 ease-out" 
                            style={{ width: `${task.controlLevel}%` }}
                          ></div>
                      </div>
                      <span className="text-sm font-bold text-text w-12">{task.controlLevel}%</span>
                   </div>
                   
                   <button 
                     onClick={() => setDeleteId(task.id)}
                     className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-white/50"
                   >
                     <Trash2 className="w-5 h-5" />
                   </button>
                </div>
              </div>
            ))}

            {filteredTasks.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                        <Search className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-sm font-medium text-gray-500">沒有找到相關紀錄</p>
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
                            清除所有篩選
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
                   <h3 className="text-xl font-bold text-text mb-2">確定要刪除此紀錄？</h3>
                   <p className="text-gray-500 mb-8 text-sm leading-relaxed">
                       此動作將無法復原，您確定要繼續嗎？
                   </p>
                   <div className="flex w-full gap-3">
                       <button 
                           onClick={() => setDeleteId(null)}
                           className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors text-sm"
                       >
                           取消
                       </button>
                       <button 
                           onClick={confirmDelete}
                           className="flex-1 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors shadow-lg shadow-red-500/20 text-sm"
                       >
                           刪除
                       </button>
                   </div>
               </div>
           </div>
        </div>
      )}
    </div>
  );
};
