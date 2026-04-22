import katex from 'katex';
import { useMemo } from 'react';

interface KatexRendererProps {
  tex: string;
  displayMode?: boolean;
  className?: string;
}

export function KatexRenderer({
  tex,
  displayMode = false,
  className,
}: KatexRendererProps) {
  const { html, error } = useMemo(() => {
    try {
      return {
        html: katex.renderToString(tex, {
          displayMode,
          throwOnError: false,
          output: 'html',
        }),
        error: null,
      };
    } catch (error_) {
      return {
        html: '',
        error: error_ instanceof Error ? error_.message : String(error_),
      };
    }
  }, [tex, displayMode]);

  if (error) {
    return (
      <span className={className} style={{ color: '#c0392b', fontSize: 12 }}>
        {error}
      </span>
    );
  }

  return (
    <span
      className={className}
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
