import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface MoneyProps {
  /** The numeric amount. */
  value: number;
  /** Decimals to show. Default: 2. */
  decimals?: number;
  /** Prepend "$" symbol. Default: true. */
  withSymbol?: boolean;
  /** Custom className passthrough. */
  className?: string;
}

/**
 * Money — formatted currency with tabular numerics.
 *
 *   <Money value={23094.57} />              → "$23,094.57"
 *   <Money value={1000} decimals={0} />     → "$1,000"
 *   <Money value={84200} withSymbol={false} /> → "84,200.00"
 *
 * Always uses tabular-nums so digit columns align in lists.
 */
export function Money({
  value,
  decimals = 2,
  withSymbol = true,
  className,
}: MoneyProps) {
  return (
    <span className={cn('num', className)}>
      {formatMoney(value, decimals, withSymbol)}
    </span>
  );
}
