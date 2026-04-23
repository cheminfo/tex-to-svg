import { DEFAULT_EXAMPLES } from './examples.ts';
import { MathJaxRenderer } from './shared/MathJaxRenderer.tsx';

interface Props {
  onSelect: (tex: string) => void;
}

export function ExamplesPanel({ onSelect }: Props) {
  return (
    <div className="examples-panel">
      <p className="docs-hint">Click any formula to load it in the editor.</p>
      <table className="examples-table">
        <tbody>
          {DEFAULT_EXAMPLES.map((formula, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <tr key={index} onClick={() => onSelect(formula)}>
              <td className="formula-cell">
                <MathJaxRenderer tex={formula} displayMode={false} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
