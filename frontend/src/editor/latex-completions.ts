import type {
  Completion,
  CompletionContext,
  CompletionResult,
} from '@codemirror/autocomplete';
import { StreamLanguage } from '@codemirror/language';
import { stex } from '@codemirror/legacy-modes/mode/stex';

interface LatexCommand {
  label: string;
  detail: string;
  info?: string;
}

const COMMANDS: LatexCommand[] = [
  // ── Fractions & roots ──────────────────────────────────────
  {
    label: String.raw`\frac`,
    detail: '{num}{den}',
    info: String.raw`Fraction: \frac{numerator}{denominator}`,
  },
  {
    label: String.raw`\dfrac`,
    detail: '{num}{den}',
    info: 'Display-style fraction (larger)',
  },
  {
    label: String.raw`\tfrac`,
    detail: '{num}{den}',
    info: 'Text-style fraction (smaller)',
  },
  { label: String.raw`\sqrt`, detail: '[n]{x}', info: 'Square (or nth) root' },
  { label: String.raw`\binom`, detail: '{n}{k}', info: 'Binomial coefficient' },

  // ── Operators ──────────────────────────────────────────────
  {
    label: String.raw`\sum`,
    detail: '_{i=1}^{n}',
    info: 'Summation with optional limits',
  },
  {
    label: String.raw`\prod`,
    detail: '_{i=1}^{n}',
    info: 'Product with optional limits',
  },
  {
    label: String.raw`\int`,
    detail: '_{a}^{b}',
    info: 'Integral with optional limits',
  },
  { label: String.raw`\iint`, detail: '', info: 'Double integral' },
  { label: String.raw`\iiint`, detail: '', info: 'Triple integral' },
  { label: String.raw`\oint`, detail: '', info: 'Contour integral' },
  { label: String.raw`\lim`, detail: String.raw`_{x \to a}`, info: 'Limit' },
  { label: String.raw`\inf`, detail: '', info: 'Infimum' },
  { label: String.raw`\sup`, detail: '', info: 'Supremum' },
  { label: String.raw`\max`, detail: '', info: 'Maximum' },
  { label: String.raw`\min`, detail: '', info: 'Minimum' },
  { label: String.raw`\log`, detail: '', info: 'Logarithm' },
  { label: String.raw`\ln`, detail: '', info: 'Natural logarithm' },
  { label: String.raw`\exp`, detail: '', info: 'Exponential function' },
  { label: String.raw`\sin`, detail: '', info: 'Sine' },
  { label: String.raw`\cos`, detail: '', info: 'Cosine' },
  { label: String.raw`\tan`, detail: '', info: 'Tangent' },
  { label: String.raw`\arcsin`, detail: '', info: 'Arcsine' },
  { label: String.raw`\arccos`, detail: '', info: 'Arccosine' },
  { label: String.raw`\arctan`, detail: '', info: 'Arctangent' },
  { label: String.raw`\sinh`, detail: '', info: 'Hyperbolic sine' },
  { label: String.raw`\cosh`, detail: '', info: 'Hyperbolic cosine' },
  { label: String.raw`\tanh`, detail: '', info: 'Hyperbolic tangent' },
  { label: String.raw`\det`, detail: '', info: 'Determinant' },
  { label: String.raw`\dim`, detail: '', info: 'Dimension' },
  { label: String.raw`\ker`, detail: '', info: 'Kernel' },
  { label: String.raw`\gcd`, detail: '', info: 'Greatest common divisor' },

  // ── Relations ──────────────────────────────────────────────
  { label: String.raw`\leq`, detail: '', info: 'Less than or equal: ≤' },
  { label: String.raw`\geq`, detail: '', info: 'Greater than or equal: ≥' },
  { label: String.raw`\neq`, detail: '', info: 'Not equal: ≠' },
  { label: String.raw`\approx`, detail: '', info: 'Approximately equal: ≈' },
  { label: String.raw`\equiv`, detail: '', info: 'Equivalent: ≡' },
  { label: String.raw`\sim`, detail: '', info: 'Similar: ∼' },
  { label: String.raw`\simeq`, detail: '', info: 'Similar or equal: ≃' },
  { label: String.raw`\cong`, detail: '', info: 'Congruent: ≅' },
  { label: String.raw`\propto`, detail: '', info: 'Proportional to: ∝' },
  { label: String.raw`\in`, detail: '', info: 'Element of: ∈' },
  { label: String.raw`\notin`, detail: '', info: 'Not element of: ∉' },
  { label: String.raw`\subset`, detail: '', info: 'Subset: ⊂' },
  { label: String.raw`\subseteq`, detail: '', info: 'Subset or equal: ⊆' },
  { label: String.raw`\supset`, detail: '', info: 'Superset: ⊃' },
  { label: String.raw`\supseteq`, detail: '', info: 'Superset or equal: ⊇' },

  // ── Arrows ─────────────────────────────────────────────────
  { label: String.raw`\to`, detail: '', info: 'Right arrow: →' },
  { label: String.raw`\leftarrow`, detail: '', info: 'Left arrow: ←' },
  { label: String.raw`\rightarrow`, detail: '', info: 'Right arrow: →' },
  { label: String.raw`\leftrightarrow`, detail: '', info: 'Both arrows: ↔' },
  { label: String.raw`\Leftarrow`, detail: '', info: 'Double left arrow: ⇐' },
  { label: String.raw`\Rightarrow`, detail: '', info: 'Double right arrow: ⇒' },
  {
    label: String.raw`\Leftrightarrow`,
    detail: '',
    info: 'Double both arrows: ⇔',
  },
  { label: String.raw`\mapsto`, detail: '', info: 'Maps to: ↦' },

  // ── Greek letters (lowercase) ──────────────────────────────
  { label: String.raw`\alpha`, detail: '', info: 'α' },
  { label: String.raw`\beta`, detail: '', info: 'β' },
  { label: String.raw`\gamma`, detail: '', info: 'γ' },
  { label: String.raw`\delta`, detail: '', info: 'δ' },
  { label: String.raw`\epsilon`, detail: '', info: 'ε' },
  { label: String.raw`\varepsilon`, detail: '', info: 'ε (variant)' },
  { label: String.raw`\zeta`, detail: '', info: 'ζ' },
  { label: String.raw`\eta`, detail: '', info: 'η' },
  { label: String.raw`\theta`, detail: '', info: 'θ' },
  { label: String.raw`\vartheta`, detail: '', info: 'ϑ (variant)' },
  { label: String.raw`\iota`, detail: '', info: 'ι' },
  { label: String.raw`\kappa`, detail: '', info: 'κ' },
  { label: String.raw`\lambda`, detail: '', info: 'λ' },
  { label: String.raw`\mu`, detail: '', info: 'μ' },
  { label: String.raw`\nu`, detail: '', info: 'ν' },
  { label: String.raw`\xi`, detail: '', info: 'ξ' },
  { label: String.raw`\pi`, detail: '', info: 'π' },
  { label: String.raw`\varpi`, detail: '', info: 'ϖ (variant)' },
  { label: String.raw`\rho`, detail: '', info: 'ρ' },
  { label: String.raw`\sigma`, detail: '', info: 'σ' },
  { label: String.raw`\tau`, detail: '', info: 'τ' },
  { label: String.raw`\upsilon`, detail: '', info: 'υ' },
  { label: String.raw`\phi`, detail: '', info: 'φ' },
  { label: String.raw`\varphi`, detail: '', info: 'φ (variant)' },
  { label: String.raw`\chi`, detail: '', info: 'χ' },
  { label: String.raw`\psi`, detail: '', info: 'ψ' },
  { label: String.raw`\omega`, detail: '', info: 'ω' },

  // ── Greek letters (uppercase) ──────────────────────────────
  { label: String.raw`\Gamma`, detail: '', info: 'Γ' },
  { label: String.raw`\Delta`, detail: '', info: 'Δ' },
  { label: String.raw`\Theta`, detail: '', info: 'Θ' },
  { label: String.raw`\Lambda`, detail: '', info: 'Λ' },
  { label: String.raw`\Xi`, detail: '', info: 'Ξ' },
  { label: String.raw`\Pi`, detail: '', info: 'Π' },
  { label: String.raw`\Sigma`, detail: '', info: 'Σ' },
  { label: String.raw`\Upsilon`, detail: '', info: 'Υ' },
  { label: String.raw`\Phi`, detail: '', info: 'Φ' },
  { label: String.raw`\Psi`, detail: '', info: 'Ψ' },
  { label: String.raw`\Omega`, detail: '', info: 'Ω' },

  // ── Fonts & text ───────────────────────────────────────────
  {
    label: String.raw`\text`,
    detail: '{text}',
    info: 'Normal text inside math mode',
  },
  { label: String.raw`\textbf`, detail: '{text}', info: 'Bold text' },
  { label: String.raw`\textit`, detail: '{text}', info: 'Italic text' },
  {
    label: String.raw`\mathrm`,
    detail: '{text}',
    info: 'Roman (upright) math font',
  },
  { label: String.raw`\mathbf`, detail: '{text}', info: 'Bold math font' },
  { label: String.raw`\mathit`, detail: '{text}', info: 'Italic math font' },
  {
    label: String.raw`\mathbb`,
    detail: '{letter}',
    info: 'Blackboard bold: ℝ, ℤ, ℕ …',
  },
  {
    label: String.raw`\mathcal`,
    detail: '{letter}',
    info: 'Calligraphic font',
  },
  { label: String.raw`\mathfrak`, detail: '{letter}', info: 'Fraktur font' },

  // ── Accents & decorators ───────────────────────────────────
  { label: String.raw`\hat`, detail: '{x}', info: 'Hat accent: x̂' },
  { label: String.raw`\bar`, detail: '{x}', info: 'Bar accent: x̄' },
  { label: String.raw`\vec`, detail: '{x}', info: 'Vector arrow: x⃗' },
  { label: String.raw`\dot`, detail: '{x}', info: 'Dot accent: ẋ' },
  { label: String.raw`\ddot`, detail: '{x}', info: 'Double dot accent: ẍ' },
  { label: String.raw`\tilde`, detail: '{x}', info: 'Tilde accent: x̃' },
  {
    label: String.raw`\overline`,
    detail: '{expr}',
    info: 'Overline above expression',
  },
  {
    label: String.raw`\underline`,
    detail: '{expr}',
    info: 'Underline below expression',
  },
  {
    label: String.raw`\overbrace`,
    detail: '{expr}',
    info: 'Brace above expression',
  },
  {
    label: String.raw`\underbrace`,
    detail: '{expr}',
    info: 'Brace below expression',
  },
  {
    label: String.raw`\overset`,
    detail: '{top}{base}',
    info: 'Place symbol above base',
  },
  {
    label: String.raw`\underset`,
    detail: '{bot}{base}',
    info: 'Place symbol below base',
  },

  // ── Delimiters ─────────────────────────────────────────────
  {
    label: String.raw`\left`,
    detail: String.raw`( … \right)`,
    info: 'Auto-sized left delimiter',
  },
  {
    label: String.raw`\right`,
    detail: ')',
    info: 'Auto-sized right delimiter',
  },
  { label: String.raw`\lvert`, detail: '', info: 'Left vertical bar |' },
  { label: String.raw`\rvert`, detail: '', info: 'Right vertical bar |' },
  { label: String.raw`\lVert`, detail: '', info: 'Left double bar ‖' },
  { label: String.raw`\rVert`, detail: '', info: 'Right double bar ‖' },
  { label: String.raw`\lfloor`, detail: '', info: 'Left floor: ⌊' },
  { label: String.raw`\rfloor`, detail: '', info: 'Right floor: ⌋' },
  { label: String.raw`\lceil`, detail: '', info: 'Left ceiling: ⌈' },
  { label: String.raw`\rceil`, detail: '', info: 'Right ceiling: ⌉' },

  // ── Environments ───────────────────────────────────────────
  {
    label: String.raw`\begin`,
    detail: '{env}',
    info: 'Begin an environment (matrix, cases, align …)',
  },
  { label: String.raw`\end`, detail: '{env}', info: 'End an environment' },

  // ── Misc symbols ──────────────────────────────────────────
  {
    label: String.raw`\cdot`,
    detail: '',
    info: 'Centered dot multiplication: ·',
  },
  { label: String.raw`\cdots`, detail: '', info: 'Centered ellipsis: ⋯' },
  { label: String.raw`\ldots`, detail: '', info: 'Low ellipsis: …' },
  { label: String.raw`\vdots`, detail: '', info: 'Vertical dots: ⋮' },
  { label: String.raw`\ddots`, detail: '', info: 'Diagonal dots: ⋱' },
  { label: String.raw`\infty`, detail: '', info: 'Infinity: ∞' },
  { label: String.raw`\partial`, detail: '', info: 'Partial derivative: ∂' },
  { label: String.raw`\nabla`, detail: '', info: 'Nabla / del operator: ∇' },
  { label: String.raw`\forall`, detail: '', info: 'For all: ∀' },
  { label: String.raw`\exists`, detail: '', info: 'There exists: ∃' },
  { label: String.raw`\nexists`, detail: '', info: 'There does not exist: ∄' },
  { label: String.raw`\emptyset`, detail: '', info: 'Empty set: ∅' },
  {
    label: String.raw`\varnothing`,
    detail: '',
    info: 'Empty set (variant): ∅',
  },
  { label: String.raw`\cup`, detail: '', info: 'Union: ∪' },
  { label: String.raw`\cap`, detail: '', info: 'Intersection: ∩' },
  { label: String.raw`\setminus`, detail: '', info: 'Set difference: ∖' },
  { label: String.raw`\pm`, detail: '', info: 'Plus-minus: ±' },
  { label: String.raw`\mp`, detail: '', info: 'Minus-plus: ∓' },
  { label: String.raw`\times`, detail: '', info: 'Multiplication: ×' },
  { label: String.raw`\div`, detail: '', info: 'Division: ÷' },
  { label: String.raw`\circ`, detail: '', info: 'Composition / degree: ∘' },
  { label: String.raw`\oplus`, detail: '', info: 'Circled plus: ⊕' },
  {
    label: String.raw`\otimes`,
    detail: '',
    info: 'Tensor product / circled times: ⊗',
  },
  { label: String.raw`\hbar`, detail: '', info: 'Reduced Planck constant: ℏ' },
  { label: String.raw`\ell`, detail: '', info: 'Script l: ℓ' },
  { label: String.raw`\Re`, detail: '', info: 'Real part: ℜ' },
  { label: String.raw`\Im`, detail: '', info: 'Imaginary part: ℑ' },
  {
    label: String.raw`\color`,
    detail: '{color}{expr}',
    info: 'Colorize expression',
  },
];

const COMPLETIONS: Completion[] = COMMANDS.map((cmd) => ({
  label: cmd.label,
  detail: cmd.detail || undefined,
  info: cmd.info,
  type: 'keyword',
}));

export function latexCompletionSource(
  context: CompletionContext,
): CompletionResult | null {
  const match = context.matchBefore(/\\[a-zA-Z]*/);
  if (!match || (match.from === match.to && !context.explicit)) return null;
  return { from: match.from, options: COMPLETIONS };
}

export const latexLanguage = StreamLanguage.define(stex);
