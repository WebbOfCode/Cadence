'use client';

import { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline-white' | 'outline-black' | 'white';
type ButtonSize = 'sm' | 'md' | 'lg';

interface NikeButtonProps {
  onClick?: () => void;
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  ariaLabel?: string;
}

const variants = {
  primary: 'bg-black text-white hover:bg-gray-800',
  secondary: 'bg-white text-black border-2 border-black hover:bg-black hover:text-white',
  'outline-white': 'bg-transparent text-white border-2 border-white hover:bg-white hover:text-black',
  'outline-black': 'bg-transparent text-black border-2 border-black hover:bg-black hover:text-white',
  white: 'bg-white text-black hover:bg-gray-100'
};

const sizes = {
  sm: 'px-6 py-2 text-xs',
  md: 'px-8 py-3 text-sm',
  lg: 'px-12 py-5 text-base'
};

export default function NikeButton({
  onClick,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
  ariaLabel
}: NikeButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={`
        inline-flex items-center justify-center
        font-bold uppercase tracking-wider
        rounded-full
        transition-all duration-300
        hover:scale-105
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </button>
  );
}
