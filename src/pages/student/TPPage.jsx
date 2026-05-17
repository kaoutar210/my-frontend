import React, { useState, useEffect } from 'react';
import {
  Code2, Cpu, Database, ChevronRight, Layers, Loader2
} from 'lucide-react';
import Sidebar from "../../components/layout/SidebarStudent";
import { tpService } from "../../services/api";
import { useNavigate } from 'react-router-dom';

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

  /* ── spin keyframe ── */
  @keyframes tp-spin { to { transform: rotate(360deg); } }
  .tp-spin { animation: tp-spin 1s linear infinite; }

  /* ── root ── */
  .tp-root {
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
  }

  /* ── shell ── */
  .tp-shell {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
    position: relative;
  }

  /* ── main ── */
  .tp-main {
    flex: 1;
    min-width: 0;
    overflow-y: auto;
    padding: 36px 20px 60px;
  }

  /* ── header ── */
  .tp-header {
    margin-bottom: 32px;
  }

  .tp-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 10px;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--orange);
    margin-bottom: 12px;
    display: block;
  }

  .tp-title {
    font-family: 'Playfair Display', serif;
    font-weight: 800;
    font-size: clamp(1.8rem, 5vw, 3rem);
    color: var(--ink);
    line-height: 1.1;
    letter-spacing: -.02em;
    margin: 0 0 14px;
  }
  .tp-title em { font-style: normal; color: var(--blue); }

  .tp-divider {
    height: 3px;
    width: 56px;
    border-radius: 3px;
    border: none;
    background: linear-gradient(90deg, var(--blue), var(--orange));
    margin: 0 0 18px;
  }

  .tp-subtitle {
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    font-size: 15px;
    color: var(--muted);
    max-width: 520px;
    line-height: 1.75;
    margin: 0;
  }

  /* ── filter bar ── */
  .tp-filters {
    display: flex;
    gap: 8px;
    margin-bottom: 32px;
    overflow-x: auto;
    padding-bottom: 4px;
    -webkit-overflow-scrolling: touch;
    /* hide scrollbar */
    scrollbar-width: none;
  }
  .tp-filters::-webkit-scrollbar { display: none; }

  .tp-filter {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 12px;
    letter-spacing: .03em;
    white-space: nowrap;
    padding: 8px 18px;
    border-radius: 999px;
    border: 1.5px solid var(--border);
    background: var(--white);
    color: var(--muted);
    cursor: pointer;
    transition: all .2s;
    flex-shrink: 0;
  }
  .tp-filter:hover  { border-color: var(--blue); color: var(--blue); }
  .tp-filter.active {
    background: var(--blue);
    border-color: var(--blue);
    color: var(--white);
    box-shadow: 0 6px 20px rgba(23,84,190,.22);
  }

  /* ── loader ── */
  .tp-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 260px;
    gap: 14px;
  }
  .tp-loader p {
    font-weight: 500;
    color: var(--muted);
    font-size: 14px;
    margin: 0;
  }

  /* ── grid ── */
  .tp-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  /* ── card ── */
  .tp-card {
    position: relative;
    overflow: hidden;
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 24px;
    display: flex;
    flex-direction: column;
    transition: box-shadow .3s, border-color .3s, transform .25s;
  }
  .tp-card:hover {
    box-shadow: 0 20px 48px rgba(23,84,190,.1);
    border-color: rgba(23,84,190,.2);
    transform: translateY(-3px);
  }
  .tp-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--blue), var(--orange));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform .35s cubic-bezier(.4,0,.2,1);
  }
  .tp-card:hover::after { transform: scaleX(1); }

  /* card top row */
  .tp-card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    gap: 8px;
  }

  /* diff badge */
  .tp-diff {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 9px;
    letter-spacing: .14em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 999px;
  }
  .tp-diff-easy    { background: rgba(23,184,190,.1);  color: #0d9b8e;       border: 1px solid rgba(23,184,190,.2); }
  .tp-diff-medium  { background: rgba(23,84,190,.09);  color: var(--blue);   border: 1px solid rgba(23,84,190,.2);  }
  .tp-diff-hard    { background: rgba(229,82,45,.09);  color: var(--orange); border: 1px solid rgba(229,82,45,.2);  }
  .tp-diff-default { background: var(--bg);            color: var(--muted);  border: 1px solid var(--border);       }

  /* icon wrapper */
  .tp-icon {
    width: 40px;
    height: 40px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    border: 1px solid var(--border);
    flex-shrink: 0;
    transition: background .25s, border-color .25s;
  }
  .tp-card:hover .tp-icon {
    background: rgba(23,84,190,.08);
    border-color: rgba(23,84,190,.2);
  }

  /* NEW badge */
  .tp-new {
    position: absolute;
    top: 16px; right: 16px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 8px;
    letter-spacing: .14em;
    text-transform: uppercase;
    padding: 3px 10px;
    border-radius: 999px;
    background: linear-gradient(135deg, var(--blue), var(--orange));
    color: var(--white);
    pointer-events: none;
  }

  /* card body */
  .tp-card-id {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 500;
    font-size: 10px;
    color: var(--muted);
    letter-spacing: .1em;
    margin: 0 0 6px;
  }
  .tp-card-title {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--ink);
    line-height: 1.2;
    margin: 0 0 10px;
    transition: color .2s;
  }
  .tp-card:hover .tp-card-title { color: var(--blue); }

  .tp-card-desc {
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    font-size: 13.5px;
    color: var(--muted);
    line-height: 1.7;
    margin: 0;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* card footer */
  .tp-card-footer {
    margin-top: 20px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }
  .tp-card-stat {
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    font-size: 11px;
    color: var(--muted);
    letter-spacing: .02em;
  }

  /* CTA button */
  .tp-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 12px;
    padding: 9px 16px;
    border-radius: 10px;
    border: none;
    cursor: pointer;
    background: var(--blue);
    color: var(--white);
    box-shadow: 0 4px 14px rgba(23,84,190,.28);
    transition: background .2s, box-shadow .2s, gap .2s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .tp-btn:hover {
    background: var(--ink);
    box-shadow: 0 6px 20px rgba(13,27,62,.3);
    gap: 10px;
  }

  /* ─── RESPONSIVE BREAKPOINTS ─── */

  /* Tablet: 600px+ */
  @media (min-width: 600px) {
    .tp-main {
      padding: 48px 32px 72px;
    }
    .tp-header {
      margin-bottom: 36px;
    }
    .tp-filters {
      margin-bottom: 36px;
      gap: 10px;
    }
    .tp-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 22px;
    }
    .tp-card {
      border-radius: 22px;
      padding: 28px;
    }
    .tp-card-title {
      font-size: 1.25rem;
    }
  }

  /* Desktop: 1024px+ */
  @media (min-width: 1024px) {
    .tp-main {
      padding: 64px 48px 80px;
    }
    .tp-header {
      margin-bottom: 48px;
    }
    .tp-filters {
      margin-bottom: 40px;
    }
    .tp-grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 24px;
    }
    .tp-card {
      border-radius: 24px;
      padding: 32px;
    }
    .tp-card-title {
      font-size: 1.25rem;
    }
  }

  /* Large desktop: 1440px+ */
  @media (min-width: 1440px) {
    .tp-main {
      padding: 64px 56px 80px;
    }
    .tp-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
  }

  /* Touch: disable hover transforms */
  @media (hover: none) {
    .tp-card:hover {
      transform: none;
      box-shadow: none;
      border-color: var(--border);
    }
    .tp-card:active {
      transform: scale(0.98);
      box-shadow: 0 8px 24px rgba(23,84,190,.1);
    }
    .tp-btn:hover {
      background: var(--blue);
      gap: 6px;
    }
  }
