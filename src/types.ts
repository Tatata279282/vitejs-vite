export enum TabType {
  DASHBOARD = 'DASHBOARD',
  MEMBERS = 'MEMBERS',
  ADD_MEMBER = 'ADD_MEMBER',
  VERIFICATION = 'VERIFICATION',
  MY_PROFILE = 'MY_PROFILE',
  ADD_ACTIVITY = 'ADD_ACTIVITY',
  RANKING = 'RANKING',
  AI_REPORT = 'AI_REPORT',
  TASKS = 'TASKS'
}

export interface Activity {
  id: string;
  type: 'project' | 'event' | 'meeting' | 'other';
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'verified' | 'rejected';
  points: number;
  memberId: string;
}

export interface Member {
  id: string;
  name: string;
  position: string; // Важно: для закрытия задач комитета здесь должно быть "Руководитель..."
  committee: string;
  efficiency: number;
  login: string;
  password?: string;
  activities: Activity[];
  role: 'ADMIN' | 'MEMBER';
}

export interface UserSession {
  role: 'ADMIN' | 'MEMBER';
  memberId?: string;
  name: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignee_id?: string; // ID конкретного пользователя
  committee?: string;   // Название комитета (если задача общая)
  due_date: string;
  status: 'pending' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  /** * Текстовый отчет о выполнении задачи. 
   * Заполняется участником при закрытии.
   */
  result_text?: string; 
}

export interface AppNotification {
  id: string;
  userId: string; // 'ADMIN' для всех админов или конкретный ID участника
  title: string;
  message: string;
  type: 'success' | 'warning' | 'info' | 'task';
  isRead: boolean;
  timestamp: Date;
}