# PitchTank · Phase 4 — Trade Page Refactor

> Instructions for Claude Code to execute autonomously.
> This is the largest phase. Plan for ~600 lines of changes total.

## Goal

Refactor the legacy `src/pages/Trade.jsx` into a TypeScript, primitive-driven, v2.1.5-compliant page. Visual output should match the v2.1.5 demo exactly. The 350-line monolith becomes a 50-line composer of 6 sub-components.

## Why this matters

- Phase 2 introduced 9 primitives (`GlassCard`, `Button`, `IconButton`, `Tabs`, `Avatar`, `TrendValue`, `Money`, `Timer`, `Sentiment`) but the Trade page still uses the legacy `.glass-strong`, `.halo-blue`, `.glass-tinted-cyan` etc. classes everywhere.
- Phase 3 wired up routing but kept Trade.jsx intact.
- This phase removes **all** inline glass/halo classes, **all** inline button styles, and **all** manual percent/money formatting from the Trade page.
- After this, the design system is *actually* in use — not just defined in `tokens.css` and showcased in `/playground`.

## Hard constraints

These must NOT change in Phase 4:

- ❌ `src/components/Charts.jsx` — `EventChart` visual is final (the user has explicitly approved the current blue→purple gradient + 3-layer glow). Do not touch the EventChart implementation. **Only one** Sparkline change is allowed (auto-color, see Step 6).
- ❌ `src/components/BottomNav.jsx`
- ❌ Any token in `src/styles/tokens.css`
- ❌ Any primitive in `src/components/primitives/`
- ❌ Router config in `src/router/index.tsx` — Trade route already wired

---

## Step 1 · Extract mock data to a typed module

The legacy `Trade.jsx` has a 50-line `FOUNDERS` array and a hardcoded `EVENT_SERIES` inline. Pull these out so the page file becomes pure composition.

### Create `src/lib/mock-data.ts`

```ts
export interface Founder {
  id: string;
  name: string;
  company: string;
  initial: string;
  avatarColor: string;        // gradient CSS string for the avatar fallback
  price: number;
  change: number;             // percentage, e.g. +1.98 or -1.21
  series: number[];           // sparkline data, normalized 0–100
  sentiment: 'bullish' | 'bearish' | 'neutral';
}

/**
 * Mock founder list. Order = display order in Trading Market.
 * The first founder is the "active/expanded" one by default in the demo.
 */
export const FOUNDERS: Founder[] = [
  {
    id: 'maya',
    name: 'Maya Kapoor',
    company: 'LunaWorks AI',
    initial: 'M',
    avatarColor: 'linear-gradient(135deg, #4F7CFF, #A259FF)',
    price: 23746,
    change: +1.98,
    series: [42, 48, 45, 52, 58, 64, 71, 68, 76, 82, 78, 88],
    sentiment: 'bullish',
  },
  {
    id: 'arjun',
    name: 'Arjun Reyes',
    company: 'NebulaPay',
    initial: 'A',
    avatarColor: 'linear-gradient(135deg, #A259FF, #4F7CFF)',
    price: 18402,
    change: +0.74,
    series: [50, 52, 48, 54, 56, 53, 58, 60, 57, 62, 64, 61],
    sentiment: 'bullish',
  },
  {
    id: 'priya',
    name: 'Priya Wen',
    company: 'OrbitMesh',
    initial: 'P',
    avatarColor: 'linear-gradient(135deg, #FF8A00, #A259FF)',
    price: 15820,
    change: -1.21,
    series: [80, 76, 78, 72, 68, 64, 62, 58, 54, 50, 48, 46],
    sentiment: 'bearish',
  },
  {
    id: 'diego',
    name: 'Diego Marín',
    company: 'GreenGrid',
    initial: 'D',
    avatarColor: 'linear-gradient(135deg, #00E5FF, #4F7CFF)',
    price: 12390,
    change: +3.42,
    series: [30, 35, 38, 42, 48, 54, 58, 65, 70, 75, 82, 88],
    sentiment: 'bullish',
  },
];

/**
 * Mock event chart series — used by EventPerformance.
 * Y values are price points over the event window.
 */
export const EVENT_SERIES: number[] = [
  64200, 64850, 65100, 64600, 65400, 66200, 65800,
  67100, 68400, 67900, 69200, 70800, 71400, 72100,
];

/**
 * Mock event metadata.
 */
export const EVENT_META = {
  title: 'Semi Finals · Round 3',
  closesIn: 5 * 60 + 23,    // seconds — Timer primitive will format
  totalVolume: 1_240_000,
  totalBalance: 23_094.57,
  balanceChange: +12.34,
};
```

