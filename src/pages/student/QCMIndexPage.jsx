import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search, Globe, Smartphone, Database, Palette,
  ChevronRight, Sparkles, Loader2, HelpCircle
} from 'lucide-react';
import Sidebar from "../../components/layout/SidebarStudent";
import API from "../../services/api";

const ICON_MAP = { Globe, Smartphone, Database, Palette };

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
  .qi-root { font-family: 'DM Sans', sans-serif; color: var(--ink); }

  /* ── eyebrow ── */
  .qi-eyebrow {
    font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 10px;
    letter-spacing: .18em; text-transform: uppercase; color: var(--blue);
    margin-bottom: 14px; display: block;
  }

  /* ── title ── */
  .qi-title {
    font-family: 'Playfair Display', serif; font-weight: 800;
    font-size: clamp(2rem, 4vw, 3rem); color: var(--ink);
    line-height: 1.1; letter-spacing: -.02em;
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
  }
  .qi-title em { font-style: normal; color: var(--orange); }

  /* ── divider ── */
  .qi-divider {
    height: 3px; width: 56px; border-radius: 3px; border: none;
    background: linear-gradient(90deg, var(--blue), var(--orange));
    margin: 16px 0 20px;
  }

  /* ── subtitle ── */
  .qi-sub {
    font-family: 'DM Sans', sans-serif; font-weight: 300; font-size: 15px;
    color: var(--muted); max-width: 480px; line-height: 1.75;
  }

  /* ── search ── */
  .qi-search-wrap {
    position: relative; width: 360px; flex-shrink: 0;
  }
  .qi-search-icon {
    position: absolute; left: 18px; top: 50%; transform: translateY(-50%);
    color: var(--border); transition: color .2s; pointer-events: none;
  }
  .qi-search-wrap:focus-within .qi-search-icon { color: var(--blue); }
  .qi-search {
    width: 100%; background: var(--white);
    border: 1.5px solid var(--border); border-radius: 14px;
    padding: 13px 20px 13px 50px;
    font-family: 'DM Sans', sans-serif; font-weight: 400; font-size: 14px;
    color: var(--ink); outline: none;
    transition: border-color .2s, box-shadow .2s;
  }
  .qi-search::placeholder { color: var(--border); }
  .qi-search:focus {
    border-color: var(--blue);
    box-shadow: 0 0 0 4px rgba(23,84,190,.08);
  }

  /* ── loader ── */
  .qi-loader {
    display: flex; align-items: center; justify-content: center; height: 260px;
  }
  @keyframes qi-spin { to { transform: rotate(360deg); } }
  .qi-spin { animation: qi-spin 1s linear infinite; }

  /* ── grid ── */
  .qi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 24px;
  }

  /* ── card ── */
  .qi-card {
    position: relative; overflow: hidden;
    background: var(--white);
    border: 1.5px solid var(--border); border-radius: 28px;
    padding: 36px; cursor: pointer;
    transition: box-shadow .3s, border-color .3s, transform .25s;
  }
  .qi-card:hover {
    box-shadow: 0 24px 56px rgba(23,84,190,.11);
    border-color: rgba(23,84,190,.22);
    transform: translateY(-4px);
  }
  /* gradient bar */
  .qi-card::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--blue), var(--orange));
    transform: scaleX(0); transform-origin: left;
    transition: transform .35s cubic-bezier(.4,0,.2,1);
  }
  .qi-card:hover::after { transform: scaleX(1); }

  /* decorative circle */
  .qi-card-orb {
    position: absolute; right: -32px; top: -32px;
    width: 120px; height: 120px; border-radius: 50%;
    opacity: .045; transition: transform .6s;
    pointer-events: none;
  }
  .qi-card:hover .qi-card-orb { transform: scale(1.6); }

  /* top row */
  .qi-card-top {
    display: flex; justify-content: space-between; align-items: flex-start;
    margin-bottom: 28px; position: relative; z-index: 1;
  }

  /* icon box */
  .qi-icon-box {
    width: 52px; height: 52px; border-radius: 16px;
    display: flex; align-items: center; justify-content: center;
    background: var(--bg); border: 1.5px solid var(--border);
    transition: background .25s, border-color .25s;
  }
  .qi-card:hover .qi-icon-box {
    background: rgba(23,84,190,.08); border-color: rgba(23,84,190,.2);
  }

  /* question count pill */
  .qi-count {
    font-family: 'JetBrains Mono', monospace; font-weight: 700; font-size: 9px;
    letter-spacing: .14em; text-transform: uppercase;
    padding: 5px 14px; border-radius: 999px;
    background: var(--bg); color: var(--muted); border: 1px solid var(--border);
  }

  /* title */
  .qi-card-title {
    font-family: 'Playfair Display', serif; font-weight: 800;
    font-size: 1.6rem; color: var(--ink); letter-spacing: -.01em;
    margin-bottom: 28px; position: relative; z-index: 1;
    transition: color .2s;
  }
  .qi-card:hover .qi-card-title { color: var(--blue); }

  /* footer */
  .qi-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding-top: 20px; border-top: 1px solid var(--border);
    position: relative; z-index: 1;
  }
  .qi-score-label {
    font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 9px;
    letter-spacing: .14em; text-transform: uppercase; color: var(--border);
    margin-bottom: 4px; display: block;
  }
  .qi-score-val {
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px;
    color: var(--muted);
  }

  /* CTA button */
  .qi-cta {
    width: 44px; height: 44px; border-radius: 14px; border: none;
    display: flex; align-items: center; justify-content: center;
    background: var(--ink); color: var(--white); cursor: pointer;
    transition: background .2s, transform .2s;
    box-shadow: 0 4px 14px rgba(13,27,62,.2);
  }
  .qi-card:hover .qi-cta { background: var(--orange); transform: translateX(3px); }

  /* empty state */
  .qi-empty {
    background: var(--white); border: 1.5px dashed var(--border);
    border-radius: 28px; padding: 80px 40px; text-align: center;
    grid-column: 1 / -1;
  }
  .qi-empty p { font-weight: 500; color: var(--muted); }
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

      <div
        className="qi-root"
        style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
      >
        <Sidebar
          brandName="CodeLink"
          onLogout={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        />

        <main style={{ flex: 1, overflowY: "auto" }}>

          {/* ── HEADER ── */}
          <header style={{ padding: "64px 48px 40px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 24, flexWrap: "wrap" }}>

              {/* left */}
              <div>
                <span className="qi-eyebrow">Évaluation des compétences</span>
                <h1 className="qi-title">
                  Centre de <em>Quiz</em>
                  <HelpCircle
                    size={28}
                    style={{ color: "var(--orange)", fill: "none", flexShrink: 0 }}
                  />
                </h1>
                <hr className="qi-divider" />
                <p className="qi-sub">
                  Sélectionnez un langage pour tester et valider vos connaissances.
                </p>
              </div>

              {/* search */}
              <div className="qi-search-wrap" style={{ marginTop: 8 }}>
                <Search size={18} className="qi-search-icon" />
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
          <div style={{ padding: "0 48px 80px" }}>
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

  /* resolve a hex/css color to use as icon tint */
  const iconColor = color.startsWith("#") || color.startsWith("rgb")
    ? color
    : "var(--blue)";

  return (
    <div className="qi-card" onClick={onClick}>

      {/* decorative orb */}
      <div
        className="qi-card-orb"
        style={{ background: iconColor }}
      />

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
        <button className="qi-cta">
          <ChevronRight size={18} />
        </button>
      </div>

    </div>
  );
};

export default QCMIndexPage;