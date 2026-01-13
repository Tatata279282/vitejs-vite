
import React, { useState } from 'react';
import { Member } from '../types';

interface AddMemberFormProps {
  onAdd: (member: Member) => void;
}

const AddMemberForm: React.FC<AddMemberFormProps> = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    role: 'Член парламента',
    committee: 'Комитет по молодежной политике',
    bio: '',
    login: '',
    password: '',
    avatar: 'https://picsum.photos/seed/newuser/200'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newMember: Member = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      role: formData.role,
      committee: formData.committee,
      bio: formData.bio,
      login: formData.login,
      password: formData.password,
      avatar: formData.avatar,
      efficiency: 50, // Starting efficiency
      scores: {
        attendance: 50,
        mediaActivity: 50,
        projects: 50,
        communityWork: 50,
        initiative: 50
      },
      activities: []
    };
    onAdd(newMember);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        👤 Регистрация нового участника
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">ФИО</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Иванов Иван Иванович"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Роль / Должность</label>
            <input 
              type="text" 
              required
              value={formData.role}
              onChange={e => setFormData({...formData, role: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="Член парламента"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Комитет</label>
          <input 
            type="text" 
            required
            value={formData.committee}
            onChange={e => setFormData({...formData, committee: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Комитет по ..."
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">О себе (Био)</label>
          <textarea 
            rows={3}
            value={formData.bio}
            onChange={e => setFormData({...formData, bio: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Краткая информация об участнике..."
          />
        </div>

        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider">Учетные данные</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Логин</label>
              <input 
                type="text" 
                required
                value={formData.login}
                onChange={e => setFormData({...formData, login: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 mb-1">Пароль</label>
              <input 
                type="text" 
                required
                value={formData.password}
                onChange={e => setFormData({...formData, password: e.target.value})}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          </div>
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all"
        >
          ✅ Создать личный кабинет
        </button>
      </form>
    </div>
  );
};

export default AddMemberForm;
