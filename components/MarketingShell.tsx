import React, { useEffect, useState } from 'react';
import { Navigation } from './Navigation';
import { Footer } from './common/Footer';
import { AboutPage } from './pages/AboutPage';
import { BlogPage } from './pages/BlogPage';
import { JoinPage } from './pages/JoinPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { HomePage } from './pages/HomePage/HomePage';

export type MarketingShellProps = {
  onEnterApp: () => void;
};

export const MarketingShell: React.FC<MarketingShellProps> = ({ onEnterApp }) => {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'about':
        return <AboutPage />;
      case 'blog':
        return <BlogPage />;
      case 'join':
        return <JoinPage onComplete={onEnterApp} />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      default:
        return <HomePage onNavigate={setCurrentPage} />;
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans">
      <Navigation currentPage={currentPage} onNavigate={setCurrentPage} onEnterApp={onEnterApp} />
      <main className="animate-in fade-in duration-500">
        {renderPage()}
      </main>
      <Footer onNavigate={setCurrentPage} />
    </div>
  );
};
