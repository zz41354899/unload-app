import React from 'react';
import { FadeIn } from '../../ui/FadeIn';
import { Sparkles } from 'lucide-react';

export const BlogIndexPage: React.FC = () => {
  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <span className="text-secondary-accent text-xs tracking-[0.2em] uppercase block mb-4 text-center">
            Insights
          </span>
          <h1 className="text-4xl font-light text-primary mb-10 text-center">洞察日誌</h1>

          <div className="flex flex-col items-center justify-center py-16 border-t border-secondary-light/60 border-b border-secondary-light/30">
            <div className="w-16 h-16 rounded-full bg-secondary-light/30 flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6 text-secondary-accent" strokeWidth={1} />
            </div>
            <p className="text-primary font-light text-lg tracking-wide mb-2">內容正在與潛意識整合中...</p>
            <p className="text-sm text-primary-light/60 font-light">未來會在這裡發布實際的深度文章。</p>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
