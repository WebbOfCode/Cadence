'use client';

import { ReactNode } from 'react';

type HeadlineLevel = 'h1' | 'h2' | 'h3' | 'h4';

interface NikeHeadlineProps {
  children: ReactNode;
  level?: HeadlineLevel;
  className?: string;
}

const styles = {
  h1: 'text-6xl md:text-8xl lg:text-9xl',
  h2: 'text-4xl md:text-6xl lg:text-7xl',
  h3: 'text-3xl md:text-4xl lg:text-5xl',
  h4: 'text-2xl md:text-3xl lg:text-4xl'
};

export default function NikeHeadline({
  children,
  level = 'h2',
  className = ''
}: NikeHeadlineProps) {
  const baseClass = `font-black uppercase tracking-tighter leading-none`;
  const Component = level;

  return (
    <Component
      className={`
        ${baseClass}
        ${styles[level]}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}
