import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  Layout,
} from "lucide-react";

import Sidebar from "../../components/layout/SidebarStudent";
import API from "../../services/api";

/* ─────────────────────────────────────────────
   DESIGN TOKENS + RESPONSIVE STYLES
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

  /* ── loader spin ── */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to   { transform: rotate(360deg); }
  }

  /* ── base ── */
  .lp-root {
    font-family: 'DM Sans', sans-serif;
    color: var(--ink);
  }

  /* ── layout shell ── */
  .lp-shell {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
    position: relative;
  }

  /* ── main content ── */
  .lp-main {
    flex: 1;
    overflow-y: auto;
    min-width: 0;
  }

  /* ── back button ── */
  .lp-back {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 13px;
    color: var(--blue);
    text-decoration: none;
    cursor: pointer;
    letter-spacing: .02em;
    transition: gap .2s;
    background: none;
    border: none;
    padding: 0;
  }
  .lp-back:hover { gap: 14px; }
  .lp-back svg { transition: transform .2s; }
  .lp-back:hover svg { transform: translateX(-3px); }

  /* ── pill badge ── */
  .lp-pill {
    display: inline-flex;
    align-items: center;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 500;
    font-size: 10px;
    letter-spacing: .12em;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 999px;
    border: 1.5px solid var(--blue);
    color: var(--blue);
    background: rgba(23,84,190,.06);
  }

  /* ── page title ── */
  .lp-title {
    font-family: 'Playfair Display', serif;
    font-weight: 800;
    font-size: clamp(1.8rem, 5vw, 3.4rem);
    color: var(--ink);
    line-height: 1.1;
    letter-spacing: -.02em;
    margin: 0;
  }
  .lp-title span { color: var(--orange); }

  /* ── subtitle ── */
  .lp-sub {
    font-family: 'DM Sans', sans-serif;
    font-weight: 300;
    font-size: 1rem;
    color: var(--muted);
    max-width: 520px;
    line-height: 1.7;
    margin: 0;
  }

  /* ── divider ── */
  .lp-divider {
    height: 2px;
    border: none;
    background: linear-gradient(90deg, var(--blue) 0%, var(--orange) 100%);
    border-radius: 2px;
    margin: 24px 0;
    max-width: 80px;
  }

  /* ── header ── */
  .lp-header {
    padding: 40px 20px 28px;
  }

  /* ── content wrapper ── */
  .lp-content {
    padding: 0 20px 60px;
  }

  /* ── loader ── */
  .lp-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 260px;
    gap: 16px;
  }
  .lp-loader p {
    font-weight: 500;
    color: var(--muted);
    font-size: 14px;
  }

  /* ── empty state ── */
  .lp-empty {
    background: var(--white);
    border: 1.5px dashed var(--border);
    border-radius: 24px;
    padding: 60px 24px;
    text-align: center;
  }
  .lp-empty p {
    font-weight: 500;
    color: var(--muted);
    margin: 0;
  }

  /* ── grid ── */
  .lp-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
  }

  /* ── card ── */
  .lp-card {
    position: relative;
    overflow: hidden;
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 24px;
    cursor: pointer;
    transition: box-shadow .3s, border-color .3s, transform .25s;
  }
  .lp-card:hover {
    box-shadow: 0 20px 48px rgba(23,84,190,.12);
    border-color: rgba(23,84,190,.25);
    transform: translateY(-4px);
  }
  .lp-card::after {
    content: '';
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--blue), var(--orange));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform .35s cubic-bezier(.4,0,.2,1);
  }
  .lp-card:hover::after { transform: scaleX(1); }

  /* card icon */
  .lp-icon {
    width: 44px;
    height: 44px;
    border-radius: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(23,84,190,.08);
    transition: background .25s;
    flex-shrink: 0;
  }
  .lp-card:hover .lp-icon { background: var(--blue); }
  .lp-icon svg { color: var(--blue); transition: color .25s; }
  .lp-card:hover .lp-icon svg { color: var(--white); }

  /* level badge */
  .lp-level {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 500;
    font-size: 10px;
    letter-spacing: .1em;
    text-transform: uppercase;
    padding: 4px 12px;
    border-radius: 999px;
    background: var(--bg);
    color: var(--muted);
    border: 1px solid var(--border);
    white-space: nowrap;
  }

  /* card title */
  .lp-card-title {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 1.2rem;
    color: var(--ink);
    line-height: 1.2;
    transition: color .25s;
    margin: 0 0 8px;
  }
  .lp-card:hover .lp-card-title { color: var(--blue); }

  /* card description */
  .lp-card-desc {
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: var(--muted);
    line-height: 1.65;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    margin: 0;
  }

  /* card footer */
  .lp-card-footer {
    margin-top: 24px;
    padding-top: 16px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }
  .lp-card-meta {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 400;
    color: var(--muted);
  }
  .lp-card-cta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 13px;
    color: var(--ink);
    white-space: nowrap;
    transition: gap .2s, color .2s;
  }
  .lp-card:hover .lp-card-cta { gap: 10px; color: var(--orange); }
  .lp-card-cta svg { color: var(--orange); }

  /* ─── RESPONSIVE BREAKPOINTS ─── */

  /* Tablet: 600px+ */
  @media (min-width: 600px) {
    .lp-header {
      padding: 48px 32px 32px;
    }
    .lp-content {
      padding: 0 32px 72px;
    }
    .lp-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 24px;
    }
    .lp-card {
      border-radius: 22px;
      padding: 28px;
    }
    .lp-card-title {
      font-size: 1.25rem;
    }
    .lp-empty {
      padding: 72px 32px;
    }
  }

  /* Desktop: 1024px+ */
  @media (min-width: 1024px) {
    .lp-header {
      padding: 64px 48px 40px;
    }
    .lp-content {
      padding: 0 48px 80px;
    }
    .lp-grid {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 28px;
    }
    .lp-card {
      border-radius: 24px;
      padding: 32px;
    }
    .lp-card-title {
      font-size: 1.35rem;
    }
  }

  /* Large desktop: 1440px+ */
  @media (min-width: 1440px) {
    .lp-grid {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }
  }

  /* Touch: remove hover transforms on coarse pointers */
  @media (hover: none) {
    .lp-card:hover {
      transform: none;
      box-shadow: none;
      border-color: var(--border);
    }
    .lp-card:active {
      transform: scale(0.98);
      box-shadow: 0 8px 24px rgba(23,84,190,.1);
    }
  }
