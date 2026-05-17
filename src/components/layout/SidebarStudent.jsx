import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  BookOpen,
  HelpCircle,
  Terminal,
  Award,
  Settings,
  LogOut,
  FileCode,
  Menu,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "../../assets/codelink notebook.png";
import API from "../../services/api";

/* Navigation config */
const NAVIGATION_LINKS = [
  //{ to: "/student/dashboard",      icon: LayoutDashboard, label: "Dashboard" },
  { to: "/student/courses",  icon: BookOpen,   label: "Courses" },
  { to: "/student/qcm",     icon: HelpCircle, label: "Quizzes" },
  { to: "/student/tps",     icon: FileCode,   label: "TP" },
  { to: "/student/codelab", icon: Terminal,   label: "CodeLab" },
  //{ to: "/student/profile",        icon: Settings,        label: "Profile" },
];

const Sidebar = ({ userRole = "user", brandName = "Codelink Notebook" }) => {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await API.post("/logout");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const closeMobile = () => setMobileOpen(false);

  const SidebarContent = () => (
    <>
      {/* Brand */}
      <div className="px-3 mb-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src={logoImg} alt="logo" className="w-7 h-7 object-contain" />
            <div className="leading-tight">
              <span className="text-[#1754be] text-[15px] font-medium tracking-tight">Codelink</span>
              <span className="text-[#e5522d] text-[15px] font-medium tracking-tight"> Notebook</span>
            </div>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={closeMobile}
            className="lg:hidden text-slate-400 hover:text-[#e5522d] transition-colors p-1"
            aria-label="Fermer le menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="mt-3 h-px bg-slate-100" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {NAVIGATION_LINKS.map((item) => (
          <SidebarItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
            onClick={closeMobile}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 mt-auto pt-8 space-y-3">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 text-sm font-medium hover:bg-[#fff3f0] hover:text-[#e5522d] transition-all"
        >
          <LogOut size={17} />
          Déconnexion
        </button>
        <p className="text-[10px] font-medium text-slate-300 uppercase tracking-widest px-1">
          Codelink Notebook v1.0
        </p>
      </div>
    </>
  );

  return (
    <>
      {/* ── Mobile top bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-white border-b border-slate-100 flex items-center justify-between px-4 shadow-sm">
        <button
          onClick={() => setMobileOpen(true)}
          className="text-slate-400 hover:text-[#1754be] transition-colors p-1"
          aria-label="Ouvrir le menu"
        >
          <Menu size={22} />
        </button>
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="logo" className="w-6 h-6 object-contain" />
          <span className="text-[#1754be] text-[14px] font-medium tracking-tight">
            Codelink<span className="text-[#e5522d]"> Notebook</span>
          </span>
        </div>
        {/* Spacer to keep logo centered */}
        <div className="w-8" />
      </div>

      {/* ── Mobile backdrop ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={closeMobile}
          />
        )}
      </AnimatePresence>

      {/* ── Mobile drawer ── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="lg:hidden fixed top-0 left-0 h-full w-64 bg-white z-50 flex flex-col py-7 px-4 shadow-xl"
          >
            <SidebarContent />
          </motion.aside>
        )}
      </AnimatePresence>

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex w-60 min-h-screen bg-white border-r border-slate-100 flex-col py-7 px-4 sticky top-0 h-screen">
        <SidebarContent />
      </aside>
    </>
  );
};

/* Sidebar item */
const SidebarItem = ({ to, icon: Icon, label, onClick }) => (
  <NavLink
    to={to}
    onClick={onClick}
    className={({ isActive }) =>
      `relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-200 ${
        isActive
          ? "bg-[#fff3f0] text-[#e5522d]"
          : "text-slate-400 hover:bg-[#f0f4ff] hover:text-[#1754be]"
      }`
    }
  >
    {({ isActive }) => (
      <>
        {isActive && (
          <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-1 h-7 bg-[#e5522d] rounded-r-full" />
        )}
        <Icon size={18} className={isActive ? "text-[#e5522d]" : "text-slate-400"} />
        <span className={`font-medium ${isActive ? "text-[#e5522d]" : ""}`}>
          {label}
        </span>
      </>
    )}
  </NavLink>
);

export default Sidebar;