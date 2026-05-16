import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Trophy, ChevronLeft, RotateCcw,
  CheckCircle2, Target, Zap, Clock, Loader2
} from 'lucide-react';
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
    --green:  #0d9b8e;
  }
  *, *::before, *::after { box-sizing: border-box; }
  .qr-root { font-family: 'DM Sans', sans-serif; color: var(--ink); }

  /* ── full-screen states ── */
  .qr-center {
    display: flex; align-items: center; justify-content: center;
    min-height: 100vh; background: var(--bg); gap: 12px; flex-direction: column;
  }
  .qr-center p { font-weight: 500; color: var(--muted); }
  @keyframes qr-spin { to { transform: rotate(360deg); } }
  .qr-spin { animation: qr-spin 1s linear infinite; }

  /* ── back button ── */
  .qr-back {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px;
    color: var(--blue); cursor: pointer; border: none; background: none;
    letter-spacing: .02em; transition: gap .2s; margin-bottom: 36px;
  }
  .qr-back:hover { gap: 12px; }

  /* ── score card ── */
  .qr-score-card {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 32px; padding: 56px;
    display: flex; align-items: center; gap: 56px;
    flex-wrap: wrap; position: relative; overflow: hidden;
    box-shadow: 0 8px 40px rgba(13,27,62,.07);
    margin-bottom: 24px;
  }

  /* decorative blobs */
  .qr-blob-1 {
    position: absolute; top: -60px; right: -60px;
    width: 220px; height: 220px; border-radius: 50%;
    background: radial-gradient(circle, rgba(23,84,190,.08), transparent 70%);
    pointer-events: none;
  }
  .qr-blob-2 {
    position: absolute; bottom: -40px; left: -40px;
    width: 160px; height: 160px; border-radius: 50%;
    background: radial-gradient(circle, rgba(229,82,45,.07), transparent 70%);
    pointer-events: none;
  }

  /* ── donut chart ── */
  .qr-donut-wrap {
    position: relative; width: 180px; height: 180px;
    flex-shrink: 0; display: flex; align-items: center; justify-content: center;
  }
  .qr-donut-wrap svg { width: 100%; height: 100%; transform: rotate(-90deg); }
  .qr-donut-center {
    position: absolute; display: flex; flex-direction: column; align-items: center;
  }
  .qr-score-pct {
    font-family: 'Playfair Display', serif; font-weight: 800; font-size: 2.8rem;
    color: var(--ink); line-height: 1; letter-spacing: -.03em;
  }
  .qr-score-label {
    font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 9px;
    letter-spacing: .14em; text-transform: uppercase; color: var(--muted);
    margin-top: 4px;
  }

  /* ── result text block ── */
  .qr-result-body { flex: 1; z-index: 1; }

  .qr-status-pill {
    display: inline-flex; align-items: center; gap: 7px;
    font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 9px;
    letter-spacing: .16em; text-transform: uppercase;
    padding: 6px 16px; border-radius: 999px; margin-bottom: 20px;
  }
  .qr-status-pill.pass {
    background: rgba(13,155,142,.1); color: var(--green);
    border: 1px solid rgba(13,155,142,.25);
  }
  .qr-status-pill.fail {
    background: rgba(229,82,45,.09); color: var(--orange);
    border: 1px solid rgba(229,82,45,.22);
  }

  .qr-result-title {
    font-family: 'Playfair Display', serif; font-weight: 800;
    font-size: clamp(1.8rem, 3vw, 2.4rem); color: var(--ink);
    line-height: 1.15; letter-spacing: -.02em; margin-bottom: 12px;
  }
  .qr-divider {
    height: 3px; width: 48px; border-radius: 3px; border: none;
    margin: 0 0 18px;
  }
  .qr-divider.pass { background: linear-gradient(90deg, var(--green), rgba(13,155,142,.3)); }
  .qr-divider.hr-fail { background: linear-gradient(90deg, var(--orange), rgba(229,82,45,.3)); }

  .qr-result-desc {
    font-family: 'DM Sans', sans-serif; font-weight: 300; font-size: 15px;
    color: var(--muted); line-height: 1.75; max-width: 400px;
  }
  .qr-result-desc strong { font-weight: 600; color: var(--ink); }

  /* ── action buttons ── */
  .qr-actions { display: flex; flex-direction: column; gap: 12px; z-index: 1; }
  .qr-btn-primary {
    display: inline-flex; align-items: center; justify-content: center; gap: 10px;
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 14px;
    padding: 14px 28px; border-radius: 14px; border: none; cursor: pointer;
    background: var(--blue); color: var(--white);
    box-shadow: 0 6px 20px rgba(23,84,190,.28);
    transition: background .2s, box-shadow .2s;
    white-space: nowrap;
  }
  .qr-btn-primary:hover { background: var(--ink); box-shadow: 0 8px 24px rgba(13,27,62,.28); }
  .qr-btn-secondary {
    display: inline-flex; align-items: center; justify-content: center; gap: 10px;
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 14px;
    padding: 13px 28px; border-radius: 14px; cursor: pointer;
    background: var(--white); color: var(--muted);
    border: 1.5px solid var(--border);
    transition: border-color .2s, color .2s;
    white-space: nowrap;
  }
  .qr-btn-secondary:hover { border-color: var(--blue); color: var(--blue); }

  /* ── stat cards ── */
  .qr-stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; }

  .qr-stat {
    background: var(--white); border: 1.5px solid var(--border);
    border-radius: 20px; padding: 24px 28px;
    display: flex; align-items: center; gap: 18px;
    transition: box-shadow .25s, border-color .25s;
  }
  .qr-stat:hover {
    box-shadow: 0 8px 24px rgba(23,84,190,.08);
    border-color: rgba(23,84,190,.18);
  }
  .qr-stat-icon {
    width: 44px; height: 44px; border-radius: 13px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    background: var(--bg); border: 1px solid var(--border);
  }
  .qr-stat-label {
    font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 9px;
    letter-spacing: .14em; text-transform: uppercase; color: var(--muted);
    margin-bottom: 6px;
  }
  .qr-stat-value {
    font-family: 'Playfair Display', serif; font-weight: 800; font-size: 1.6rem;
    color: var(--ink); line-height: 1; margin-bottom: 4px;
  }
  .qr-stat-desc {
    font-family: 'DM Sans', sans-serif; font-weight: 300; font-size: 12px;
    color: var(--border); font-style: italic;
  }
