import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, PlayCircle, Layers, MousePointer2,
  Terminal, Globe, Infinity, Cursor
} from 'lucide-react';
import notebookImg from '../../assets/notebook.jpg';
import logoImg from '../../assets/codelink notebook.png';


const CONTENT = {
  hero: {
    badge: "Nouveau : Masterclass Next.js 14",
    title: { main: "Apprenez le Front-End", highlight: "Plus Vite." },
    desc: "Maîtrisez l'art des applications web modernes. Notre plateforme immersive vous propulse du niveau débutant à expert avec des projets réels.",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200"
  },
  stats: [
    { num: "12 000+", label: "apprenants actifs" },
    { num: "200+", label: "heures de contenu" },
    { num: "98%", label: "taux de satisfaction" }
  ],
  features: [
    {
      title: "Accès Illimité",
      desc: "Débloquez tous les cours, du Frontend au DevOps. De nouveaux contenus ajoutés chaque mois.",
      icon: <Layers size={20} className="text-[#e5522d]" />,
      iconBg: "bg-[#fff3f0]",
      colSpan: "col-span-1"
    },
    {
      title: "Support 24/7",
      desc: "Ne restez jamais bloqué. Notre communauté et nos assistants IA sont disponibles à tout moment.",
      icon: <Globe size={20} className="text-white opacity-80" />,
      iconBg: "bg-white/20",
      colSpan: "col-span-1",
      accent: true
    },
    {
      title: "Apprentissage Interactif",
      desc: "Votre navigateur devient votre éditeur. Pratiquez directement avec notre playground intégré.",
      icon: <MousePointer2 size={20} className="text-[#1754be]" />,
      iconBg: "bg-[#eef3fc]",
      colSpan: "col-span-1"
    },
    {
      title: "LMS + QCM + TP",
      desc: "Une triade complète : cours structurés, quiz de validation et travaux pratiques guidés.",
      icon: <Terminal size={20} className="text-[#1754be]" />,
      iconBg: "bg-[#dce9fb]",
      colSpan: "col-span-1"
    }
  ],
  steps: [
    { title: "Choisir", desc: "Sélectionnez le plan qui correspond à vos objectifs personnels." },
    { title: "Apprendre", desc: "Suivez les leçons et complétez les modules interactifs à votre rythme." },
    { title: "Pratiquer", desc: "Travaillez sur des projets réels en conditions de production." },
    { title: "Décoller", desc: "Recevez votre certification et postulez aux meilleurs postes." }
  ],
  techStack: [
    { label: "HTML5 Mastery", color: "bg-[#fff3f0] text-[#b83c19] border-[#f5bfb0]" },
    { label: "CSS3 & Layouts", color: "bg-[#eef3fc] text-[#1245a0] border-[#b8cef5]" },
    { label: "Bootstrap 5", color: "bg-[#f0eefe] text-[#5040b0] border-[#ccc8f0]" },
    { label: "JavaScript ES6+", color: "bg-[#fffbeb] text-[#8c6000] border-[#f5d878]" }
  ]
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-800">

      {/* --- Navigation --- */}
      <nav className="h-[68px] flex items-center justify-between px-6 lg:px-10 border-b border-slate-100 sticky top-0 bg-white/90 backdrop-blur-md z-50">
        <Link to="/" className="flex items-center gap-2 text-[#1754be] text-[18px] font-medium tracking-tight">
          <img
            src={logoImg}
            alt="logo"
            className="w-7 h-7 object-contain"
          />
          Codelink <span className="text-[#e5522d]">&nbsp;Notebook</span>
        </Link>
        <Link
          to="/login"
          className="bg-[#1754be] text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-[#1245a0] transition-colors"
        >
          Connexion
        </Link>
      </nav>

      {/* --- Hero --- */}
      <section className="px-6 lg:px-10 py-20 max-w-[1200px] mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div>
          

          <h1 className="text-5xl lg:text-[56px] font-medium text-[#0d1b3e] leading-[1.08] tracking-tight mb-5">
            {CONTENT.hero.title.main}<br />
            <span className="text-[#e5522d]">{CONTENT.hero.title.highlight}</span>
          </h1>

          <p className="text-[16px] text-slate-500 leading-relaxed max-w-md mb-9">
            {CONTENT.hero.desc}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              to="/buy-notebook"
              className="flex items-center gap-2 text-[#1754be] px-6 py-3 rounded-lg text-sm font-medium border border-[#1754be] hover:bg-[#eef3fc] transition-colors"
            >
              <PlayCircle size={16} /> Acheter Notebook
            </Link>
          </div>
        </div>

        {/* Hero visual */}
<div className="relative flex items-center justify-center bg-gradient-to-br from-[#f0f4ff] to-[#e8f0fe] border border-[#c7d5f5] rounded-2xl p-8 min-h-[420px]">
  
  {/* Glow effect derrière l'image */}
  <div className="absolute inset-0 flex items-center justify-center">
    <div className="w-64 h-64 bg-[#1754be]/10 rounded-full blur-3xl"></div>
  </div>

  {/* Image notebook */}
  <img
    src={notebookImg}
    alt="Codelink Notebook"
    className="relative z-10 w-full max-w-[380px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
  />
</div>
      </section>

      {/* --- Stats bar --- */}
      <div className="bg-[#1754be] grid grid-cols-3">
        {CONTENT.stats.map((s, i) => (
          <div key={i} className={`text-center py-8 ${i < 2 ? 'border-r border-white/15' : ''}`}>
            <div className="text-3xl font-medium text-white tracking-tight">{s.num}</div>
            <div className="text-xs text-white/60 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* --- Features --- */}
      <section className="px-6 lg:px-10 py-20 max-w-[1200px] mx-auto">
        <div className="text-xs font-medium tracking-[0.1em] text-[#e5522d] uppercase mb-3">Fonctionnalités</div>
        <h2 className="text-4xl font-medium text-[#0d1b3e] tracking-tight mb-3">Une expérience d'apprentissage unique</h2>
        <p className="text-slate-500 text-[15px] mb-12 max-w-lg">Une méthodologie intégrée aux outils professionnels, conçue pour des résultats concrets.</p>

        <div className="grid grid-cols-2 gap-4">
          {CONTENT.features.map((feat, idx) => (
            <FeatureCard key={idx} {...feat} />
          ))}
        </div>
      </section>

      {/* --- Steps --- */}
      <section className="bg-[#f8faff] px-6 lg:px-10 py-20">
        <div className="max-w-[1200px] mx-auto">
          <div className="text-xs font-medium tracking-[0.1em] text-[#e5522d] uppercase mb-3">Parcours</div>
          <h2 className="text-4xl font-medium text-[#0d1b3e] tracking-tight mb-12">Votre parcours de réussite</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
            {CONTENT.steps.map((step, idx) => (
              <Step key={idx} number={idx + 1} title={step.title} desc={step.desc} />
            ))}
          </div>
        </div>
      </section>

      {/* --- Footer --- */}
      <footer className="bg-[#0d1b3e] text-white px-6 lg:px-10 pt-16 pb-8">
        <div className="max-w-[1200px] mx-auto grid md:grid-cols-3 gap-12 mb-12">
          <div>
            <div className="text-[#e5522d] text-[17px] font-medium mb-3">Codelink Notebook</div>
            <p className="text-white/40 text-sm leading-relaxed max-w-[260px]">
              Former la prochaine génération d'ingénieurs logiciels avec passion et méthode.
            </p>
          </div>
          <FooterLinks title="Support" links={["Facturation", "Centre d'aide", "Sécurité"]} />
          <FooterLinks title="Légal" links={["Mentions légales", "Confidentialité", "Cookies"]} />
        </div>
        <div className="max-w-[1200px] mx-auto border-t border-white/10 pt-6 flex justify-between items-center">
          <span className="text-white/30 text-xs">© 2025 Codelink Notebook. Tous droits réservés.</span>
          <span className="text-[#1754be] text-xs">Made with ♥ for devs</span>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ title, desc, icon, iconBg, accent }) => (
  <div className={`p-7 rounded-2xl border transition-all hover:shadow-sm ${accent ? 'bg-[#1754be] border-[#1754be]' : 'bg-white border-slate-100 hover:border-slate-200'}`}>
    <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-5 ${iconBg}`}>
      {icon}
    </div>
    <h3 className={`text-[15px] font-medium mb-2 ${accent ? 'text-white' : 'text-[#0d1b3e]'}`}>{title}</h3>
    <p className={`text-[13px] leading-relaxed ${accent ? 'text-white/65' : 'text-slate-500'}`}>{desc}</p>
  </div>
);

const Step = ({ number, title, desc }) => (
  <div className="group text-center">
    <div className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-[13px] font-medium text-[#1754be] mx-auto mb-5 transition-all group-hover:bg-[#e5522d] group-hover:text-white group-hover:border-[#e5522d]">
      {number}
    </div>
    <h4 className="text-[11px] font-medium text-[#0d1b3e] uppercase tracking-widest mb-2">{title}</h4>
    <p className="text-[13px] text-slate-500 leading-relaxed">{desc}</p>
  </div>
);

const FooterLinks = ({ title, links }) => (
  <div>
    <h5 className="text-[10px] font-medium uppercase tracking-[0.15em] text-white/35 mb-5">{title}</h5>
    <ul className="space-y-3">
      {links.map((link) => (
        <li key={link}>
          <a className="text-[13px] text-white/55 hover:text-[#e5522d] cursor-pointer transition-colors">{link}</a>
        </li>
      ))}
    </ul>
  </div>
);

export default LandingPage;