
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, User } from './types';

interface AppContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'date'>) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  toast: { message: string; type: 'success' | 'error' } | null;
  shouldShowNps: boolean;
  openNps: () => void;
  closeNps: () => void;
  completeOnboarding: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [shouldShowNps, setShouldShowNps] = useState(false);

  useEffect(() => {
    // Load from local storage
    const storedUser = localStorage.getItem('unload_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const storedTasks = localStorage.getItem('unload_tasks');
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    } else {
      setTasks([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('unload_tasks', JSON.stringify(tasks));
  }, [tasks]);


  const login = () => {
    const dummyUser: User = {
      name: 'Sarah Chen',
      email: 'sarah@example.com',

      avatar: 'https://picsum.photos/seed/unloadUser/200',
      hasOnboarded: false
    };
    setUser(dummyUser);
    localStorage.setItem('unload_user', JSON.stringify(dummyUser));
  };

  const logout = () => {
    // 清空使用者與本地儲存的登入資訊
    setUser(null);
    localStorage.removeItem('unload_user');

    // 同時清空任務資料，讓每次登入都是乾淨狀態
    setTasks([]);
    localStorage.removeItem('unload_tasks');
  };

  const addTask = (taskData: Omit<Task, 'id' | 'date'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const openNps = () => {
    setShouldShowNps(true);
  };

  const closeNps = () => {
    setShouldShowNps(false);
  };

  const completeOnboarding = () => {
    if (user) {
      const updatedUser = { ...user, hasOnboarded: true };
      setUser(updatedUser);
      localStorage.setItem('unload_user', JSON.stringify(updatedUser));
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        tasks,
        addTask,
        deleteTask,
        updateTask,
        showToast,
        toast,
        shouldShowNps,
        openNps,
        closeNps,
        completeOnboarding,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
