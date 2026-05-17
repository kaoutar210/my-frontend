import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Globe, Smartphone, Database, Palette,
  ChevronRight, Loader2, HelpCircle
} from 'lucide-react';
import Sidebar from "../../components/layout/SidebarStudent";
import API from "../../services/api";

const ICON_MAP = { Globe, Smartphone, Database, Palette };

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

  @keyframes qi-spin { to { transform: rotate(360deg); } }
  .qi-spin { animation: qi-spin 1s linear infinite; }

  /* ── root ── */
  .qi-root { font-family: 'DM Sans', sans-serif; color: var(--ink); }

  /* ── shell ── */
  .qi-shell {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
  }

  /* ── main ── */
  .qi-main {
    flex: 1;
    min-width: 0;
    overflow-y: auto;

    margin-left: 240px;
    height: calc(100vh - 52px);
  }

  /* ════════════════════════════════════════
     HEADER
  ════════════════════════════════════════ */
  .qi-header {
    padding: 36px 20px 28px;
  }

  /* header inner: stacks on mobile, row on tablet+ */
  .qi-header-inner {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  /* ── eyebrow ── */
  .qi-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 10px;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--blue);
    margin-bottom: 12px;
    display: block;
  }

  /* ── title ── */
  .qi-title {
    font-family: 'Playfair Display', serif;
    font-weight: 800;
    font-size: clamp(1.8rem, 5vw, 3rem);
    color: var(--ink);
    line-height: 1.1;
    letter-spacing: -.02em;
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin: 0;
  }
  .qi-title em { font-style: normal; color: var(--orange); }

  /* ── divider ── */
  .qi-divider {
    height: 3px;
    width: 56px;
    border-radius: 3px;
    border: none;
    background: linear-gradient(90deg, var(--blue), var(--orange));
    margin: 14px 0 18px;
  }

  /* ── subtitle ── */
  .qi-sub {
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    font-size: 15px;
    color: var(--muted);
    max-width: 480px;
    line-height: 1.75;
    margin: 0;
  }

  /* ── search ── */
  .qi-search-wrap {
    position: relative;
    width: 100%;
    flex-shrink: 0;
  }
  .qi-search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--border);
    transition: color .2s;
    pointer-events: none;
  }
  .qi-search-wrap:focus-within .qi-search-icon { color: var(--blue); }
  .qi-search {
    width: 100%;
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 14px;
    padding: 12px 18px 12px 46px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: var(--ink);
    outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .qi-search::placeholder { color: var(--border); }
  .qi-search:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 4px rgba(23,84,190,.08);
  }

  /* ════════════════════════════════════════
     CONTENT
  ════════════════════════════════════════ */
  .qi-content {
    padding: 0 20px 60px;
  }

  /* ── loader ── */
  .qi-loader {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 260px;
  }

  /* ── grid ── */
  .qi-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  /* ── card ── */
  .qi-card {
    position: relative;
    overflow: hidden;
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 22px;
    padding: 28px 24px;
    cursor: pointer;
    transition: box-shadow .3s, border-color .3s, transform .25s;
  }
  .qi-card:hover {
    box-shadow: 0 24px 56px rgba(23,84,190,.11);
    border-color: rgba(23,84,190,.22);
    transform: translateY(-4px);
  }
  .qi-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--blue), var(--orange));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform .35s cubic-bezier(.4,0,.2,1);
  }
  .qi-card:hover::after { transform: scaleX(1); }

  /* decorative orb */
  .qi-card-orb {
    position: absolute;
    right: -32px; top: -32px;
    width: 120px; height: 120px;
    border-radius: 50%;
    opacity: .045;
    transition: transform .6s;
    pointer-events: none;
  }
  .qi-card:hover .qi-card-orb { transform: scale(1.6); }

  /* top row */
  .qi-card-top {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 22px;
    position: relative;
    z-index: 1;
    gap: 12px;
  }

  /* icon box */
  .qi-icon-box {
    width: 48px; height: 48px;
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    background: var(--bg);
    border: 1.5px solid var(--border);
    flex-shrink: 0;
    transition: background .25s, border-color .25s;
  }
  .qi-card:hover .qi-icon-box {
    background: rgba(23,84,190,.08);
    border-color: rgba(23,84,190,.2);
  }

  /* question count pill */
  .qi-count {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 9px;
    letter-spacing: .14em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 999px;
    background: var(--bg);
    color: var(--muted);
    border: 1px solid var(--border);
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* card title */
  .qi-card-title {
    font-family: 'Playfair Display', serif;
    font-weight: 800;
    font-size: 1.4rem;
    color: var(--ink);
    letter-spacing: -.01em;
    margin: 0 0 22px;
    position: relative;
    z-index: 1;
    transition: color .2s;
    line-height: 1.2;
  }
  .qi-card:hover .qi-card-title { color: var(--blue); }

  /* footer */
  .qi-card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-top: 18px;
    border-top: 1px solid var(--border);
    position: relative;
    z-index: 1;
    gap: 12px;
  }
  .qi-score-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 500;
    font-size: 9px;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--muted);
    margin-bottom: 3px;
    display: block;
  }
  .qi-score-val {
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 13px;
    color: var(--muted);
  }

  /* CTA button */
  .qi-cta {
    width: 42px; height: 42px;
    border-radius: 13px;
    border: none;
    display: flex; align-items: center; justify-content: center;
    background: var(--ink);
    color: var(--white);
    cursor: pointer;
    flex-shrink: 0;
    transition: background .2s, transform .2s;
    box-shadow: 0 4px 14px rgba(13,27,62,.2);
  }
  .qi-card:hover .qi-cta { background: var(--orange); transform: translateX(3px); }

  /* empty state */
  .qi-empty {
    background: var(--white);
    border: 1.5px dashed var(--border);
    border-radius: 22px;
    padding: 60px 24px;
    text-align: center;
    grid-column: 1 / -1;
  }
  .qi-empty p { font-weight: 500; color: var(--muted); margin: 0; }

  /* ════════════════════════════════════════
     RESPONSIVE BREAKPOINTS
  ════════════════════════════════════════ */

  /* Tablet: 600px+ */
  @media (min-width: 600px) {
    .qi-header {
      padding: 48px 32px 32px;
    }
    .qi-content {
      padding: 0 32px 72px;
    }
    .qi-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 22px;
    }
    .qi-card {
      border-radius: 24px;
      padding: 32px;
    }
    .qi-card-title {
      font-size: 1.5rem;
    }
    .qi-empty {
      padding: 72px 40px;
      border-radius: 24px;
    }
  }

  /* Tablet landscape / small desktop: 900px+ */
  @media (min-width: 900px) {
    .qi-header-inner {
      flex-direction: row;
      justify-content: space-between;
      align-items: flex-start;
    }
    .qi-search-wrap {
      width: 320px;
      margin-top: 8px;
    }
  }

  /* Desktop: 1024px+ */
  @media (min-width: 1024px) {
    .qi-header {
      padding: 64px 48px 40px;
    }
    .qi-content {
      padding: 0 48px 80px;
    }
    .qi-grid {
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 24px;
    }
    .qi-card {
      border-radius: 28px;
      padding: 36px;
    }
    .qi-card-title {
      font-size: 1.6rem;
      margin-bottom: 28px;
    }
    .qi-search-wrap {
      width: 360px;
    }
  }

  /* Large desktop: 1440px+ */
  @media (min-width: 1440px) {
    .qi-grid {
      grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
    }
  }

  /* Touch: remove hover transforms */
  @media (hover: none) {
    .qi-card:hover {
      transform: none;
      box-shadow: none;
      border-color: var(--border);
    }
    .qi-card:active {
      transform: scale(0.98);
      box-shadow: 0 8px 24px rgba(23,84,190,.1);
    }
    .qi-card:hover .qi-cta {
      background: var(--ink);
      transform: none;
    }
  }
