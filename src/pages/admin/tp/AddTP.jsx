import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FileText, Upload, Save, Loader2,
  ChevronLeft, Clock, Image, FilePlus2, CheckCircle2
} from 'lucide-react';

import SidebarAdmin from '../../../components/layout/SidebarAdmin';
import API from '../../../services/api';

const AddTP = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'HTML',
    difficulty: 'Débutant',
    description: '',
    instructions: '# Objectifs du TP\n1. ...',
    estimated_time: 120,
    is_published: 1,
    auto_correction: true
  });
  const [thumbnail, setThumbnail] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [tpFile, setTpFile] = useState(null);
  const [tpFileName, setTpFileName] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) { setThumbnail(file); setPreviewUrl(URL.createObjectURL(file)); }
  };

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) { setTpFile(file); setTpFileName(file.name); }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description) return alert("Titre et description requis");
    try {
      setLoading(true);
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        let value = formData[key];
        if (typeof value === "boolean") value = value ? 1 : 0;
        data.append(key, value);
      });
      if (thumbnail) data.append("thumbnail", thumbnail);
      if (tpFile) data.append("tp_file", tpFile);
      await API.post("/admin/tp/store", data, { headers: { "Content-Type": "multipart/form-data" } });
      alert("TP ajouté avec succès");
      navigate("/admin/tp");
    } catch (error) {
      alert(error?.response?.data?.message || "Erreur lors de l'ajout du TP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f0f4ff] font-sans">
      <SidebarAdmin />

      <main className="flex-1 ml-60 p-10">

        {/* Header */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <button
              onClick={() => navigate("/admin/tp")}
              className="text-sm font-medium text-slate-400 mb-3 flex items-center gap-1.5 hover:text-[#1754be] transition-colors"
            >
              <ChevronLeft size={15} /> Retour
            </button>
            <div className="text-[10px] font-medium text-[#e5522d] uppercase tracking-widest mb-2">Administration</div>
            <h1 className="text-3xl font-medium text-[#0d1b3e] tracking-tight">Création TP</h1>
            <p className="text-slate-400 text-sm mt-1">Ajouter un nouveau travail pratique</p>
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-[#e5522d] text-white px-6 py-3 rounded-xl text-sm font-medium flex items-center gap-2 hover:bg-[#cc4522] transition-all disabled:opacity-50"
          >
            {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {loading ? "Enregistrement..." : "Créer TP"}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">

          {/* Left */}
          <div className="col-span-2 space-y-5">

            {/* Info */}
            <div className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm space-y-5">
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Informations générales</div>

              <div className="space-y-2">
                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Titre du TP</label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex : Création d'une page HTML responsive"
                  className="w-full p-3.5 bg-[#f8faff] border border-slate-100 rounded-xl text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Catégorie</label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full p-3.5 bg-[#f8faff] border border-slate-100 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all"
                  >
                    <option>HTML</option>
                    <option>CSS</option>
                    <option>JavaScript</option>
                    <option>Bootstrap</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Difficulté</label>
                  <div className="flex gap-2">
                    {["Débutant", "Inter.", "Avancé"].map((d, i) => {
                      const full = ["Débutant", "Intermédiaire", "Avancé"][i];
                      return (
                        <button
                          key={full}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, difficulty: full }))}
                          className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${
                            formData.difficulty === full
                              ? 'bg-[#1754be] text-white'
                              : 'bg-[#f0f4ff] text-slate-400 hover:bg-[#dce9fb] hover:text-[#1754be]'
                          }`}
                        >
                          {d}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez l'objectif du TP..."
                  className="w-full p-3.5 bg-[#f8faff] border border-slate-100 rounded-xl text-sm placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all resize-none"
                  rows="3"
                />
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white p-7 rounded-2xl border border-slate-100 shadow-sm space-y-4">
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">Instructions (Markdown)</div>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleChange}
                className="w-full h-56 p-4 bg-[#0d1b3e] text-[#a8c0f0] rounded-xl font-mono text-sm focus:outline-none resize-none"
              />
            </div>
          </div>

          {/* Right */}
          <div className="space-y-5">

            {/* Thumbnail */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#eef3fc] rounded-xl flex items-center justify-center">
                  <Image size={15} className="text-[#1754be]" />
                </div>
                <span className="text-sm font-medium text-[#0d1b3e]">Thumbnail</span>
              </div>
              <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
              <div
                onClick={() => fileInputRef.current.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  previewUrl ? 'border-[#1754be]/30' : 'border-slate-200 hover:border-[#1754be]/40 hover:bg-[#f0f4ff]'
                }`}
              >
                {previewUrl ? (
                  <img src={previewUrl} className="rounded-xl w-full object-cover max-h-36" alt="preview" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <Upload size={22} className="text-slate-300" />
                    <p className="text-xs">Cliquez pour uploader</p>
                  </div>
                )}
              </div>
            </div>

            {/* PDF */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#fff3f0] rounded-xl flex items-center justify-center">
                  <FilePlus2 size={15} className="text-[#e5522d]" />
                </div>
                <span className="text-sm font-medium text-[#0d1b3e]">Fichier TP (PDF)</span>
              </div>
              <input type="file" accept="application/pdf" ref={pdfInputRef} onChange={handlePdfChange} className="hidden" />
              <div
                onClick={() => pdfInputRef.current.click()}
                className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-all ${
                  tpFileName ? 'border-green-200 bg-green-50/30' : 'border-slate-200 hover:border-[#e5522d]/30 hover:bg-[#fff3f0]'
                }`}
              >
                {tpFileName ? (
                  <div className="flex flex-col items-center gap-2">
                    <CheckCircle2 size={22} className="text-green-500" />
                    <p className="text-xs font-medium text-green-700 break-all">{tpFileName}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <FileText size={22} className="text-slate-300" />
                    <p className="text-xs">Upload PDF du TP</p>
                  </div>
                )}
              </div>
            </div>

            {/* Time */}
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-[#eef3fc] rounded-xl flex items-center justify-center">
                  <Clock size={15} className="text-[#1754be]" />
                </div>
                <span className="text-sm font-medium text-[#0d1b3e]">Temps estimé (min)</span>
              </div>
              <input
                type="number"
                name="estimated_time"
                value={formData.estimated_time}
                onChange={handleChange}
                className="w-full p-3.5 bg-[#f8faff] border border-slate-100 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all"
              />
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default AddTP;