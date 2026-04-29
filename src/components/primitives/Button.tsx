import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva('btn', {
  variants: {
    variant: {
      primary:   'btn-primary',
      featured:  'btn-featured',
      buy:       'btn-buy',
      sell:      'btn-sell',
      secondary: 'btn-secondary',
      tertiary:  'btn-tertiary',
    },
    size: {
      lg: 'btn-lg',
      md: 'btn-md',
      sm: 'btn-sm',
    },
    shimmer: {
      true: 'btn-shimmer',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  loadingText?: string;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, shimmer, loading, loadingText, disabled, children, ...props }, ref) => {
    // featured variant requires children to be wrapped in <span> for gradient text clipping
    const renderChildren = (content: ReactNode) => {
      if (variant === 'featured' && typeof content !== 'object') {
        return <span>{content}</span>;
      }
      return content;
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(buttonVariants({ variant, size, shimmer }), className)}
        {...props}
      >
        {loading ? (
          <>
            <Loader2 className="w-3.5 h-3.5 animate-spin" strokeWidth={2} />
            {renderChildren(loadingText ?? children)}
          </>
        ) : (
          renderChildren(children)
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';
