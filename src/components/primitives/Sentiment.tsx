import { cn } from '@/lib/utils';

export interface SentimentProps {
  /** Percentage value 0-100. */
  value: number;
  /** Custom className passthrough. */
  className?: string;
}

/**
 * Sentiment — bullish/bearish/neutral indicator with auto-colored label.
 *
 *   <Sentiment value={78} />  → "78% Bullish" (cyan, > 60)
 *   <Sentiment value={45} />  → "45% Neutral" (text-2, 40-60)
 *   <Sentiment value={28} />  → "28% Bearish" (orange, < 40)
 *
 * Thresholds: <40 bearish, 40-60 neutral, >60 bullish.
 */
export function Sentiment({ value, className }: SentimentProps) {
  const label =
    value > 60 ? 'Bullish' :
    value < 40 ? 'Bearish' :
    'Neutral';

  const color =
    value > 60 ? 'text-pt-cyan' :
    value < 40 ? 'text-pt-orange' :
    'text-pt-text-2';

  return (
    <span className={cn('num font-medium', className)}>
      <span className="text-pt-text-1">{value}%</span>{' '}
      <span className={color}>{label}</span>
    </span>
  );
}
