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
    } catch (error_) {
      return {
        svg: '',
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
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
