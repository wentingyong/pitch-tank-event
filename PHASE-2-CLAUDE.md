# PitchTank · Phase 2 — Primitive Components

> Instructions for Claude Code to execute autonomously.

## Goal

Create the 9 React primitive components that will power all of PitchTank's UI. Each component is a thin TypeScript wrapper around the CSS classes defined in Phase 1's `tokens.css`. After Phase 2, a temporary `/playground` route will showcase every component variant. The existing Trade page is **not** modified.

## Context

- Phase 1 is complete: TypeScript, tokens.css, fonts, shadcn, and lucide-react are all set up
- All visual styles already exist as CSS classes (`.glass-card.tone-frame`, `.btn-buy`, `.icon-btn-md`, `.pt-tab.active`, etc.)
- Phase 2's job: wrap those classes in typed React components using `class-variance-authority` (cva)
- App.tsx still uses useState-based tab switching (will migrate to react-router in Phase 3)
- `Trade.jsx`, `Charts.jsx`, `BottomNav.jsx` remain untouched
- `Icons.jsx` is deleted in this phase (replaced by lucide-react)

## Execution Order

Follow these steps in order. Each component file is independent — order matters only for `Icons.jsx` removal (Step 11) and the Playground route (Step 12).

---

## Step 1 · Create `<GlassCard>` primitive

### Create `src/components/primitives/GlassCard.tsx`

```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * GlassCard — the foundational container for all PitchTank UI.
 *
 * tone × size × active are the three axes of variation.
 * All visual rules live in tokens.css; this file only maps props → class names.
 */
const cardVariants = cva('glass-card', {
  variants: {
    tone: {
      frame:    'tone-frame',
      primary:  'tone-primary',
      purple:   'tone-purple',
      cyan:     'tone-cyan',
      featured: 'tone-featured',
      neutral:  'tone-neutral',
      negative: 'tone-negative',
    },
    size: {
      sm: 'size-sm',
      md: 'size-md',
      lg: 'size-lg',
    },
  },
  defaultVariants: {
    tone: 'neutral',
    size: 'md',
  },
});

export interface GlassCardProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /**
   * Active state. Currently only meaningful for `tone="neutral"`
   * (brightens the border to indicate the row is expanded / focused).
   */
  active?: boolean;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, tone, size, active, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ tone, size }), active && 'active', className)}
      {...props}
    />
  )
);

GlassCard.displayName = 'GlassCard';
```

### Usage example (do not write this anywhere yet, for reference only):

```tsx
<GlassCard tone="frame" size="md">
  <h2>Trading Market</h2>
  <GlassCard tone="neutral" active size="sm">Maya Kapoor</GlassCard>
  <GlassCard tone="neutral" size="sm">Arjun Reyes</GlassCard>
</GlassCard>
```

---

## Step 2 · Create `<Button>` primitive

### Create `src/components/primitives/Button.tsx`

```tsx
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
```

---

## Step 3 · Create `<IconButton>` primitive

### Create `src/components/primitives/IconButton.tsx`

```tsx
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
```

---

## Step 4 · Create `<Tabs>` primitive

### Create `src/components/primitives/Tabs.tsx`

```tsx
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
```

---

## Step 5 · Create `<Avatar>` primitive

### Create `src/components/primitives/Avatar.tsx`

```tsx
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
```

---

## Step 6 · Create `<TrendValue>` primitive

### Create `src/components/primitives/TrendValue.tsx`

```tsx
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
```

---

## Step 7 · Create `<Money>` primitive

### Create `src/components/primitives/Money.tsx`

```tsx
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
```

---

## Step 8 · Create `<Timer>` primitive

### Create `src/components/primitives/Timer.tsx`

```tsx
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
```

---

## Step 9 · Create `<Sentiment>` primitive

### Create `src/components/primitives/Sentiment.tsx`

```tsx
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
```

---

## Step 10 · Create primitives barrel export

### Create `src/components/primitives/index.ts`

```ts
export { GlassCard, type GlassCardProps } from './GlassCard';
export { Button, type ButtonProps } from './Button';
export { IconButton, type IconButtonProps } from './IconButton';
export { Tabs, type TabsProps, type TabOption } from './Tabs';
export { Avatar, type AvatarProps } from './Avatar';
export { TrendValue, type TrendValueProps } from './TrendValue';
export { Money, type MoneyProps } from './Money';
export { Timer, type TimerProps } from './Timer';
export { Sentiment, type SentimentProps } from './Sentiment';
```

This lets consumers do `import { GlassCard, Button } from '@/components/primitives'`.

---

## Step 11 · Delete `Icons.jsx`

