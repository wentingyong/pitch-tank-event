import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge className strings.
 * - clsx handles conditional classes
 * - twMerge resolves Tailwind conflicts (e.g. cn('p-4', 'p-2') → 'p-2')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
