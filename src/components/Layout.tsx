import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, UserPlus, CheckSquare, 
  User, PlusCircle, LogOut, Bell, Trophy, ClipboardList, X
} from 'lucide-react';
import { TabType, UserSession, AppNotification } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: UserSession;
  onLogout: () => void;
  pendingCount: number;
  notifications: AppNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<AppNotification[]>>;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, activeTab, setActiveTab, user, onLogout, 
  pendingCount, notifications, setNotifications 
}) => {
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const isAdmin = user.role === 'ADMIN';

  // Пометить уведомление как прочитанное
  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-900">
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-white border-r border-slate-100 flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-500/30">З</div>
          <div>
            <h1 className="text-lg font-black tracking-tight text-slate-800">Зачётка МП</h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Control Panel</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4">
          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Главное</p>
          
          <MenuButton 
            active={activeTab === TabType.DASHBOARD} 
            onClick={() => setActiveTab(TabType.DASHBOARD)}
            icon={<LayoutDashboard size={20} />} 
            label="Дашборд" 
          />
          <MenuButton 
            active={activeTab === TabType.RANKING} 
            onClick={() => setActiveTab(TabType.RANKING)}
            icon={<Trophy size={20} />} 
            label="Рейтинг" 
          />
          <MenuButton 
            active={activeTab === TabType.TASKS} 
            onClick={() => setActiveTab(TabType.TASKS)}
            icon={<ClipboardList size={20} />} 
            label="Задачи" 
          />

          <p className="px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-8 mb-4">
            {isAdmin ? 'Управление' : 'Мой кабинет'}
          </p>

          {isAdmin ? (
            <>
              <MenuButton 
                active={activeTab === TabType.MEMBERS} 
                onClick={() => setActiveTab(TabType.MEMBERS)}
                icon={<Users size={20} />} 
                label="Состав МП" 
              />
              <MenuButton 
                active={activeTab === TabType.VERIFICATION} 
                onClick={() => setActiveTab(TabType.VERIFICATION)}
                icon={<CheckSquare size={20} />} 
                label="Верификация" 
                badge={pendingCount > 0 ? pendingCount : undefined}
              />
              <MenuButton 
                active={activeTab === TabType.ADD_MEMBER} 
                onClick={() => setActiveTab(TabType.ADD_MEMBER)}
                icon={<UserPlus size={20} />} 
                label="Новый участник" 
              />
            </>
          ) : (
            <>
              <MenuButton 
                active={activeTab === TabType.MY_PROFILE} 
                onClick={() => setActiveTab(TabType.MY_PROFILE)}
                icon={<User size={20} />} 
                label="Мой профиль" 
              />
              <MenuButton 
                active={activeTab === TabType.ADD_ACTIVITY} 
                onClick={() => setActiveTab(TabType.ADD_ACTIVITY)}
                icon={<PlusCircle size={20} />} 
                label="Подать отчет" 
              />
            </>
          )}
        </nav>

        <div className="p-6 border-t border-slate-50">
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-4 px-4 py-4 rounded-2xl text-red-500 font-bold text-sm hover:bg-red-50 transition-all group"
          >
            <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
            Выйти
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-slate-100 px-10 flex items-center justify-between sticky top-0 z-40">
          <div className="flex flex-col">
            <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">
              {activeTab.replace('_', ' ')}
            </h2>
            <p className="text-[11px] text-slate-400 font-medium">Добро пожаловать, {user.name}</p>
          </div>

          <div className="flex items-center gap-4">
            {/* Уведомления */}
            <div className="relative">
              <button 
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                className={`relative p-3 rounded-2xl transition-all ${isNotifOpen ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/40' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                )}
              </button>

              {/* Выпадающее окно уведомлений */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-4 w-80 bg-white rounded-[2rem] shadow-[0_20px_60px_rgba(0,0,0,0.15)] border border-slate-100 z-50 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                  <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Уведомления</span>
                    <button onClick={() => setIsNotifOpen(false)}><X size={16} className="text-slate-400" /></button>
                  </div>
                  <div className="max-h-[350px] overflow-y-auto p-2">
                    {notifications.length > 0 ? (
                      notifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => markAsRead(n.id)}
                          className={`p-4 rounded-2xl mb-1 cursor-pointer transition-all hover:bg-slate-50 ${!n.isRead ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="flex gap-3">
                            <div className={`mt-1 ${n.type === 'success' ? 'text-emerald-500' : n.type === 'warning' ? 'text-red-500' : 'text-blue-500'}`}>
                              <div className="w-1.5 h-1.5 rounded-full bg-current" />
                            </div>
                            <div>
                              <p className="text-[11px] font-black uppercase text-slate-800 leading-tight">{n.title}</p>
                              <p className="text-[12px] text-slate-500 mt-1 leading-snug">{n.message}</p>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="py-12 text-center">
                        <p className="text-slate-300 text-xs italic font-medium">Уведомлений пока нет</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="h-10 w-[1px] bg-slate-100 mx-2" />
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-100">
              <div className="w-8 h-8 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600">
                <User size={18} />
              </div>
              <span className="text-xs font-black text-slate-700 uppercase tracking-tighter">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-10">
          <div className="max-w-6xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

// Вспомогательный компонент кнопки меню
const MenuButton: React.FC<{
  active: boolean; 
  onClick: () => void; 
  icon: React.ReactNode; 
  label: string;
  badge?: number;
}> = ({ active, onClick, icon, label, badge }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl transition-all duration-300 group ${
      active 
        ? 'bg-blue-600 text-white shadow-xl shadow-blue-500/25 translate-x-1' 
        : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
    }`}
  >
    <div className="flex items-center gap-4">
      <span className={`${active ? 'scale-110' : 'group-hover:scale-110'} transition-transform duration-300`}>
        {icon}
      </span>
      <span className={`text-sm font-bold tracking-tight ${active ? 'text-white' : 'text-slate-600 group-hover:text-slate-900'}`}>
        {label}
      </span>
    </div>
    {badge && (
      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-black ${active ? 'bg-white text-blue-600' : 'bg-blue-100 text-blue-600'}`}>
        {badge}
      </span>
    )}
  </button>
);

export default Layout;