import React, { useState, useMemo } from 'react';
import { Member } from '../types';
import { User, Zap, Lock, Key, Search, Filter } from 'lucide-react';

interface MemberListProps {
  members: Member[];
  userRole: 'ADMIN' | 'MEMBER';
  onUpdateCredentials: (id: string, login: string, password?: string) => void;
  onMemberClick?: (id: string) => void;
}

const MemberList: React.FC<MemberListProps> = ({ members, userRole, onMemberClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommittee, setSelectedCommittee] = useState('Все');

  // Получаем список уникальных комитетов для фильтра
  const committees = useMemo(() => {
    const list = members.map(m => m.committee || 'Прочие');
    return ['Все', ...Array.from(new Set(list))];
  }, [members]);

  // Логика фильтрации
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCommittee = selectedCommittee === 'Все' || (member.committee || 'Прочие') === selectedCommittee;
    return matchesSearch && matchesCommittee;
  });

  return (
    <div className="space-y-6">
      {/* Заголовок и статистика */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Участники проекта</h2>
          <p className="text-slate-500 text-sm">Найдено: {filteredMembers.length} из {members.length}</p>
        </div>
        {userRole === 'ADMIN' && (
          <span className="text-[10px] bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-black uppercase tracking-widest border border-blue-100">
            Админ-панель
          </span>
        )}
      </div>

      {/* Панель инструментов (Поиск и Фильтр) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Поиск по имени..."
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <select
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl focus:ring-2 focus:ring-blue-500 text-sm outline-none appearance-none cursor-pointer"
            value={selectedCommittee}
            onChange={(e) => setSelectedCommittee(e.target.value)}
          >
            {committees.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* Сетка карточек */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all group"
          >
            <div className="flex items-start justify-between mb-4">
              <div 
                onClick={() => onMemberClick?.(member.id)}
                className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors cursor-pointer"
              >
                <User size={24} />
              </div>
              <div className="flex items-center bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-bold">
                <Zap size={14} className="mr-1" />
                {member.efficiency}%
              </div>
            </div>
            
            <div onClick={() => onMemberClick?.(member.id)} className="cursor-pointer">
              <h3 className="font-bold text-slate-800 text-lg mb-1 truncate">{member.name}</h3>
              <p className="text-slate-500 text-sm mb-1">{member.position}</p>
              <p className="text-blue-500 text-[10px] font-bold uppercase tracking-tight mb-4">
                {member.committee || 'Без комитета'}
              </p>
            </div>

            {userRole === 'ADMIN' && (
              <div className="mt-2 mb-4 p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                <div className="flex items-center text-[11px] text-slate-500">
                  <Lock size={12} className="mr-1 text-slate-400" />
                  <span className="font-mono">L: {member.login}</span>
                </div>
                <div className="flex items-center text-[11px] text-slate-500">
                  <Key size={12} className="mr-1 text-slate-400" />
                  <span className="font-mono font-bold text-slate-700">P: {member.password}</span>
                </div>
              </div>
            )}
            
            <button 
              onClick={() => onMemberClick?.(member.id)}
              className="w-full py-3 bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all"
            >
              Открыть профиль
            </button>
          </div>
        ))}
      </div>
      
      {filteredMembers.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 italic text-lg">По вашему запросу никто не найден...</p>
        </div>
      )}
    </div>
  );
};

export default MemberList;