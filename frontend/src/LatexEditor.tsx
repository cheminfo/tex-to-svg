import { autocompletion } from '@codemirror/autocomplete';
import { EditorState } from '@codemirror/state';
import { EditorView, basicSetup } from 'codemirror';
import { useEffect, useRef } from 'react';

import { latexCompletionSource, latexLanguage } from './latex-completions.ts';

interface Props {
  value: string;
  onChange: (value: string) => void;
  onPasteUrl: (tex: string) => void;
}

const theme = EditorView.theme({
  '&': {
    fontSize: '13px',
    fontFamily: "'Fira Mono', 'Cascadia Code', 'Consolas', monospace",
    border: '1px solid #dde1e7',
    borderRadius: '6px',
    background: '#fafafa',
    minHeight: '160px',
  },
  '&.cm-focused': {
    outline: 'none',
    borderColor: '#4338ca',
    background: '#fff',
  },
  '.cm-scroller': { minHeight: '160px' },
  '.cm-content': { padding: '10px' },
  '.cm-line': { lineHeight: '1.5' },
  '.cm-tooltip.cm-tooltip-autocomplete': { fontFamily: 'inherit' },
});

const latexCompletion = latexLanguage.data.of({
  autocomplete: latexCompletionSource,
});

export function LatexEditor({ value, onChange, onPasteUrl }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const pasteExtension = EditorView.domEventHandlers({
      paste(event) {
        const pasted = event.clipboardData?.getData('text');
        if (!pasted) return false;
        try {
          const parsed = new URL(pasted);
          const texParam = parsed.searchParams.get('tex');
          if (texParam) {
            event.preventDefault();
            onPasteUrl(texParam);
            return true;
          }
        } catch {
          // not a URL — let default paste proceed
        }
        return false;
      },
    });

    const view = new EditorView({
      state: EditorState.create({
        doc: value,
        extensions: [
          basicSetup,
          latexLanguage,
          latexCompletion,
          autocompletion({ activateOnTyping: true }),
          theme,
          pasteExtension,
          EditorView.updateListener.of((update) => {
            if (update.docChanged) {
              onChange(update.state.doc.toString());
            }
          }),
        ],
      }),
      parent: containerRef.current,
    });

    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes (e.g. clicking an example)
  useEffect(() => {
    const view = viewRef.current;
    if (!view) return;
    const current = view.state.doc.toString();
    if (current !== value) {
      view.dispatch({
        changes: { from: 0, to: current.length, insert: value },
      });
    }
  }, [value]);

  return <div ref={containerRef} className="latex-editor" />;
}
