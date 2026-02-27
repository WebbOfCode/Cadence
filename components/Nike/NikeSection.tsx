'use client';

import { ReactNode } from 'react';

interface NikeSectionProps {
  children: ReactNode;
  className?: string;
  id?: string;
  darkMode?: boolean;
  fullBleed?: boolean;
}

export default function NikeSection({
  children,
  className = '',
  id,
  darkMode = false,
  fullBleed = false
}: NikeSectionProps) {
  const bgClass = darkMode ? 'bg-black text-white' : 'bg-white text-black';
  const padClass = fullBleed ? '' : 'py-24 md:py-32 lg:py-40';

  return (
    <section
      id={id}
      className={`w-full ${bgClass} ${padClass} ${className}`}
    >
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        {children}
      </div>
    </section>
  );
}
