export function HelpPanel() {
  return (
    <div className="help-panel">
      <h2 className="help-title">LaTeX → SVG / PNG</h2>
      <p>
        Type or paste any LaTeX math expression into the editor. The{' '}
        <strong>live preview</strong> renders instantly in your browser via
        MathJax 3 so you can check syntax as you type.
      </p>
      <p>
        The <strong>server render</strong> produces a pixel-perfect SVG (or PNG
        at 150 / 300 dpi) using the same MathJax 3 engine — that is the exact
        image referenced by the embed code.
      </p>
      <h3 className="help-subtitle">How to embed</h3>
      <p>
        Copy the <code className="inline-code">&lt;img&gt;</code> tag from the{' '}
        <em>Embed code</em> field and paste it into any HTML page, Markdown
        document, Jupyter notebook, or email.
      </p>
      <h3 className="help-subtitle">Sharing a formula</h3>
      <p>
        The URL in your browser already contains the formula as a{' '}
        <code className="inline-code">?tex=</code> query parameter — you can
        share it directly, or paste it back into the editor field to load it.
      </p>
      <h3 className="help-subtitle">Resources</h3>
      <a
        href="https://docs.mathjax.org/en/latest/input/tex/macros/index.html"
        target="_blank"
        rel="noreferrer"
        className="guide-link"
      >
        MathJax supported commands →
      </a>
    </div>
  );
}
