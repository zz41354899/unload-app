import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { FadeIn } from '../../ui/FadeIn';

export const BlogSlugPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <FadeIn>
          <p className="text-secondary-accent text-xs tracking-[0.2em] uppercase mb-4">Blog</p>
          <h1 className="text-3xl md:text-4xl font-light text-primary mb-6 break-words">
            文章：{slug ?? '未命名'}
          </h1>
          <p className="text-sm text-primary-light/70">
            這裡之後會根據 slug 從 CMS 或 Supabase 載入文章內容。目前先顯示 slug 以確認路由正確。
          </p>

          <div className="mt-8">
            <Link
              to="/blog"
              className="inline-flex items-center text-xs md:text-sm text-primary-light hover:text-primary transition-colors underline-offset-2 hover:underline"
            >
              返回洞察日誌列表
            </Link>
          </div>
        </FadeIn>
      </div>
    </div>
  );
};
