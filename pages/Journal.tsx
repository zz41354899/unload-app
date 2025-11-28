import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { Task, ResponsibilityOwner, TaskCategory, TaskWorry, TaskPolarity } from '../types';
import { Calendar, BookOpen, Lightbulb, TrendingUp, ChevronDown, Sparkles, Pencil, Save, X } from 'lucide-react';
import { DailyStepId, getDailyCue, getDailyCueForStep } from '../lib/quotes';

interface JournalProps {
  navigate: (page: string) => void;
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

  const todayTasksRaw = getTasksByDate(selectedDate);
  const todayTasks = polarityFilter === 'all'
    ? todayTasksRaw
    : todayTasksRaw.filter(t => (t.polarity ?? TaskPolarity.Negative) === polarityFilter);
  const weekStats = getWeekStats();
  const monthStats = getMonthStats();

  const filteredTasks = filterOwner
    ? todayTasks.filter(t => t.owner === filterOwner)
    : todayTasks;

  // 計算主要困擾 / 亮點
  interface TopWorryItem {
    worry: string;
    count: number;
    isPositive: boolean;
  }

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

  const topWorries = getTopWorries();

  const getStepIdFromCategory = (cat: string): DailyStepId | null => {
    switch (cat) {
      // 緊張：多半是壓力與身體警覺度偏高
      case TaskCategory.Interview:
        return 'stress';
      // 焦慮／不安：偏向對未來與方向的不確定
      case TaskCategory.CareerPlanning:
      case TaskCategory.MarketChange:
        return 'anxiety';
      // 迷惘：容易連到自我評價與價值感（低自尊環節）
      case TaskCategory.SelfConfusion:
        return 'lowSelfEsteem';
      // 沮喪：常表現在延遲行動、提不起勁（延宕環節）
      case TaskCategory.ProgressAnxiety:
        return 'procrastination';
      // 壓力：扛太多東西在身上的感覺
      case TaskCategory.ExpectationPressure:
        return 'stress';
      // 疲憊：比較像是忽略基本需求、沒時間休息
      case TaskCategory.FinancialPressure:
        return 'neglectNeeds';
      // 情怒或其他特殊情緒：先視為容易被觸發的一環
      case TaskCategory.Other:
        return 'easilyTriggered';
      default:
        return null;
    }
  };

