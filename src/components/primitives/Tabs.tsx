import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface TabOption<T extends string = string> {
  value: T;
  label: ReactNode;
}

export interface TabsProps<T extends string = string> {
  options: ReadonlyArray<TabOption<T>>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

/**
 * Segmented control with cyan/purple active state.
 * Active state uses purple per design system v2.1.5.
 */
export function Tabs<T extends string = string>({
  options,
  value,
  onChange,
  className,
}: TabsProps<T>) {
  return (
    <div className={cn('pt-tabs', className)} role="tablist">
      {options.map((opt) => (
        <button
          key={opt.value}
          role="tab"
          aria-selected={opt.value === value}
          className={cn('pt-tab', opt.value === value && 'active')}
          onClick={() => onChange(opt.value)}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
