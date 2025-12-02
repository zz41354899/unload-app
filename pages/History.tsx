
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { Search } from 'lucide-react';
import { TaskCategory, TaskWorry, ResponsibilityOwner, TaskPolarity } from '../types';
import { HistoryFilters } from '../components/history/HistoryFilters';
import { HistoryTaskList } from '../components/history/HistoryTaskList';
import { HistoryDeleteModal } from '../components/history/HistoryDeleteModal';

export const History: React.FC = () => {
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
  const standardCategories = useMemo(
    () => Object.values(TaskCategory).filter((c) => c !== TaskCategory.Other) as string[],
    [],
  );

  // Filtering Logic
  const filteredTasks = useMemo(() => tasks.filter(task => {
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
    // 6. Sort Order
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  }), [tasks, search, timeFilter, categoryFilter, ownerFilter, sortOrder, standardCategories]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleDateString(i18n.language, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  const getCategoryLabel = (cat: string) => {
    const keyFor = (suffix: string) => {
      const defaultKey = `taskCategory.${suffix}`;
      const defaultLabel = t(defaultKey);
      return defaultLabel !== defaultKey ? defaultLabel : suffix;
    };

    switch (cat) {
      case TaskCategory.Interview: return keyFor('Interview');
      case TaskCategory.CareerPlanning: return keyFor('CareerPlanning');
      case TaskCategory.SelfConfusion: return keyFor('SelfConfusion');
      case TaskCategory.ProgressAnxiety: return keyFor('ProgressAnxiety');
      case TaskCategory.ExpectationPressure: return keyFor('ExpectationPressure');
      case TaskCategory.FinancialPressure: return keyFor('FinancialPressure');
      case TaskCategory.MarketChange: return keyFor('MarketChange');
      case TaskCategory.Other: return keyFor('Other');
      default: return cat;
    }
  };

  const getWorryLabel = (w: string) => {
    const keyFor = (suffix: string) => {
      const defaultKey = `taskWorry.${suffix}`;
      const defaultLabel = t(defaultKey);
      return defaultLabel !== defaultKey ? defaultLabel : suffix;
    };

    switch (w) {
      case TaskWorry.Performance: return keyFor('Performance');
      case TaskWorry.Rejection: return keyFor('Rejection');
      case TaskWorry.OthersThoughts: return keyFor('OthersThoughts');
      case TaskWorry.Pressure: return keyFor('Pressure');
      case TaskWorry.Comparison: return keyFor('Comparison');
      case TaskWorry.TimeStress: return keyFor('TimeStress');
      case TaskWorry.Decision: return keyFor('Decision');
      case TaskWorry.Uncertainty: return keyFor('Uncertainty');
      case TaskWorry.Other: return keyFor('Other');
      default: return w;
    }
  };

  const getWorryTitle = () => {
    return t('history.worry.label');
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

  const extractFinalMessage = (reflection?: string | null) => {
    if (!reflection) return '';

    const blocks = reflection.split('\n\n');
    const finalLabel = t('newTask.finalMessage.label');

    for (const block of blocks) {
      const lines = block.split('\n');
      if (!lines.length) continue;
      const [title, ...rest] = lines;
      if (title === finalLabel) {
        return rest.join('\n').trim();
      }
    }

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

        <HistoryFilters
          t={t}
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          categoryFilter={categoryFilter}
          setCategoryFilter={setCategoryFilter}
          ownerFilter={ownerFilter}
          setOwnerFilter={setOwnerFilter}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          getCategoryLabel={getCategoryLabel}
          getOwnerLabel={getOwnerLabel}
        />

        <HistoryTaskList
          t={t}
          filteredTasks={filteredTasks}
          formatDate={formatDate}
          getCategoryLabel={getCategoryLabel}
          getOwnerLabel={getOwnerLabel}
          getOwnerColor={getOwnerColor}
          getWorryTitle={getWorryTitle}
          getWorryLabel={getWorryLabel}
          extractFinalMessage={extractFinalMessage}
          timeFilter={timeFilter}
          categoryFilter={categoryFilter}
          ownerFilter={ownerFilter}
          search={search}
          setTimeFilter={setTimeFilter}
          setCategoryFilter={setCategoryFilter}
          setOwnerFilter={setOwnerFilter}
          setSearch={setSearch}
          setDeleteId={setDeleteId}
        />
      </div>

      <HistoryDeleteModal
        t={t}
        deleteId={deleteId}
        onCancel={() => setDeleteId(null)}
        onConfirm={confirmDelete}
      />
    </div >
  );
};
