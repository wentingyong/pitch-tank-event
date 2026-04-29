import { cn } from '@/lib/utils';

export interface TrendValueProps {
  /** The numeric percentage. Positive renders cyan, negative renders orange. */
  value: number;
  /** Decimals to show. Default: 2. */
  decimals?: number;
  /** Show "+" before positive numbers. Default: true. */
  showSign?: boolean;
  /** Add the % suffix. Default: true. */
  showPercent?: boolean;
  /** Custom className passthrough. */
  className?: string;
}

/**
 * Auto-coloured trend value for percentages.
 *
 *   <TrendValue value={1.98}  />  → "+1.98%" in cyan
 *   <TrendValue value={-4.21} />  → "-4.21%" in orange
 *
 * Single source of truth for positive/negative colouring across PitchTank.
 */
export function TrendValue({
  value,
  decimals = 2,
  showSign = true,
  showPercent = true,
  className,
}: TrendValueProps) {
  const isPositive = value >= 0;
  const sign = showSign && isPositive ? '+' : '';
  const suffix = showPercent ? '%' : '';

  return (
    <span
      className={cn(
        'num font-display font-medium',
        isPositive ? 'text-pt-cyan' : 'text-pt-orange',
        className
      )}
      style={{
        textShadow: isPositive
          ? '0 0 8px rgba(0,229,255,0.6)'
          : '0 0 8px rgba(255,138,0,0.5)',
      }}
    >
      {sign}{value.toFixed(decimals)}{suffix}
    </span>
  );
}
