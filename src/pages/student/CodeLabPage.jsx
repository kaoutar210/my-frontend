import React, { useState, useEffect } from 'react';
import {
  RotateCcw,
  Globe, Loader2,
  FileCode, Hash, Braces,
  Code2,
  Zap,
  Eye, PenLine,
} from 'lucide-react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css';

import Sidebar from "../../components/layout/SidebarStudent";

const BLUE   = '#1754be';
const ORANGE = '#e5522d';

const CodeLabPage = () => {
  const [files, setFiles] = useState({
    'index.html': '<h1>Bienvenue sur CodeLink !</h1>\n<p>Modifiez le code pour voir le rendu.</p>',
    'style.css':  'body {\n  font-family: sans-serif;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  height: 100vh;\n  background: #f0f4ff;\n}\n\nh1 { color: #e5522d; font-size: 3rem; }',
    'script.js':  '// Votre JavaScript ici\nconsole.log("Hello CodeLink!");',
  });

  const [activeTab, setActiveTab]   = useState('index.html');
  const [srcDoc,    setSrcDoc]      = useState('');
  const [isRunning, setIsRunning]   = useState(false);
  const [mobileView, setMobileView] = useState('editor');

  const updateOutput = () => {
    setIsRunning(true);
    const combined = `
      <html>
        <head><style>${files['style.css']}</style></head>
        <body>
          ${files['index.html']}
          <script>${files['script.js']}<\/script>
        </body>
      </html>`;
    setTimeout(() => {
      setSrcDoc(combined);
      setIsRunning(false);
      setMobileView('preview');
    }, 500);
  };

  useEffect(() => { updateOutput(); }, []);

  const handleCodeChange = (code) =>
    setFiles(prev => ({ ...prev, [activeTab]: code }));

  const getLanguage = (tab) => {
    if (tab.endsWith('.html')) return languages.markup;
    if (tab.endsWith('.css'))  return languages.css;
    return languages.javascript;
  };

  const lineCount = (files[activeTab] || '').split('\n').length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Sora:wght@400;600;700;800&display=swap');

        :root {
          --blue:         ${BLUE};
          --blue-dark:    #0f3d99;
          --orange:       ${ORANGE};
          --orange-dark:  #c43d1a;
          --editor-bg:    #0d1117;
          --editor-panel: #161b22;
          --editor-border:#21262d;
          --text-dim:     #8b949e;
          --text-bright:  #e6edf3;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cl-root {
          display: flex;
          font-family: 'Sora', sans-serif;
          color: var(--text-bright);
        }

        .cl-main {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          height: 100vh;
          overflow: hidden;
          background: var(--editor-bg);
        }

        /* push content below mobile fixed top bar (h-14 = 56px) */
        @media (max-width: 1023px) {
          .cl-main { padding-top: 56px; }
        }

        /* ── ROW 1: brand + actions ── */
        .cl-topbar {
          height: 52px;
          background: var(--editor-panel);
          border-bottom: 1px solid var(--editor-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          flex-shrink: 0;
          gap: 8px;
        }

        .cl-brand {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.05em;
          color: var(--text-bright);
          white-space: nowrap;
          flex-shrink: 0;
        }
        .cl-brand-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: var(--orange);
          flex-shrink: 0;
        }

        .cl-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }

        .cl-btn {
          display: flex; align-items: center; gap: 5px;
          padding: 6px 10px;
          border-radius: 7px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.07em;
          border: none;
          cursor: pointer;
          transition: all .18s ease;
          font-family: 'Sora', sans-serif;
          white-space: nowrap;
        }

        .cl-btn-ghost {
          background: transparent;
          color: var(--text-dim);
          border: 1px solid var(--editor-border);
        }
        .cl-btn-ghost:hover {
          color: #ff6b6b;
          border-color: rgba(229,82,45,.4);
          background: rgba(229,82,45,.08);
        }
        @media (max-width: 480px) {
          .cl-btn-ghost .cl-btn-label { display: none; }
          .cl-btn-ghost { padding: 6px 8px; }
        }

        .cl-btn-run {
          background: var(--orange);
          color: #fff;
          box-shadow: 0 0 16px rgba(229,82,45,.4);
          padding: 6px 14px;
        }
        .cl-btn-run:hover:not(:disabled) {
          background: var(--orange-dark);
          box-shadow: 0 0 22px rgba(229,82,45,.55);
          transform: translateY(-1px);
        }
        .cl-btn-run:active:not(:disabled) { transform: translateY(0); }
        .cl-btn-run:disabled { opacity: .55; cursor: not-allowed; }

        /* ── ROW 2: file tabs ── */
        .cl-tabs-bar {
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 0 8px;
          overflow-x: auto;
          scrollbar-width: none;
          flex-shrink: 0;
          background: var(--editor-panel);
          border-bottom: 1px solid var(--editor-border);
          height: 38px;
        }
        .cl-tabs-bar::-webkit-scrollbar { display: none; }

        .cl-tab {
          display: flex; align-items: center; gap: 5px;
          padding: 5px 10px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.02em;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all .18s ease;
          background: none;
          color: var(--text-dim);
          font-family: 'Sora', sans-serif;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .cl-tab:hover { color: var(--text-bright); background: rgba(255,255,255,.06); }
        .cl-tab.active {
          background: rgba(23,84,190,.18);
          border-color: rgba(23,84,190,.45);
          color: #6fa3f5;
        }
        .cl-tab.active svg { color: var(--blue); }
        .cl-tab svg { flex-shrink: 0; }

        /* ── Mobile view switcher ── */
        .cl-view-switcher {
          display: none;
          background: var(--editor-panel);
          border-bottom: 1px solid var(--editor-border);
          flex-shrink: 0;
        }
        @media (max-width: 767px) {
          .cl-view-switcher { display: flex; }
        }
        .cl-view-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px;
          font-size: 11px;
          font-weight: 700;
          font-family: 'Sora', sans-serif;
          letter-spacing: 0.05em;
          border: none;
          cursor: pointer;
          transition: all .18s;
          background: transparent;
          color: var(--text-dim);
        }
        .cl-view-btn.active {
          color: var(--text-bright);
          background: rgba(23,84,190,.15);
          border-bottom: 2px solid var(--orange);
        }

        /* ── IDE body ── */
        .cl-body {
          flex: 1;
          display: flex;
          overflow: hidden;
        }

        .cl-editor-pane {
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--editor-border);
          background: var(--editor-bg);
          width: 50%;
        }

        .cl-preview-pane {
          display: flex;
          flex-direction: column;
          background: #f0f4ff;
          width: 50%;
        }

        @media (max-width: 767px) {
          .cl-body { flex-direction: column; }
          .cl-editor-pane  { width: 100%; border-right: none; border-bottom: 1px solid var(--editor-border); }
          .cl-preview-pane { width: 100%; }

          .cl-body[data-mobile-view="editor"]  .cl-editor-pane  { flex: 1; display: flex; }
          .cl-body[data-mobile-view="editor"]  .cl-preview-pane { display: none; }
          .cl-body[data-mobile-view="preview"] .cl-editor-pane  { display: none; }
          .cl-body[data-mobile-view="preview"] .cl-preview-pane { flex: 1; display: flex; }
        }

        /* ── Pane header ── */
        .cl-pane-header {
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px;
          background: var(--editor-panel);
          border-bottom: 1px solid var(--editor-border);
          flex-shrink: 0;
        }
        .cl-pane-label {
          font-size: 9.5px;
          font-weight: 800;
          letter-spacing: .2em;
          text-transform: uppercase;
          color: var(--text-dim);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .cl-pane-label svg { color: var(--blue); opacity: .7; }

        .cl-traffic { display: flex; gap: 5px; }
        .cl-dot { width: 9px; height: 9px; border-radius: 50%; }
        .cl-dot-r { background: #ff5f57; }
        .cl-dot-y { background: #febc2e; }
        .cl-dot-g { background: #28c840; }

        /* ── Editor scroll ── */
        .cl-editor-scroll { flex: 1; display: flex; overflow: auto; }

        .cl-gutter {
          width: 36px;
          flex-shrink: 0;
          background: var(--editor-panel);
          border-right: 1px solid var(--editor-border);
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding: 4px 8px 4px 0;
          user-select: none;
        }
        .cl-gutter span {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          line-height: 1.6;
          color: rgba(139,148,158,.35);
          padding: 1px 0;
        }

        .cl-code-wrap { flex: 1; padding: 4px 0; min-width: 0; }

        /* ── Preview ── */
        .cl-preview-bar {
          height: 32px;
          background: #fff;
          border-bottom: 1px solid #dce6f5;
          display: flex;
          align-items: center;
          padding: 0 12px;
          gap: 8px;
          flex-shrink: 0;
        }
        .cl-url-pill {
          flex: 1;
          max-width: 300px;
          height: 20px;
          background: #f0f4ff;
          border: 1px solid #d0dcf0;
          border-radius: 20px;
          display: flex;
          align-items: center;
          padding: 0 10px;
          gap: 5px;
          font-size: 9.5px;
          font-weight: 600;
          color: #7a94c4;
          letter-spacing: .03em;
        }
        .cl-url-pill svg { color: var(--blue); opacity: .7; }

        .cl-preview-content { flex: 1; padding: 12px; overflow: hidden; }

        .cl-preview-card {
          width: 100%; height: 100%;
          background: #fff;
          border-radius: 12px;
          box-shadow: 0 8px 32px rgba(23,84,190,.12), 0 1px 4px rgba(23,84,190,.08);
          border: 1px solid #dce6f5;
          overflow: hidden;
          position: relative;
        }

        .cl-overlay {
          position: absolute; inset: 0;
          background: rgba(255,255,255,.85);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 10;
        }

        @keyframes spin { to { transform: rotate(360deg); } }

        .cl-editor-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .cl-editor-scroll::-webkit-scrollbar-track { background: transparent; }
        .cl-editor-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 4px; }
        .cl-editor-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,.18); }
      `}</style>

      <div className="cl-root">
        <Sidebar brandName="CodeLink" onLogout={() => {}} />

        <main className="cl-main">

          {/* ── ROW 1: brand + reset + exécuter ── */}
          <header className="cl-topbar">
            <div className="cl-brand">
              <div className="cl-brand-dot" />
              <span>CodeLink<span style={{ color: ORANGE }}>.</span>lab</span>
            </div>

            <div className="cl-actions">
              <button
                className="cl-btn cl-btn-ghost"
                onClick={() => setFiles({ 'index.html': '', 'style.css': '', 'script.js': '' })}
              >
                <RotateCcw size={12} />
                <span className="cl-btn-label">RESET</span>
              </button>

              <button
                className="cl-btn cl-btn-run"
                onClick={updateOutput}
                disabled={isRunning}
              >
                {isRunning
                  ? <><Loader2 size={12} style={{ animation: 'spin .7s linear infinite' }} /> COMPILATION</>
                  : <><Zap size={12} /> EXÉCUTER</>
                }
              </button>
            </div>
          </header>

          {/* ── ROW 2: file tabs (always visible) ── */}
          <div className="cl-tabs-bar">
            <button
              className={`cl-tab${activeTab === 'index.html' ? ' active' : ''}`}
              onClick={() => setActiveTab('index.html')}
            >
              <FileCode size={12} />
              index.html
            </button>
            <button
              className={`cl-tab${activeTab === 'style.css' ? ' active' : ''}`}
              onClick={() => setActiveTab('style.css')}
            >
              <Hash size={12} />
              style.css
            </button>
            <button
              className={`cl-tab${activeTab === 'script.js' ? ' active' : ''}`}
              onClick={() => setActiveTab('script.js')}
            >
              <Braces size={12} />
              script.js
            </button>
          </div>

          {/* ── ROW 3: editor / preview switcher (mobile only) ── */}
          <div className="cl-view-switcher">
            <button
              className={`cl-view-btn${mobileView === 'editor' ? ' active' : ''}`}
              onClick={() => setMobileView('editor')}
            >
              <PenLine size={13} /> Éditeur
            </button>
            <button
              className={`cl-view-btn${mobileView === 'preview' ? ' active' : ''}`}
              onClick={() => setMobileView('preview')}
            >
              <Eye size={13} /> Aperçu
            </button>
          </div>

          {/* ── IDE body ── */}
          <div className="cl-body" data-mobile-view={mobileView}>

            {/* EDITOR */}
            <div className="cl-editor-pane">
              <div className="cl-pane-header">
                <div className="cl-pane-label">
                  <Code2 size={11} />
                  {activeTab}
                </div>
                <div className="cl-traffic">
                  <div className="cl-dot cl-dot-r" />
                  <div className="cl-dot cl-dot-y" />
                  <div className="cl-dot cl-dot-g" />
                </div>
              </div>

              <div className="cl-editor-scroll">
                <div className="cl-gutter">
                  {Array.from({ length: lineCount }, (_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>
                <div className="cl-code-wrap">
                  <Editor
                    value={files[activeTab]}
                    onValueChange={handleCodeChange}
                    highlight={code => highlight(code, getLanguage(activeTab))}
                    padding={16}
                    style={{
                      fontFamily: '"JetBrains Mono", monospace',
                      fontSize: 13,
                      lineHeight: 1.6,
                      minHeight: '100%',
                      backgroundColor: 'transparent',
                      color: '#e2e8f0',
                    }}
                  />
                </div>
              </div>
            </div>

            {/* PREVIEW */}
            <div className="cl-preview-pane">
              <div className="cl-preview-bar">
                <Globe size={11} style={{ color: BLUE, opacity: .6 }} />
                <div className="cl-url-pill">
                  <Globe size={9} />
                  localhost / preview
                </div>
              </div>

              <div className="cl-preview-content">
                <div className="cl-preview-card">
                  {isRunning && (
                    <div className="cl-overlay">
                      <Loader2 size={30} style={{ color: ORANGE, animation: 'spin .7s linear infinite' }} />
                    </div>
                  )}
                  <iframe
                    srcDoc={srcDoc}
                    title="output"
                    sandbox="allow-scripts"
                    frameBorder="0"
                    width="100%"
                    height="100%"
                    style={{ display: 'block', background: '#fff' }}
                  />
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default CodeLabPage;