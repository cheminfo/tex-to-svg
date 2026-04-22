import { liteAdaptor } from 'mathjax-full/js/adaptors/liteAdaptor.js';
import { RegisterHTMLHandler } from 'mathjax-full/js/handlers/html.js';
import { AllPackages } from 'mathjax-full/js/input/tex/AllPackages.js';
import { TeX } from 'mathjax-full/js/input/tex.js';
import { mathjax } from 'mathjax-full/js/mathjax.js';
import { SVG } from 'mathjax-full/js/output/svg.js';

const adaptor = liteAdaptor();
RegisterHTMLHandler(adaptor);

const mjDocument = mathjax.document('', {
  InputJax: new TeX({ packages: AllPackages }),
  OutputJax: new SVG({ fontCache: 'none' }),
});

export interface RenderResult {
  svg: string;
}

/**
 * Render a TeX formula to SVG using MathJax 3.
 * @param tex - The LaTeX formula string.
 * @returns Resolved render result with svg string.
 */
export function renderLatex(tex: string): Promise<RenderResult> {
  const node = mjDocument.convert(tex, { display: true });
  // MathJax wraps SVG in a container element; innerHTML gives the raw SVG.
  const svg = adaptor.innerHTML(node);
  return Promise.resolve({ svg });
}
