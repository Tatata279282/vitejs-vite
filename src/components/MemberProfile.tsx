import React from 'react';
import { Member } from '../types';
import { User, Mail, Briefcase, Calendar, Award } from 'lucide-react';

interface MemberProfileProps {
  member: Member;
}

const MemberProfile: React.FC<MemberProfileProps> = ({ member }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      {/* Шапка профиля */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col md:flex-row gap-8 items-center">
        <div className="w-32 h-32 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
          <User size={64} />
        </div>
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-800 mb-2">{member.name}</h2>
          <p className="text-blue-600 font-bold mb-4">{member.position}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="px-4 py-2 bg-slate-50 rounded-xl text-xs font-bold text-slate-500 uppercase">
              {member.committee || 'Комитет не указан'}
            </div>
          </div>
        </div>
        <div className="bg-emerald-50 p-6 rounded-3xl text-center min-w-[140px]">
          <p className="text-emerald-600 text-xs font-bold uppercase mb-1">Эффективность</p>
          <p className="text-4xl font-black text-emerald-600">{member.efficiency}%</p>
        </div>
      </div>

      {/* Список отчетов */}
      <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
        <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
          <Award className="mr-2 text-blue-600" size={24} />
          История активности и отчеты
        </h3>
        
        <div className="space-y-4">
          {member.activities && member.activities.length > 0 ? (
            member.activities.map((activity: any) => (
              <div key={activity.id} className="bg-slate-50 rounded-2xl p-6 border border-slate-50">
                <div className="flex justify-between items-start mb-3">
                  <h4 className="font-bold text-slate-800 text-lg">{activity.title}</h4>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                    activity.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 
                    activity.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                  }`}>
                    {activity.status === 'verified' ? 'Проверено' : 
                     activity.status === 'rejected' ? 'Отклонено' : 'На проверке'}
                  </span>
                </div>
                
                {/* Теперь описание будет видно здесь: */}
                <p className="text-slate-600 text-sm leading-relaxed mb-4">
                  {activity.description || "Описание к этому отчету не заполнено."}
                </p>

                <div className="flex justify-between items-center text-[11px] text-slate-400 font-bold">
                  <span className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {new Date(activity.date).toLocaleDateString('ru-RU')}
                  </span>
                  <span className="text-blue-600">+{activity.points} БАЛЛОВ</span>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
              <p className="text-slate-400 italic">Активностей пока не зафиксировано</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;