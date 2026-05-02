import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type StatAccent = 'purple' | 'orange' | 'cyan' | 'blue';

export interface StatRowProps {
  icon: ReactNode;
  value: string;
  label: string;
  accent?: StatAccent;
  className?: string;
}

const ACCENTS: Record<StatAccent, { bg: string; border: string; color: string }> = {
  purple: {
    bg: 'rgba(162,89,255,0.12)',
    border: 'rgba(162,89,255,0.4)',
    color: 'var(--c-purple)',
  },
  orange: {
    bg: 'rgba(255,138,0,0.14)',
    border: 'rgba(255,138,0,0.45)',
    color: 'var(--c-orange)',
  },
  cyan: {
    bg: 'rgba(0,229,255,0.12)',
    border: 'rgba(0,229,255,0.45)',
    color: 'var(--c-cyan)',
  },
  blue: {
    bg: 'rgba(79,124,255,0.14)',
    border: 'rgba(79,124,255,0.45)',
    color: 'var(--c-blue)',
  },
};

export function StatRow({
  icon,
  value,
  label,
  accent = 'purple',
  className,
}: StatRowProps) {
  const a = ACCENTS[accent];
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div
        className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
        style={{
          background: a.bg,
          boxShadow: `inset 0 0 0 1px ${a.border}`,
          color: a.color,
        }}
      >
        <span className="inline-flex w-[18px] h-[18px]">{icon}</span>
      </div>
      <div className="min-w-0 leading-tight">
        <div className="font-display text-sm font-semibold text-white truncate">{value}</div>
        <div className="text-pt-text-2 text-[11px] truncate">{label}</div>
      </div>
    </div>
  );
}
