import { openDB } from 'idb';
import type { Task } from '../types';

// DB / Store 設定
const DB_NAME = 'unload_journal';
const DB_VERSION = 1;
const TASKS_STORE = 'tasks';
const TASKS_KEY = 'all';

async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(TASKS_STORE)) {
        db.createObjectStore(TASKS_STORE);
      }
    },
  });
}

/**
 * 從 IndexedDB 載入所有 Task。
 * 若 DB 尚無資料，會嘗試從 localStorage 舊資料遷移一次。
 */
export const loadTasksFromDb = async (): Promise<Task[]> => {
  if (typeof indexedDB === 'undefined') {
    // 環境不支援 IndexedDB，退回 localStorage
    const storedTasks = localStorage.getItem('unload_tasks');
    return storedTasks ? (JSON.parse(storedTasks) as Task[]) : [];
  }

  const db = await getDb();
  const existing = (await db.get(TASKS_STORE, TASKS_KEY)) as Task[] | undefined;

  if (existing && Array.isArray(existing)) {
    return existing;
  }

  // 若 DB 尚無資料，嘗試從 localStorage 遷移
  const storedTasks = localStorage.getItem('unload_tasks');
  if (storedTasks) {
    const parsed = JSON.parse(storedTasks) as Task[];
    await db.put(TASKS_STORE, parsed, TASKS_KEY);
    return parsed;
  }

  return [];
};

/**
 * 將 Task 陣列寫入 IndexedDB，並維持 localStorage 作為備援。
 */
export const saveTasksToDb = async (tasks: Task[]): Promise<void> => {
  if (typeof indexedDB !== 'undefined') {
    const db = await getDb();
    await db.put(TASKS_STORE, tasks, TASKS_KEY);
  }

  // 仍同步一份到 localStorage，方便除錯與備援
  localStorage.setItem('unload_tasks', JSON.stringify(tasks));
};
