import React from "react";
import { motion } from "framer-motion";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  FileText,
  BookOpen,
  Layers,
  Users,
  LogOut,
   Award,
} from "lucide-react";
import logoImg from "../../assets/codelink notebook.png";
import API from "../../services/api";
import CertificatManager from "../../pages/admin/certification/CertificatManager";

const SidebarAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const items = [
    { label: "Tableau de bord", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Gestion des PDF",  path: "/admin/pdf",       icon: FileText },
    { label: "Gestion des QCM", path: "/admin/qcm",       icon: BookOpen },
    { label: "Gestion des TP",  path: "/admin/tp",        icon: Layers },
    { label: "Utilisateurs",    path: "/admin/users",     icon: Users },
  ];

  const handleLogout = async () => {
    try {
      await API.post("/logout");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <aside className="w-60 bg-white border-r border-slate-100 flex flex-col fixed h-full z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">

      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="logo" className="w-7 h-7 object-contain" />
          <div className="leading-tight">
            <span className="text-[#1754be] text-[15px] font-medium tracking-tight">Codelink</span>
            <span className="text-[#e5522d] text-[15px] font-medium tracking-tight"> Notebook</span>
          </div>
        </div>
        <div className="mt-1.5">
          <span className="text-[10px] font-medium text-slate-400 uppercase tracking-widest">
            Admin Panel
          </span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-5 space-y-1">
        {items.map((item, i) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <NavLink key={i} to={item.path}>
              <motion.div
                whileHover={{ x: 4 }}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer transition-all text-sm ${
                  isActive
                    ? "bg-[#fff3f0] text-[#e5522d]"
                    : "text-slate-400 hover:text-[#1754be] hover:bg-[#f0f4ff]"
                }`}
              >
                <Icon
                  size={17}
                  className={isActive ? "text-[#e5522d]" : ""}
                />
                <span className="font-medium">{item.label}</span>

                {/* Active bar */}
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#e5522d]" />
                )}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 pb-6 pt-4 border-t border-slate-100 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 text-sm font-medium hover:bg-[#fff3f0] hover:text-[#e5522d] transition-all"
        >
          <LogOut size={17} />
          Déconnexion
        </button>

        <p className="text-[10px] font-medium text-slate-300 uppercase tracking-widest text-center">
          Admin Panel v1.0
        </p>
      </div>
    </aside>
  );
};

export default SidebarAdmin;