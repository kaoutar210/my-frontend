import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UserPlus, ArrowLeft, User, Shield, 
  Lock, CheckCircle2, Loader2, KeyRound,
  ShieldCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../../../components/layout/SidebarAdmin';
import API from '../../../services/api';

const AddUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    access_code: '',
    password: '',
    role: 'student',
    status: 'Actif'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post('/admin/users/store', formData);
      setSuccess(true);
      setTimeout(() => navigate('/admin/users'), 2000);
    } catch (error) {
      console.error("Erreur creation:", error);
      alert("Erreur lors de la création de l'utilisateur");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#f0f4ff] font-sans">
      <Sidebar />

      <motion.main
        initial={{ opacity: 0, x: 16 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.35 }}
        className="flex-1 ml-60 p-10"
      >
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/admin/users')}
            className="p-3 bg-white rounded-xl border border-slate-100 text-slate-400 hover:text-[#e5522d] transition-colors shadow-sm"
          >
            <ArrowLeft size={18} />
          </motion.button>
          <div>
            <div className="text-[10px] font-medium text-[#e5522d] uppercase tracking-widest mb-1">
              Administration
            </div>
            <h1 className="text-3xl font-medium text-[#0d1b3e] tracking-tight">
              Nouvel étudiant
            </h1>
            <p className="text-slate-400 text-sm mt-0.5">Création d'accès plateforme</p>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">

          {/* Form */}
          <div className="col-span-7">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl p-9 border border-slate-100 shadow-sm relative overflow-hidden"
            >

              {/* Success overlay */}
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center"
                >
                  <div className="w-16 h-16 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center mb-4">
                    <CheckCircle2 size={32} />
                  </div>
                  <h2 className="text-xl font-medium text-[#0d1b3e] mb-2">Utilisateur créé !</h2>
                  <p className="text-slate-400 text-sm">Redirection vers la liste...</p>
                </motion.div>
              )}

              <div className="space-y-7">

                {/* Identité */}
                <div>
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4">
                    Identité de l'élève
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <InputGroup
                      label="Nom complet"
                      icon={<User size={16} />}
                      placeholder="Ex : Marc Lefebvre"
                      value={formData.name}
                      onChange={(val) => setFormData({ ...formData, name: val })}
                    />
                    <InputGroup
                      label="Code d'accès"
                      icon={<KeyRound size={16} />}
                      placeholder="CB-001"
                      value={formData.access_code}
                      onChange={(val) => setFormData({ ...formData, access_code: val })}
                    />
                  </div>
                </div>

                {/* Sécurité */}
                <div>
                  <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest mb-4">
                    Sécurité & rôle
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <InputGroup
                      label="Mot de passe"
                      type="password"
                      icon={<Lock size={16} />}
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={(val) => setFormData({ ...formData, password: val })}
                    />
                    <div className="space-y-2">
                      <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                        Rôle système
                      </label>
                      <div className="relative">
                        <Shield size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <select
                          className="w-full bg-[#f8faff] border border-slate-100 rounded-xl pl-11 pr-5 py-3.5 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all appearance-none"
                          value={formData.role}
                          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        >
                          <option value="student">Étudiant</option>
                          <option value="admin">Administrateur</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  disabled={loading}
                  type="submit"
                  className="w-full bg-[#e5522d] text-white py-4 rounded-xl text-sm font-medium flex items-center justify-center gap-3 hover:bg-[#cc4522] transition-all disabled:opacity-50 mt-2"
                >
                  {loading
                    ? <><Loader2 size={16} className="animate-spin" /> Création...</>
                    : <><UserPlus size={16} /> Valider l'inscription</>
                  }
                </motion.button>
              </div>
            </form>
          </div>

          {/* Info sidebar */}
          <div className="col-span-5 space-y-6">
            <div className="bg-[#0d1b3e] rounded-2xl p-8 text-white relative overflow-hidden group">
              <div className="absolute -right-8 -top-8 w-36 h-36 bg-white/5 rounded-full blur-3xl group-hover:bg-[#e5522d]/10 transition-colors" />

              <div className="w-12 h-12 bg-[#e5522d]/15 border border-[#e5522d]/20 rounded-xl flex items-center justify-center mb-6">
                <ShieldCheck size={24} className="text-[#e5522d]" />
              </div>

              <h3 className="text-xl font-medium mb-3 tracking-tight">Sécurité des accès</h3>
              <p className="text-blue-200/60 text-sm leading-relaxed mb-6">
                Chaque nouvel étudiant reçoit un code d'accès unique. Assurez-vous que le rôle correspond aux permissions souhaitées.
              </p>

              <ul className="space-y-3">
                {[
                  "Statut actif par défaut",
                  "Monitoring de progression",
                  "Accès multi-appareils"
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-[11px] font-medium uppercase tracking-widest text-blue-100/70">
                    <div className="w-1.5 h-1.5 bg-[#e5522d] rounded-full shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick info card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
              <div className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
                Format du code d'accès
              </div>
              <div className="flex items-center gap-3 p-4 bg-[#f0f4ff] border border-[#c7d5f5] rounded-xl">
                <div className="w-9 h-9 bg-[#eef3fc] rounded-xl flex items-center justify-center shrink-0">
                  <KeyRound size={16} className="text-[#1754be]" />
                </div>
                <div>
                  <p className="text-sm font-medium text-[#0d1b3e]">CB-XXXX-XXXX</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Imprimé sur le Notebook</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.main>
    </div>
  );
};

/* InputGroup */
const InputGroup = ({ label, icon, placeholder, type = "text", value, onChange }) => (
  <div className="space-y-2">
    <label className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
      {label}
    </label>
    <div className="relative group">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-[#1754be] transition-colors">
        {icon}
      </div>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#f8faff] border border-slate-100 rounded-xl pl-11 pr-5 py-3.5 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1754be]/10 focus:border-[#1754be]/30 transition-all"
        required
      />
    </div>
  </div>
);

export default AddUser;