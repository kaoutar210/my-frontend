import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Search,
  FileText,
  Eye,
  Trash2,
  Menu,
  Loader2,
  Filter,
} from 'lucide-react';

import SidebarAdmin from '../../../components/layout/SidebarAdmin';
import API from '../../../services/api';

const PDFManager = () => {
  const navigate = useNavigate();

  const [pdfs, setPdfs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('Tous');

  useEffect(() => {
    fetchPDFs();
  }, []);

  const fetchPDFs = async () => {
    try {
      setLoading(true);
      const response = await API.get('/admin/courses');
      console.log(response.data);
      setPdfs(response.data.courses || []);
    } catch (error) {
      console.error('Erreur fetch PDFs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Voulez-vous vraiment supprimer ce document ?');
    if (!confirmDelete) return;
    try {
      await API.delete(`/admin/courses/${id}`);
      setPdfs((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      console.error(error);
      alert('Erreur lors de la suppression.');
    }
  };

  const dynamicCategories = [
    'Tous',
    ...new Set(pdfs.map((item) => item.category).filter(Boolean)),
  ];

  const filteredData = pdfs.filter((item) => {
    const matchesSearch = item.title?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'Tous' || item.category === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="flex min-h-screen bg-[#f0f4ff] font-sans text-slate-800">
      <SidebarAdmin />

      <main className="flex-1 ml-60 p-10">

        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="flex items-center gap-3">
            <Menu className="text-slate-300" size={18} />
            <span className="text-[11px] font-medium text-slate-400 uppercase tracking-widest">
              Espace Administration
            </span>
          </div>
        </header>

        {/* Top */}
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-medium text-[#0d1b3e] mb-2 tracking-tight">
              Gestionnaire PDF
            </h1>
            <p className="text-slate-400 text-sm">
              Gestion en direct de la table{' '}
              <code className="bg-white border border-slate-100 px-2 py-0.5 rounded-md text-[#e5522d] text-xs">
                courses
              </code>
            </p>
          </div>

          <button
            onClick={() => navigate('/admin/pdf/add')}
            className="bg-[#e5522d] text-white px-6 py-3 rounded-xl font-medium text-sm flex items-center gap-2 hover:bg-[#cc4522] transition-all"
          >
            <Plus size={17} />
            Nouveau PDF
          </button>
        </div>

        {/* Stats + Filter */}
        <div className="grid grid-cols-12 gap-5 mb-7">

          {/* Count */}
          <div className="col-span-3 bg-white p-7 rounded-2xl border border-slate-100 shadow-sm">
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4">
              Documents en ligne
            </p>
            <h3 className="text-5xl font-medium text-[#0d1b3e] tracking-tight">
              {pdfs.length}
            </h3>
          </div>

          {/* Search + filters */}
          <div className="col-span-9 bg-white p-7 rounded-2xl border border-slate-100 shadow-sm">
            <div className="relative mb-5">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                size={16}
              />
              <input
                type="text"
                placeholder="Rechercher par titre..."
                className="w-full bg-[#f8faff] border border-slate-100 rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1">
              <Filter size={13} className="text-slate-300 shrink-0" />
              {dynamicCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-all ${
                    filter === cat
                      ? 'bg-[#1754be] text-white shadow-sm'
                      : 'bg-[#f0f4ff] text-slate-400 hover:bg-[#dce9fb] hover:text-[#1754be]'
                  }`}
                >
                  {cat?.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="py-28 flex flex-col items-center gap-4">
              <Loader2 className="animate-spin text-[#e5522d]" size={36} />
              <p className="text-slate-400 text-sm font-medium">Synchronisation...</p>
            </div>
          ) : filteredData.length === 0 ? (
            <div className="py-28 flex flex-col items-center gap-3">
              <FileText size={48} className="text-slate-200" />
              <h3 className="text-lg font-medium text-slate-500">Aucun PDF trouvé</h3>
              <p className="text-slate-400 text-sm">Ajoutez votre premier document PDF.</p>
            </div>
          ) : (
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f8faff] border-b border-slate-100">
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                    Titre du cours
                  </th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                    Catégorie
                  </th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                    Niveau
                  </th>
                  <th className="px-6 py-4 text-[10px] font-medium text-slate-400 uppercase tracking-widest text-right">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-50">
                <AnimatePresence>
                  {filteredData.map((item) => (
                    <motion.tr
                      key={item.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="group hover:bg-[#f8faff] transition-colors"
                    >
                      {/* Title */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 bg-[#fff3f0] text-[#e5522d] rounded-xl flex items-center justify-center shrink-0">
                            <FileText size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#0d1b3e]">{item.title}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5">
                              {item.description || 'Document PDF'}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-[10px] font-medium uppercase border ${getCatStyle(item.category)}`}>
                          {item.category || 'N/A'}
                        </span>
                      </td>

                      {/* Level */}
                      <td className="px-6 py-4">
                        <span className="text-[11px] font-medium text-slate-500 bg-[#f0f4ff] border border-[#c7d5f5] px-3 py-1 rounded-full">
                          {item.level}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => window.open(`http://localhost:8000/storage/${item.file_path}`, '_blank')}
                            className="p-2 rounded-lg text-slate-300 hover:text-[#1754be] hover:bg-[#eef3fc] transition-all"
                            title="Visualiser"
                          >
                            <Eye size={17} />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="p-2 rounded-lg text-slate-300 hover:text-red-500 hover:bg-red-50 transition-all"
                            title="Supprimer"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

const getCatStyle = (cat) => {
  const c = cat?.toUpperCase();
  if (c === 'HTML')       return 'bg-[#fff3f0] text-[#e5522d] border-[#f5bfb0]';
  if (c === 'CSS')        return 'bg-[#eef3fc] text-[#1754be] border-[#b8cef5]';
  if (c === 'JS' || c === 'JAVASCRIPT') return 'bg-yellow-50 text-yellow-600 border-yellow-100';
  return 'bg-slate-50 text-slate-500 border-slate-100';
};

export default PDFManager;