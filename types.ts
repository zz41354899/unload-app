
export enum TaskCategory {
  Interview = '面試相關',
  Resume = '履歷與作品集',
  CareerDirection = '職涯方向不確定',
  JobSearchPressure = '求職進度壓力',
  FamilyExpectation = '家人與伴侶期待',
  FinancialPressure = '財務壓力',
  MarketCompetition = '市場競爭',
  Other = '其他'
}

export enum TaskWorry {
  Performance = '我的表現',
  Rejection = '怕被拒絕',
  OthersThoughts = '他人怎麼看我',
  Pressure = '潛在壓力',
  Comparison = '比較心態',
  Anxiety = '期待焦慮',
  Decision = '無法做決定',
  Uncertainty = '不確定性',
  Other = '其他'
}

export enum ResponsibilityOwner {
  Mine = '我的課題',
  Theirs = '對方課題',
  Shared = '共同的課題'
}

export interface Task {
  id: string;
  date: string; // ISO string
  category: string | string[]; // Support single or multiple categories
  worry: string | string[];    // Support single or multiple worries
  owner: ResponsibilityOwner;
  controlLevel: number;
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
