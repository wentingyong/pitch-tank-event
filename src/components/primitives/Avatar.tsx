import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const avatarVariants = cva(
  'inline-flex items-center justify-center rounded-full font-display font-medium text-white overflow-hidden',
  {
    variants: {
      size: {
        sm: 'w-8 h-8 text-xs',
        md: 'w-10 h-10 text-sm',
        lg: 'w-14 h-14 text-base',
        xl: 'w-20 h-20 text-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface AvatarProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarVariants> {
  /** Image URL (e.g. dicebear / pravatar). If load fails, fallback to initials. */
  src?: string;
  /** Display name; first character used as initials fallback. */
  name?: string;
  /** Optional gradient hex stops for the initials background. */
  gradient?: [string, string];
}

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ className, size, src, name, gradient, ...props }, ref) => {
    const initial = (name?.[0] ?? '?').toUpperCase();
    const bgGradient = gradient
      ? `linear-gradient(135deg, ${gradient[0]}, ${gradient[1]})`
      : 'linear-gradient(135deg, var(--c-blue), var(--c-purple))';

    return (
      <div
        ref={ref}
        className={cn(avatarVariants({ size }), className)}
        style={{ background: bgGradient }}
        {...props}
      >
        {src ? (
          <img
            src={src}
            alt={name ?? ''}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Hide broken image so initials show through
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        ) : (
          <span>{initial}</span>
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
