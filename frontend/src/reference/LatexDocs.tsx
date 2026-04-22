import { useMemo, useState } from 'react';

import { DocSearchBox } from '../shared/DocSearchBox.tsx';
import { MathJaxRenderer } from '../shared/MathJaxRenderer.tsx';
import { SectionCard } from '../shared/SectionCard.tsx';
import './LatexDocs.css';
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
          <MathJaxRenderer tex={letter.command} displayMode={false} />
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
        <MathJaxRenderer tex={entry.tex} displayMode={false} />
      </span>
    </button>
  );
}

export function LatexDocs({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const lower = query.toLowerCase().trim();
  const isSearching = lower.length > 0;

  const filteredGreek = useMemo(
    () =>
      isSearching
        ? GREEK_LETTERS.filter(
            (g) =>
              g.name.toLowerCase().includes(lower) ||
              g.command.toLowerCase().includes(lower),
          )
        : GREEK_LETTERS,
    [lower, isSearching],
  );

  const filteredSections = useMemo(() => {
    if (!isSearching) return SECTIONS;
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
  }, [lower, isSearching]);

  const totalResults =
    filteredGreek.length +
    filteredSections.reduce((sum, s) => sum + s.entries.length, 0);

  return (
    <div className="latex-docs">
      <DocSearchBox
        query={query}
        onChange={setQuery}
        placeholder="Search formulas, labels, commands…"
        ariaLabel="Search reference"
        hint="Click any formula to load it in the editor."
        isSearching={isSearching}
        hasResults={totalResults > 0}
      />

      {filteredGreek.length > 0 && (
        <SectionCard title="Greek Letters" accent="#e11d48">
          <GreekGrid letters={filteredGreek} onSelect={onSelect} />
        </SectionCard>
      )}

      {filteredSections.map((section) => (
        <SectionCard
          key={section.title}
          title={section.title}
          accent={section.accent}
        >
          {section.entries.map((entry) => (
            <DocRow
              key={entry.tex}
              entry={entry}
              accent={section.accent}
              onSelect={onSelect}
            />
          ))}
        </SectionCard>
      ))}
    </div>
  );
}
