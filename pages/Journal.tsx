import React, { useState } from 'react';
import { useAppStore } from '../store';
import { Task, ResponsibilityOwner } from '../types';
import { Calendar, BookOpen, Lightbulb, TrendingUp, ChevronDown, Edit2, Save, X, Sparkles } from 'lucide-react';
import { getDailyQuote } from '../lib/quotes';

interface JournalProps {
  navigate: (page: string) => void;
}

export const Journal: React.FC<JournalProps> = ({ navigate }) => {
  const { tasks, updateTask, showToast } = useAppStore();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingReflection, setEditingReflection] = useState<string>('');
  const [filterOwner, setFilterOwner] = useState<string | null>(null);

  // 獲取選定日期的任務
  const getTasksByDate = (dateStr: string) => {
    return tasks.filter(t => t.date.split('T')[0] === dateStr);
  };

  // 獲取日期範圍內的任務統計
  const getDateRangeStats = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const rangedTasks = tasks.filter(t => {
      const taskDate = new Date(t.date);
      return taskDate >= start && taskDate <= end;
    });

    return {
      total: rangedTasks.length,
      mine: rangedTasks.filter(t => t.owner === ResponsibilityOwner.Mine).length,
      theirs: rangedTasks.filter(t => t.owner === ResponsibilityOwner.Theirs).length,
      shared: rangedTasks.filter(t => t.owner === ResponsibilityOwner.Shared).length,
      avgControl: rangedTasks.length > 0 
        ? Math.round(rangedTasks.reduce((sum, t) => sum + t.controlLevel, 0) / rangedTasks.length)
        : 0
    };
  };

  // 獲取本週統計
  const getWeekStats = () => {
    const today = new Date(selectedDate);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - today.getDay());
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    
    return getDateRangeStats(
      weekStart.toISOString().split('T')[0],
      weekEnd.toISOString().split('T')[0]
    );
  };

  // 獲取本月統計
  const getMonthStats = () => {
    const today = new Date(selectedDate);
    const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    
    return getDateRangeStats(
      monthStart.toISOString().split('T')[0],
      monthEnd.toISOString().split('T')[0]
    );
  };

  const todayTasks = getTasksByDate(selectedDate);
  const weekStats = getWeekStats();
  const monthStats = getMonthStats();

  const filteredTasks = filterOwner 
    ? todayTasks.filter(t => t.owner === filterOwner)
    : todayTasks;

  // 計算主要困擾
  const getTopWorries = () => {
    const worryCounts: Record<string, number> = {};
    todayTasks.forEach(t => {
      const worries = Array.isArray(t.worry) ? t.worry : [t.worry];
      worries.forEach(w => {
        worryCounts[w] = (worryCounts[w] || 0) + 1;
      });
    });
    return Object.entries(worryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  const topWorries = getTopWorries();

  const handleSaveJournal = (taskId: string) => {
    updateTask(taskId, {
      reflection: editingReflection
    });
    showToast('日記已保存');
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-12 px-4 md:px-0">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 md:p-12 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold mb-2">反思日記</h1>
          <p className="text-gray-600 text-sm md:text-base">記錄每日的課題與反思，追蹤自己的成長</p>
        </div>

        {/* Date Picker */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 mb-6">
          <input 
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
          />
          <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
            {new Date(selectedDate).toLocaleDateString('zh-TW', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </span>
        </div>

        {/* Daily Quote */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl p-4 md:p-6 border border-primary/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm text-primary/60 font-medium mb-1">今日語錄</p>
              <p className="text-sm md:text-base leading-relaxed text-text font-medium">
                "{getDailyQuote()}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {/* Today's Summary */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 md:w-5 h-4 md:h-5 text-primary" />
            <h3 className="font-bold text-sm md:text-base">今日摘要</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs md:text-sm">課題總數</span>
              <span className="text-xl md:text-2xl font-bold text-text">{todayTasks.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs md:text-sm">平均掌控力</span>
              <span className="text-xl md:text-2xl font-bold text-accent">
                {todayTasks.length > 0 
                  ? Math.round(todayTasks.reduce((sum, t) => sum + t.controlLevel, 0) / todayTasks.length)
                  : 0}%
              </span>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>我的課題</span>
                <span>{todayTasks.filter(t => t.owner === ResponsibilityOwner.Mine).length}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>共同課題</span>
                <span>{todayTasks.filter(t => t.owner === ResponsibilityOwner.Shared).length}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>他人課題</span>
                <span>{todayTasks.filter(t => t.owner === ResponsibilityOwner.Theirs).length}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Week Stats */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 md:w-5 h-4 md:h-5 text-primary" />
            <h3 className="font-bold text-sm md:text-base">本週統計</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs md:text-sm">課題總數</span>
              <span className="text-xl md:text-2xl font-bold text-text">{weekStats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs md:text-sm">平均掌控力</span>
              <span className="text-xl md:text-2xl font-bold text-accent">{weekStats.avgControl}%</span>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>我的課題</span>
                <span>{weekStats.mine}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>共同課題</span>
                <span>{weekStats.shared}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>他人課題</span>
                <span>{weekStats.theirs}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Month Stats */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-4 md:w-5 h-4 md:h-5 text-primary" />
            <h3 className="font-bold text-sm md:text-base">本月統計</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs md:text-sm">課題總數</span>
              <span className="text-xl md:text-2xl font-bold text-text">{monthStats.total}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-xs md:text-sm">平均掌控力</span>
              <span className="text-xl md:text-2xl font-bold text-accent">{monthStats.avgControl}%</span>
            </div>
            <div className="pt-3 border-t border-gray-100">
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>我的課題</span>
                <span>{monthStats.mine}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>共同課題</span>
                <span>{monthStats.shared}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>他人課題</span>
                <span>{monthStats.theirs}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Worries */}
      {topWorries.length > 0 && (
        <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Lightbulb className="w-4 md:w-5 h-4 md:h-5 text-primary" />
            <h3 className="font-bold text-base md:text-lg">今日主要困擾</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {topWorries.map(([worry, count], idx) => (
              <div key={worry} className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-3 md:p-4 border border-primary/10">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs md:text-sm font-bold text-primary shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-text mb-1 text-sm">{worry}</div>
                    <div className="text-xs text-gray-500">{count} 個課題</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Tasks with Journal */}
      <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <h3 className="font-bold text-base md:text-lg">今日課題詳情</h3>
          {todayTasks.length > 0 && (
            <div className="relative w-full sm:w-auto">
              <select 
                value={filterOwner || ''}
                onChange={(e) => setFilterOwner(e.target.value || null)}
                className="appearance-none w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-xs md:text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">全部課題</option>
                <option value={ResponsibilityOwner.Mine}>我的課題</option>
                <option value={ResponsibilityOwner.Shared}>共同課題</option>
                <option value={ResponsibilityOwner.Theirs}>他人課題</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          )}
        </div>

        {filteredTasks.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="border border-gray-100 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow">
                {/* Task Header */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-text mb-1 text-sm md:text-base break-words">
                      {Array.isArray(task.category) ? task.category.join(', ') : task.category}
                    </div>
                    <div className="text-xs md:text-sm text-gray-500 mb-2 break-words">
                      {Array.isArray(task.worry) ? task.worry.join(', ') : task.worry}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 md:gap-4 text-xs text-gray-500">
                      <span className="whitespace-nowrap">掌控力：{task.controlLevel}%</span>
                      <span className="px-2 py-1 bg-gray-100 rounded-full whitespace-nowrap">
                        {task.owner === ResponsibilityOwner.Mine ? '我的課題' : 
                         task.owner === ResponsibilityOwner.Shared ? '共同課題' : '他人課題'}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      if (editingId === task.id) {
                        setEditingId(null);
                      } else {
                        setEditingId(task.id);
                        setEditingReflection(task.reflection || '');
                      }
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors shrink-0"
                  >
                    {editingId === task.id ? (
                      <X className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    ) : (
                      <Edit2 className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                    )}
                  </button>
                </div>

                {/* Journal Content */}
                {editingId === task.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">反思筆記</label>
                      <textarea
                        value={editingReflection}
                        onChange={(e) => setEditingReflection(e.target.value)}
                        placeholder="記錄你的反思與學習..."
                        className="w-full p-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                        rows={3}
                      />
                    </div>
                    <button
                      onClick={() => handleSaveJournal(task.id)}
                      className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-[#1e2b1e] transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      保存日記
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3 pt-4 border-t border-gray-100">
                    {task.reflection && (
                      <div>
                        <div className="text-xs font-medium text-gray-500 mb-1">反思筆記</div>
                        <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{task.reflection}</div>
                      </div>
                    )}
                    {!task.reflection && (
                      <div className="text-sm text-gray-400 italic">尚無日記內容</div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm">{selectedDate} 尚無課題記錄</p>
          </div>
        )}
      </div>

    </div>
  );
};
