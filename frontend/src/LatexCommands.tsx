import { useMemo, useState } from 'react';

import './LatexCommands.css';
import { MathJaxRenderer } from './MathJaxRenderer.tsx';
import type { CommandEntry, CommandGroup } from './latexCommandList.ts';
import { COMMAND_GROUPS } from './latexCommandList.ts';

interface Props {
  onSelect: (tex: string) => void;
}

function CommandRow({
  entry,
  accent,
  onSelect,
}: {
  entry: CommandEntry;
  accent: string;
  onSelect: (tex: string) => void;
}) {
  return (
    <button
      type="button"
      className="cmd-row"
      style={{ '--accent': accent } as React.CSSProperties}
      onClick={() => onSelect(entry.sample ?? entry.label)}
    >
      <div className="cmd-row-left">
        <div className="cmd-signature">
          <span className="cmd-name">{entry.label}</span>
          {entry.syntax && (
            <span className="cmd-syntax">{entry.syntax}</span>
          )}
        </div>
        <span className="cmd-info">{entry.info}</span>
      </div>
      {entry.sample && (
        <span className="cmd-render">
          <MathJaxRenderer tex={entry.sample} displayMode={false} />
        </span>
      )}
    </button>
  );
}

function CommandSection({
  group,
  onSelect,
}: {
  group: CommandGroup;
  onSelect: (tex: string) => void;
}) {
  return (
    <div
      className="doc-section"
      style={{ '--accent': group.accent } as React.CSSProperties}
    >
      <div className="doc-section-title">{group.title}</div>
      <div className="doc-rows">
        {group.entries.map((entry) => (
          <CommandRow
            key={entry.label}
            entry={entry}
            accent={group.accent}
            onSelect={onSelect}
          />
        ))}
      </div>
    </div>
  );
}

export function LatexCommands({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const lower = query.toLowerCase().trim();

  const filteredGroups = useMemo(() => {
    if (!lower) return COMMAND_GROUPS;
    return COMMAND_GROUPS.map((group) => ({
      ...group,
      entries: group.entries.filter(
        (entry) =>
          entry.label.toLowerCase().includes(lower) ||
          entry.info.toLowerCase().includes(lower) ||
          entry.syntax.toLowerCase().includes(lower),
      ),
    })).filter(
      (group) =>
        group.entries.length > 0 ||
        group.title.toLowerCase().includes(lower),
    );
  }, [lower]);

  const totalResults = filteredGroups.reduce(
    (sum, g) => sum + g.entries.length,
    0,
  );

  return (
    <div className="latex-docs">
      <div className="docs-search">
        <input
          className="search-input"
          type="search"
          placeholder="Search commands, symbols, descriptions…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search commands"
        />
      </div>

      {lower && !totalResults && (
        <p className="docs-no-results">
          No results for <strong>{query}</strong>
        </p>
      )}

      {!lower && (
        <p className="docs-hint">Click any command to load it in the editor.</p>
      )}

      {filteredGroups.map((group) => (
        <CommandSection key={group.title} group={group} onSelect={onSelect} />
      ))}
    </div>
  );
}