`;

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
const LanguagePage = () => {
  const { languageId } = useParams();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/courses/category/${languageId}`);
        setCourses(res.data.courses || []);
      } catch (err) {
        console.error("Erreur lors du chargement des cours:", err);
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [languageId]);

  return (
    <>
      <style>{style}</style>

      <div className="lp-root lp-shell">
        {/* Sidebar */}
        <Sidebar
          brandName="CodeLink"
          onLogout={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        />

        {/* MAIN */}
        <main className="lp-main">

          {/* ── HEADER ── */}
          <header className="lp-header">
            <button
              className="lp-back"
              onClick={() => navigate("/student/courses")}
              style={{ marginBottom: 24 }}
            >
              <ArrowLeft size={16} />
              Retour au catalogue
            </button>

            <span
              className="lp-pill"
              style={{ marginBottom: 16, display: "inline-flex" }}
            >
              Parcours {languageId}
            </span>

            <h1 className="lp-title" style={{ marginTop: 12, marginBottom: 10 }}>
              Modules
            </h1>

            <hr className="lp-divider" />

            <p className="lp-sub">Progressez étape par étape</p>
          </header>

          {/* ── CONTENT ── */}
          <div className="lp-content">
            {loading ? (
              <div className="lp-loader">
                <Loader2
                  size={44}
                  style={{
                    color: "var(--blue)",
                    animation: "spin 1s linear infinite",
                  }}
                />
                <p>Chargement des cours…</p>
              </div>
            ) : courses.length > 0 ? (
              <div className="lp-grid">
                {courses.map((course) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    onClick={() =>
                      navigate(`/student/language/${languageId}/details`, {
                        state: { courseId: course.id },
                      })
                    }
                  />
                ))}
              </div>
            ) : (
              <div className="lp-empty">
                <Layout
                  size={44}
                  style={{ color: "var(--border)", marginBottom: 16 }}
                />
                <p>Aucun cours disponible pour cette catégorie.</p>
              </div>
            )}
          </div>

        </main>
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────
   COURSE CARD
───────────────────────────────────────────── */
const CourseCard = ({ course, onClick }) => (
  <div className="lp-card" onClick={onClick}>

    {/* top row */}
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        gap: 12,
      }}
    >
      <div className="lp-icon">
        <BookOpen size={20} />
      </div>
      <span className="lp-level">{course.level || "Tous niveaux"}</span>
    </div>

    {/* title */}
    <h3 className="lp-card-title">{course.title}</h3>

    {/* description */}
    <p className="lp-card-desc">{course.description}</p>

    {/* footer */}
    <div className="lp-card-footer">
      <span className="lp-card-meta">{course.file_size || "N/A"}</span>
      <span className="lp-card-cta">
        Commencer <ChevronRight size={16} />
      </span>
    </div>

  </div>
);

export default LanguagePage;