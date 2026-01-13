
import React from 'react';
import { Member, Activity } from '../types';

interface AdminVerificationProps {
  members: Member[];
  onVerify: (memberId: string, activityId: string, status: 'verified' | 'rejected') => void;
}

const AdminVerification: React.FC<AdminVerificationProps> = ({ members, onVerify }) => {
  const pendingActivities = members.flatMap(m => 
    m.activities.filter(a => a.status === 'pending').map(a => ({ ...a, memberName: m.name }))
  );

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-100 p-4 rounded-2xl flex items-center gap-4">
        <div className="text-2xl">📋</div>
        <div>
          <h3 className="font-bold text-blue-900">Очередь верификации</h3>
          <p className="text-sm text-blue-700">Всего заявок на рассмотрении: {pendingActivities.length}</p>
        </div>
      </div>

      {pendingActivities.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-300">
          <p className="text-slate-400 font-medium">Новых заявок пока нет</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingActivities.map((activity) => (
            <div key={activity.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col h-full">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h4 className="font-bold text-slate-800 text-lg">{activity.title}</h4>
                  <p className="text-sm text-blue-600 font-medium">{activity.memberName}</p>
                </div>
                <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                  {activity.type}
                </span>
              </div>
              <p className="text-slate-600 text-sm mb-6 flex-1 italic">
                {activity.description || 'Описание не предоставлено.'}
              </p>
              <div className="flex items-center justify-between border-t border-slate-100 pt-4">
                <span className="text-xs text-slate-400">{activity.date}</span>
                <div className="flex gap-2">
                  <button 
                    onClick={() => onVerify(activity.memberId, activity.id, 'rejected')}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    Отклонить
                  </button>
                  <button 
                    onClick={() => onVerify(activity.memberId, activity.id, 'verified')}
                    className="px-4 py-2 rounded-xl bg-green-600 text-white text-xs font-bold hover:bg-green-700 shadow-md transition-colors"
                  >
                    Подтвердить (+{activity.points})
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminVerification;
