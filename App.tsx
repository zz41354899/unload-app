
import React, { useState, useEffect } from 'react';
import { AppProvider, useAppStore } from './store';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { NewTask } from './pages/NewTask';
import { Journal } from './pages/Journal';

const AppContent: React.FC = () => {
  const { user, toast } = useAppStore();
  const [currentPage, setCurrentPage] = useState('login');

  // Simple Route Protection
  useEffect(() => {
    if (user) {
        if (currentPage === 'login') {
            setCurrentPage('dashboard');
        }
    } else {
        setCurrentPage('login');
    }
  }, [user, currentPage]);

  if (!user && currentPage === 'login') {
    return <Login navigate={setCurrentPage} />;
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
          <div className={`px-6 py-4 rounded-lg shadow-2xl font-medium ${
            toast.type === 'success' ? 'bg-white text-green-500' : 'bg-white text-red-500'
          }`}>
            {toast.message}
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
