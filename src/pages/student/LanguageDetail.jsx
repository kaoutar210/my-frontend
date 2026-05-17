import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Minus, Plus, Maximize2,
  Loader2, AlertCircle
} from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from "../../components/layout/SidebarStudent";
import API from "../../services/api";

/* ─────────────────────────────────────────────
   SCOPED STYLES
───────────────────────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');

  :root {
    --blue:       #1754be;
    --orange:     #e5522d;
    --white:      #ffffff;
    --ink:        #0d1b3e;
    --muted:      #8896b3;
    --border:     #eef0f5;
    --bg:         #f7f9fc;
    --toolbar-h:  56px;
    --sidebar-top: 3.5rem;   /* hauteur top-bar mobile du Sidebar */
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes ld-spin { to { transform: rotate(360deg); } }
  .ld-spin { animation: ld-spin 1s linear infinite; }

  .ld-root { font-family: 'DM Sans', sans-serif; color: var(--ink); }

  /* ── loaders ── */
  .ld-fullloader {
    display: flex; align-items: center; justify-content: center;
    height: 100dvh; height: 100vh; background: var(--bg);
  }
  .ld-error {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    height: 100dvh; height: 100vh;
    background: var(--bg); gap: 12px; padding: 24px; text-align: center;
  }
  .ld-error svg { color: var(--muted); }
  .ld-error p { font-weight: 500; color: var(--muted); font-size: 15px; }
  .ld-error button {
    margin-top: 8px; font-family: 'DM Sans', sans-serif; font-weight: 600;
    font-size: 13px; color: var(--blue); cursor: pointer; border: none; background: none;
    text-decoration: underline; text-underline-offset: 3px;
  }

  /* ════════════════════════════════════════
     SHELL
     Mobile  : sidebar = barre en haut (var(--sidebar-top) = 3.5rem)
               => hauteur dispo = 100dvh - 3.5rem
     Desktop : sidebar = colonne gauche
               => hauteur dispo = 100dvh
  ════════════════════════════════════════ */
  .ld-shell {
    display: flex;
    height: calc(100dvh - var(--sidebar-top));
    height: calc(100vh  - var(--sidebar-top));
    overflow: hidden;
  }
  @media (min-width: 1024px) {
    .ld-shell { height: 100dvh; height: 100vh; }
  }

  .ld-main {
    flex: 1; min-width: 0;
    display: flex; flex-direction: column;
    overflow: hidden;
  }

  /* ── toolbar ── */
  .ld-toolbar {
    height: var(--toolbar-h);
    background: var(--ink); border-bottom: 2px solid var(--blue);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 12px; flex-shrink: 0; z-index: 10; gap: 8px;
  }
  @media (min-width: 640px)  { .ld-toolbar { padding: 0 20px; gap: 12px; } }
  @media (min-width: 1024px) { .ld-toolbar { padding: 0 24px; gap: 16px; } }

  .ld-toolbar-left { display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1; }

  .ld-back-btn {
    width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
    cursor: pointer; transition: background .2s; color: var(--white);
    -webkit-tap-highlight-color: transparent;
  }
  .ld-back-btn:hover  { background: rgba(255,255,255,.16); }
  .ld-back-btn:active { background: rgba(255,255,255,.24); }

  .ld-file-name {
    font-family: 'Playfair Display', serif; font-weight: 700; font-size: 13px;
    color: var(--white); letter-spacing: -.01em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 140px;
  }
  @media (min-width: 480px) { .ld-file-name { max-width: 220px; font-size: 14px; } }
  @media (min-width: 768px) { .ld-file-name { max-width: 340px; } }

  .ld-file-meta {
    font-family: 'JetBrains Mono', monospace; font-size: 9px;
    letter-spacing: .12em; text-transform: uppercase; color: var(--muted); margin-top: 2px;
  }
  @media (max-width: 479px) { .ld-file-meta { display: none; } }

  .ld-toolbar-center { display: none; align-items: center; gap: 4px; flex-shrink: 0; }
  @media (min-width: 540px) { .ld-toolbar-center { display: flex; } }

  .ld-page-btn {
    width: 26px; height: 26px; border-radius: 8px; border: none;
    background: rgba(255,255,255,.07); color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .2s, color .2s;
  }
  .ld-page-btn:hover { background: rgba(255,255,255,.14); color: var(--white); }
  .ld-page-label {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500;
    color: var(--white); padding: 0 8px; letter-spacing: .06em; white-space: nowrap;
  }

  .ld-toolbar-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  @media (min-width: 640px) { .ld-toolbar-right { gap: 10px; } }

  .ld-zoom {
    display: flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
    border-radius: 10px; padding: 4px 10px;
  }
  @media (max-width: 400px) { .ld-zoom { display: none; } }

  .ld-zoom-btn {
    color: var(--muted); cursor: pointer; transition: color .2s;
    background: none; border: none; display: flex; align-items: center;
  }
  .ld-zoom-btn:hover { color: var(--white); }
  .ld-zoom-val {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
    color: var(--white); min-width: 32px; text-align: center; letter-spacing: .04em;
  }

  .ld-icon-btn {
    width: 30px; height: 30px; border-radius: 10px; border: none;
    background: rgba(255,255,255,.07); color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .2s, color .2s;
  }
  .ld-icon-btn:hover { background: rgba(255,255,255,.14); color: var(--white); }
  @media (max-width: 480px) { .ld-icon-btn { display: none; } }

  .ld-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: linear-gradient(135deg, var(--blue), var(--orange));
    flex-shrink: 0;
  }
  @media (max-width: 639px) { .ld-dot { display: none; } }

  /* ════════════════════════════════════════
     VIEWER  —  overflow:hidden car l'iframe
     gère son propre scroll interne
  ════════════════════════════════════════ */
  .ld-viewer {
    flex: 1;
    overflow: hidden;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(23,84,190,.06) 0%, transparent 60%),
      var(--bg);
    display: flex;
    justify-content: center;
    align-items: stretch;   /* sheet prend toute la hauteur */
  }

  /* ════════════════════════════════════════
     PDF SHEET  — LE VRAI FIX MOBILE

     Problème original :
       .ld-sheet  avait  min-height: 600px
       L'iframe avait   height: 100%
       → Sur mobile, height:100% d'un parent min-height = 0px
         Le PDF ne montrait qu'une seule page.

     Fix :
       1. .ld-sheet devient flex column avec une hauteur EXACTE
          calculée en dvh, sans min-height.
       2. .ld-iframe prend flex:1 → exactement la hauteur restante.
       3. Le PDF scrolle nativement dans l'iframe sur tous les devices.
  ════════════════════════════════════════ */
  .ld-sheet {
    background: var(--white);
    box-shadow: 0 8px 40px rgba(13,27,62,.13), 0 2px 8px rgba(13,27,62,.07);
    border-radius: 4px;
    width: 100%; max-width: 860px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;

    /* hauteur exacte = écran - top-sidebar - toolbar */
    height: calc(100dvh - var(--sidebar-top) - var(--toolbar-h));
    height: calc(100vh  - var(--sidebar-top) - var(--toolbar-h));
  }
  @media (min-width: 1024px) {
    /* pas de top-sidebar sur desktop */
    .ld-sheet {
      height: calc(100dvh - var(--toolbar-h));
      height: calc(100vh  - var(--toolbar-h));
    }
  }

  /* bande de couleur en haut */
  .ld-sheet::before {
    content: ''; display: block; height: 4px; flex-shrink: 0;
    background: linear-gradient(90deg, var(--blue), var(--orange));
  }

  /* ── iframe : flex:1 = toute la hauteur sous la bande ── */
  .ld-iframe {
    flex: 1;
    width: 100%;
    border: none;
    display: block;
  }

  /* ── fallback (pas de file_path) ── */
  .ld-fallback { padding: 32px 24px; overflow-y: auto; flex: 1; }
  @media (min-width: 640px)  { .ld-fallback { padding: 48px 48px; } }
  @media (min-width: 1024px) { .ld-fallback { padding: 64px 72px; } }

  .ld-module-pill {
    display: inline-flex; align-items: center;
    font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 9px;
    letter-spacing: .16em; text-transform: uppercase;
    padding: 5px 14px; border-radius: 999px;
    background: linear-gradient(135deg, var(--blue), rgba(23,84,190,.7));
    color: var(--white); margin-bottom: 24px;
  }
  .ld-fallback-title {
    font-family: 'Playfair Display', serif; font-weight: 800;
    font-size: clamp(1.6rem, 5vw, 3rem); color: var(--ink);
    line-height: 1.1; letter-spacing: -.02em; margin-bottom: 20px;
  }
  .ld-fallback-divider {
    height: 3px; width: 56px; border-radius: 3px; border: none;
    background: linear-gradient(90deg, var(--orange), rgba(229,82,45,.3));
    margin-bottom: 28px;
  }
  .ld-fallback-desc {
    font-weight: 300; font-size: 15px;
    color: var(--muted); line-height: 1.75; margin-bottom: 32px; max-width: 580px;
  }
  .ld-fallback-placeholder {
    border: 1.5px dashed var(--border); border-radius: 16px;
    padding: 32px 20px; text-align: center;
  }
  .ld-fallback-placeholder p { font-size: 14px; color: var(--muted); font-style: italic; }

  /* ── watermark ── */
  .ld-watermark {
    position: absolute; bottom: 12px; right: 12px;
    pointer-events: none; user-select: none; opacity: .04;
    font-family: 'Playfair Display', serif; font-weight: 800;
    font-size: clamp(18px, 4vw, 48px); color: var(--ink); white-space: nowrap;
    transform: rotate(-12deg); transform-origin: bottom right;
  }
