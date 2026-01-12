import React, { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '../App';
import { dbService } from '../services/dbService';
import { TrainingRecord } from '../types';
import { MOCK_TEACHERS } from '../constants';
import { Save, Award } from 'lucide-react';

export default function ProfessionalDevelopmentModule() {
  const { t } = useContext(LanguageContext);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [history, setHistory] = useState<TrainingRecord[]>([]);
  const [formData, setFormData] = useState<Partial<TrainingRecord>>({
    teacherName: '',
    title: '',
    date: new Date().toISOString().slice(0, 10),
    type: 'CPD',
    outcome: ''
  });

  useEffect(() => {
    dbService.getAllTraining().then(setHistory);
  }, [view]);

  const handleSubmit = async () => {
    if(!formData.teacherName) return;
    const record: TrainingRecord = {
      id: Date.now().toString(),
      teacherName: formData.teacherName!,
      title: formData.title || '',
      date: formData.date!,
      type: formData.type as any || 'CPD',
      outcome: formData.outcome || ''
    };
    await dbService.addTraining(record);
    alert(t('submitSuccess'));
    setView('list');
    setFormData({ teacherName: '', title: '', date: new Date().toISOString().slice(0, 10), type: 'CPD', outcome: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('training')}</h2>
        {view === 'list' ? (
           <button onClick={() => setView('form')} className="bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg font-bold">
             + Log Training
           </button>
        ) : (
           <button onClick={() => setView('list')} className="text-gray-500 font-bold">{t('cancel')}</button>
        )}
      </div>

      {view === 'list' ? (
        <div className="space-y-4">
           {history.length === 0 && <p className="text-center text-gray-400 py-10">No training records.</p>}
           {history.map(rec => (
             <div key={rec.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
               <div className="flex items-center gap-4">
                 <div className="bg-purple-100 p-3 rounded-full"><Award className="text-purple-600" size={24}/></div>
                 <div>
                    <h3 className="font-bold text-lg">{rec.teacherName}</h3>
                    <p className="text-sm font-medium text-gray-700">{rec.title}</p>
                    <p className="text-xs text-gray-500">{rec.date} • {rec.type}</p>
                 </div>
               </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t('teacherName')}</label>
            <select className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
              value={formData.teacherName} onChange={e => setFormData({...formData, teacherName: e.target.value})}>
              <option value="">Select Teacher</option>
              {MOCK_TEACHERS.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
          </div>
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">{t('trainingTitle')}</label>
             <input type="text" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
               value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
                <input type="date" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
                  value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Type</label>
                <select className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
                   value={formData.type} onChange={e => setFormData({...formData, type: e.target.value as any})}>
                   <option value="CPD">CPD</option>
                   <option value="Induction">Induction</option>
                   <option value="Mentoring">Mentoring</option>
                </select>
             </div>
          </div>
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Outcome / Notes</label>
             <textarea rows={2} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
               value={formData.outcome} onChange={e => setFormData({...formData, outcome: e.target.value})} />
          </div>
          <button onClick={handleSubmit} className="w-full bg-green-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2">
            <Save size={20} /> {t('save')}
          </button>
        </div>
      )}
    </div>
  );
}