```bash
rm -f src/components/Icons.jsx
```

⚠️ This will break `Trade.jsx` and `BottomNav.jsx` — they import `<Icon name="..." />`. We need to update those imports to use lucide-react instead.

### 11.1 · Update `src/components/BottomNav.jsx`

Find the line at the top:
```jsx
import { Icon } from './Icons';
```

Delete that import. The current `BottomNav.jsx` uses `<img src=...>` for icons (not the `<Icon>` component), so the import is dead code. Just remove the line.

### 11.2 · Update `src/pages/Trade.jsx`

Find the line at the top:
```jsx
import { Icon } from '../components/Icons';
```

Replace with:
```jsx
import { Info, HelpCircle, Clock, BarChart3, ChevronRight, ChevronDown, Trophy, Diamond, TrendingUp, ArrowUpDown, Search } from 'lucide-react';
```

Then replace each `<Icon name="..." size={...} color={...} />` usage in the file:

| Old | New |
|---|---|
| `<Icon name="info" size={N} color="X" />` | `<Info size={N} color="X" strokeWidth={1.5} />` |
| `<Icon name="help" size={N} color="X" />` | `<HelpCircle size={N} color="X" strokeWidth={1.5} />` |
| `<Icon name="clock" size={N} color="X" />` | `<Clock size={N} color="X" strokeWidth={1.5} />` |
| `<Icon name="chart" size={N} color="X" />` | `<BarChart3 size={N} color="X" strokeWidth={1.5} />` |
| `<Icon name="chev" size={N} color="X" />` | `<ChevronRight size={N} color="X" strokeWidth={1.5} />` |
| `<Icon name="down" size={N} color="X" />` | `<ChevronDown size={N} color="X" strokeWidth={1.5} />` |
| `<Icon name="trophy" size={N} color="X" />` | `<Trophy size={N} color="X" strokeWidth={1.5} />` |
| `<Icon name="diamond" size={N} color="X" />` | `<Diamond size={N} color="X" strokeWidth={1.5} />` |
| `<Icon name="triangle-up" size={N} color="X" />` | `<TrendingUp size={N} color="X" strokeWidth={1.5} />` |
| `<Icon name="sort" size={N} color="X" />` | `<ArrowUpDown size={N} color="X" strokeWidth={1.5} />` |
| `<Icon name="search" size={N} color="X" />` | `<Search size={N} color="X" strokeWidth={1.5} />` |

For `className` and other props on `<Icon>`, pass them through to the lucide component the same way.

After this edit, `npx tsc --noEmit` should still pass and `npm run dev` should still render the Trade page identically.

---

## Step 12 · Create the Playground route

This is a temporary page used to verify all primitives render correctly. It will be deleted in Phase 4.

### 12.1 · Create `src/pages/Playground.tsx`

