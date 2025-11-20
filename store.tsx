
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, User } from './types';

interface AppContextType {
  user: User | null;
  login: () => void;
  logout: () => void;
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'date'>) => void;
  deleteTask: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);

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
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };


  return (
    <AppContext.Provider value={{ user, login, logout, tasks, addTask, deleteTask }}>
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
