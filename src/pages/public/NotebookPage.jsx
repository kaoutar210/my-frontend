import React, { useState } from 'react';
import { 
  BookOpen, QrCode, Laptop, ShieldCheck, 
  ChevronDown, ArrowRight, Star
} from 'lucide-react';
import { Link } from 'react-router-dom';
import notebookImg from '../../assets/notebook.jpg';
import logoImg from '../../assets/codelink notebook.png';

const PAGE_DATA = {
  product: {
    name: "Codelink Notebook",
    subtitle: "Premium Edition",
    price: "99",
    currency: "DH",
    description: "Accédez à une plateforme complète avec un simple scan. Transformez votre façon d'apprendre le code avec l'alliance parfaite du papier et du numérique."
  },
  features: [
    { 
      icon: <BookOpen size={20} className="text-[#e5522d]" />, 
      title: "Notebook physique", 
      desc: "Un carnet premium conçu pour les développeurs, avec des grilles de conception." 
    },
    { 
      icon: <QrCode size={20} className="text-[#e5522d]" />, 
      title: "Accès plateforme", 
      desc: "Le QR code unique intégré vous ouvre les portes de notre écosystème numérique." 
    },
    { 
      icon: <Laptop size={20} className="text-[#e5522d]" />, 
      title: "Cours + QCM + exercices", 
      desc: "Bibliothèque complète de ressources interactives et quiz de validation." 
    }
  ],
  faqs: [
    { q: "Comment fonctionne le QR Code ?", a: "Scannez le code unique sur la première page pour activer votre accès." },
    { q: "Puis-je l'utiliser sur plusieurs appareils ?", a: "Oui, jusqu'à 3 appareils simultanément avec synchronisation." },
    { q: "Quels sont les délais de livraison ?", a: "Entre 24h et 72h partout au Maroc." }
  ]
};

