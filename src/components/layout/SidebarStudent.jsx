import React from "react";
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
} from "lucide-react";
import logoImg from "../../assets/codelink notebook.png";
import API from "../../services/api";

/* Navigation config */
const NAVIGATION_LINKS = [
  //{ to: "/student/dashboard",      icon: LayoutDashboard, label: "Dashboard" },
  { to: "/student/courses",        icon: BookOpen,        label: "Courses" },
  { to: "/student/qcm",            icon: HelpCircle,      label: "Quizzes" },
  { to: "/student/tps",            icon: FileCode,        label: "TP" },
  { to: "/student/codelab",        icon: Terminal,        label: "CodeLab" },
  //{ to: "/student/profile",        icon: Settings,        label: "Profile" },
];

const Sidebar = ({ userRole = "user", brandName = "Codelink Notebook" }) => {
  const navigate = useNavigate();

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
    <aside className="w-60 min-h-screen bg-white border-r border-slate-100 flex flex-col py-7 px-4">

      {/* Brand */}
      <div className="px-3 mb-10">
        <div className="flex items-center gap-2">
          <img src={logoImg} alt="logo" className="w-7 h-7 object-contain" />
          <div className="leading-tight">
            <span className="text-[#1754be] text-[15px] font-medium tracking-tight">Codelink</span>
            <span className="text-[#e5522d] text-[15px] font-medium tracking-tight"> Notebook</span>
          </div>
        </div>
        <div className="mt-3 h-px bg-slate-100" />
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1">
        {NAVIGATION_LINKS.map((item) => (
          <SidebarItem
            key={item.to}
            to={item.to}
            icon={item.icon}
            label={item.label}
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
    </aside>
  );
};

/* Sidebar item */
const SidebarItem = ({ to, icon: Icon, label }) => (
  <NavLink
    to={to}
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
        {/* Active bar */}
        {isActive && (
          <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-1 h-7 bg-[#e5522d] rounded-r-full" />
        )}

        {/* Icon */}
        <Icon
          size={18}
          className={isActive ? "text-[#e5522d]" : "text-slate-400"}
        />

        {/* Label */}
        <span className={`font-medium ${isActive ? "text-[#e5522d]" : ""}`}>
          {label}
        </span>
      </>
    )}
  </NavLink>
);

export default Sidebar;