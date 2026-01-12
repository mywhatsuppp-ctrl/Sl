import React, { useContext, useState, useEffect } from 'react';
import { LanguageContext } from '../App';
import { dbService } from '../services/dbService';
import { AcademicRecord } from '../types';
import { Save, Users, CalendarCheck, School } from 'lucide-react';

export default function AcademicModule() {
  const { t } = useContext(LanguageContext);
  const [view, setView] = useState<'list' | 'form'>('list');
  const [history, setHistory] = useState<AcademicRecord[]>([]);
  const [formData, setFormData] = useState<Partial<AcademicRecord>>({
    month: new Date().toISOString().slice(0, 7),
    enrollmentBoys: 0,
    enrollmentGirls: 0,
    studentAttendance: 0,
    teacherAttendance: 0,
    ablActivities: false,
    communityMeeting: false,
    notes: ''
  });

  useEffect(() => {
    dbService.getAllAcademic().then(setHistory);
  }, [view]);

  const handleSubmit = async () => {
    const record: AcademicRecord = {
      id: Date.now().toString(),
      month: formData.month!,
      enrollmentBoys: Number(formData.enrollmentBoys),
      enrollmentGirls: Number(formData.enrollmentGirls),
      studentAttendance: Number(formData.studentAttendance),
      teacherAttendance: Number(formData.teacherAttendance),
      ablActivities: formData.ablActivities || false,
      communityMeeting: formData.communityMeeting || false,
      notes: formData.notes || ''
    };
    await dbService.addAcademic(record);
    alert(t('submitSuccess'));
    setView('list');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">{t('academic')}</h2>
        {view === 'list' ? (
          <button onClick={() => setView('form')} className="bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg font-bold">
            + Update Stats
          </button>
        ) : (
          <button onClick={() => setView('list')} className="text-gray-500 font-bold">{t('cancel')}</button>
        )}
      </div>

      {view === 'list' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.length === 0 && <p className="col-span-2 text-gray-400 text-center py-10">No academic records found.</p>}
          {history.map(rec => (
            <div key={rec.id} className="bg-white p-5 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center gap-3 mb-3 border-b border-gray-100 pb-3">
                 <div className="bg-blue-100 p-2 rounded-lg"><School size={20} className="text-blue-700"/></div>
                 <h3 className="font-bold text-lg">{rec.month}</h3>
              </div>
              <div className="grid grid-cols-2 gap-y-2 text-sm text-gray-600">
                 <span>Enrollment:</span> <span className="font-bold text-gray-900">{rec.enrollmentBoys + rec.enrollmentGirls}</span>
                 <span>Stu. Attendance:</span> <span className="font-bold text-green-700">{rec.studentAttendance}%</span>
                 <span>Tch. Attendance:</span> <span className="font-bold text-blue-700">{rec.teacherAttendance}%</span>
                 <span>ABL Active:</span> <span>{rec.ablActivities ? '✅' : '❌'}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-6">
           <div>
             <label className="block text-sm font-bold text-gray-700 mb-1">Month</label>
             <input type="month" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
               value={formData.month} onChange={e => setFormData({...formData, month: e.target.value})} />
           </div>
           
           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Boys Enrollment</label>
               <input type="number" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
                 value={formData.enrollmentBoys} onChange={e => setFormData({...formData, enrollmentBoys: Number(e.target.value)})} />
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Girls Enrollment</label>
               <input type="number" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
                 value={formData.enrollmentGirls} onChange={e => setFormData({...formData, enrollmentGirls: Number(e.target.value)})} />
             </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Student Attendance %</label>
               <input type="number" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
                 value={formData.studentAttendance} onChange={e => setFormData({...formData, studentAttendance: Number(e.target.value)})} />
             </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 mb-1">Teacher Attendance %</label>
               <input type="number" className="w-full p-4 bg-gray-50 rounded-xl border border-gray-200"
                 value={formData.teacherAttendance} onChange={e => setFormData({...formData, teacherAttendance: Number(e.target.value)})} />
             </div>
           </div>

           <div className="flex flex-col gap-3">
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input type="checkbox" className="w-5 h-5 accent-green-600"
                  checked={formData.ablActivities} onChange={e => setFormData({...formData, ablActivities: e.target.checked})} />
                <span className="font-medium">Activity Based Learning Implemented?</span>
              </label>
              
              <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <input type="checkbox" className="w-5 h-5 accent-green-600"
                  checked={formData.communityMeeting} onChange={e => setFormData({...formData, communityMeeting: e.target.checked})} />
                <span className="font-medium">{t('community')}</span>
              </label>
           </div>

           <button onClick={handleSubmit} className="w-full bg-green-700 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2">
             <Save size={20} /> {t('save')}
           </button>
        </div>
      )}
    </div>
  );
}