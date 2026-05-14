"use client";
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const ButtonCustom: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-brand-rust text-pure-white hover:bg-deep-black shadow-lg hover:shadow-xl transform hover:-translate-y-0.5",
    outline: "border-2 border-brand-rust text-brand-rust hover:bg-brand-rust hover:text-pure-white",
    ghost: "text-deep-black hover:text-brand-rust"
  };

  const sizes = {
    sm: "px-4 py-2 text-[10px]",
    md: "px-8 py-4 text-xs",
    lg: "px-12 py-5 text-sm"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
