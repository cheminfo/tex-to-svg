import { SECTIONS_MATH } from './latexSectionsMath.ts';
import { SECTIONS_SYMBOLS } from './latexSectionsSymbols.ts';
import type { GreekLetter } from './latexTypes.ts';

export type { DocEntry, DocSection, GreekLetter } from './latexTypes.ts';

export const GREEK_LETTERS: GreekLetter[] = [
  // Lowercase
  { command: String.raw`\alpha`, name: 'alpha' },
  { command: String.raw`\beta`, name: 'beta' },
  { command: String.raw`\gamma`, name: 'gamma' },
  { command: String.raw`\delta`, name: 'delta' },
  { command: String.raw`\epsilon`, name: 'epsilon' },
  { command: String.raw`\zeta`, name: 'zeta' },
  { command: String.raw`\eta`, name: 'eta' },
  { command: String.raw`\theta`, name: 'theta' },
  { command: String.raw`\iota`, name: 'iota' },
  { command: String.raw`\kappa`, name: 'kappa' },
  { command: String.raw`\lambda`, name: 'lambda' },
  { command: String.raw`\mu`, name: 'mu' },
  { command: String.raw`\nu`, name: 'nu' },
  { command: String.raw`\xi`, name: 'xi' },
  { command: String.raw`\pi`, name: 'pi' },
  { command: String.raw`\rho`, name: 'rho' },
  { command: String.raw`\sigma`, name: 'sigma' },
  { command: String.raw`\tau`, name: 'tau' },
  { command: String.raw`\upsilon`, name: 'upsilon' },
  { command: String.raw`\phi`, name: 'phi' },
  { command: String.raw`\chi`, name: 'chi' },
  { command: String.raw`\psi`, name: 'psi' },
  { command: String.raw`\omega`, name: 'omega' },
  // Uppercase (distinct shape from Latin)
  { command: String.raw`\Gamma`, name: 'Gamma' },
  { command: String.raw`\Delta`, name: 'Delta' },
  { command: String.raw`\Theta`, name: 'Theta' },
  { command: String.raw`\Lambda`, name: 'Lambda' },
  { command: String.raw`\Xi`, name: 'Xi' },
  { command: String.raw`\Pi`, name: 'Pi' },
  { command: String.raw`\Sigma`, name: 'Sigma' },
  { command: String.raw`\Phi`, name: 'Phi' },
  { command: String.raw`\Psi`, name: 'Psi' },
  { command: String.raw`\Omega`, name: 'Omega' },
];

export const SECTIONS = [...SECTIONS_MATH, ...SECTIONS_SYMBOLS];