```tsx
import { useState } from 'react';
import { Star, Bell, TrendingUp, Users, Plus, Search, Zap } from 'lucide-react';
import {
  GlassCard,
  Button,
  IconButton,
  Tabs,
  Avatar,
  TrendValue,
  Money,
  Timer,
  Sentiment,
} from '@/components/primitives';

export function Playground() {
  const [tab, setTab] = useState<'market' | 'portfolio' | 'events'>('market');
  const [period, setPeriod] = useState<'24h' | 'week' | 'month'>('month');

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-3xl mx-auto space-y-12">
      <header>
        <h1 className="font-display text-4xl uppercase tracking-wide bg-gradient-to-r from-white via-pt-metal-blue to-pt-purple bg-clip-text text-transparent">
          Playground
        </h1>
        <p className="text-pt-text-2 mt-2 text-sm">
          Phase 2 verification — all primitives in one page.
        </p>
      </header>

      {/* GlassCard tones */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-pt-text-3 uppercase">Glass Cards</h2>

        <div className="grid grid-cols-2 gap-4">
          <GlassCard tone="primary" size="md">
            <div className="text-xs text-pt-text-3 uppercase tracking-widest mb-1">Primary</div>
            <Money value={23094.57} className="font-display text-2xl block" />
          </GlassCard>
          <GlassCard tone="frame" size="md">
            <div className="text-xs text-pt-text-3 uppercase tracking-widest mb-1">Frame</div>
            <div className="font-display text-lg">Container · no bg</div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <GlassCard tone="purple" size="md">
            <div className="text-xs text-pt-text-3 uppercase tracking-widest mb-1">Purple</div>
            <div className="font-display text-pt-purple">Active</div>
          </GlassCard>
          <GlassCard tone="cyan" size="md">
            <div className="text-xs text-pt-text-3 uppercase tracking-widest mb-1">Cyan</div>
            <TrendValue value={24.56} />
          </GlassCard>
          <GlassCard tone="featured" size="md">
            <div className="text-xs text-pt-text-3 uppercase tracking-widest mb-1">Featured</div>
            <div className="font-display">Pitch The One</div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <GlassCard tone="neutral" size="md">
            <div className="text-xs text-pt-text-3 uppercase tracking-widest mb-1">Neutral</div>
            <div>Default list item</div>
          </GlassCard>
          <GlassCard tone="neutral" active size="md">
            <div className="text-xs text-pt-text-3 uppercase tracking-widest mb-1">Neutral · Active</div>
            <div>Selected</div>
          </GlassCard>
          <GlassCard tone="negative" size="md">
            <div className="text-xs text-pt-text-3 uppercase tracking-widest mb-1">Negative</div>
            <TrendValue value={-4.21} />
          </GlassCard>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-pt-text-3 uppercase">Buttons</h2>

        <div className="grid grid-cols-3 gap-3">
          <Button variant="primary" size="lg">Confirm</Button>
          <Button variant="secondary" size="lg">View Market</Button>
          <Button variant="tertiary" size="lg">Learn More →</Button>
        </div>

        <Button variant="featured" size="lg" shimmer className="w-full">
          ★ Pitch The One
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="buy" size="lg">▲ Buy</Button>
          <Button variant="sell" size="lg">▼ Sell</Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button variant="primary" size="md" disabled>Disabled</Button>
          <Button variant="primary" size="md" loading loadingText="Processing">Save</Button>
          <Button variant="buy" size="md" loading loadingText="Buying">Buy</Button>
        </div>
      </section>

      {/* Icon Buttons */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-pt-text-3 uppercase">Icon Buttons</h2>
        <div className="flex gap-3 items-center flex-wrap">
          <IconButton size="sm" icon={<Star strokeWidth={1.5} />} aria-label="Star" />
          <IconButton size="md" icon={<Zap strokeWidth={1.5} />} aria-label="Zap" />
          <IconButton size="md" active icon={<TrendingUp strokeWidth={1.5} />} aria-label="Trending (active)" />
          <IconButton size="md" icon={<Bell strokeWidth={1.5} />} aria-label="Bell" />
          <IconButton size="md" icon={<Users strokeWidth={1.5} />} aria-label="Users" />
          <IconButton size="md" icon={<Plus strokeWidth={1.5} />} aria-label="Plus" />
          <IconButton size="lg" icon={<Search strokeWidth={1.5} />} aria-label="Search" />
        </div>
      </section>

      {/* Tabs */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-pt-text-3 uppercase">Tabs</h2>
        <div className="flex gap-4 flex-wrap">
          <Tabs
            value={tab}
            onChange={setTab}
            options={[
              { value: 'market', label: 'Market' },
              { value: 'portfolio', label: 'Portfolio' },
              { value: 'events', label: 'Events' },
            ]}
          />
          <Tabs
            value={period}
            onChange={setPeriod}
            options={[
              { value: '24h', label: '24H' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
            ]}
          />
        </div>
      </section>

      {/* Avatars */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-pt-text-3 uppercase">Avatars</h2>
        <div className="flex gap-3 items-center flex-wrap">
          <Avatar size="sm" name="Maya" />
          <Avatar size="md" name="Arjun" gradient={['#A259FF', '#4F7CFF']} />
          <Avatar size="lg" name="Priya" gradient={['#00E5FF', '#21FFA6']} />
          <Avatar size="xl" name="Diego" gradient={['#FF8A00', '#A259FF']} />
          <Avatar size="md" src="https://i.pravatar.cc/150?u=demo" name="?" />
        </div>
      </section>

      {/* Data primitives */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-pt-text-3 uppercase">Data primitives</h2>
        <GlassCard tone="primary" size="lg" className="space-y-3">
          <div>
            <div className="text-xs text-pt-text-3 uppercase tracking-widest">Money</div>
            <Money value={23094.57} className="font-display text-3xl block" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-pt-text-3 uppercase tracking-widest">Trend +</div>
              <TrendValue value={12.34} />
            </div>
            <div>
              <div className="text-xs text-pt-text-3 uppercase tracking-widest">Trend -</div>
              <TrendValue value={-4.21} />
            </div>
            <div>
              <div className="text-xs text-pt-text-3 uppercase tracking-widest">Timer</div>
              <Timer seconds={300} countdown />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-pt-text-3 uppercase tracking-widest">Bullish</div>
              <Sentiment value={78} />
            </div>
            <div>
              <div className="text-xs text-pt-text-3 uppercase tracking-widest">Neutral</div>
              <Sentiment value={50} />
            </div>
            <div>
              <div className="text-xs text-pt-text-3 uppercase tracking-widest">Bearish</div>
              <Sentiment value={28} />
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
```

