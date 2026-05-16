import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, BarChart2, Edit3, Trash2,
  FileText, Loader2, AlertCircle, HelpCircle,
  CheckCircle2, PenLine, BookMarked, FileQuestion
} from 'lucide-react';

import API from '../../../services/api';
import SidebarAdmin from '../../../components/layout/SidebarAdmin';

const QCMManager = () => {
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => { loadQuizzes(); }, []);

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await API.get('/admin/qcm');
      const data = Array.isArray(response.data)
        ? response.data
        : response.data?.data || [];
      setQuizzes(data);
    } catch (err) {
      console.error(err);
      setError("Erreur de chargement des QCM");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Supprimer ce QCM ?")) return;
    try {
      await API.delete(`/admin/qcm/${id}`);
      setQuizzes(prev => prev.filter(q => q.id !== id));
    } catch (err) {
      alert("Erreur suppression");
    }
  };

  const filteredQuizzes = useMemo(() => {
    return quizzes.filter(q => {
      const title = q.title?.toLowerCase() || "";
      const category = q.category?.toLowerCase() || "";
      const search = searchTerm.toLowerCase();
      return title.includes(search) || category.includes(search);
    });
  }, [quizzes, searchTerm]);

  const stats = useMemo(() => {
    const total = quizzes.length;
    const totalQuestions = quizzes.reduce((acc, q) => acc + (q.questions_count || q.qs || 0), 0);
    const active = quizzes.filter(q => q.status === "ACTIVE" || q.status === "PUBLISHED").length;
    return [
      { label: "Total QCM",  value: total,             icon: <BookMarked size={18} />,    color: "text-[#1754be]", bg: "bg-[#eef3fc]" },
      { label: "Questions",  value: totalQuestions,     icon: <FileQuestion size={18} />,  color: "text-purple-600", bg: "bg-purple-50" },
      { label: "Actifs",     value: active,             icon: <CheckCircle2 size={18} />,  color: "text-emerald-600", bg: "bg-emerald-50" },
      { label: "Brouillons", value: total - active,     icon: <PenLine size={18} />,       color: "text-[#e5522d]", bg: "bg-[#fff3f0]" },
    ];
  }, [quizzes]);

  /* Loading */
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4ff]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="animate-spin text-[#e5522d]" size={36} />
          <p className="text-slate-400 text-sm font-medium">Chargement des QCM...</p>
        </div>
      </div>
    );
  }

  /* Error */
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f0f4ff] flex-col gap-3">
        <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <p className="font-medium text-slate-700">{error}</p>
        <button
          onClick={loadQuizzes}
          className="mt-2 px-5 py-2.5 bg-[#0d1b3e] text-white text-sm font-medium rounded-xl hover:bg-[#1754be] transition-colors"
        >
          Réessayer
        </button>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#f0f4ff] font-sans">
      <SidebarAdmin />

      <main className="flex-1 ml-60 p-10">

        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <div className="text-[10px] font-medium text-[#e5522d] uppercase tracking-widest mb-2">
              Administration
            </div>
            <h1 className="text-3xl font-medium text-[#0d1b3e] tracking-tight">
              Gestion QCM
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Gestion réelle des évaluations
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/qcm/add')}
            className="bg-[#e5522d] text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#cc4522] transition-all"
          >
            <Plus size={17} />
            Nouveau QCM
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-5 mb-8">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07 }}
              className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm"
            >
              <div className={`w-10 h-10 ${s.bg} ${s.color} rounded-xl flex items-center justify-center mb-4`}>
                {s.icon}
              </div>
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-1">
                {s.label}
              </p>
              <h2 className="text-2xl font-medium text-[#0d1b3e] tracking-tight">
                {s.value}
              </h2>
            </motion.div>
          ))}
        </div>

        {/* Search */}
        <div className="mb-6 bg-white rounded-2xl border border-slate-100 shadow-sm px-5 py-4 flex items-center gap-3">
          <Search size={16} className="text-slate-300 shrink-0" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Rechercher un QCM..."
            className="flex-1 text-sm text-slate-700 bg-transparent placeholder:text-slate-300 focus:outline-none"
          />
        </div>

        {/* List */}
        {filteredQuizzes.length === 0 ? (
          <div className="py-24 flex flex-col items-center gap-3">
            <div className="w-14 h-14 bg-white rounded-2xl border border-slate-100 flex items-center justify-center">
              <HelpCircle size={28} className="text-slate-200" />
            </div>
            <p className="text-slate-400 text-sm font-medium">Aucun QCM trouvé</p>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {filteredQuizzes.map((q, i) => (
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: i * 0.04 }}
                >
                  <QuizRow quiz={q} onDelete={handleDelete} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
};

/* QuizRow */
const QuizRow = ({ quiz, onDelete }) => (
  <div className="bg-white px-6 py-4 rounded-xl border border-slate-100 shadow-sm flex justify-between items-center hover:bg-[#f8faff] transition-colors group">

    <div className="flex items-center gap-4">
      <div className="w-10 h-10 bg-[#eef3fc] rounded-xl flex items-center justify-center shrink-0">
        <HelpCircle size={18} className="text-[#1754be]" />
      </div>
      <div>
        <h3 className="text-sm font-medium text-[#0d1b3e] group-hover:text-[#1754be] transition-colors">
          {quiz.title}
        </h3>
        <p className="text-[11px] text-slate-400 mt-0.5">
          {quiz.category}
          {quiz.questions_count ? ` · ${quiz.questions_count} questions` : ''}
        </p>
      </div>
    </div>

    <div className="flex items-center gap-1">
      <button
        className="p-2 rounded-lg text-slate-300 hover:text-[#1754be] hover:bg-[#eef3fc] transition-all"
        title="Statistiques"
      >
        <BarChart2 size={17} />
      </button>
      <button
        className="p-2 rounded-lg text-slate-300 hover:text-[#e5522d] hover:bg-[#fff3f0] transition-all"
        title="Modifier"
      >
        <Edit3 size={17} />
      </button>
      <button
        onClick={() => onDelete(quiz.id)}
        className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
        title="Supprimer"
      >
        <Trash2 size={17} />
      </button>
    </div>
  </div>
);

export default QCMManager;