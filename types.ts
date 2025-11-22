export enum TaskCategory {
  Interview = '面試壓力',
  CareerPlanning = '職涯規劃',
  SelfConfusion = '自我迷惘',
  ProgressAnxiety = '時程壓力',
  ExpectationPressure = '他人期待',
  FinancialPressure = '財務壓力',
  MarketChange = '市場變動',
  Other = '其他'
}

export enum TaskWorry {
  Performance = '擔心表現',
  Rejection = '害怕拒絕',
  OthersThoughts = '在意眼光',
  Pressure = '隱性壓力',
  Comparison = '比較焦慮',
  TimeStress = '時間緊迫',
  Decision = '難以決定',
  Uncertainty = '未來不明',
  Other = '其他'
}

export enum ResponsibilityOwner {
  Mine = '我能掌控的部分',
  Theirs = '不在我範圍內的部分',
  Shared = '共同的影響部分'
}


export interface Task {
  id: string;
  date: string; // ISO string
  category: string | string[]; // Support single or multiple categories
  worry: string | string[];    // Support single or multiple worries
  owner: ResponsibilityOwner;
  controlLevel: number;
  reflection?: string; // 反思筆記
}

export interface User {
  name: string;
  email: string;
  avatar: string;
}

export enum NotificationType {
  System = 'system',
  ChangeLog = 'changelog'
}

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  date: string;
  read: boolean;
  imageUrl?: string; // Added for rich media preview
}
