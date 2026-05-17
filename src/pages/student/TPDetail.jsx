import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  ChevronLeft, ChevronRight, Minus, Plus,
  Maximize2, Minimize2, Loader2, AlertCircle
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from "../../components/layout/SidebarStudent";
import { tpService } from "../../services/api";

/* ─────────────────────────────────────────────
   SCOPED STYLES — mobile-first, dvh-aware
───────────────────────────────────────────── */
const style = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');

  /* ── design tokens ── */
  :root {
    --blue:    #1754be;
    --orange:  #e5522d;
    --white:   #ffffff;
    --ink:     #0d1b3e;
    --muted:   #8896b3;
    --border:  #eef0f5;
    --bg:      #f7f9fc;
    --toolbar: 52px;
  }
  @media (min-width: 600px) { :root { --toolbar: 56px; } }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  @keyframes td-spin { to { transform: rotate(360deg); } }
  .td-spin { animation: td-spin 1s linear infinite; }

  /* ── root shell ──
   *  On mobile the Sidebar renders as a fixed top bar (height = 3.5rem / 56px).
   *  100dvh - 3.5rem = the space below that bar, no browser-chrome overflow.
   *  On lg+ the sidebar is a left column → full dvh.
   */
  .td-shell {
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
    display: flex;
    height: calc(100dvh - 3.5rem);
    height: calc(100vh  - 3.5rem);   /* dvh fallback */
    overflow: hidden;
  }
  @media (min-width: 1024px) {
    .td-shell {
      height: 100dvh;
      height: 100vh;
    }
  }

  /* ── full-viewport states (loader / error) ── */
  .td-center {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100dvh;
    height: 100vh;
    background: var(--bg);
  }
  .td-error {
    flex-direction: column;
    gap: 12px;
    text-align: center;
    padding: 24px;
  }
  .td-error svg { color: var(--muted); }
  .td-error p  { font-weight: 500; color: var(--muted); font-size: 15px; }
  .td-error button {
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px;
    color: var(--blue); background: none; border: none; cursor: pointer;
    text-decoration: underline; text-underline-offset: 3px; margin-top: 4px;
  }

  /* ── main column ── */
  .td-main {
    flex: 1;
    min-width: 0;           /* prevent flex blowout */
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* ════════════════════════════════════════
     TOOLBAR
  ════════════════════════════════════════ */
  .td-toolbar {
    height: var(--toolbar);
    background: var(--ink);
    border-bottom: 2px solid var(--orange);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 10px;
    flex-shrink: 0;
    position: relative; z-index: 10;   /* stay above iframe */
    gap: 6px;
  }
  @media (min-width: 600px)  { .td-toolbar { padding: 0 18px; gap: 10px; } }
  @media (min-width: 1024px) { .td-toolbar { padding: 0 24px; gap: 16px; } }

  /* left group */
  .td-toolbar-left {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 0;
    flex: 1;
  }

  .td-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--orange);
    flex-shrink: 0;
  }
  @media (max-width: 599px) { .td-dot { display: none; } }

  .td-back-btn {
    width: 30px; height: 30px;
    border-radius: 9px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.12);
    cursor: pointer; color: var(--white);
    transition: background .2s;
    -webkit-tap-highlight-color: transparent;
  }
  .td-back-btn:hover  { background: rgba(255,255,255,.16); }
  .td-back-btn:active { background: rgba(255,255,255,.22); }

  .td-file-info { min-width: 0; flex: 1; }

  .td-file-name {
    font-family: 'Playfair Display', serif;
    font-weight: 700; font-size: 13px;
    color: var(--white);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    max-width: 130px;
  }
  @media (min-width: 400px) { .td-file-name { max-width: 180px; } }
  @media (min-width: 480px) { .td-file-name { max-width: 240px; font-size: 14px; } }
  @media (min-width: 768px) { .td-file-name { max-width: 360px; } }
  .td-file-name em { font-style: normal; color: var(--orange); }

  .td-file-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; letter-spacing: .12em;
    text-transform: uppercase; color: var(--muted); margin-top: 2px;
  }
  @media (max-width: 479px) { .td-file-meta { display: none; } }

  .td-diff-pill {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700; font-size: 9px;
    letter-spacing: .12em; text-transform: uppercase;
    padding: 4px 10px; border-radius: 999px;
    background: rgba(229,82,45,.18); color: var(--orange);
    border: 1px solid rgba(229,82,45,.3);
    white-space: nowrap; flex-shrink: 0;
  }
  @media (max-width: 599px) { .td-diff-pill { display: none; } }

  /* center page nav */
  .td-toolbar-center {
    display: none;
    align-items: center; gap: 4px; flex-shrink: 0;
  }
  @media (min-width: 520px) { .td-toolbar-center { display: flex; } }

  .td-page-btn {
    width: 26px; height: 26px;
    border-radius: 8px; border: none;
    background: rgba(255,255,255,.07); color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .2s, color .2s;
    -webkit-tap-highlight-color: transparent;
  }
  .td-page-btn:disabled { opacity: .35; cursor: not-allowed; }
  .td-page-btn:not(:disabled):hover { background: rgba(255,255,255,.14); color: var(--white); }
  .td-page-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 500; color: var(--white);
    padding: 0 8px; letter-spacing: .06em; white-space: nowrap;
  }

  /* right controls */
  .td-toolbar-right {
    display: flex; align-items: center; gap: 6px; flex-shrink: 0;
  }

  .td-zoom {
    display: flex; align-items: center; gap: 4px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 9px; padding: 3px 8px;
  }
  @media (max-width: 360px) { .td-zoom { display: none; } }

  .td-zoom-btn {
    color: var(--muted); cursor: pointer; transition: color .2s;
    background: none; border: none;
    display: flex; align-items: center; justify-content: center;
    width: 22px; height: 22px; border-radius: 6px;
    -webkit-tap-highlight-color: transparent;
  }
  .td-zoom-btn:hover  { color: var(--white); }
  .td-zoom-btn:active { background: rgba(255,255,255,.1); }
  .td-zoom-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 700; color: var(--white);
    min-width: 34px; text-align: center; letter-spacing: .04em;
  }

  .td-icon-btn {
    width: 30px; height: 30px;
    border-radius: 9px; border: none;
    background: rgba(255,255,255,.07); color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .2s, color .2s;
    -webkit-tap-highlight-color: transparent;
  }
  .td-icon-btn:hover { background: rgba(255,255,255,.14); color: var(--white); }
  @media (max-width: 480px) { .td-icon-btn { display: none; } }

  /* ════════════════════════════════════════
     VIEWER
  ════════════════════════════════════════ */
  /*
   * flex: 1 → takes all height left after toolbar.
   * -webkit-overflow-scrolling: touch → iOS momentum scroll.
   * overscroll-behavior: contain → no page bounce bleed.
   */
  .td-viewer {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
    overscroll-behavior: contain;
    background:
      radial-gradient(ellipse at 80% 20%, rgba(229,82,45,.05) 0%, transparent 55%),
      repeating-linear-gradient(0deg, transparent, transparent 39px, var(--border) 40px),
      var(--bg);
    padding: 16px 8px 32px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
  }
  @media (min-width: 600px)  { .td-viewer { padding: 24px 16px 40px; } }
  @media (min-width: 1024px) { .td-viewer { padding: 36px 24px 48px; } }

  /* ── sheet wrapper — receives the zoom transform ── */
  .td-sheet-wrapper {
    width: 100%;
    max-width: 860px;
    transform-origin: top center;
    transition: transform .25s ease;
  }

  /* ── white paper sheet ── */
  .td-sheet {
    width: 100%;
    background: var(--white);
    box-shadow:
      0 2px 8px  rgba(13,27,62,.07),
      0 16px 48px rgba(13,27,62,.12),
      0 40px 80px rgba(13,27,62,.07);
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    /*
     * clamp-based min-height approximates A4 aspect ratio
     * at any screen width, avoiding a collapsed sheet before the
     * iframe loads.
     */
    min-height: clamp(480px, 130vw, 1100px);
  }
  @media (min-width: 600px)  { .td-sheet { min-height: clamp(600px, 120vw, 1100px); } }
  @media (min-width: 1024px) { .td-sheet { min-height: 1060px; } }

  /* accent strip */
  .td-sheet::before {
    content: ''; display: block; height: 4px;
    background: linear-gradient(90deg, var(--orange), var(--blue));
  }

  /* ── iframe fills the sheet via absolute positioning ──
   *  top: 4px clears the accent strip.
   *  This is the only reliable cross-browser way to make an iframe
   *  fill a container that uses min-height instead of a fixed height.
   */
  .td-iframe-wrap {
    position: absolute;
    inset: 4px 0 0 0;
  }
  .td-iframe {
    width: 100%;
    height: 100%;
    border: none;
    display: block;
  }

  /* ── fallback content (no file_path) ── */
  .td-fallback { padding: 32px 20px 48px; position: relative; z-index: 1; }
  @media (min-width: 600px)  { .td-fallback { padding: 48px 40px 64px; } }
  @media (min-width: 1024px) { .td-fallback { padding: 64px 72px 80px; } }

  .td-challenge-pill {
    display: inline-flex; align-items: center;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700; font-size: 9px;
    letter-spacing: .16em; text-transform: uppercase;
    padding: 5px 14px; border-radius: 999px;
    background: linear-gradient(135deg, var(--orange), rgba(229,82,45,.7));
    color: var(--white); margin-bottom: 24px;
  }
  @media (min-width: 600px) { .td-challenge-pill { margin-bottom: 32px; } }

  .td-fallback-title {
    font-family: 'Playfair Display', serif; font-weight: 800;
    font-size: clamp(1.5rem, 4vw, 2.8rem);
    color: var(--ink); line-height: 1.15;
    letter-spacing: -.02em; margin-bottom: 6px;
  }
  .td-fallback-subtitle {
    font-size: 13px; color: var(--muted); margin-bottom: 24px;
    letter-spacing: .01em;
  }
  .td-fallback-divider {
    height: 3px; width: 56px; border-radius: 3px; border: none;
    background: linear-gradient(90deg, var(--orange), rgba(229,82,45,.25));
    margin-bottom: 28px;
  }
  @media (min-width: 600px) { .td-fallback-divider { margin-bottom: 36px; } }

  .td-fallback-desc {
    font-weight: 300; font-size: 15px;
    color: var(--muted); line-height: 1.8;
    margin-bottom: 36px; max-width: 560px;
  }
  @media (min-width: 600px) { .td-fallback-desc { font-size: 17px; } }

  /* objectives box */
  .td-objectives {
    border: 1.5px solid var(--border);
    border-radius: 16px; padding: 24px 20px;
    background: var(--bg);
  }
  @media (min-width: 600px) { .td-objectives { padding: 28px 32px; border-radius: 20px; } }

  .td-objectives-heading {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700; font-size: 10px;
    letter-spacing: .16em; text-transform: uppercase;
    color: var(--ink); margin-bottom: 16px;
    display: flex; align-items: center; gap: 10px;
  }
  .td-objectives-heading::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }
  .td-obj-list { display: flex; flex-direction: column; gap: 12px; }
  .td-obj-item {
    display: flex; align-items: flex-start; gap: 12px;
    font-size: 14px; color: var(--muted); line-height: 1.65;
  }
  .td-obj-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--orange); margin-top: 8px; flex-shrink: 0;
  }

  /* watermark */
  .td-watermark {
    position: absolute; bottom: 16px; right: 16px;
    pointer-events: none; user-select: none; opacity: .04;
    font-family: 'Playfair Display', serif; font-weight: 800;
    font-size: clamp(24px, 5vw, 56px);
    color: var(--ink); white-space: nowrap;
    transform: rotate(-15deg); transform-origin: bottom right;
  }

  /* ── fullscreen CSS overlay (Fullscreen API fallback for iOS) ── */
  .td-fullscreen-root {
    position: fixed; inset: 0; z-index: 9999;
    background: var(--bg);
    display: flex; flex-direction: column;
  }
  .td-fullscreen-root .td-viewer { flex: 1; }

  /* ── suppress hover states on touch devices ── */
  @media (hover: none) {
    .td-back-btn:hover { background: rgba(255,255,255,.08); }
    .td-page-btn:hover { background: rgba(255,255,255,.07); color: var(--muted); }
    .td-icon-btn:hover { background: rgba(255,255,255,.07); color: var(--muted); }
  }
