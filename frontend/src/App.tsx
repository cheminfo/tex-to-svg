import { useCallback, useEffect, useRef, useState } from 'react';

import './App.css';
import { KatexRenderer } from './KatexRenderer.tsx';
import { LatexDocs } from './LatexDocs.tsx';
import { LatexEditor } from './LatexEditor.tsx';
import { DEFAULT_EXAMPLES } from './examples.ts';

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

export default function App() {
  const [tex, setTex] = useState<string>(getTexFromUrl);
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [copiedSvg, setCopiedSvg] = useState(false);
  const [copiedPng150, setCopiedPng150] = useState(false);
  const [copiedPng300, setCopiedPng300] = useState(false);
  const [serverPreviewKey, setServerPreviewKey] = useState(0);
  const [activeTab, setActiveTab] = useState<'preview' | 'reference'>(
    'preview',
  );
  const serverPreviewTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync tex to URL bar without page reload
  useEffect(() => {
    const url = new URL(window.location.href);
    if (tex) {
      url.searchParams.set('tex', tex);
    } else {
      url.searchParams.delete('tex');
    }
    window.history.replaceState(null, '', url.toString());
  }, [tex]);

  // Debounce server preview refresh
  const handleTexChange = useCallback((value: string) => {
    setTex(value);
    if (serverPreviewTimer.current) clearTimeout(serverPreviewTimer.current);
    serverPreviewTimer.current = setTimeout(() => {
      setServerPreviewKey((k) => k + 1);
    }, 800);
  }, []);

  const copyToClipboard = useCallback(() => {
    void navigator.clipboard.writeText(buildImgTag(tex)).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 1500);
    });
  }, [tex]);

  const copyServerSvg = useCallback(() => {
    if (!tex) return;
    void fetch(`/v1/?tex=${encodeURIComponent(tex)}`)
      .then((response) => response.blob())
      .then((blob) =>
        navigator.clipboard.write([
          new ClipboardItem({ 'image/svg+xml': blob }),
        ]),
      )
      .then(() => {
        setCopiedSvg(true);
        setTimeout(() => setCopiedSvg(false), 1500);
      });
  }, [tex]);

  const copyServerPng = useCallback(
    (dpi: 150 | 300, setFlag: (v: boolean) => void) => {
      if (!tex) return;
      void fetch(
        `/v1/?tex=${encodeURIComponent(tex)}&format=png&resolution=${dpi}`,
      )
        .then((response) => response.blob())
        .then((blob) =>
          navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]),
        )
        .then(() => {
          setFlag(true);
          setTimeout(() => setFlag(false), 1500);
        });
    },
    [tex],
  );

  const serverImgSrc = tex
    ? `/v1/?tex=${encodeURIComponent(tex)}&ts=${serverPreviewKey}`
    : '';

  return (
    <div className="layout">
      {/* LEFT: examples panel */}
      <aside className="panel panel-left">
        <div className="panel-header">Examples</div>
        <table className="examples-table">
          <tbody>
            {DEFAULT_EXAMPLES.map((formula, index) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={index} onClick={() => handleTexChange(formula)}>
                <td className="formula-cell">
                  <KatexRenderer tex={formula} displayMode={false} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </aside>

      {/* MIDDLE: editor + preview + embed code */}
      <main className="panel panel-middle">
        <div className="section section-editor">
          <label className="section-label">
            LaTeX formula — edit directly or paste a{' '}
            <code className="inline-code">?tex=</code> URL
          </label>
          <LatexEditor
            value={tex}
            onChange={handleTexChange}
            onPasteUrl={handleTexChange}
          />
        </div>

        <div className="section section-preview">
          <div className="katex-preview">
            {tex ? (
              <KatexRenderer tex={tex} displayMode />
            ) : (
              <span className="placeholder">
                Live KaTeX preview will appear here
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
      </main>

      {/* RIGHT: preview / reference tabs */}
      <aside className="panel panel-right">
        <div className="tab-bar">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'preview' ? 'active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            Preview
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'reference' ? 'active' : ''}`}
            onClick={() => setActiveTab('reference')}
          >
            Reference
          </button>
        </div>

        {activeTab === 'preview' ? (
          <>
            <div className="info-notice">
              <p>
                The <strong>live preview</strong> renders instantly in your
                browser via KaTeX — great for checking syntax as you type.
              </p>
              <p>
                The <strong>server render</strong> below uses MathJax 3 and is
                the exact image embedded by the{' '}
                <code className="inline-code">&lt;img&gt;</code> tag. Minor
                visual differences between the two are possible.
              </p>
              <a
                href="https://katex.org/docs/supported.html"
                target="_blank"
                rel="noreferrer"
                className="guide-link"
              >
                KaTeX syntax reference →
              </a>
            </div>

            <div className="section section-server-preview">
              <div className="section-label-row">
                <span className="section-label">Server render</span>
                <div className="icon-btns">
                  <button
                    type="button"
                    className={`icon-btn ${copiedSvg ? 'copied' : ''}`}
                    title="Copy SVG to clipboard"
                    onClick={copyServerSvg}
                    disabled={!tex}
                  >
                    {copiedSvg ? '✓ Copied' : 'Copy SVG'}
                  </button>
                  <button
                    type="button"
                    className={`icon-btn ${copiedPng150 ? 'copied' : ''}`}
                    title="Copy PNG at 150 dpi"
                    onClick={() => copyServerPng(150, setCopiedPng150)}
                    disabled={!tex}
                  >
                    {copiedPng150 ? '✓ Copied' : 'Copy PNG 150dpi'}
                  </button>
                  <button
                    type="button"
                    className={`icon-btn ${copiedPng300 ? 'copied' : ''}`}
                    title="Copy PNG at 300 dpi"
                    onClick={() => copyServerPng(300, setCopiedPng300)}
                    disabled={!tex}
                  >
                    {copiedPng300 ? '✓ Copied' : 'Copy PNG 300dpi'}
                  </button>
                </div>
              </div>
              <div className="server-preview">
                {serverImgSrc ? (
                  <img
                    src={serverImgSrc}
                    alt="Server render"
                    style={{ maxWidth: '100%' }}
                  />
                ) : (
                  <span className="placeholder">
                    Server preview will appear here
                  </span>
                )}
              </div>
            </div>
          </>
        ) : (
          <LatexDocs onSelect={handleTexChange} />
        )}
      </aside>
    </div>
  );
}
