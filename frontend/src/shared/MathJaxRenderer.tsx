import { useMemo } from 'react';

import { renderToSvg } from './mathjax.ts';

interface MathJaxRendererProps {
  tex: string;
  displayMode?: boolean;
  className?: string;
}

export function MathJaxRenderer({
  tex,
  displayMode = false,
  className,
}: MathJaxRendererProps) {
  const { svg, error } = useMemo(() => {
    try {
      return { svg: renderToSvg(tex, displayMode), error: null };
    } catch (err) {
      return {
        svg: '',
        error: err instanceof Error ? err.message : String(err),
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
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
