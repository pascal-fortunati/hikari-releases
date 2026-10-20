import type { ReactNode } from 'react';
import { Icon } from './icon';

export function PageIntro({
  eyebrow,
  title,
  description,
  meta,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  meta?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="page-intro page-intro-designed" data-reveal>
      <div className="page-hero-copy">
        <p className="eyebrow">
          <span className="eyebrow-line" />
          {eyebrow}
        </p>
        <h1>{title}</h1>
        {description && <p className="page-hero-description">{description}</p>}
        {meta && <div className="page-hero-meta">{meta}</div>}
      </div>
      {children && <div className="page-hero-aside">{children}</div>}
    </header>
  );
}

export function PageStamp({
  icon,
  label,
  value,
  children,
}: {
  icon: string;
  label: string;
  value: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="page-stamp">
      <Icon name={icon} />
      <span className="page-stamp-label">{label}</span>
      <strong>{value}</strong>
      {children && <p>{children}</p>}
    </div>
  );
}
