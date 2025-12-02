import React from 'react';
import { Smile, MessageSquare, Book, TrendingUp } from 'lucide-react';

interface DashboardStatsRowProps {
  t: (key: string, options?: any) => string;
  totalTasks: number;
  myTasks: number;
  theirTasks: number;
  sharedTasks: number;
}

export const DashboardStatsRow: React.FC<DashboardStatsRowProps> = ({
  t,
  totalTasks,
  myTasks,
  theirTasks,
  sharedTasks,
}) => (
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
);
