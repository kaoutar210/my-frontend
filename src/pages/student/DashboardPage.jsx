import React, { useState, useEffect } from 'react';
import { 
  BookOpen, Trophy, TrendingUp, Rocket, Loader2, 
  Target, ChevronRight, Zap
} from 'lucide-react';
import Sidebar from "../../components/layout/SidebarStudent";
import API from "../../services/api";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const [data, setData] = useState({
    stats: {
      globalProgress: 0,
      learningTime: "0h",
      weeklyTrend: "0%",
      currentModule: 0
    },
    courses: [],
    activities: []
  });

  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await API.get('/student/dashboard');
        setData({
          stats: response.data.stats || {},
          courses: response.data.courses || [],
          activities: response.data.activities || []
        });
      } catch (err) {
        console.error("Erreur dashboard:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4ff]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="text-[#e5522d] animate-spin" size={40} />
          <p className="text-slate-400 font-medium uppercase text-[10px] tracking-widest">
            Initialisation du profil...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f0f4ff] font-sans text-slate-700">

      <Sidebar
        brandName="Codelink Notebook"
        onLogout={() => {
          localStorage.removeItem("token");
          window.location.href = "/login";
        }}
      />

      <main className="flex-1 overflow-y-auto">

        {/* Header */}
        <header className="py-10 px-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-medium text-[#0d1b3e] tracking-tight">
              Bienvenue 👋
            </h1>
            <p className="text-slate-400 mt-1.5 text-sm">
              Continuez votre parcours d'expert aujourd'hui.
            </p>
          </div>

          {/* Progress widget */}
          <div className="bg-white px-7 py-5 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-6 min-w-[260px]">
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                  Progression globale
                </span>
                <span className="text-[#e5522d] font-medium text-base">
                  {data?.stats?.globalProgress || 0}%
                </span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#e5522d] rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${data?.stats?.globalProgress || 0}%` }}
                />
              </div>
            </div>
          </div>
        </header>

        {/* Modules */}
        <section className="px-10 mb-10">
          <h2 className="text-xl font-medium text-[#0d1b3e] mb-5 flex items-center gap-2">
            Vos modules
            <Zap size={18} className="text-[#e5522d]" fill="currentColor" />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {data?.courses?.map((course, i) => (
              <ModuleCard
                key={course.id || i}
                title={course.title}
                progress={course.progress || 0}
                tag={course.tag || "Module"}
                color={course.color || "bg-[#1754be]"}
                onClick={() => navigate(`/student/course/${course.id}`)}
              />
            ))}
          </div>
        </section>

        {/* Bottom section */}
        <div className="px-10 flex flex-col lg:flex-row gap-8 pb-12">

          {/* Activité récente */}
          <div className="flex-[1.5]">
            <div className="flex justify-between items-center mb-5">
              <h2 className="text-xl font-medium text-[#0d1b3e]">Activité récente</h2>
              <button className="text-[#1754be] font-medium text-sm hover:text-[#e5522d] transition-colors flex items-center gap-1">
                Historique <ChevronRight size={15} />
              </button>
            </div>

            <div className="space-y-3">
              {data?.activities?.length > 0 ? (
                data.activities.map((act, i) => (
                  <ActivityItem
                    key={i}
                    icon={
                      act.type === 'quiz'
                        ? <Trophy className="text-[#e5522d]" size={17} />
                        : <BookOpen className="text-[#1754be]" size={17} />
                    }
                    title={act.title}
                    subtitle={`${act.subtitle} • ${act.time}`}
                    xp={act.xp}
                  />
                ))
              ) : (
                <div className="p-10 border border-dashed border-slate-200 rounded-2xl text-center text-slate-400 text-sm font-medium">
                  Aucune activité récente. Commencez un cours !
                </div>
              )}
            </div>
          </div>

          {/* Statistiques */}
          <div className="flex-1 space-y-6">
            <h2 className="text-xl font-medium text-[#0d1b3e]">Statistiques</h2>

            {/* Learning time */}
            <div className="bg-[#1754be] rounded-2xl p-7 text-white relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-blue-200 text-[10px] font-medium uppercase tracking-widest mb-2">
                  Temps d'apprentissage
                </p>
                <div className="text-4xl font-medium mb-4 tracking-tight group-hover:scale-105 transition-transform origin-left duration-500">
                  {data?.stats?.learningTime || "0h"}
                </div>
                <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full text-[10px] font-medium">
                  <TrendingUp size={11} className="text-green-300" />
                  <span className="text-green-300">{data?.stats?.weeklyTrend || "0%"}</span>
                  &nbsp;cette semaine
                </div>
              </div>
              <Target
                className="absolute -right-4 -bottom-4 text-white/5 group-hover:text-white/10 transition-colors"
                size={130}
              />
            </div>

            {/* Certification */}
            
          </div>
        </div>
      </main>

      {/* Floating Action Button */}
      <div className="fixed bottom-8 right-10 w-14 h-14 bg-[#e5522d] rounded-2xl flex items-center justify-center text-white shadow-xl shadow-[#e5522d]/30 cursor-pointer hover:scale-110 hover:-rotate-6 transition-all duration-300 z-50">
        <Rocket size={24} />
      </div>
    </div>
  );
};

/* Sub-components */

const ModuleCard = ({ title, progress, tag, color, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:shadow-slate-200/60 transition-all group cursor-pointer relative overflow-hidden"
  >
    <div className={`absolute top-0 right-0 w-20 h-20 ${color} opacity-[0.04] rounded-bl-full group-hover:scale-150 transition-transform duration-700`} />

    <div className="flex justify-between items-start mb-8">
      <div className={`w-9 h-9 ${color} rounded-xl opacity-20 group-hover:opacity-100 transition-opacity duration-500`} />
      <span className={`text-[9px] font-medium uppercase px-3 py-1 rounded-full tracking-wide ${
        progress > 0 ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'
      }`}>
        {tag}
      </span>
    </div>

    <h3 className="text-[15px] font-medium text-[#0d1b3e] mb-5 leading-tight group-hover:text-[#e5522d] transition-colors">
      {title}
    </h3>

    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-1000 ease-in-out`}
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="text-[11px] font-medium text-slate-400">{progress}%</span>
    </div>
  </div>
);

const ActivityItem = ({ icon, title, subtitle, xp }) => (
  <div className="bg-white px-5 py-4 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group">
    <div className="w-10 h-10 bg-[#f0f4ff] rounded-xl flex items-center justify-center group-hover:bg-white transition-colors">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-[#0d1b3e] group-hover:text-[#e5522d] transition-colors">{title}</p>
      <p className="text-[11px] text-slate-400 mt-0.5 uppercase tracking-tight">{subtitle}</p>
    </div>
    {xp && (
      <div className="flex flex-col items-end">
        <span className="text-xs font-medium text-green-500">+{xp} XP</span>
        <div className="w-7 h-1 bg-green-100 rounded-full mt-1" />
      </div>
    )}
  </div>
);

export default DashboardPage;