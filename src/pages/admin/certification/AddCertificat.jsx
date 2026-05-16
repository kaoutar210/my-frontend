import React, { useState } from 'react';
import { 
  HelpCircle, Users, Info, Download, Save, Upload, 
  Settings, Award, Image as ImageIcon, MousePointer2, Loader2,
  ChevronRight
} from 'lucide-react';
import SidebarAdmin from '../../../components/layout/SidebarAdmin';
import API from '../../../services/api';

const AddCertificat = () => {
  const [attribution, setAttribution] = useState('auto');
  
  // --- ÉTATS BACKEND ---
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    min_score: '80',
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !selectedImage) {
      alert("Veuillez remplir le nom et choisir un template d'image.");
      return;
    }

    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('attribution_mode', attribution);
    data.append('min_score', formData.min_score);
    data.append('template_image', selectedImage);

    setLoading(true);
    try {
      await API.post('/admin/certificates/templates', data);
      alert("Modèle enregistré avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement", error);
      alert("Une erreur est survenue lors de la communication avec le serveur.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      
      {/* Sidebar Fixe */}
      <SidebarAdmin />

      {/* Main Content avec décalage ml-72 pour laisser de l'espace à la sidebar */}
      <main className="flex-1 ml-72 p-10 flex flex-col space-y-8">
        
        {/* Header & Breadcrumbs */}
        <div>
          <nav className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
            <span>Modèles</span> 
            <ChevronRight size={12} /> 
            <span className="text-[#B35600]">Création de certificat</span>
          </nav>
          <h2 className="text-3xl font-black text-[#002366] tracking-tight">Concevoir un nouveau modèle</h2>
          <p className="text-slate-400 text-sm font-medium mt-1">Définissez l'identité visuelle et les règles de réussite de vos diplômes.</p>
        </div>

        <div className="flex gap-8">
          
          {/* LEFT COLUMN: FORM SECTIONS */}
          <div className="flex-[1.8] space-y-6">
            
            {/* Section: Informations Générales */}
            <section className="bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-orange-50 rounded-xl text-[#B35600]"><Settings size={20}/></div>
                <h3 className="font-black text-[#002366]">Informations Générales</h3>
              </div>
              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-300 mb-2 uppercase tracking-widest">Nom du certificat</label>
                  <input 
                    type="text" 
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="ex: Expert en Architecture Cloud" 
                    className="w-full p-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-100 text-sm font-bold text-[#002366] transition-all" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-300 mb-2 uppercase tracking-widest">Description courte</label>
                  <textarea 
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3" 
                    placeholder="Sera affichée sur le profil de l'apprenant..." 
                    className="w-full p-4 bg-slate-50/50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-100 text-sm font-bold text-[#002366] transition-all" 
                  />
                </div>
              </div>
            </section>

            {/* Section: Critères d'attribution */}
            <section className="bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-blue-50 rounded-xl text-blue-600"><Award size={20}/></div>
                <h3 className="font-black text-[#002366]">Critères d'attribution</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div 
                  onClick={() => setAttribution('auto')}
                  className={`p-6 rounded-[24px] border-2 cursor-pointer transition-all flex flex-col items-center text-center ${attribution === 'auto' ? 'border-[#B35600] bg-orange-50/30' : 'border-slate-50 bg-slate-50/30'}`}
                >
                  <MousePointer2 className={attribution === 'auto' ? 'text-[#B35600]' : 'text-slate-300'} />
                  <span className="font-black text-sm mt-3 text-[#002366]">Automatique</span>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 leading-tight">Délivré après réussite d'un examen</p>
                </div>
                <div 
                  onClick={() => setAttribution('manual')}
                  className={`p-6 rounded-[24px] border-2 cursor-pointer transition-all flex flex-col items-center text-center ${attribution === 'manual' ? 'border-[#B35600] bg-orange-50/30' : 'border-slate-50 bg-slate-50/30'}`}
                >
                  <Users className={attribution === 'manual' ? 'text-[#B35600]' : 'text-slate-300'} />
                  <span className="font-black text-sm mt-3 text-[#002366]">Manuelle</span>
                  <p className="text-[10px] font-bold text-slate-400 mt-1 leading-tight">Délivré par un administrateur</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 bg-slate-50/50 border border-slate-100 rounded-2xl">
                  <span className="text-xs font-black text-[#002366]">Score minimum requis</span>
                  <div className="flex items-center gap-2">
                     <input 
                      type="text" 
                      name="min_score"
                      value={formData.min_score}
                      onChange={handleInputChange}
                      className="w-14 text-center font-black text-[#B35600] bg-white border border-slate-100 rounded-xl p-2 outline-none" 
                     />
                     <span className="text-slate-300 font-black text-xs">%</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section: Design du template */}
            <section className="bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-2 bg-indigo-50 rounded-xl text-indigo-600"><ImageIcon size={20}/></div>
                <h3 className="font-black text-[#002366]">Design du template</h3>
              </div>
              
              <label className="group border-2 border-dashed border-slate-100 rounded-[24px] p-12 flex flex-col items-center bg-slate-50/30 mb-8 cursor-pointer hover:bg-orange-50/20 hover:border-orange-100 transition-all">
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
                <div className="p-4 bg-white rounded-2xl shadow-sm mb-4 group-hover:scale-110 transition-transform">
                  <Upload className="text-[#B35600]" size={28} />
                </div>
                <p className="text-sm font-black text-[#002366]">
                  {selectedImage ? selectedImage.name : "Glissez l'image de fond ici"}
                </p>
                <p className="text-[10px] font-bold text-slate-300 mt-2 uppercase tracking-widest">PNG ou SVG haute résolution (Min 2000px)</p>
              </label>

              <div className="flex gap-4">
                <div className="w-24 h-16 rounded-xl bg-slate-900 border-2 border-[#B35600] overflow-hidden relative shadow-sm">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-transparent"></div>
                </div>
                <div className="w-24 h-16 rounded-xl bg-slate-50 border border-slate-100 overflow-hidden flex items-center justify-center">
                  {previewUrl ? (
                    <img src={previewUrl} className="w-full h-full object-cover" alt="Preview" />
                  ) : (
                    <ImageIcon className="text-slate-200" size={20} />
                  )}
                </div>
                <div className="w-24 h-16 rounded-xl border-2 border-dashed border-slate-100 flex items-center justify-center text-slate-200 hover:text-slate-300 transition-colors cursor-pointer">
                  <ImageIcon size={20}/>
                </div>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN: PREVIEW CARD */}
          <div className="flex-1">
            <div className="sticky top-10 space-y-6">
              <div className="bg-white rounded-[40px] p-8 border border-slate-50 shadow-xl shadow-slate-200/50">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center gap-2 font-black text-[#002366] text-sm">
                    <Award className="text-[#B35600]" size={18}/> Prévisualisation
                  </div>
                  <span className="text-[9px] bg-green-50 text-green-600 px-3 py-1 rounded-full font-black uppercase tracking-tighter">Live Preview</span>
                </div>

                {/* Mockup de Certificat */}
                <div className="aspect-[4/3] bg-white border border-slate-100 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden shadow-inner group">
                  {previewUrl && (
                    <img src={previewUrl} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-700" alt="Template" />
                  )}
                  <div className="absolute inset-4 border-[1px] border-slate-100 m-2"></div>
                  
                  <div className="relative z-10 text-center">
                    <h4 className="text-[#B35600] font-black text-xl tracking-[4px] mb-1">CODELINK</h4>
                    <p className="text-[7px] tracking-[0.3em] text-slate-300 font-black uppercase mb-6">Academy Certifications</p>
                    <p className="italic text-[9px] text-slate-400 mb-4">Ce certificat est fièrement décerné à</p>
                    <div className="h-px w-16 bg-slate-100 mx-auto my-4"></div>
                    <p className="text-sm font-black text-[#002366] uppercase tracking-tight">
                      {formData.name || "NOM DU DIPLÔME"}
                    </p>
                  </div>
                </div>

                <div className="mt-8 bg-blue-50/50 p-6 rounded-[24px] flex gap-4 border border-blue-100/30">
                  <Info className="text-blue-500 shrink-0" size={18} />
                  <p className="text-[10px] text-blue-600 font-bold leading-relaxed">
                    Les variables dynamiques comme le <span className="font-black">nom de l'élève</span> et la <span className="font-black">date</span> seront injectées à la génération.
                  </p>
                </div>

                <div className="mt-8 space-y-3">
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-[#B35600] text-white py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-3 shadow-lg shadow-orange-100 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : <Save size={16}/>} 
                    {loading ? "TRAITEMENT..." : "ENREGISTRER LE MODÈLE"}
                  </button>
                  <button className="w-full bg-white border-2 border-slate-50 text-slate-400 py-4 rounded-2xl font-black text-xs flex items-center justify-center gap-3 hover:bg-slate-50 transition-all">
                    <Download size={16}/> TÉLÉCHARGER UN SPÉCIMEN
                  </button>
                </div>
              </div>

              <div className="bg-[#002366] p-5 rounded-[24px] flex justify-between items-center shadow-lg">
                 <div className="flex items-center gap-3">
                   <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
                   <span className="text-[10px] font-black text-white uppercase tracking-widest">Éditeur Actif</span>
                 </div>
                 <span className="text-[10px] font-black text-blue-300/50 font-mono">v2.0.4</span>
              </div>
            </div>
          </div>

        </div>
      </main>

      {/* Bouton d'aide flottant */}
      <div className="fixed bottom-10 right-10 bg-[#002366] p-4 rounded-2xl text-white shadow-2xl cursor-pointer hover:scale-110 active:scale-90 transition-all group">
        <HelpCircle size={24} className="group-hover:rotate-12 transition-transform" />
      </div>
    </div>
  );
};

export default AddCertificat;