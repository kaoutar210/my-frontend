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

  /* ── full-screen loader ── */
  .ld-fullloader {
    display: flex; align-items: center; justify-content: center;
    height: 100vh; background: var(--bg);
  }

  /* ── error screen ── */
  .ld-error {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    height: 100vh; background: var(--bg); gap: 12px;
  }
  .ld-error svg { color: var(--muted); }
  .ld-error p { font-weight: 500; color: var(--muted); font-size: 15px; }
  .ld-error button {
    margin-top: 8px; font-family: 'DM Sans', sans-serif; font-weight: 600;
    font-size: 13px; color: var(--blue); cursor: pointer; border: none; background: none;
    text-decoration: underline; text-underline-offset: 3px;
  }

  /* ── toolbar ── */
  .ld-toolbar {
    height: 56px; background: var(--ink); border-bottom: 2px solid var(--blue);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; flex-shrink: 0; z-index: 10;
  }

  .ld-toolbar-left { display: flex; align-items: center; gap: 16px; }

  .ld-back-btn {
    width: 34px; height: 34px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
    cursor: pointer; transition: background .2s; color: var(--white);
  }
  .ld-back-btn:hover { background: rgba(255,255,255,.16); }

  .ld-file-name {
    font-family: 'Playfair Display', serif; font-weight: 700; font-size: 14px;
    color: var(--white); letter-spacing: -.01em; max-width: 380px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .ld-file-meta {
    font-family: 'JetBrains Mono', monospace; font-weight: 400; font-size: 9px;
    letter-spacing: .12em; text-transform: uppercase; color: var(--muted);
    margin-top: 2px;
  }

  .ld-toolbar-center { display: flex; align-items: center; gap: 4px; }
  .ld-page-btn {
    width: 28px; height: 28px; border-radius: 8px; border: none;
    background: rgba(255,255,255,.07); color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .2s, color .2s;
  }
  .ld-page-btn:hover { background: rgba(255,255,255,.14); color: var(--white); }
  .ld-page-label {
    font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500;
    color: var(--white); padding: 0 12px; letter-spacing: .06em;
  }

  .ld-toolbar-right { display: flex; align-items: center; gap: 16px; }

  /* zoom control */
  .ld-zoom {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
    border-radius: 10px; padding: 5px 12px;
  }
  .ld-zoom-btn {
    color: var(--muted); cursor: pointer; transition: color .2s;
    background: none; border: none; display: flex; align-items: center;
  }
  .ld-zoom-btn:hover { color: var(--white); }
  .ld-zoom-val {
    font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700;
    color: var(--white); min-width: 36px; text-align: center; letter-spacing: .04em;
  }
  .ld-icon-btn {
    width: 32px; height: 32px; border-radius: 10px; border: none;
    background: rgba(255,255,255,.07); color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .2s, color .2s;
  }
  .ld-icon-btn:hover { background: rgba(255,255,255,.14); color: var(--white); }

  /* accent dot on toolbar */
  .ld-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: linear-gradient(135deg, var(--blue), var(--orange));
    flex-shrink: 0;
  }

  /* ── viewer area ── */
  .ld-viewer {
    flex: 1; overflow-y: auto;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(23,84,190,.06) 0%, transparent 60%),
      repeating-linear-gradient(0deg, transparent, transparent 39px, var(--border) 40px),
      var(--bg);
    padding: 40px 24px;
    display: flex; justify-content: center;
    align-items: flex-start;
  }

  /* ── PDF sheet ── */
  .ld-sheet {
    background: var(--white);
    box-shadow: 0 32px 80px rgba(13,27,62,.14), 0 2px 8px rgba(13,27,62,.08);
    border-radius: 4px;
    width: 100%; max-width: 860px;
    min-height: 1100px;
    position: relative;
    transition: transform .3s, width .3s;
    transform-origin: top center;
    overflow: hidden;
  }

  /* top stripe */
  .ld-sheet::before {
    content: ''; display: block; height: 4px;
    background: linear-gradient(90deg, var(--blue), var(--orange));
  }

  /* ── fallback content inside sheet ── */
  .ld-fallback { padding: 64px 72px; }

  .ld-module-pill {
    display: inline-flex; align-items: center;
    font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 9px;
    letter-spacing: .16em; text-transform: uppercase;
    padding: 5px 14px; border-radius: 999px;
    background: linear-gradient(135deg, var(--blue), rgba(23,84,190,.7));
    color: var(--white); margin-bottom: 32px;
  }

  .ld-fallback-title {
    font-family: 'Playfair Display', serif; font-weight: 800;
    font-size: clamp(2rem, 4vw, 3rem); color: var(--ink);
    line-height: 1.1; letter-spacing: -.02em; margin-bottom: 24px;
  }

  .ld-fallback-divider {
    height: 3px; width: 56px; border-radius: 3px; border: none;
    background: linear-gradient(90deg, var(--orange), rgba(229,82,45,.3));
    margin-bottom: 36px;
  }

  .ld-fallback-desc {
    font-family: 'DM Sans', sans-serif; font-weight: 300; font-size: 17px;
    color: var(--muted); line-height: 1.75; margin-bottom: 40px;
    max-width: 580px;
  }

  .ld-fallback-placeholder {
    border: 1.5px dashed var(--border); border-radius: 20px;
    padding: 48px 32px; text-align: center;
  }
  .ld-fallback-placeholder p {
    font-family: 'DM Sans', sans-serif; font-weight: 400; font-size: 14px;
    color: var(--muted); font-style: italic;
  }

  /* ── watermark ── */
  .ld-watermark {
    position: absolute; top: 50%; right: -60px;
    transform: translateY(-50%) rotate(45deg);
    pointer-events: none; user-select: none; opacity: .035;
    font-family: 'Playfair Display', serif; font-weight: 800; font-size: 72px;
    color: var(--ink); white-space: nowrap;
  }

  /* spin keyframe */
  @keyframes ld-spin { to { transform: rotate(360deg); } }
  .ld-spin { animation: ld-spin 1s linear infinite; }
