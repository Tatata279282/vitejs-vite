import React from 'react';
import { Member } from '../types';

interface DashboardProps {
  members: Member[];
}

const Dashboard: React.FC<DashboardProps> = ({ members }) => {
  const avgEfficiency = Math.round(
    members.reduce((acc, m) => acc + m.efficiency, 0) / members.length
  );

  const totalActivities = members.reduce(
    (acc, m) => acc + m.activities.length,
    0
  );
  const pendingActivities = members.flatMap((m) =>
    m.activities.filter((a) => a.status === 'pending')
  ).length;

  return (
    <div className="space-y-6">
      {/* Карточки статистики */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-blue-600 rounded-3xl p-8 text-white shadow-xl shadow-blue-200">
          <p className="text-blue-100 font-bold uppercase text-xs tracking-wider mb-2">
            Ср. Эффективность
          </p>
          <p className="text-5xl font-black">{avgEfficiency}%</p>
        </div>

        <div className="bg-slate-800 rounded-3xl p-8 text-white shadow-xl shadow-slate-200">
          <p className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-2">
            Всего отчетов
          </p>
          <p className="text-5xl font-black">{totalActivities}</p>
        </div>

        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <p className="text-slate-400 font-bold uppercase text-xs tracking-wider mb-2">
            Ожидают проверки
          </p>
          <p className="text-5xl font-black text-orange-500">
            {pendingActivities}
          </p>
        </div>
      </div>

      {/* Инфо-блок */}
      <div className="bg-white rounded-3xl p-10 border border-slate-100 shadow-sm">
        <h3 className="text-2xl font-bold text-slate-800 mb-4">
          Добро пожаловать в панель управления
        </h3>
        <p className="text-slate-500 leading-relaxed mb-6">
          Система ParlTrack настроена на работу в локальном режиме. Все данные о
          60 участниках, их пароли и активности хранятся в памяти браузера. Вы
          можете подтверждать отчеты во вкладке "Верификация" и следить за общим
          рейтингом.
        </p>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold text-sm">
            👥 60 Пользователей
          </div>
          <div className="px-6 py-3 bg-green-50 text-green-600 rounded-xl font-bold text-sm">
            ⚡ Работает без ИИ
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
