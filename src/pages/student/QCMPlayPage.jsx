import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Timer, ChevronRight, CheckCircle2,
  Loader2, Code, AlertCircle
} from 'lucide-react';
import Sidebar from "../../components/layout/SidebarStudent";
import API from "../../services/api";

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

  @keyframes qp-spin { to { transform: rotate(360deg); } }
  .qp-spin { animation: qp-spin 1s linear infinite; }

  /* ── root ── */
  .qp-root { font-family: 'DM Sans', sans-serif; color: var(--ink); }

  /* ── shell ── */
  .qp-shell {
    display: flex;
    min-height: 100vh;
    background: var(--bg);
  }

  /* ── main ── */
  .qp-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    margin-left: 240px;
    height: calc(100vh - 52px);
  }

  /* ── full-screen states ── */
  .qp-center {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: var(--bg);
    flex-direction: column;
    gap: 12px;
    padding: 20px;
    text-align: center;
  }
  .qp-center p { font-weight: 500; color: var(--muted); font-size: 15px; margin: 0; }

  /* ════════════════════════════════════════
     TOP HEADER BAR
  ════════════════════════════════════════ */
  .qp-header {
    min-height: 56px;
    background: var(--white);
    border-bottom: 1.5px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px 16px;
    flex-shrink: 0;
    gap: 12px;
    flex-wrap: wrap;
  }

  .qp-quiz-title {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: 1rem;
    color: var(--ink);
    letter-spacing: -.01em;
    /* truncate long titles on small screens */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }

  .qp-quiz-progress-label {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 500;
    font-size: 10px;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--muted);
    margin-top: 3px;
  }

  .qp-timer {
    display: flex;
    align-items: center;
    gap: 7px;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 12px;
    color: var(--orange);
    padding: 7px 14px;
    border-radius: 999px;
    background: rgba(229,82,45,.08);
    border: 1px solid rgba(229,82,45,.2);
    white-space: nowrap;
    flex-shrink: 0;
  }

  /* ── progress bar ── */
  .qp-progress-track {
    height: 3px;
    background: var(--border);
    flex-shrink: 0;
  }
  .qp-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--blue), var(--orange));
    border-radius: 0 2px 2px 0;
    transition: width .5s cubic-bezier(.4,0,.2,1);
  }

  /* ── step indicators ── */
  .qp-steps {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 14px 16px 0;
    overflow-x: auto;
    scrollbar-width: none;
    -webkit-overflow-scrolling: touch;
  }
  .qp-steps::-webkit-scrollbar { display: none; }

  .qp-step {
    height: 4px;
    border-radius: 4px;
    flex-shrink: 0;
    transition: background .3s, width .3s;
    min-width: 16px;
  }
  .qp-step-done    { background: var(--blue);   width: 16px; }
  .qp-step-current { background: var(--orange); width: 28px; }
  .qp-step-todo    { background: var(--border); width: 16px; }

  /* ════════════════════════════════════════
     MAIN CONTENT AREA
  ════════════════════════════════════════ */
  .qp-content {
    flex: 1;
    padding: 20px 12px 32px;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
  }

  /* ── question card ── */
  .qp-card {
    width: 100%;
    max-width: 780px;
    background: var(--white);
    border: 1.5px solid var(--border);
    border-radius: 20px;
    padding: 24px 20px;
    box-shadow: 0 8px 32px rgba(13,27,62,.06);
  }

  /* level pill */
  .qp-level-pill {
    display: inline-flex;
    align-items: center;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 9px;
    letter-spacing: .16em;
    text-transform: uppercase;
    padding: 5px 12px;
    border-radius: 999px;
    background: rgba(23,84,190,.08);
    color: var(--blue);
    border: 1px solid rgba(23,84,190,.18);
    margin-bottom: 18px;
  }

  /* question text */
  .qp-question {
    font-family: 'Playfair Display', serif;
    font-weight: 700;
    font-size: clamp(1.1rem, 3vw, 1.6rem);
    color: var(--ink);
    line-height: 1.4;
    margin: 0 0 24px;
    letter-spacing: -.01em;
  }

  /* code block */
  .qp-code-block {
    background: var(--ink);
    border-radius: 12px;
    padding: 20px 18px;
    margin-bottom: 28px;
    position: relative;
    border: 1px solid rgba(255,255,255,.06);
    overflow-x: auto;
  }
  .qp-code-label {
    position: absolute;
    top: 12px; right: 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    font-weight: 500;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--muted);
    display: flex;
    align-items: center;
    gap: 5px;
  }
  .qp-code-block pre {
    font-family: 'JetBrains Mono', monospace;
    font-size: 12px;
    font-weight: 400;
    color: #f4a261;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.7;
    margin: 0;
    padding-right: 56px; /* clear the CODE label */
  }

  /* options list */
  .qp-options {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-bottom: 28px;
  }

  /* single option */
  .qp-option {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 16px;
    border-radius: 14px;
    border: 1.5px solid var(--border);
    background: var(--white);
    cursor: pointer;
    transition: border-color .2s, background .2s, box-shadow .2s;
    -webkit-tap-highlight-color: transparent;
  }
  .qp-option:hover {
    border-color: rgba(23,84,190,.25);
    box-shadow: 0 4px 16px rgba(23,84,190,.07);
  }
  .qp-option.selected {
    border-color: var(--blue);
    background: rgba(23,84,190,.04);
    box-shadow: 0 4px 20px rgba(23,84,190,.1);
  }

  .qp-option-id {
    width: 34px; height: 34px;
    border-radius: 10px;
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-family: 'JetBrains Mono', monospace;
    font-weight: 700;
    font-size: 12px;
    background: var(--bg);
    color: var(--muted);
    border: 1px solid var(--border);
    transition: background .2s, color .2s, border-color .2s;
  }
  .qp-option.selected .qp-option-id {
    background: var(--blue);
    color: var(--white);
    border-color: var(--blue);
  }

  .qp-option-label {
    flex: 1;
    font-family: 'DM Sans', sans-serif;
    font-weight: 400;
    font-size: 14px;
    color: var(--muted);
    line-height: 1.5;
    transition: color .2s;
  }
  .qp-option.selected .qp-option-label { color: var(--ink); font-weight: 500; }

  .qp-option-check { color: var(--blue); flex-shrink: 0; }

  /* ── card footer ── */
  .qp-footer {
    padding-top: 22px;
    border-top: 1px solid var(--border);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    flex-wrap: wrap;
  }

  .qp-counter {
    font-family: 'JetBrains Mono', monospace;
    font-weight: 500;
    font-size: 11px;
    letter-spacing: .1em;
    color: var(--muted);
    text-transform: uppercase;
  }

  /* CTA button */
  .qp-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 600;
    font-size: 13px;
    padding: 12px 22px;
    border-radius: 12px;
    border: none;
    cursor: pointer;
    background: var(--blue);
    color: var(--white);
    box-shadow: 0 6px 20px rgba(23,84,190,.28);
    transition: background .2s, box-shadow .2s, gap .2s;
    white-space: nowrap;
    flex-shrink: 0;
  }
  .qp-btn:hover:not(:disabled) {
    background: var(--ink);
    box-shadow: 0 8px 24px rgba(13,27,62,.28);
    gap: 12px;
  }
  .qp-btn:disabled { opacity: .4; cursor: not-allowed; }
  .qp-btn.final {
    background: var(--orange);
    box-shadow: 0 6px 20px rgba(229,82,45,.28);
  }
  .qp-btn.final:hover:not(:disabled) { background: #c4401e; }

  /* ════════════════════════════════════════
     RESPONSIVE BREAKPOINTS
  ════════════════════════════════════════ */

  /* Tablet: 600px+ */
  @media (min-width: 600px) {
    .qp-header {
      min-height: 60px;
      padding: 0 24px;
      flex-wrap: nowrap;
    }
    .qp-quiz-title {
      font-size: 1.05rem;
      max-width: 300px;
    }
    .qp-steps {
      padding: 16px 24px 0;
      gap: 6px;
    }
    .qp-step-done    { width: 18px; }
    .qp-step-current { width: 30px; }
    .qp-step-todo    { width: 18px; }
    .qp-content {
      padding: 28px 24px 44px;
    }
    .qp-card {
      border-radius: 24px;
      padding: 36px 32px;
    }
    .qp-option {
      padding: 16px 18px;
      gap: 14px;
    }
    .qp-option-id {
      width: 36px; height: 36px;
    }
    .qp-option-label { font-size: 15px; }
    .qp-btn {
      font-size: 14px;
      padding: 13px 26px;
    }
    .qp-code-block {
      border-radius: 14px;
      padding: 22px 22px;
    }
    .qp-code-block pre { font-size: 13px; }
  }

  /* Desktop: 1024px+ */
  @media (min-width: 1024px) {
    .qp-header {
      height: 64px;
      padding: 0 40px;
    }
    .qp-quiz-title {
      font-size: 1.1rem;
      max-width: 420px;
    }
    .qp-timer {
      font-size: 13px;
      padding: 8px 18px;
      gap: 8px;
    }
    .qp-steps {
      padding: 16px 40px 0;
    }
    .qp-step-done    { width: 20px; }
    .qp-step-current { width: 32px; }
    .qp-step-todo    { width: 20px; }
    .qp-content {
      padding: 32px 40px 48px;
    }
    .qp-card {
      border-radius: 28px;
      padding: 48px;
    }
    .qp-level-pill { margin-bottom: 24px; }
    .qp-question { margin-bottom: 32px; }
    .qp-options {
      gap: 12px;
      margin-bottom: 36px;
    }
    .qp-option {
      padding: 18px 20px;
      gap: 16px;
      border-radius: 16px;
    }
    .qp-option-id {
      width: 38px; height: 38px;
      border-radius: 11px;
      font-size: 13px;
    }
    .qp-option-label { font-size: 15px; }
    .qp-footer { padding-top: 28px; }
    .qp-btn {
      font-size: 14px;
      padding: 14px 32px;
      border-radius: 14px;
      gap: 10px;
    }
    .qp-code-block {
      border-radius: 16px;
      padding: 24px 28px;
      margin-bottom: 36px;
    }
    .qp-code-block pre {
      font-size: 13px;
      padding-right: 60px;
    }
  }

  /* Touch: remove hover effects */
  @media (hover: none) {
    .qp-option:hover {
      border-color: var(--border);
      box-shadow: none;
    }
    .qp-option:active {
      border-color: rgba(23,84,190,.3);
      background: rgba(23,84,190,.03);
    }
    .qp-btn:hover:not(:disabled) {
      background: var(--blue);
      box-shadow: 0 6px 20px rgba(23,84,190,.28);
      gap: 8px;
    }
    .qp-btn.final:hover:not(:disabled) { background: var(--orange); }
  }
`;

/* ─────────────────────────────────────────────
   PAGE
───────────────────────────────────────────── */
const QCMPlayPage = () => {
  const { languageId } = useParams();
  const navigate = useNavigate();

  const [quizData, setQuizData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState({});

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await API.get(`/student/qcm/${languageId}`);
        setQuizData(response.data);
      } catch (err) {
        console.error("Erreur chargement quiz :", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [languageId]);

  if (loading) return (
    <>
      <style>{style}</style>
      <div className="qp-center">
        <Loader2 size={40} style={{ color: "var(--blue)" }} className="qp-spin" />
      </div>
    </>
  );

  if (!quizData || !quizData.questions?.length) return (
    <>
      <style>{style}</style>
      <div className="qp-center">
        <AlertCircle size={40} style={{ color: "var(--muted)" }} />
        <p>Aucun quiz disponible.</p>
      </div>
    </>
  );

  const currentQuestion = quizData.questions[currentQuestionIndex];
  const totalQuestions = quizData.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;
  const isFinal = currentQuestionIndex === totalQuestions - 1;

  const handleValidation = () => {
    if (selectedOption === null) return;
    const updatedAnswers = { ...answers, [currentQuestionIndex]: selectedOption };
    setAnswers(updatedAnswers);
    if (!isFinal) {
      setCurrentQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
    } else {
      submitQuiz(updatedAnswers);
    }
  };

  const submitQuiz = async (finalAnswers) => {
    try {
      setLoading(true);
      const response = await API.post('/student/qcm/submit', {
        qcm_id: quizData.id,
        answers: finalAnswers,
      });
      navigate('/student/qcm/results', { state: { results: response.data } });
    } catch (err) {
      console.error(err);
      alert("Erreur lors de la soumission.");
    } finally {
      setLoading(false);
    }
  };

  const remaining = totalQuestions - currentQuestionIndex - 1;

  return (
    <>
      <style>{style}</style>

      <div className="qp-root qp-shell">
        <Sidebar />

        <main className="qp-main">

          {/* ── TOP HEADER ── */}
          <header className="qp-header">
            <div style={{ minWidth: 0 }}>
              <div className="qp-quiz-title">Quiz &mdash; {quizData.title}</div>
              <div className="qp-quiz-progress-label">
                Question {currentQuestionIndex + 1} / {totalQuestions}
              </div>
            </div>
            <div className="qp-timer">
              <Timer size={15} />
              {quizData.time_limit || 15} min
            </div>
          </header>

          {/* ── PROGRESS BAR ── */}
          <div className="qp-progress-track">
            <div className="qp-progress-fill" style={{ width: `${progress}%` }} />
          </div>

          {/* ── STEP DOTS ── */}
          <div className="qp-steps">
            {quizData.questions.map((_, i) => (
              <div
                key={i}
                className={`qp-step ${
                  i < currentQuestionIndex ? "qp-step-done"
                  : i === currentQuestionIndex ? "qp-step-current"
                  : "qp-step-todo"
                }`}
              />
            ))}
          </div>

          {/* ── QUESTION CARD ── */}
          <div className="qp-content">
            <div className="qp-card">

              {/* level */}
              <span className="qp-level-pill">
                {currentQuestion.level || "Concept"}
              </span>

              {/* question */}
              <h2 className="qp-question">{currentQuestion.question_text}</h2>

              {/* code snippet */}
              {currentQuestion.code_snippet && (
                <div className="qp-code-block">
                  <div className="qp-code-label">
                    <Code size={11} /> Code
                  </div>
                  <pre>{currentQuestion.code_snippet}</pre>
                </div>
              )}

              {/* options */}
              <div className="qp-options">
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    className={`qp-option${selectedOption === index ? " selected" : ""}`}
                    onClick={() => setSelectedOption(index)}
                  >
                    <div className="qp-option-id">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span className="qp-option-label">{option}</span>
                    {selectedOption === index && (
                      <CheckCircle2 size={19} className="qp-option-check" />
                    )}
                  </div>
                ))}
              </div>

              {/* footer */}
              <div className="qp-footer">
                <span className="qp-counter">
                  {remaining} restante{remaining !== 1 ? "s" : ""}
                </span>
                <button
                  className={`qp-btn${isFinal ? " final" : ""}`}
                  onClick={handleValidation}
                  disabled={selectedOption === null}
                >
                  {isFinal ? "Terminer le Quiz" : "Valider et continuer"}
                  <ChevronRight size={17} />
                </button>
              </div>

            </div>
          </div>

        </main>
      </div>
    </>
  );
};

export default QCMPlayPage;