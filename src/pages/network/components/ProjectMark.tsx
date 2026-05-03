import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface ProjectMarkProps {
  src?: string;
  letter?: string;
  icon?: ReactNode;
  size?: 'md' | 'lg';
  className?: string;
}

const sizeClasses: Record<NonNullable<ProjectMarkProps['size']>, string> = {
  md: 'w-12 h-12',
  lg: 'w-[68px] h-[68px]',
};

const letterFont: Record<NonNullable<ProjectMarkProps['size']>, string> = {
  md: 'text-base',
  lg: 'text-2xl',
};

const HEX_PATH =
  'polygon(25% 0, 75% 0, 100% 50%, 75% 100%, 25% 100%, 0 50%)';

export function ProjectMark({
  src,
  letter,
  icon,
  size = 'md',
  className,
}: ProjectMarkProps) {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [src]);

  const showImage = !!src && !broken;

  return (
    <div
      aria-hidden
      className={cn('relative inline-flex items-center justify-center', sizeClasses[size], className)}
    >
      {/* Soft outer glow */}
      <div
        className="absolute inset-[-6px] opacity-70 blur-md"
        style={{
          clipPath: HEX_PATH,
          background:
            'linear-gradient(135deg, rgba(79,124,255,0.55), rgba(162,89,255,0.65))',
        }}
      />
      {/* Hex body */}
      <div
        className="relative w-full h-full flex items-center justify-center text-white"
        style={{
          clipPath: HEX_PATH,
          background:
            'linear-gradient(135deg, var(--c-blue) 0%, var(--c-purple) 100%)',
          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
        }}
      >
        {showImage ? (
          <img
            src={src}
            alt=""
            className="w-full h-full object-cover"
            onError={() => setBroken(true)}
          />
        ) : icon ? (
          <span className="inline-flex">{icon}</span>
        ) : (
          <span
            className={cn(
              'font-display font-semibold',
              letterFont[size],
            )}
            style={{
              textShadow: '0 0 12px rgba(255,255,255,0.55)',
            }}
          >
            {letter ?? '?'}
          </span>
        )}
      </div>
    </div>
  );
}
