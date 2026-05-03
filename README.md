# Pitch Tank Event App

A live-audience trading market for Pitch Tank events. The app turns each
pitching founder into a tradable asset — investors in the room buy and
sell shares in real time, judges score, and the leaderboard updates as
the round runs out.

This is the front-end PWA: phone-first, dark glassmorphism, designed to
live on a stadium screen and a thousand phones at once.

> Status: pre-production. Data is local fixtures + `localStorage`. No
> backend yet.

---

## Tech stack

| Layer        | Choice                                                      |
|--------------|-------------------------------------------------------------|
| Framework    | React 18 + TypeScript (strict)                              |
| Build        | Vite 5                                                      |
| Routing      | `react-router-dom` v7 (`createBrowserRouter`, flat map)     |
| Styling      | Tailwind 3 + CSS custom properties (`tokens.css`)           |
| Variants     | `class-variance-authority` + `clsx` + `tailwind-merge`      |
| Dialogs      | `@radix-ui/react-dialog`                                    |
| Icons        | `lucide-react`                                              |
| QR codes     | `qrcode.react` (SVG render + Canvas download)               |
| Fonts        | Tomorrow (display) + Inter Variable (body), self-hosted     |
| State        | Local React state + `localStorage`. No Redux / Zustand.     |
| Data         | Fixtures in `src/lib/` and `src/pages/<page>/fixtures.ts`   |

No SSR, no test framework wired up yet, no analytics, no auth backend.

---

## Quick start

```bash
npm install
npm run dev        # Vite dev server (default :5173)
npm run build      # production build → dist/
npm run preview    # serve the built bundle locally
```

Path alias: `@/*` → `./src/*` (configured in both [vite.config.ts](vite.config.ts) and [tsconfig.json](tsconfig.json)).

---

## Folder layout

```
src/
├── main.tsx                  # React entry → StrictMode + <App>
├── App.tsx                   # RouterProvider only
├── index.css                 # Tailwind base + tokens.css + fonts + global resets
├── router/index.tsx          # Flat route map (one MainLayout, leaf pages)
│
├── styles/
│   └── tokens.css            # Single source of design truth — see "Design system"
│
├── components/
│   ├── layout/
│   │   ├── MainLayout.tsx    # Page wrapper + BottomNav visibility logic
│   │   └── PageContainer.tsx # Phone column (max-w-[430px], px-6, pb-32)
│   ├── primitives/           # Design-system atoms (cva-driven)
│   │   ├── GlassCard.tsx
│   │   ├── Button.tsx
│   │   ├── IconButton.tsx
│   │   ├── Avatar.tsx
│   │   ├── Tabs.tsx
│   │   ├── IridescentArc.tsx # Shared neon-arc divider (Trade + Profile)
│   │   ├── Money.tsx
│   │   ├── TrendValue.tsx
│   │   ├── Timer.tsx
│   │   ├── Sentiment.tsx
│   │   └── index.ts          # Barrel; primitives are imported from here
│   ├── BottomNav.jsx         # 5-tab phone nav (Leaderboard | Chat | Trade | Network | Profile)
│   └── Charts.jsx
│
├── pages/                    # One file per route + co-located feature folder
│   ├── Trade.tsx             # Default landing route
│   ├── trade/                # BuySellDialog + sections (TradeTopCard, …)
│   ├── LeaderboardPage.tsx
│   ├── leaderboard/          # fixtures
│   ├── ChatPage.tsx
│   ├── chat/                 # Composer, MessageList, RulesModal, AiSummary
│   ├── NetworkPage.tsx
│   ├── network/              # SponsorsPanel, JudgesPanel, FoundersPanel,
│   │   └── components/       #   page-local atoms (Pill, PortraitCard, …)
│   ├── profile/
│   │   ├── ProfilePage.tsx   # /profile (main)
│   │   ├── QrDialog.tsx      # Popup, not a route
│   │   └── SettingsDialog.tsx
│   ├── LoginPage.tsx
│   └── Playground.tsx        # Design-system showcase (temporary)
│
└── lib/                      # Domain helpers (no React)
    ├── current-user.ts       # CURRENT_USER fixture + CurrentUser type
    ├── profile-storage.ts    # localStorage load/save for the profile
    ├── format.ts             # number formatters
    ├── mock-data.ts          # founders / market fixtures
    └── utils.ts              # cn() = clsx + twMerge
```

---

## Routes

All routes are wrapped in `MainLayout` except `/login`. The map is in
[src/router/index.tsx](src/router/index.tsx):

| Path           | Page              | Bottom nav |
|----------------|-------------------|------------|
| `/login`       | LoginPage         | (no layout) |
| `/`            | → redirects to `/trade` | — |
| `/trade`       | Trade (default)   | visible    |
| `/leaderboard` | LeaderboardPage   | hidden     |
| `/chat`        | ChatPage          | hidden     |
| `/network`     | NetworkPage       | visible    |
| `/profile`     | ProfilePage       | visible    |
| `/playground`  | Playground (temp) | visible    |
| `*`            | → `/trade`        | —          |

**Drill-down screens are Radix dialogs, not routes.** QR Code and
Settings open as popups from `/profile` (see "Design principles").

---

## Design system

The design system is **CSS-tokens-first**. The single source of truth
is [src/styles/tokens.css](src/styles/tokens.css) (~1150 lines).

### How tokens flow

```
src/styles/tokens.css                    ← define :root CSS variables
        │
        ├── exposed as Tailwind classes  ← tailwind.config.js bridges
        │     `pt-blue`, `pt-cyan`, `pt-text-2`, …
        │
        └── consumed directly via class names
              `.glass-card.tone-frame`, `.btn-primary`, `.btn-lg`, …
```

Primitives like `GlassCard` and `Button` are *thin React wrappers*: they
use `class-variance-authority` to map `variant`/`size`/`tone` props to
the class names that `tokens.css` defines. The visual rules live in
CSS, not in components.

### Color + tone

| Token            | Hex / value             | Usage                                |
|------------------|-------------------------|--------------------------------------|
| `--c-blue`       | `#4F7CFF`               | Primary brand blue                   |
| `--c-purple`     | `#A259FF`               | Featured, action accents             |
| `--c-cyan`       | `#00E5FF`               | Buy / uptrend / positive             |
| `--c-orange`     | `#FF8A00`               | Sell / downtrend / featured highlight|
| `--c-red`        | `#FF4757`               | Negative state                       |
| `--c-metal-blue` | `#B8D4FF`               | Borders, subtle accents              |
| `--c-metal-white`| `#E8F2FF`               | Dialog titles, headings              |
| `--c-bg-deep`    | `#03040D`               | Page background                      |
| `--c-text-1/2/3` | white at 100/60/35%     | Three-step text hierarchy            |

### `GlassCard` tones

`GlassCard` is the foundational container (and the only one used at the
page-level). Pick a tone for category/state, not for taste:

- `frame` — outline-only, no fill (page hero / settings list)
- `primary` — blue→purple gradient (default leaderboard rows)
- `purple` — purple radial glow (active / selected)
- `cyan` — cyan glow (positive, buy, founder cards)
- `featured` — purple+orange diagonal (sponsor cards, hero items)
- `neutral` — subtle blue (default list items)
- `negative` — orange+red (errors, declines)

### Typography

```ts
font-display: Tomorrow      // Headings, button labels, eyebrows, UI chrome
font-sans:    Inter Variable // Body text, descriptions, metadata
font-mono:    SF Mono        // Inline numerics in some contexts
.num                         // Tabular-num feature; use for currency rows
```

### Iridescent arc

The neon multi-stop arc is a recurring brand element. It lives at
[src/components/primitives/IridescentArc.tsx](src/components/primitives/IridescentArc.tsx) and is used in TradeTopCard, ProfilePage,
and QrDialog. **Don't re-implement** — accept `className` /  `style` to
position it.

---

## Design principles

1. **Phone-shaped column.** Everything renders inside `PageContainer`
   (`max-w-[430px]`, `px-6`). Designs assume an iPhone-sized viewport;
   on desktop the column stays centered with a starfield surround.

2. **Tokens before utility classes.** When a value will be reused, add
   it to `tokens.css` and bridge through `tailwind.config.js`. Don't
   inline magic numbers in components.

3. **Variants over branches.** Primitives use `cva` so a component
   reads `variant="primary" size="lg"` instead of accumulating boolean
   props. Add a new variant when behavior is genuinely different;
   inline a `className` when it's a one-off.

