'use client';

import { ReactNode } from 'react';

interface NikeCardProps {
  children: ReactNode;
  image?: string;
  title?: string;
  number?: string;
  overlay?: boolean;
  className?: string;
  href?: string;
}

export default function NikeCard({
  children,
  image,
  title,
  number,
  overlay = true,
  className = '',
  href
}: NikeCardProps) {
  const content = (
    <div className={`card-nike relative overflow-hidden bg-gray-100 ${className}`}>
      {image && (
        <>
          <div className="absolute inset-0 w-full h-full">
            <img 
              src={image}
              alt={title || 'Card image'}
              className="w-full h-full object-cover"
            />
          </div>
          {overlay && (
            <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-black/40"></div>
          )}
        </>
      )}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 z-10 text-white">
        {number && (
          <p className="label-text text-white/70 mb-3">{number}</p>
        )}
        {title && (
          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-tight">
            {title}
          </h3>
        )}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block h-full">
        {content}
      </a>
    );
  }

  return content;
}
