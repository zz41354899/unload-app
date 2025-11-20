
import React, { useState, useEffect } from 'react';
import { AppProvider, useAppStore } from './store';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { NewTask } from './pages/NewTask';

const AppContent: React.FC = () => {
  const { user } = useAppStore();
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
    <Layout currentPage={currentPage} navigate={setCurrentPage}>
      {currentPage === 'dashboard' && <Dashboard navigate={setCurrentPage} />}
      {currentPage === 'history' && <History navigate={setCurrentPage} />}
      {currentPage === 'new-task' && <NewTask navigate={setCurrentPage} />}
    </Layout>
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
