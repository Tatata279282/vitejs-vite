import React from 'react';
import { Member } from '../types';

interface MemberProfileProps {
  member: Member;
}

const MemberProfile: React.FC<MemberProfileProps> = ({ member }) => {
  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 bg-blue-100 rounded-2xl flex items-center justify-center text-4xl">
            👤
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-800">{member.name}</h2>
            <p className="text-slate-500 font-medium">
              {member.role} • {member.committee}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 rounded-2xl p-6 text-center">
            <p className="text-slate-500 text-sm font-bold uppercase mb-2">
              Эффективность
            </p>
            <p className="text-4xl font-black text-blue-600">
              {member.efficiency}%
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-6 text-center">
            <p className="text-slate-500 text-sm font-bold uppercase mb-2">
              Активностей
            </p>
            <p className="text-4xl font-black text-slate-800">
              {member.activities.length}
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-6 text-center">
            <p className="text-slate-500 text-sm font-bold uppercase mb-2">
              Статус
            </p>
            <p className="text-xl font-black text-green-600 uppercase mt-2">
              Активен
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
        <h3 className="text-xl font-bold text-slate-800 mb-6">
          История активности
        </h3>
        <div className="space-y-4">
          {member.activities.map((activity) => (
            <div
              key={activity.id}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl"
            >
              <div>
                <p className="font-bold text-slate-800">{activity.title}</p>
                <p className="text-sm text-slate-500">{activity.date}</p>
              </div>
              <div
                className={`px-4 py-1 rounded-full text-xs font-bold uppercase ${
                  activity.status === 'verified'
                    ? 'bg-green-100 text-green-600'
                    : activity.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-red-100 text-red-600'
                }`}
              >
                {activity.status === 'verified'
                  ? 'Подтверждено'
                  : activity.status === 'pending'
                  ? 'На проверке'
                  : 'Отклонено'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberProfile;