---

## Step 2 · One-time Sparkline change in Charts.jsx

This is the **only** Charts.jsx edit allowed. Sparkline currently requires a `color` prop. Make it auto-determine color from series direction.

### Edit `src/components/Charts.jsx`

Find the existing `Sparkline` component. The signature today looks something like:

```jsx
export function Sparkline({ series, color, width = 50, height = 24 }) {
  // ...
  const stroke = color || '#00E5FF';
  // ...
}
```

Replace with:

```jsx
/**
 * Sparkline auto-determines color from series direction.
 *
 * - If series ends higher than it starts → cyan (positive)
 * - If series ends lower than it starts → orange (negative)
 *
 * Callers can still pass `color` to force a specific stroke; otherwise omit it.
 */
export function Sparkline({ series, color, width = 50, height = 24 }) {
  if (!series || series.length < 2) return null;

  const isUp = series[series.length - 1] >= series[0];
  const stroke = color || (isUp ? 'var(--c-cyan)' : 'var(--c-orange)');
  const glow = color || (isUp ? 'rgba(0,229,255,0.5)' : 'rgba(255,138,0,0.4)');

  // Keep the existing path generation logic (don't touch it)
  // The existing min/max normalization and path d= computation stays the same.
  // Just change `stroke` to use the derived value, and update the filter:
  //
  //   <path d={...} fill="none" stroke={stroke} strokeWidth="1.5"
  //         filter={`drop-shadow(0 0 3px ${glow})`} />

  return (
    /* existing JSX with stroke and filter swapped to use the values above */
  );
}
```

⚠️ **Do not rewrite the path-generation logic.** Only change the color/glow derivation and the JSX where stroke is applied. If the existing implementation has a different shape, preserve everything except the color decision.

---

## Step 3 · Create the trade sections folder

All 6 sub-components live under `src/pages/trade/sections/`. Create that folder.

### 3.1 · `Header.tsx`

Top header — avatar, app title, info icon, help icon. Replaces the manual SVG header.

```tsx
import { Info, HelpCircle } from 'lucide-react';
import { Avatar, IconButton } from '@/components/primitives';

export function Header() {
  return (
    <header className="flex items-center justify-between pt-5 pb-4">
      <div className="flex items-center gap-3">
        <Avatar initial="U" size="md" />
        <div>
          <div className="font-display text-xs uppercase tracking-[0.2em] text-pt-text-3">
            PitchTank
          </div>
          <div className="font-display text-base font-medium leading-tight">
            Live Market
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <IconButton size="md" aria-label="Event info">
          <Info size={16} strokeWidth={1.5} />
        </IconButton>
        <IconButton size="md" aria-label="How it works">
          <HelpCircle size={16} strokeWidth={1.5} />
        </IconButton>
      </div>
    </header>
  );
}
```

### 3.2 · `BalanceRow.tsx`

Total Balance display. Uses `<GlassCard tone="primary" size="lg">` and the `<Money>` primitive.

```tsx
import { GlassCard, Money, TrendValue } from '@/components/primitives';
import { EVENT_META } from '@/lib/mock-data';

export function BalanceRow() {
  return (
    <GlassCard tone="primary" size="lg" className="mb-3">
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-pt-text-3">
            Total Balance
          </div>
          <Money
            value={EVENT_META.totalBalance}
            size="lg"
            className="mt-1 block"
          />
          <div className="mt-1">
            <TrendValue value={EVENT_META.balanceChange} size="sm" />
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-pt-text-3">
            vs last month
          </div>
          <TrendValue value={-37.16} size="sm" className="mt-1 block" />
        </div>
      </div>
    </GlassCard>
  );
}
```

### 3.3 · `EventPerformance.tsx`

Wraps the existing `EventChart` (UNTOUCHED). Outer container is `<GlassCard tone="frame" size="md">`.

```tsx
import { GlassCard } from '@/components/primitives';
import { EventChart } from '@/components/Charts';
import { EVENT_SERIES, EVENT_META } from '@/lib/mock-data';

export function EventPerformance() {
  return (
    <GlassCard tone="frame" size="md" className="mb-3">
      <div className="flex items-center justify-between mb-3">
        <div>
          <div className="font-display text-sm font-medium uppercase tracking-wide">
            Event Performance
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.15em] text-pt-text-3 mt-0.5">
            {EVENT_META.title}
          </div>
        </div>
      </div>
      <EventChart series={EVENT_SERIES} />
    </GlassCard>
  );
}
```

