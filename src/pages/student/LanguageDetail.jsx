import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Minus, Plus, Maximize2,
  Minimize2, Loader2, AlertCircle
} from 'lucide-react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Sidebar from "../../components/layout/SidebarStudent";
import API from "../../services/api";

/* ─────────────────────────────────────────────
   SCOPED STYLES  —  mobile-first, dvh-aware
───────────────────────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');

  /* ── tokens ── */
  :root {
    --blue:    #1754be;
    --orange:  #e5522d;
    --white:   #ffffff;
    --ink:     #0d1b3e;
    --muted:   #8896b3;
    --border:  #eef0f5;
    --bg:      #f7f9fc;
    --toolbar: 52px;        /* toolbar height */
    --radius:  12px;
  }
  @media (min-width: 640px) { :root { --toolbar: 56px; } }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  /* ── root shell ── */
  /*
   * 100dvh = dynamic viewport height → correct on mobile browsers
   * that show/hide their chrome. Falls back gracefully to 100vh.
   */
  .ld-root {
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    display: flex;
    /* mobile: sidebar is a top bar (h=56px = 3.5rem) */
    height: calc(100dvh - 3.5rem);
    /* fallback for browsers without dvh */
    height: calc(100vh  - 3.5rem);
    overflow: hidden;
  }
  /* desktop: sidebar is a left column, no top-bar offset */
  @media (min-width: 1024px) {
    .ld-root {
      height: 100dvh;
      height: 100vh;
    }
  }

  /* ── main column ── */
  .ld-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    min-width: 0;           /* prevent flex blowout */
  }

  /* ─────────────────── FULL-SCREEN LOADER ─────────────────── */
  .ld-fullloader {
    display: flex; align-items: center; justify-content: center;
    height: 100dvh; height: 100vh;
    background: var(--bg);
  }

  /* ─────────────────── ERROR SCREEN ─────────────────── */
  .ld-error {
    display: flex; flex-direction: column;
    align-items: center; justify-content: center;
    height: 100dvh; height: 100vh;
    background: var(--bg); gap: 12px;
    padding: 24px; text-align: center;
  }
  .ld-error svg { color: var(--muted); }
  .ld-error p {
    font-weight: 500; color: var(--muted); font-size: 15px;
  }
  .ld-error button {
    margin-top: 8px; font-family: 'DM Sans', sans-serif;
    font-weight: 600; font-size: 13px; color: var(--blue);
    cursor: pointer; border: none; background: none;
    text-decoration: underline; text-underline-offset: 3px;
  }

  /* ─────────────────── TOOLBAR ─────────────────── */
  .ld-toolbar {
    height: var(--toolbar);
    background: var(--ink);
    border-bottom: 2px solid var(--blue);
    display: flex; align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    flex-shrink: 0;
    gap: 6px;
    /* keeps toolbar above iframe on iOS */
    position: relative; z-index: 10;
  }
  @media (min-width: 640px)  { .ld-toolbar { padding: 0 18px; gap: 10px; } }
  @media (min-width: 1024px) { .ld-toolbar { padding: 0 24px; gap: 16px; } }

  /* left group */
  .ld-toolbar-left {
    display: flex; align-items: center;
    gap: 8px; min-width: 0; flex: 1;
  }

  .ld-back-btn {
    width: 30px; height: 30px; border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.12);
    cursor: pointer; transition: background .2s; color: var(--white);
    /* large tap target on touch */
    -webkit-tap-highlight-color: transparent;
  }
  .ld-back-btn:hover  { background: rgba(255,255,255,.16); }
  .ld-back-btn:active { background: rgba(255,255,255,.22); }

  .ld-title-block { min-width: 0; }
  .ld-file-name {
    font-family: 'Playfair Display', serif; font-weight: 700;
    font-size: 13px; color: var(--white); letter-spacing: -.01em;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 130px;
  }
  @media (min-width: 400px) { .ld-file-name { max-width: 180px; } }
  @media (min-width: 480px) { .ld-file-name { max-width: 240px; font-size: 14px; } }
  @media (min-width: 768px) { .ld-file-name { max-width: 360px; } }

  .ld-file-meta {
    font-family: 'JetBrains Mono', monospace; font-size: 9px;
    letter-spacing: .12em; text-transform: uppercase; color: var(--muted);
    margin-top: 2px;
  }
  @media (max-width: 479px) { .ld-file-meta { display: none; } }

  /* center — page nav */
  .ld-toolbar-center {
    display: none; align-items: center; gap: 4px; flex-shrink: 0;
  }
  @media (min-width: 520px) { .ld-toolbar-center { display: flex; } }

  .ld-page-btn {
    width: 26px; height: 26px; border-radius: 8px; border: none;
    background: rgba(255,255,255,.07); color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .2s, color .2s;
    -webkit-tap-highlight-color: transparent;
  }
  .ld-page-btn:disabled { opacity: .35; cursor: not-allowed; }
  .ld-page-btn:not(:disabled):hover { background: rgba(255,255,255,.14); color: var(--white); }

  .ld-page-label {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 500;
    color: var(--white); padding: 0 8px; letter-spacing: .06em; white-space: nowrap;
  }

  /* right group */
  .ld-toolbar-right {
    display: flex; align-items: center; gap: 6px; flex-shrink: 0;
  }

  /* zoom control */
  .ld-zoom {
    display: flex; align-items: center; gap: 4px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 9px; padding: 3px 8px;
  }
  @media (max-width: 380px) { .ld-zoom { display: none; } }

  .ld-zoom-btn {
    color: var(--muted); cursor: pointer; transition: color .2s;
    background: none; border: none;
    display: flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 6px;
    -webkit-tap-highlight-color: transparent;
  }
  .ld-zoom-btn:hover  { color: var(--white); }
  .ld-zoom-btn:active { background: rgba(255,255,255,.1); }

  .ld-zoom-val {
    font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700;
    color: var(--white); min-width: 34px; text-align: center; letter-spacing: .04em;
  }

  .ld-icon-btn {
    width: 30px; height: 30px; border-radius: 9px; border: none;
    background: rgba(255,255,255,.07); color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .2s, color .2s;
    -webkit-tap-highlight-color: transparent;
  }
  .ld-icon-btn:hover { background: rgba(255,255,255,.14); color: var(--white); }
  @media (max-width: 480px) { .ld-icon-btn { display: none; } }

  .ld-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: linear-gradient(135deg, var(--blue), var(--orange));
    flex-shrink: 0;
  }
  @media (max-width: 639px) { .ld-dot { display: none; } }

  /* ─────────────────── VIEWER AREA ─────────────────── */
  /*
   * flex: 1 makes it fill the remaining height after the toolbar.
   * overflow-y: auto with -webkit-overflow-scrolling ensures smooth
   * momentum scrolling on iOS Safari.
   */
  .ld-viewer {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;   /* iOS momentum scroll */
    scroll-behavior: smooth;
    overscroll-behavior: contain;        /* prevent page bounce bleed */
    background:
      radial-gradient(ellipse at 20% 50%, rgba(23,84,190,.055) 0%, transparent 60%),
      repeating-linear-gradient(0deg, transparent, transparent 39px, var(--border) 40px),
      var(--bg);
    /* padding: enough room so shadow isn't clipped */
    padding: 16px 8px 32px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  @media (min-width: 640px)  { .ld-viewer { padding: 24px 16px 40px; } }
  @media (min-width: 1024px) { .ld-viewer { padding: 36px 24px 48px; } }

  /* ─────────────────── PDF SHEET ─────────────────── */
  /*
   * We let the sheet be "width: 100%" constrained by a max-width,
   * then apply the zoom scale via transform. transform-origin: top center
   * keeps it anchored at the top so zooming out doesn't create dead space.
   *
   * min-height is expressed in viewport units so it's always tall enough
   * to hold a full A4 page, even before content loads.
   */
  .ld-sheet-wrapper {
    width: 100%;
    max-width: 860px;
    /* shift downward proportionally so the transform doesn't clip */
    transform-origin: top center;
    transition: transform .25s ease;
  }

  .ld-sheet {
    width: 100%;
    background: var(--white);
    box-shadow:
      0 2px 8px  rgba(13,27,62,.07),
      0 16px 48px rgba(13,27,62,.12),
      0 40px 80px rgba(13,27,62,.08);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    /* min-height: enough for a letter/A4 ratio at full width */
    min-height: clamp(480px, 130vw, 1100px);
  }
  @media (min-width: 640px) {
    .ld-sheet { min-height: clamp(600px, 120vw, 1100px); }
  }
  @media (min-width: 1024px) {
    .ld-sheet { min-height: 1060px; }
  }

  /* accent strip */
  .ld-sheet::before {
    content: ''; display: block; height: 4px;
    background: linear-gradient(90deg, var(--blue), var(--orange));
  }

  /* ─────────────────── IFRAME ─────────────────── */
  /*
   * The iframe must fill the sheet completely.
   * height: 100% alone doesn't work when the parent uses min-height;
   * position: absolute + inset: 0 is reliable cross-browser.
   * top: 4px accounts for the accent strip.
   */
  .ld-iframe-wrap {
    position: absolute;
    inset: 4px 0 0 0;   /* below the accent strip */
    bottom: 0;
  }
  .ld-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
    /* prevent double-scrollbars inside iframe on Firefox */
    overflow: hidden;
  }

  /* ─────────────────── FALLBACK CONTENT ─────────────────── */
  .ld-fallback {
    padding: 32px 20px 48px;
    position: relative; z-index: 1;
  }
  @media (min-width: 640px)  { .ld-fallback { padding: 48px 48px 64px; } }
  @media (min-width: 1024px) { .ld-fallback { padding: 64px 72px 80px; } }

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
    font-size: clamp(1.5rem, 5vw, 2.8rem);
    color: var(--ink); line-height: 1.1;
    letter-spacing: -.02em; margin-bottom: 20px;
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
    max-width: 560px;
  }
  @media (min-width: 640px) { .ld-fallback-desc { font-size: 17px; margin-bottom: 40px; } }

  .ld-fallback-placeholder {
    border: 1.5px dashed var(--border); border-radius: 16px;
    padding: 28px 16px; text-align: center;
  }
  @media (min-width: 640px) { .ld-fallback-placeholder { border-radius: 20px; padding: 48px 32px; } }
  .ld-fallback-placeholder p {
    font-size: 14px; color: var(--muted); font-style: italic;
  }

  /* ─────────────────── WATERMARK ─────────────────── */
  .ld-watermark {
    position: absolute; bottom: 16px; right: 16px;
    pointer-events: none; user-select: none; opacity: .04;
    font-family: 'Playfair Display', serif; font-weight: 800;
    font-size: clamp(28px, 6vw, 60px);
    color: var(--ink); white-space: nowrap;
    transform: rotate(-15deg);
    transform-origin: bottom right;
  }

  /* ─────────────────── SPINNER ─────────────────── */
  @keyframes ld-spin { to { transform: rotate(360deg); } }
  .ld-spin { animation: ld-spin 1s linear infinite; }

  /* ─────────────────── FULLSCREEN OVERLAY ─────────────────── */
  .ld-fullscreen-root {
    position: fixed; inset: 0; z-index: 9999;
    background: var(--bg);
    display: flex; flex-direction: column;
  }
  .ld-fullscreen-root .ld-viewer {
    /* in fullscreen the viewer is the only element; give it all height */
    flex: 1;
  }
