import './DocSearchBox.css';

interface DocSearchBoxProps {
  query: string;
  onChange: (query: string) => void;
  placeholder: string;
  ariaLabel: string;
  hint: string;
  isSearching: boolean;
  hasResults: boolean;
}

/** Search input with hint and empty-state message, shared by both reference panels. */
export function DocSearchBox({
  query,
  onChange,
  placeholder,
  ariaLabel,
  hint,
  isSearching,
  hasResults,
}: DocSearchBoxProps) {
  return (
    <>
      <div className="docs-search">
        <input
          className="search-input"
          type="search"
          placeholder={placeholder}
          value={query}
          onChange={(e) => onChange(e.target.value)}
          aria-label={ariaLabel}
        />
      </div>
      {!isSearching && <p className="docs-hint">{hint}</p>}
      {isSearching && !hasResults && (
        <p className="docs-no-results">
          No results for <strong>{query}</strong>
        </p>
      )}
    </>
  );
}
