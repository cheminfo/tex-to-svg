import { useMemo, useState } from 'react';

import './LatexDocs.css';
import { KatexRenderer } from './KatexRenderer.tsx';
import type { DocSection, GreekLetter } from './latexSections.ts';
import { GREEK_LETTERS, SECTIONS } from './latexSections.ts';

interface Props {
  onSelect: (tex: string) => void;
}

function GreekGrid({
  letters,
  onSelect,
}: {
  letters: GreekLetter[];
  onSelect: (tex: string) => void;
}) {
  return (
    <div className="greek-grid">
      {letters.map((letter) => (
        <button
          key={letter.command}
          type="button"
          className="greek-cell"
          onClick={() => onSelect(letter.command)}
          title={letter.command}
        >
          <span className="greek-name">{letter.name}</span>
          <KatexRenderer tex={letter.command} displayMode={false} />
        </button>
      ))}
    </div>
  );
}

function DocRow({
  entry,
  accent,
  onSelect,
}: {
  entry: DocSection['entries'][0];
  accent: string;
  onSelect: (tex: string) => void;
}) {
  return (
    <button
      type="button"
      className="doc-row"
      style={{ '--accent': accent } as React.CSSProperties}
      onClick={() => onSelect(entry.tex)}
    >
      <div className="doc-row-left">
        <span className="doc-label">{entry.label}</span>
        <code className="doc-code">{entry.tex}</code>
      </div>
      <span className="doc-render">
        <KatexRenderer tex={entry.tex} displayMode={false} />
      </span>
    </button>
  );
}

function Section({
  section,
  onSelect,
}: {
  section: DocSection;
  onSelect: (tex: string) => void;
}) {
  return (
    <div
      className="doc-section"
      style={{ '--accent': section.accent } as React.CSSProperties}
    >
      <div className="doc-section-title">{section.title}</div>
      <div className="doc-rows">
        {section.entries.map((entry) => (
          <DocRow
            key={entry.tex}
            entry={entry}
            accent={section.accent}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

export function LatexDocs({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const lower = query.toLowerCase().trim();

  const filteredGreek = useMemo(
    () =>
      lower
        ? GREEK_LETTERS.filter(
            (g) =>
              g.name.toLowerCase().includes(lower) ||
              g.command.toLowerCase().includes(lower),
          )
        : GREEK_LETTERS,
    [lower],
  );

  const filteredSections = useMemo(() => {
    if (!lower) return SECTIONS;
    return SECTIONS.map((section) => ({
      ...section,
      entries: section.entries.filter(
        (entry) =>
          entry.label.toLowerCase().includes(lower) ||
          entry.tex.toLowerCase().includes(lower),
      ),
    })).filter(
      (section) =>
        section.entries.length > 0 ||
        section.title.toLowerCase().includes(lower),
    );
  }, [lower]);

  const totalResults =
    filteredGreek.length +
    filteredSections.reduce((sum, s) => sum + s.entries.length, 0);
  const isSearching = lower.length > 0;
  const hasResults = totalResults > 0;

  return (
    <div className="latex-docs">
      <div className="docs-search">
        <input
          className="search-input"
          type="search"
          placeholder="Search formulas, labels, commands…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search reference"
        />
      </div>

      {!isSearching && (
        <p className="docs-hint">Click any formula to load it in the editor.</p>
      )}

      {isSearching && !hasResults && (
        <p className="docs-no-results">
          No results for <strong>{query}</strong>
        </p>
      )}

      {filteredGreek.length > 0 && (
        <div
          className="doc-section"
          style={{ '--accent': '#e11d48' } as React.CSSProperties}
        >
          <div className="doc-section-title">Greek Letters</div>
          <GreekGrid letters={filteredGreek} onSelect={onSelect} />
        </div>
      )}

      {filteredSections.map((section) => (
        <Section key={section.title} section={section} onSelect={onSelect} />
      ))}
    </div>
  );
}