`;

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
const QCMIndexPage = () => {
  const navigate = useNavigate();
  const [languages, setLanguages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchQuizLanguages = async () => {
      try {
        const response = await API.get('/student/qcm/languages');
        setLanguages(response.data);
      } catch (err) {
        console.error("Erreur chargement QCM:", err);
        setLanguages([]);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizLanguages();
  }, []);

  const filteredLanguages = languages.filter(lang =>
    lang?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>{style}</style>

      <div className="qi-root qi-shell">
        <Sidebar
          brandName="CodeLink"
          onLogout={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        />

        <main className="qi-main">

          {/* ── HEADER ── */}
          <header className="qi-header">
            <div className="qi-header-inner">

              {/* left: text block */}
              <div>
                <span className="qi-eyebrow">Évaluation des compétences</span>
                <h1 className="qi-title">
                  Centre de <em>Quiz</em>
                  <HelpCircle
                    size={26}
                    style={{ color: "var(--orange)", fill: "none", flexShrink: 0 }}
                  />
                </h1>
                <hr className="qi-divider" />
                <p className="qi-sub">
                  Sélectionnez un langage pour tester et valider vos connaissances.
                </p>
              </div>

              {/* right: search */}
              <div className="qi-search-wrap">
                <Search size={17} className="qi-search-icon" />
                <input
                  type="text"
                  placeholder="Rechercher un langage…"
                  className="qi-search"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>

            </div>
          </header>

          {/* ── CONTENT ── */}
          <div className="qi-content">
            {loading ? (
              <div className="qi-loader">
                <Loader2 size={40} style={{ color: "var(--blue)" }} className="qi-spin" />
              </div>
            ) : (
              <div className="qi-grid">
                {filteredLanguages.length > 0 ? (
                  filteredLanguages.map(lang => (
                    <QuizLanguageCard
                      key={lang.id}
                      {...lang}
                      onClick={() => navigate(`/student/qcm/${lang.id}`)}
                    />
                  ))
                ) : (
                  <div className="qi-empty">
                    <p>Aucun langage trouvé pour « {searchQuery} ».</p>
                  </div>
                )}
              </div>
            )}
          </div>

        </main>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   QUIZ LANGUAGE CARD
───────────────────────────────────────────── */
const QuizLanguageCard = ({ title, count = 0, icon_name, color = "#1754be", onClick }) => {
  const IconComponent = ICON_MAP[icon_name] || Globe;
  const iconColor = color.startsWith("#") || color.startsWith("rgb") ? color : "var(--blue)";

  return (
    <div className="qi-card" onClick={onClick}>

      {/* decorative orb */}
      <div className="qi-card-orb" style={{ background: iconColor }} />

      {/* top row */}
      <div className="qi-card-top">
        <div className="qi-icon-box">
          <IconComponent size={22} style={{ color: iconColor }} />
        </div>
        <span className="qi-count">{count} Questions</span>
      </div>

      {/* title */}
      <h3 className="qi-card-title">{title}</h3>

      {/* footer */}
      <div className="qi-card-footer">
        <div>
          <span className="qi-score-label">Dernier score</span>
          <span className="qi-score-val">N/A</span>
        </div>
        <button className="qi-cta" aria-label={`Commencer le quiz ${title}`}>
          <ChevronRight size={18} />
        </button>
      </div>

    </div>
  );
};

export default QCMIndexPage;