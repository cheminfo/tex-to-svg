import type { ReactNode } from 'react';

import './SectionCard.css';

interface SectionCardProps {
  title: string;
  accent: string;
  children: ReactNode;
}

/** Titled section card with an accent colour, used in both reference panels. */
export function SectionCard({ title, accent, children }: SectionCardProps) {
  return (
    <div
      className="doc-section"
      style={{ '--accent': accent } as React.CSSProperties}
    >
      <div className="doc-section-title">{title}</div>
      <div className="doc-rows">{children}</div>
    </div>
  );
}
