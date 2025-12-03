import { createClient } from '@supabase/supabase-js';

// 透過局部型別轉換存取 Vite 的環境變數，避免在專案中新增額外的 global 型別宣告
const env = (import.meta as unknown as { env: Record<string, string | undefined> }).env;
const supabaseUrl = env.VITE_SUPABASE_URL;
const supabaseAnonKey = env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // 在開發階段幫忙提醒 env 未設定；正式環境請確保已正確配置
  // eslint-disable-next-line no-console
  console.warn('[Supabase] VITE_SUPABASE_URL 或 VITE_SUPABASE_ANON_KEY 尚未設定，Google 登入將無法運作。');
}

export const supabase = createClient(
  supabaseUrl ?? '',
  supabaseAnonKey ?? '',
);
