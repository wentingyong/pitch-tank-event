import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * GlassCard — the foundational container for all PitchTank UI.
 *
 * tone × size × active are the three axes of variation.
 * All visual rules live in tokens.css; this file only maps props → class names.
 */
const cardVariants = cva('glass-card', {
  variants: {
    tone: {
      frame:    'tone-frame',
      primary:  'tone-primary',
      purple:   'tone-purple',
      cyan:     'tone-cyan',
      featured: 'tone-featured',
      neutral:  'tone-neutral',
      negative: 'tone-negative',
    },
    size: {
      sm: 'size-sm',
      md: 'size-md',
      lg: 'size-lg',
    },
  },
  defaultVariants: {
    tone: 'neutral',
    size: 'md',
  },
});

export interface GlassCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Active state. Currently only meaningful for `tone="neutral"`
   * (brightens the border to indicate the row is expanded / focused).
   */
  active?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, tone, size, active, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ tone, size }), active && 'active', className)}
      {...props}
    />
  )
);

GlassCard.displayName = 'GlassCard';