`;

/* ─────────────────────────────────────────────
   PAGE COMPONENT
───────────────────────────────────────────── */
const LanguageDetail = () => {
  const { languageId } = useParams();
  const location      = useLocation();
  const navigate      = useNavigate();
  const courseId      = location.state?.courseId;

  const [course,     setCourse]     = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [zoom,       setZoom]       = useState(100);
  const [fullscreen, setFullscreen] = useState(false);

  /* ── fetch ── */
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

  /* ── zoom helpers ── */
  const zoomOut = useCallback(() => setZoom(z => Math.max(50,  z - 10)), []);
  const zoomIn  = useCallback(() => setZoom(z => Math.min(200, z + 10)), []);

  /* ── fullscreen via Fullscreen API (desktop) ── */
  const viewerRef = useRef(null);
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && viewerRef.current) {
      viewerRef.current.requestFullscreen?.().catch(() => setFullscreen(fs => !fs));
    } else {
      document.exitFullscreen?.().catch(() => setFullscreen(fs => !fs));
    }
    setFullscreen(fs => !fs);
  }, []);

  /* ── PDF src ── */
  const pdfSrc = course?.file_path
    ? `https://codelink-dng0fcepgjhmfma6.francecentral-01.azurewebsites.net/storage/${course.file_path}#toolbar=0&navpanes=0&scrollbar=0`
    : null;

  /* ─── STATES ─── */
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

  /* ─── TOOLBAR (shared between normal and fullscreen) ─── */
  const Toolbar = () => (
    <header className="ld-toolbar">
      {/* left */}
      <div className="ld-toolbar-left">
        <div className="ld-dot" />
        <button
          className="ld-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Retour"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="ld-title-block">
          <div className="ld-file-name">
            {course.title}
            <span style={{ color: "var(--orange)" }}>.pdf</span>
          </div>
          <div className="ld-file-meta">
            {course.category || languageId} &mdash; Contenu Sécurisé
          </div>
        </div>
      </div>

      {/* center — page nav */}
      <div className="ld-toolbar-center">
        <button className="ld-page-btn" disabled aria-label="Page précédente">
          <ChevronLeft size={13} />
        </button>
        <span className="ld-page-label">Page 1 / 1</span>
        <button className="ld-page-btn" disabled aria-label="Page suivante">
          <ChevronRight size={13} />
        </button>
      </div>

      {/* right — zoom + fullscreen */}
      <div className="ld-toolbar-right">
        <div className="ld-zoom" role="group" aria-label="Zoom">
          <button className="ld-zoom-btn" onClick={zoomOut} aria-label="Réduire">
            <Minus size={13} />
          </button>
          <span className="ld-zoom-val">{zoom}%</span>
          <button className="ld-zoom-btn" onClick={zoomIn}  aria-label="Agrandir">
            <Plus size={13} />
          </button>
        </div>
        <button
          className="ld-icon-btn"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? "Quitter le plein écran" : "Plein écran"}
        >
          {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>
    </header>
  );

  /* ─── VIEWER CONTENT ─── */
  const ViewerContent = () => (
    <div className="ld-viewer" ref={viewerRef}>
      {/*
        The wrapper applies the zoom transform.
        margin adjustments compensate so zoomed-out content
        stays visually centred instead of drifting left.
      */}
      <div
        className="ld-sheet-wrapper"
        style={{
          transform: `scale(${zoom / 100})`,
          // When scaled down, the wrapper still occupies original space.
          // Negative margin pulls surrounding space in so scrolling stays tight.
          marginBottom: zoom < 100
            ? `calc((${zoom / 100} - 1) * var(--sheet-h, 800px))`
            : 0,
        }}
      >
        <div className="ld-sheet">
          {pdfSrc ? (
            <div className="ld-iframe-wrap">
              <iframe
                className="ld-iframe"
                src={pdfSrc}
                title={course.title}
                loading="lazy"
                allow="fullscreen"
              />
            </div>
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

          <div className="ld-watermark" aria-hidden="true">CodeLink Secure</div>
        </div>
      </div>
    </div>
  );

  /* ─── FULL RENDER ─── */
  return (
    <>
      <style>{style}</style>

      {fullscreen ? (
        /* ── Fullscreen overlay (CSS fallback when Fullscreen API is unavailable) ── */
        <div className="ld-fullscreen-root">
          <Toolbar />
          <ViewerContent />
        </div>
      ) : (
        /*
         * Normal layout
         * .pt-14 (= 3.5rem) on mobile offsets the fixed top Sidebar bar.
         * On lg+ the sidebar is a side column so we remove the offset.
         */
        <div className="ld-root pt-14 lg:pt-0">
          <Sidebar
            brandName="CodeLink"
            onLogout={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          />
          <main className="ld-main">
            <Toolbar />
            <ViewerContent />
          </main>
        </div>
      )}
    </>
  );
};

export default LanguageDetail;