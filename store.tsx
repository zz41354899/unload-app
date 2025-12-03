
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, User } from './types';
import { loadTasksFromDb, saveTasksToDb } from './lib/idbClient';
import { supabase } from './lib/supabaseClient';

interface AppContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  tasks: Task[];
  hasLoadedTasks: boolean;
  addTask: (task: Omit<Task, 'id' | 'date'>) => string;
  deleteTask: (id: string) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  showToast: (message: string, type?: 'success' | 'error') => void;
  toast: { message: string; type: 'success' | 'error' } | null;
  shouldShowNps: boolean;
  openNps: () => void;
  closeNps: () => void;
  completeOnboarding: () => void;
  isGuideOpen: boolean;
  openGuide: () => void;
  closeGuide: () => void;
  guideStep: number;
  setGuideStep: (step: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [shouldShowNps, setShouldShowNps] = useState(false);
  const [hasLoadedTasks, setHasLoadedTasks] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [guideStep, setGuideStepState] = useState(0);

  useEffect(() => {
    // 初始化時載入任務資料（使用 IndexedDB，不再依賴 localStorage）
    void (async () => {
      const initialTasks = await loadTasksFromDb();
      setTasks(initialTasks ?? []);
      // 稍微延遲切換 hasLoadedTasks，讓 skeleton UI 有明顯顯示時間
      setTimeout(() => {
        setHasLoadedTasks(true);
      }, 400);
    })();
  }, []);

  useEffect(() => {
    // 每次任務變動時同步到 IndexedDB（並由 helper 內部維護 localStorage 備份）
    if (!hasLoadedTasks) return;
    void saveTasksToDb(tasks);
  }, [tasks, hasLoadedTasks]);

  const login = (userData: User) => {
    // 之後會由 Supabase Google 登入回傳真實使用者資料（含頭像與 email）
    // 使用者狀態僅保存在記憶體，實際持久化交由 Supabase session 處理
    setUser(userData);
  };

  const logout = () => {
    // 登出時僅清除記憶體中的使用者登入資訊，保留本機已記錄的任務資料
    setUser(null);
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
      // 同步更新 Supabase 使用者 metadata，讓 hasOnboarded 狀態在不同裝置／新 session 也能保留
      void supabase.auth.updateUser({
        data: { has_onboarded: true },
      });
    }
  };

  const openGuide = () => {
    setIsGuideOpen(true);
    setGuideStepState(1);
  };

  const closeGuide = () => {
    setIsGuideOpen(false);
    setGuideStepState(0);
  };

  const setGuideStep = (step: number) => {
    setGuideStepState(step);
  };

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        tasks,
        hasLoadedTasks,
        addTask,
        deleteTask,
        updateTask,
        showToast,
        toast,
        shouldShowNps,
        openNps,
        closeNps,
        completeOnboarding,
        isGuideOpen,
        openGuide,
        closeGuide,
        guideStep,
        setGuideStep,
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
