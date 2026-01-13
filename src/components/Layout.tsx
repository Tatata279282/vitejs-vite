
import React from 'react';
import { TabType, UserSession } from '../types';

interface LayoutProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  user: UserSession;
  onLogout: () => void;
  children: React.ReactNode;
  pendingCount?: number;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, user, onLogout, children, pendingCount = 0 }) => {
  const isAdmin = user.role === 'ADMIN';

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 text-slate-900">
      <aside className="w-64 bg-slate-900 text-white flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <span className="bg-blue-600 p-1.5 rounded-lg">🏛️</span>
            ParlTrack
          </h1>
          <p className="text-slate-400 text-xs mt-1 uppercase tracking-widest">Digital Gradebook</p>
        </div>
        
        <nav className="flex-1 mt-6 px-4 space-y-2">
          {isAdmin ? (
            <>
              <NavItem active={activeTab === TabType.DASHBOARD} onClick={() => setActiveTab(TabType.DASHBOARD)} icon="📊" label="Общий Дашборд" />
              <NavItem active={activeTab === TabType.MEMBERS} onClick={() => setActiveTab(TabType.MEMBERS)} icon="👥" label="Участники" />
              <NavItem active={activeTab === TabType.ADD_MEMBER} onClick={() => setActiveTab(TabType.ADD_MEMBER)} icon="👤+" label="Добавить члена МП" />
              <NavItem active={activeTab === TabType.VERIFICATION} onClick={() => setActiveTab(TabType.VERIFICATION)} icon="✅" label="Верификация" badge={pendingCount > 0 ? pendingCount : undefined} />
              <NavItem active={activeTab === TabType.AI_REPORT} onClick={() => setActiveTab(TabType.AI_REPORT)} icon="🤖" label="AI-Аналитика" />
            </>
          ) : (
            <>
              <NavItem active={activeTab === TabType.MY_PROFILE} onClick={() => setActiveTab(TabType.MY_PROFILE)} icon="👤" label="Мой Кабинет" />
              <NavItem active={activeTab === TabType.ADD_ACTIVITY} onClick={() => setActiveTab(TabType.ADD_ACTIVITY)} icon="➕" label="Добавить отчет" />
              <NavItem active={activeTab === TabType.RANKING} onClick={() => setActiveTab(TabType.RANKING)} icon="🏆" label="Общий рейтинг" />
            </>
          )}
        </nav>
        
        <div className="p-6 border-t border-slate-800">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center font-bold text-xs uppercase">
              {user.name.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user.name}</p>
              <p className="text-xs text-slate-400">{isAdmin ? 'Администратор' : 'Член МП'}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full text-left text-xs text-slate-400 hover:text-white flex items-center gap-2 transition-colors"
          >
            🚪 Выйти из системы
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-8 flex-shrink-0">
          <h2 className="text-lg font-semibold text-slate-800">
            {activeTab === TabType.DASHBOARD && "Панель управления"}
            {activeTab === TabType.MY_PROFILE && "Личный кабинет"}
            {activeTab === TabType.VERIFICATION && "Модерация мероприятий"}
            {activeTab === TabType.ADD_ACTIVITY && "Подача отчета о деятельности"}
            {activeTab === TabType.MEMBERS && "Реестр парламентариев"}
            {activeTab === TabType.ADD_MEMBER && "Новый член парламента"}
            {activeTab === TabType.AI_REPORT && "Интеллектуальный аудит"}
            {activeTab === TabType.RANKING && "Рейтинг эффективности"}
          </h2>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            {new Date().toLocaleDateString('ru-RU')}
          </div>
        </header>
        
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

const NavItem: React.FC<{ active: boolean; onClick: () => void; icon: string; label: string; badge?: number }> = ({ active, onClick, icon, label, badge }) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
      active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white hover:bg-slate-800'
    }`}
  >
    <div className="flex items-center gap-3">
      <span className="text-lg w-6 flex justify-center">{icon}</span>
      <span className="font-medium text-sm">{label}</span>
    </div>
    {badge !== undefined && (
      <span className="bg-red-500 text-white text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center font-bold">
        {badge}
      </span>
    )}
  </button>
);

export default Layout;
