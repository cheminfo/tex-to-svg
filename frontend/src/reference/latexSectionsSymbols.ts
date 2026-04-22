import type { DocSection } from './latexTypes.ts';

export const SECTIONS_SYMBOLS: DocSection[] = [
  {
    title: 'Arrows',
    accent: '#0891b2',
    entries: [
      { tex: String.raw`f \colon \mathbb{R} \to \mathbb{R}`, label: 'Function type' },
      { tex: String.raw`x \mapsto x^2 + 1`, label: 'Element map' },
      { tex: String.raw`A \xrightarrow{\;\phi\;} B`, label: 'Labeled arrow' },
      { tex: String.raw`P \iff Q`, label: 'If and only if' },
      { tex: String.raw`A \hookrightarrow B`, label: 'Injection (hook)' },
      { tex: String.raw`A \twoheadrightarrow B`, label: 'Surjection' },
      { tex: String.raw`a \rightsquigarrow b`, label: 'Squiggly arrow' },
    ],
  },
  {
    title: 'Accents & Decorations',
    accent: '#db2777',
    entries: [
      { tex: String.raw`\hat{x},\quad \bar{x},\quad \vec{v}`, label: 'Hat, bar, vec' },
      { tex: String.raw`\dot{x},\quad \ddot{x}`, label: 'Time derivatives' },
      { tex: String.raw`\tilde{x},\quad \widetilde{ABC}`, label: 'Tilde / widetilde' },
      { tex: String.raw`\underbrace{a + b + c}_{\text{sum}}`, label: 'Underbrace with label' },
      { tex: String.raw`\overbrace{1 + 2 + \cdots + n}^{n\text{ terms}}`, label: 'Overbrace' },
      { tex: String.raw`\boxed{E = mc^2}`, label: 'Boxed formula' },
      { tex: String.raw`\cancel{x} + \bcancel{y}`, label: 'Strikethrough (cancel)' },
    ],
  },
  {
    title: 'Matrices',
    accent: '#4f46e5',
    entries: [
      { tex: String.raw`\begin{pmatrix} a & b \\ c & d \end{pmatrix}`, label: 'Round brackets (pmatrix)' },
      { tex: String.raw`\begin{bmatrix} 1 & 0 \\ 0 & 1 \end{bmatrix}`, label: 'Square brackets — identity' },
      { tex: String.raw`\begin{vmatrix} a & b \\ c & d \end{vmatrix} = ad - bc`, label: 'Determinant' },
      { tex: String.raw`\mathbf{v} = \begin{pmatrix} x \\ y \\ z \end{pmatrix}`, label: 'Column vector' },
      { tex: String.raw`A^{-1} = \frac{1}{\det A}\begin{pmatrix} d & -b \\ -c & a \end{pmatrix}`, label: '2×2 inverse' },
      { tex: String.raw`\mathbf{A}\mathbf{x} = \lambda\mathbf{x}`, label: 'Eigenvalue equation' },
    ],
  },
  {
    title: 'Environments',
    accent: '#b45309',
    entries: [
      {
        tex: String.raw`\begin{aligned} a &= b + c \\ &= d + e \end{aligned}`,
        label: 'Aligned multi-line',
      },
      {
        tex: String.raw`|x| = \begin{cases} x & x \geq 0 \\ -x & x < 0 \end{cases}`,
        label: 'Piecewise function',
      },
      {
        tex: String.raw`\begin{aligned} x + y &= 1 \\ x - y &= 0 \end{aligned}`,
        label: 'System of equations',
      },
      {
        tex: String.raw`\def\arraystretch{1.5}\begin{array}{c:c} a & b \\ \hline c & d \end{array}`,
        label: 'Array / table with rules',
      },
      {
        tex: String.raw`\begin{pmatrix} a & b & c \\ d & e & f \\ g & h & i \end{pmatrix}`,
        label: '3×3 matrix',
      },
    ],
  },
  {
    title: 'Physics',
    accent: '#dc2626',
    entries: [
      { tex: String.raw`i\hbar\,\frac{\partial}{\partial t}\Psi = \hat{H}\Psi`, label: 'Schrödinger equation' },
      { tex: String.raw`\Delta x\,\Delta p \geq \frac{\hbar}{2}`, label: 'Heisenberg uncertainty' },
      { tex: String.raw`\nabla \times \mathbf{B} = \mu_0 \mathbf{J} + \mu_0\varepsilon_0 \frac{\partial \mathbf{E}}{\partial t}`, label: 'Maxwell – Ampère' },
      { tex: String.raw`S = k_{\mathrm{B}} \ln W`, label: 'Boltzmann entropy' },
      { tex: String.raw`F = G\,\frac{m_1 m_2}{r^2}`, label: 'Gravitational force' },
      { tex: String.raw`\gamma = \frac{1}{\sqrt{1 - v^2/c^2}}`, label: 'Lorentz factor' },
    ],
  },
  {
    title: 'Famous Identities',
    accent: '#854d0e',
    entries: [
      { tex: String.raw`e^{i\pi} + 1 = 0`, label: "Euler's identity" },
      { tex: String.raw`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`, label: 'Quadratic formula' },
      { tex: String.raw`P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B)}`, label: "Bayes' theorem" },
      { tex: String.raw`f(x) = \frac{1}{\sigma\sqrt{2\pi}}\,e^{-\frac{(x-\mu)^2}{2\sigma^2}}`, label: 'Gaussian distribution' },
      { tex: String.raw`\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s}`, label: 'Riemann zeta function' },
      { tex: String.raw`1 + \frac{1}{4} + \frac{1}{9} + \cdots = \frac{\pi^2}{6}`, label: 'Basel problem' },
      { tex: String.raw`(a+b)^n = \sum_{k=0}^{n}\binom{n}{k}a^k b^{n-k}`, label: 'Binomial theorem' },
    ],
  },
];
