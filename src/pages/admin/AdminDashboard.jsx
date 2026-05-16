import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, BookOpen, Users, Bell, Search,
  Zap, ShoppingBag, TrendingUp, MoreHorizontal
} from 'lucide-react';

import SidebarAdmin from '../../components/layout/SidebarAdmin';
import API from '../../services/api';

const AdminDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statsData, setStatsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/stats");
        setStatsData(res.data);
      } catch (err) {
        console.error("Stats error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = useMemo(() => {
    if (!statsData) return [];
    return [
      { label: "Étudiants",  value: statsData.students_total,  icon: <Users size={20} />,       color: "text-[#1754be]", bg: "bg-[#eef3fc]" },
      { label: "Cours PDF",  value: statsData.pdf_courses,     icon: <FileText size={20} />,     color: "text-[#e5522d]", bg: "bg-[#fff3f0]" },
      { label: "Quiz QCM",   value: statsData.qcm_total,       icon: <BookOpen size={20} />,     color: "text-purple-600", bg: "bg-purple-50" },
      { label: "Commandes",  value: statsData.orders,          icon: <ShoppingBag size={20} />,  color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Actifs",     value: statsData.active_sessions, icon: <Zap size={20} />,          color: "text-amber-600", bg: "bg-amber-50" },
    ];
  }, [statsData]);

  return (
    <div className="flex min-h-screen bg-[#f0f4ff] font-sans text-slate-700">
      <SidebarAdmin />

      <main className="flex-1 ml-60 p-10">

        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-2xl font-medium text-[#0d1b3e] tracking-tight">Vue d'ensemble</h1>
            <p className="text-slate-400 text-sm mt-1">Bon retour, Administrateur.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1754be] transition-colors"
                size={16}
              />
              <input
                className="pl-11 pr-5 py-2.5 bg-white border border-slate-100 rounded-xl w-72 text-sm focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="p-2.5 bg-white border border-slate-100 rounded-xl cursor-pointer hover:bg-[#f0f4ff] transition-colors">
              <Bell size={18} className="text-slate-400" />
            </div>
          </div>
        </header>

        {/* Stats grid */}
        <div className="grid grid-cols-5 gap-5 mb-8">
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="h-28 bg-white animate-pulse rounded-2xl border border-slate-100" />
            ))
          ) : (
            cards.map((s, i) => <StatCard key={i} stat={s} index={i} />)
          )}
        </div>

        {/* Main content */}
        <div className="grid grid-cols-12 gap-6">

          {/* Chart */}
          <div className="col-span-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[16px] font-medium text-[#0d1b3e]">Activité de la plateforme</h2>
              <span className="px-4 py-1.5 bg-[#f0f4ff] text-[#1754be] text-[11px] font-medium rounded-full">
                Hebdomadaire
              </span>
            </div>

            <div className="flex items-end gap-3 h-56 px-2">
              {[30, 45, 35, 70, 50, 85, 100, 75, 90, 65].map((h, i) => (
                <Bar key={i} height={h} isPeak={i === 6} />
              ))}
            </div>
          </div>

          {/* Recent orders */}
          <div className="col-span-4">
            <div className="bg-[#0d1b3e] p-7 rounded-2xl text-white">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-medium text-[15px]">Dernières ventes</h2>
                <ShoppingBag size={18} className="text-[#e5522d]" />
              </div>
              <div className="space-y-3">
                {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10">
                    <div>
                      <p className="text-sm font-medium">Commande #84{i}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">
                        Codelink Notebook
                      </p>
                    </div>
                    <span className="text-[#e5522d] font-medium text-sm">99 DH</span>
                  </div>
                ))}
              </div>
              <button className="w-full mt-5 py-2.5 bg-white/10 hover:bg-white/15 transition-colors rounded-xl text-[11px] font-medium uppercase tracking-widest">
                Voir toutes les commandes
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

/* Sub-components */

const StatCard = ({ stat, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.08 }}
    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow"
  >
    <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
      {stat.icon}
    </div>
    <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">
      {stat.label}
    </p>
    <h2 className="text-2xl font-medium text-[#0d1b3e] tracking-tight">{stat.value}</h2>
  </motion.div>
);

const Bar = ({ height, isPeak }) => (
  <div className="flex-1 group relative">
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: `${height}%` }}
      transition={{ duration: 0.9, ease: "easeOut" }}
      className={`w-full rounded-xl cursor-pointer transition-all duration-300 ${
        isPeak
          ? 'bg-[#e5522d] shadow-lg shadow-[#e5522d]/20'
          : 'bg-[#eef3fc] group-hover:bg-[#c7d5f5]'
      }`}
    />
  </div>
);

export default AdminDashboard;