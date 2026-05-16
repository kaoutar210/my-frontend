import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  GraduationCap,
  Key,
  ArrowRight,
  Loader2,
  AlertCircle,
} from "lucide-react";
import API from "../../services/api";
import logoImg from "../../assets/codelink notebook.png";

const LoginPage = () => {
  const [accessCode, setAccessCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!accessCode.trim()) {
      setError("Veuillez saisir votre code d'accès.");
      return;
    }

    setIsLoading(true);

    try {
      const device_id =
        localStorage.getItem("device_id") || crypto.randomUUID();

      localStorage.setItem("device_id", device_id);

      const res = await API.post("/login", {
        access_code: accessCode.trim(),
        device_id,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (res.data.user.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/student/courses");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Code invalide");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4ff] font-sans flex flex-col">

      {/* Header */}
      <header className="px-8 py-5 flex items-center">
        <Link to="/" className="flex items-center gap-2 text-[#1754be] text-[17px] font-medium tracking-tight">
          <img src={logoImg} alt="logo" className="w-7 h-7 object-contain" />
          Codelink <span className="text-[#e5522d]">&nbsp;Notebook</span>
        </Link>
      </header>

      {/* Login box */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-[440px]">

          {/* Card */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">

            {/* Top banner */}
            <div className="bg-[#1754be] px-10 py-9 text-center">
              <div className="w-14 h-14 bg-white/10 border border-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="text-white" size={28} />
              </div>
              <h2 className="text-white text-xl font-medium tracking-tight">
                Connexion étudiant
              </h2>
              <p className="text-white/50 text-xs mt-1 tracking-wide">
                Entrez votre code d'accès pour continuer
              </p>
            </div>

            {/* Form */}
            <div className="px-10 py-9">
              <form onSubmit={handleLogin} className="space-y-5">

                {/* Input */}
                <div className="space-y-2">
                  <label className="text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
                    Code d'accès
                  </label>
                  <div className="relative">
                    <Key
                      size={15}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300"
                    />
                    <input
                      value={accessCode}
                      onChange={(e) => setAccessCode(e.target.value)}
                      disabled={isLoading}
                      placeholder="CB-XXXX-XXXX"
                      className="w-full pl-10 pr-4 py-3.5 bg-[#f8faff] border border-slate-100 rounded-xl text-sm font-medium text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1754be]/15 focus:border-[#1754be]/40 focus:bg-white transition-all"
                    />
                  </div>

                  {error && (
                    <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1.5">
                      <AlertCircle size={13} />
                      {error}
                    </p>
                  )}
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-[#e5522d] text-white py-3.5 rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-[#cc4522] transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Vérification...
                    </>
                  ) : (
                    <>
                      Accéder
                      <ArrowRight size={16} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer note */}
              <p className="text-center text-[11px] text-slate-400 mt-6">
                Pas encore de code ?{" "}
                <Link
                  to="/buy-notebook"
                  className="text-[#1754be] font-medium hover:text-[#e5522d] transition-colors"
                >
                  Acheter un Notebook
                </Link>
              </p>
            </div>
          </div>

          
        </div>
      </div>
    </div>
  );
};

export default LoginPage;