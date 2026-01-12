import React, { useContext, useEffect, useState } from 'react';
import { LanguageContext } from '../App';
import { dbService } from '../services/dbService';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Activity, Users, ClipboardCheck, TrendingUp } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
    <div className={`p-4 rounded-xl ${color}`}>
      <Icon size={24} className="text-white" />
    </div>
    <div>
      <p className="text-gray-500 text-sm font-medium">{label}</p>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    </div>
  </div>
);

export default function Dashboard() {
  const { t } = useContext(LanguageContext);
  const [stats, setStats] = useState({ total: 0, avg: 0 });

  useEffect(() => {
    const loadStats = async () => {
      const data = await dbService.getStats();
      setStats(data);
    };
    loadStats();
  }, []);

  const data = [
    { name: 'Completed', value: stats.total, color: '#15803d' }, // green-700
    { name: 'Pending', value: 10, color: '#fcd34d' }, // amber-300
  ];

  const activityData = [
    { name: 'Mon', visits: 2 },
    { name: 'Tue', visits: 4 },
    { name: 'Wed', visits: 1 },
    { name: 'Thu', visits: 3 },
    { name: 'Fri', visits: 5 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-bold text-gray-800">{t('dashboard')}</h2>
        <p className="text-gray-500 mt-2">{t('welcome')}</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ClipboardCheck} label="Total Observations" value={stats.total} color="bg-blue-500" />
        <StatCard icon={Activity} label="Avg Rating" value={stats.avg} color="bg-green-600" />
        <StatCard icon={Users} label="Teachers Mentored" value="12" color="bg-purple-500" />
        <StatCard icon={TrendingUp} label="Actions Closed" value="85%" color="bg-amber-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Compliance Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-6">Observation Compliance</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4 text-sm text-gray-500">
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-700"></div>
                <span>Completed</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-300"></div>
                <span>Pending</span>
             </div>
          </div>
        </div>

        {/* Activity Chart */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-700 mb-6">Weekly Activity</h3>
          <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={activityData}>
                 <XAxis dataKey="name" axisLine={false} tickLine={false} />
                 <YAxis axisLine={false} tickLine={false} />
                 <Tooltip cursor={{fill: 'transparent'}} />
                 <Bar dataKey="visits" fill="#15803d" radius={[4, 4, 0, 0]} />
               </BarChart>
             </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}