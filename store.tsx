
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, User } from './types';
import { loadTasksFromDb, saveTasksToDb } from './lib/idbClient';

interface AppContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'date'>) => string;
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
    // 初始化時載入使用者與任務資料
    const storedUser = localStorage.getItem('unload_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // 透過 IndexedDB 載入任務，若尚無資料會回傳空陣列或從 localStorage 遷移
    void (async () => {
      const initialTasks = await loadTasksFromDb();
      setTasks(initialTasks ?? []);
    })();
  }, []);

  useEffect(() => {
    // 每次任務變動時同步到 IndexedDB（並由 helper 內部維護 localStorage 備份）
    void saveTasksToDb(tasks);
  }, [tasks]);


  const login = (userData: User) => {
    // 之後會由 Supabase Google 登入回傳真實使用者資料（含頭像與 email）
    setUser(userData);
    localStorage.setItem('unload_user', JSON.stringify(userData));
  };

  const logout = () => {
    // 登出時僅清除使用者登入資訊，保留本機已記錄的任務資料
    setUser(null);
    localStorage.removeItem('unload_user');
  };

  const addTask = (taskData: Omit<Task, 'id' | 'date'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      date: new Date().toISOString(),
    };
    setTasks(prev => [newTask, ...prev]);
    return newTask.id;
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
