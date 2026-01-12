import React, { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '../App';
import { dbService } from '../services/dbService';
import { ObservationRecord } from '../types';
import { MOCK_TEACHERS } from '../constants';
import { Save, User, Book, CheckCircle, Circle, AlertCircle } from 'lucide-react';

export default function ObservationModule() {
  const { t } = useContext(LanguageContext);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [history, setHistory] = useState<ObservationRecord[]>([]);
  const [formData, setFormData] = useState<Partial<ObservationRecord>>({
    teacherName: '',
    subject: '',
    indicators: {
      lessonPlan: false,
      avAids: false,
      studentEngagement: false,
      notebookCheck: false
    },
    deficiencies: '',
    mentoringNotes: '',
    rating: 3
  });

  useEffect(() => {
    loadHistory();
  }, [view]);

  const loadHistory = async () => {
    const data = await dbService.getAllObservations();
    setHistory(data);
  };

  const handleToggle = (key: keyof typeof formData.indicators) => {
    setFormData(prev => ({
      ...prev,
      indicators: {
        ...prev.indicators!,
        [key]: !prev.indicators![key]
      }
    }));
  };

  const handleSubmit = async () => {
    if (!formData.teacherName) return;

    const newRecord: ObservationRecord = {
      id: Date.now().toString(),
      teacherName: formData.teacherName!,
      subject: formData.subject || 'General',
      date: new Date().toISOString(),
      grade: '5',
      indicators: formData.indicators as any,
      deficiencies: formData.deficiencies || '',
      mentoringNotes: formData.mentoringNotes || '',
      rating: formData.rating || 3
    };

    await dbService.addObservation(newRecord);
    alert(t('submitSuccess'));
    setView('list');
    setFormData({
       teacherName: '',
       subject: '',
       indicators: { lessonPlan: false, avAids: false, studentEngagement: false, notebookCheck: false },
       deficiencies: '',
       mentoringNotes: '',
       rating: 3
    });
  };

  if (view === 'list') {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">{t('observation')}</h2>
          <button 
            onClick={() => setView('form')}
            className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg transition-all active:scale-95"
          >
            + {t('newObservation')}
          </button>
        </div>

        <div className="space-y-4">
          <h3 className="text-gray-500 font-medium">{t('history')}</h3>
          {history.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-400">No records found. Start your first observation.</p>
            </div>
          )}
          {history.map(record => (
            <div key={record.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg text-gray-800">{record.teacherName}</h4>
                <p className="text-sm text-gray-500">{new Date(record.date).toLocaleDateString()} • {record.subject}</p>
              </div>
              <div className="flex items-center gap-2">
                 <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                   record.rating >= 4 ? 'bg-green-100 text-green-800' :
                   record.rating >= 3 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                 }`}>
                   Score: {record.rating}/5
                 </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">{t('newObservation')}</h2>
        <button onClick={() => setView('list')} className="text-gray-500 font-medium">{t('cancel')}</button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Basic Info */}
        <div className="p-6 border-b border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">{t('teacherName')}</label>
            <select 
              className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
              value={formData.teacherName}
              onChange={e => setFormData({...formData, teacherName: e.target.value})}
            >
              <option value="">Select Teacher</option>
              {MOCK_TEACHERS.map(t => <option key={t.id} value={t.name}>{t.name} ({t.designation})</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-500 mb-1">{t('subject')}</label>
            <input 
              type="text" 
              className="w-full p-4 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="e.g. English, Math"
              value={formData.subject}
              onChange={e => setFormData({...formData, subject: e.target.value})}
            />
          </div>
        </div>

        {/* Indicators (Checklist) */}
        <div className="p-6 border-b border-gray-100 bg-gray-50/50">
          <h3 className="font-bold text-gray-700 mb-4 uppercase text-xs tracking-wider">Classroom Indicators</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'lessonPlan', label: t('lessonPlan') },
              { key: 'avAids', label: t('avAids') },
              { key: 'studentEngagement', label: t('engagement') },
              { key: 'notebookCheck', label: t('notebooks') },
            ].map((item) => (
              <button 
                key={item.key}
                onClick={() => handleToggle(item.key as any)}
                className={`p-4 rounded-xl border flex items-center justify-between transition-all ${
                  formData.indicators![item.key as keyof typeof formData.indicators] 
                  ? 'bg-green-600 border-green-600 text-white' 
                  : 'bg-white border-gray-200 text-gray-600'
                }`}
              >
                <span className="font-medium">{item.label}</span>
                {formData.indicators![item.key as keyof typeof formData.indicators] 
                  ? <CheckCircle size={24} /> 
                  : <Circle size={24} />
                }
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="p-6 space-y-6">
           <div>
            <label className="flex items-center gap-2 font-bold text-red-600 mb-2">
              <AlertCircle size={18} />
              {t('deficiencies')}
            </label>
            <textarea 
              rows={3}
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-red-500 focus:outline-none"
              placeholder="What needs improvement?"
              value={formData.deficiencies}
              onChange={e => setFormData({...formData, deficiencies: e.target.value})}
            />
           </div>
           
           <div>
            <label className="flex items-center gap-2 font-bold text-green-700 mb-2">
              <User size={18} />
              {t('mentoring')}
            </label>
            <textarea 
              rows={3}
              className="w-full p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Advice given to teacher..."
              value={formData.mentoringNotes}
              onChange={e => setFormData({...formData, mentoringNotes: e.target.value})}
            />
           </div>

           {/* Rating Slider */}
           <div>
             <label className="block font-bold text-gray-700 mb-2">Overall Rating: {formData.rating}/5</label>
             <input 
              type="range" 
              min="1" 
              max="5" 
              step="1" 
              value={formData.rating}
              onChange={e => setFormData({...formData, rating: parseInt(e.target.value)})}
              className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-green-600"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-2 font-mono">
              <span>Poor</span>
              <span>Average</span>
              <span>Excellent</span>
            </div>
           </div>
        </div>

        <div className="p-6 bg-gray-50 border-t border-gray-100">
          <button 
            onClick={handleSubmit}
            className="w-full bg-green-700 hover:bg-green-800 text-white p-4 rounded-xl font-bold text-lg shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
          >
            <Save size={24} />
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}