`;

/* ─────────────────────────────────────────────
   DIFF BADGE CLASS HELPER
───────────────────────────────────────────── */
const diffClass = (level = "") => {
  const l = level.toLowerCase();
  if (l.includes("facile") || l.includes("easy") || l.includes("débutant")) return "tp-diff tp-diff-easy";
  if (l.includes("moyen") || l.includes("medium") || l.includes("intermédiaire")) return "tp-diff tp-diff-medium";
  if (l.includes("difficile") || l.includes("hard") || l.includes("avancé")) return "tp-diff tp-diff-hard";
  return "tp-diff tp-diff-default";
};

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
const TPPage = () => {
  const [tps, setTps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("Tous les TP");
  const navigate = useNavigate();

  const categories = ["Tous les TP", "HTML", "CSS", "JavaScript"];

  const iconMap = {
    javascript: <Code2 size={18} style={{ color: "var(--orange)" }} />,
    react:      <Layers size={18} style={{ color: "#7c3aed" }} />,
    python:     <Cpu size={18} style={{ color: "var(--blue)" }} />,
    database:   <Database size={18} style={{ color: "var(--orange)" }} />,
  };

  useEffect(() => { fetchTPs(); }, [activeFilter]);

  const fetchTPs = async () => {
    try {
      setLoading(true);
      const categoryParam = activeFilter === "Tous les TP" ? "" : activeFilter;
      const response = await tpService.getAllTPs(categoryParam);
      setTps(response.tps || []);
    } catch (error) {
      console.error("Erreur lors du chargement des TP:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTP = async (id) => {
    try {
      await tpService.startTP(id);
      navigate(`/student/tps/${id}`);
    } catch {
      alert("Impossible de démarrer ce TP pour le moment.");
    }
  };

  return (
    <>
      <style>{style}</style>

      <div className="tp-root tp-shell">
        <Sidebar
          brandName="CodeLink"
          onLogout={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        />

        <main className="tp-main">

          {/* ── HEADER ── */}
          <header className="tp-header">
            <span className="tp-eyebrow">Parcours d'apprentissage</span>
            <h1 className="tp-title">
              Exercices <em>Pratiques</em>
            </h1>
            <hr className="tp-divider" />
            <p className="tp-subtitle">
              Relevez des défis techniques pour valider vos compétences et gagner de l'expérience concrète.
            </p>
          </header>

          {/* ── FILTERS ── */}
          <div className="tp-filters">
            {categories.map(cat => (
              <button
                key={cat}
                className={`tp-filter${activeFilter === cat ? " active" : ""}`}
                onClick={() => setActiveFilter(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* ── CONTENT ── */}
          {loading ? (
            <div className="tp-loader">
              <Loader2 size={40} style={{ color: "var(--blue)" }} className="tp-spin" />
              <p>Chargement de vos défis…</p>
            </div>
          ) : (
            <div className="tp-grid">
              {tps.map((tp) => (
                <TPCard
                  key={tp.id}
                  id={tp.id || "00"}
                  title={tp.title}
                  difficulty={tp.difficulty}
                  desc={tp.description}
                  stats={`${tp.completedCount ?? 0} complétés`}
                  icon={iconMap[tp.category?.toLowerCase()] || <Code2 size={18} style={{ color: "var(--muted)" }} />}
                  isNew={tp.isNewTP}
                  onStart={() => handleStartTP(tp.id)}
                />
              ))}
            </div>
          )}

        </main>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   FILTER BUTTON
───────────────────────────────────────────── */
export const FilterButton = ({ label, active, onClick }) => (
  <button
    className={`tp-filter${active ? " active" : ""}`}
    onClick={onClick}
  >
    {label}
  </button>
);

/* ─────────────────────────────────────────────
   TP CARD
───────────────────────────────────────────── */
export const TPCard = ({ id, title, difficulty, desc, stats, icon, isNew, onStart }) => (
  <div className="tp-card">

    {isNew && <span className="tp-new">Nouveau</span>}

    {/* top row */}
    <div className="tp-card-top">
      <span className={diffClass(difficulty)}>{difficulty || "N/A"}</span>
      <div className="tp-icon">{icon}</div>
    </div>

    {/* body */}
    <div style={{ flex: 1 }}>
      <p className="tp-card-id">TP — {String(id).padStart(2, "0")}</p>
      <h3 className="tp-card-title">{title}</h3>
      <p className="tp-card-desc">{desc}</p>
    </div>

    {/* footer */}
    <div className="tp-card-footer">
      <span className="tp-card-stat">{isNew ? "Nouveau TP disponible" : stats}</span>
      <button className="tp-btn" onClick={onStart}>
        Commencer <ChevronRight size={13} />
      </button>
    </div>

  </div>
);

export default TPPage;