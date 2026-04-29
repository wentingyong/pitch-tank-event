import { useEffect, useState } from 'react';
import { formatTimer } from '@/lib/format';
import { cn } from '@/lib/utils';

export interface TimerProps {
  /** Initial seconds remaining. */
  seconds: number;
  /** If true, the timer counts down on its own. Default: false. */
  countdown?: boolean;
  /** Called when the timer reaches 0 (only when countdown=true). */
  onExpire?: () => void;
  /** Custom className passthrough. */
  className?: string;
}

/**
 * Timer — displays seconds in m:ss format with optional auto-countdown.
 *
 *   <Timer seconds={300} />                       → "5:00s" (static)
 *   <Timer seconds={300} countdown />             → counts down every second
 *   <Timer seconds={300} countdown onExpire={fn} />  → calls fn at 0
 */
export function Timer({
  seconds: initialSeconds,
  countdown = false,
  onExpire,
  className,
}: TimerProps) {
  const [seconds, setSeconds] = useState(initialSeconds);

  // Reset internal state when prop changes (e.g. parent resets the timer)
  useEffect(() => {
    setSeconds(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!countdown) return;
    if (seconds <= 0) {
      onExpire?.();
      return;
    }
    const id = setInterval(() => {
      setSeconds((s) => Math.max(0, s - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [countdown, seconds, onExpire]);

  return <span className={cn('num', className)}>{formatTimer(seconds)}</span>;
}
