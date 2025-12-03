
import React, { useState, useEffect, useState as useReactState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import './i18n';
import { useTranslation } from 'react-i18next';
import { AppProvider, useAppStore } from './store';
import { Layout } from './components/Layout';
import { MarketingShell } from './components/MarketingShell';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { NewTask } from './pages/NewTask';
import { Journal } from './pages/Journal';
import { Onboarding } from './pages/Onboarding';
import { supabase } from './lib/supabaseClient';

const AppContent: React.FC = () => {
  const { user, toast, login } = useAppStore();
  const [currentPage, setCurrentPage] = useState('login');
  const { t, i18n } = useTranslation();

  // 從 Supabase session 還原使用者資訊（例如 Google 登入後導回 /app/login）
  useEffect(() => {
    void (async () => {
      if (user) return; // 已有本地使用者就不需重新載入

      const { data, error } = await supabase.auth.getUser();
      if (error || !data.user) return;

      const profile = data.user.user_metadata as
        | { full_name?: string; name?: string; picture?: string; avatar_url?: string; has_onboarded?: boolean }
        | undefined;

      login({
        name: profile?.full_name || profile?.name || data.user.email || 'Guest',
        email: data.user.email ?? '',
        avatar: profile?.picture || profile?.avatar_url || 'https://picsum.photos/seed/unloadUser/200',
        hasOnboarded: profile?.has_onboarded ?? false,
      });
    })();
  }, [user, login]);

  // Simple Route Protection
  useEffect(() => {
    // user 狀態改變時才處理
    if (!user) {
      setCurrentPage('login');
      return;
    }

    // 已登入，但 currentPage 還在 login 的時候，根據 hasOnboarded 決定初始頁
    if (currentPage === 'login') {
      setCurrentPage(user.hasOnboarded ? 'dashboard' : 'onboarding');
    }
  }, [user]);

  // Keep <html lang="..."> in sync with current language (affects native date pickers)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language]);

  // 若尚未登入，直接顯示登入頁（行銷路由由外層 MarketingShell 負責）
  if (!user) {
    return <Login navigate={setCurrentPage} />;
  }

  // Special-case onboarding: full-screen without app layout / sidebar
  if (currentPage === 'onboarding') {
    return (
      <>
        <Onboarding navigate={setCurrentPage} />

        {/* Toast Notification */}
        {toast && (
          <div className="fixed bottom-8 right-8 z-[9999]">
            <div
              className={`px-6 py-4 rounded-lg shadow-2xl font-medium ${toast.type === 'success'
                  ? 'bg-white text-green-500'
                  : 'bg-white text-red-500'
                }`}
            >
              {toast.message}
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <>
      <Layout currentPage={currentPage} navigate={setCurrentPage}>
        {currentPage === 'dashboard' && <Dashboard navigate={setCurrentPage} />}
        {currentPage === 'history' && <History navigate={setCurrentPage} />}
        {currentPage === 'new-task' && <NewTask navigate={setCurrentPage} />}
        {currentPage === 'journal' && <Journal navigate={setCurrentPage} />}
      </Layout>

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-[9999]">
          <div className={`px-6 py-4 rounded-lg shadow-2xl font-medium ${toast.type === 'success' ? 'bg-white text-green-500' : 'bg-white text-red-500'
            }`}>
            {toast.message}
          </div>
        </div>
      )}
    </>
  );
};

const AppInner: React.FC = () => {
  const navigate = useNavigate();

  return (
    <AppProvider>
      <Routes>
        <Route path="/app/*" element={<AppContent />} />
        <Route
          path="/*"
          element={(
            <MarketingShell
              onEnterApp={() => {
                navigate('/app/login');
              }}
            />
          )}
        />
      </Routes>
    </AppProvider>
  );
};

const App: React.FC = () => <AppInner />;

export default App;
