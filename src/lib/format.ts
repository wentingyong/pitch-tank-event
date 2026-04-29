/**
 * Format money with thousand separators.
 * @example formatMoney(23094.5)            // "23,094.50"
 * @example formatMoney(23094.5, 0)         // "23,095"
 * @example formatMoney(23094.5, 2, true)   // "$23,094.50"
 */
export function formatMoney(
  value: number,
  decimals = 2,
  withSymbol = false
): string {
  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  return withSymbol ? `$${formatted}` : formatted;
}

/**
 * Format percentage with sign.
 * @example formatPercent(1.98)   // "+1.98%"
 * @example formatPercent(-4.21)  // "-4.21%"
 */
export function formatPercent(value: number, decimals = 2): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(decimals)}%`;
}

/**
 * Format countdown seconds → "m:ss" + "s" suffix.
 * @example formatTimer(300)  // "5:00s"
 * @example formatTimer(65)   // "1:05s"
 */
export function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${String(s).padStart(2, '0')}s`;
}

/**
 * Compact number format.
 * @example formatCompact(2400)    // "2.4K"
 * @example formatCompact(84200)   // "84.2K"
 * @example formatCompact(1500000) // "1.5M"
 */
export function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
  if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
  return value.toString();
}
