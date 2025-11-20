
export enum TaskCategory {
  Work = '工作職場',
  Family = '家庭關係',
  Partner = '伴侶感情',
  Social = '人際社交',
  Self = '自我期許',
  Health = '健康狀態',
  Finance = '財務狀況',
  Other = '其他'
}

export enum TaskWorry {
  Performance = '我的表現',
  Dislike = '怕被討厭',
  OthersThoughts = '他人想法',
  Conflict = '潛在衝突',
  Comparison = '比較心態',
  Anxiety = '預期焦慮',
  CantRefuse = '無法拒絕',
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
  category: string; // Changed from TaskCategory to allow custom input
  worry: string;    // Changed from TaskWorry to allow custom input
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
