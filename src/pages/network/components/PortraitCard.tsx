import { useEffect, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export type PortraitAspect = 'portrait' | 'square';
export type PortraitSize = 'sm' | 'md' | 'lg';

export interface PortraitCardProps {
  photo: string;
  name: string;
  aspect?: PortraitAspect;
  size?: PortraitSize;
  overlay?: ReactNode;
  className?: string;
}

const aspectClass: Record<PortraitAspect, string> = {
  portrait: 'aspect-[4/5]',
  square: 'aspect-square',
};

export function PortraitCard({
  photo,
  name,
  aspect = 'portrait',
  size: _size,
  overlay,
  className,
}: PortraitCardProps) {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [photo]);

  return (
    <div
      className={cn(
        'relative w-full overflow-hidden rounded-2xl bg-white/[0.04]',
        'shadow-[inset_0_0_0_1px_rgba(184,212,255,0.16)]',
        aspectClass[aspect],
        className,
      )}
    >
      {broken ? (
        <div
          className="absolute inset-0 flex items-center justify-center font-display text-3xl font-semibold text-white"
          style={{
            background:
              'linear-gradient(135deg, var(--c-blue), var(--c-purple))',
          }}
        >
          {name[0]?.toUpperCase() ?? '?'}
        </div>
      ) : (
        <img
          src={photo}
          alt={name}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover"
          onError={() => setBroken(true)}
        />
      )}

      {/* Subtle gradient border ring */}
      <div
        aria-hidden
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          padding: 1,
          background:
            'linear-gradient(135deg, rgba(162,89,255,0.55), rgba(79,124,255,0.25) 50%, rgba(162,89,255,0.45))',
          WebkitMask:
            'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
        }}
      />

      {overlay && <div className="absolute inset-0">{overlay}</div>}
    </div>
  );
}
