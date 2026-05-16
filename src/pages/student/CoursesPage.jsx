import React, { useState, useEffect } from 'react';
import {
  Globe, Layout, Zap, Box,
  Sparkles, ArrowRight, Loader2,
  BookOpen, Trophy, Clock
} from 'lucide-react';
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/layout/SidebarStudent";
import API from "../../services/api";

const ICON_MAP = {
  Globe: Globe,
  Layout: Layout,
  Zap: Zap,
  Box: Box,
};

/* ─── Design tokens ──────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --blue:        #1754be;
    --blue-soft:   #eef3fc;
    --blue-mid:    #c5d5f5;
    --orange:      #e5522d;
    --orange-soft: #fdf1ee;
    --orange-mid:  #f5c4b5;
    --ink:         #0d1b3e;
    --muted:       #8896b3;
    --rule:        #eef0f5;
  }

  .cp-root { font-family: 'DM Sans', sans-serif; }

  /* ── Header ─────────────────────────────────────────────────── */
  .cp-header {
    padding: 56px 48px 40px;
    border-bottom: 1px solid var(--rule);
    position: relative;
    overflow: hidden;
  }
  .cp-header::before {
    content: '';
    position: absolute;
    top: -80px; right: -60px;
    width: 320px; height: 320px;
    background: radial-gradient(circle, rgba(23,84,190,.06) 0%, transparent 70%);
    pointer-events: none;
  }

  .cp-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: var(--orange-soft);
    color: var(--orange);
    border: 1px solid var(--orange-mid);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .18em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 20px;
    margin-bottom: 20px;
  }

  .cp-title {
    font-family: 'Playfair Display', serif;
    font-size: clamp(2rem, 4vw, 2.8rem);
    font-weight: 800;
    color: var(--ink);
    line-height: 1.1;
    letter-spacing: -.02em;
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 14px;
  }

  .cp-sub {
    color: var(--muted);
    font-size: 15px;
    font-weight: 400;
    max-width: 480px;
    line-height: 1.65;
  }

  /* ── Stats strip ─────────────────────────────────────────────── */
  .cp-stats-strip {
    display: flex;
    align-items: center;
    gap: 32px;
    margin-top: 32px;
  }
  .cp-stat {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 12px;
    font-weight: 500;
    color: var(--muted);
  }
  .cp-stat svg { color: var(--blue); }
  .cp-stat strong { color: var(--ink); font-weight: 700; }
  .cp-stat-divider { width: 1px; height: 16px; background: var(--rule); }

  /* ── Grid ───────────────────────────────────────────────────── */
  .cp-grid {
    padding: 40px 48px 80px;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 20px;
  }

  /* ── Card ───────────────────────────────────────────────────── */
  .cp-card {
    position: relative;
    background: #fff;
    border: 1px solid var(--rule);
    border-radius: 20px;
    cursor: pointer;
    overflow: hidden;
    transition: box-shadow .25s ease, transform .25s ease, border-color .25s ease;
  }
  .cp-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 20px 48px rgba(13,27,62,.09);
    border-color: var(--blue-mid);
  }

  /* top color strip */
  .cp-card-strip {
    height: 3px;
    width: 0;
    transition: width .35s ease;
    background: linear-gradient(90deg, var(--blue), var(--orange));
  }
  .cp-card:hover .cp-card-strip { width: 100%; }

  .cp-card-body { padding: 28px 28px 24px; }

  /* icon + level row */
  .cp-card-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 24px;
  }

  .cp-icon-wrap {
    width: 52px; height: 52px;
    background: var(--blue-soft);
    border: 1px solid var(--blue-mid);
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background .25s, border-color .25s;
  }
  .cp-card:hover .cp-icon-wrap {
    background: var(--blue);
    border-color: var(--blue);
  }
  .cp-icon-wrap svg { color: var(--blue); transition: color .25s; }
  .cp-card:hover .cp-icon-wrap svg { color: #fff; }

  .cp-level-pill {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--muted);
    background: #f7f8fb;
    border: 1px solid var(--rule);
    padding: 4px 12px;
    border-radius: 20px;
  }

  /* text */
  .cp-card-subtitle {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: .15em;
    text-transform: uppercase;
    color: var(--orange);
    margin-bottom: 6px;
  }

  .cp-card-title {
    font-family: 'Playfair Display', serif;
    font-size: 1.35rem;
    font-weight: 700;
    color: var(--ink);
    line-height: 1.2;
    margin-bottom: 10px;
    transition: color .2s;
  }
  .cp-card:hover .cp-card-title { color: var(--blue); }

  .cp-card-desc {
    font-size: 13.5px;
    color: var(--muted);
    line-height: 1.6;
    font-weight: 400;
  }

  /* footer */
  .cp-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 22px;
    padding-top: 18px;
    border-top: 1px solid var(--rule);
  }

  .cp-card-stats {
    font-size: 11px;
    font-weight: 500;
    color: #b0bdd4;
    letter-spacing: .05em;
  }

  .cp-card-cta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 12.5px;
    font-weight: 600;
    color: var(--ink);
    letter-spacing: .02em;
    transition: gap .2s, color .2s;
  }
  .cp-card:hover .cp-card-cta {
    gap: 10px;
    color: var(--orange);
  }
  .cp-card-cta svg { transition: transform .2s; }
  .cp-card:hover .cp-card-cta svg { transform: translateX(2px); }

  /* ── Loader ─────────────────────────────────────────────────── */
  @keyframes spin { to { transform: rotate(360deg); } }
  .cp-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 60vh;
    gap: 14px;
  }
  .cp-loader p {
    font-size: 13px;
    font-weight: 500;
    color: var(--muted);
    letter-spacing: .06em;
  }
  .cp-spin { animation: spin 1s linear infinite; }
