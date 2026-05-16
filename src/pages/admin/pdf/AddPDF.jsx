import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Lock,
  Eye,
  Database,
  CheckCircle2,
  Loader2,
  ChevronRight,
  Save,
  Globe,
  ShieldCheck,
} from "lucide-react";

import API from "../../../services/api";
import SidebarAdmin from "../../../components/layout/SidebarAdmin";

const AddPDF = () => {
  const navigate = useNavigate();

  const [level, setLevel] = useState("Débutant");
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ title: "", category: "", description: "" });
  const [file, setFile] = useState(null);
  const [selectedLanguageId, setSelectedLanguageId] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (uploadedFile) => {
    if (uploadedFile?.type === "application/pdf") {
      setFile(uploadedFile);
    } else {
      alert("Veuillez sélectionner un fichier PDF valide.");
    }
  };

  const handleSave = async () => {
    if (!formData.title || !formData.category || !file || !selectedLanguageId) {
      alert("Veuillez remplir tous les champs obligatoires.");
      return;
    }
    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("category", formData.category);
    data.append("description", formData.description);
    data.append("level", level);
    data.append("file", file);
    data.append("language_id", selectedLanguageId);
    try {
      await API.post("/admin/courses/upload", data);
      navigate("/admin/pdf");
    } catch (error) {
      alert(error?.response?.data?.message || "Erreur lors de l'envoi du fichier.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f0f4ff] font-sans">
      <SidebarAdmin />

      <main className="flex-1 ml-60 px-16 py-12">

        {/* Header */}
        <div className="flex justify-between items-end mb-10">
          <div>
            <nav className="flex items-center gap-2 text-[11px] font-medium uppercase text-slate-400 mb-3">
              <span>Gestion</span>
              <ChevronRight size={11} />
              <span className="text-[#e5522d]">Nouveau PDF</span>
            </nav>
            <h1 className="text-3xl font-medium text-[#0d1b3e] tracking-tight">
              Ajouter un support
            </h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/admin/pdf")}
              className="px-5 py-2.5 text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors"
            >
              Annuler
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 bg-[#e5522d] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#cc4522] transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
              {loading ? "Envoi..." : "Publier"}
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-12 gap-8">

          {/* Left — form */}
          <div className="col-span-8 space-y-5">
            <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm space-y-6">

              {/* Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                  Titre
                </label>
                <input
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Ex : Introduction au HTML5"
                  className="w-full p-3.5 bg-[#f8faff] border border-slate-100 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                  Catégorie
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3.5 bg-[#f8faff] border border-slate-100 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all"
                >
                  <option value="">Choisir une catégorie</option>
                  <option value="cloud">Cloud</option>
                  <option value="dev">Dev Web</option>
                  <option value="data">Data</option>
                </select>
              </div>

              {/* Language */}
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                  Langue <span className="text-[#e5522d]">*</span>
                </label>
                <select
                  value={selectedLanguageId}
                  onChange={(e) => setSelectedLanguageId(e.target.value)}
                  className="w-full p-3.5 bg-[#f8faff] border border-slate-100 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all"
                >
                  <option value="">Sélectionner une langue</option>
                  <option value="1">HTML</option>
                  <option value="2">CSS</option>
                  <option value="3">Bootstrap</option>
                  <option value="4">JavaScript</option>
                </select>
              </div>

              {/* Level */}
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                  Niveau
                </label>
                <div className="flex gap-2">
                  {["Débutant", "Intermédiaire", "Avancé"].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLevel(l)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                        level === l
                          ? "bg-[#1754be] text-white"
                          : "bg-[#f0f4ff] text-slate-400 hover:bg-[#dce9fb] hover:text-[#1754be]"
                      }`}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Décrivez le contenu du cours..."
                  className="w-full p-3.5 bg-[#f8faff] border border-slate-100 rounded-xl text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all resize-none"
                  rows="4"
                />
              </div>
            </div>
          </div>

          {/* Right — upload + info */}
          <div className="col-span-4 space-y-5">

            {/* Drop zone */}
            <div
              onClick={() => fileInputRef.current.click()}
              onDrop={(e) => { e.preventDefault(); handleFile(e.dataTransfer.files[0]); }}
              onDragOver={(e) => e.preventDefault()}
              className={`p-8 bg-white rounded-2xl border-2 border-dashed text-center cursor-pointer transition-all ${
                file
                  ? "border-green-200 bg-green-50/30"
                  : "border-slate-200 hover:border-[#1754be]/40 hover:bg-[#f0f4ff]"
              }`}
            >
              <input
                type="file"
                hidden
                ref={fileInputRef}
                accept="application/pdf"
                onChange={(e) => handleFile(e.target.files[0])}
              />
              {file ? (
                <div className="flex flex-col items-center gap-2">
                  <CheckCircle2 size={32} className="text-green-500" />
                  <p className="text-sm font-medium text-green-700 mt-1">{file.name}</p>
                  <p className="text-[11px] text-green-500">Fichier prêt à l'envoi</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2 text-slate-400">
                  <FileText size={32} className="text-slate-300" />
                  <p className="text-sm font-medium mt-1">Dépose ton PDF ici</p>
                  <p className="text-[11px]">ou clique pour parcourir</p>
                </div>
              )}
            </div>

            {/* Server info */}
            <div className="bg-[#0d1b3e] text-white p-6 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center">
                  <Database size={17} className="text-[#e5522d]" />
                </div>
                <div>
                  <p className="text-[10px] text-white/50 uppercase tracking-widest">Espace serveur</p>
                  <p className="text-sm font-medium mt-0.5">4.2 GB / 10 GB</p>
                </div>
              </div>
              <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-[#e5522d] rounded-full" style={{ width: "42%" }} />
              </div>
            </div>

            {/* Status */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="flex justify-between items-center px-5 py-3.5 border-b border-slate-50">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <ShieldCheck size={15} className="text-[#1754be]" />
                  Sécurité
                </div>
                <span className="text-[11px] font-medium text-[#1754be] bg-[#eef3fc] px-2.5 py-1 rounded-full">
                  SSL
                </span>
              </div>
              <div className="flex justify-between items-center px-5 py-3.5">
                <div className="flex items-center gap-2 text-sm text-slate-500">
                  <Globe size={15} className="text-green-500" />
                  Visibilité
                </div>
                <span className="text-[11px] font-medium text-green-600 bg-green-50 px-2.5 py-1 rounded-full">
                  Public
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddPDF;