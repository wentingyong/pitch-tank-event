# PitchTank · Phase 3 — Routing & Layout

> Instructions for Claude Code to execute autonomously.

## Goal

Replace the current `useState`-based tab switching with proper browser routing via `react-router-dom`. Add placeholder pages for all main routes. Make the temporary Playground a real route. The Trade page itself is **not** refactored in this phase — that's Phase 4.

## Context

- Phase 1 + Phase 2 complete: TypeScript, design tokens, fonts, shadcn, primitives all set up
- `react-router-dom` is already installed (Phase 1 added it as a dependency)
- Current `App.tsx` uses `useState('trade')` for tab routing
- `BottomNav.jsx` calls `setTab` directly via prop callback
- A temporary `?` key listener toggles Playground in `App.tsx`
- Existing `Trade.jsx` will be left untouched and rendered at `/trade`

## Why this matters

Routing isn't just about URLs — it unlocks:
- **Browser back / forward** buttons work
- **Deeplinks** — share `https://pitchtank.com/rankings` and land directly there
- **Future modals as routes** (e.g. `/trade/buy/:founderId`)
- Removes the `?` keyboard hack from Phase 2

---

## Step 1 · Create the route map

### Create `src/router/index.tsx`

```tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { MainLayout } from '@/components/layout/MainLayout';
import { Trade } from '@/pages/Trade';
import { RankingsPage } from '@/pages/RankingsPage';
import { ChatPage } from '@/pages/ChatPage';
import { NetworkPage } from '@/pages/NetworkPage';
import { PortfolioPage } from '@/pages/PortfolioPage';
import { LoginPage } from '@/pages/LoginPage';
import { PolymarketPage } from '@/pages/PolymarketPage';
import { Playground } from '@/pages/Playground';

/**
 * PitchTank route map.
 *
 * Structure:
 *   /login                  — standalone, no bottom nav
 *   /                       — MainLayout (with BottomNav)
 *     /trade                — main trade page
 *     /rankings             — investor / founder leaderboard
 *     /chat                 — community chat
 *     /network              — connections
 *     /portfolio            — user holdings
 *     /polymarket           — prediction market integration (linked from Pitch The One banner)
 *     /playground           — design system showcase (TEMPORARY — remove in Phase 6)
 */
export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { index: true, element: <Navigate to="/trade" replace /> },
      { path: 'trade', element: <Trade /> },
      { path: 'rankings', element: <RankingsPage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'network', element: <NetworkPage /> },
      { path: 'portfolio', element: <PortfolioPage /> },
      { path: 'polymarket', element: <PolymarketPage /> },
      { path: 'playground', element: <Playground /> },
    ],
  },
  // Catch-all: redirect to /trade
  { path: '*', element: <Navigate to="/trade" replace /> },
]);
```

---

## Step 2 · Create the MainLayout

### Create `src/components/layout/MainLayout.tsx`

```tsx
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BottomNav } from '@/components/BottomNav';
import { PageContainer } from './PageContainer';

/**
 * MainLayout — applies to all routes that show the bottom navigation.
 *
 * - Wraps the page in a phone-width container
 * - Mounts BottomNav at the bottom
 * - Maps the current pathname to a `tab` value for BottomNav
 * - On tab click, navigates via react-router (instead of setState)
 */
export function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Derive current tab from URL (e.g. "/trade" → "trade")
  const tab = location.pathname.split('/')[1] || 'trade';

  // BottomNav only knows 5 tabs; for /polymarket and /playground
  // it should highlight nothing (or default to trade).
  const navTab = ['rankings', 'chat', 'trade', 'network', 'portfolio'].includes(tab)
    ? tab
    : 'trade';

  const handleTabChange = (next: string) => {
    navigate(`/${next}`);
  };

  return (
    <div className="page-bg min-h-screen flex justify-center">
      <PageContainer>
        <Outlet />
      </PageContainer>
      <BottomNav tab={navTab} setTab={handleTabChange} />
    </div>
  );
}
```

---

## Step 3 · Create the responsive PageContainer

### Create `src/components/layout/PageContainer.tsx`

```tsx
import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface PageContainerProps {
  children: ReactNode;
  className?: string;
}

/**
 * PageContainer — the phone-width column that holds page content.
 *
 * Replaces the previous `max-w-[390px]` hardcode in App.tsx.
 *
 * Width strategy:
 *   - max-w-[430px] fits iPhone Pro Max / large Android fully
 *   - On smaller screens, w-full + px-4 gives natural padding
 *   - On desktop, content stays centered in a 430px column
 */
export function PageContainer({ children, className }: PageContainerProps) {
  return (
    <main
      className={cn(
        'relative w-full max-w-[430px] mx-auto px-4 sm:px-5 pb-32',
        className
      )}
    >
      {children}
    </main>
  );
}
```

---

## Step 4 · Create placeholder pages

These are minimal stub pages so the routes resolve. They will be built out in later phases.

### Create `src/pages/RankingsPage.tsx`

```tsx
import { GlassCard } from '@/components/primitives';

export function RankingsPage() {
  return (
    <div className="pt-6">
      <h1 className="font-display text-2xl uppercase tracking-wide mb-6">
        Rankings
      </h1>
      <GlassCard tone="frame" size="md">
        <p className="text-pt-text-2 text-sm text-center py-8">
          Leaderboard coming soon.
        </p>
      </GlassCard>
    </div>
  );
}
```

### Create `src/pages/ChatPage.tsx`

```tsx
import { GlassCard } from '@/components/primitives';

export function ChatPage() {
  return (
    <div className="pt-6">
      <h1 className="font-display text-2xl uppercase tracking-wide mb-6">
        Chat
      </h1>
      <GlassCard tone="frame" size="md">
        <p className="text-pt-text-2 text-sm text-center py-8">
          Community chat coming soon.
        </p>
      </GlassCard>
    </div>
  );
}
```

### Create `src/pages/NetworkPage.tsx`

```tsx
import { GlassCard } from '@/components/primitives';

export function NetworkPage() {
  return (
    <div className="pt-6">
      <h1 className="font-display text-2xl uppercase tracking-wide mb-6">
        Network
      </h1>
      <GlassCard tone="frame" size="md">
        <p className="text-pt-text-2 text-sm text-center py-8">
          Your connections will appear here.
        </p>
      </GlassCard>
    </div>
  );
}
```

### Create `src/pages/PortfolioPage.tsx`

```tsx
import { GlassCard } from '@/components/primitives';

export function PortfolioPage() {
  return (
    <div className="pt-6">
      <h1 className="font-display text-2xl uppercase tracking-wide mb-6">
        Portfolio
      </h1>
      <GlassCard tone="frame" size="md">
        <p className="text-pt-text-2 text-sm text-center py-8">
          Your holdings will appear here.
        </p>
      </GlassCard>
    </div>
  );
}
```

### Create `src/pages/PolymarketPage.tsx`

```tsx
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, Button } from '@/components/primitives';

export function PolymarketPage() {
  const navigate = useNavigate();
  return (
    <div className="pt-6">
      <Button variant="tertiary" size="sm" onClick={() => navigate('/trade')} className="mb-4">
        <ArrowLeft size={14} strokeWidth={1.5} />
        Back to Trade
      </Button>
      <h1 className="font-display text-2xl uppercase tracking-wide mb-6">
        Pitch The One
      </h1>
      <GlassCard tone="featured" size="md">
        <p className="text-pt-text-2 text-sm text-center py-8">
          Polymarket prediction integration coming soon.
        </p>
      </GlassCard>
    </div>
  );
}
```

### Create `src/pages/LoginPage.tsx`

```tsx
import { useNavigate } from 'react-router-dom';
import { GlassCard, Button } from '@/components/primitives';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[400px] space-y-8">
        <header className="text-center">
          <h1 className="font-display text-5xl uppercase tracking-wide bg-gradient-to-r from-white via-pt-metal-blue to-pt-purple bg-clip-text text-transparent">
            PitchTank
          </h1>
          <p className="text-pt-text-2 mt-3 text-sm">
            Turn pitches into markets
          </p>
        </header>

        <GlassCard tone="primary" size="lg" className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/trade')}
          >
            Sign in
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/trade')}
          >
            Create account
          </Button>
        </GlassCard>

        <p className="text-pt-text-3 text-xs text-center">
          Login flow coming soon — for now, both buttons go to /trade.
        </p>
      </div>
    </div>
  );
}
```

---

## Step 5 · Replace App.tsx with RouterProvider

### Replace `src/App.tsx` entirely with:

```tsx
import { RouterProvider } from 'react-router-dom';
import { router } from './router';

function App() {
  return <RouterProvider router={router} />;
}

export default App;
```

⚠️ This is a significant simplification — all routing logic now lives in `router/index.tsx` and `MainLayout.tsx`. The `?` key listener is removed.

---

## Step 6 · Verify imports and exports

### 6.1 · Confirm Trade page is exported correctly

