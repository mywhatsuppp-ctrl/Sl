import React, { useState, useEffect, useContext, createContext } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  MessageSquare,
  School,
  BarChart2,
  Award,
  BookOpen, 
  FileText, 
  Menu, 
  X,
  Languages
} from 'lucide-react';
import { Language, TranslationKey } from './types';
import { TRANSLATIONS } from './constants';

// Modules
import Dashboard from './modules/Dashboard';
import ObservationModule from './modules/ObservationModule';
import FeedbackModule from './modules/FeedbackModule';
import AcademicModule from './modules/AcademicModule';
import AssessmentModule from './modules/AssessmentModule';
import ProfessionalDevelopmentModule from './modules/ProfessionalDevelopmentModule';
import KnowledgeModule from './modules/KnowledgeModule';
import ReportsModule from './modules/ReportsModule';

// --- Contexts ---
const LanguageContext = createContext<{
  lang: Language;
  toggleLang: () => void;
  t: (key: TranslationKey) => string;
}>({
  lang: Language.ENGLISH,
  toggleLang: () => {},
  t: (key) => key,
});

// --- Components ---

const SidebarItem = ({ to, icon: Icon, label, onClick }: any) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
        isActive 
          ? 'bg-green-700 text-white shadow-lg' 
          : 'text-green-900 hover:bg-green-100'
      }`}
    >
      <Icon size={24} />
      <span className="font-medium text-lg truncate">{label}</span>
    </Link>
  );
};

const AppLayout = ({ children }: { children?: React.ReactNode }) => {
  const { t, lang, toggleLang } = useContext(LanguageContext);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`min-h-screen bg-gray-50 flex ${lang === Language.URDU ? 'font-urdu' : ''}`} dir={lang === Language.URDU ? 'rtl' : 'ltr'}>
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 h-screen w-72 bg-white border-r border-green-100 shadow-xl z-50 transform transition-transform duration-300 ${
          isSidebarOpen ? 'translate-x-0' : (lang === Language.URDU ? 'translate-x-full lg:translate-x-0' : '-translate-x-full lg:translate-x-0')
        }`}
      >
        <div className="p-6 border-b border-green-100 bg-green-50 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-800 leading-tight">{t('appTitle')}</h1>
            <p className="text-xs text-green-600 uppercase tracking-wider mt-1">E&SE Department KP</p>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-green-800">
            <X size={24} />
          </button>
        </div>

        <nav className="p-4 space-y-1 overflow-y-auto max-h-[calc(100vh-160px)] no-scrollbar">
          <SidebarItem to="/" icon={LayoutDashboard} label={t('dashboard')} onClick={() => setSidebarOpen(false)} />
          <SidebarItem to="/observation" icon={ClipboardList} label={t('observation')} onClick={() => setSidebarOpen(false)} />
          <SidebarItem to="/feedback" icon={MessageSquare} label={t('feedback')} onClick={() => setSidebarOpen(false)} />
          <SidebarItem to="/academic" icon={School} label={t('academic')} onClick={() => setSidebarOpen(false)} />
          <SidebarItem to="/assessment" icon={BarChart2} label={t('assessment')} onClick={() => setSidebarOpen(false)} />
          <SidebarItem to="/training" icon={Award} label={t('training')} onClick={() => setSidebarOpen(false)} />
          <SidebarItem to="/knowledge" icon={BookOpen} label={t('knowledge')} onClick={() => setSidebarOpen(false)} />
          <SidebarItem to="/reports" icon={FileText} label={t('reports')} onClick={() => setSidebarOpen(false)} />
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-green-100 bg-green-50">
           <button 
            onClick={toggleLang}
            className="flex items-center justify-center w-full gap-2 bg-white border border-green-200 p-2 rounded-lg text-green-800 hover:bg-green-100 transition-colors"
           >
             <Languages size={20} />
             <span className="font-bold">{lang === Language.ENGLISH ? 'اردو' : 'English'}</span>
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full min-w-0 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="lg:hidden bg-white border-b border-green-100 p-4 flex items-center justify-between shadow-sm z-30">
           <button onClick={() => setSidebarOpen(true)} className="text-green-800 p-1">
             <Menu size={28} />
           </button>
           <h2 className="font-bold text-green-900 text-lg truncate px-2">{t('appTitle')}</h2>
           <div className="w-8" /> {/* Spacer for balance */}
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8 scroll-smooth">
          <div className="max-w-4xl mx-auto pb-20">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>(Language.ENGLISH);

  const toggleLang = () => {
    setLang(prev => prev === Language.ENGLISH ? Language.URDU : Language.ENGLISH);
  };

  const t = (key: TranslationKey) => TRANSLATIONS[lang][key];

  return (
    <LanguageContext.Provider value={{ lang, toggleLang, t }}>
      <HashRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/observation" element={<ObservationModule />} />
            <Route path="/feedback" element={<FeedbackModule />} />
            <Route path="/academic" element={<AcademicModule />} />
            <Route path="/assessment" element={<AssessmentModule />} />
            <Route path="/training" element={<ProfessionalDevelopmentModule />} />
            <Route path="/knowledge" element={<KnowledgeModule />} />
            <Route path="/reports" element={<ReportsModule />} />
          </Routes>
        </AppLayout>
      </HashRouter>
    </LanguageContext.Provider>
  );
}

export { LanguageContext };