import React from 'react';
import { Member } from '../types';
import { User, Shield, Zap } from 'lucide-react';

interface MemberListProps {
  members: Member[];
  userRole: 'ADMIN' | 'MEMBER';
  onUpdateCredentials: (id: string, login: string, password?: string) => void;
  onMemberClick?: (id: string) => void; // Добавили новый пропс
}

const MemberList: React.FC<MemberListProps> = ({ members, userRole, onMemberClick }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Участники проекта</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {members.map((member) => (
          <div
            key={member.id}
            onClick={() => onMemberClick?.(member.id)} // Вызываем переход при клике
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all cursor-pointer group"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <User size={24} />
              </div>
              <div className="flex items-center bg-emerald-50 text-emerald-600 px-3 py-1 rounded-full text-sm font-bold">
                <Zap size={14} className="mr-1" />
                {member.efficiency}%
              </div>
            </div>
            
            <h3 className="font-bold text-slate-800 text-lg mb-1">{member.name}</h3>
            <p className="text-slate-500 text-sm mb-4">{member.position}</p>
            
            <div className="pt-4 border-t border-slate-50 flex justify-between items-center text-xs text-slate-400 font-bold uppercase tracking-wider">
              <span>Посмотреть отчет</span>
              <span className="text-blue-600">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemberList;