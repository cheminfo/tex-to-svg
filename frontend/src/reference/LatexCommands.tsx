import { useMemo, useState } from 'react';

import { DocSearchBox } from '../shared/DocSearchBox.tsx';
import { MathJaxRenderer } from '../shared/MathJaxRenderer.tsx';
import { SectionCard } from '../shared/SectionCard.tsx';
import './LatexCommands.css';
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

export function LatexCommands({ onSelect }: Props) {
  const [query, setQuery] = useState('');
  const lower = query.toLowerCase().trim();
  const isSearching = lower.length > 0;

  const filteredGroups = useMemo(() => {
    if (!isSearching) return COMMAND_GROUPS;
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
  }, [lower, isSearching]);

  const totalResults = filteredGroups.reduce(
    (sum, g) => sum + g.entries.length,
    0,
  );

  return (
    <div className="latex-docs">
      <DocSearchBox
        query={query}
        onChange={setQuery}
        placeholder="Search commands, symbols, descriptions…"
        ariaLabel="Search commands"
        hint="Click any command to load it in the editor."
        isSearching={isSearching}
        hasResults={totalResults > 0}
      />

      {filteredGroups.map((group: CommandGroup) => (
        <SectionCard
          key={group.title}
          title={group.title}
          accent={group.accent}
        >
          {group.entries.map((entry) => (
            <CommandRow
              key={entry.label}
              entry={entry}
              accent={group.accent}
              onSelect={onSelect}
            />
          ))}
        </SectionCard>
      ))}
    </div>
  );
}