⚠️ **Do not pass `width` or `height` to EventChart.** The chart manages its own dimensions internally. If EventChart's prop signature has required width/height, leave them at the existing defaults from Charts.jsx — do not modify the component itself.

### 3.4 · `PitchTheOneBanner.tsx`

The featured banner that links to `/polymarket`. Uses `<GlassCard tone="featured">`.

```tsx
import { Trophy, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard } from '@/components/primitives';

export function PitchTheOneBanner() {
  const navigate = useNavigate();

  return (
    <GlassCard
      tone="featured"
      size="md"
      className="mb-3 cursor-pointer transition-transform active:scale-[0.99]"
      onClick={() => navigate('/polymarket')}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') navigate('/polymarket');
      }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl grid place-items-center shrink-0"
          style={{
            background: 'linear-gradient(135deg, #A259FF, #FF8A00)',
            boxShadow:
              'inset 0 0 0 1px rgba(255,255,255,0.2), 0 0 18px rgba(220,150,100,0.5)',
          }}
        >
          <Trophy size={18} strokeWidth={1.5} className="text-white" />
        </div>
        <div className="flex-1 leading-tight">
          <div className="font-display text-sm font-medium uppercase tracking-[0.04em] text-pt-featured">
            Pitch The One
          </div>
          <div className="font-mono text-[10px] tracking-[0.05em] text-pt-text-3">
            Choose your champion
          </div>
        </div>
        <ArrowRight size={16} strokeWidth={1.5} className="text-pt-text-2" />
      </div>
    </GlassCard>
  );
}
```

The `text-pt-featured` utility should already exist in tokens.css from Phase 1 — it's the purple→orange gradient text. If not, the existing GlassCard `tone="featured"` provides the right gradient border and background, so the inner text being plain white is acceptable.

### 3.5 · `FounderRow.tsx`

The collapsed list item. `<GlassCard tone="neutral">` (default state).

```tsx
import type { Founder } from '@/lib/mock-data';
import { GlassCard, Avatar, Money, TrendValue } from '@/components/primitives';
import { Sparkline } from '@/components/Charts';

export interface FounderRowProps {
  founder: Founder;
  onClick: () => void;
}

export function FounderRow({ founder, onClick }: FounderRowProps) {
  return (
    <GlassCard
      tone="neutral"
      size="sm"
      className="mb-2 cursor-pointer transition-transform active:scale-[0.995]"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') onClick();
      }}
    >
      <div className="flex items-center gap-3">
        <Avatar
          initial={founder.initial}
          size="sm"
          style={{ background: founder.avatarColor }}
        />
        <div className="flex-1 min-w-0">
          <div className="font-display text-[13px] font-medium tracking-[0.03em] uppercase truncate">
            {founder.name}
          </div>
          <div className="font-mono text-[11px] text-pt-text-3 tracking-[0.05em] truncate">
            {founder.company}
          </div>
        </div>
        <Sparkline series={founder.series} width={50} height={24} />
        <div className="text-right shrink-0 min-w-[80px]">
          <Money value={founder.price} size="sm" className="block" />
          <TrendValue value={founder.change} size="xs" />
        </div>
      </div>
    </GlassCard>
  );
}
```

### 3.6 · `FounderRowExpanded.tsx`

The expanded state. `<GlassCard tone="neutral" active>` — same background as `FounderRow`, only the border stops shift to 100% opacity (per v2.1.5 spec). Adds Buy/Sell buttons and a sentiment indicator.

```tsx
import type { Founder } from '@/lib/mock-data';
import { ChevronUp } from 'lucide-react';
import {
  GlassCard,
  Avatar,
  Money,
  TrendValue,
  Button,
  Sentiment,
} from '@/components/primitives';
import { Sparkline } from '@/components/Charts';

export interface FounderRowExpandedProps {
  founder: Founder;
  onCollapse: () => void;
  onBuy: () => void;
  onSell: () => void;
}

export function FounderRowExpanded({
  founder,
  onCollapse,
  onBuy,
  onSell,
}: FounderRowExpandedProps) {
  return (
    <GlassCard tone="neutral" active size="sm" className="mb-2">
      {/* Top row — same layout as FounderRow */}
      <button
        onClick={onCollapse}
        className="w-full flex items-center gap-3 mb-3 text-left"
        aria-label="Collapse"
      >
        <Avatar
          initial={founder.initial}
          size="sm"
          style={{ background: founder.avatarColor }}
        />
        <div className="flex-1 min-w-0">
          <div className="font-display text-[13px] font-medium tracking-[0.03em] uppercase">
            {founder.name}
          </div>
          <div className="font-mono text-[11px] text-pt-text-3 tracking-[0.05em]">
            {founder.company}
          </div>
        </div>
        <Sparkline series={founder.series} width={60} height={28} />
        <div className="text-right shrink-0 min-w-[80px]">
          <Money value={founder.price} size="sm" className="block" />
          <TrendValue value={founder.change} size="xs" />
        </div>
        <ChevronUp size={14} strokeWidth={1.5} className="text-pt-text-3" />
      </button>

      {/* Sentiment row */}
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-pt-text-3">
          Crowd Sentiment
        </span>
        <Sentiment value={founder.sentiment} />
      </div>

      {/* Buy / Sell actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button variant="buy" size="md" onClick={onBuy}>
          ▲ Buy
        </Button>
        <Button variant="sell" size="md" onClick={onSell}>
          ▼ Sell
        </Button>
      </div>
    </GlassCard>
  );
}
```

