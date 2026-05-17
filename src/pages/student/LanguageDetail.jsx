import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Minus, Plus, Maximize2,
  Loader2, AlertCircle
} from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from "../../components/layout/SidebarStudent";
import API from "../../services/api";

const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');

  :root {
    --blue:   #1754be;
    --orange: #e5522d;
    --white:  #ffffff;
    --ink:    #0d1b3e;
    --muted:  #8896b3;
    --border: #eef0f5;
    --bg:     #f7f9fc;
  }

  *, *::before, *::after { box-sizing: border-box; }
  .ld-root { font-family: 'DM Sans', sans-serif; color: var(--ink); }

  .ld-fullloader {
    display: flex; align-items: center; justify-content: center;
    height: 100vh; background: var(--bg);
  }

  .ld-error {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    min-height: 100vh; background: var(--bg); gap: 12px; padding: 24px; text-align: center;
  }
  .ld-error svg { color: var(--muted); }
  .ld-error p { font-weight: 500; color: var(--muted); font-size: 15px; }
  .ld-error button {
    margin-top: 8px; font-family: 'DM Sans', sans-serif; font-weight: 600;
    font-size: 13px; color: var(--blue); cursor: pointer; border: none; background: none;
    text-decoration: underline; text-underline-offset: 3px;
  }

  /* ── toolbar: sticky so it stays visible while page scrolls on mobile ── */
  .ld-toolbar {
    height: 52px;
    background: var(--ink);
    border-bottom: 2px solid var(--blue);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 10px; gap: 6px;
    position: sticky; top: 0; z-index: 20;
    flex-shrink: 0;
  }
  @media (min-width: 640px)  { .ld-toolbar { padding: 0 20px; gap: 12px; height: 56px; } }
  @media (min-width: 1024px) { .ld-toolbar { padding: 0 24px; gap: 16px; } }

  .ld-toolbar-left { display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1; }

  .ld-back-btn {
    width: 30px; height: 30px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
    cursor: pointer; transition: background .2s; color: var(--white);
  }
  .ld-back-btn:hover { background: rgba(255,255,255,.16); }

  .ld-file-name {
    font-family: 'Playfair Display', serif; font-weight: 700; font-size: 12px;
    color: var(--white); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 110px;
  }
  @media (min-width: 400px)  { .ld-file-name { max-width: 160px; font-size: 13px; } }
  @media (min-width: 540px)  { .ld-file-name { max-width: 240px; font-size: 14px; } }
  @media (min-width: 768px)  { .ld-file-name { max-width: 360px; } }

  .ld-file-meta {
    font-family: 'JetBrains Mono', monospace; font-size: 8px;
    letter-spacing: .1em; text-transform: uppercase; color: var(--muted);
    margin-top: 2px; display: none;
  }
  @media (min-width: 480px) { .ld-file-meta { display: block; } }

  .ld-toolbar-center { display: none; align-items: center; gap: 4px; flex-shrink: 0; }
  @media (min-width: 560px) { .ld-toolbar-center { display: flex; } }

  .ld-page-btn {
    width: 26px; height: 26px; border-radius: 8px; border: none;
    background: rgba(255,255,255,.07); color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .2s, color .2s;
  }
  .ld-page-btn:hover { background: rgba(255,255,255,.14); color: var(--white); }
  .ld-page-label {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500;
    color: var(--white); padding: 0 8px; white-space: nowrap;
  }

  .ld-toolbar-right { display: flex; align-items: center; gap: 5px; flex-shrink: 0; }

  .ld-zoom {
    display: flex; align-items: center; gap: 4px;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
    border-radius: 8px; padding: 4px 8px;
  }
  @media (max-width: 380px) { .ld-zoom { display: none; } }

  .ld-zoom-btn {
    color: var(--muted); cursor: pointer; transition: color .2s;
    background: none; border: none; display: flex; align-items: center;
  }
  .ld-zoom-btn:hover { color: var(--white); }
  .ld-zoom-val {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
    color: var(--white); min-width: 28px; text-align: center;
  }

  .ld-icon-btn {
    width: 28px; height: 28px; border-radius: 8px; border: none;
    background: rgba(255,255,255,.07); color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .2s, color .2s;
  }
  .ld-icon-btn:hover { background: rgba(255,255,255,.14); color: var(--white); }
  @media (max-width: 420px) { .ld-icon-btn { display: none; } }

  .ld-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: linear-gradient(135deg, var(--blue), var(--orange));
    flex-shrink: 0; display: none;
  }
  @media (min-width: 640px) { .ld-dot { display: block; } }

  /* ── viewer ── */
  .ld-viewer {
    background:
      radial-gradient(ellipse at 20% 50%, rgba(23,84,190,.06) 0%, transparent 60%),
      repeating-linear-gradient(0deg, transparent, transparent 39px, var(--border) 40px),
      var(--bg);
    padding: 16px 8px 40px;
    display: flex; justify-content: center; align-items: flex-start;
  }
  @media (min-width: 640px)  { .ld-viewer { padding: 24px 16px 60px; } }
  @media (min-width: 1024px) { .ld-viewer { padding: 40px 24px; flex: 1; overflow-y: auto; } }

  /* ── PDF sheet ── */
  .ld-sheet {
    background: var(--white);
    box-shadow: 0 16px 48px rgba(13,27,62,.12), 0 2px 8px rgba(13,27,62,.08);
    border-radius: 4px;
    width: 100%; max-width: 860px;
    position: relative;
    transform-origin: top center;
    overflow: hidden;
  }

  .ld-sheet::before {
    content: ''; display: block; height: 4px;
    background: linear-gradient(90deg, var(--blue), var(--orange));
  }

  /*
    THE KEY FIX FOR MOBILE:
    iframe height is viewport-based so it's tall enough to show all PDF content.
    The PAGE scrolls (not the iframe), giving the native browser PDF scroll experience.
    On desktop the iframe fills 100% of its fixed-height container.
  */
  .ld-iframe {
    width: 100%; display: block; border: none;
    /* Mobile: tall enough so PDF is not clipped */
    height: 85vh;
    min-height: 480px;
  }
  @media (min-width: 640px)  { .ld-iframe { height: 90vh; min-height: 680px; } }
  @media (min-width: 1024px) { .ld-iframe { height: 100%; min-height: 1100px; } }

  /* fallback */
  .ld-fallback { padding: 28px 20px; }
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
    font-size: clamp(1.5rem, 5vw, 3rem); color: var(--ink);
    line-height: 1.1; letter-spacing: -.02em; margin-bottom: 20px;
  }

  .ld-fallback-divider {
    height: 3px; width: 56px; border-radius: 3px; border: none;
    background: linear-gradient(90deg, var(--orange), rgba(229,82,45,.3));
    margin-bottom: 28px;
  }

  .ld-fallback-desc {
    font-family: 'DM Sans', sans-serif; font-weight: 300; font-size: 15px;
    color: var(--muted); line-height: 1.75; margin-bottom: 32px; max-width: 580px;
  }
  @media (min-width: 640px) { .ld-fallback-desc { font-size: 17px; } }

  .ld-fallback-placeholder {
    border: 1.5px dashed var(--border); border-radius: 16px; padding: 32px 20px; text-align: center;
  }
  .ld-fallback-placeholder p {
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: var(--muted); font-style: italic;
  }

  .ld-watermark {
    position: absolute; top: 50%; right: -60px;
    transform: translateY(-50%) rotate(45deg);
    pointer-events: none; user-select: none; opacity: .035;
    font-family: 'Playfair Display', serif; font-weight: 800;
    font-size: clamp(28px, 8vw, 72px); color: var(--ink); white-space: nowrap;
  }

  @keyframes ld-spin { to { transform: rotate(360deg); } }
  .ld-spin { animation: ld-spin 1s linear infinite; }
