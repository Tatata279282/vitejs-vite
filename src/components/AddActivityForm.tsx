
import React, { useState } from 'react';
import { Activity } from '../types';

interface AddActivityFormProps {
  // Fix: Omit memberId from the expected submission data as it is handled by the parent component (App.tsx)
  onSubmit: (activity: Omit<Activity, 'id' | 'status' | 'points' | 'memberId'>) => void;
}

const AddActivityForm: React.FC<AddActivityFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    type: 'meeting' as any,
    description: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;
    // Fix: the formData object now correctly matches the omitted type requirements
    onSubmit(formData);
    setFormData({ title: '', date: new Date().toISOString().split('T')[0], type: 'meeting', description: '' });
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl border border-slate-200 shadow-xl">
      <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
        📝 Отчет о мероприятии
      </h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Название мероприятия</label>
          <input 
            type="text" 
            value={formData.title} 
            onChange={e => setFormData({...formData, title: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none"
            placeholder="Напр: Круглый стол по молодежной политике"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Дата</label>
            <input 
              type="date" 
              value={formData.date}
              onChange={e => setFormData({...formData, date: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">Тип активности</label>
            <select 
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as any})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="meeting">Собрание / Встреча</option>
              <option value="project">Реализация проекта</option>
              <option value="media">Медиа-публикация</option>
              <option value="community">Работа с населением</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-slate-700 mb-2">Описание и результаты</label>
          <textarea 
            rows={4}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            placeholder="Кратко опишите ваш вклад и достигнутые цели..."
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
        >
          🚀 Отправить на верификацию
        </button>
      </form>
    </div>
  );
};

export default AddActivityForm;
