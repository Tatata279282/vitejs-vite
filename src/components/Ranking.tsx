
import React from 'react';
import { Member } from '../types';

interface RankingProps {
  members: Member[];
}

const Ranking: React.FC<RankingProps> = ({ members }) => {
  const sortedMembers = [...members].sort((a, b) => b.efficiency - a.efficiency);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Место</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Парламентарий</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Комитет</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Проекты</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">КПД</th>
              <th className="px-8 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Прогресс</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {sortedMembers.map((member, index) => (
              <tr key={member.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-8 py-4">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold ${
                    index === 0 ? 'bg-amber-100 text-amber-600' :
                    index === 1 ? 'bg-slate-200 text-slate-600' :
                    index === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-slate-100 text-slate-400'
                  }`}>
                    {index + 1}
                  </div>
                </td>
                <td className="px-8 py-4">
                  <div className="flex items-center gap-3">
                    <img src={member.avatar} className="w-10 h-10 rounded-full" alt="" />
                    <div>
                      <p className="font-semibold text-slate-800">{member.name}</p>
                      <p className="text-xs text-slate-500">{member.role}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-4">
                  <span className="text-sm text-slate-600 font-medium">{member.committee}</span>
                </td>
                <td className="px-8 py-4 text-sm text-slate-500">
                  {member.activities.filter(a => a.type === 'project').length} активных
                </td>
                <td className="px-8 py-4">
                  <span className="text-sm font-bold text-blue-600">{member.efficiency}%</span>
                </td>
                <td className="px-8 py-4 text-right">
                  <div className="w-32 ml-auto h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        member.efficiency > 90 ? 'bg-green-500' :
                        member.efficiency > 70 ? 'bg-blue-500' :
                        'bg-amber-500'
                      }`}
                      style={{ width: `${member.efficiency}%` }}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Ranking;
