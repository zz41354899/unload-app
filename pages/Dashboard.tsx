
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { ResponsibilityOwner, TaskCategory, Task, TaskWorry, TaskPolarity } from '../types';
import { Smile, MessageSquare, Book, TrendingUp, Target, Sparkles } from 'lucide-react';
import { DailyStepId, getDailyCue, getDailyCueForStep } from '../lib/quotes';

interface DashboardProps {
  navigate: (page: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ navigate }) => {
  const { tasks, user } = useAppStore();
  const { t, i18n } = useTranslation();

  // Date Helper
  const today = new Date();
  const currentYear = today.getFullYear();
  const currentMonthLabel = today.toLocaleString(i18n.language, { month: 'long' });
  const todayStr = today.toISOString().split('T')[0];

  const totalTasks = tasks.length;
  const myTasks = tasks.filter(t => t.owner === ResponsibilityOwner.Mine).length;
  const theirTasks = tasks.filter(t => t.owner === ResponsibilityOwner.Theirs).length;
  const sharedTasks = tasks.filter(t => t.owner === ResponsibilityOwner.Shared).length;

  // 依情緒標籤 (category) 統計最常探索的情緒
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

  const getTopEmotion = () => {
    if (tasks.length === 0) return null;

    const counts: Record<string, number> = {};
    tasks.forEach(t => {
      const categories = Array.isArray(t.category) ? t.category : [t.category];
      categories.forEach(category => {
        if (!category) return;
        counts[category] = (counts[category] || 0) + 1;
      });
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) return null;

    const [categoryKey, count] = sorted[0];
    return { categoryKey, count };
  };

  const topEmotion = getTopEmotion();

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

  const todayTasks = tasks.filter((t) => t.date.split('T')[0] === todayStr);
  const baseDailyCue = getDailyCue();
  const inferredStepId = inferStepIdFromTasks(todayTasks);
  const inferredCue = inferredStepId ? getDailyCueForStep(inferredStepId) : null;
  const dailyCue = inferredCue ?? baseDailyCue;

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-12 px-4 md:px-0">

      {/* Header Section */}
      <div className="bg-white rounded-2xl p-4 md:p-12 shadow-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl md:text-2xl font-bold mb-2 md:mb-4">{t('dashboard.header.title')}</h1>
            <p className="text-gray-600 text-sm md:text-base mb-6 md:mb-8">{t('dashboard.header.subtitle')}</p>
          </div>
          <div className="text-right hidden md:block shrink-0">
            <div className="text-3xl font-bold text-primary/20">{currentYear}</div>
            <div className="text-xl font-medium text-primary/40">{currentMonthLabel}</div>
          </div>
        </div>
        <button
          onClick={() => navigate('new-task')}
          className="w-full md:w-auto bg-primary text-white px-6 md:px-8 py-3 rounded-full hover:bg-[#1e2b1e] transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 text-sm md:text-base font-medium"
        >
          {t('dashboard.header.cta')}
        </button>
      </div>

      {/* Daily Cue */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-3 md:p-8 border border-primary/20 shadow-sm">
        <div className="flex items-start gap-3 md:gap-4">
          <Sparkles className="w-5 md:w-6 h-5 md:h-6 text-primary shrink-0 mt-0.5 md:mt-1" />
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-primary/60 font-medium mb-1 md:mb-2">{t('journal.dailyQuote.title')}</p>
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

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { label: t('dashboard.stats.total'), value: totalTasks, icon: TrendingUp },
          { label: t('dashboard.stats.mine'), value: myTasks, icon: Book },
          { label: t('dashboard.stats.theirs'), value: theirTasks, icon: MessageSquare },
          { label: t('dashboard.stats.shared'), value: sharedTasks, icon: Smile },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-white p-3 md:p-6 rounded-2xl shadow-sm min-h-[120px] md:min-h-[160px] flex flex-col justify-between"
          >
            <stat.icon className="w-4 md:w-5 h-4 md:h-5 text-gray-400 mb-2" />
            <div>
              <div className="text-xl md:text-4xl font-bold mb-1 text-text">{stat.value}</div>
              <div className="text-[11px] md:text-sm text-gray-500 font-medium break-words">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Focus Cards: Emotion & Perspective */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

        {/* Most explored emotion */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-sm md:text-base">{t('dashboard.focus.emotion.title')}</h3>
            </div>
            {topEmotion && totalTasks > 0 ? (
              <>
                <div className="text-2xl md:text-3xl font-bold text-text mb-1 break-words">
                  {getCategoryLabel(topEmotion.categoryKey)}
                </div>
                <p className="text-xs md:text-sm text-gray-500">
                  {t('dashboard.focus.emotion.subtitle', { count: topEmotion.count })}
                </p>
              </>
            ) : (
              <p className="text-xs md:text-sm text-gray-400">{t('dashboard.focus.empty')}</p>
            )}
          </div>
        </div>

        {/* Most used perspective */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-5 h-5 text-primary" />
              <h3 className="font-bold text-sm md:text-base">{t('dashboard.focus.view.title')}</h3>
            </div>
            {totalTasks > 0 ? (
              (() => {
                const counts: Record<string, number> = { reality: 0, distance: 0, value: 0, observe: 0 };
                tasks.forEach(task => {
                  if (task.perspective && counts[task.perspective] != null) {
                    counts[task.perspective] += 1;
                  }
                });
                const totalWithPerspective = counts.reality + counts.distance + counts.value + counts.observe;
                if (totalWithPerspective === 0) {
                  return <p className="text-xs md:text-sm text-gray-400">{t('dashboard.focus.empty')}</p>;
                }

                const realityRatio = Math.round((counts.reality / totalWithPerspective) * 100);
                const distanceRatio = Math.round((counts.distance / totalWithPerspective) * 100);
                const observeRatio = Math.round((counts.observe / totalWithPerspective) * 100);
                const valueRatio = Math.max(0, 100 - realityRatio - distanceRatio - observeRatio);

                let mainKey: 'reality' | 'distance' | 'value' | 'observe' = 'reality';
                if (counts.distance >= counts.reality && counts.distance >= counts.value && counts.distance >= counts.observe) mainKey = 'distance';
                if (counts.value >= counts.reality && counts.value >= counts.distance && counts.value >= counts.observe) mainKey = 'value';
                if (counts.observe >= counts.reality && counts.observe >= counts.distance && counts.observe >= counts.value) mainKey = 'observe';

                const mainLabelKey =
                  mainKey === 'reality'
                    ? 'newTask.perspective.reality.title'
                    : mainKey === 'distance'
                      ? 'newTask.perspective.distance.title'
                      : mainKey === 'value'
                        ? 'newTask.perspective.value.title'
                        : 'newTask.perspective.observe.title';

                return (
                  <>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-3 flex">
                      {realityRatio > 0 && (
                        <div className="bg-primary/80 h-full" style={{ width: `${realityRatio}%` }} />
                      )}
                      {distanceRatio > 0 && (
                        <div className="bg-accent/80 h-full" style={{ width: `${distanceRatio}%` }} />
                      )}
                      {valueRatio > 0 && (
                        <div className="bg-primary/30 h-full" style={{ width: `${valueRatio}%` }} />
                      )}
                      {observeRatio > 0 && (
                        <div className="bg-gray-300 h-full" style={{ width: `${observeRatio}%` }} />
                      )}
                    </div>
                    <p className="text-xs md:text-sm text-gray-600 mb-1">
                      {t('dashboard.focus.view.subtitle', { label: t(mainLabelKey) })}
                    </p>
                  </>
                );
              })()
            ) : (
              <p className="text-xs md:text-sm text-gray-400">{t('dashboard.focus.empty')}</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
