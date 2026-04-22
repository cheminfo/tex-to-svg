export const DEFAULT_EXAMPLES: string[] = [
  // Classic identities
  String.raw`e^{i\pi} + 1 = 0`,
  String.raw`x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}`,
  String.raw`P(A \mid B) = \frac{P(B \mid A)\,P(A)}{P(B)}`,
  String.raw`\zeta(s) = \sum_{n=1}^{\infty} \frac{1}{n^s} = \prod_{p\;\text{prime}} \frac{1}{1-p^{-s}}`,

  // Physics
  String.raw`L' = L\sqrt{1 - \frac{v^2}{c^2}}`,
  String.raw`i\hbar\frac{\partial}{\partial t}\Psi = \left[-\frac{\hbar^2}{2m}\nabla^2 + V\right]\Psi`,
  String.raw`G_{\mu\nu} + \Lambda g_{\mu\nu} = \frac{8\pi G}{c^4}\,T_{\mu\nu}`,
  String.raw`\begin{aligned}
  \nabla \cdot \mathbf{E} &= \frac{\rho}{\varepsilon_0} \\
  \nabla \cdot \mathbf{B} &= 0 \\
  \nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
  \nabla \times \mathbf{B} &= \mu_0\mathbf{J} + \mu_0\varepsilon_0\frac{\partial \mathbf{E}}{\partial t}
\end{aligned}`,

  // Analysis
  String.raw`\hat{f}(\xi) = \int_{-\infty}^{\infty} f(x)\,e^{-2\pi i x\xi}\,dx`,
  String.raw`f(a) = \frac{1}{2\pi i}\oint_\gamma \frac{f(z)}{z - a}\,dz`,
  String.raw`f(x) = \sum_{n=0}^{\infty} \frac{f^{(n)}(a)}{n!}(x-a)^n`,
  String.raw`\oint_{\partial\Sigma}\mathbf{F}\cdot d\boldsymbol{\ell} = \iint_{\Sigma}(\nabla\times\mathbf{F})\cdot d\mathbf{S}`,

  // Probability & statistics
  String.raw`f(x) = \frac{1}{\sigma\sqrt{2\pi}}\exp\!\left(-\frac{(x-\mu)^2}{2\sigma^2}\right)`,
  String.raw`(a+b)^n = \sum_{k=0}^{n}\binom{n}{k}a^k b^{n-k}`,

  // Linear algebra
  String.raw`\mathbf{u}\times\mathbf{v} = \begin{vmatrix}\mathbf{i}&\mathbf{j}&\mathbf{k}\\u_1&u_2&u_3\\v_1&v_2&v_3\end{vmatrix}`,
  String.raw`A^{-1} = \frac{1}{\det A}\begin{pmatrix}d & -b \\ -c & a\end{pmatrix}`,

  // Environments & notation
  String.raw`|x| = \begin{cases} x & x \geq 0 \\ -x & x < 0 \end{cases}`,
  String.raw`\begin{aligned}
  (a+b)^2 &= (a+b)(a+b) \\
           &= a^2 + 2ab + b^2
\end{aligned}`,
  String.raw`\def\arraystretch{1.5}\begin{array}{c:c:c}a & b & c \\ \hline d & e & f \\ \hdashline g & h & i\end{array}`,
  String.raw`\underbrace{a + b + c}_{\text{sum}} = \overbrace{x + y}^{\text{parts}}`,
  String.raw`\boxed{E = mc^2}`,
  String.raw`\sum_{n=1}^{\infty} 2^{-n} = 1`,
  String.raw`\int_{a}^{b} x^2\,dx = \left[\frac{x^3}{3}\right]_a^b`,
];
