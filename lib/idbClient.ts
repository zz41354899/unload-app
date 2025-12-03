import { openDB } from 'idb';
import type { Task } from '../types';

// DB / Store 設定
const DB_NAME = 'unload_journal';
const DB_VERSION = 1;
const TASKS_STORE = 'tasks';

async function getDb() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(TASKS_STORE)) {
        db.createObjectStore(TASKS_STORE);
      }
    },
  });
}

// 將舊版以 key: 'all' 儲存的 Task 陣列遷移為「每個 task.id 一筆紀錄」。
// 僅在第一次讀取時執行一次，避免在升級流程中誤刪資料。
const migrateLegacyTasksIfNeeded = async (db: Awaited<ReturnType<typeof getDb>>): Promise<void> => {
  const tx = db.transaction(TASKS_STORE, 'readwrite');
  const store = tx.store;

  const legacy = (await store.get('all')) as Task[] | undefined;
  if (legacy && Array.isArray(legacy)) {
    for (const task of legacy) {
      if (task && typeof task.id === 'string') {
        // 以 task.id 作為 key，個別存一筆
        // 若已存在相同 id，put 會做覆寫，確保不會遺失較新的內容
        // eslint-disable-next-line no-await-in-loop
        await store.put(task, task.id);
      }
    }
    await store.delete('all');
  }

  await tx.done;
};

/**
 * 從 IndexedDB 載入所有 Task。
 * 僅使用 IndexedDB，不再依賴 localStorage。
 */
export const loadTasksFromDb = async (): Promise<Task[]> => {
  if (typeof indexedDB === 'undefined') {
    // 環境不支援 IndexedDB（例如 SSR），直接回傳空陣列
    return [];
  }

  const db = await getDb();
  // 若曾使用舊版結構，先做一次遷移
  await migrateLegacyTasksIfNeeded(db);

  const tx = db.transaction(TASKS_STORE, 'readonly');
  const store = tx.store;
  const tasks = (await store.getAll()) as Task[];
  await tx.done;

  return Array.isArray(tasks) ? tasks : [];
};

/**
 * 將 Task 陣列寫入 IndexedDB。
 *
 * 新版策略：
 * - 每個 task 以 task.id 為 key 儲存為一筆紀錄
 * - 載入時直接 getAll()
 * - 儲存時「先 clear 再批次寫入」，以目前的 tasks state 為真實來源
 */
export const saveTasksToDb = async (tasks: Task[]): Promise<void> => {
  if (typeof indexedDB !== 'undefined') {
    const db = await getDb();
    const tx = db.transaction(TASKS_STORE, 'readwrite');
    const store = tx.store;
    // 直接以當前狀態為真實來源：清空後批次寫入
    await store.clear();

    await Promise.all(
      tasks
        .filter(task => task && typeof task.id === 'string')
        .map(task => store.put(task, task.id)),
    );

    await tx.done;
  }
};
