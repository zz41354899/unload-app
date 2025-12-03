import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';
import * as prismic from '@prismicio/client';
import { FadeIn } from '../../ui/FadeIn';
import { prismicClient, type PrismicBlogPost } from '../../../lib/prismicClient';

export const BlogIndexPage: React.FC = () => {
  const [posts, setPosts] = useState<PrismicBlogPost[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const documents = await prismicClient.getAllByType<PrismicBlogPost>('blog_post', {
          orderings: [
            {
              field: 'my.blog_post.published_at',
              direction: 'desc',
            },
          ],
        });

        setPosts(documents);
      } catch (error) {
        setPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    void loadPosts();
  }, []);

  const renderTitle = (doc: PrismicBlogPost) => {
    if (!doc.data.title) {
      return '未命名文章';
    }

    return prismic.asText(doc.data.title) || '未命名文章';
  };

  const renderExcerpt = (doc: PrismicBlogPost) => {
    if (!doc.data.excerpt) {
      return '這篇文章尚未填寫摘要。';
    }

    return prismic.asText(doc.data.excerpt);
  };

  const renderDate = (doc: PrismicBlogPost) => {
    const source = doc.data.published_at ?? new Date().toISOString();
    const date = new Date(source);

    if (Number.isNaN(date.getTime())) {
      return new Date().toLocaleDateString('zh-TW');
    }

    return date.toLocaleDateString('zh-TW');
  };

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        <FadeIn>
          <span className="text-secondary-accent text-xs tracking-[0.2em] uppercase block mb-4 text-center">
            Insights
          </span>
          <h1 className="text-4xl font-light text-primary mb-10 text-center">洞察日誌</h1>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 border-t border-secondary-light/60 border-b border-secondary-light/30">
              <div className="w-16 h-16 rounded-full bg-secondary-light/30 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-secondary-accent" strokeWidth={1} />
              </div>
              <p className="text-primary font-light text-lg tracking-wide mb-2">正在載入洞察日誌...</p>
              <p className="text-sm text-primary-light/60 font-light">請稍候，正在從 Prismic 取得內容。</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 border-t border-secondary-light/60 border-b border-secondary-light/30">
              <div className="w-16 h-16 rounded-full bg-secondary-light/30 flex items-center justify-center mb-6">
                <Sparkles className="w-6 h-6 text-secondary-accent" strokeWidth={1} />
              </div>
              <p className="text-primary font-light text-lg tracking-wide mb-2">內容正在與潛意識整合中...</p>
              <p className="text-sm text-primary-light/60 font-light">當第一篇洞察誕生時，它會自動浮現在這裡。</p>
            </div>
          ) : (
            <div className="space-y-8 border-t border-secondary-light/60 pt-8">
              {posts.map((post) => (
                <article key={post.id} className="group border-b border-secondary-light/40 pb-8 last:border-b-0">
                  <Link to={`/blog/${post.uid ?? ''}`} className="block">
                    <p className="text-xs text-primary-light/60 mb-2">{renderDate(post)}</p>
                    <h2 className="text-2xl font-light text-primary mb-1 group-hover:text-secondary-accent transition-colors">
                      {renderTitle(post)}
                    </h2>
                    <span className="inline-flex items-center text-xs text-secondary-accent group-hover:translate-x-0.5 transition-transform mt-2">
                      閱讀文章
                    </span>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </FadeIn>
      </div>
    </div>
  );
};
