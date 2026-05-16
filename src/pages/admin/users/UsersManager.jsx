import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  UserPlus, Search, MoreHorizontal, 
  TrendingUp, Zap, GraduationCap, Ban, 
  Loader2, Users, ShieldCheck, ShieldOff
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import Sidebar from '../../../components/layout/SidebarAdmin';
import API from '../../../services/api';

const UsersManager = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    total: 0, active: 0, completion: 0, blocked: 0
  });

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await API.get('/admin/users');
      const users = response.data?.users || response.data?.data?.users || [];
      const summary = response.data?.summary || response.data?.data?.summary || {
        total: 0, active: 0, completion: 0, blocked: 0
      };
      setStudents(users);
      setStats(summary);
    } catch (error) {
      console.error("Erreur API:", error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Actif' ? 'Bloqué' : 'Actif';
      await API.patch(`/admin/users/${userId}/status`, { status: newStatus });
      setStudents(prev =>
        prev.map(s => s.id === userId ? { ...s, status: newStatus } : s)
      );
    } catch (error) {
      alert("Erreur lors du changement de statut");
    }
  };

  const filteredStudents = students.filter(s =>
    (s?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s?.access_code || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#f0f4ff] font-sans">
      <Sidebar />

      <main className="flex-1 ml-60 p-10">

        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="text-[10px] font-medium text-[#e5522d] uppercase tracking-widest mb-2">
              Administration
            </div>
            <h1 className="text-3xl font-medium text-[#0d1b3e] tracking-tight">Utilisateurs</h1>
            <p className="text-slate-400 text-sm mt-1">Contrôle des accès & monitoring</p>
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={15} />
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher..."
                className="pl-11 pr-5 py-2.5 bg-white border border-slate-100 rounded-xl text-sm w-60 focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all placeholder:text-slate-300"
              />
            </div>
            <button
              onClick={() => navigate('/add/user')}
              className="bg-[#e5522d] text-white px-6 py-2.5 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#cc4522] transition-colors"
            >
              <UserPlus size={16} /> Nouveau
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          <StatCard icon={<Users size={18} />}          label="Total"    value={stats.total}            color="text-[#1754be]" bg="bg-[#eef3fc]" />
          <StatCard icon={<Zap size={18} />}            label="Actifs"   value={stats.active}           color="text-emerald-600" bg="bg-emerald-50" />
          <StatCard icon={<GraduationCap size={18} />}  label="Score"    value={`${stats.completion}%`} color="text-purple-600" bg="bg-purple-50" />
          <StatCard icon={<Ban size={18} />}            label="Bloqués"  value={stats.blocked}          color="text-[#e5522d]" bg="bg-[#fff3f0]" />
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">

          <table className="w-full">
            <thead>
              <tr className="bg-[#f8faff] border-b border-slate-100">
                <th className="px-7 py-4 text-left text-[10px] font-medium text-slate-400 uppercase tracking-widest">Utilisateur</th>
                <th className="px-7 py-4 text-left text-[10px] font-medium text-slate-400 uppercase tracking-widest">Progression</th>
                <th className="px-7 py-4 text-left text-[10px] font-medium text-slate-400 uppercase tracking-widest">Statut</th>
                <th className="px-7 py-4 text-right text-[10px] font-medium text-slate-400 uppercase tracking-widest">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Loader2 className="animate-spin text-[#e5522d]" size={30} />
                      <span className="text-xs font-medium text-slate-400 uppercase tracking-widest">Chargement...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-[#f0f4ff] rounded-2xl flex items-center justify-center">
                        <Users size={22} className="text-slate-300" />
                      </div>
                      <p className="text-slate-400 text-sm font-medium">Aucun utilisateur trouvé.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredStudents.map((student, i) => (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="border-b border-slate-50 hover:bg-[#f8faff] transition-colors group"
                    >
                      {/* User */}
                      <td className="px-7 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#eef3fc] rounded-xl flex items-center justify-center font-medium text-[#1754be] text-sm shrink-0">
                            {(student?.name || "?").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#0d1b3e] group-hover:text-[#1754be] transition-colors">
                              {student?.name || "Unknown"}
                            </p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {student?.access_code || "---"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Progress */}
                      <td className="px-7 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-28 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#e5522d] rounded-full transition-all"
                              style={{ width: `${student?.progress || 0}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-slate-500">
                            {student?.progress || 0}%
                          </span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="px-7 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium px-3 py-1 rounded-full ${
                          student?.status === 'Actif'
                            ? 'bg-green-50 text-green-600'
                            : 'bg-[#fff3f0] text-[#e5522d]'
                        }`}>
                          {student?.status === 'Actif'
                            ? <ShieldCheck size={11} />
                            : <ShieldOff size={11} />
                          }
                          {student?.status || 'Inconnu'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-7 py-4 text-right">
                        <button
                          onClick={() => toggleUserStatus(student.id, student.status)}
                          className="p-2 rounded-lg text-slate-300 hover:text-[#1754be] hover:bg-[#eef3fc] transition-all"
                          title="Changer le statut"
                        >
                          <MoreHorizontal size={17} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

/* StatCard */
const StatCard = ({ icon, label, value, color, bg }) => (
  <motion.div
    whileHover={{ y: -3 }}
    className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
  >
    <div className={`w-10 h-10 ${bg} ${color} rounded-xl flex items-center justify-center mb-4`}>
      {icon}
    </div>
    <p className="text-2xl font-medium text-[#0d1b3e] tracking-tight">{value}</p>
    <p className="text-[10px] uppercase text-slate-400 font-medium tracking-widest mt-1">{label}</p>
  </motion.div>
);

export default UsersManager;