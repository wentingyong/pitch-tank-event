import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

const iconButtonVariants = cva('icon-btn', {
  variants: {
    size: {
      sm: 'icon-btn-sm',
      md: 'icon-btn-md',
      lg: 'icon-btn-lg',
    },
  },
  defaultVariants: {
    size: 'md',
  },
});

export interface IconButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof iconButtonVariants> {
  active?: boolean;
  /** lucide icon component, e.g. <Bell /> */
  icon: ReactNode;
  'aria-label': string; // required for accessibility
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size, active, icon, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(iconButtonVariants({ size }), active && 'active', className)}
      {...props}
    >
      {icon}
    </button>
  )
);

IconButton.displayName = 'IconButton';
