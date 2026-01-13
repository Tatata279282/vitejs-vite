import React, { useMemo } from 'react';
import { Member } from '../types';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  Cell, PieChart, Pie 
} from 'recharts';
import { 
  TrendingUp, Users, Target, Award, Clock, 
  ChevronRight, AlertCircle, CheckCircle2 
} from 'lucide-react';

interface DashboardProps {
  members: Member[];
}

const Dashboard: React.FC<DashboardProps> = ({ members }) => {
  const stats = useMemo(() => {
    const total = members.length;
    const avgEff = total > 0 ? Math.round(members.reduce((acc, m) => acc + m.efficiency, 0) / total) : 0;
    const totalActs = members.reduce((acc, m) => acc + (m.activities?.length || 0), 0);
    const pendingActs = members.reduce((acc, m) => 
      acc + (m.activities?.filter(a => a.status === 'pending').length || 0), 0);
    
    return { total, avgEff, totalActs, pendingActs };
  }, [members]);

  const chartData = useMemo(() => 
    [...members].sort((a, b) => b.efficiency - a.efficiency).slice(0, 8)
  , [members]);

  const committeeData = useMemo(() => {
    const counts: Record<string, number> = {};
    members.forEach(m => {
      const c = m.committee || 'Прочие';
      counts[c] = (counts[c] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [members]);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ef4444', '#06b6d4'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Ср. Эффективность" value={`${stats.avgEff}%`} icon={<TrendingUp className="text-blue-600" />} trend="+2.4% за месяц" color="blue" />
        <StatCard title="Состав МП" value={stats.total} icon={<Users className="text-emerald-600" />} trend="Все активны" color="emerald" />
        <StatCard title="Отчетов подано" value={stats.totalActs} icon={<Target className="text-purple-600" />} trend="В обработке" color="purple" />
        <StatCard title="На проверке" value={stats.pendingActs} icon={<Clock className="text-orange-600" />} trend="Требуют внимания" color="orange" isAlert={stats.pendingActs > 0} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-8 tracking-tight">Рейтинг Лидеров КПД</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 11}} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{borderRadius: '16px', border: 'none'}} />
                <Bar dataKey="efficiency" radius={[10, 10, 10, 10]} barSize={32}>
                  {chartData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#2563eb' : '#e2e8f0'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm text-center">
          <h3 className="text-xl font-bold text-slate-800 mb-8 tracking-tight text-left">Комитеты</h3>
          <div className="h-64 relative mx-auto">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={committeeData} innerRadius={70} outerRadius={90} paddingAngle={8} dataKey="value">
                  {committeeData.map((_, index) => <Cell key={`c-${index}`} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-800">{committeeData.length}</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase">Групп</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{title: string, value: string | number, icon: React.ReactNode, trend: string, color: string, isAlert?: boolean}> = ({ title, value, icon, trend, color, isAlert }) => (
  <div className={`bg-white p-6 rounded-[2rem] border transition-all ${isAlert ? 'border-orange-200 bg-orange-50/30' : 'border-slate-100'}`}>
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl bg-${color}-50`}>{icon}</div>
      {isAlert && <span className="flex h-2 w-2 rounded-full bg-orange-500 animate-ping" />}
    </div>
    <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</p>
    <h4 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h4>
    <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase">{trend}</p>
  </div>
);

export default Dashboard;