`;

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
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

  return (
    <>
      <style>{style}</style>

      <div
        className="ld-root"
        style={{ display: "flex", height: "100vh", overflow: "hidden" }}
      >
        <Sidebar
          brandName="CodeLink"
          onLogout={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        />

        <main style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>

          {/* ── TOOLBAR ── */}
          <header className="ld-toolbar">

            {/* left */}
            <div className="ld-toolbar-left">
              <div className="ld-dot" />
              <button className="ld-back-btn" onClick={() => navigate(-1)}>
                <ChevronLeft size={18} />
              </button>
              <div>
                <div className="ld-file-name">
                  {course.title}<span style={{ color: "var(--orange)" }}>.pdf</span>
                </div>
                <div className="ld-file-meta">
                  {course.category || languageId} &mdash; Contenu Sécurisé
                </div>
              </div>
            </div>

            {/* center — page nav */}
            <div className="ld-toolbar-center">
              <button className="ld-page-btn"><ChevronLeft size={14} /></button>
              <span className="ld-page-label">Page 1 / 1</span>
              <button className="ld-page-btn"><ChevronRight size={14} /></button>
            </div>

            {/* right — zoom + fullscreen */}
            <div className="ld-toolbar-right">
              <div className="ld-zoom">
                <button
                  className="ld-zoom-btn"
                  onClick={() => setZoom(z => Math.max(50, z - 10))}
                >
                  <Minus size={14} />
                </button>
                <span className="ld-zoom-val">{zoom}%</span>
                <button
                  className="ld-zoom-btn"
                  onClick={() => setZoom(z => Math.min(200, z + 10))}
                >
                  <Plus size={14} />
                </button>
              </div>
              <button className="ld-icon-btn">
                <Maximize2 size={16} />
              </button>
            </div>

          </header>

          {/* ── VIEWER ── */}
          <div className="ld-viewer">
            <div
              className="ld-sheet"
              style={{
                transform: `scale(${zoom / 100})`,
                width: `min(860px, ${zoom}%)`,
              }}
            >
              {course.file_path ? (
                <iframe
                  src={`http://localhost:8000/storage/${course.file_path}#toolbar=0`}
                  style={{ width: "100%", height: "100%", minHeight: 1100, display: "block", border: "none" }}
                  title={course.title}
                />
              ) : (
                <div className="ld-fallback">
                  <span className="ld-module-pill">
                    Module {course.module_number || "01"}
                  </span>

                  <h2 className="ld-fallback-title">{course.title}</h2>

                  <hr className="ld-fallback-divider" />

                  <p className="ld-fallback-desc">{course.description}</p>

                  <div className="ld-fallback-placeholder">
                    <p>Le contenu détaillé de ce module est en cours de génération…</p>
                  </div>
                </div>
              )}

              {/* watermark */}
              <div className="ld-watermark">CodeLink Secure</div>
            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default LanguageDetail;