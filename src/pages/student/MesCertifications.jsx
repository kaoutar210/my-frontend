import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
Trophy, Award, BookOpen, TrendingUp, 
CheckCircle2, Lock, Download, Share2, 
Star, Info, LayoutGrid, Sparkles, Loader2
} from 'lucide-react';
import axios from 'axios'; // Ou votre instance API personnalisée

import Sidebar from '../../components/layout/SidebarStudent';

const MesCertifications = () => {
const [data, setData] = useState({
  stats: {},
  courses_progress: [],
  certifications: [],
  latest_cert: null,
  current_badge: ""
});
const [loading, setLoading] = useState(true);

// --- RÉCUPÉRATION DES DONNÉES ---
useEffect(() => {
  const fetchCerts = async () => {
    try {
      const response = await axios.get('/api/student/certifications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });

      setData(response.data);

    } catch (error) {
      console.error("Erreur backend:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchCerts();
}, []);

const containerVariants = {
hidden: { opacity: 0 },
visible: { 
opacity: 1, 
transition: { staggerChildren: 0.1 } 
}
};

const fadeInUp = {
hidden: { y: 20, opacity: 0 },
visible: { 
y: 0, 
opacity: 1, 
transition: { type: "spring", stiffness: 100, damping: 15 } 
}
};

if (loading) return (
<div className="flex h-screen w-full items-center justify-center bg-[#F8FAFC]">
<Loader2 className="animate-spin text-orange-500" size={40} />
</div>
);

return (
<div className="flex min-h-screen bg-[#F8FAFC] font-sans">
<Sidebar />

{/* Rapprochement : ml-64 au lieu de ml-72 et p-8 au lieu de p-10 */}
<motion.main 
initial="hidden" animate="visible" variants={containerVariants}
className="flex-1 ml-6 p-8 space-y-10"
>
{/* --- HERO SECTION --- */}
<motion.div variants={fadeInUp} className="relative bg-[#1e293b] rounded-[40px] p-12 overflow-hidden shadow-2xl">
<div className="relative z-10 max-w-2xl">
<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-orange-500/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-6 border border-orange-500/30">
<Trophy size={24} className="text-orange-500" />
</motion.div>
<h1 className="text-4xl font-[1000] text-white mb-3 tracking-tighter">Mes Certifications</h1>
<p className="text-slate-400 font-medium text-base">Validez votre expertise et partagez vos succès avec le monde.</p>
</div>

<motion.div 
whileHover={{ scale: 1.05, rotate: -1 }}
className="absolute right-12 top-1/2 -translate-y-1/2 bg-gradient-to-br from-[#FF8A00] to-[#FFB800] p-8 rounded-[35px] shadow-xl text-center hidden xl:block"
>
<p className="text-[9px] font-black uppercase tracking-[2px] mb-2 text-white/80">Badge de Progression</p>
<h2 className="text-2xl font-black text-white italic flex items-center justify-center gap-2">
{data?.current_badge || "N/A"} <Sparkles size={18} />
</h2>
</motion.div>
</motion.div>

{/* --- STATS ROW --- */}
<div className="grid grid-cols-3 gap-6">
<StatCard icon={<Award className="text-orange-500" />} label="Certificats" value={data?.stats?.total || 0} />
<StatCard icon={<BookOpen className="text-blue-500" />} label="Cours finis" value={data?.stats?.completed || 0} />
<StatCard icon={<TrendingUp className="text-emerald-500" />} label="Moyenne" value={`${data?.stats?.avg || 0}%`} />
</div>

{/* --- CONTENT GRID --- */}
<div className="grid grid-cols-12 gap-8 pt-2">

{/* Left: Progression */}
<motion.div variants={fadeInUp} className="col-span-12 lg:col-span-4 bg-white rounded-[40px] p-8 border border-slate-100 shadow-sm space-y-8">
<div className="flex items-center gap-4">
<div className="p-3 bg-slate-50 rounded-xl text-[#0F172A]"><LayoutGrid size={20} strokeWidth={2.5}/></div>
<h3 className="text-xl font-black text-[#0F172A] tracking-tight">Progression</h3>
</div>

<div className="space-y-6">
{(data?.courses_progress || []).map((course, i) => (
<ProgressBar key={i} label={course.name} value={course.progress} color={course.color} />
))}
</div>

<div className="bg-orange-50/50 p-6 rounded-[28px] border border-orange-100/50 flex gap-4">
<Info className="text-orange-400 shrink-0" size={20} />
<p className="text-[11px] text-orange-900 font-bold leading-relaxed">
Le bouton d'examen s'active automatiquement à <span className="text-orange-600 underline">80% de complétion</span>.
</p>
</div>
</motion.div>

{/* Right: Grid Certifications */}
<div className="col-span-12 lg:col-span-8 grid grid-cols-1 md:grid-cols-2 gap-6">
 {(data?.certifications || []).map((cert) => (
 <motion.div 
key={cert.id}
variants={fadeInUp}
whileHover={{ y: -8, boxShadow: "0 20px 40px rgba(0,0,0,0.04)" }}
className={`bg-white p-8 rounded-[40px] border-2 transition-all ${cert.status === 'Obtenu' ? 'border-orange-500/20' : 'border-transparent'}`}
 >
<div className="flex items-center justify-between mb-6">
<span className="text-[10px] font-black p-2 rounded-lg bg-slate-50 text-slate-500 uppercase">{cert.type}</span>
{cert.status === 'Obtenu' && <Star size={16} className="text-orange-500" fill="currentColor"/>}
</div>
<h4 className="font-black text-lg text-[#0F172A] mb-2">{cert.title}</h4>
<p className="text-[12px] text-slate-400 font-medium mb-8 line-clamp-2">{cert.desc}</p>

<button className={`w-full py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${
cert.status === 'Verrouillé' ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-[#0F172A] text-white hover:bg-orange-600'
}`}>
{cert.status === 'Verrouillé' ? `Bloqué (${cert.progress}%)` : cert.status === 'Obtenu' ? 'Voir Certificat' : 'Passer l\'examen'}
</button>
 </motion.div>
 ))}
</div>
</div>

{/* --- LAST OBTAINED (Optionnel si vide) --- */}
{data?.latest_cert && (
<motion.section variants={fadeInUp} className="pt-4 pb-10">
 <div className="bg-[#0F172A] rounded-[48px] p-10 flex flex-col md:flex-row items-center gap-12 border border-slate-800">
<div className="w-full md:w-5/12 group relative">
 <div className="absolute -inset-2 bg-orange-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition duration-500" />
 <img src={data.latest_cert.img} alt="Preview" className="relative w-full rounded-xl shadow-2xl border border-white/5 rotate-1 group-hover:rotate-0 transition-transform duration-500" />
</div>
<div className="w-full md:w-7/12 space-y-6">
 <h2 className="text-3xl font-[1000] text-white tracking-tighter leading-none">
 {data?.latest_cert?.title}
 </h2>
 <div className="grid grid-cols-2 gap-6">
<InfoBox label="Score" value={`${data.latest_cert.score}/100`} dark />
<InfoBox label="Délivré le" value={data.latest_cert.date} dark />
 </div>
 <div className="flex gap-4 pt-4">
<button className="flex-1 bg-white text-[#0F172A] py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all flex items-center justify-center gap-3">
<Download size={16}/> PDF
</button>
<button className="p-4 bg-slate-800 text-white rounded-2xl hover:bg-slate-700 transition-colors">
<Share2 size={20}/>
</button>
 </div>
</div>
 </div>
</motion.section>
)}
</motion.main>
</div>
);
};

// --- SUB-COMPONENTS ---
const StatCard = ({ icon, label, value }) => (
<div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex items-center gap-6">
<div className="bg-slate-50 p-5 rounded-2xl shrink-0">
{React.cloneElement(icon, { size: 22, strokeWidth: 2.5 })}
</div>
<div>
<p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
<p className="text-3xl font-[1000] text-[#0F172A] tracking-tighter">{value}</p>
</div>
</div>
);

const ProgressBar = ({ label, value, color }) => (
<div className="space-y-2">
<div className="flex justify-between text-[11px] font-black uppercase">
<span className="text-[#0F172A]">{label}</span>
<span className="text-orange-500">{value}%</span>
</div>
<div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
<motion.div 
initial={{ width: 0 }} animate={{ width: `${value}%` }} 
className={`h-full ${color} rounded-full`} 
/>
</div>
</div>
);

const InfoBox = ({ label, value, dark }) => (
<div className={`border-l-2 ${dark ? 'border-slate-700' : 'border-slate-100'} pl-4`}>
<p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${dark ? 'text-slate-500' : 'text-slate-300'}`}>{label}</p>
<p className={`text-lg font-black ${dark ? 'text-white' : 'text-[#0F172A]'}`}>{value}</p>
</div>
);

// --- MOCK DATA POUR LA STRUCTURE ---
const mockData = {
stats: { total: "02", completed: "18", avg: "94" },
current_badge: "Expert Frontend",
courses_progress: [
{ name: "React Design Patterns", progress: 85, color: "bg-blue-500" },
{ name: "Tailwind Architecture", progress: 62, color: "bg-cyan-500" },
{ name: "Node.js API Essentials", progress: 15, color: "bg-emerald-500" }
],
certifications: [
{ id: 1, title: "HTML Specialist", status: "Obtenu", desc: "Expertise en SEO et sémantique.", type: "HTML", progress: 100 },
{ id: 2, title: "CSS Master", status: "Disponible", desc: "Animations et Layouts complexes.", type: "CSS", progress: 82 },
{ id: 3, title: "JavaScript Core", status: "Verrouillé", desc: "Asynchronisme et DOM.", type: "JS", progress: 45 }
],
latest_cert: {
title: "Certification HTML Specialist",
score: 98,
date: "12 Mai 2026",
img: "https://i.imgur.com/8QjZz4Z.png"
}
};

export default MesCertifications; 