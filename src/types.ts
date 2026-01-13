export type UserRole = 'ADMIN' | 'MEMBER';

export interface Activity {
  id: string;
  date: string;
  title: string;
  type: 'project' | 'media' | 'meeting' | 'community' | 'event' | 'other';
  points: number;
  status: 'pending' | 'verified' | 'rejected';
  description?: string;
  memberId: string;
}

export interface Member {
  id: string;
  name: string;
  avatar?: string;
  role: UserRole;
  position: string; 
  committee?: string;
  efficiency: number;
  activities: Activity[];
  bio?: string;
  login: string;
  password?: string;
  scores?: any; 
}

export enum TabType {
  DASHBOARD = 'dashboard',
  MEMBERS = 'members',
  RANKING = 'ranking',
  VERIFICATION = 'verification',
  MY_PROFILE = 'my_profile',
  ADD_ACTIVITY = 'add_activity',
  ADD_MEMBER = 'add_member',
  AI_REPORT = 'ai_report'
}

export interface UserSession {
  role: UserRole;
  memberId?: string;
  name: string;
}