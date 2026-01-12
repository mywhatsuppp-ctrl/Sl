import React, { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '../App';
import { dbService } from '../services/dbService';
import { AssessmentRecord } from '../types';
import { Save, BarChart2 } from 'lucide-react';

export default function AssessmentModule() {
  const { t } = useContext(LanguageContext);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [history, setHistory] = useState<AssessmentRecord[]>([]);
  const [formData, setFormData] = useState<Partial<AssessmentRecord>>({
    date: new Date().toISOString().slice(0, 10),
    grade: '',
    subject: '',
    totalStudents: 0,
    passedStudents: 0,
    sloTopic: '',
    remarks: ''
  });

  useEffect(() => {
    dbService.getAllAssessment().then(setHistory);
  }, [view]);

  const handleSubmit = async () => {
    const record: AssessmentRecord = {
      id: Date.now().toString(),
      date: formData.date!,
      grade: formData.grade!,
      subject: formData.subject!,
      totalStudents: Number(formData.totalStudents),
      passedStudents: Number(formData.passedStudents),
      sloTopic: formData.sloTopic || '',
      remarks: formData.remarks || ''
    };
    await dbService.addAssessment(record);
    alert(t('submitSuccess'));
    setView('list');
  };

  const calculatePassRate = (total: number, passed: number) => {
    if (!total) return 0;
    return Math.round((passed / total) * 100);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('assessment')}</h2>
        {view === 'list' ? (
           <button onClick={() => setView('form')} className="bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg font-bold">
             + New Assessment
           </button>
        ) : (
           <button onClick={() => setView('list')} className="text-gray-500 font-bold">{t('cancel')}</button>
        )}
      </div>

      {view === 'list' ? (
        <div className="space-y-4">
           {history.length === 0 && <p className="text-center text-gray-400 py-10">No assessment records.</p>}
           {history.map(rec => (
             <div key={rec.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
               <div>
                 <h3 className="font-bold text-lg">{rec.subject} <span className="text-sm font-normal text-gray-500">(Grade {rec.grade})</span></h3>
                 <p className="text-sm text-gray-500">Topic: {rec.sloTopic}</p>
                 <p className="text-xs text-gray-400">{rec.date}</p>
               </div>
               <div className="text-center bg-gray-50 p-3 rounded-xl border border-gray-100">
                 <div className="text-2xl font-bold text-green-700">{calculatePassRate(rec.totalStudents, rec.passedStudents)}%</div>
                 <div className="text-xs text-gray-500">Pass Rate</div>
               </div>
             </div>
           ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Date</label>
              <input type="date" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
                value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
            </div>
            <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Grade</label>
               <input type="text" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200" placeholder="e.g. 5"
                 value={formData.grade} onChange={e => setFormData({...formData, grade: e.target.value})} />
            </div>
          </div>
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">{t('subject')}</label>
             <input type="text" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200" placeholder="e.g. Science"
               value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})} />
          </div>
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">{t('slo')}</label>
             <input type="text" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200" placeholder="e.g. Photosynthesis"
               value={formData.sloTopic} onChange={e => setFormData({...formData, sloTopic: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Total Students</label>
                <input type="number" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
                  value={formData.totalStudents} onChange={e => setFormData({...formData, totalStudents: Number(e.target.value)})} />
             </div>
             <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Passed Students</label>
                <input type="number" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
                  value={formData.passedStudents} onChange={e => setFormData({...formData, passedStudents: Number(e.target.value)})} />
             </div>
          </div>
          <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Teacher Remarks</label>
             <textarea rows={2} className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
               value={formData.remarks} onChange={e => setFormData({...formData, remarks: e.target.value})} />
          </div>
          <button onClick={handleSubmit} className="w-full bg-green-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2">
            <Save size={20} /> {t('save')}
          </button>
        </div>
      )}
    </div>
  );
}