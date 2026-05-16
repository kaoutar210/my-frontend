import React, { useState } from 'react';
import { Truck, CreditCard, ShieldCheck, ArrowLeft, Package, User, MapPin, Phone, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import logoImg from '../../assets/codelink notebook.png';
import API from '../../services/api';

const CommandePage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    zipCode: '',
    phone: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await API.post('/student/orders', {
        ...formData,
        product: "Codelink Notebook Premium",
        amount: 149
      });
      if (response) {
        alert("Commande confirmée !");
        navigate('/');
      }
    } catch (error) {
      console.error("Erreur commande:", error);
      alert("Une erreur est survenue lors de la commande.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">

      {/* Nav */}
      <nav className="h-[68px] bg-white border-b border-slate-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-50">
        <Link to="/buy-notebook" className="flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-[#e5522d] transition-colors">
          <ArrowLeft size={16} /> Retour
        </Link>
        <Link to="/" className="flex items-center gap-2 text-[#1754be] text-[17px] font-medium tracking-tight">
          <img src={logoImg} alt="logo" className="w-7 h-7 object-contain" />
          Codelink <span className="text-[#e5522d]">&nbsp;Notebook</span>
        </Link>
      </nav>

      <main className="max-w-[1200px] mx-auto px-6 lg:px-10 py-14">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-12 gap-10 items-start">

          {/* Formulaire livraison */}
          <div className="lg:col-span-7 space-y-8">

            {/* Header */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#e5522d] rounded-xl flex items-center justify-center text-white">
                <Truck size={22} />
              </div>
              <div>
                <h1 className="text-3xl font-medium text-[#0d1b3e] tracking-tight">Finaliser l'achat</h1>
                <p className="text-slate-400 text-xs tracking-widest uppercase mt-0.5">Expédition express sécurisée au Maroc</p>
              </div>
            </div>

            {/* Form card */}
            <div className="bg-white rounded-2xl p-8 border border-slate-100 space-y-8">

              {/* Identité */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <User size={15} className="text-slate-300" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-400">Destinataire</span>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>
                <div className="grid md:grid-cols-2 gap-5">
                  <InputGroup label="Prénom" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Amine" required />
                  <InputGroup label="Nom" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Bennani" required />
                </div>
              </div>

              {/* Adresse */}
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <MapPin size={15} className="text-slate-300" />
                  <span className="text-[10px] font-medium uppercase tracking-[0.25em] text-slate-400">Adresse de livraison</span>
                  <div className="flex-1 h-px bg-slate-100"></div>
                </div>
                <InputGroup label="Adresse complète" name="address" value={formData.address} onChange={handleChange} placeholder="N° 45, Rue des Far, Quartier Gauthier" required />
                <div className="grid md:grid-cols-3 gap-5">
                  <InputGroup label="Ville" name="city" value={formData.city} onChange={handleChange} placeholder="Casablanca" required />
                  <InputGroup label="Code Postal" name="zipCode" value={formData.zipCode} onChange={handleChange} placeholder="20000" required />
                  <InputGroup label="Téléphone" name="phone" value={formData.phone} onChange={handleChange} placeholder="06 12 34 56 78" required icon={<Phone size={13} />} />
                </div>
              </div>

              {/* Notice */}
              <div className="p-5 bg-[#fff3f0] rounded-xl border border-[#f5bfb0] flex items-start gap-3">
                <ShieldCheck className="text-[#e5522d] mt-0.5 shrink-0" size={18} />
                <p className="text-[12px] text-[#7a2a10] leading-relaxed">
                  Votre Codelink Notebook sera expédié sous <span className="font-medium underline">24h ouvrées</span>. Vous recevrez un SMS de confirmation avec votre numéro de suivi dès la sortie de l'entrepôt.
                </p>
              </div>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-5 sticky top-24">
            <div className="bg-[#0d1b3e] rounded-2xl p-8 text-white space-y-8 border border-slate-800">

              {/* Header panier */}
              <div className="flex items-center justify-between border-b border-white/10 pb-5">
                <h3 className="text-[15px] font-medium flex items-center gap-2">
                  <Package size={18} className="text-[#e5522d]" /> Votre panier
                </h3>
                <span className="bg-white/10 px-3 py-1 rounded-full text-[11px] font-medium">x1</span>
              </div>

              {/* Produit */}
              <div className="space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="block font-medium text-[15px]">Codelink Notebook</span>
                    <span className="block text-[11px] text-slate-400 mt-0.5 tracking-wide">Learning Ecosystem Access</span>
                  </div>
                  <span className="font-medium text-[#e5522d] text-[16px]">149 DH</span>
                </div>

                {/* Totaux */}
                <div className="bg-white/5 rounded-xl p-5 border border-white/5 space-y-3">
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="text-slate-400 tracking-wide">Sous-total</span>
                    <span className="font-medium">149
                      .00 DH</span>
                  </div>
                  <div className="flex justify-between items-center text-[12px]">
                    <span className="text-slate-400 tracking-wide">Livraison</span>
                    <span className="font-medium text-emerald-400">Gratuit</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                    <span className="text-[11px] text-slate-400 uppercase tracking-widest">Total</span>
                    <span className="text-2xl font-medium tracking-tight">149 <span className="text-sm">DH</span></span>
                  </div>
                </div>
              </div>

              {/* Bouton */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#e5522d] text-white py-4 rounded-xl font-medium text-sm tracking-wide hover:bg-[#cc4522] transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                {loading ? "Traitement..." : "Confirmer l'achat"}
              </button>

              {/* SSL */}
              <div className="flex flex-col items-center gap-3 opacity-40">
                <div className="flex gap-3">
                  <div className="h-5 w-9 bg-white/10 rounded"></div>
                  <div className="h-5 w-9 bg-white/10 rounded"></div>
                </div>
                <p className="text-[10px] uppercase tracking-[0.2em]">SSL Secure Checkout</p>
              </div>
            </div>
          </div>

        </form>
      </main>
    </div>
  );
};

/* Input component */
const InputGroup = ({ label, name, value, onChange, placeholder, required, icon }) => (
  <div className="space-y-2 group">
    <label className="flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400 ml-1 group-focus-within:text-[#e5522d] transition-colors">
      {icon} {label}
    </label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      placeholder={placeholder}
      className="w-full bg-[#f8faff] border border-slate-100 rounded-xl px-5 py-3.5 text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#e5522d]/15 focus:border-[#e5522d]/40 focus:bg-white transition-all placeholder:text-slate-300"
    />
  </div>
);

export default CommandePage;