The current `src/pages/Trade.jsx` exports `export const Trade = () => { ... }`. The router imports it as `import { Trade } from '@/pages/Trade'`. This should work because of `"allowJs": true` in tsconfig.

If `Trade` is not exported as a named export (e.g. it's `export default`), update `src/router/index.tsx` to:

```tsx
import Trade from '@/pages/Trade';
```

### 6.2 · Confirm Playground export

`src/pages/Playground.tsx` (created in Phase 2) should already export `export function Playground()`. Verify with:

```bash
grep "export.*Playground" src/pages/Playground.tsx
```

Expected output: a line containing `export function Playground` or `export const Playground`.

---

## Step 7 · Remove the temporary `?` key listener

This was added in Phase 2 inside `App.tsx`. Now that App.tsx is replaced entirely (Step 5), the listener is automatically gone.

Verify by searching:

```bash
grep -r "playground" src/App.tsx
```

Should return nothing (or only the file path with no matches).

---

## Step 8 · Verify

### 8.1 · Type check

```bash
npx tsc --noEmit
```

Should complete with no errors.

### 8.2 · Dev server

```bash
npm run dev
```

Open the app in browser at `http://localhost:5173/`. Verify:

1. **Auto-redirect** — landing on `/` immediately redirects to `/trade`
2. **URL bar reflects current tab** — clicking Rankings in BottomNav changes URL to `/rankings`
3. **Browser back / forward** — clicking back returns to previous tab; forward redoes it
4. **Each placeholder page** renders its title and stub message:
   - `/rankings` → "Rankings"
   - `/chat` → "Chat"
   - `/network` → "Network"
   - `/portfolio` → "Portfolio"
5. **`/trade`** still renders the existing Trade page identically — no visual regression
6. **`/playground`** renders the design system showcase from Phase 2
7. **`/login`** renders standalone (no BottomNav at the bottom)
8. **`/polymarket`** renders the placeholder with a "Back to Trade" button
9. **Refresh** any page — the same page loads (URL → state, not just state)
10. **Unknown URL** like `/foobar` redirects to `/trade`

### 8.3 · BottomNav reflects active tab

Click each BottomNav item. The active highlight should follow:
- `/rankings` → Rankings tab is highlighted
- `/trade` → Trade orb is highlighted
- etc.

When on `/playground` or `/polymarket`, the BottomNav should default to the Trade tab being active (per `navTab` fallback in MainLayout).

---

## Acceptance Criteria

Phase 3 is done when ALL of these are true:

- [ ] `src/router/index.tsx` exists and exports the `router` object
- [ ] `src/components/layout/MainLayout.tsx` exists
- [ ] `src/components/layout/PageContainer.tsx` exists
- [ ] 6 placeholder pages exist: `RankingsPage`, `ChatPage`, `NetworkPage`, `PortfolioPage`, `LoginPage`, `PolymarketPage`
- [ ] `src/App.tsx` is now a 6-line file using `<RouterProvider>`
- [ ] No `useState` for tab routing remains in `App.tsx`
- [ ] No `?` key listener remains in `App.tsx`
- [ ] `npm run dev` starts without errors
- [ ] All 8 routes resolve correctly (verified in Step 8.2)
- [ ] Browser back / forward buttons work as expected
- [ ] BottomNav navigation updates the URL
- [ ] `npx tsc --noEmit` passes (JSX warnings on legacy files are OK)

---

## What stays unchanged in Phase 3

- `src/pages/Trade.jsx` — the trade page logic and visuals are not touched. Phase 4 refactors it to use the new primitives.
- `src/components/Charts.jsx` — `EventChart` and `Sparkline` remain as-is.
- `src/components/BottomNav.jsx` — the `setTab` callback signature is unchanged; MainLayout adapts to it via `handleTabChange`.

---

## What Phase 4 will do

Phase 4 will refactor `Trade.jsx` (the actual trade page) to use the v2.1.5 design system:

- Convert `Trade.jsx` → `Trade.tsx`
- Split the 350-line file into 6 sub-components in `src/pages/trade/sections/`
- Replace all inline glass / halo classes with `<GlassCard>`
- Replace all inline button classes with `<Button>`
- Replace all manual percent / money formatting with `<TrendValue>` / `<Money>` / `<Timer>` / `<Sentiment>`
- Auto-color `Sparkline` based on series direction (no more `color={isUp ? ...}` hardcoding)
- Switch the Trading Market container to `tone-frame` (no bg) per v2.1.5 final
- Switch the expanded founder card to `tone-neutral active` (border brightens, no extra bloom)

The visual output should match the v2.1.5 demo exactly.
