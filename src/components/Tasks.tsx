import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Member, Task } from '../types';
import { 
  ClipboardList, Calendar, User, Users, 
  CheckCircle, Plus, X, ShieldCheck, MessageSquare, Star
} from 'lucide-react';

interface TasksProps {
  userRole: 'ADMIN' | 'MEMBER';
  userId?: string;
  members: Member[];
  onTaskCreated?: () => void;
  onTaskCompleted?: (taskTitle: string, userName: string) => void;
  onAwardPoints?: (taskId: string, points: number, task: Task) => void;
}

const Tasks: React.FC<TasksProps> = ({ 
  userRole, 
  userId, 
  members, 
  onTaskCreated, 
  onTaskCompleted,
  onAwardPoints 
}) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [completingTaskId, setCompletingTaskId] = useState<string | null>(null);
  const [resultText, setResultText] = useState('');
  const [loading, setLoading] = useState(true);

  // Состояние для создания новой задачи
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assignee_id: '',
    committee: '',
    due_date: '',
    priority: 'medium'
  });

  const currentUser = members.find(m => m.id === userId);
  const isAdmin = userRole === 'ADMIN';

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    const { data } = await supabase.from('tasks').select('*').order('due_date', { ascending: true });
    if (data) setTasks(data as Task[]);
    setLoading(false);
  };

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('tasks').insert([{ ...newTask, status: 'pending' }]);
    if (!error) {
      setNewTask({ title: '', description: '', assignee_id: '', committee: '', due_date: '', priority: 'medium' });
      setIsFormOpen(false);
      fetchTasks();
      if (onTaskCreated) onTaskCreated();
    }
  };

  const handleCompleteTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!completingTaskId) return;

    const task = tasks.find(t => t.id === completingTaskId);
    const { error } = await supabase
      .from('tasks')
      .update({ status: 'completed', result_text: resultText })
      .eq('id', completingTaskId);

    if (!error) {
      if (onTaskCompleted && task) onTaskCompleted(task.title, currentUser?.name || 'Пользователь');
      setCompletingTaskId(null);
      setResultText('');
      fetchTasks();
    }
  };

  const canCloseTask = (task: Task) => {
    if (isAdmin) return true;
    if (task.assignee_id === userId) return true;
    if (task.committee && currentUser?.committee === task.committee) {
      return currentUser.position.toLowerCase().includes('руководитель');
    }
    return false;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-20 animate-in fade-in duration-500">
      
      {/* ШАПКА */}
      <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm">
        <div>
          <h2 className="text-2xl font-black text-slate-800">Задачи</h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            {isAdmin ? 'Менеджмент и оценка' : 'Ваш план действий'}
          </p>
        </div>
        {isAdmin && (
          <button 
            onClick={() => setIsFormOpen(!isFormOpen)}
            className={`p-4 rounded-2xl transition-all ${isFormOpen ? 'bg-slate-100 text-slate-500' : 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'}`}
          >
            {isFormOpen ? <X size={20} /> : <Plus size={20} />}
          </button>
        )}
      </div>

      {/* ФОРМА СОЗДАНИЯ (АДМИН) */}
      {isFormOpen && isAdmin && (
        <div className="bg-white p-8 rounded-[2.5rem] border-2 border-blue-50 shadow-xl animate-in slide-in-from-top-4">
          <form onSubmit={handleCreateTask} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input 
                type="text" placeholder="Суть задачи..." required
                className="p-4 bg-slate-50 rounded-2xl outline-none font-bold"
                value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})}
              />
              <input 
                type="date" required
                className="p-4 bg-slate-50 rounded-2xl outline-none font-bold text-slate-500"
                value={newTask.due_date} onChange={e => setNewTask({...newTask, due_date: e.target.value})}
              />
            </div>
            <textarea 
              placeholder="Подробное описание..." required
              className="w-full p-4 bg-slate-50 rounded-2xl h-24 outline-none font-medium"
              value={newTask.description} onChange={e => setNewTask({...newTask, description: e.target.value})}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select 
                className="p-4 bg-slate-50 rounded-2xl font-bold outline-none cursor-pointer"
                value={newTask.assignee_id} onChange={e => setNewTask({...newTask, assignee_id: e.target.value, committee: ''})}
              >
                <option value="">Назначить персоне</option>
                {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
              <select 
                className="p-4 bg-slate-50 rounded-2xl font-bold outline-none cursor-pointer"
                value={newTask.committee} onChange={e => setNewTask({...newTask, committee: e.target.value, assignee_id: ''})}
              >
                <option value="">Назначить комитету</option>
                {[...new Set(members.map(m => m.committee))].filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg">Создать задачу</button>
          </form>
        </div>
      )}

      {/* МОДАЛКА ЗАКРЫТИЯ */}
      {completingTaskId && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleCompleteTask} className="bg-white w-full max-w-lg rounded-[2.5rem] p-8 shadow-2xl animate-in zoom-in">
            <h3 className="text-xl font-black text-slate-800 mb-2 text-center">Отчет о выполнении</h3>
            <textarea 
              required autoFocus
              className="w-full p-5 bg-slate-50 rounded-[1.5rem] h-40 outline-none border-2 border-transparent focus:border-emerald-500/20 mb-6 font-medium"
              placeholder="Что именно было сделано? Опишите результат..."
              value={resultText} onChange={(e) => setResultText(e.target.value)}
            />
            <div className="flex gap-4">
              <button type="button" onClick={() => setCompletingTaskId(null)} className="flex-1 py-4 font-bold text-slate-400">Отмена</button>
              <button type="submit" className="flex-1 bg-emerald-500 text-white py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-500/20">Отправить отчет</button>
            </div>
          </form>
        </div>
      )}

      {/* СПИСОК ЗАДАЧ */}
      <div className="grid grid-cols-1 gap-4">
        {loading ? (
          <div className="text-center py-20 text-slate-300 font-bold uppercase text-[10px] tracking-widest animate-pulse">Загрузка данных...</div>
        ) : tasks.filter(t => isAdmin || t.assignee_id === userId || t.committee === currentUser?.committee).map(task => {
          const allowed = canCloseTask(task);
          
          return (
            <div key={task.id} className={`group bg-white p-6 md:p-8 rounded-[2.5rem] border-2 transition-all duration-300 ${task.status === 'completed' ? 'border-emerald-50 bg-emerald-50/10 opacity-90' : 'border-slate-50 hover:border-blue-100 shadow-sm'}`}>
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                
                {/* Иконка статуса */}
                <div className={`hidden md:block mt-1 flex-shrink-0 ${task.status === 'completed' ? 'text-emerald-500' : 'text-slate-200'}`}>
                  <CheckCircle size={32} fill={task.status === 'completed' ? 'currentColor' : 'none'} className={task.status === 'completed' ? 'text-white' : ''} />
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className={`text-lg font-black tracking-tight ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {task.title}
                    </h4>
                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                      {task.status === 'completed' ? 'Выполнено' : 'В работе'}
                    </span>
                  </div>
                  
                  <p className={`text-sm mb-4 leading-relaxed ${task.status === 'completed' ? 'text-slate-400' : 'text-slate-600'}`}>
                    {task.description}
                  </p>

                  {/* Текст отчета */}
                  {task.result_text && (
                    <div className="p-5 bg-white rounded-2xl border border-emerald-100 shadow-sm mb-5">
                      <div className="flex items-center gap-2 text-[9px] font-black text-emerald-600 uppercase mb-2">
                        <MessageSquare size={12} /> Итог работы:
                      </div>
                      <p className="text-sm text-slate-700 italic font-medium">«{task.result_text}»</p>
                    </div>
                  )}

                  {/* Футер карточки */}
                  <div className="flex flex-wrap gap-3 items-center">
                    <div className="flex items-center gap-1.5 bg-slate-50 text-slate-400 text-[9px] font-black px-3 py-1.5 rounded-xl uppercase">
                      <Calendar size={12} /> до {new Date(task.due_date).toLocaleDateString()}
                    </div>
                    {task.committee && (
                      <div className="flex items-center gap-1.5 bg-purple-50 text-purple-600 text-[9px] font-black px-3 py-1.5 rounded-xl uppercase">
                        <Users size={12} /> {task.committee}
                      </div>
                    )}
                    {task.assignee_id && !task.committee && (
                      <div className="flex items-center gap-1.5 bg-blue-50 text-blue-600 text-[9px] font-black px-3 py-1.5 rounded-xl uppercase">
                        <User size={12} /> {members.find(m => m.id === task.assignee_id)?.name}
                      </div>
                    )}
                  </div>

                  {/* КНОПКИ БАЛЛОВ (ТОЛЬКО ДЛЯ АДМИНА У ВЫПОЛНЕННЫХ) */}
                  {isAdmin && task.status === 'completed' && (
                    <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase">Оценить выполнение</p>
                        <p className="text-[9px] text-slate-300 font-bold uppercase mt-0.5">
                          {task.committee ? 'Баллы всем членам комитета' : 'Баллы исполнителю'}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        {[5, 10, 20].map(val => (
                          <button
                            key={val}
                            onClick={() => onAwardPoints && onAwardPoints(task.id, val, task)}
                            className="flex items-center gap-1.5 bg-white border-2 border-slate-100 hover:border-blue-500 hover:text-blue-500 px-4 py-2 rounded-xl text-xs font-black transition-all transform active:scale-95"
                          >
                            <Star size={12} fill="currentColor" /> +{val}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* КНОПКА ЗАКРЫТИЯ (ДЛЯ РУКОВОДИТЕЛЕЙ/ИСПОЛНИТЕЛЕЙ) */}
                {task.status === 'pending' && (
                  <div className="flex-shrink-0">
                    {allowed ? (
                      <button 
                        onClick={() => setCompletingTaskId(task.id)}
                        className="w-full md:w-auto bg-slate-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-lg"
                      >
                        Завершить
                      </button>
                    ) : (
                      <div className="p-3 bg-slate-50 rounded-2xl text-slate-200" title="Только для руководителя">
                        <ShieldCheck size={24} />
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Tasks;