### 3.7 · `TradingMarket.tsx`

The container that holds the founder list. `<GlassCard tone="frame">` — no background, only border.

```tsx
import { useState } from 'react';
import { GlassCard, Tabs } from '@/components/primitives';
import { FOUNDERS, type Founder } from '@/lib/mock-data';
import { FounderRow } from './FounderRow';
import { FounderRowExpanded } from './FounderRowExpanded';

export function TradingMarket() {
  const [expandedId, setExpandedId] = useState<string | null>(FOUNDERS[0].id);
  const [sortMode, setSortMode] = useState<'price' | 'az'>('price');

  const sorted = [...FOUNDERS].sort((a, b) =>
    sortMode === 'price' ? b.price - a.price : a.name.localeCompare(b.name)
  );

  const handleRowClick = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleBuy = (founder: Founder) => {
    // Phase 5 will wire this to BuySellSheet modal
    console.log('Buy', founder.id);
  };

  const handleSell = (founder: Founder) => {
    console.log('Sell', founder.id);
  };

  return (
    <GlassCard tone="frame" size="md">
      <div className="flex items-center justify-between mb-4 px-1">
        <span className="font-display text-base font-medium uppercase tracking-[0.02em]">
          Trading Market
        </span>
        <Tabs
          value={sortMode}
          onValueChange={(v) => setSortMode(v as 'price' | 'az')}
          options={[
            { value: 'price', label: 'Price' },
            { value: 'az', label: 'A-Z' },
          ]}
        />
      </div>

      {sorted.map((founder) =>
        founder.id === expandedId ? (
          <FounderRowExpanded
            key={founder.id}
            founder={founder}
            onCollapse={() => setExpandedId(null)}
            onBuy={() => handleBuy(founder)}
            onSell={() => handleSell(founder)}
          />
        ) : (
          <FounderRow
            key={founder.id}
            founder={founder}
            onClick={() => handleRowClick(founder.id)}
          />
        )
      )}
    </GlassCard>
  );
}
```

⚠️ The `Tabs` primitive's exact prop signature was set in Phase 2. If your `Tabs` uses different prop names (e.g. `selected` instead of `value`, `items` instead of `options`), adjust accordingly — but don't change the Tabs primitive itself. Read `src/components/primitives/Tabs.tsx` to confirm the API before writing this file.

---

## Step 4 · Compose the new Trade page

### Replace `src/pages/Trade.jsx` entirely with `src/pages/Trade.tsx`:

```tsx
import { Header } from './trade/sections/Header';
import { BalanceRow } from './trade/sections/BalanceRow';
import { EventPerformance } from './trade/sections/EventPerformance';
import { PitchTheOneBanner } from './trade/sections/PitchTheOneBanner';
import { TradingMarket } from './trade/sections/TradingMarket';

export function Trade() {
  return (
    <>
      <Header />
      <BalanceRow />
      <EventPerformance />
      <PitchTheOneBanner />
      <TradingMarket />
    </>
  );
}
```

That's it. ~10 lines for the page itself. All the visual decisions are in the section files; the page just orders them.

### Delete the old file:

```bash
rm src/pages/Trade.jsx
```

---

## Step 5 · Verify the router still resolves Trade correctly

In `src/router/index.tsx` from Phase 3, the import was:

```tsx
import { Trade } from '@/pages/Trade';
```

This still works because:
- The new file is at `src/pages/Trade.tsx`
- Vite/TypeScript resolve `.tsx` automatically
- It exports `Trade` as a named export

No router changes needed. Confirm with:

```bash
grep -n "Trade" src/router/index.tsx
```

