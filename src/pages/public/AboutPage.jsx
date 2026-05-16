import React from 'react';
import { 
  Target, Eye, Book, RefreshCw, Terminal, 
  Linkedin, Twitter, ArrowRight, ExternalLink 
} from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">
      
      {/* --- Navigation --- */}
      <nav className="h-20 flex items-center justify-between px-12 border-b border-slate-50 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <h1 className="text-[#F97316] text-xl font-black uppercase tracking-tighter">
          CodeBook Academy
        </h1>
        <div className="hidden md:flex items-center gap-10">
          <a href="#" className="text-sm font-black text-[#F97316]">À propos</a>
          <a href="#" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Cours</a>
          <a href="#" className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors">Tarifs</a>
          <div className="w-8 h-8 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Admin" />
          </div>
        </div>
      </nav>

      {/* --- Hero Section: The Bridge Concept --- */}
      <section className="px-12 py-20 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="space-y-8">
          <span className="bg-orange-50 text-[#F97316] text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">
            Notre Histoire
          </span>
          <h2 className="text-5xl xl:text-6xl font-black text-slate-900 leading-[1.1]">
            Le pont entre le <span className="text-[#F97316]">papier</span> et le <span className="text-blue-600">code</span>.
          </h2>
          <p className="text-lg text-slate-500 leading-relaxed font-medium">
            CodeBook Academy est née d'une constatation simple : l'apprentissage de la programmation est plus efficace lorsqu'il combine la réflexion manuscrite et la pratique digitale. Nous avons créé le premier système hybride au monde dédié aux futurs ingénieurs.
          </p>
          <button className="bg-[#F97316] text-white px-8 py-4 rounded-2xl font-black text-lg shadow-xl shadow-orange-200 hover:scale-105 transition-all">
            Découvrir le concept
          </button>
        </div>
        
        <div className="relative group">
          <div className="absolute -inset-4 bg-orange-100 rounded-[40px] blur-3xl opacity-30"></div>
          <div className="relative rounded-[32px] overflow-hidden shadow-2xl border-8 border-white">
            <img 
              src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200" 
              alt="Hybrid Learning" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* --- Mission & Vision Grid --- */}
      <section className="px-12 py-12 max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
        <div className="bg-white p-12 rounded-[40px] border border-slate-100 shadow-sm space-y-6">
          <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-[#F97316]">
            <Target size={24} />
          </div>
          <h3 className="text-3xl font-black text-slate-900">Notre Mission</h3>
          <p className="text-slate-500 leading-relaxed font-medium">
            Nous brisons les barrières de l'apprentissage technique. Notre mission est d'équiper chaque étudiant avec des outils méthodologiques qui transforment la frustration du débogage en plaisir de la création. Nous rendons la maîtrise du code accessible à tous, sans compromis sur la rigueur.
          </p>
        </div>

        <div className="bg-[#006699] p-12 rounded-[40px] text-white space-y-6 relative overflow-hidden">
          <Eye className="absolute top-8 right-8 opacity-20" size={80} />
          <div className="relative z-10 space-y-6">
            <h3 className="text-3xl font-black">Notre Vision</h3>
            <p className="text-blue-50 leading-relaxed font-medium opacity-90">
              Démocratiser l'excellence technique à l'échelle mondiale. Nous voyons un futur où l'éducation technologique n'est plus un privilège, mais un droit universel, porté par des outils intelligents qui s'adaptent au rythme de chaque apprenant.
            </p>
          </div>
        </div>
      </section>

      {/* --- The CodeBook Approach --- */}
      <section className="px-12 py-24 bg-[#f8fafc] mt-12">
        <div className="max-w-7xl mx-auto text-center mb-16 space-y-4">
          <h3 className="text-4xl font-black text-slate-900">L'Approche CodeBook</h3>
          <p className="text-slate-400 font-medium italic">Un écosystème conçu pour la rétention cognitive et la vitesse d'exécution.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-12 max-w-7xl mx-auto">
          <ApproachItem 
            icon={<Book className="text-[#F97316]" />} 
            title="Le Notebook Physique" 
            desc="Un carnet haut de gamme pour structurer vos algorithmes loin des distractions de l'écran." 
          />
          <ApproachItem 
            icon={<RefreshCw className="text-blue-500" />} 
            title="Synchronisation IA" 
            desc="Scannez vos notes pour les transformer instantanément en code exécutable dans votre dashboard." 
          />
          <ApproachItem 
            icon={<Terminal className="text-[#F97316]" />} 
            title="CodeLab Interactif" 
            desc="Pratiquez en temps réel avec un environnement de développement Cloud intégré et guidé." 
          />
        </div>
      </section>

      {/* --- Founder Section --- */}
      <section className="px-12 py-24 max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
        <div className="relative">
          <div className="absolute -bottom-6 -right-6 w-full h-full border-4 border-[#F97316] rounded-[32px] -z-10"></div>
          <img 
            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800" 
            className="rounded-[32px] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" 
            alt="Founder" 
          />
        </div>
        <div className="space-y-8">
          <h3 className="text-4xl font-black text-slate-900 leading-tight">Le visage derrière le code</h3>
          <div className="space-y-2">
            <h4 className="text-xl font-black text-[#F97316]">Marc-Antoine Vallet</h4>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Fondateur & CEO</p>
          </div>
          <p className="text-lg text-slate-500 leading-relaxed font-medium italic">
            "J'ai créé CodeBook Academy parce que j'en avais assez des tutoriels vidéos passifs. Je voulais redonner aux étudiants le pouvoir de l'écriture et de la logique pure."
          </p>
          <p className="text-slate-500 leading-relaxed font-medium">
            Ancien ingénieur logiciel senior avec plus de 10 ans d'expérience dans la Silicon Valley, Marc-Antoine dédie désormais sa carrière à la pédagogie technologique. Sa vision est de fusionner le meilleur des méthodes traditionnelles avec la puissance du digital.
          </p>
          <div className="flex gap-6 pt-4">
             <a href="#" className="flex items-center gap-2 text-sm font-black text-blue-600 hover:underline"><Linkedin size={18}/> LinkedIn</a>
             <a href="#" className="flex items-center gap-2 text-sm font-black text-slate-800 hover:underline"><Twitter size={18}/> Twitter/X</a>
          </div>
        </div>
      </section>

      {/* --- Final CTA --- */}
      <section className="px-12 py-24 bg-white">
        <div className="max-w-6xl mx-auto bg-gradient-to-br from-[#F97316] to-orange-600 rounded-[48px] p-16 text-center text-white shadow-2xl shadow-orange-200">
           <h3 className="text-4xl font-black mb-6">Prêt à transformer votre manière <br /> d'apprendre ?</h3>
           <p className="text-orange-50 font-medium mb-12 max-w-xl mx-auto">
             Rejoignez plus de 50,000 étudiants qui ont déjà franchi le pas vers une maîtrise technique supérieure.
           </p>
           <button className="bg-white text-[#F97316] px-12 py-5 rounded-2xl font-black text-xl hover:scale-105 transition-all flex items-center gap-4 mx-auto">
             Commencer maintenant <ArrowRight size={24} />
           </button>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="px-12 py-12 border-t border-slate-100 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-[#F97316] text-lg font-black uppercase tracking-tighter">CodeBook Academy</h1>
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-[0.2em]">© 2024 CodeBook Academy. Propulsé par l'excellence technique.</p>
        </div>
        <div className="flex gap-8 text-[11px] font-black text-slate-400 uppercase tracking-widest">
          <a href="#" className="hover:text-[#F97316]">À propos</a>
          <a href="#" className="hover:text-[#F97316]">Support</a>
          <a href="#" className="hover:text-[#F97316]">Confidentialité</a>
          <a href="#" className="hover:text-[#F97316]">Conditions</a>
        </div>
      </footer>
    </div>
  );
};

const ApproachItem = ({ icon, title, desc }) => (
  <div className="flex flex-col items-center text-center space-y-6 group">
    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
      {icon}
    </div>
    <div className="space-y-3">
      <h4 className="text-xl font-black text-slate-800">{title}</h4>
      <p className="text-sm text-slate-400 leading-relaxed font-medium">{desc}</p>
    </div>
  </div>
);

export default AboutPage;