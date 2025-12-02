import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Navigation } from './Navigation';
import { Footer } from './common/Footer';
import { AboutPage } from './pages/AboutPage';
import { BlogIndexPage } from './pages/blog/Index';
import { BlogSlugPage } from './pages/blog/Slug';
import { JoinPage } from './pages/JoinPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { HomePage } from './pages/HomePage/HomePage';

export type MarketingShellProps = {
  onEnterApp: () => void;
};

const pageIdToPath: Record<string, string> = {
  home: '/',
  about: '/about',
  blog: '/blog',
  join: '/join',
  privacy: '/privacy',
  terms: '/terms',
};

const pathToPageId = (pathname: string): string => {
  if (pathname.startsWith('/about')) return 'about';
  if (pathname.startsWith('/blog')) return 'blog';
  if (pathname.startsWith('/join')) return 'join';
  if (pathname.startsWith('/privacy')) return 'privacy';
  if (pathname.startsWith('/terms')) return 'terms';
  return 'home';
};

export const MarketingShell: React.FC<MarketingShellProps> = ({ onEnterApp }) => {
  const location = useLocation();
  const navigateRouter = useNavigate();

  const currentPage = pathToPageId(location.pathname);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [location.pathname]);

  const handleNavigate = (pageId: string) => {
    const path = pageIdToPath[pageId] ?? '/';
    navigateRouter(path);
  };

  const renderPage = () => {
    // /blog/:slug 顯示文章內頁，其餘 /blog 顯示列表
    if (location.pathname.startsWith('/blog/') && location.pathname.length > '/blog/'.length) {
      return <BlogSlugPage />;
    }

    switch (currentPage) {
      case 'about':
        return <AboutPage />;
      case 'blog':
        return <BlogIndexPage />;
      case 'join':
        return <JoinPage onComplete={onEnterApp} />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation currentPage={currentPage} onNavigate={handleNavigate} onEnterApp={onEnterApp} />
      <main className="animate-in fade-in duration-500">
        {renderPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
};
