import { Routes, Route } from "react-router-dom";

/* PUBLIC */
import LandingPage from "../pages/public/LandingPage";
import AboutPage from "../pages/public/AboutPage";
import NotebookPage from "../pages/public/NotebookPage";
import CommandePage from "../pages/public/CommandePage";


/* AUTH */
import LoginPage from "../pages/auth/LoginPage";


/* STUDENT */
//import DashboardPage from "../pages/student/DashboardPage";
import CoursesPage from "../pages/student/CoursesPage";
import LanguageDetail from "../pages/student/LanguageDetail";
import MesCertifications from "../pages/student/MesCertifications";
import QCMIndexPage from "../pages/student/QCMIndexPage";
import QCMPlayPage from "../pages/student/QCMPlayPage";
import QCMResultsPage from "../pages/student/QCMResulsPage";
import TPPage from "../pages/student/TPPage";
import TPDetail from "../pages/student/TPDetail";
import CodeLabPage from "../pages/student/CodeLabPage";
import ProfilePage from "../pages/student/ProfilePage";
import LanguagePage from "../pages/student/LanguagePage";


/* ADMIN */
import AdminDashboard from "../pages/admin/AdminDashboard";

import PDFManager from "../pages/admin/pdf/PDFManager";
import AddPDF from "../pages/admin/pdf/AddPDF";

import CertificatManager from "../pages/admin/certification/CertificatManager";
import AddCertificat from "../pages/admin/certification/AddCertificat";

import QCMManager from "../pages/admin/qcm/QCMManager";
import AddQCM from "../pages/admin/qcm/AddQCM";

import TPManager from "../pages/admin/tp/TPManager";
import AddTP from "../pages/admin/tp/AddTP";

import UsersManager from "../pages/admin/users/UsersManager";
import AddUser from "../pages/admin/users/AddUser";

/* ROUTE GUARDS */
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";


export default function AppRoutes() {
  return (
    <Routes>

      {/* 🌍 PUBLIC */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/buy-notebook" element={<NotebookPage />} />
      <Route path="/commande" element={<CommandePage />} />

      {/* 🔐 AUTH */}
      <Route path="/login" element={<LoginPage />} />
      

      {/* 🎓 STUDENT (Protected) */}
{/* 🎓 STUDENT */}
<Route element={<ProtectedRoute />}>

  {/* STEP 1: ALL LANGUAGES */}
  <Route path="/student/courses" element={<CoursesPage />} />

  {/* STEP 2: SELECTED LANGUAGE */}
  <Route path="/student/language/:languageId" element={<LanguagePage />} />

  {/* STEP 3: LANGUAGE DETAILS (PDF / LESSONS) */}
  <Route path="/student/language/:languageId/details" element={<LanguageDetail />} />

  {/* OTHER */}
  <Route path="/student/codelab" element={<CodeLabPage />} />
  <Route path="/student/certifications" element={<MesCertifications />} />
  <Route path="/student/qcm" element={<QCMIndexPage />} />
  <Route path="/student/qcm/:languageId" element={<QCMPlayPage />} />
  <Route path="/student/qcm/results" element={<QCMResultsPage />} />

  <Route path="/student/tps" element={<TPPage />} />
  <Route path="/student/tps/:tpId" element={<TPDetail/>} />

  <Route path="/student/profile" element={<ProfilePage />} />

</Route>

      {/* 🛠️ ADMIN (Protected + Role) */}
      <Route element={<AdminRoute />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* PDF */}
        <Route path="/admin/pdf" element={<PDFManager />} />
        <Route path="/admin/pdf/add" element={<AddPDF />} />

        {/* Certifications */}
        <Route path="/admin/certifications" element={<CertificatManager />} />
        <Route path="/admin/certifications/add" element={<AddCertificat />} />

        {/* QCM */}
        <Route path="/admin/qcm" element={<QCMManager />} />
        <Route path="/admin/qcm/add" element={<AddQCM />} />

        {/* TP */}
        <Route path="/admin/tp" element={<TPManager />} />
        <Route path="/admin/tp/add" element={<AddTP />} />

        {/* Users */}
        <Route path="/admin/users" element={<UsersManager />} />
        <Route path="/add/user" element={<AddUser/>} />
      </Route>

      {/* ❌ 404 fallback */}
      <Route path="*" element={<div>404 Not Found</div>} />

    </Routes>
  );
}