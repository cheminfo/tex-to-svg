import { useCallback, useEffect, useState } from 'react';

import './App.css';
import { ExamplesPanel } from './ExamplesPanel.tsx';
import { HelpPanel } from './HelpPanel.tsx';
import { ServerRenderPanel } from './ServerRenderPanel.tsx';
import { LatexEditor } from './editor/LatexEditor.tsx';
import { LatexCommands } from './reference/LatexCommands.tsx';
import { LatexDocs } from './reference/LatexDocs.tsx';
import { MathJaxRenderer } from './shared/MathJaxRenderer.tsx';

const PRODUCTION_BASE =
  import.meta.env.VITE_PRODUCTION_BASE ?? 'https://tex.cheminfo.org';

function getTexFromUrl(): string {
  const params = new URLSearchParams(window.location.search);
  return params.get('tex') ?? '';
}

function buildRenderUrl(tex: string, base: string): string {
  return `${base}/v1/?tex=${encodeURIComponent(tex)}`;
}

function buildImgTag(tex: string): string {
  return `<img src="${buildRenderUrl(tex, PRODUCTION_BASE)}"/>`;
}

function flashCopied(setFlag: (value: boolean) => void): void {
  setFlag(true);
  setTimeout(() => setFlag(false), 1500);
}

export default function App() {
  const [tex, setTex] = useState<string>(getTexFromUrl);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [zoom, setZoom] = useState<1 | 2 | 3>(2);
  const [activeTab, setActiveTab] = useState<
    'examples' | 'reference' | 'commands' | 'help'
  >('examples');

  useEffect(() => {
    const url = new URL(window.location.href);
    if (tex) {
      url.searchParams.set('tex', tex);
    } else {
      url.searchParams.delete('tex');
    }
    window.history.replaceState(null, '', url.toString());
  }, [tex]);

  const copyToClipboard = useCallback(() => {
    void navigator.clipboard
      .writeText(buildImgTag(tex))
      .then(() => flashCopied(setCopyFeedback));
  }, [tex]);

  return (
    <div className="layout">
      {/* MIDDLE: editor + live preview + embed code + server render */}
      <main className="panel panel-middle">
        <div className="section section-editor">
          <label className="section-label">
            LaTeX formula — edit directly or paste a{' '}
            <code className="inline-code">?tex=</code> URL
          </label>
          <LatexEditor value={tex} onChange={setTex} onPasteUrl={setTex} />
        </div>

        <div className="section section-preview">
          <div className="section-label-row">
            <span className="section-label">Live preview</span>
            <div className="zoom-btns">
              {([1, 2, 3] as const).map((z) => (
                <button
                  key={z}
                  type="button"
                  className={`zoom-btn ${zoom === z ? 'active' : ''}`}
                  onClick={() => setZoom(z)}
                >
                  {z}×
                </button>
              ))}
            </div>
          </div>
          <div className="live-preview" style={{ fontSize: `${zoom}em` }}>
            {tex ? (
              <MathJaxRenderer tex={tex} displayMode />
            ) : (
              <span className="placeholder" style={{ fontSize: '0.5em' }}>
                Live preview will appear here
              </span>
            )}
          </div>
        </div>

        <div className="section section-code">
          <label className="section-label">Embed code</label>
          <div className="code-row">
            <textarea
              className="code-output"
              readOnly
              value={tex ? buildImgTag(tex) : ''}
            />
            <button
              type="button"
              className={`copy-btn ${copyFeedback ? 'copied' : ''}`}
              onClick={copyToClipboard}
              title="Copy to clipboard"
            >
              {copyFeedback ? '✓' : '📋'}
            </button>
          </div>
        </div>

        <ServerRenderPanel tex={tex} zoom={zoom} />
      </main>

      {/* RIGHT: tabs */}
      <aside className="panel panel-right">
        <div className="tab-bar">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'examples' ? 'active' : ''}`}
            onClick={() => setActiveTab('examples')}
          >
            Examples
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'reference' ? 'active' : ''}`}
            onClick={() => setActiveTab('reference')}
          >
            Reference
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'commands' ? 'active' : ''}`}
            onClick={() => setActiveTab('commands')}
          >
            Commands
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'help' ? 'active' : ''}`}
            onClick={() => setActiveTab('help')}
          >
            Help
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'examples' ? (
            <ExamplesPanel onSelect={setTex} />
          ) : activeTab === 'reference' ? (
            <LatexDocs onSelect={setTex} />
          ) : activeTab === 'commands' ? (
            <LatexCommands onSelect={setTex} />
          ) : (
            <HelpPanel />
          )}
        </div>
      </aside>
    </div>
  );
}