Should show only:
```tsx
import { Trade } from '@/pages/Trade';
{ path: 'trade', element: <Trade /> },
```

---

## Step 6 · Verification

### 6.1 · Type check

```bash
npx tsc --noEmit
```

Should pass with no errors. The most common failures here are:
- A primitive prop name mismatch (e.g. `<Tabs options>` vs `<Tabs items>`) — read the primitive's source and adjust the section file.
- `Money`/`TrendValue` not accepting a `size` prop — check the primitive signature.
- `Avatar` not accepting `style` — if the primitive locks down the prop, pass the gradient via a `bg` or `color` prop instead, whatever the primitive supports.

### 6.2 · Visual verification

```bash
npm run dev
```

Navigate to `/trade`. The page should render with:

1. **Header** at the top (avatar + title + info/help icons)
2. **Total Balance card** — primary blue tone with horizontal gradient bg + matching gradient border, large $23,094.57 number, +12.34% trend
3. **Event Performance** — frame-toned card containing the EventChart with its existing blue→purple gradient line and 3-layer glow (visually unchanged from before this phase)
4. **Pitch The One banner** — purple→orange diagonal gradient card with trophy icon, clickable, navigates to `/polymarket`
5. **Trading Market** — frame-toned outer card containing 4 founder rows. The first (Maya) is expanded with sentiment + Buy/Sell buttons; the other 3 are collapsed
6. Sparklines: Maya, Arjun, Diego show **cyan** lines (positive); Priya shows **orange** (negative) — auto-determined, not hardcoded

### 6.3 · Functional checks

- Click a collapsed founder row → it expands; previous expanded row collapses
- Click the expanded row's top half → it collapses
- Click Pitch The One banner → navigates to `/polymarket`
- Click "Price" / "A-Z" tabs → list reorders
- Click Buy / Sell → console logs the founder id (modals come in Phase 5)
- Click Info / Help icons in header → no-op for now (modals come in Phase 5)

### 6.4 · Code quality checks

```bash
# Confirm no .halo-* classes remain in the page
grep -rn "halo-" src/pages/trade/ src/pages/Trade.tsx
# Should output nothing

# Confirm no .glass-tinted-* classes remain
grep -rn "glass-tinted" src/pages/trade/ src/pages/Trade.tsx
# Should output nothing

# Confirm no .glass-strong remains
grep -rn "glass-strong" src/pages/trade/ src/pages/Trade.tsx
# Should output nothing

# Confirm Trade.tsx is short
wc -l src/pages/Trade.tsx
# Should be < 20 lines
```

If any of these grep checks return matches, find the offending file and replace the legacy class with the appropriate `<GlassCard>` invocation.

### 6.5 · Old file removed

```bash
ls src/pages/Trade.jsx 2>/dev/null
# Should output: ls: cannot access 'src/pages/Trade.jsx': No such file or directory
```

---

## Acceptance Criteria

Phase 4 is done when ALL of these are true:

- [ ] `src/lib/mock-data.ts` exists with `FOUNDERS`, `EVENT_SERIES`, `EVENT_META` exported
- [ ] `src/pages/trade/sections/` contains 6 files: `Header.tsx`, `BalanceRow.tsx`, `EventPerformance.tsx`, `PitchTheOneBanner.tsx`, `FounderRow.tsx`, `FounderRowExpanded.tsx`, `TradingMarket.tsx`
- [ ] `src/pages/Trade.tsx` exists, < 20 lines, exports `Trade` as a named export
- [ ] `src/pages/Trade.jsx` is deleted
- [ ] `Sparkline` in `Charts.jsx` auto-determines color from series direction
- [ ] `EventChart` in `Charts.jsx` is otherwise unchanged
- [ ] `npx tsc --noEmit` passes
- [ ] `/trade` renders identically to v2.1.5 demo
- [ ] No `.halo-*`, `.glass-tinted-*`, `.glass-strong` classes anywhere under `src/pages/trade/` or in `Trade.tsx`
- [ ] Click-to-expand interaction works on founder rows
- [ ] Pitch The One banner navigates to `/polymarket`

---

## What Phase 5 will do

Phase 5 adds the modals:

- `BuySellSheet` — bottom-sheet modal opened by Buy/Sell buttons in `FounderRowExpanded`
- `EventInfoDialog` — centered dialog opened by the Info icon in `Header`
- `RulesDialog` — centered dialog opened by the Help icon in `Header`

The handlers in this phase (`handleBuy`, `handleSell`, the icon `aria-label`s without `onClick`) are placeholders that will be wired up next.
