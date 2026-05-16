import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Loader2,
  BookOpen,
  ChevronRight,
  ArrowLeft,
  Layout,
  Sparkles
} from "lucide-react";

import Sidebar from "../../components/layout/SidebarStudent";
import API from "../../services/api";

/* ─────────────────────────────────────────────
   DESIGN TOKENS  (inline so the file is self-contained)
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

  /* reset box */
  *, *::before, *::after { box-sizing: border-box; }

  /* fonts */
  .lp-root { font-family: 'DM Sans', sans-serif; color: var(--ink); }
  .lp-serif { font-family: 'Playfair Display', serif; }

  /* ── back button ── */
  .lp-back {
    display: inline-flex; align-items: center; gap: 8px;
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px;
    color: var(--blue); text-decoration: none; cursor: pointer;
    letter-spacing: .02em; transition: gap .2s;
  }
  .lp-back:hover { gap: 14px; }
  .lp-back svg { transition: transform .2s; }
  .lp-back:hover svg { transform: translateX(-3px); }

  /* ── pill badge ── */
  .lp-pill {
    display: inline-flex; align-items: center;
    font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 10px;
    letter-spacing: .12em; text-transform: uppercase;
    padding: 5px 14px; border-radius: 999px;
    border: 1.5px solid var(--blue); color: var(--blue);
    background: rgba(23,84,190,.06);
  }

  /* ── page title ── */
  .lp-title {
    font-family: 'Playfair Display', serif;
    font-weight: 800; font-size: clamp(2.2rem, 5vw, 3.4rem);
    color: var(--ink); line-height: 1.1; letter-spacing: -.02em;
  }
  .lp-title span { color: var(--orange); }

  /* ── subtitle ── */
  .lp-sub {
    font-family: 'DM Sans', sans-serif; font-weight: 300;
    font-size: 1rem; color: var(--muted); max-width: 520px; line-height: 1.7;
  }

  /* ── divider ── */
  .lp-divider {
    height: 2px; border: none;
    background: linear-gradient(90deg, var(--blue) 0%, var(--orange) 100%);
    border-radius: 2px; margin: 28px 0; max-width: 80px;
  }

  /* ── loader ── */
  .lp-loader { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 260px; gap: 16px; }
  .lp-loader p { font-weight: 500; color: var(--muted); font-size: 14px; }

  /* ── empty ── */
  .lp-empty {
    background: var(--white); border: 1.5px dashed var(--border);
    border-radius: 28px; padding: 80px 40px; text-align: center;
  }
  .lp-empty svg { color: var(--border); margin-bottom: 16px; }
  .lp-empty p { font-weight: 500; color: var(--muted); }

  /* ── grid ── */
  .lp-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 28px;
  }

  /* ── card ── */
  .lp-card {
    position: relative; overflow: hidden;
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 24px;
    padding: 32px;
    cursor: pointer;
    transition: box-shadow .3s, border-color .3s, transform .25s;
  }
  .lp-card:hover {
    box-shadow: 0 20px 48px rgba(23,84,190,.12);
    border-color: rgba(23,84,190,.25);
    transform: translateY(-4px);
  }

  /* animated gradient bar at bottom of card */
  .lp-card::after {
    content: ''; position: absolute; bottom: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--blue), var(--orange));
    transform: scaleX(0); transform-origin: left;
    transition: transform .35s cubic-bezier(.4,0,.2,1);
  }
  .lp-card:hover::after { transform: scaleX(1); }

  /* card icon wrapper */
  .lp-icon {
    width: 44px; height: 44px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    background: rgba(23,84,190,.08);
    transition: background .25s;
  }
  .lp-card:hover .lp-icon { background: var(--blue); }
  .lp-icon svg { color: var(--blue); transition: color .25s; }
  .lp-card:hover .lp-icon svg { color: var(--white); }

  /* level badge */
  .lp-level {
    font-family: 'JetBrains Mono', monospace; font-weight: 500; font-size: 10px;
    letter-spacing: .1em; text-transform: uppercase;
    padding: 4px 12px; border-radius: 999px;
    background: var(--bg); color: var(--muted);
    border: 1px solid var(--border);
  }

  /* card title */
  .lp-card-title {
    font-family: 'Playfair Display', serif;
    font-weight: 700; font-size: 1.35rem;
    color: var(--ink); line-height: 1.2;
    transition: color .25s;
  }
  .lp-card:hover .lp-card-title { color: var(--blue); }

  /* card description */
  .lp-card-desc {
    font-family: 'DM Sans', sans-serif; font-weight: 400; font-size: 14px;
    color: var(--muted); line-height: 1.65;
    display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* card footer */
  .lp-card-footer {
    margin-top: 28px; padding-top: 20px;
    border-top: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
  }
  .lp-card-meta {
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    font-weight: 400; color: var(--border);
  }
  .lp-card-cta {
    display: flex; align-items: center; gap: 6px;
    font-family: 'DM Sans', sans-serif; font-weight: 600; font-size: 13px;
    color: var(--ink);
    transition: gap .2s, color .2s;
  }
  .lp-card:hover .lp-card-cta { gap: 10px; color: var(--orange); }
  .lp-card-cta svg { color: var(--orange); }
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
      {/* inject scoped styles */}
      <style>{style}</style>

      <div
        className="lp-root"
        style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}
      >
        {/* Sidebar */}
        <Sidebar
          brandName="CodeLink"
          onLogout={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}
        />

        {/* MAIN */}
        <main style={{ flex: 1, overflowY: "auto" }}>

          {/* ── HEADER ── */}
          <header style={{ padding: "64px 48px 40px" }}>

            <button
              className="lp-back"
              onClick={() => navigate("/student/courses")}
              style={{ marginBottom: 28 }}
            >
              <ArrowLeft size={16} />
              Retour au catalogue
            </button>

            <span className="lp-pill" style={{ marginBottom: 20, display: "inline-flex" }}>
              Parcours {languageId}
            </span>

            <h1 className="lp-title" style={{ marginTop: 14, marginBottom: 12 }}>
              Modules{" "}
              
            </h1>

            <hr className="lp-divider" />

            <p className="lp-sub">
              Progressez étape par étape
            </p>

          </header>

          {/* ── CONTENT ── */}
          <div style={{ padding: "0 48px 80px" }}>

            {loading ? (
              <div className="lp-loader">
                <Loader2
                  size={44}
                  style={{ color: "var(--blue)", animation: "spin 1s linear infinite" }}
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
                <Layout size={44} style={{ color: "var(--border)", marginBottom: 16 }} />
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
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
      <div className="lp-icon">
        <BookOpen size={20} />
      </div>
      <span className="lp-level">{course.level || "Tous niveaux"}</span>
    </div>

    {/* title */}
    <h3 className="lp-card-title" style={{ marginBottom: 10 }}>
      {course.title}
    </h3>

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