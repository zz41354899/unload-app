
import React, { useState, useEffect, useState as useReactState } from 'react';
import './i18n';
import { useTranslation } from 'react-i18next';
import { AppProvider, useAppStore } from './store';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { NewTask } from './pages/NewTask';
import { Journal } from './pages/Journal';
import { Onboarding } from './pages/Onboarding';

const AppContent: React.FC = () => {
  const { user, toast, shouldShowNps, closeNps } = useAppStore();
  const [currentPage, setCurrentPage] = useState('login');
  const [npsScore, setNpsScore] = useReactState<number | null>(null);
  const [npsComment, setNpsComment] = useReactState('');
  const { t, i18n } = useTranslation();

  // Simple Route Protection
  useEffect(() => {
    if (user) {
      if (currentPage === 'login') {
        if (user.hasOnboarded) {
          setCurrentPage('dashboard');
        } else {
          setCurrentPage('onboarding');
        }
      }
    } else {
      setCurrentPage('login');
    }
  }, [user, currentPage]);

  // Keep <html lang="..."> in sync with current language (affects native date pickers)
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = i18n.language;
    }
  }, [i18n.language]);

  // 若尚未登入，直接顯示登入頁（避免登出後還停留在舊頁面，需要手動重整）
  if (!user) {
    return <Login navigate={setCurrentPage} />;
  }

  const handleSubmitNps = () => {
    if (npsScore === null) {
      closeNps();
      return;
    }
    console.log('NPS Feedback:', {
      score: npsScore,
      comment: npsComment,
    });
    closeNps();
  };

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

      {/* Global NPS Toast (temporarily disabled for preview interviews) */}
      {false && shouldShowNps && (
        <div className="fixed bottom-6 right-6 z-[9999] w-full max-w-sm">
          <div className="bg-white border border-gray-200 rounded-2xl shadow-2xl p-4 space-y-3">
            <div className="flex items-start gap-2">
              <div>
                <p className="text-sm font-semibold text-text mb-1">{t('nps.title')}</p>
                <p className="text-xs text-gray-500">{t('nps.subtitle')}</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
                <button
                  key={score}
                  type="button"
                  onClick={() => setNpsScore(score)}
                  className={`w-8 h-8 rounded-full text-xs font-medium border transition-colors flex items-center justify-center ${npsScore === score
                      ? 'bg-primary text-white border-primary'
                      : 'bg-white text-text border-gray-200 hover:border-gray-300'
                    }`}
                >
                  {score}
                </button>
              ))}
            </div>

            <div>
              <textarea
                className="w-full mt-1.5 p-2 rounded-lg border border-gray-200 text-xs text-text placeholder-gray-300 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
                rows={2}
                placeholder={t('nps.placeholder')}
                value={npsComment}
                onChange={(e) => setNpsComment(e.target.value)}
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1 rounded-md"
                onClick={closeNps}
              >
                {t('nps.later')}
              </button>
              <button
                type="button"
                className="text-xs bg-primary text-white px-3 py-1.5 rounded-md hover:bg-[#1e2b1e] disabled:opacity-60 disabled:cursor-not-allowed"
                disabled={npsScore === null}
                onClick={handleSubmitNps}
              >
                {t('nps.submit')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
};

export default App;