const NotebookPage = () => {
  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* Nav */}
      <nav className="h-[68px] bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-2 text-[#1754be] text-[18px] font-medium tracking-tight">
          <img
            src={logoImg}
            alt="logo"
            className="w-7 h-7 object-contain"
          />
          Codelink <span className="text-[#e5522d]">&nbsp;Notebook</span>
        </Link>
        <Link to="/login" className="text-sm font-medium text-slate-400 hover:text-[#e5522d] transition-colors">
          Connexion
        </Link>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 lg:px-10 py-16 space-y-24">

        {/* Hero */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-7">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#fff3f0] text-[#e5522d] border border-[#f5bfb0] rounded-full px-4 py-1.5 text-[11px] font-medium tracking-wide">
              <Star size={11} fill="currentColor" /> {PAGE_DATA.product.subtitle}
            </div>

            <h1 className="text-5xl lg:text-[58px] font-medium text-[#0d1b3e] leading-[1.08] tracking-tight">
              Achetez votre <br />
              <span className="text-[#e5522d]">Codelink</span>{' '}
              <span className="text-[#1754be]">Notebook</span>
            </h1>

            <p className="text-[16px] text-slate-500 leading-relaxed max-w-md">
              {PAGE_DATA.product.description}
            </p>

            <Link
              to="/commande"
              className="inline-flex items-center gap-3 bg-[#e5522d] text-white px-8 py-4 rounded-xl font-medium text-[15px] hover:bg-[#cc4522] hover:-translate-y-0.5 transition-all group"
            >
              Commander maintenant
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Image */}
          <div className="relative flex items-center justify-center bg-gradient-to-br from-[#f0f4ff] to-[#e8f0fe] border border-[#c7d5f5] rounded-2xl p-8 min-h-[420px]">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 bg-[#1754be]/10 rounded-full blur-3xl"></div>
            </div>
            <img
              src={notebookImg}
              alt="Codelink Notebook"
              className="relative z-10 w-full max-w-[380px] object-contain drop-shadow-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </section>

        {/* Features & Security */}
        <section className="grid lg:grid-cols-3 gap-6">

          {/* Features card */}
          <div className="lg:col-span-2 bg-white rounded-2xl p-10 border border-slate-100 space-y-10">
            <div>
              <div className="text-xs font-medium tracking-[0.1em] text-[#e5522d] uppercase mb-2">Inclus dans le pack</div>
              <h2 className="text-3xl font-medium text-[#0d1b3e] tracking-tight">Le pack complet</h2>
            </div>
            <div className="grid gap-8">
              {PAGE_DATA.features.map((f, i) => (
                <FeatureItem key={i} icon={f.icon} title={f.title} desc={f.desc} />
              ))}
            </div>
          </div>

          {/* Security card */}
          <div className="bg-[#0d1b3e] rounded-2xl p-10 text-white flex flex-col justify-between relative overflow-hidden group">
            <ShieldCheck className="absolute -right-6 -top-6 text-white/5 group-hover:scale-110 transition-transform" size={200} />
            <div className="space-y-5 relative z-10">
              <div className="w-12 h-12 bg-[#e5522d]/10 border border-[#e5522d]/20 rounded-xl flex items-center justify-center text-[#e5522d]">
                <ShieldCheck size={24} />
              </div>
              <h3 className="text-xl font-medium tracking-tight">Multi-appareils</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Connectez-vous sur PC, Tablette et Mobile. Votre progression est sauvegardée dans le cloud Codelink.
              </p>
            </div>
            
          </div>
        </section>

        {/* Pricing Banner */}
        <section>
          <div className="bg-[#1754be] rounded-2xl p-10 lg:p-14 text-white flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="text-xs font-medium tracking-[0.12em] text-white/50 uppercase mb-3">
                Paiement unique · Accès à vie · Livraison 48h
              </div>
              <h2 className="text-4xl font-medium tracking-tight">Offre de lancement</h2>
            </div>
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="flex items-start gap-1">
                <span className="text-6xl font-medium tracking-tight">{PAGE_DATA.product.price}</span>
                <span className="text-xl font-medium mt-2">{PAGE_DATA.product.currency}</span>
              </div>
              <Link
                to="/commande"
                className="bg-[#e5522d] px-8 py-4 rounded-xl font-medium text-sm hover:bg-[#cc4522] transition-all"
              >
                Valider ma commande
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto space-y-10 pb-20">
          <div className="text-center">
            <div className="text-xs font-medium tracking-[0.1em] text-[#e5522d] uppercase mb-3">FAQ</div>
            <h2 className="text-4xl font-medium text-[#0d1b3e] tracking-tight">Questions fréquentes</h2>
          </div>
          <div className="grid gap-3">
            {PAGE_DATA.faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.q} answer={faq.a} />
            ))}
          </div>
        </section>

      </main>

      
    </div>
  );
};

/* Sub-components */
const FeatureItem = ({ icon, title, desc }) => (
  <div className="flex gap-5 items-start group">
    <div className="w-11 h-11 bg-slate-50 rounded-xl flex items-center justify-center shrink-0 border border-slate-100 group-hover:bg-[#fff3f0] group-hover:border-[#f5bfb0] transition-colors">
      {icon}
    </div>
    <div>
      <h4 className="font-medium text-[15px] text-[#0d1b3e] mb-1">{title}</h4>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  </div>
);

const FAQItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <div
      onClick={() => setIsOpen(!isOpen)}
      className={`bg-white p-6 rounded-xl border transition-all cursor-pointer ${
        isOpen ? 'border-[#e5522d] ring-2 ring-[#e5522d]/10' : 'border-slate-100 hover:border-slate-200'
      }`}
    >
      <div className="flex justify-between items-center gap-4">
        <h4 className="font-medium text-[#0d1b3e] text-[14px]">{question}</h4>
        <ChevronDown
          size={18}
          className={`text-[#e5522d] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>
      {isOpen && (
        <p className="mt-4 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">
          {answer}
        </p>
      )}
    </div>
  );
};

export default NotebookPage;