`;

/* circumference for r=80 */
const CIRC = 2 * Math.PI * 80; // ≈ 502.65

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
const QCMResultsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [results, setResults] = useState(location?.state?.results || null);
  const [loading, setLoading] = useState(!location?.state?.results);

  useEffect(() => {
    if (location?.state?.results) return;
    const fetchResults = async () => {
      try {
        const response = await API.get('/student/results');
        const latest = Array.isArray(response.data) ? response.data[0] : response.data;
        setResults(latest);
      } catch (err) {
        console.error("Erreur chargement résultats :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [location]);

  if (loading) return (
    <>
      <style>{style}</style>
      <div className="qr-center">
        <Loader2 size={40} style={{ color: "var(--blue)" }} className="qr-spin" />
      </div>
    </>
  );

  if (!results) return (
    <>
      <style>{style}</style>
      <div className="qr-center"><p>Aucun résultat trouvé.</p></div>
    </>
  );

  const totalQuestions = results.total || 1;
  const scorePercentage = Math.round((results.score / totalQuestions) * 100);
  const isPassed = scorePercentage >= 70;
  const dashOffset = CIRC - (CIRC * scorePercentage) / 100;
  const ringColor = isPassed ? "var(--green)" : "var(--orange)";

  return (
    <>
      <style>{style}</style>

      <div
        className="qr-root"
        style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
      >
        <Sidebar />

        <main style={{ flex: 1, padding: "56px 48px 64px", overflowY: "auto" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>

            {/* ── back ── */}
            <button className="qr-back" onClick={() => navigate('/student/qcm')}>
              <ChevronLeft size={16} />
              Retour aux Quiz
            </button>

            {/* ── SCORE CARD ── */}
            <div className="qr-score-card">
              <div className="qr-blob-1" />
              <div className="qr-blob-2" />

              {/* donut */}
              <div className="qr-donut-wrap">
                <svg viewBox="0 0 180 180">
                  {/* track */}
                  <circle cx="90" cy="90" r="80" fill="none"
                    stroke="var(--border)" strokeWidth="10" />
                  {/* fill */}
                  <circle cx="90" cy="90" r="80" fill="none"
                    stroke={ringColor} strokeWidth="10"
                    strokeDasharray={CIRC}
                    strokeDashoffset={dashOffset}
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 1s cubic-bezier(.4,0,.2,1)" }}
                  />
                </svg>
                <div className="qr-donut-center">
                  <span className="qr-score-pct">{scorePercentage}%</span>
                  <span className="qr-score-label">Score Final</span>
                </div>
              </div>

              {/* text */}
              <div className="qr-result-body">
                <span className={`qr-status-pill ${isPassed ? "pass" : "fail"}`}>
                  {isPassed ? <Trophy size={12} /> : <Zap size={12} />}
                  {isPassed ? "Certification Débloquée" : "Encore un effort !"}
                </span>

                <h1 className="qr-result-title">
                  {isPassed ? "Excellent travail !" : "Continuez d'apprendre !"}
                </h1>

                <hr className={`qr-divider ${isPassed ? "pass" : "hr-fail"}`} />

                <p className="qr-result-desc">
                  Vous avez répondu correctement à{" "}
                  <strong>{results.score} question{results.score > 1 ? "s" : ""}</strong>{" "}
                  sur un total de {totalQuestions}.
                </p>
              </div>

              {/* actions */}
              <div className="qr-actions">
                <button
                  className="qr-btn-primary"
                  onClick={() => navigate(`/student/qcm/${results.category || results.language_id}`)}
                >
                  <RotateCcw size={16} />
                  Rejouer
                </button>
                <button
                  className="qr-btn-secondary"
                  onClick={() => navigate('/student/qcm')}
                >
                  Changer de Quiz
                </button>
              </div>

            </div>

            {/* ── STATS ── */}
            <div className="qr-stats">
              <StatCard
                icon={<Target size={20} style={{ color: "var(--blue)" }} />}
                label="Précision"
                value={`${scorePercentage}%`}
                desc="Exactitude des réponses"
              />
              <StatCard
                icon={<CheckCircle2 size={20} style={{ color: "var(--green)" }} />}
                label="Correctes"
                value={results.score}
                desc="Bonnes réponses"
              />
              <StatCard
                icon={<Clock size={20} style={{ color: "var(--muted)" }} />}
                label="Temps"
                value={results.duration || "00:00"}
                desc="Durée de la session"
              />
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   STAT CARD
───────────────────────────────────────────── */
const StatCard = ({ icon, label, value, desc }) => (
  <div className="qr-stat">
    <div className="qr-stat-icon">{icon}</div>
    <div>
      <div className="qr-stat-label">{label}</div>
      <div className="qr-stat-value">{value}</div>
      <div className="qr-stat-desc">{desc}</div>
    </div>
  </div>
);

export default QCMResultsPage;