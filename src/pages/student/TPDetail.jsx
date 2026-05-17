import React, { useState, useEffect, useRef } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import {
  ChevronLeft, ChevronRight, Minus, Plus, Maximize2,
  Loader2, AlertCircle
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from "../../components/layout/SidebarStudent";
import { tpService } from "../../services/api";

// ─── Worker PDF.js (obligatoire pour react-pdf) ───────────────────────────────
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

/* ─────────────────────────────────────────────
   SCOPED STYLES — MOBILE FIRST
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

  @keyframes td-spin { to { transform: rotate(360deg); } }
  .td-spin { animation: td-spin 1s linear infinite; }

  .td-root {
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
  }

  /* ── full-screen states ── */
  .td-center {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: var(--bg);
  }
  .td-error { flex-direction: column; gap: 12px; text-align: center; padding: 20px; }
  .td-error svg { color: var(--muted); }
  .td-error p { font-weight: 500; color: var(--muted); font-size: 15px; margin: 0; }
  .td-error button {
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px;
    color: var(--blue); background: none; border: none; cursor: pointer;
    text-decoration: underline; text-underline-offset: 3px; margin-top: 4px;
  }

  /* ── shell ── */
  .td-shell {
    display: flex;
    height: 100vh;
    overflow: hidden;
  }

  /* ── main column ── */
  .td-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  /* ════════════════════════════════════════
     TOOLBAR
  ════════════════════════════════════════ */
  .td-toolbar {
    height: auto;
    min-height: 56px;
    background: var(--ink);
    border-bottom: 2px solid var(--orange);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 14px;
    flex-shrink: 0;
    z-index: 10;
    gap: 8px;
    flex-wrap: wrap;
  }

  /* left */
  .td-toolbar-left {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    flex: 1;
  }

  .td-dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--orange);
    flex-shrink: 0;
  }

  .td-back-btn {
    width: 32px; height: 32px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,.08);
    border: 1px solid rgba(255,255,255,.12);
    cursor: pointer;
    transition: background .2s;
    color: var(--white);
    flex-shrink: 0;
  }
  .td-back-btn:hover { background: rgba(255,255,255,.16); }

  .td-file-info {
    min-width: 0;
    flex: 1;
  }
  .td-file-name {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 13px;
    color: var(--white);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .td-file-name em { font-style: normal; color: var(--orange); }
  .td-file-meta {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 400;
    font-size: 9px;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 2px;
  }

  .td-diff-pill {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 9px;
    letter-spacing: .12em;
    text-transform: uppercase;
    padding: 4px 10px;
    border-radius: 999px;
    background: rgba(229,82,45,.18);
    color: var(--orange);
    border: 1px solid rgba(229,82,45,.3);
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* center page nav */
  .td-toolbar-center {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  @media (max-width: 599px) { .td-toolbar-center { display: none; } }

  .td-page-btn {
    width: 28px; height: 28px;
    border-radius: 8px;
    border: none;
    background: rgba(255,255,255,.07);
    color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background .2s, color .2s;
  }
  .td-page-btn:hover:not(:disabled) { background: rgba(255,255,255,.14); color: var(--white); }
  .td-page-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .td-page-input {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 700;
    color: var(--white);
    background: rgba(255,255,255,.1);
    border: 1px solid rgba(255,255,255,.15);
    border-radius: 6px;
    width: 36px;
    text-align: center;
    padding: 2px 4px;
    outline: none;
  }
  .td-page-input:focus { border-color: var(--orange); }
  /* hide number spinner arrows */
  .td-page-input::-webkit-inner-spin-button,
  .td-page-input::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
  .td-page-input[type=number] { -moz-appearance: textfield; }

  .td-page-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    color: var(--white);
    padding: 0 6px;
    letter-spacing: .06em;
    white-space: nowrap;
  }

  /* right controls */
  .td-toolbar-right {
    display: flex;
    align-items: center;
    gap: 8px;
    flex-shrink: 0;
  }

  .td-zoom {
    display: flex;
    align-items: center;
    gap: 6px;
    background: rgba(255,255,255,.06);
    border: 1px solid rgba(255,255,255,.1);
    border-radius: 10px;
    padding: 4px 10px;
  }
  .td-zoom-btn {
    color: var(--muted);
    cursor: pointer;
    transition: color .2s;
    background: none;
    border: none;
    display: flex;
    align-items: center;
    padding: 0;
  }
  .td-zoom-btn:hover { color: var(--white); }
  .td-zoom-val {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: var(--white);
    min-width: 32px;
    text-align: center;
    letter-spacing: .04em;
  }

  @media (max-width: 400px) { .td-zoom { display: none; } }

  .td-icon-btn {
    display: none;
    width: 32px; height: 32px;
    border-radius: 10px;
    border: none;
    background: rgba(255,255,255,.07);
    color: var(--muted);
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background .2s, color .2s;
  }
  .td-icon-btn:hover { background: rgba(255,255,255,.14); color: var(--white); }

  /* ════════════════════════════════════════
     VIEWER
  ════════════════════════════════════════ */
  .td-viewer {
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    background:
      radial-gradient(ellipse at 80% 20%, rgba(229,82,45,.05) 0%, transparent 55%),
      repeating-linear-gradient(0deg, transparent, transparent 39px, var(--border) 40px),
      var(--bg);
    padding: 20px 12px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    -webkit-overflow-scrolling: touch;
  }

  /* ── PDF sheet ── */
  .td-sheet {
    background: var(--white);
    box-shadow: 0 12px 40px rgba(13,27,62,.12), 0 2px 8px rgba(13,27,62,.06);
    border-radius: 4px;
    width: 100%;
    max-width: 860px;
    position: relative;
    overflow: hidden;
  }
  .td-sheet::before {
    content: '';
    display: block;
    height: 4px;
    background: linear-gradient(90deg, var(--orange), var(--blue));
  }

  /* react-pdf canvas responsive */
  .td-sheet .react-pdf__Document {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .td-sheet .react-pdf__Page {
    width: 100% !important;
  }
  .td-sheet .react-pdf__Page canvas {
    width: 100% !important;
    height: auto !important;
    display: block;
  }

  /* ── PDF loading / error inside sheet ── */
  .td-pdf-loader {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 24px;
    flex-direction: column;
    gap: 16px;
  }
  .td-pdf-loader p {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: .08em;
  }
  .td-pdf-error {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 24px;
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
  .td-pdf-error p {
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    color: var(--muted);
  }

  /* ── mobile bottom pagination ── */
  .td-mobile-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 12px 16px;
    background: var(--white);
    border-top: 1px solid var(--border);
    flex-shrink: 0;
  }
  @media (min-width: 600px) { .td-mobile-nav { display: none; } }

  .td-mobile-btn {
    width: 40px; height: 40px;
    border-radius: 12px;
    border: 1.5px solid var(--border);
    background: var(--white);
    color: var(--ink);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: all .2s;
  }
  .td-mobile-btn:hover:not(:disabled) {
    background: var(--bg);
    border-color: var(--orange);
    color: var(--orange);
  }
  .td-mobile-btn:disabled { opacity: 0.35; cursor: not-allowed; }

  .td-mobile-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 700;
    color: var(--ink);
    letter-spacing: .06em;
  }

  /* ── fallback content ── */
  .td-fallback { padding: 32px 24px; }

  .td-challenge-pill {
    display: inline-flex;
    align-items: center;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 9px;
    letter-spacing: .16em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 999px;
    background: linear-gradient(135deg, var(--orange), rgba(229,82,45,.7));
    color: var(--white);
    margin-bottom: 24px;
  }

  .td-fallback-title {
    font-family: 'Playfair Display', serif;
    font-weight: 800;
    font-size: clamp(1.5rem, 4vw, 2.8rem);
    color: var(--ink);
    line-height: 1.15;
    letter-spacing: -.02em;
    margin: 0 0 6px;
  }
  .td-fallback-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    font-size: 13px;
    color: var(--muted);
    margin: 0 0 24px;
    letter-spacing: .01em;
  }

  .td-fallback-divider {
    height: 3px;
    width: 56px;
    border-radius: 3px;
    border: none;
    background: linear-gradient(90deg, var(--orange), rgba(229,82,45,.25));
    margin-bottom: 28px;
  }

  .td-fallback-desc {
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    font-size: 15px;
    color: var(--muted);
    line-height: 1.8;
    margin: 0 0 36px;
    max-width: 580px;
  }

  .td-objectives {
    border: 1.5px solid var(--border);
    border-radius: 16px;
    padding: 24px 20px;
    background: var(--bg);
  }
  .td-objectives-heading {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 10px;
    letter-spacing: .16em;
    text-transform: uppercase;
    color: var(--ink);
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .td-objectives-heading::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }
  .td-obj-list { display: flex; flex-direction: column; gap: 12px; }
  .td-obj-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: var(--muted);
    line-height: 1.65;
  }
  .td-obj-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--orange);
    margin-top: 8px;
    flex-shrink: 0;
  }

  /* watermark */
  .td-watermark {
    position: absolute;
    top: 50%; right: -80px;
    transform: translateY(-50%) rotate(45deg);
    pointer-events: none;
    user-select: none;
    opacity: .03;
    font-family: 'Playfair Display', serif;
    font-weight: 800;
    font-size: 68px;
    color: var(--ink);
    white-space: nowrap;
  }

  /* ════════════════════════════════════════
     RESPONSIVE BREAKPOINTS
  ════════════════════════════════════════ */
  @media (min-width: 600px) {
    .td-toolbar {
      padding: 0 20px;
      height: 56px;
      flex-wrap: nowrap;
    }
    .td-icon-btn { display: flex; }
    .td-viewer { padding: 32px 20px; }
    .td-fallback { padding: 48px 40px; }
    .td-objectives { padding: 28px 32px; border-radius: 20px; }
  }

  @media (min-width: 1024px) {
    .td-toolbar { padding: 0 24px; }
    .td-toolbar-left { gap: 14px; }
    .td-toolbar-right { gap: 14px; }
    .td-file-name { font-size: 14px; max-width: 380px; }
    .td-viewer { padding: 40px 24px; }
    .td-fallback { padding: 64px 72px; }
    .td-zoom { gap: 10px; padding: 5px 12px; }
  }

  @media (hover: none) {
    .td-back-btn:hover { background: rgba(255,255,255,.08); }
    .td-page-btn:hover { background: rgba(255,255,255,.07); color: var(--muted); }
    .td-icon-btn:hover { background: rgba(255,255,255,.07); color: var(--muted); }
  }
