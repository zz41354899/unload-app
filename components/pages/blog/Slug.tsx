import React, { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import * as prismic from '@prismicio/client';
import { FadeIn } from '../../ui/FadeIn';
import { prismicClient, type PrismicBlogPost } from '../../../lib/prismicClient';

export const BlogSlugPage: React.FC = () => {
  const location = useLocation();
  const slug = useMemo(() => {
    const path = location.pathname || '';
    if (!path.startsWith('/blog/')) return '';
    return path.slice('/blog/'.length) || '';
  }, [location.pathname]);
  const [post, setPost] = useState<PrismicBlogPost | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isNotFound, setIsNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (!slug) {
      setIsLoading(false);
      setIsNotFound(true);
      return;
    }

    const loadPost = async () => {
      try {
        const document = await prismicClient.getByUID<PrismicBlogPost>('blog_post', slug);
        setPost(document);
      } catch (error) {
        setIsNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };

    void loadPost();
  }, [slug]);

  const title = post?.data.title ? prismic.asText(post.data.title) : slug ?? '未命名';
  const dateText = (() => {
    if (!post) {
      return new Date().toLocaleDateString('zh-TW');
    }

    const source = post.data.published_at ?? new Date().toISOString();
    const date = new Date(source);

    if (Number.isNaN(date.getTime())) {
      return new Date().toLocaleDateString('zh-TW');
    }

    return date.toLocaleDateString('zh-TW');
  })();

  const contentHtml = post?.data.content ? prismic.asHTML(post.data.content) : '';

  return (
    <div className="pt-32 pb-20 min-h-screen">
      <div className="max-w-3xl mx-auto px-6">
        <FadeIn>
          <p className="text-secondary-accent text-xs tracking-[0.2em] uppercase mb-4">Blog</p>

          {isLoading ? (
            <p className="text-sm text-primary-light/70">正在載入文章內容...</p>
          ) : isNotFound ? (
            <>
              <h1 className="text-3xl md:text-4xl font-light text-primary mb-4">找不到這篇文章</h1>
              <p className="text-sm text-primary-light/70 mb-6">請確認網址是否正確，或稍後再試一次。</p>
            </>
          ) : (
            <>
              {post?.data.cover_image?.url && (
                <div className="mb-8 overflow-hidden rounded-2xl border border-secondary-light/40 bg-secondary-light/20">
                  <img
                    src={post.data.cover_image.url}
                    alt={post.data.cover_image.alt ?? title}
                    className="h-48 w-full object-cover md:h-64"
                  />
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-light text-primary mb-2 break-words">{title}</h1>
              <p className="text-xs text-primary-light/60 mb-6">發佈於 {dateText}</p>
              {contentHtml ? (
                <div
                  className="prose-blog"
                  dangerouslySetInnerHTML={{ __html: contentHtml }}
                />
              ) : (
                <p className="text-sm text-primary-light/70">這篇文章尚未填寫內容。</p>
              )}
            </>
          )}

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
