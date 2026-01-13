import React, { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';
import { TabType, Member, UserSession, Activity } from './types';
import { ADMIN_CREDENTIALS } from './mockData';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import MemberList from './components/MemberList';
import MemberProfile from './components/MemberProfile';
import AddActivityForm from './components/AddActivityForm';
import AdminVerification from './components/AdminVerification';
import AddMemberForm from './components/AddMemberForm';
import Ranking from './components/Ranking';

const App: React.FC = () => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [activeTab, setActiveTab] = useState<TabType>(TabType.DASHBOARD);
  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loginForm, setLoginForm] = useState({ login: '', password: '' });
  const [loginError, setLoginError] = useState('');

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
      console.error("Ошибка загрузки:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();

    // Real-time подписка (чтобы отчеты появлялись у админа мгновенно)
    const subscription = supabase
      .channel('db-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, () => {
        fetchMembers();
      })
      .subscribe();

    return () => { supabase.removeChannel(subscription); };
  }, []);

  // 2. ВХОД В СИСТЕМУ
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

  // 3. ДОБАВЛЕНИЕ УЧАСТНИКА (С УЧЕТОМ ВСЕХ КОЛОНОК)
  const handleAddMember = async (newMember: Member) => {
    const { error } = await supabase
      .from('members')
      .insert([{
        id: newMember.id || Math.random().toString(36).substr(2, 9),
        name: newMember.name,
        position: newMember.position,
        login: newMember.login,
        password: newMember.password,
        efficiency: 0,
        activities: [],
        avatar: newMember.avatar || '',
        bio: newMember.bio || '',
        committee: newMember.committee || '',
        scores: [],
        role: 'MEMBER'
      }]);

    if (error) {
      alert("Ошибка при сохранении: " + error.message);
    } else {
      await fetchMembers();
      setActiveTab(TabType.MEMBERS);
      alert("Личный кабинет создан!");
    }
  };

  // 4. ОТПРАВКА ОТЧЕТА (ИСПРАВЛЕННАЯ ЛОГИКА)
  const handleAddActivity = async (data: any) => {
    if (!user?.memberId) return;
    const currentMember = members.find(m => m.id === user.memberId);
    if (!currentMember) return;

    const newActivity: Activity = {
      id: Math.random().toString(36).substr(2, 9),
      type: data.type,
      title: data.title,
      description: data.description,
      date: new Date().toISOString(),
      status: 'pending',
      points: data.type === 'project' ? 20 : 10,
      memberId: user.memberId,
    };

    const updatedActivities = [...(Array.isArray(currentMember.activities) ? currentMember.activities : []), newActivity];
    
    const { error } = await supabase
      .from('members')
      .update({ activities: updatedActivities })
      .eq('id', user.memberId);
    
    if (error) {
      alert("Ошибка отправки: " + error.message);
    } else {
      await fetchMembers();
      setActiveTab(TabType.MY_PROFILE);
      alert("Отчет отправлен на проверку!");
    }
  };

  // 5. ПОДТВЕРЖДЕНИЕ АДМИНОМ
  const handleVerifyActivity = async (memberId: string, activityId: string, status: 'verified' | 'rejected') => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const updatedActivities = member.activities.map((a: any) => 
      a.id === activityId ? { ...a, status } : a
    );

    let newEff = member.efficiency;
    if (status === 'verified') {
      const act = member.activities.find((a: any) => a.id === activityId);
      newEff = Math.min(100, member.efficiency + (act?.points || 0) / 10);
    }

    const { error } = await supabase
      .from('members')
      .update({ 
        activities: updatedActivities, 
        efficiency: Math.round(newEff) 
      })
      .eq('id', memberId);

    if (!error) await fetchMembers();
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
      <p className="text-white animate-pulse text-lg">Синхронизация данных...</p>
    </div>
  );

  if (!user) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl p-10 shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-8 text-slate-800">ParlTrack Cloud</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="text"
            placeholder="Логин"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600"
            value={loginForm.login}
            onChange={(e) => setLoginForm({ ...loginForm, login: e.target.value })}
          />
          <input
            type="password"
            placeholder="Пароль"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600"
            value={loginForm.password}
            onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
          />
          {loginError && <p className="text-red-500 text-xs font-bold">{loginError}</p>}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg">
            Войти
          </button>
        </form>
      </div>
    </div>
  );

  const currentMember = user.memberId ? members.find(m => m.id === user.memberId) : null;
  const pendingCount = members.reduce((acc, m) => 
    acc + (Array.isArray(m.activities) ? m.activities.filter((a: any) => a.status === 'pending').length : 0), 0
  );

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      user={user} 
      onLogout={() => setUser(null)} 
      pendingCount={pendingCount}
    >
      {activeTab === TabType.DASHBOARD && <Dashboard members={members} />}
      {activeTab === TabType.RANKING && <Ranking members={members} />}
      
      {activeTab === TabType.MEMBERS && (
        selectedMemberId ? (
          <div>
            <button onClick={() => setSelectedMemberId(null)} className="mb-4 text-blue-600 font-bold">← К списку</button>
            <MemberProfile member={members.find(m => m.id === selectedMemberId)!} />
          </div>
        ) : (
          <MemberList members={members} userRole={user.role} onMemberClick={setSelectedMemberId} onUpdateCredentials={() => {}} />
        )
      )}

      {activeTab === TabType.ADD_MEMBER && <AddMemberForm onAdd={handleAddMember} />}
      {activeTab === TabType.VERIFICATION && <AdminVerification members={members} onVerify={handleVerifyActivity} />}
      {activeTab === TabType.MY_PROFILE && currentMember && <MemberProfile member={currentMember} />}
      {activeTab === TabType.ADD_ACTIVITY && <AddActivityForm onSubmit={handleAddActivity} />}
    </Layout>
  );
};

export default App;