`;

/* ─── Page ───────────────────────────────────────────────────── */
const CoursesPage = () => {
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading]     = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await API.get('/languages');
        setLanguages(response.data);
      } catch (error) {
        console.error("Erreur lors du chargement des langages:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchLanguages();
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="cp-root flex min-h-screen bg-white text-slate-700">
        <Sidebar
          brandName="Codelink Notebook"
          onLogout={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        />

        <main className="flex-1 overflow-y-auto">

          {/* ── Header ── */}
          <header className="cp-header">
            <div className="cp-badge">
              <Sparkles size={10} />
              Catalogue de formation
            </div>

            <h1 className="cp-title">
              Que voulez-vous apprendre ?
            </h1>

            <p className="cp-sub">
              Choisissez un langage pour explorer les modules
            </p>

            <div className="cp-stats-strip">
              <div className="cp-stat">
                <BookOpen size={13} />
                <strong>{languages.length}</strong>&nbsp;langages disponibles
              </div>
              
              
            </div>
          </header>

          {/* ── Content ── */}
          {loading ? (
            <div className="cp-loader">
              <Loader2 size={36} className="cp-spin" style={{ color: '#e5522d' }} />
              <p>Chargement du catalogue…</p>
            </div>
          ) : (
            <div className="cp-grid">
              {languages.map((lang) => (
                <LanguageCard
                  key={lang.id}
                  {...lang}
                  iconName={lang.icon_name}
                  onClick={() => navigate(`/student/language/${lang.id}`)}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

/* ─── Card ───────────────────────────────────────────────────── */
const LanguageCard = ({ title, subtitle, description, iconName, stats, level, onClick }) => {
  const IconComponent = ICON_MAP[iconName] || Globe;

  return (
    <div className="cp-card" onClick={onClick}>
      <div className="cp-card-strip" />
      <div className="cp-card-body">

        <div className="cp-card-top">
          <div className="cp-icon-wrap">
            <IconComponent size={22} />
          </div>
          <span className="cp-level-pill">{level}</span>
        </div>

        <div className="cp-card-subtitle">{subtitle}</div>
        <h3 className="cp-card-title">{title}</h3>
        <p className="cp-card-desc">{description}</p>

        <div className="cp-card-footer">
          <span className="cp-card-stats">{stats}</span>
          <span className="cp-card-cta">
            Explorer <ArrowRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;