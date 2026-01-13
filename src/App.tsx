import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { TabType, Member, UserSession, Activity, AppNotification, Task } from './types';
import { ADMIN_CREDENTIALS } from './mockData';

// Импорт компонентов
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import AddActivityForm from './components/AddActivityForm';
import AdminVerification from './components/AdminVerification';
import AddMemberForm from './components/AddMemberForm';
import Ranking from './components/Ranking';
import Tasks from './components/Tasks';
import Members from './components/Members';
import MemberProfile from './components/MemberProfile';

const App: React.FC = () => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.DASHBOARD);
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [loginError, setLoginError] = useState('');
  
  // Состояние персональных уведомлений
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  // 1. ЗАГРУЗКА ДАННЫХ
  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select('*')
        .order('efficiency', { ascending: false });
      
      if (error) throw error;
      if (data) setMembers(data);
    } catch (err: any) {
      console.error("Ошибка загрузки данных:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // 2. УВЕДОМЛЕНИЯ
  const addNotification = (targetUserId: string, title: string, message: string, type: AppNotification['type']) => {
    const newNotif: AppNotification = {
      id: Math.random().toString(36).substr(2, 9),
      userId: targetUserId,
      title,
      message,
      type,
      isRead: false,
      timestamp: new Date()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // 3. ЛОГИКА БАЛЛОВ И ШТРАФОВ
  
  // Начисление за задачи (автоматическое распределение)
  const handleAwardTaskPoints = async (taskId: string, points: number, task: Task) => {
    try {
      if (task.assignee_id) {
        await handleManualAward(task.assignee_id, points, `Баллы за задачу: ${task.title}`);
      } else if (task.committee) {
        const committeeMembers = members.filter(m => m.committee === task.committee);
        for (const m of committeeMembers) {
          await handleManualAward(m.id, points, `Командные баллы: ${task.title}`);
        }
      }
      addNotification('ADMIN', 'Успех', 'Баллы распределены', 'success');
    } catch (err) {
      console.error("Ошибка начисления:", err);
    }
  };

  // Ручное начисление (через вкладку Members)
  const handleManualAward = async (memberId: string, points: number, reason: string = 'Поощрение от админа') => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const newEff = Math.min(100, (member.efficiency || 0) + points);
    const { error } = await supabase.from('members').update({ efficiency: newEff }).eq('id', memberId);
    
    if (!error) {
      addNotification(memberId, 'Начисление баллов', `${reason} (+${points})`, 'success');
      await fetchMembers();
    }
  };

  // Штраф (через вкладку Members)
  const handlePenalty = async (memberId: string, penaltyPoints: number) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const newEff = Math.max(0, (member.efficiency || 0) - penaltyPoints);
    const { error } = await supabase.from('members').update({ efficiency: newEff }).eq('id', memberId);

    if (!error) {
      addNotification(memberId, 'Снижение рейтинга', `Ваш КПД снижен на ${penaltyPoints} за нарушение`, 'warning');
      await fetchMembers();
    }
  };

  // 4. АВТОРИЗАЦИЯ
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (loginForm.login === ADMIN_CREDENTIALS.login && loginForm.password === ADMIN_CREDENTIALS.password) {
      setUser({ role: 'ADMIN', name: 'Администратор' });
      setActiveTab(TabType.DASHBOARD);
      return;
    }

    const member = members.find(m => m.login === loginForm.login && m.password === loginForm.password);
    if (member) {
      setUser({ role: 'MEMBER', memberId: member.id, name: member.name });
      setActiveTab(TabType.MY_PROFILE);
    } else {
      setLoginError('Неверный логин или пароль');
    }
  };

  // 5. ДЕЙСТВИЯ С ОТЧЕТАМИ
  const handleVerifyActivity = async (memberId: string, activityId: string, status: 'verified' | 'rejected') => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const updatedActivities = member.activities.map((a: any) => 
      a.id === activityId ? { ...a, status } : a
    );

    let newEff = member.efficiency;
    if (status === 'verified') {
      const act = member.activities.find((a: any) => a.id === activityId);
      newEff = Math.min(100, member.efficiency + (act?.points || 10) / 10);
      addNotification(memberId, 'Отчет принят', 'Ваш КПД вырос!', 'success');
    }

    const { error } = await supabase.from('members').update({ 
      activities: updatedActivities, 
      efficiency: Math.round(newEff) 
    }).eq('id', memberId);

    if (!error) await fetchMembers();
  };

  const handleAddActivity = async (data: any) => {
    if (!user?.memberId) return;
    const currentMember = members.find(m => m.id === user.memberId);
    if (!currentMember) return;

    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      date: new Date().toISOString(),
      status: 'pending',
      points: data.type === 'project' ? 20 : 10,
      memberId: user.memberId,
    };

    const updatedActivities = [...(currentMember.activities || []), newActivity];
    const { error } = await supabase.from('members').update({ activities: updatedActivities }).eq('id', user.memberId);
    
    if (!error) {
      await fetchMembers();
      setActiveTab(TabType.MY_PROFILE);
      addNotification('ADMIN', 'Новый отчет', `Участник ${user.name} ожидает проверки`, 'info');
    }
  };

  // РЕНДЕРИНГ
  if (loading) return <div className="h-screen bg-slate-900 flex items-center justify-center text-white">Загрузка...</div>;

  if (!user) return (
    <div className="min-h-screen bg-[#0F172A] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-[3rem] p-12 shadow-2xl">
        <h1 className="text-3xl font-black text-slate-800 text-center mb-10 text-blue-600">Зачётка МП</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input 
            type="text" placeholder="Логин" 
            className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold"
            value={loginForm.login} onChange={e => setLoginForm({...loginForm, login: e.target.value})}
          />
          <input 
            type="password" placeholder="Пароль" 
            className="w-full px-6 py-4 bg-slate-50 rounded-2xl outline-none font-bold"
            value={loginForm.password} onChange={e => setLoginForm({...loginForm, password: e.target.value})}
          />
          {loginError && <p className="text-red-500 text-xs font-bold text-center">{loginError}</p>}
          <button className="w-full bg-blue-600 text-white font-black py-5 rounded-2xl shadow-lg">ВОЙТИ</button>
        </form>
      </div>
    </div>
  );

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      user={user} 
      onLogout={() => setUser(null)} 
      pendingCount={members.reduce((acc, m) => acc + (m.activities?.filter(a => a.status === 'pending').length || 0), 0)}
      notifications={notifications}
      setNotifications={setNotifications}
    >
      {activeTab === TabType.DASHBOARD && <Dashboard members={members} />}
      {activeTab === TabType.RANKING && <Ranking members={members} />}
      
      {activeTab === TabType.TASKS && (
        <Tasks 
          userRole={user.role} 
          userId={user.memberId} 
          members={members} 
          onTaskCreated={() => addNotification('ADMIN', 'Новое задание', 'Добавлена новая задача в реестр', 'task')}
          onAwardPoints={handleAwardTaskPoints}
          onTaskCompleted={(title, name) => addNotification('ADMIN', 'Задача выполнена', `${name} прислал отчет по "${title}"`, 'success')}
        />
      )}

      {activeTab === TabType.MEMBERS && (
        <Members 
          members={members} 
          isAdmin={user.role === 'ADMIN'} 
          onPenalty={handlePenalty}
          onAward={(id, pts) => handleManualAward(id, pts)}
        />
      )}

      {activeTab === TabType.ADD_MEMBER && (
        <AddMemberForm onAdd={async (newM) => {
          const { error } = await supabase.from('members').insert([{...newM, efficiency: 0, activities: []}]);
          if (!error) { fetchMembers(); setActiveTab(TabType.MEMBERS); }
        }} />
      )}
      
      {activeTab === TabType.VERIFICATION && <AdminVerification members={members} onVerify={handleVerifyActivity} />}
      {activeTab === TabType.MY_PROFILE && <MemberProfile member={members.find(m => m.id === user.memberId)!} />}
      {activeTab === TabType.ADD_ACTIVITY && <AddActivityForm onSubmit={handleAddActivity} />}
    </Layout>
  );
};

export default App;