import React, { useState, useEffect } from 'react';
import {
  RotateCcw, Play, Globe, Loader2,
  FileCode, Hash, Braces, Terminal, Code2,
  ChevronRight, Zap, CheckCircle2, Circle
} from 'lucide-react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import 'prismjs/components/prism-css';
import 'prismjs/themes/prism-tomorrow.css';

import Sidebar from "../../components/layout/SidebarStudent";

/* ── Brand tokens ───────────────────────────────────────────── */
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
    setTimeout(() => { setSrcDoc(combined); setIsRunning(false); }, 500);
  };

  useEffect(() => { updateOutput(); }, []);

  const handleCodeChange = (code) =>
    setFiles(prev => ({ ...prev, [activeTab]: code }));

  const getLanguage = (tab) => {
    if (tab.endsWith('.html')) return languages.markup;
    if (tab.endsWith('.css'))  return languages.css;
    return languages.javascript;
  };

  /* line count for gutter */
  const lineCount = (files[activeTab] || '').split('\n').length;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;700&family=Sora:wght@400;600;700;800&display=swap');

        :root {
          --blue:         ${BLUE};
          --blue-dark:    #0f3d99;
          --blue-light:   #e8effc;
          --orange:       ${ORANGE};
          --orange-dark:  #c43d1a;
          --orange-light: #fdf0ec;
          --editor-bg:    #0d1117;
          --editor-panel: #161b22;
          --editor-border:#21262d;
          --text-dim:     #8b949e;
          --text-bright:  #e6edf3;
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .cl-root {
          display: flex;
          height: 100vh;
          background: var(--editor-bg);
          font-family: 'Sora', sans-serif;
          color: var(--text-bright);
          overflow: hidden;
        }

        /* ── TOPBAR ─────────────────────────────────────────── */
        .cl-topbar {
          height: 52px;
          background: var(--editor-panel);
          border-bottom: 1px solid var(--editor-border);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          flex-shrink: 0;
          gap: 12px;
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
        }
        .cl-brand-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--orange); }

        /* tabs */
        .cl-tabs { display: flex; align-items: center; gap: 4px; }

        .cl-tab {
          display: flex; align-items: center; gap: 6px;
          padding: 5px 14px;
          border-radius: 6px;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.02em;
          border: 1px solid transparent;
          cursor: pointer;
          transition: all .18s ease;
          background: none;
          color: var(--text-dim);
          font-family: 'Sora', sans-serif;
        }
        .cl-tab:hover { color: var(--text-bright); background: rgba(255,255,255,.06); }
        .cl-tab.active {
          background: rgba(23,84,190,.18);
          border-color: rgba(23,84,190,.45);
          color: #6fa3f5;
        }
        .cl-tab.active svg { color: var(--blue); }
        .cl-tab svg { flex-shrink: 0; }

        /* actions */
        .cl-actions { display: flex; align-items: center; gap: 8px; }

        .cl-btn {
          display: flex; align-items: center; gap: 6px;
          padding: 6px 14px;
          border-radius: 7px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.07em;
          border: none;
          cursor: pointer;
          transition: all .18s ease;
          font-family: 'Sora', sans-serif;
        }

        .cl-btn-ghost {
          background: transparent;
          color: var(--text-dim);
          border: 1px solid var(--editor-border);
        }
        .cl-btn-ghost:hover { color: #ff6b6b; border-color: rgba(229,82,45,.4); background: rgba(229,82,45,.08); }

        .cl-btn-run {
          background: var(--orange);
          color: #fff;
          box-shadow: 0 0 16px rgba(229,82,45,.4);
          padding: 6px 20px;
        }
        .cl-btn-run:hover:not(:disabled) {
          background: var(--orange-dark);
          box-shadow: 0 0 22px rgba(229,82,45,.55);
          transform: translateY(-1px);
        }
        .cl-btn-run:active:not(:disabled) { transform: translateY(0); }
        .cl-btn-run:disabled { opacity: .55; cursor: not-allowed; }

        /* ── IDE BODY ─────────────────────────────────────────── */
        .cl-body { flex: 1; display: flex; overflow: hidden; }

        /* editor pane */
        .cl-editor-pane {
          width: 50%;
          display: flex;
          flex-direction: column;
          border-right: 1px solid var(--editor-border);
          background: var(--editor-bg);
        }

        .cl-pane-header {
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
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
        .cl-dot {
          width: 9px; height: 9px; border-radius: 50%;
        }
        .cl-dot-r { background: #ff5f57; }
        .cl-dot-y { background: #febc2e; }
        .cl-dot-g { background: #28c840; }

        /* gutter + editor row */
        .cl-editor-scroll { flex: 1; display: flex; overflow: auto; }

        .cl-gutter {
          width: 40px;
          flex-shrink: 0;
          padding: 4px 0;
          background: var(--editor-panel);
          border-right: 1px solid var(--editor-border);
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          padding-right: 8px;
          user-select: none;
        }
        .cl-gutter span {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px;
          line-height: 1.6;
          color: rgba(139,148,158,.35);
          padding: 1px 0;
        }

        .cl-code-wrap {
          flex: 1;
          padding: 4px 0;
          min-width: 0;
        }

        /* preview pane */
        .cl-preview-pane {
          width: 50%;
          display: flex;
          flex-direction: column;
          background: #f0f4ff;
        }

        .cl-preview-bar {
          height: 32px;
          background: #fff;
          border-bottom: 1px solid #dce6f5;
          display: flex;
          align-items: center;
          padding: 0 16px;
          gap: 8px;
          flex-shrink: 0;
        }

        .cl-url-pill {
          flex: 1;
          max-width: 340px;
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

        .cl-preview-content {
          flex: 1;
          padding: 20px;
          overflow: hidden;
        }

        .cl-preview-card {
          width: 100%;
          height: 100%;
          background: #fff;
          border-radius: 16px;
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
        .cl-spinner { color: var(--orange); animation: spin .8s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }

        /* scrollbar */
        .cl-editor-scroll::-webkit-scrollbar { width: 5px; height: 5px; }
        .cl-editor-scroll::-webkit-scrollbar-track { background: transparent; }
        .cl-editor-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,.1); border-radius: 4px; }
        .cl-editor-scroll::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,.18); }
      `}</style>

      <div className="cl-root">
        <Sidebar brandName="CodeLink" onLogout={() => {}} />

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

          {/* TOPBAR */}
          <header className="cl-topbar">
            {/* Brand */}
            <div className="cl-brand">
              <div className="cl-brand-dot" />
              CodeLink<span style={{ color: ORANGE }}>.</span>lab
            </div>

            {/* Tabs */}
            <div className="cl-tabs">
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

            {/* Actions */}
            <div className="cl-actions">
              <button
                className="cl-btn cl-btn-ghost"
                onClick={() => setFiles({ 'index.html': '', 'style.css': '', 'script.js': '' })}
              >
                <RotateCcw size={12} />
                RESET
              </button>

              <button
                className="cl-btn cl-btn-run"
                onClick={updateOutput}
                disabled={isRunning}
              >
                {isRunning
                  ? <><Loader2 size={12} className="cl-spinner" style={{ animation: 'spin .7s linear infinite' }} /> COMPILATION</>
                  : <><Zap size={12} /> EXÉCUTER</>
                }
              </button>
            </div>
          </header>

          {/* IDE BODY */}
          <div className="cl-body">

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
                {/* Gutter */}
                <div className="cl-gutter">
                  {Array.from({ length: lineCount }, (_, i) => (
                    <span key={i}>{i + 1}</span>
                  ))}
                </div>

                {/* Code editor */}
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
              {/* Browser bar */}
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
                      <Loader2 size={30} className="cl-spinner" style={{ color: ORANGE, animation: 'spin .7s linear infinite' }} />
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