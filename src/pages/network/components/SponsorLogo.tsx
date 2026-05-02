import { useEffect, useState, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';
import type { LogoStyle } from '../fixtures';

export interface SponsorLogoProps {
  src: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
  /** Defaults to 'white' if omitted. */
  style?: LogoStyle;
  className?: string;
}

const sizeClasses: Record<NonNullable<SponsorLogoProps['size']>, string> = {
  sm: 'w-8 h-8 p-1',
  md: 'w-16 h-16 p-2',
  lg: 'w-[120px] h-[120px] p-3',
};

const fontByLetter: Record<NonNullable<SponsorLogoProps['size']>, string> = {
  sm: 'text-xs',
  md: 'text-lg',
  lg: 'text-3xl',
};

/**
 * Image-rendering strategy per logoStyle:
 *
 * - 'white' — flatten to solid white silhouette. Works for logos that have
 *   light/transparent backgrounds with colored content.
 *
 * - 'mono' — keep tonal hierarchy but desaturate to B&W; uses lighten blend
 *   so dark backgrounds drop into the card. Good for logos already designed
 *   as white-on-black (e.g. Carleton).
 *
 * - 'as-is' — no color transform; uses lighten blend so any dark/black
 *   background (e.g. AGI VC's solid black) drops out cleanly without
 *   showing as a black square on the colored card.
 */
const styleFor: Record<LogoStyle, CSSProperties> = {
  white: {
    filter: 'brightness(0) invert(1)',
  },
  mono: {
    filter: 'grayscale(1) brightness(1.05)',
    mixBlendMode: 'lighten',
  },
  'as-is': {
    mixBlendMode: 'lighten',
  },
};

export function SponsorLogo({
  src,
  name,
  size = 'md',
  style = 'white',
  className,
}: SponsorLogoProps) {
  const [broken, setBroken] = useState(false);

  useEffect(() => {
    setBroken(false);
  }, [src]);

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center bg-transparent',
        sizeClasses[size],
        className,
      )}
      aria-label={name}
    >
      {broken ? (
        <span
          className={cn(
            'font-display font-semibold text-white opacity-90',
            fontByLetter[size],
          )}
        >
          {name[0]?.toUpperCase() ?? '?'}
        </span>
      ) : (
        <img
          src={src}
          alt={name}
          loading="lazy"
          decoding="async"
          className="w-full h-full object-contain"
          style={styleFor[style]}
          onError={() => setBroken(true)}
        />
      )}
    </div>
  );
}
