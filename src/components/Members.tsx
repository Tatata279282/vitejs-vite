import React, { useState } from 'react';
import { Member, TabType } from '../types';
import { 
  User, Mail, Shield, TrendingUp, TrendingDown, 
  Award, AlertTriangle, Search, Filter 
} from 'lucide-react';

interface MembersProps {
  members: Member[];
  isAdmin: boolean;
  onPenalty: (memberId: string, points: number) => void;
  onAward: (memberId: string, points: number) => void;
}

const Members: React.FC<MembersProps> = ({ members, isAdmin, onPenalty, onAward }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCommittee, setSelectedCommittee] = useState('All');

  const committees = ['All', ...new Set(members.map(m => m.committee).filter(Boolean))];

  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         m.position.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCommittee = selectedCommittee === 'All' || m.committee === selectedCommittee;
    return matchesSearch && matchesCommittee;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* ПАНЕЛЬ ПОИСКА И ФИЛЬТРОВ */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Поиск по имени или должности..."
            className="w-full pl-12 pr-4 py-3 bg-slate-50 rounded-2xl outline-none focus:bg-white focus:ring-2 ring-blue-500/10 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          {committees.map(c => (
            <button
              key={c}
              onClick={() => setSelectedCommittee(c)}
              className={`px-5 py-3 rounded-2xl text-xs font-black whitespace-nowrap transition-all ${
                selectedCommittee === c 
                ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' 
                : 'bg-white border border-slate-100 text-slate-400 hover:bg-slate-50'
              }`}
            >
              {c === 'All' ? 'Все' : c}
            </button>
          ))}
        </div>
      </div>

      {/* ГРИД УЧАСТНИКОВ */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden group">
            
            {/* Шляпа карточки */}
            <div className="p-8 pb-4">
              <div className="flex justify-between items-start mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-[1.5rem] flex items-center justify-center text-slate-400 group-hover:scale-110 transition-transform">
                  <User size={32} />
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-black ${
                    member.efficiency >= 80 ? 'text-emerald-500' : 
                    member.efficiency >= 50 ? 'text-blue-500' : 'text-amber-500'
                  }`}>
                    {member.efficiency}%
                  </div>
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest">КПД</div>
                </div>
              </div>

              <h3 className="text-xl font-black text-slate-800 leading-tight mb-1">{member.name}</h3>
              <p className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-4">{member.position}</p>
              
              <div className="space-y-2 mb-6">
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Shield size={14} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-tight">{member.committee || 'Без комитета'}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center text-slate-400">
                    <Mail size={14} />
                  </div>
                  <span className="text-xs font-medium">{member.login}</span>
                </div>
              </div>

              {/* Прогресс-бар эффективности */}
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden mb-8">
                <div 
                  className={`h-full transition-all duration-1000 ${
                    member.efficiency >= 80 ? 'bg-emerald-500' : 
                    member.efficiency >= 50 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${member.efficiency}%` }}
                />
              </div>
            </div>

            {/* ПАНЕЛЬ УПРАВЛЕНИЯ (ТОЛЬКО АДМИН) */}
            {isAdmin && (
              <div className="bg-slate-50/80 p-6 border-t border-slate-100 flex flex-col gap-4">
                <div className="flex items-center justify-between px-2">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Коррекция рейтинга</span>
                  <AlertTriangle size={14} className="text-slate-300" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {/* Кнопки поощрения */}
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => onAward(member.id, 5)}
                      className="py-2 bg-white border border-emerald-100 text-emerald-600 rounded-xl text-[10px] font-black hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <TrendingUp size={12} /> +5 КПД
                    </button>
                    <button 
                      onClick={() => onAward(member.id, 10)}
                      className="py-2 bg-white border border-emerald-100 text-emerald-600 rounded-xl text-[10px] font-black hover:bg-emerald-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <Award size={12} /> +10 КПД
                    </button>
                  </div>

                  {/* Кнопки штрафа */}
                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => onPenalty(member.id, 5)}
                      className="py-2 bg-white border border-red-100 text-red-500 rounded-xl text-[10px] font-black hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <TrendingDown size={12} /> -5 КПД
                    </button>
                    <button 
                      onClick={() => onPenalty(member.id, 10)}
                      className="py-2 bg-white border border-red-100 text-red-500 rounded-xl text-[10px] font-black hover:bg-red-500 hover:text-white transition-all flex items-center justify-center gap-2"
                    >
                      <AlertTriangle size={12} /> -10 КПД
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredMembers.length === 0 && (
        <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-slate-200">
          <Search size={48} className="mx-auto text-slate-200 mb-4" />
          <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Никого не нашли по вашему запросу</p>
        </div>
      )}
    </div>
  );
};

export default Members;