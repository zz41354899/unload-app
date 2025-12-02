import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { Task, ResponsibilityOwner, TaskCategory, TaskWorry, TaskPolarity } from '../types';
import { DailyStepId, getDailyCue, getDailyCueForStep } from '../lib/quotes';
import { JournalHeader } from '../components/journal/JournalHeader';
import { JournalStats } from '../components/journal/JournalStats';
import { JournalTopWorries } from '../components/journal/JournalTopWorries';
import { JournalTaskList } from '../components/journal/JournalTaskList';

interface JournalProps {
  navigate: (page: string) => void;
}

interface TopWorryItem {
  worry: string;
  count: number;
  isPositive: boolean;
}

export const Journal: React.FC<JournalProps> = ({ navigate }) => {
  const { tasks, updateTask, showToast } = useAppStore();
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingFocusSentence, setEditingFocusSentence] = useState<string>('');
  const [editingNote, setEditingNote] = useState<string>('');
  const [editingReality, setEditingReality] = useState<string>('');
  const [editingDistance, setEditingDistance] = useState<string>('');
  const [editingValue, setEditingValue] = useState<string>('');
  const [editingFinalMessage, setEditingFinalMessage] = useState<string>('');
  const [filterOwner, setFilterOwner] = useState<string | null>(null);
  const [polarityFilter, setPolarityFilter] = useState<'all' | 'positive' | 'negative'>('all');
  const [editingFocusAspect, setEditingFocusAspect] = useState<'self' | 'view' | 'future' | null>(null);
  const [editingPerspective, setEditingPerspective] = useState<'reality' | 'distance' | 'value' | 'observe' | null>(null);

  // 獲取選定日期的任務
  const getTasksByDate = (dateStr: string) => {
    return tasks.filter(t => t.date.split('T')[0] === dateStr);
  };

  const getAspectLabelFromReflection = (reflection?: string | null): string | null => {
    if (!reflection) return null;
    const blocks = reflection.split(/\n\n+/);
    for (const block of blocks) {
      const lines = block.split('\n');
      const heading = lines[0];
      const body = lines.slice(1).join('\n').trim();
      if (ASPECT_HEADINGS.includes(heading) && body) {
        return body;
      }
    }
    return null;
  };

  const getAspectKeyFromBody = (body: string): 'self' | 'view' | 'future' | null => {
    const normalized = body.trim();

    const aspectMap: Record<string, 'self' | 'view' | 'future'> = {
      // Current language labels
      [t('newTask.step2.aspect.self')]: 'self',
      [t('newTask.step2.aspect.view')]: 'view',
      [t('newTask.step2.aspect.future')]: 'future',

      // zh-TW fixed strings (for records created in zh-TW but viewed in other languages)
      '自己有沒有做到': 'self',
      '別人會怎麼看': 'view',
      '未來會怎麼發展': 'future',

      // en fixed strings (for records created in en but viewed in other languages)
      'Whether I did enough': 'self',
      'How others might see me': 'view',
      'How things may turn out': 'future',
    };

    return aspectMap[normalized] ?? null;
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

  const todayTasksRaw = useMemo(
    () => getTasksByDate(selectedDate),
    [selectedDate, tasks],
  );

  const todayTasks = useMemo(
    () => (
      polarityFilter === 'all'
        ? todayTasksRaw
        : todayTasksRaw.filter(
          (t) => (t.polarity ?? TaskPolarity.Negative) === polarityFilter,
        )
    ),
    [todayTasksRaw, polarityFilter],
  );

  const weekStats = useMemo(
    () => getWeekStats(),
    [selectedDate, tasks],
  );

  const monthStats = useMemo(
    () => getMonthStats(),
    [selectedDate, tasks],
  );

  const filteredTasks = filterOwner
    ? todayTasks.filter(t => t.owner === filterOwner)
    : todayTasks;

  const getTopWorries = (): TopWorryItem[] => {
    const baseTasks = getTasksByDate(selectedDate);

    const positiveTasks = baseTasks.filter(t => (t.polarity ?? TaskPolarity.Negative) === TaskPolarity.Positive);
    const negativeTasks = baseTasks.filter(t => (t.polarity ?? TaskPolarity.Negative) === TaskPolarity.Negative);

    const buildTop = (source: typeof tasks): [string, number] | null => {
      if (source.length === 0) return null;
      const counts: Record<string, number> = {};
      source.forEach(t => {
        const worries = Array.isArray(t.worry) ? t.worry : [t.worry];
        worries.forEach(w => {
          counts[w] = (counts[w] || 0) + 1;
        });
      });
      const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
      return top ?? null;
    };

    const items: TopWorryItem[] = [];

    // 全部事件：同時列出正向亮點與負向擔憂
    if (polarityFilter === 'all') {
      const posTop = buildTop(positiveTasks);
      const negTop = buildTop(negativeTasks);

      if (posTop) {
        items.push({ worry: posTop[0], count: posTop[1], isPositive: true });
      }
      if (negTop) {
        items.push({ worry: negTop[0], count: negTop[1], isPositive: false });
      }
    } else {
      const source = polarityFilter === 'positive' ? positiveTasks : negativeTasks;
      const top = buildTop(source);
      if (top) {
        items.push({ worry: top[0], count: top[1], isPositive: polarityFilter === 'positive' });
      }
    }

    return items;
  };

  const topWorries = useMemo(
    () => getTopWorries(),
    [selectedDate, tasks, polarityFilter],
  );

  const STEP_ID_BY_CATEGORY: Record<string, DailyStepId> = {
    [TaskCategory.Interview]: 'stress',
    [TaskCategory.CareerPlanning]: 'anxiety',
    [TaskCategory.MarketChange]: 'anxiety',
    [TaskCategory.SelfConfusion]: 'lowSelfEsteem',
    [TaskCategory.ProgressAnxiety]: 'procrastination',
    [TaskCategory.ExpectationPressure]: 'stress',
    [TaskCategory.FinancialPressure]: 'neglectNeeds',
    [TaskCategory.Other]: 'easilyTriggered',
  };

  const getStepIdFromCategory = (cat: string): DailyStepId | null => STEP_ID_BY_CATEGORY[cat] ?? null;

  const STEP_ID_BY_WORRY: Record<string, DailyStepId> = {
    [TaskWorry.TimeStress]: 'stress',
    [TaskWorry.Pressure]: 'stress',
    [TaskWorry.Uncertainty]: 'anxiety',
    [TaskWorry.Decision]: 'anxiety',
    [TaskWorry.Comparison]: 'distortedBelief',
  };

  const getStepIdFromWorry = (w: string, polarity?: TaskPolarity | null): DailyStepId | null => {
    if (w === TaskWorry.Performance) {
      return polarity === TaskPolarity.Positive ? 'lowSelfEsteem' : 'distortedBelief';
    }

    return STEP_ID_BY_WORRY[w] ?? null;
  };

  const inferStepIdFromTasks = (sourceTasks: Task[]): DailyStepId | null => {
    const counts: Partial<Record<DailyStepId, number>> = {};

    sourceTasks.forEach((task) => {
      // 先依情緒標籤（category）推一步驟，讓整體情緒調性優先
      const categories = Array.isArray(task.category) ? task.category : [task.category];
      categories.forEach((cat) => {
        const stepIdFromCat = getStepIdFromCategory(cat as string);
        if (!stepIdFromCat) return;
        counts[stepIdFromCat] = (counts[stepIdFromCat] ?? 0) + 2; // 類別給較高權重
      });

      // 再依焦點 worry 作為輔助訊息
      const worries = Array.isArray(task.worry) ? task.worry : [task.worry];
      worries.forEach((w) => {
        const stepId = getStepIdFromWorry(w as string, task.polarity);
        if (!stepId) return;
        counts[stepId] = (counts[stepId] ?? 0) + 1;
      });
    });

    let bestId: DailyStepId | null = null;
    let bestCount = 0;
    (Object.keys(counts) as DailyStepId[]).forEach((id) => {
      const value = counts[id] ?? 0;
      if (value > bestCount) {
        bestCount = value;
        bestId = id;
      }
    });

    return bestCount > 0 ? bestId : null;
  };

  const { baseDailyCue, inferredCue, dailyCue } = useMemo(() => {
    const base = getDailyCue();
    const inferredStepId = inferStepIdFromTasks(todayTasksRaw);
    const inferred = inferredStepId ? getDailyCueForStep(inferredStepId) : null;

    return {
      baseDailyCue: base,
      inferredCue: inferred,
      dailyCue: inferred ?? base,
    } as const;
  }, [todayTasksRaw]);

  const getCategoryLabel = (cat: string, usePositive: boolean = false) => {
    const keyFor = (suffix: string) => {
      if (usePositive) {
        const positiveKey = `taskCategoryPositive.${suffix}`;
        const positiveLabel = t(positiveKey);
        if (positiveLabel !== positiveKey) {
          return positiveLabel;
        }
      }

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

  const getWorryLabel = (w: string, usePositive: boolean = false) => {
    const keyFor = (suffix: string) => {
      if (usePositive) {
        const positiveKey = `taskWorryPositive.${suffix}`;
        const positiveLabel = t(positiveKey);
        if (positiveLabel !== positiveKey) {
          return positiveLabel;
        }
      }

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

  const getOwnerLabel = (owner: ResponsibilityOwner) => {
    switch (owner) {
      case ResponsibilityOwner.Mine: return t('owner.Mine');
      case ResponsibilityOwner.Theirs: return t('owner.Theirs');
      case ResponsibilityOwner.Shared: return t('owner.Shared');
      default: return owner;
    }
  };

  const renderPerspectiveLabel = (perspective?: string | null) => {
    if (!perspective) {
      return <span className="text-gray-400">{t('journal.perspective.empty')}</span>;
    }

    if (perspective === 'reality') return t('journal.perspective.reality');
    if (perspective === 'distance') return t('journal.perspective.distance');
    if (perspective === 'value') return t('journal.perspective.value');
    if (perspective === 'observe') return t('journal.perspective.observe');

    return <span className="text-gray-400">{t('journal.perspective.empty')}</span>;
  };

  const renderPerspectiveHint = (perspective?: string | null) => {
    if (!perspective) return null;

    if (perspective === 'reality') return t('journal.perspective.reality.hint');
    if (perspective === 'distance') return t('journal.perspective.distance.hint');
    if (perspective === 'value') return t('journal.perspective.value.hint');
    if (perspective === 'observe') return t('journal.perspective.observe.hint');

    return null;
  };

  const renderWorryLabel = (task: Task) => {
    const usePositive = (task.polarity ?? TaskPolarity.Negative) === TaskPolarity.Positive;

    if (Array.isArray(task.worry)) {
      return task.worry
        .map((w) => getWorryLabel(w, usePositive))
        .join(', ');
    }

    return getWorryLabel(task.worry as string, usePositive);
  };

  const renderFocusWithAspect = (task: Task) => {
    const base = renderWorryLabel(task);
    const aspectLabel = getAspectLabelFromReflection(task.reflection);

    if (!aspectLabel) return base;

    // 在當時的焦點後面加上所選面向，例如：
    // 測試（未來會怎麼發展）
    return `${base}（${aspectLabel}）`;
  };

  // Known headings in different languages for reflection blocks
  const STEP2_HEADINGS = [
    t('newTask.step2.title'),
    '用一句話，描述今天的情緒',
    'In one sentence, describe how you feel today',
  ];

  const REALITY_HEADINGS = [
    t('newTask.perspective.reality.title'),
    '視角 A — 現實層面',
    'Perspective A — Reality',
  ];

  const DISTANCE_HEADINGS = [
    t('newTask.perspective.distance.title'),
    '視角 B — 距離層面',
    'Perspective B — Distance',
  ];

  const VALUE_HEADINGS = [
    t('newTask.perspective.value.title'),
    '視角 C — 價值層面',
    'Perspective C — Values',
  ];

  const ASPECT_HEADINGS = [
    t('journal.focus.aspectTitle'),
    '在意的面向',
    'Focus of this sentence',
  ];

  const FINAL_MESSAGE_HEADINGS = [
    t('newTask.finalMessage.label'),
    '最後一句話（選填）',
    'One last sentence to yourself (optional)',
  ];

  const parseReflectionFromTask = (task: Task) => {
    let focusSentence = '';
    let note = '';
    let reality = '';
    let distance = '';
    let value = '';
    let finalMessage = task.finalMessage ?? '';
    let aspectKey: 'self' | 'view' | 'future' | null = null;

    if (task.reflection) {
      const blocks = task.reflection.split(/\n\n+/);

      blocks.forEach((block) => {
        const lines = block.split('\n');
        const heading = lines[0];
        const body = lines.slice(1).join('\n').trim();

        let handled = false;

        const applyIfMatch = (headings: string[], fn: () => void) => {
          if (handled || !headings.includes(heading)) return;
          fn();
          handled = true;
        };

        applyIfMatch(STEP2_HEADINGS, () => {
          if (body) {
            focusSentence = body;
          }
        });

        applyIfMatch(ASPECT_HEADINGS, () => {
          if (!body || aspectKey) return;
          aspectKey = getAspectKeyFromBody(body) || aspectKey;
        });

        applyIfMatch(REALITY_HEADINGS, () => {
          if (body) {
            reality = body;
          }
        });

        applyIfMatch(DISTANCE_HEADINGS, () => {
          if (body) {
            distance = body;
          }
        });

        applyIfMatch(VALUE_HEADINGS, () => {
          if (body) {
            value = body;
          }
        });

        applyIfMatch(FINAL_MESSAGE_HEADINGS, () => {
          if (!finalMessage && body) {
            finalMessage = body;
          }
        });

        if (!handled) {
          const trimmed = block.trim();
          if (trimmed) {
            note = note ? `${note}\n\n${trimmed}` : trimmed;
          }
        }
      });
    }

    return {
      focusSentence,
      note,
      reality,
      distance,
      value,
      finalMessage,
      aspectKey,
    } as const;
  };

  const startEditing = (task: Task) => {
    setEditingId(task.id);

    const {
      focusSentence,
      note,
      reality,
      distance,
      value,
      finalMessage,
      aspectKey,
    } = parseReflectionFromTask(task);

    setEditingFocusSentence(focusSentence);
    setEditingNote(note);
    setEditingReality(reality);
    setEditingDistance(distance);
    setEditingValue(value);
    setEditingFinalMessage(finalMessage);
    setEditingFocusAspect(aspectKey);
    setEditingPerspective(task.perspective ?? null);
  };

  const handleSaveJournal = (taskId: string) => {
    const trimmedFocus = editingFocusSentence.trim();
    const trimmedNote = editingNote.trim();
    const trimmedReality = editingReality.trim();
    const trimmedDistance = editingDistance.trim();
    const trimmedValue = editingValue.trim();
    const trimmedFinalMessage = editingFinalMessage.trim();

    const addSection = (label: string | undefined, value?: string | null) => {
      if (!value) return null;
      return label ? `${label}\n${value}` : value;
    };

    const parts = [
      addSection(t('newTask.step2.title'), trimmedFocus),
      addSection(
        t('journal.focus.aspectTitle'),
        editingFocusAspect ? t(`newTask.step2.aspect.${editingFocusAspect}`) : undefined,
      ),
      addSection(undefined, trimmedNote),
      addSection(t('newTask.perspective.reality.title'), trimmedReality),
      addSection(t('newTask.perspective.distance.title'), trimmedDistance),
      addSection(t('newTask.perspective.value.title'), trimmedValue),
      addSection(t('newTask.finalMessage.label'), trimmedFinalMessage),
    ].filter(Boolean) as string[];

    const combinedReflection = parts.length > 0 ? parts.join('\n\n') : undefined;

    updateTask(taskId, {
      reflection: combinedReflection,
      finalMessage: trimmedFinalMessage || undefined,
      perspective: editingPerspective ?? undefined,
      // 若有填寫新的焦點句，讓上方「當時的焦點」也改為這句話
      ...(trimmedFocus ? { worry: trimmedFocus } : {}),
    });
    showToast(t('journal.toast.saved'));
    setEditingId(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-12 px-4 md:px-0">
      <JournalHeader
        t={t}
        i18n={i18n}
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        dailyCue={dailyCue}
      />

      <JournalStats
        t={t}
        todayTasks={todayTasks}
        weekStats={weekStats}
        monthStats={monthStats}
      />

      <JournalTopWorries
        t={t}
        topWorries={topWorries}
        getWorryLabel={getWorryLabel}
      />

      <JournalTaskList
        t={t}
        todayTasks={todayTasks}
        filteredTasks={filteredTasks}
        filterOwner={filterOwner}
        setFilterOwner={setFilterOwner}
        editingId={editingId}
        setEditingId={setEditingId}
        editingFocusSentence={editingFocusSentence}
        setEditingFocusSentence={setEditingFocusSentence}
        editingNote={editingNote}
        setEditingNote={setEditingNote}
        editingReality={editingReality}
        setEditingReality={setEditingReality}
        editingDistance={editingDistance}
        setEditingDistance={setEditingDistance}
        editingValue={editingValue}
        setEditingValue={setEditingValue}
        editingFinalMessage={editingFinalMessage}
        setEditingFinalMessage={setEditingFinalMessage}
        editingFocusAspect={editingFocusAspect}
        setEditingFocusAspect={setEditingFocusAspect}
        editingPerspective={editingPerspective}
        setEditingPerspective={setEditingPerspective}
        startEditing={startEditing}
        handleSaveJournal={handleSaveJournal}
        getCategoryLabel={getCategoryLabel}
        getOwnerLabel={getOwnerLabel}
        renderPerspectiveLabel={renderPerspectiveLabel}
        renderPerspectiveHint={renderPerspectiveHint}
        renderFocusWithAspect={renderFocusWithAspect}
        selectedDate={selectedDate}
      />
    </div>
  );
};

export default Journal;
