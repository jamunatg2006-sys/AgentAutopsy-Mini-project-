import React from 'react';

export type BadgeVariant = 
  | 'failure'     // 🔴 Coral Red (#FF647C)
  | 'suspicious'  // 🟠 Amber (#FFBD59)
  | 'warning'     // 🟡 Amber
  | 'analysis'    // 🟣 Electric Violet (#9B72FF)
  | 'flow'        // 🔵 Cyan (#42D9F5)
  | 'verified'    // 🟢 Mint Green (#4DDBA5)
  | 'neutral';    // ⚪ Muted

interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  variant,
  children,
  className = '',
  size = 'md',
  dot = false,
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    failure: 'bg-[#FF647C]/10 text-[#FF647C] border-[#FF647C]/30 shadow-[0_0_12px_rgba(255,100,124,0.15)]',
    suspicious: 'bg-[#FFBD59]/10 text-[#FFBD59] border-[#FFBD59]/30 shadow-[0_0_12px_rgba(255,189,89,0.15)]',
    warning: 'bg-[#FFBD59]/10 text-[#FFBD59] border-[#FFBD59]/30',
    analysis: 'bg-[#9B72FF]/10 text-[#9B72FF] border-[#9B72FF]/30 shadow-[0_0_12px_rgba(155,114,255,0.15)]',
    flow: 'bg-[#42D9F5]/10 text-[#42D9F5] border-[#42D9F5]/30 shadow-[0_0_12px_rgba(66,217,245,0.15)]',
    verified: 'bg-[#4DDBA5]/10 text-[#4DDBA5] border-[#4DDBA5]/30 shadow-[0_0_12px_rgba(77,219,165,0.15)]',
    neutral: 'bg-[#202B43] text-[#A7B0C5] border-[#25324E]',
  };

  const dotColors: Record<BadgeVariant, string> = {
    failure: 'bg-[#FF647C]',
    suspicious: 'bg-[#FFBD59]',
    warning: 'bg-[#FFBD59]',
    analysis: 'bg-[#9B72FF]',
    flow: 'bg-[#42D9F5]',
    verified: 'bg-[#4DDBA5]',
    neutral: 'bg-[#737F98]',
  };

  const sizeStyles = {
    sm: 'px-2.5 py-1 text-sm',
    md: 'px-3 py-1 text-sm font-medium',
    lg: 'px-3.5 py-1.5 text-base font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 border font-sans rounded-full ${sizeStyles} ${variantStyles[variant]} ${className}`}
    >
      {dot && (
        <span className="relative flex h-2 w-2">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColors[variant]}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColors[variant]}`} />
        </span>
      )}
      <span>{children}</span>
    </span>
  );
};
