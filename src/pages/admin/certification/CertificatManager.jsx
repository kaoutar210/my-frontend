import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings, Eye, Download, History, Search, 
  Info, ShieldCheck, Loader2, Save, RefreshCw 
} from 'lucide-react';

// Import de votre instance API
import API from '../../../services/api';
import SidebarAdmin from '../../../components/layout/SidebarAdmin';

const CertificatManager = () => {
  // --- ÉTATS ---
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ total: 0, delivered: 0 });
  const [rules, setRules] = useState([]); // Tableau d'objets { label, value, key }
  const [searchTerm, setSearchTerm] = useState("");

  // --- CHARGEMENT DES DONNÉES ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resStats, resStudents, resRules] = await Promise.all([
        API.get('/admin/certificates/stats'),
        API.get('/admin/certificates/eligibility'),
        API.get('/admin/certificates/rules')
      ]);
      setStats(resStats.data);
      setStudents(resStudents.data);
      setRules(resRules.data);
    } catch (err) {
      console.error("Erreur lors de la récupération des données", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  // --- ACTIONS ---
  const handleUpdateRules = async () => {
    setUpdating(true);
    try {
      await API.post('/admin/certificates/rules/update', { rules });
      // Notification de succès ici (Toast)
    } catch (err) {
      alert("Erreur lors de la sauvegarde des règles");
    } finally {
      setUpdating(false);
    }
  };

  const downloadPDF = async (studentId) => {
    try {
      const response = await API.get(`/admin/certificates/generate/${studentId}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `certificat_${studentId}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error("Erreur de téléchargement", err);
    }
  };

  // Filtrage local
  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      <SidebarAdmin />

      <motion.main 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="flex-1 ml-72 p-10 space-y-8"
      >
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-[1000] text-[#002366] tracking-tight mb-2">Gestion des Certifications</h1>
            <p className="text-slate-400 text-sm font-medium italic">Synchronisé avec le moteur de progression en temps réel.</p>
          </div>
          <div className="flex gap-4">
             <button onClick={fetchData} className="p-3 bg-white border border-slate-100 rounded-2xl text-slate-400 hover:text-[#B35600] transition-colors shadow-sm">
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
             </button>
             <motion.button 
               whileHover={{ scale: 1.05 }}
               className="bg-[#B35600] text-white px-8 py-3 rounded-2xl font-black text-xs shadow-lg shadow-orange-100/50"
             >
               Logs de Sécurité
             </motion.button>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-5 gap-6">
          <StatMini label="Total Créées" value={loading ? "..." : stats.total} sub="+12% ce mois" subColor="text-green-500" />
          <StatMini label="Délivrées" value={loading ? "..." : stats.delivered} sub="Taux auto-généré" subColor="text-orange-500" />
          {/* Dynamique : Les 3 premiers langages */}
          {rules.slice(0, 3).map((rule, idx) => (
            <StatProgress key={idx} label={rule.label} value={rule.value} color={idx === 0 ? "bg-orange-400" : "bg-blue-600"} />
          ))}
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Rules Configuration */}
          <div className="col-span-4 bg-white rounded-[40px] p-8 border border-slate-50 shadow-sm space-y-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-50 rounded-xl text-[#B35600]"><Settings size={20} /></div>
              <h3 className="font-black text-[#002366]">Seuils d'obtention</h3>
            </div>
            
            <div className="space-y-4">
              {rules.map((rule, index) => (
                <div key={index} className="flex items-center justify-between group">
                  <span className="text-xs font-bold text-slate-500">{rule.label}</span>
                  <input 
                    type="number"
                    value={rule.value}
                    onChange={(e) => {
                        const newRules = [...rules];
                        newRules[index].value = e.target.value;
                        setRules(newRules);
                    }}
                    className="w-20 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-xs font-black text-[#002366] text-right outline-none focus:ring-2 ring-orange-100" 
                  />
                </div>
              ))}
            </div>

            <button 
              onClick={handleUpdateRules}
              disabled={updating}
              className="w-full py-4 bg-[#B35600] text-white rounded-2xl font-black text-xs shadow-md flex items-center justify-center gap-2 hover:brightness-110 disabled:opacity-50"
            >
              {updating ? <Loader2 className="animate-spin" size={16} /> : <><Save size={16}/> Enregistrer les seuils</>}
            </button>

            <div className="bg-blue-50/50 p-6 rounded-3xl flex gap-4 border border-blue-100/50">
              <Info className="text-blue-500 shrink-0" size={20} />
              <p className="text-[10px] text-blue-600 font-bold leading-relaxed">
                Modifier ces valeurs impactera immédiatement l'éligibilité des étudiants n'ayant pas encore reçu leur diplôme.
              </p>
            </div>
          </div>

          {/* Certificate Preview (Statique Visuel) */}
          <div className="col-span-8 bg-white rounded-[40px] p-8 border border-slate-50 shadow-sm flex flex-col items-center justify-center">
             <div className="text-center mb-8">
                <ShieldCheck size={48} className="text-orange-500 mx-auto mb-4" />
                <h3 className="font-black text-[#002366] text-xl">Aperçu du Template Actif</h3>
                <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-2">ID: CERT-DEFAULT-2024</p>
             </div>
             
             {/* Le certificat miniature style premium */}
             <div className="w-[480px] aspect-[1.4/1] bg-slate-50 rounded-2xl border-4 border-white shadow-xl relative overflow-hidden flex flex-col items-center justify-center p-10">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#B35600]"></div>
                <h2 className="text-[#B35600] font-black text-lg tracking-[3px] mb-8">CODEBOOK ACADEMY</h2>
                <div className="h-px w-12 bg-slate-200 mb-6"></div>
                <p className="text-[10px] font-black text-slate-800 tracking-tighter italic">"Délivré pour excellence académique"</p>
                <div className="mt-auto w-full flex justify-between opacity-30">
                   <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                   <div className="w-16 h-4 bg-slate-200 rounded-lg"></div>
                </div>
             </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="bg-white rounded-[40px] border border-slate-50 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-[#002366]">Étudiants & Éligibilité</h3>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={16} />
              <input 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                type="text" 
                placeholder="Filtrer par nom ou email..." 
                className="pl-12 pr-6 py-3 bg-slate-50/50 rounded-2xl text-xs font-bold w-72 outline-none focus:ring-2 ring-orange-100" 
              />
            </div>
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-black text-slate-300 uppercase tracking-widest border-b border-slate-50">
                <th className="px-10 py-6">Étudiant</th>
                <th className="px-10 py-6">Parcours</th>
                <th className="px-10 py-6">Progression</th>
                <th className="px-10 py-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan="4" className="text-center py-20"><Loader2 className="animate-spin mx-auto text-slate-200" size={40} /></td></tr>
              ) : (
                filteredStudents.map((row, i) => (
                  <tr key={i} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-black text-xs uppercase">{row.name.substring(0,2)}</div>
                        <div>
                          <p className="text-sm font-black text-[#002366]">{row.name}</p>
                          <p className="text-[10px] font-bold text-slate-300">{row.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-xs font-bold text-slate-500">{row.path}</td>
                    <td className="px-10 py-6">
                       <div className="flex items-center gap-4">
                          <span className="text-xs font-black text-[#002366]">{row.progress}%</span>
                          <div className={`px-3 py-1 rounded-full text-[9px] font-black ${row.progress >= 80 ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                            {row.progress >= 80 ? 'ÉLIGIBLE' : 'EN COURS'}
                          </div>
                       </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button 
                        onClick={() => downloadPDF(row.id)}
                        disabled={row.progress < 80}
                        className={`p-3 rounded-xl transition-all ${row.progress >= 80 ? 'text-[#B35600] hover:bg-orange-50' : 'text-slate-200 cursor-not-allowed'}`}
                      >
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </motion.main>
    </div>
  );
};

// --- Sous-composants restants identiques au style initial ---
const StatMini = ({ label, value, sub, subColor }) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm transition-all">
    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">{label}</p>
    <p className="text-2xl font-[1000] text-[#002366] mb-1">{value}</p>
    <p className={`text-[10px] font-black ${subColor}`}>{sub}</p>
  </div>
);

const StatProgress = ({ label, value, color }) => (
  <div className="bg-white p-6 rounded-[32px] border border-slate-50 shadow-sm space-y-3">
    <div className="flex justify-between items-center font-black">
      <span className="text-[10px] text-slate-300 uppercase">{label}</span>
      <span className="text-sm text-[#002366]">{value}</span>
    </div>
    <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden">
      <div className={`h-full ${color}`} style={{ width: '70%' }} />
    </div>
  </div>
);

export default CertificatManager;