`;

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const TPDetail = () => {
  const { tpId }  = useParams();
  const navigate  = useNavigate();

  const [tp,         setTp]         = useState(null);
  const [loading,    setLoading]    = useState(true);
  const [zoom,       setZoom]       = useState(100);
  const [fullscreen, setFullscreen] = useState(false);

  /* ── fetch ── */
  useEffect(() => {
    if (!tpId) { setLoading(false); return; }
    (async () => {
      try {
        setLoading(true);
        const res = await tpService.getOneTP(tpId);
        setTp(res);
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    })();
  }, [tpId]);

  /* ── zoom helpers ── */
  const zoomOut = useCallback(() => setZoom(z => Math.max(50,  z - 10)), []);
  const zoomIn  = useCallback(() => setZoom(z => Math.min(200, z + 10)), []);

  /* ── fullscreen (Fullscreen API + CSS fallback) ── */
  const viewerRef = useRef(null);
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement && viewerRef.current) {
      viewerRef.current.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    setFullscreen(fs => !fs);
  }, []);

  /* ── PDF src ── */
  const pdfSrc = tp?.file_path
    ? `https://codelink-dng0fcepgjhmfma6.francecentral-01.azurewebsites.net/storage/${tp.file_path}#toolbar=0&navpanes=0&scrollbar=0`
    : null;

  /* ─── early states ─── */
  if (loading) return (
    <>
      <style>{style}</style>
      <div className="td-center">
        <Loader2 size={44} style={{ color: "var(--orange)" }} className="td-spin" />
      </div>
    </>
  );

  if (!tp) return (
    <>
      <style>{style}</style>
      <div className="td-center td-error">
        <AlertCircle size={44} />
        <p>Travail Pratique introuvable.</p>
        <button onClick={() => navigate(-1)}>← Retour</button>
      </div>
    </>
  );

  const tpNum = String(tp.id || "00").padStart(2, "0");

  /* ─── sub-components ─── */
  const Toolbar = () => (
    <header className="td-toolbar">

      {/* left */}
      <div className="td-toolbar-left">
        <div className="td-dot" aria-hidden="true" />
        <button
          className="td-back-btn"
          onClick={() => navigate(-1)}
          aria-label="Retour"
        >
          <ChevronLeft size={16} />
        </button>
        <div className="td-file-info">
          <div className="td-file-name">
            TP-{tpNum} — {tp.title}<em>.pdf</em>
          </div>
          <div className="td-file-meta">
            {tp.category || "Pratique"} &mdash; Énoncé Officiel
          </div>
        </div>
        {tp.difficulty && (
          <span className="td-diff-pill" aria-label={`Difficulté : ${tp.difficulty}`}>
            {tp.difficulty}
          </span>
        )}
      </div>

      {/* center — visible tablet+ */}
      <div className="td-toolbar-center">
        <button className="td-page-btn" disabled aria-label="Page précédente">
          <ChevronLeft size={13} />
        </button>
        <span className="td-page-label">Page 1 / 1</span>
        <button className="td-page-btn" disabled aria-label="Page suivante">
          <ChevronRight size={13} />
        </button>
      </div>

      {/* right */}
      <div className="td-toolbar-right">
        <div className="td-zoom" role="group" aria-label="Zoom">
          <button className="td-zoom-btn" onClick={zoomOut} aria-label="Réduire le zoom">
            <Minus size={13} />
          </button>
          <span className="td-zoom-val">{zoom}%</span>
          <button className="td-zoom-btn" onClick={zoomIn}  aria-label="Augmenter le zoom">
            <Plus size={13} />
          </button>
        </div>
        <button
          className="td-icon-btn"
          onClick={toggleFullscreen}
          aria-label={fullscreen ? "Quitter le plein écran" : "Plein écran"}
        >
          {fullscreen ? <Minimize2 size={15} /> : <Maximize2 size={15} />}
        </button>
      </div>

    </header>
  );

  const ViewerContent = () => (
    <div className="td-viewer" ref={viewerRef}>
      <div
        className="td-sheet-wrapper"
        style={{
          transform: `scale(${zoom / 100})`,
          /* negative bottom margin compensates scaled-down whitespace */
          marginBottom: zoom < 100
            ? `calc((${zoom / 100} - 1) * 800px)`
            : 0,
        }}
      >
        <div className="td-sheet">

          {pdfSrc ? (
            <div className="td-iframe-wrap">
              <iframe
                className="td-iframe"
                src={pdfSrc}
                title={tp.title}
                loading="lazy"
                allow="fullscreen"
              />
            </div>
          ) : (
            <div className="td-fallback">

              <span className="td-challenge-pill">
                Challenge — {tp.difficulty || "Niveau 1"}
              </span>

              <h2 className="td-fallback-title">
                Instructions&nbsp;: {tp.title}
              </h2>
              <p className="td-fallback-subtitle">
                TP-{tpNum} &bull; {tp.category}
              </p>

              <hr className="td-fallback-divider" />

              <p className="td-fallback-desc">{tp.description}</p>

              <div className="td-objectives">
                <div className="td-objectives-heading">Objectifs du TP</div>
                <div className="td-obj-list">
                  <div className="td-obj-item">
                    <div className="td-obj-dot" aria-hidden="true" />
                    Mise en pratique des concepts théoriques vus en cours.
                  </div>
                  <div className="td-obj-item">
                    <div className="td-obj-dot" aria-hidden="true" />
                    Validation des acquis techniques par la production de code.
                  </div>
                </div>
              </div>

            </div>
          )}

          <div className="td-watermark" aria-hidden="true">CodeLink TP</div>
        </div>
      </div>
    </div>
  );

  /* ─── render ─── */
  return (
    <>
      <style>{style}</style>

      {fullscreen ? (
        /* CSS fullscreen overlay — fallback when Fullscreen API isn't available (iOS) */
        <div className="td-fullscreen-root">
          <Toolbar />
          <ViewerContent />
        </div>
      ) : (
        /*
         * pt-14 (= 3.5rem) on mobile offsets the fixed Sidebar top bar.
         * Removed on lg+ where sidebar is a left column.
         */
        <div className="td-shell pt-14 lg:pt-0">
          <Sidebar
            brandName="CodeLink"
            onLogout={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          />
          <main className="td-main">
            <Toolbar />
            <ViewerContent />
          </main>
        </div>
      )}
    </>
  );
};

export default TPDetail;