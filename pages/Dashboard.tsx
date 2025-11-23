
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../store';
import { ResponsibilityOwner, TaskWorry } from '../types';
import { Smile, MessageSquare, Book, TrendingUp, Zap, Target, Brain, Lightbulb, Sparkles } from 'lucide-react';
import { getDailyQuote } from '../lib/quotes';

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

  // Stats Calculation
  const totalTasks = tasks.length;
  const myTasks = tasks.filter(t => t.owner === ResponsibilityOwner.Mine).length;
  const theirTasks = tasks.filter(t => t.owner === ResponsibilityOwner.Theirs).length;
  const sharedTasks = tasks.filter(t => t.owner === ResponsibilityOwner.Shared).length;

  // Get top worries
  const getTopWorries = () => {
    if (tasks.length === 0) return [];
    
    const counts: Record<string, number> = {};
    tasks.forEach(t => {
      const worries = Array.isArray(t.worry) ? t.worry : [t.worry];
      worries.forEach(worry => {
        counts[worry] = (counts[worry] || 0) + 1;
      });
    });
    
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([name, count]) => ({ name, count }));
  };

  const topWorries = getTopWorries();

  const getWorryLabel = (worry: string) => {
    switch (worry) {
      case TaskWorry.Performance: return t('taskWorry.Performance');
      case TaskWorry.Rejection: return t('taskWorry.Rejection');
      case TaskWorry.OthersThoughts: return t('taskWorry.OthersThoughts');
      case TaskWorry.Pressure: return t('taskWorry.Pressure');
      case TaskWorry.Comparison: return t('taskWorry.Comparison');
      case TaskWorry.TimeStress: return t('taskWorry.TimeStress');
      case TaskWorry.Decision: return t('taskWorry.Decision');
      case TaskWorry.Uncertainty: return t('taskWorry.Uncertainty');
      case TaskWorry.Other: return t('taskWorry.Other');
      default: return worry;
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-12 px-4 md:px-0">
      
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-6 md:p-12 shadow-sm border border-gray-100">
         <div className="flex justify-between items-start gap-4 mb-6">
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

      {/* Daily Quote */}
      <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-4 md:p-8 border border-primary/20 shadow-sm">
        <div className="flex items-start gap-3 md:gap-4">
          <Sparkles className="w-5 md:w-6 h-5 md:h-6 text-primary shrink-0 mt-0.5 md:mt-1" />
          <div className="flex-1 min-w-0">
            <p className="text-xs md:text-sm text-primary/60 font-medium mb-1 md:mb-2">{t('journal.dailyQuote.title')}</p>
            <p className="text-sm md:text-lg leading-relaxed text-text font-medium">
              "{getDailyQuote()}"
            </p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
            { label: t('dashboard.stats.total'), value: totalTasks, icon: TrendingUp, delay: 0 },
            { label: t('dashboard.stats.mine'), value: myTasks, icon: Book, delay: 100 },
            { label: t('dashboard.stats.theirs'), value: theirTasks, icon: MessageSquare, delay: 200 },
            { label: t('dashboard.stats.shared'), value: sharedTasks, icon: Smile, delay: 300 },
        ].map((stat, idx) => (
            <div 
                key={stat.label} 
                className="bg-white p-4 md:p-6 rounded-2xl shadow-sm min-h-[140px] md:min-h-[160px] flex flex-col justify-between"
            >
                <stat.icon className="w-4 md:w-5 h-4 md:h-5 text-gray-400 mb-2" />
                <div>
                    <div className="text-2xl md:text-4xl font-bold mb-1 text-text">{stat.value}</div>
                    <div className="text-xs md:text-sm text-gray-500 font-medium">{stat.label}</div>
                </div>
            </div>
        ))}
      </div>


      {/* Simplified Insights Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        
        {/* Quick Stats */}
        <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">{t('dashboard.quick.title')}</h3>
          </div>
          
          {tasks.length > 0 ? (
            <div className="space-y-4">
              {(() => {
                const avgControl = Math.round(tasks.reduce((sum, t) => sum + t.controlLevel, 0) / tasks.length);
                
                return (
                  <>
                    <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg p-6 border border-primary/20">
                      <div className="text-sm text-gray-600 mb-2">{t('dashboard.quick.avg')}</div>
                      <div className="text-4xl font-bold text-primary mb-2">{avgControl}%</div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${avgControl}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {avgControl >= 70 
                        ? t('dashboard.quick.hint.high')
                        : avgControl >= 40
                        ? t('dashboard.quick.hint.mid')
                        : t('dashboard.quick.hint.low')}
                    </p>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 py-8">
              <Zap className="w-8 h-8 mb-2 opacity-20" />
              <span className="text-sm">{t('dashboard.quick.empty')}</span>
            </div>
          )}
        </div>

        {/* Personal Insights */}
        <div className="bg-white rounded-2xl p-4 md:p-8 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <Brain className="w-5 h-5 text-primary" />
            <h3 className="font-bold text-lg">{t('dashboard.insight.title')}</h3>
          </div>
          
          {tasks.length > 0 ? (
            <div className="space-y-3">
              {(() => {
                const avgControl = Math.round(tasks.reduce((sum, t) => sum + t.controlLevel, 0) / tasks.length);
                const topWorry = topWorries.length > 0 ? topWorries[0].name : null;
                
                return (
                  <>
                    <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <Target className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-gray-700">
                        {t('dashboard.insight.distribution', { mine: myTasks, shared: sharedTasks, theirs: theirTasks })}
                      </p>
                    </div>
                    
                    {topWorry && (
                      <div className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <Lightbulb className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <p className="text-sm text-gray-700">
                          {t('dashboard.insight.mainWorry', { worry: getWorryLabel(topWorry as string) })}
                        </p>
                      </div>
                    )}
                    
                    <button 
                      onClick={() => navigate('journal')}
                      className="w-full mt-4 px-4 py-2 bg-primary/10 text-primary rounded-lg hover:bg-primary/20 transition-colors text-sm font-medium"
                    >
                      {t('dashboard.insight.viewMore')}
                    </button>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-gray-400 py-8">
              <Brain className="w-8 h-8 mb-2 opacity-20" />
              <span className="text-sm">{t('dashboard.insight.empty')}</span>
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
