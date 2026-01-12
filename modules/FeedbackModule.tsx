import React, { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '../App';
import { dbService } from '../services/dbService';
import { FeedbackRecord } from '../types';
import { MOCK_TEACHERS } from '../constants';
import { Save, Calendar, CheckSquare } from 'lucide-react';

export default function FeedbackModule() {
  const { t } = useContext(LanguageContext);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [history, setHistory] = useState<FeedbackRecord[]>([]);
  const [formData, setFormData] = useState<Partial<FeedbackRecord>>({
    teacherName: '',
    strengths: '',
    areasForImprovement: '',
    agreedActionPlan: '',
    followUpDate: '',
    status: 'Pending'
  });

  useEffect(() => {
    dbService.getAllFeedback().then(setHistory);
  }, [view]);

  const handleSubmit = async () => {
    if (!formData.teacherName) return;
    const record: FeedbackRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      teacherName: formData.teacherName!,
      strengths: formData.strengths || '',
      areasForImprovement: formData.areasForImprovement || '',
      agreedActionPlan: formData.agreedActionPlan || '',
      followUpDate: formData.followUpDate || '',
      status: 'Pending'
    };
    await dbService.addFeedback(record);
    alert(t('submitSuccess'));
    setView('list');
    setFormData({});
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('feedback')}</h2>
        {view === 'list' ? (
          <button onClick={() => setView('form')} className="bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg font-bold">
            + New Feedback
          </button>
        ) : (
          <button onClick={() => setView('list')} className="text-gray-500 font-bold">{t('cancel')}</button>
        )}
      </div>

      {view === 'list' ? (
        <div className="space-y-4">
          {history.length === 0 && <p className="text-gray-400 text-center py-10">No feedback records found.</p>}
          {history.map(rec => (
            <div key={rec.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex justify-between">
                <div>
                  <h3 className="font-bold text-lg">{rec.teacherName}</h3>
                  <p className="text-sm text-gray-500">{new Date(rec.date).toLocaleDateString()}</p>
                </div>
                <span className="px-3 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-bold h-fit">{rec.status}</span>
              </div>
              <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                <strong>Action:</strong> {rec.agreedActionPlan}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">{t('teacherName')}</label>
            <select 
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
              value={formData.teacherName}
              onChange={e => setFormData({...formData, teacherName: e.target.value})}
            >
              <option value="">Select Teacher</option>
              {MOCK_TEACHERS.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Strengths</label>
            <textarea 
              rows={2}
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
              value={formData.strengths}
              onChange={e => setFormData({...formData, strengths: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Areas for Improvement</label>
            <textarea 
              rows={2}
              className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
              value={formData.areasForImprovement}
              onChange={e => setFormData({...formData, areasForImprovement: e.target.value})}
            />
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-100">
            <label className="block text-sm font-bold text-green-900 mb-1">{t('actionPlan')}</label>
            <textarea 
              rows={3}
              className="w-full p-4 bg-white rounded-xl border border-green-200"
              placeholder="What steps will be taken?"
              value={formData.agreedActionPlan}
              onChange={e => setFormData({...formData, agreedActionPlan: e.target.value})}
            />
          </div>
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">{t('followUp')}</label>
             <input 
               type="date"
               className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
               value={formData.followUpDate}
               onChange={e => setFormData({...formData, followUpDate: e.target.value})}
             />
          </div>
          <button 
            onClick={handleSubmit}
            className="w-full bg-green-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 mt-4"
          >
            <Save size={20} />
            {t('save')}
          </button>
        </div>
      )}
    </div>
  );
}