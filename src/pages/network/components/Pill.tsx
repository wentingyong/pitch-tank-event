import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type PillTone = 'featured' | 'role' | 'frame' | 'eyebrow';

export interface PillProps {
  tone: PillTone;
  icon?: ReactNode;
  children: ReactNode;
  className?: string;
}

const toneClasses: Record<PillTone, string> = {
  featured:
    'relative bg-gradient-to-r from-pt-purple/30 to-pt-orange/25 text-white shadow-[inset_0_0_0_1px_rgba(220,200,255,0.45),0_0_14px_rgba(162,89,255,0.35)]',
  role:
    'relative bg-gradient-to-r from-pt-blue/25 to-pt-cyan/15 text-white shadow-[inset_0_0_0_1px_rgba(140,180,255,0.55),0_0_14px_rgba(79,124,255,0.35)]',
  frame:
    'relative bg-white/[0.02] text-pt-text-1 shadow-[inset_0_0_0_1px_rgba(184,212,255,0.35)]',
  eyebrow: 'text-pt-purple',
};

const sizeClasses: Record<PillTone, string> = {
  featured: 'px-3 py-[5px] text-[10px] font-display font-medium uppercase tracking-[0.16em] rounded-full',
  role: 'px-3 py-[5px] text-[10px] font-display font-medium uppercase tracking-[0.16em] rounded-full',
  frame: 'px-3 py-[5px] text-[10px] font-display font-medium uppercase tracking-[0.16em] rounded-full',
  eyebrow: 'text-[11px] font-display font-medium uppercase tracking-[0.22em]',
};

export function Pill({ tone, icon, children, className }: PillProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 whitespace-nowrap',
        toneClasses[tone],
        sizeClasses[tone],
        className,
      )}
    >
      {icon && <span className="inline-flex">{icon}</span>}
      {children}
    </span>
  );
}