`;

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
const TPDetail = () => {
  const { tpId } = useParams();
  const navigate = useNavigate();

  const [tp, setTp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(100);

  // ── états PDF ──────────────────────────────────────────────────────────────
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [pageInputVal, setPageInputVal] = useState('1');
  const [containerWidth, setContainerWidth] = useState(800);
  const [pdfError, setPdfError] = useState(false);

  const viewerRef = useRef(null);

  // ── calcule la largeur réelle du viewer ────────────────────────────────────
  useEffect(() => {
    const updateWidth = () => {
      if (viewerRef.current) {
        const padding = window.innerWidth < 600 ? 32 : 56;
        const w = Math.min(860, viewerRef.current.clientWidth - padding);
        setContainerWidth(w > 100 ? w : 300);
      } else {
        const padding = window.innerWidth < 600 ? 32 : 56;
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

  // ── fetch TP ───────────────────────────────────────────────────────────────
  useEffect(() => {
    const fetchTPDetails = async () => {
      try {
        setLoading(true);
        const res = await tpService.getOneTP(tpId);
        setTp(res);
      } catch (err) {
        console.error("Erreur:", err);
      } finally {
        setLoading(false);
      }
    };
    if (tpId) fetchTPDetails();
  }, [tpId]);

  // ── helpers pagination ─────────────────────────────────────────────────────
  const goToPrev = () => setPageNumber(p => Math.max(1, p - 1));
  const goToNext = () => setPageNumber(p => Math.min(numPages ?? 1, p + 1));

  const handlePageInputChange = (e) => setPageInputVal(e.target.value);

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
  const pdfUrl = tp?.file_path
    ? `https://codelink-dng0fcepgjhmfma6.francecentral-01.azurewebsites.net/storage/${tp.file_path}`
    : null;

  /* ── loading ── */
  if (loading) return (
    <>
      <style>{style}</style>
      <div className="td-center">
        <Loader2 size={44} style={{ color: "var(--orange)" }} className="td-spin" />
      </div>
    </>
  );

  /* ── error ── */
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

  return (
    <>
      <style>{style}</style>

      <div className="td-root td-shell">
        <Sidebar
          brandName="CodeLink"
          onLogout={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        />

        <main className="td-main">

          {/* ── TOOLBAR ── */}
          <header className="td-toolbar">

            {/* left */}
            <div className="td-toolbar-left">
              <div className="td-dot" />
              <button className="td-back-btn" onClick={() => navigate(-1)}>
                <ChevronLeft size={18} />
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
                <span className="td-diff-pill">{tp.difficulty}</span>
              )}
            </div>

            {/* center — visible tablet+ */}
            <div className="td-toolbar-center">
              <button
                className="td-page-btn"
                onClick={goToPrev}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft size={14} />
              </button>

              <input
                className="td-page-input"
                type="number"
                min={1}
                max={numPages ?? 1}
                value={pageInputVal}
                onChange={handlePageInputChange}
                onBlur={handlePageInputBlur}
                onKeyDown={handlePageInputKeyDown}
              />
              <span className="td-page-label">/ {numPages ?? '—'}</span>

              <button
                className="td-page-btn"
                onClick={goToNext}
                disabled={!numPages || pageNumber >= numPages}
              >
                <ChevronRight size={14} />
              </button>
            </div>

            {/* right */}
            <div className="td-toolbar-right">
              <div className="td-zoom">
                <button
                  className="td-zoom-btn"
                  onClick={() => setZoom(z => Math.max(50, z - 10))}
                  aria-label="Réduire le zoom"
                >
                  <Minus size={14} />
                </button>
                <span className="td-zoom-val">{zoom}%</span>
                <button
                  className="td-zoom-btn"
                  onClick={() => setZoom(z => Math.min(200, z + 10))}
                  aria-label="Augmenter le zoom"
                >
                  <Plus size={14} />
                </button>
              </div>
              <button
                className="td-icon-btn"
                aria-label="Plein écran"
                onClick={handleFullscreen}
              >
                <Maximize2 size={16} />
              </button>
            </div>

          </header>

          {/* ── VIEWER ── */}
          <div className="td-viewer" ref={viewerRef}>
            <div className="td-sheet">

              {pdfUrl ? (
                pdfError ? (
                  <div className="td-pdf-error">
                    <AlertCircle size={36} style={{ color: "var(--muted)" }} />
                    <p>Impossible de charger le PDF.</p>
                    <p style={{ fontSize: 12 }}>Vérifiez votre connexion ou contactez l'administrateur.</p>
                  </div>
                ) : (
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
                      <div className="td-pdf-loader">
                        <Loader2 size={36} style={{ color: "var(--orange)" }} className="td-spin" />
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
                        <div className="td-pdf-loader">
                          <Loader2 size={28} style={{ color: "var(--orange)" }} className="td-spin" />
                        </div>
                      }
                    />
                  </Document>
                )
              ) : (
                /* ── fallback si pas de fichier ── */
                <div className="td-fallback">
                  <span className="td-challenge-pill">
                    Challenge — {tp.difficulty || "Niveau 1"}
                  </span>
                  <h2 className="td-fallback-title">
                    Instructions&nbsp;: {tp.title}
                  </h2>
                  <p className="td-fallback-subtitle">TP-{tpNum} &bull; {tp.category}</p>
                  <hr className="td-fallback-divider" />
                  <p className="td-fallback-desc">{tp.description}</p>
                  <div className="td-objectives">
                    <div className="td-objectives-heading">Objectifs du TP</div>
                    <div className="td-obj-list">
                      <div className="td-obj-item">
                        <div className="td-obj-dot" />
                        Mise en pratique des concepts théoriques vus en cours.
                      </div>
                      <div className="td-obj-item">
                        <div className="td-obj-dot" />
                        Validation des acquis techniques par la production de code.
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="td-watermark">CodeLink TP</div>
            </div>
          </div>

          {/* ── PAGINATION MOBILE (visible seulement < 600px) ── */}
          {numPages && numPages > 1 && (
            <div className="td-mobile-nav">
              <button
                className="td-mobile-btn"
                onClick={goToPrev}
                disabled={pageNumber <= 1}
              >
                <ChevronLeft size={18} />
              </button>
              <span className="td-mobile-label">
                {pageNumber} / {numPages}
              </span>
              <button
                className="td-mobile-btn"
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

export default TPDetail;