`;

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
const LanguageDetail = () => {
  const { languageId } = useParams();
  const location       = useLocation();
  const navigate       = useNavigate();
  const courseId       = location.state?.courseId;

  const [course,  setCourse]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom,    setZoom]    = useState(100);

  useEffect(() => {
    if (!courseId) { setLoading(false); return; }
    (async () => {
      try {
        const res = await API.get(`/courses/${courseId}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Erreur de chargement du PDF:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [courseId]);

  /* ── loading ── */
  if (loading) return (
    <>
      <style>{style}</style>
      <div className="ld-fullloader">
        <Loader2 size={44} style={{ color: "var(--blue)" }} className="ld-spin" />
      </div>
    </>
  );

  /* ── error ── */
  if (!course) return (
    <>
      <style>{style}</style>
      <div className="ld-error">
        <AlertCircle size={44} />
        <p>Cours introuvable ou ID manquant.</p>
        <button onClick={() => navigate(-1)}>← Retour</button>
      </div>
    </>
  );

  const pdfSrc = `https://codelink-dng0fcepgjhmfma6.francecentral-01.azurewebsites.net/storage/${course.file_path}#toolbar=0&navpanes=0`;

  return (
    <>
      <style>{style}</style>

      {/* pt-14 = 3.5rem = offset barre top mobile du Sidebar */}
      <div className="ld-root ld-shell pt-14 lg:pt-0">

        <Sidebar
          brandName="CodeLink"
          onLogout={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        />

        <main className="ld-main">

          {/* ── TOOLBAR ── */}
          <header className="ld-toolbar">
            <div className="ld-toolbar-left">
              <div className="ld-dot" />
              <button className="ld-back-btn" onClick={() => navigate(-1)} aria-label="Retour">
                <ChevronLeft size={16} />
              </button>
              <div style={{ minWidth: 0 }}>
                <div className="ld-file-name">
                  {course.title}<span style={{ color: "var(--orange)" }}>.pdf</span>
                </div>
                <div className="ld-file-meta">
                  {course.category || languageId} &mdash; Contenu Sécurisé
                </div>
              </div>
            </div>

            <div className="ld-toolbar-center">
              <button className="ld-page-btn" aria-label="Page précédente"><ChevronLeft size={13} /></button>
              <span className="ld-page-label">Page 1 / 1</span>
              <button className="ld-page-btn" aria-label="Page suivante"><ChevronRight size={13} /></button>
            </div>

            <div className="ld-toolbar-right">
              <div className="ld-zoom">
                <button className="ld-zoom-btn" onClick={() => setZoom(z => Math.max(50, z - 10))} aria-label="Zoom -">
                  <Minus size={13} />
                </button>
                <span className="ld-zoom-val">{zoom}%</span>
                <button className="ld-zoom-btn" onClick={() => setZoom(z => Math.min(200, z + 10))} aria-label="Zoom +">
                  <Plus size={13} />
                </button>
              </div>
              <button className="ld-icon-btn" aria-label="Plein écran">
                <Maximize2 size={15} />
              </button>
            </div>
          </header>

          {/* ── VIEWER ── */}
          <div className="ld-viewer">
            <div className="ld-sheet">

              {course.file_path ? (
                <iframe
                  className="ld-iframe"
                  src={pdfSrc}
                  title={course.title}
                  allow="fullscreen"
                  /*
                    zoom CSS property : marche sur Chrome/Edge mobile.
                    Sur Safari on laisse à 100% (pas supporté).
                    C'est un bonus — le vrai fix est la hauteur flex:1.
                  */
                  style={zoom !== 100 ? { zoom: zoom / 100 } : undefined}
                />
              ) : (
                <div className="ld-fallback">
                  <span className="ld-module-pill">Module {course.module_number || "01"}</span>
                  <h2 className="ld-fallback-title">{course.title}</h2>
                  <hr className="ld-fallback-divider" />
                  <p className="ld-fallback-desc">{course.description}</p>
                  <div className="ld-fallback-placeholder">
                    <p>Le contenu détaillé de ce module est en cours de génération…</p>
                  </div>
                </div>
              )}

              <div className="ld-watermark" aria-hidden="true">CodeLink Secure</div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default LanguageDetail;