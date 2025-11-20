
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, User, TaskCategory, TaskWorry, ResponsibilityOwner, AppNotification, NotificationType } from './types';

interface AppContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'date'>) => void;
  deleteTask: (id: string) => void;
  notifications: AppNotification[];
  markAllAsRead: () => void;
  toast: { message: string; type: 'success' | 'error' } | null;
  showToast: (message: string, type?: 'success' | 'error') => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [toast, setToastState] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

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

    // Load notifications or init with dummy change log
    const storedNotifs = localStorage.getItem('unload_notifications');
    if (storedNotifs) {
      setNotifications(JSON.parse(storedNotifs));
    } else {
      const initialLogs: AppNotification[] = [
        {
            id: 'log-1',
            type: NotificationType.ChangeLog,
            title: '全新「深呼吸」引導功能上線',
            message: '我們在覺察流程中加入了短暫的呼吸引導，幫助您在記錄煩惱前先穩定情緒。現在您可以在設定中開啟此功能，讓 Unload 陪伴您每一次的深呼吸。',
            date: '2025-11-18T10:00:00Z',
            read: false,
            imageUrl: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?q=80&w=2031&auto=format&fit=crop' // Zen/Meditation image
        },
        {
            id: 'log-2',
            type: NotificationType.ChangeLog,
            title: '隱私權政策與資料安全更新',
            message: '您的隱私是我們最重視的課題。我們更新了資料加密標準，確保您的每一次情緒記錄都只有您自己能看見。',
            date: '2025-11-12T09:00:00Z',
            read: false,
            imageUrl: 'https://images.unsplash.com/photo-1499209974431-9dddcece7f88?q=80&w=2000&auto=format&fit=crop' // Peaceful nature image
        }
      ];
      setNotifications(initialLogs);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('unload_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('unload_notifications', JSON.stringify(notifications));
  }, [notifications]);

  const login = () => {
    const dummyUser: User = {
      name: 'Sarah Chen',
      email: 'sarah@example.com',
      avatar: 'https://picsum.photos/seed/unloadUser/200'
    };
    setUser(dummyUser);
    localStorage.setItem('unload_user', JSON.stringify(dummyUser));
  };

  const logout = () => {
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

    // Add System Notification automatically
    const newNotif: AppNotification = {
        id: `sys-${Date.now()}`,
        type: NotificationType.System,
        title: '新覺察已建立',
        message: `您已成功新增一筆關於「${taskData.category}」的紀錄。`,
        date: new Date().toISOString(),
        read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToastState({ message, type });
    setTimeout(() => setToastState(null), 3000);
  };

  return (
    <AppContext.Provider value={{ user, login, logout, tasks, addTask, deleteTask, notifications, markAllAsRead, toast, showToast }}>
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