### 12.2 · Wire Playground into App.tsx

The current `App.tsx` uses `useState` for tab routing. Add a temporary "playground" tab so we can navigate to it without setting up react-router yet.

Replace the contents of `src/App.tsx` with:

```tsx
import { useState } from 'react';
import { Trade } from './pages/Trade';
import { BottomNav } from './components/BottomNav';
import { Playground } from './pages/Playground';

function App() {
  const [tab, setTab] = useState('trade');

  // Press ? key to toggle playground (temporary, for Phase 2 verification)
  if (typeof window !== 'undefined') {
    window.addEventListener('keydown', (e) => {
      if (e.key === '?' && (e.target as HTMLElement).tagName !== 'INPUT') {
        setTab((t) => (t === 'playground' ? 'trade' : 'playground'));
      }
    }, { once: true });
  }

  if (tab === 'playground') {
    return (
      <div className="page-bg min-h-screen">
        <Playground />
      </div>
    );
  }

  return (
    <div className="page-bg min-h-screen flex justify-center">
      <main className="relative w-full max-w-[390px] px-4 pb-32">
        {tab === 'trade' && <Trade />}
        {tab === 'rankings' && <div className="text-white text-center pt-10">Rankings</div>}
        {tab === 'chat' && <div className="text-white text-center pt-10">Chat</div>}
        {tab === 'network' && <div className="text-white text-center pt-10">Network</div>}
        {tab === 'portfolio' && <div className="text-white text-center pt-10">Portfolio</div>}
      </main>
      <BottomNav tab={tab} setTab={setTab} />
    </div>
  );
}

export default App;
```

⚠️ The `?` key listener is temporary. In Phase 3 we replace this with a proper `/playground` route via react-router.

---

## Step 13 · Verify

### 13.1 · Type check

```bash
npx tsc --noEmit
```

Should complete with no errors. Pre-existing JSX warnings from `Trade.jsx`, `Charts.jsx`, `BottomNav.jsx` are still acceptable.

### 13.2 · Dev server

```bash
npm run dev
```

Open the app in browser. Verify:

1. **Default view** — Trade page renders identically to before Phase 2 (no visual regression)
2. **Press `?` key** — switches to Playground page
3. **In Playground**, verify all sections render correctly:
   - 7 GlassCard variants (frame, primary, purple, cyan, featured, neutral, negative)
   - Neutral default vs neutral active should look distinguishable (border brightness differs)
   - 6 button variants × 3 sizes
   - Featured button has a shimmer animation crossing it every 3 seconds
   - Loading buttons have a spinning Loader2 icon
   - 3 IconButton sizes; the active one is purple
   - Tabs respond to clicks; active tab is purple
   - Avatars render with gradient backgrounds and initials
   - TrendValue: positive is cyan with glow, negative is orange with glow
   - Timer counts down once per second
   - Sentiment shows correct label color (78=Bullish cyan, 50=Neutral muted, 28=Bearish orange)
4. **Press `?` again** — returns to Trade page

### 13.3 · No broken imports

Search the codebase for any remaining references to `Icons.jsx`:

```bash
grep -r "from './Icons'" src/
grep -r "from '../components/Icons'" src/
grep -r "from '@/components/Icons'" src/
```

All three should return zero results.

---

## Acceptance Criteria

Phase 2 is done when ALL of these are true:

- [ ] `src/components/primitives/` contains 9 component files + `index.ts`
- [ ] `src/pages/Playground.tsx` exists
- [ ] `src/components/Icons.jsx` is deleted
- [ ] `Trade.jsx` and `BottomNav.jsx` no longer import from `./Icons`; Trade.jsx uses lucide-react instead
- [ ] `npm run dev` starts without errors
- [ ] Trade page still renders identically to Phase 1
- [ ] Pressing `?` shows the Playground; pressing again returns to Trade
- [ ] All sections of Playground render the variants correctly
- [ ] `npx tsc --noEmit` passes (JSX warnings on legacy files are OK)

---

## What Phase 3 will do

Phase 3 will:
- Install and wire `react-router-dom`
- Convert `App.tsx` from useState routing to `<RouterProvider>`
- Create empty placeholder pages for `/rankings`, `/chat`, `/network`, `/portfolio`, `/login`, `/polymarket`
- Move `BottomNav` from `setTab` callback to `useNavigate`
- Convert the temporary `?` key to a proper `/playground` route (still temporary, will be removed in Phase 4)
- The Trade page itself is still not refactored — that's Phase 4.