4. **Dialogs > sub-routes.** Drill-down screens that the user expects
   to dismiss back to where they came from (QR Code, Settings, Trade
   form, Chat rules) are Radix dialogs styled with the `trade-dialog-*`
   CSS classes — not routes. This keeps URL state simple and avoids
   page-transition flicker. New popups should use the same pattern as
   [BuySellDialog](src/pages/trade/BuySellDialog.tsx).

5. **Co-locate by feature.** A page lives at `src/pages/<Page>.tsx`
   and its private components live in `src/pages/<page>/`. Promote to
   `src/components/primitives/` only when a second consumer needs it.

6. **Strict TypeScript, light comments.** Names should carry meaning.
   Comments are reserved for hidden constraints, browser quirks, or
   the *why* behind a non-obvious choice — never the *what*.

7. **No mocks for impossible cases.** Validate at system boundaries
   (user input, external APIs). Trust internal types.

8. **Persistence is `localStorage` for now.** No backend exists yet.
   Mocked fixtures power the UI; `localStorage` keys are namespaced
   like `pt:profile:v1`.

---

## Adding a new page

1. Create `src/pages/MyPage.tsx`. Compose primitives + a co-located
   `src/pages/myPage/` folder for atoms that are page-private.
2. Register the route in [src/router/index.tsx](src/router/index.tsx) under the `MainLayout`
   children.
3. If the page owns its own back-arrow header (full-screen drilldown),
   add it to `hideBottomNav` in [src/components/layout/MainLayout.tsx](src/components/layout/MainLayout.tsx).
4. If it's actually a "drill-down" screen, prefer a Radix dialog in
   the parent page over a new route.

## Adding a new primitive

1. New file in `src/components/primitives/`.
2. Use `cva` for variants. Map prop combinations to CSS classes that
   are defined in `tokens.css` — don't redefine the visual rules in
   the component.
3. Export from [src/components/primitives/index.ts](src/components/primitives/index.ts).

## Adding a CSS token

1. Add the variable to `:root` in [src/styles/tokens.css](src/styles/tokens.css).
2. If pages should reference it as a Tailwind class (e.g.
   `bg-pt-mycolor`), bridge it in [tailwind.config.js](tailwind.config.js).
3. Update component-level CSS classes (`.btn-…`, `.glass-card.tone-…`)
   in `tokens.css` if the token enables a new visual variant.

---

## Conventions

- **Path imports** use `@/…` everywhere. Never `../../../`.
- **Asset imports** live in `public/` keyed by feature folder
  (`/leaderboard/skyline.webp`, `/icons/icon-text-horizontal.webp`).
  PNG/WebP for raster, inline SVG for one-offs.
- **Numbers** that line up in tables use the `.num` class
  (font-feature-settings: tabular-nums).
- **Forms** use `font-size: 16px` baseline globally — iOS Safari
  zooms inputs <16px and never zooms back. Set on form controls in
  [src/index.css](src/index.css); override per-component if you must.
- **Scrollbars** are hidden globally via `index.css`. Use the
  `.no-scrollbar` class for explicit opt-in within scrollers.

---

## Known caveats

- `lucide-react` is pinned to a non-canonical version (`1.12.0`). Some
  brand icons (LinkedIn, Twitter) aren't included; use inline SVG.
- Profile edits are persisted to `localStorage` under `pt:profile:v1`,
  but other consumers of `CURRENT_USER` (Chat header, Leaderboard
  fixtures) read the constant directly and don't reflect those edits.
- The QR code encodes `pitchtank.app/u/<handle>` — no public profile
  route exists yet.
- [src/pages/Playground.tsx](src/pages/Playground.tsx) has a pre-existing `tsc` error (Avatar
  prop mismatch). Will be removed in a later phase per the route map
  comment.

---

## Scripts cheatsheet

```bash
npm run dev          # Vite dev server with HMR
npm run build        # Type-check is not part of build; run tsc separately
npx tsc --noEmit     # Type-check the whole project
npm run preview      # Serve dist/ locally
```

---

## Pointers for new contributors

- Start by reading [src/styles/tokens.css](src/styles/tokens.css) and one primitive
  ([GlassCard.tsx](src/components/primitives/GlassCard.tsx) or [Button.tsx](src/components/primitives/Button.tsx)). The pattern repeats.
- Then read [src/pages/trade/BuySellDialog.tsx](src/pages/trade/BuySellDialog.tsx) — it's the canonical
  "complex feature" example: dialog + form + validation + animation.
- Phase docs live in [docs/](docs/).
