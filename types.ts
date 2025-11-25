export enum TaskCategory {
  Interview = 'Interview',
  CareerPlanning = 'CareerPlanning',
  SelfConfusion = 'SelfConfusion',
  ProgressAnxiety = 'ProgressAnxiety',
  ExpectationPressure = 'ExpectationPressure',
  FinancialPressure = 'FinancialPressure',
  MarketChange = 'MarketChange',
  Other = 'Other'
}

export enum TaskWorry {
  Performance = 'Performance',
  Rejection = 'Rejection',
  OthersThoughts = 'OthersThoughts',
  Pressure = 'Pressure',
  Comparison = 'Comparison',
  TimeStress = 'TimeStress',
  Decision = 'Decision',
  Uncertainty = 'Uncertainty',
  Other = 'Other'
}

export enum ResponsibilityOwner {
  Mine = 'Mine',
  Theirs = 'Theirs',
  Shared = 'Shared'
}


export interface Task {
  id: string;
  date: string; // ISO string
  category: string | string[]; // Support single or multiple categories
  worry: string | string[];    // Support single or multiple worries
  owner: ResponsibilityOwner;
  controlLevel: number;
  reflection?: string; // 反思日記
}

export interface User {
  name: string;
  email: string;
  avatar: string;
  hasOnboarded?: boolean;
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
