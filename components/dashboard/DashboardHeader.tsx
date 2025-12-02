import React from 'react';
import { ArrowRight } from 'lucide-react';

interface DashboardHeaderProps {
  t: (key: string, options?: any) => string;
  currentYear: number;
  currentMonthLabel: string;
  navigate: (page: string) => void;
  routerNavigate: (path: string) => void;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  t,
  currentYear,
  currentMonthLabel,
  navigate,
  routerNavigate,
}) => (
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
      type="button"
      onClick={() => {
        navigate('new-task');
        routerNavigate('/app/new-task');
      }}
      className="w-full md:w-auto bg-primary text-white px-6 md:px-8 py-3 rounded-full hover:bg-[#1e2b1e] transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 text-sm md:text-base font-medium flex items-center justify-center gap-2"
    >
      <span>{t('dashboard.header.cta')}</span>
      <ArrowRight className="w-4 h-4 md:w-5 md:h-5" />
    </button>
  </div>
);
