import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  ChevronLeft, ChevronRight, Minus, Plus, Maximize2,
  Loader2, AlertCircle
} from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from "../../components/layout/SidebarStudent";
import API from "../../services/api";

// ─── Worker PDF.js (obligatoire pour react-pdf) ───────────────────────────────
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

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
    height: 100vh; background: var(--bg); gap: 12px; padding: 24px; text-align: center;
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
    padding: 0 12px; flex-shrink: 0; z-index: 10; gap: 8px;
  }
  @media (min-width: 640px) {
    .ld-toolbar { padding: 0 20px; gap: 12px; }
  }
  @media (min-width: 1024px) {
    .ld-toolbar { padding: 0 24px; gap: 16px; }
  }

  .ld-toolbar-left { display: flex; align-items: center; gap: 8px; min-width: 0; flex: 1; }
  @media (min-width: 640px) { .ld-toolbar-left { gap: 12px; } }
  @media (min-width: 1024px) { .ld-toolbar-left { gap: 16px; } }

  .ld-back-btn {
    width: 32px; height: 32px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
    cursor: pointer; transition: background .2s; color: var(--white);
  }
  .ld-back-btn:hover { background: rgba(255,255,255,.16); }

  .ld-file-name {
    font-family: 'Playfair Display', serif; font-weight: 700; font-size: 13px;
    color: var(--white); letter-spacing: -.01em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 140px;
  }
  @media (min-width: 480px) { .ld-file-name { max-width: 220px; font-size: 14px; } }
  @media (min-width: 768px) { .ld-file-name { max-width: 340px; } }

  .ld-file-meta {
    font-family: 'JetBrains Mono', monospace; font-weight: 400; font-size: 9px;
    letter-spacing: .12em; text-transform: uppercase; color: var(--muted);
    margin-top: 2px; display: none;
  }
  @media (min-width: 480px) { .ld-file-meta { display: block; } }

  /* center — page nav */
  .ld-toolbar-center {
    display: flex;
    align-items: center; gap: 4px; flex-shrink: 0;
  }

  .ld-page-btn {
    width: 26px; height: 26px; border-radius: 8px; border: none;
    background: rgba(255,255,255,.07); color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .2s, color .2s;
  }
  .ld-page-btn:hover:not(:disabled) { background: rgba(255,255,255,.14); color: var(--white); }
  .ld-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .ld-page-label {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500;
    color: var(--white); padding: 0 8px; letter-spacing: .06em; white-space: nowrap;
  }

  /* page input direct */
  .ld-page-input {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
    color: var(--white); background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.15); border-radius: 6px;
    width: 36px; text-align: center; padding: 2px 4px;
    outline: none;
  }
  .ld-page-input:focus { border-color: var(--blue); }

  .ld-toolbar-right { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  @media (min-width: 640px) { .ld-toolbar-right { gap: 10px; } }
  @media (min-width: 1024px) { .ld-toolbar-right { gap: 16px; } }

  /* zoom control */
  .ld-zoom {
    display: flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
    border-radius: 10px; padding: 4px 10px;
  }
  .ld-zoom-btn {
    color: var(--muted); cursor: pointer; transition: color .2s;
    background: none; border: none; display: flex; align-items: center;
  }
  .ld-zoom-btn:hover { color: var(--white); }
  .ld-zoom-val {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
    color: var(--white); min-width: 32px; text-align: center; letter-spacing: .04em;
  }

  @media (max-width: 400px) { .ld-zoom { display: none; } }

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
    flex-shrink: 0; display: none;
  }
  @media (min-width: 640px) { .ld-dot { display: block; } }

  /* ── viewer area ── */
  .ld-viewer {
    flex: 1; overflow-y: auto;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(23,84,190,.06) 0%, transparent 60%),
      repeating-linear-gradient(0deg, transparent, transparent 39px, var(--border) 40px),
      var(--bg);
    padding: 16px 8px;
    display: flex; justify-content: center;
    align-items: flex-start;
  }
  @media (min-width: 640px) { .ld-viewer { padding: 24px 16px; } }
  @media (min-width: 1024px) { .ld-viewer { padding: 40px 24px; } }

  /* ── PDF sheet ── */
  .ld-sheet {
    background: var(--white);
    box-shadow: 0 32px 80px rgba(13,27,62,.14), 0 2px 8px rgba(13,27,62,.08);
    border-radius: 4px;
    width: 100%; max-width: 860px;
    position: relative;
    overflow: hidden;
  }

  .ld-sheet::before {
    content: ''; display: block; height: 4px;
    background: linear-gradient(90deg, var(--blue), var(--orange));
  }

  /* react-pdf canvas responsive */
  .ld-sheet .react-pdf__Document {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .ld-sheet .react-pdf__Page {
    width: 100% !important;
  }
  .ld-sheet .react-pdf__Page canvas {
    width: 100% !important;
    height: auto !important;
    display: block;
  }

  /* ── PDF loading inside sheet ── */
  .ld-pdf-loader {
    display: flex; align-items: center; justify-content: center;
    padding: 80px 24px; flex-direction: column; gap: 16px;
  }
  .ld-pdf-loader p {
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    color: var(--muted); letter-spacing: .08em;
  }

  /* ── PDF error inside sheet ── */
  .ld-pdf-error {
    display: flex; align-items: center; justify-content: center;
    padding: 80px 24px; flex-direction: column; gap: 12px; text-align: center;
  }
  .ld-pdf-error p {
    font-family: 'DM Sans', sans-serif; font-size: 14px;
    color: var(--muted);
  }

  /* ── mobile bottom pagination ── */
  .ld-mobile-nav {
    display: flex; align-items: center; justify-content: center;
    gap: 12px; padding: 12px 16px;
    background: var(--white);
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }
  @media (min-width: 540px) { .ld-mobile-nav { display: none; } }

  .ld-mobile-btn {
    width: 40px; height: 40px; border-radius: 12px; border: 1.5px solid var(--border);
    background: var(--white); color: var(--ink);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: all .2s;
  }
  .ld-mobile-btn:hover:not(:disabled) { background: var(--bg); border-color: var(--blue); color: var(--blue); }
  .ld-mobile-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .ld-mobile-label {
    font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700;
    color: var(--ink); letter-spacing: .06em;
  }

  /* ── fallback content inside sheet ── */
  .ld-fallback { padding: 32px 24px; }
  @media (min-width: 640px) { .ld-fallback { padding: 48px 48px; } }
  @media (min-width: 1024px) { .ld-fallback { padding: 64px 72px; } }

  .ld-module-pill {
    display: inline-flex; align-items: center;
    font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 9px;
    letter-spacing: .16em; text-transform: uppercase;
    padding: 5px 14px; border-radius: 999px;
    background: linear-gradient(135deg, var(--blue), rgba(23,84,190,.7));
    color: var(--white); margin-bottom: 24px;
  }
  @media (min-width: 640px) { .ld-module-pill { margin-bottom: 32px; } }

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
  @media (min-width: 640px) { .ld-fallback-divider { margin-bottom: 36px; } }

  .ld-fallback-desc {
    font-family: 'DM Sans', sans-serif; font-weight: 300; font-size: 15px;
    color: var(--muted); line-height: 1.75; margin-bottom: 32px;
    max-width: 580px;
  }
  @media (min-width: 640px) { .ld-fallback-desc { font-size: 17px; margin-bottom: 40px; } }

  .ld-fallback-placeholder {
    border: 1.5px dashed var(--border); border-radius: 16px;
    padding: 32px 20px; text-align: center;
  }
  @media (min-width: 640px) { .ld-fallback-placeholder { border-radius: 20px; padding: 48px 32px; } }
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
  @media (max-width: 480px) { .ld-watermark { font-size: 40px; } }

  /* spin keyframe */
  @keyframes ld-spin { to { transform: rotate(360deg); } }
  .ld-spin { animation: ld-spin 1s linear infinite; }

  /* hide toolbar center nav on mobile, show mobile bottom nav instead */
  @media (max-width: 539px) {
    .ld-toolbar-center { display: none; }
  }
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

  // ── états PDF ──────────────────────────────────────────────────────────────
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageInputVal, setPageInputVal] = useState('1');
  const [containerWidth, setContainerWidth] = useState(800);
  const [pdfError, setPdfError] = useState(false);

  const viewerRef = useRef(null);

  // ── calcule la largeur réelle du viewer pour adapter le rendu PDF ──────────
  useEffect(() => {
    const updateWidth = () => {
      if (viewerRef.current) {
        const padding = window.innerWidth < 640 ? 32 : 64;
        const w = Math.min(860, viewerRef.current.clientWidth - padding);
        setContainerWidth(w > 100 ? w : 300);
      } else {
        const padding = window.innerWidth < 640 ? 32 : 64;
        setContainerWidth(Math.min(860, window.innerWidth - padding));
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // ── sync input page ────────────────────────────────────────────────────────
  useEffect(() => {
    setPageInputVal(String(pageNumber));
  }, [pageNumber]);

  // ── fetch course ───────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchCourseDetails = async () => {
      try {
        const res = await API.get(`/courses/${courseId}`);
        setCourse(res.data);
      } catch (err) {
        console.error("Erreur de chargement du cours:", err);
      } finally {
        setLoading(false);
      }
    };
    if (courseId) fetchCourseDetails();
  }, [courseId]);

  // ── helpers pagination ─────────────────────────────────────────────────────
  const goToPrev = () => setPageNumber(p => Math.max(1, p - 1));
  const goToNext = () => setPageNumber(p => Math.min(numPages ?? 1, p + 1));

  const handlePageInputChange = (e) => {
    setPageInputVal(e.target.value);
  };

  const handlePageInputBlur = () => {
    const val = parseInt(pageInputVal, 10);
    if (!isNaN(val) && val >= 1 && val <= (numPages ?? 1)) {
      setPageNumber(val);
    } else {
      setPageInputVal(String(pageNumber));
    }
  };

  const handlePageInputKeyDown = (e) => {
    if (e.key === 'Enter') e.target.blur();
  };

  // ── fullscreen ─────────────────────────────────────────────────────────────
  const handleFullscreen = () => {
    const el = viewerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      el.requestFullscreen?.();
    }
  };

  // ── PDF url ────────────────────────────────────────────────────────────────
  const pdfUrl = course?.file_path
    ? `https://codelink-dng0fcepgjhmfma6.francecentral-01.azurewebsites.net/storage/${course.file_path}`
    : null;

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
        className="ld-root pt-14 lg:pt-0"
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

            {/* center — page nav (caché sur mobile < 540px) */}
            <div className="ld-toolbar-center">
              <button
                className="ld-page-btn"
                onClick={goToPrev}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft size={13} />
              </button>

              <input
                className="ld-page-input"
                type="number"
                min={1}
                max={numPages ?? 1}
                value={pageInputVal}
                onChange={handlePageInputChange}
                onBlur={handlePageInputBlur}
                onKeyDown={handlePageInputKeyDown}
              />
              <span className="ld-page-label">/ {numPages ?? '—'}</span>

              <button
                className="ld-page-btn"
                onClick={goToNext}
                disabled={!numPages || pageNumber >= numPages}
              >
                <ChevronRight size={13} />
              </button>
            </div>

            {/* right — zoom + fullscreen */}
            <div className="ld-toolbar-right">
              <div className="ld-zoom">
                <button
                  className="ld-zoom-btn"
                  onClick={() => setZoom(z => Math.max(50, z - 10))}
                >
                  <Minus size={13} />
                </button>
                <span className="ld-zoom-val">{zoom}%</span>
                <button
                  className="ld-zoom-btn"
                  onClick={() => setZoom(z => Math.min(200, z + 10))}
                >
                  <Plus size={13} />
                </button>
              </div>
              <button className="ld-icon-btn" onClick={handleFullscreen}>
                <Maximize2 size={15} />
              </button>
            </div>

          </header>

          {/* ── VIEWER ── */}
          <div className="ld-viewer" ref={viewerRef}>
            <div className="ld-sheet">

              {pdfUrl ? (
                pdfError ? (
                  /* ── erreur chargement PDF ── */
                  <div className="ld-pdf-error">
                    <AlertCircle size={36} style={{ color: "var(--muted)" }} />
                    <p>Impossible de charger le PDF.</p>
                    <p style={{ fontSize: 12 }}>Vérifiez votre connexion ou contactez l'administrateur.</p>
                  </div>
                ) : (
                  /* ── react-pdf ── */
                  <Document
                    file={pdfUrl}
                    onLoadSuccess={({ numPages }) => {
                      setNumPages(numPages);
                      setPageNumber(1);
                      setPdfError(false);
                    }}
                    onLoadError={(err) => {
                      console.error("PDF load error:", err);
                      setPdfError(true);
                    }}
                    loading={
                      <div className="ld-pdf-loader">
                        <Loader2 size={36} style={{ color: "var(--blue)" }} className="ld-spin" />
                        <p>Chargement du document…</p>
                      </div>
                    }
                  >
                    <Page
                      pageNumber={pageNumber}
                      width={containerWidth * (zoom / 100)}
                      renderTextLayer={false}
                      renderAnnotationLayer={false}
                      loading={
                        <div className="ld-pdf-loader">
                          <Loader2 size={28} style={{ color: "var(--blue)" }} className="ld-spin" />
                        </div>
                      }
                    />
                  </Document>
                )
              ) : (
                /* ── fallback si pas de fichier ── */
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

              <div className="ld-watermark">CodeLink Secure</div>
            </div>
          </div>

          {/* ── PAGINATION MOBILE (visible seulement < 540px) ── */}
          {numPages && numPages > 1 && (
            <div className="ld-mobile-nav">
              <button
                className="ld-mobile-btn"
                onClick={goToPrev}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft size={18} />
              </button>
              <span className="ld-mobile-label">
                {pageNumber} / {numPages}
              </span>
              <button
                className="ld-mobile-btn"
                onClick={goToNext}
                disabled={pageNumber >= numPages}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}

        </main>
      </div>
    </>
  );
};

export default LanguageDetail;