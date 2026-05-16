import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Filter, Edit2, 
  Trash2, Users, BarChart3, Terminal, Loader2,
  Layers
} from 'lucide-react';

import SidebarAdmin from '../../../components/layout/SidebarAdmin';
import API from '../../../services/api';

const TPManager = () => {
  const navigate = useNavigate();
  const [tps, setTps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [stats, setStats] = useState({
    total: 0,
    averageDifficulty: '...',
    activeStudents: 0
  });

  useEffect(() => { fetchTPs(); }, []);

  const fetchTPs = async () => {
    setLoading(true);
    try {
      const response = await API.get('/admin/tp');
      setTps(response.data?.tps || []);
      setStats({
        total: response.data?.stats?.total ?? 0,
        averageDifficulty: response.data?.stats?.averageDifficulty ?? '...',
        activeStudents: response.data?.stats?.activeStudents ?? 0
      });
    } catch (error) {
      console.error("Erreur lors du chargement des TP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce TP ?")) {
      try {
        await API.delete(`/admin/tp/${id}`);
        setTps(tps.filter(tp => tp.id !== id));
      } catch (error) {
        alert("Erreur lors de la suppression");
      }
    }
  };

  const filteredTPs = tps.filter(tp =>
    tp.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tp.id?.toString().toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f0f4ff] font-sans">
      <SidebarAdmin />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 ml-60 p-10 space-y-7"
      >
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <div className="text-[10px] font-medium text-[#e5522d] uppercase tracking-widest mb-2">
              Administration
            </div>
            <h1 className="text-3xl font-medium text-[#0d1b3e] tracking-tight flex items-center gap-3">
              <span className="w-1 h-7 bg-[#e5522d] rounded-full" />
              Gestion des TP
            </h1>
          </div>

          <motion.button
            onClick={() => navigate('/admin/tp/add')}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="bg-[#e5522d] text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#cc4522] transition-colors shadow-sm"
          >
            <Plus size={17} /> Nouveau TP
          </motion.button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-5">
          <StatCard
            icon={<Layers size={20} className="text-[#e5522d]" />}
            label="Total TP"
            value={stats.total}
            bg="bg-[#fff3f0]"
          />
          <StatCard
            icon={<BarChart3 size={20} className="text-[#1754be]" />}
            label="Difficulté moy."
            value={stats.averageDifficulty}
            bg="bg-[#eef3fc]"
          />
          <StatCard
            icon={<Users size={20} className="text-emerald-600" />}
            label="Étudiants actifs"
            value={stats.activeStudents}
            bg="bg-emerald-50"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          {/* Search bar */}
          <div className="px-7 py-5 border-b border-slate-50 flex items-center justify-between">
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Rechercher par titre ou ID..."
                className="w-full pl-11 pr-5 py-2.5 bg-[#f8faff] border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all placeholder:text-slate-300"
              />
            </div>
            <button className="px-4 py-2.5 bg-[#f0f4ff] border border-[#c7d5f5] rounded-xl text-[11px] font-medium text-[#1754be] flex items-center gap-2 hover:bg-[#dce9fb] transition-colors">
              <Filter size={13} /> Filtres
            </button>
          </div>

          {/* Table content */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f8faff] border-b border-slate-100">
                  <th className="px-7 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Informations</th>
                  <th className="px-7 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Catégorie</th>
                  <th className="px-7 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">Difficulté</th>
                  <th className="px-7 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <Loader2 className="animate-spin text-[#e5522d]" size={30} />
                        <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">
                          Chargement...
                        </span>
                      </div>
                    </td>
                  </tr>
                ) : filteredTPs.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-20 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-12 h-12 bg-[#f0f4ff] rounded-2xl flex items-center justify-center">
                          <Layers size={22} className="text-slate-300" />
                        </div>
                        <p className="text-slate-400 text-sm font-medium">Aucun TP trouvé.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {filteredTPs.map((tp, i) => (
                      <motion.tr
                        layout
                        key={tp.id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: -16 }}
                        transition={{ delay: i * 0.04 }}
                        className="group border-b border-slate-50 hover:bg-[#f8faff] transition-colors cursor-pointer"
                      >
                        {/* Info */}
                        <td className="px-7 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-[#eef3fc] rounded-xl flex items-center justify-center shrink-0">
                              <Layers size={16} className="text-[#1754be]" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium text-[#0d1b3e] group-hover:text-[#e5522d] transition-colors">
                                {tp.title}
                              </h4>
                              <span className="text-[10px] text-slate-400 uppercase tracking-wide">
                                #{tp.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="px-7 py-4">
                          <span className="text-[10px] font-medium px-3 py-1 rounded-lg bg-[#f0f4ff] border border-[#c7d5f5] text-[#1754be] uppercase">
                            {tp.category}
                          </span>
                        </td>

                        {/* Difficulty */}
                        <td className="px-7 py-4">
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${getDifficultyColor(tp.difficulty)}`} />
                            <span className="text-[11px] font-medium text-slate-600">
                              {tp.difficulty}
                            </span>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="px-7 py-4 text-right">
                          <div className="flex justify-end gap-1">
                            <button
                              onClick={() => navigate(`/admin/tp/edit/${tp.id}`)}
                              className="p-2 rounded-lg text-slate-300 hover:text-[#1754be] hover:bg-[#eef3fc] transition-all"
                              title="Modifier"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => handleDelete(tp.id)}
                              className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                              title="Supprimer"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

/* Helpers */
const getDifficultyColor = (diff) => {
  switch (diff?.toLowerCase()) {
    case 'débutant':     return 'bg-green-500';
    case 'avancé':       return 'bg-[#e5522d]';
    case 'intermédiaire': return 'bg-[#1754be]';
    default:             return 'bg-slate-400';
  }
};

const StatCard = ({ icon, label, value, bg }) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-5"
  >
    <div className={`${bg} w-11 h-11 rounded-xl flex items-center justify-center shrink-0`}>
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-2xl font-medium text-[#0d1b3e] tracking-tight">{value}</p>
    </div>
  </motion.div>
);

export default TPManager;