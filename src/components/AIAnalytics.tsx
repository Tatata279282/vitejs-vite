
import React, { useState, useEffect } from 'react';
import { Member } from '../types';
import { getParliamentSummary } from '../services/geminiService';

interface AIAnalyticsProps {
  members: Member[];
}

const AIAnalytics: React.FC<AIAnalyticsProps> = ({ members }) => {
  const [report, setReport] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setIsLoading(true);
      const res = await getParliamentSummary(members);
      setReport(res);
      setIsLoading(false);
    };
    fetchReport();
  }, [members]);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="p-8 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center gap-4 mb-4">
            <span className="text-4xl">🧠</span>
            <div>
              <h2 className="text-2xl font-bold">Интеллектуальный аудит состава</h2>
              <p className="text-blue-100 opacity-90">Анализ общей динамики развития молодёжного представительства</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-slate-500 animate-pulse font-medium">Gemini изучает данные парламентариев...</p>
            </div>
          ) : (
            <div className="prose prose-slate max-w-none">
              <div className="space-y-6">
                {report.split('\n').map((para, i) => (
                  <p key={i} className="text-slate-700 leading-relaxed">
                    {para}
                  </p>
                ))}
              </div>
              
              <div className="mt-12 p-6 bg-amber-50 rounded-2xl border border-amber-100">
                <h4 className="text-amber-800 font-bold mb-3 flex items-center gap-2">
                  <span>💡</span> Резюме стратегии
                </h4>
                <p className="text-sm text-amber-700 leading-relaxed italic">
                  Этот отчет сгенерирован автоматически на основе текущих KPI. Для повышения общей эффективности рекомендуется уделить внимание межкомитетскому взаимодействию и медийному освещению малых инициатив.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIAnalytics;