`;

const LanguageDetail = () => {
  const { languageId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const courseId = location.state?.courseId;

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await API.get(`/courses/${courseId}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Erreur de chargement du PDF:", err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourseDetails();
  }, [courseId]);

  if (loading) return (
    <>
      <style>{style}</style>
      <div className="ld-fullloader">
        <Loader2 size={44} style={{ color: "var(--blue)" }} className="ld-spin" />
      </div>
    </>
  );

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

  return (
    <>
      <style>{style}</style>

      {/*
        LAYOUT STRATEGY:
        Mobile  → normal document flow, the entire PAGE scrolls (no h-screen, no overflow:hidden)
        Desktop → flex row fills 100vh, only the viewer div scrolls internally
      */}
      <div className="ld-root pt-14 lg:pt-0 flex lg:h-screen lg:overflow-hidden">

        <Sidebar
          brandName="CodeLink"
          onLogout={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        />

        <main className="flex-1 flex flex-col">

          {/* Toolbar — sticky so it stays at top when page scrolls on mobile */}
          <header className="ld-toolbar">
            <div className="ld-toolbar-left">
              <div className="ld-dot" />
              <button className="ld-back-btn" onClick={() => navigate(-1)}>
                <ChevronLeft size={15} />
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
              <button className="ld-page-btn"><ChevronLeft size={13} /></button>
              <span className="ld-page-label">Page 1 / 1</span>
              <button className="ld-page-btn"><ChevronRight size={13} /></button>
            </div>

            <div className="ld-toolbar-right">
              <div className="ld-zoom">
                <button className="ld-zoom-btn" onClick={() => setZoom(z => Math.max(50, z - 10))}>
                  <Minus size={12} />
                </button>
                <span className="ld-zoom-val">{zoom}%</span>
                <button className="ld-zoom-btn" onClick={() => setZoom(z => Math.min(200, z + 10))}>
                  <Plus size={12} />
                </button>
              </div>
              <button className="ld-icon-btn">
                <Maximize2 size={14} />
              </button>
            </div>
          </header>

          {/* Viewer */}
          <div className="ld-viewer">
            <div
              className="ld-sheet"
              style={{ transform: `scale(${zoom / 100})`, width: `min(860px, ${zoom}%)` }}
            >
              {course.file_path ? (
                <iframe
                  src={`http://localhost:8000/storage/${course.file_path}#toolbar=0`}
                  className="ld-iframe"
                  title={course.title}
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
              <div className="ld-watermark">CodeLink Secure</div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default LanguageDetail;