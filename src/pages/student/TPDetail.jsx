import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, Minus, Plus, Maximize2,
  Loader2, AlertCircle
} from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from "../../components/layout/SidebarStudent";
import { tpService } from "../../services/api";

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
  .td-root { font-family: 'DM Sans', sans-serif; color: var(--ink); }

  /* ── full-screen states ── */
  .td-center {
    display: flex; align-items: center; justify-content: center;
    height: 100vh; background: var(--bg);
  }
  .td-error { flex-direction: column; gap: 12px; }
  .td-error svg { color: var(--muted); }
  .td-error p { font-weight: 500; color: var(--muted); font-size: 15px; }
  .td-error button {
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px;
    color: var(--blue); background: none; border: none; cursor: pointer;
    text-decoration: underline; text-underline-offset: 3px; margin-top: 4px;
  }
  @keyframes td-spin { to { transform: rotate(360deg); } }
  .td-spin { animation: td-spin 1s linear infinite; }

  /* ── toolbar ── */
  .td-toolbar {
    height: 56px; background: var(--ink);
    border-bottom: 2px solid var(--orange); /* orange accent — differentiates TP from Course viewer */
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 24px; flex-shrink: 0; z-index: 10;
  }
  .td-toolbar-left { display: flex; align-items: center; gap: 14px; }

  /* orange dot for TP identity */
  .td-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--orange); flex-shrink: 0;
  }

  .td-back-btn {
    width: 34px; height: 34px; border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,.08); border: 1px solid rgba(255,255,255,.12);
    cursor: pointer; transition: background .2s; color: var(--white);
  }
  .td-back-btn:hover { background: rgba(255,255,255,.16); }

  .td-file-name {
    font-family: 'Playfair Display', serif; font-weight: 700; font-size: 14px;
    color: var(--white); max-width: 380px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .td-file-name em { font-style: normal; color: var(--orange); }
  .td-file-meta {
    font-family: 'JetBrains Mono', monospace; font-weight: 400; font-size: 9px;
    letter-spacing: .12em; text-transform: uppercase; color: var(--muted);
    margin-top: 2px;
  }

  /* difficulty pill in toolbar */
  .td-diff-pill {
    font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 9px;
    letter-spacing: .12em; text-transform: uppercase;
    padding: 4px 12px; border-radius: 999px;
    background: rgba(229,82,45,.18); color: var(--orange);
    border: 1px solid rgba(229,82,45,.3);
  }

  /* center page nav */
  .td-toolbar-center { display: flex; align-items: center; gap: 4px; }
  .td-page-btn {
    width: 28px; height: 28px; border-radius: 8px; border: none;
    background: rgba(255,255,255,.07); color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .2s, color .2s;
  }
  .td-page-btn:hover { background: rgba(255,255,255,.14); color: var(--white); }
  .td-page-label {
    font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 500;
    color: var(--white); padding: 0 12px; letter-spacing: .06em;
  }

  /* right controls */
  .td-toolbar-right { display: flex; align-items: center; gap: 14px; }
  .td-zoom {
    display: flex; align-items: center; gap: 10px;
    background: rgba(255,255,255,.06); border: 1px solid rgba(255,255,255,.1);
    border-radius: 10px; padding: 5px 12px;
  }
  .td-zoom-btn {
    color: var(--muted); cursor: pointer; transition: color .2s;
    background: none; border: none; display: flex; align-items: center;
  }
  .td-zoom-btn:hover { color: var(--white); }
  .td-zoom-val {
    font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700;
    color: var(--white); min-width: 36px; text-align: center; letter-spacing: .04em;
  }
  .td-icon-btn {
    width: 32px; height: 32px; border-radius: 10px; border: none;
    background: rgba(255,255,255,.07); color: var(--muted);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background .2s, color .2s;
  }
  .td-icon-btn:hover { background: rgba(255,255,255,.14); color: var(--white); }

  /* ── viewer area ── */
  .td-viewer {
    flex: 1; overflow-y: auto;
    background:
      radial-gradient(ellipse at 80% 20%, rgba(229,82,45,.05) 0%, transparent 55%),
      repeating-linear-gradient(0deg, transparent, transparent 39px, var(--border) 40px),
      var(--bg);
    padding: 40px 24px;
    display: flex; justify-content: center; align-items: flex-start;
  }

  /* ── PDF sheet ── */
  .td-sheet {
    background: var(--white);
    box-shadow: 0 32px 80px rgba(13,27,62,.14), 0 2px 8px rgba(13,27,62,.08);
    border-radius: 4px;
    width: 100%; max-width: 860px; min-height: 1100px;
    position: relative; overflow: hidden;
    transition: transform .3s, width .3s;
    transform-origin: top center;
  }
  /* orange top stripe for TP */
  .td-sheet::before {
    content: ''; display: block; height: 4px;
    background: linear-gradient(90deg, var(--orange), var(--blue));
  }

  /* ── fallback content ── */
  .td-fallback { padding: 64px 72px; }

  .td-challenge-pill {
    display: inline-flex; align-items: center;
    font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 9px;
    letter-spacing: .16em; text-transform: uppercase;
    padding: 5px 14px; border-radius: 999px;
    background: linear-gradient(135deg, var(--orange), rgba(229,82,45,.7));
    color: var(--white); margin-bottom: 32px;
  }

  .td-fallback-title {
    font-family: 'Playfair Display', serif; font-weight: 800;
    font-size: clamp(1.8rem, 4vw, 2.8rem); color: var(--ink);
    line-height: 1.15; letter-spacing: -.02em; margin-bottom: 8px;
  }
  .td-fallback-subtitle {
    font-family: 'DM Sans', sans-serif; font-weight: 400; font-size: 13px;
    color: var(--muted); margin-bottom: 28px; letter-spacing: .01em;
  }

  .td-fallback-divider {
    height: 3px; width: 56px; border-radius: 3px; border: none;
    background: linear-gradient(90deg, var(--orange), rgba(229,82,45,.25));
    margin-bottom: 36px;
  }

  .td-fallback-desc {
    font-family: 'DM Sans', sans-serif; font-weight: 300; font-size: 16px;
    color: var(--muted); line-height: 1.8; margin-bottom: 44px; max-width: 580px;
  }

  /* objectives box */
  .td-objectives {
    border: 1.5px solid var(--border); border-radius: 20px;
    padding: 36px 40px; background: var(--bg);
  }
  .td-objectives-heading {
    font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 10px;
    letter-spacing: .16em; text-transform: uppercase;
    color: var(--ink); margin-bottom: 20px; display: flex; align-items: center; gap: 10px;
  }
  .td-objectives-heading::after {
    content: ''; flex: 1; height: 1px; background: var(--border);
  }
  .td-obj-list { display: flex; flex-direction: column; gap: 14px; }
  .td-obj-item {
    display: flex; align-items: flex-start; gap: 14px;
    font-family: 'DM Sans', sans-serif; font-weight: 400; font-size: 14px;
    color: var(--muted); line-height: 1.65;
  }
  .td-obj-dot {
    width: 6px; height: 6px; border-radius: 50%;
    background: var(--orange); margin-top: 8px; flex-shrink: 0;
  }

  /* watermark */
  .td-watermark {
    position: absolute; top: 50%; right: -80px;
    transform: translateY(-50%) rotate(45deg);
    pointer-events: none; user-select: none; opacity: .03;
    font-family: 'Playfair Display', serif; font-weight: 800; font-size: 68px;
    color: var(--ink); white-space: nowrap;
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

      <div
        className="td-root"
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
          <header className="td-toolbar">

            {/* left */}
            <div className="td-toolbar-left">
              <div className="td-dot" />
              <button className="td-back-btn" onClick={() => navigate(-1)}>
                <ChevronLeft size={18} />
              </button>
              <div>
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

            {/* center */}
            <div className="td-toolbar-center">
              <button className="td-page-btn"><ChevronLeft size={14} /></button>
              <span className="td-page-label">Page 1 / 1</span>
              <button className="td-page-btn"><ChevronRight size={14} /></button>
            </div>

            {/* right */}
            <div className="td-toolbar-right">
              <div className="td-zoom">
                <button className="td-zoom-btn" onClick={() => setZoom(z => Math.max(50, z - 10))}>
                  <Minus size={14} />
                </button>
                <span className="td-zoom-val">{zoom}%</span>
                <button className="td-zoom-btn" onClick={() => setZoom(z => Math.min(200, z + 10))}>
                  <Plus size={14} />
                </button>
              </div>
              <button className="td-icon-btn"><Maximize2 size={16} /></button>
            </div>

          </header>

          {/* ── VIEWER ── */}
          <div className="td-viewer">
            <div
              className="td-sheet"
              style={{
                transform: `scale(${zoom / 100})`,
                width: `min(860px, ${zoom}%)`,
              }}
            >
              {tp.file_path ? (
                <iframe
                  src={`http://localhost:8000/storage/${tp.file_path}#toolbar=0`}
                  style={{ width: "100%", height: "100%", minHeight: 1100, display: "block", border: "none" }}
                  title={tp.title}
                />
              ) : (
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

        </main>
      </div>
    </>
  );
};

export default TPDetail;