  const getStepIdFromWorry = (w: string, polarity?: TaskPolarity | null): DailyStepId | null => {
    switch (w) {
      case TaskWorry.TimeStress:
      case TaskWorry.Pressure:
        return 'stress';
      case TaskWorry.Uncertainty:
      case TaskWorry.Decision:
        return 'anxiety';
      case TaskWorry.Comparison:
        return 'distortedBelief';
      case TaskWorry.Performance:
        return polarity === TaskPolarity.Positive ? 'lowSelfEsteem' : 'distortedBelief';
      default:
        return null;
    }
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

  const baseDailyCue = getDailyCue();
  const inferredStepId = inferStepIdFromTasks(todayTasksRaw);
  const inferredCue = inferredStepId ? getDailyCueForStep(inferredStepId) : null;
  const dailyCue = inferredCue ?? baseDailyCue;

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

  const startEditing = (task: Task) => {
    setEditingId(task.id);

    let focusSentence = '';
    let note = '';
    let reality = '';
    let distance = '';
    let value = '';
    let finalMessage = task.finalMessage ?? '';
    let aspectKey: 'self' | 'view' | 'future' | null = null;

    if (task.reflection) {
      const blocks = task.reflection.split(/\n\n+/);
      const handlers: Array<{
        headings: string[];
        apply: (body: string, heading: string) => void;
      }> = [
        {
          headings: STEP2_HEADINGS,
          apply: (body) => {
            if (body) focusSentence = body;
          },
        },
        {
          headings: ASPECT_HEADINGS,
          apply: (body) => {
            if (!body || aspectKey) return;
            aspectKey = getAspectKeyFromBody(body) || aspectKey;
          },
        },
        {
          headings: REALITY_HEADINGS,
          apply: (body) => {
            if (body) reality = body;
          },
        },
        {
          headings: DISTANCE_HEADINGS,
          apply: (body) => {
            if (body) distance = body;
          },
        },
        {
          headings: VALUE_HEADINGS,
          apply: (body) => {
            if (body) value = body;
          },
        },
        {
          headings: FINAL_MESSAGE_HEADINGS,
          apply: (body) => {
            if (!finalMessage && body) {
              finalMessage = body;
            }
          },
        },
      ];

      blocks.forEach((block) => {
        const lines = block.split('\n');
        const heading = lines[0];
        const body = lines.slice(1).join('\n').trim();

        const handler = handlers.find(h => h.headings.includes(heading));
        if (handler) {
          handler.apply(body, heading);
          return;
        }

        const trimmed = block.trim();
        if (trimmed) {
          note = note ? `${note}\n\n${trimmed}` : trimmed;
        }
      });
    }

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
    const parts: string[] = [];

    const trimmedFocus = editingFocusSentence.trim();
    const trimmedNote = editingNote.trim();
    const trimmedReality = editingReality.trim();
    const trimmedDistance = editingDistance.trim();
    const trimmedValue = editingValue.trim();
    const trimmedFinalMessage = editingFinalMessage.trim();

    if (trimmedFocus) {
      parts.push(`${t('newTask.step2.title')}\n${trimmedFocus}`);
    }

    if (editingFocusAspect) {
      const aspectLabel = t(`newTask.step2.aspect.${editingFocusAspect}`);
      parts.push(`${t('journal.focus.aspectTitle')}\n${aspectLabel}`);
    }

    if (trimmedNote) {
      parts.push(trimmedNote);
    }

    if (trimmedReality) {
      parts.push(`${t('newTask.perspective.reality.title')}\n${trimmedReality}`);
    }
    if (trimmedDistance) {
      parts.push(`${t('newTask.perspective.distance.title')}\n${trimmedDistance}`);
    }
    if (trimmedValue) {
      parts.push(`${t('newTask.perspective.value.title')}\n${trimmedValue}`);
    }
    if (trimmedFinalMessage) {
      parts.push(`${t('newTask.finalMessage.label')}\n${trimmedFinalMessage}`);
    }

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

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 md:p-12 shadow-sm border border-gray-100">
        <div className="mb-6">
          <h1 className="text-xl md:text-2xl font-bold mb-2">{t('journal.title')}</h1>
          <p className="text-gray-600 text-sm md:text-base">{t('journal.subtitle')}</p>
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
            {new Date(selectedDate).toLocaleDateString(i18n.language, {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>

        {/* Daily Cue */}
        <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-xl p-4 md:p-6 border border-primary/20">
          <div className="flex items-start gap-3">
            <Sparkles className="w-4 md:w-5 h-4 md:h-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-xs md:text-sm text-primary/60 font-medium mb-1">{t('journal.dailyQuote.title')}</p>
              <div className="space-y-1 md:space-y-2">
                <p className="text-xs md:text-sm text-gray-600 font-medium">
                  {dailyCue.stageTitle && (
                    <span>
                      今天想先照顧的環節：
                      <span className="font-semibold text-text">{dailyCue.stageTitle}</span>
                    </span>
                  )}
                </p>
                <p className="text-sm md:text-base leading-relaxed text-text">
                  {dailyCue.stageDescription}
                </p>
                <p className="text-xs md:text-sm text-gray-700">
                  今天可以試試：
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

      {/* Stats Overview */}
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
                <span>{todayTasks.filter(t => t.owner === ResponsibilityOwner.Mine).length}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500 mb-2">
                <span>{t('journal.stats.today.shared')}</span>
                <span>{todayTasks.filter(t => t.owner === ResponsibilityOwner.Shared).length}</span>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>{t('journal.stats.today.theirs')}</span>
                <span>{todayTasks.filter(t => t.owner === ResponsibilityOwner.Theirs).length}</span>
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

      {/* Top Worries */}
      {topWorries.length > 0 && (
        <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-4 md:mb-6">
            <Lightbulb className="w-4 md:w-5 h-4 md:h-5 text-primary" />
            <h3 className="font-bold text-base md:text-lg">
              {t('journal.topWorries.title.all')}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
            {topWorries.map((item, idx) => (
              <div key={`${item.worry}-${item.isPositive ? 'pos' : 'neg'}`} className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg p-3 md:p-4 border border-primary/10">
                <div className="flex items-start gap-3">
                  <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs md:text-sm font-bold text-primary shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-text mb-1 text-sm">{getWorryLabel(item.worry, item.isPositive)}</div>
                    <div className="text-xs text-gray-500">{t('journal.topWorries.countLabel', { count: item.count })}</div>
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
          <h3 className="font-bold text-base md:text-lg">{t('journal.details.title')}</h3>
          {todayTasks.length > 0 && (
            <div className="relative w-full sm:w-auto">
              <select
                value={filterOwner || ''}
                onChange={(e) => setFilterOwner(e.target.value || null)}
                className="appearance-none w-full sm:w-auto bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 pr-8 text-xs md:text-sm font-medium text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="">{t('journal.details.filter.all')}</option>
                <option value={ResponsibilityOwner.Mine}>{t('journal.details.filter.mine')}</option>
                <option value={ResponsibilityOwner.Shared}>{t('journal.details.filter.shared')}</option>
                <option value={ResponsibilityOwner.Theirs}>{t('journal.details.filter.theirs')}</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          )}
        </div>

        {filteredTasks.length > 0 ? (
          <div className="space-y-3 md:space-y-4">
            {filteredTasks.map((task) => (
              <div key={task.id} className="border border-gray-100 rounded-lg p-4 md:p-6 hover:shadow-md transition-shadow">
                {/* Task Header: four key elements */}
                <div className="flex items-start gap-3 mb-4">
                  <div className="flex-1 min-w-0 space-y-2">
                    {/* Final message as main focus */}
                    {task.finalMessage && (
                      <div className="text-sm md:text-base font-semibold text-text break-words">
                        {task.finalMessage}
                      </div>
                    )}

                    {/* Emotion & boundary */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm text-gray-600">
                      <div className="space-y-0.5">
                        <div className="text-[11px] md:text-xs text-gray-400 uppercase tracking-wide">
                          {t('journal.details.emotionLabel')}
                        </div>
                        <div className="font-medium break-words">
                          {Array.isArray(task.category)
                            ? task.category.map((cat) => getCategoryLabel(cat, (task.polarity ?? TaskPolarity.Negative) === TaskPolarity.Positive)).join(', ')
                            : getCategoryLabel(task.category as string, (task.polarity ?? TaskPolarity.Negative) === TaskPolarity.Positive)}
                        </div>
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[11px] md:text-xs text-gray-400 uppercase tracking-wide">
                          {t('journal.details.boundaryLabel')}
                        </div>
                        <div className="inline-flex items-center gap-2">
                          <span className="px-2 py-1 bg-gray-100 rounded-full whitespace-nowrap text-xs md:text-sm">
                            {getOwnerLabel(task.owner as ResponsibilityOwner)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Perspective & worry focus */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs md:text-sm text-gray-600">
                      <div className="space-y-0.5">
                        <div className="text-[11px] md:text-xs text-gray-400 uppercase tracking-wide">
                          {t('journal.details.perspectiveLabel')}
                        </div>
                        <div className="font-medium break-words">
                          {renderPerspectiveLabel(task.perspective)}
                        </div>
                        {renderPerspectiveHint(task.perspective) && (
                          <div className="mt-0.5 text-[11px] md:text-xs text-gray-400">
                            {renderPerspectiveHint(task.perspective)}
                          </div>
                        )}
                      </div>
                      <div className="space-y-0.5">
                        <div className="text-[11px] md:text-xs text-gray-400 uppercase tracking-wide">
                          {t('journal.details.focusLabel')}
                        </div>
                        <div className="break-words">
                          {renderFocusWithAspect(task)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Journal Content - editable reflection */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                  {editingId === task.id ? (
                    <div className="space-y-4">
                      {/* 區塊標題：反思日記 */}
                      <div className="space-y-1">
                        <div className="text-xs font-semibold text-gray-500">
                          {t('journal.edit.label')}
                        </div>
                        <p className="text-[11px] md:text-xs text-gray-400">
                          {t('journal.edit.todayDiffHint')}
                        </p>
                      </div>

                      {/* 一句話情緒 */}
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-500">
                          {t('newTask.step2.title')}
                        </label>
                        <input
                          type="text"
                          value={editingFocusSentence}
                          onChange={(e) => setEditingFocusSentence(e.target.value)}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
                        />
                        <div className="pt-1 space-y-1">
                          <div className="text-[11px] md:text-xs text-gray-400">
                            {t('newTask.step2.aspect.title')}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {['self', 'view', 'future'].map((key) => (
                              <button
                                key={key}
                                type="button"
                                onClick={() => setEditingFocusAspect(prev => (prev === key ? null : key))}
                                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                                  editingFocusAspect === key
                                    ? 'bg-primary/10 border-primary text-primary'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                              >
                                {t(`newTask.step2.aspect.${key}`)}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 視角選擇 + 對應視角內容（僅選擇後才顯示輸入框） */}
                      <div className="space-y-3">
                        <div className="space-y-1">
                          <div className="text-[11px] md:text-xs text-gray-400">
                            {t('journal.details.perspectiveLabel')}
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {([
                              { key: 'reality', label: t('newTask.perspective.reality.title') },
                              { key: 'distance', label: t('newTask.perspective.distance.title') },
                              { key: 'value', label: t('newTask.perspective.value.title') },
                              { key: 'observe', label: t('newTask.perspective.observe.title') },
                            ] as const).map(({ key, label }) => (
                              <button
                                key={key}
                                type="button"
                                onClick={() =>
                                  setEditingPerspective(prev => (prev === key ? null : key))
                                }
                                className={`px-3 py-1 rounded-full text-xs border transition-colors ${
                                  editingPerspective === key
                                    ? 'bg-primary/10 border-primary text-primary'
                                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                                }`}
                              >
                                {label}
                              </button>
                            ))}
                          </div>
                        </div>

                        {editingPerspective === 'reality' && (
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-500">
                              {t('newTask.perspective.reality.title')}
                            </label>
                            <textarea
                              value={editingReality}
                              onChange={(e) => setEditingReality(e.target.value)}
                              placeholder={t('journal.perspective.reality.placeholder')}
                              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-xs min-h-[72px]"
                            />
                          </div>
                        )}
                        {editingPerspective === 'distance' && (
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-500">
                              {t('newTask.perspective.distance.title')}
                            </label>
                            <textarea
                              value={editingDistance}
                              onChange={(e) => setEditingDistance(e.target.value)}
                              placeholder={t('journal.perspective.distance.placeholder')}
                              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-xs min-h-[72px]"
                            />
                          </div>
                        )}
                        {editingPerspective === 'value' && (
                          <div className="space-y-1">
                            <label className="block text-xs font-medium text-gray-500">
                              {t('newTask.perspective.value.title')}
                            </label>
                            <textarea
                              value={editingValue}
                              onChange={(e) => setEditingValue(e.target.value)}
                              placeholder={t('journal.perspective.value.placeholder')}
                              className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-xs min-h-[72px]"
                            />
                          </div>
                        )}
                      </div>

                      {/* 最後一句話（同時作為整體反思收斂） */}
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-500">
                          {t('newTask.finalMessage.label')}
                        </label>
                        <textarea
                          value={editingFinalMessage}
                          onChange={(e) => setEditingFinalMessage(e.target.value)}
                          placeholder={t('journal.edit.placeholder')}
                          className="w-full p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none text-sm min-h-[56px]"
                        />
                      </div>
                      <div className="flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-gray-200 text-xs md:text-sm text-gray-500 hover:bg-gray-50"
                        >
                          <X className="w-3 h-3" />
                          {t('history.modal.cancel')}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSaveJournal(task.id)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-white text-xs md:text-sm hover:bg-[#1e2b1e]"
                        >
                          <Save className="w-3 h-3" />
                          {t('journal.edit.save')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {task.reflection && (
                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-medium text-gray-500">{t('journal.view.label')}</span>
                            <button
                              type="button"
                              onClick={() => {
                                startEditing(task);
                              }}
                              className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                            >
                              <Pencil className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                            </button>
                          </div>
                          <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg whitespace-pre-line">{task.reflection}</div>
                        </div>
                      )}
                      {!task.reflection && (
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-400 italic">{t('journal.view.empty')}</span>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(task.id);
                              setEditingFocusSentence('');
                              setEditingNote('');
                              setEditingReality('');
                              setEditingDistance('');
                              setEditingValue('');
                              setEditingFinalMessage('');
                              setEditingFocusAspect(null);
                              setEditingPerspective(task.perspective ?? null);
                            }}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                          >
                            <Pencil className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-20" />
            <p className="text-sm">{t('journal.empty', { date: selectedDate })}</p>
          </div>
        )}
      </div>

    </div>
  );
};
