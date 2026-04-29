# PitchTank · Phase 4 — Trade Page Style Refactor

> Instructions for Claude Code to execute autonomously.
>
> **Critical rule for this phase**: The user is satisfied with the existing Trade page **layout, content, and interaction logic**. This phase only swaps the visual styling to use the v2.1.5 design system. **Do not change** what's on screen, what order things appear in, what text is shown, or how things behave. Only change *how* the existing pieces are styled and *which primitive* renders them.

## Goal

Migrate `src/pages/Trade.jsx` to TypeScript and replace every legacy class (`.glass`, `.glass-strong`, `.halo-blue`, `.halo-purple`, `.halo-row`, `.glass-tinted-*`, inline button styles, manual percent/money formatting) with the Phase 2 primitives (`GlassCard`, `Button`, `IconButton`, `Tabs`, `Avatar`, `TrendValue`, `Money`, `Timer`, `Sentiment`).

The page's layout, the section order, the text content, the click-to-expand behavior, the header structure, the tabs that exist, the buttons that exist — **all of these stay exactly as they are**. Only the rendering primitives change.

## What this is, and what this isn't

**This is**:
- A 1:1 port of `Trade.jsx` (JSX) → `Trade.tsx` (TypeScript)
- Replacing `<div className="glass-tinted-blue">` with `<GlassCard tone="blue" fill="ghost">` (or whatever v2.1.5 mapping applies — see Step 0)
- Replacing manual `+ {pct.toFixed(2)}%` with `<TrendValue value={pct} />`
- Splitting the file into sub-components ONLY for organization. The split mirrors the existing inner components in Trade.jsx; it does not invent new ones.

**This is not**:
- A redesign
- An opportunity to add new sections, new buttons, new info icons, new sentiment indicators, new arrows, new labels
- An opportunity to reorder the page
- An opportunity to "fix" things you think look wrong
- A chance to add Pitch The One if it didn't exist, or remove things that did

If something exists in `Trade.jsx` today, it must still exist after this phase, in the same place, with the same text. If something doesn't exist today, do not add it.

## Hard constraints

- ❌ Do not modify `src/components/Charts.jsx`. The `EventChart` and `Sparkline` visuals are final.
- ❌ Do not modify `src/components/BottomNav.jsx`.
- ❌ Do not modify any token in `src/styles/tokens.css`.
- ❌ Do not modify any primitive in `src/components/primitives/`.
- ❌ Do not modify the router config.
- ❌ Do not invent new sections, indicators, or interactions. If you find yourself writing `<Sentiment>`, `<ChevronUp>`, an "Event Info" icon, or anything else not in the original, you are off-spec — stop and re-read the original `Trade.jsx`.

---

## Step 0 · Read the existing Trade.jsx, then map every visual element

Before writing any new code, open `src/pages/Trade.jsx` and identify every JSX element. For each one, decide which primitive replaces it. Build this mapping mentally (or in a scratch comment) before touching the file.

The mapping rules from v2.1.5 are:

### Container → primitive mapping

| Legacy class on container | New primitive |
|---|---|
| `glass` (the EventPerformance outer card) | `<GlassCard tone="blue" fill="ghost" size="md">` |
| `glass-tinted-blue` (Trading Market outer card) | `<GlassCard tone="blue" fill="ghost" size="md">` (same — the outer container is "ghost blue") |
| `glass-tinted-cyan` (PitchTheOne banner, if it's cyan today) | `<GlassCard tone="featured" fill="solid" size="md">` *only if it visually corresponds to the Pitch The One banner; if it's something else like a generic info card, use `<GlassCard tone="cyan" fill="solid">`* |
| `halo-row` / collapsed founder row | `<GlassCard tone="cyan" fill="frame" size="sm">` |
| `glass-strong halo-blue` / expanded founder row | `<GlassCard tone="cyan" fill="active" size="sm">` |
| Anything else generic | `<GlassCard tone="blue" fill="ghost">` |

⚠️ If the existing `Trade.jsx` does not have a Pitch The One banner, **do not add one**. The `tone="featured"` row in this table only applies if the banner already exists in the source.

⚠️ If the existing `Trade.jsx` uses a different palette mapping (e.g. some card has an orange halo), preserve the semantic intent — orange in the original maps to `tone="orange"` or `fill` adjustments in the new system. Do not change the visual identity of any card.

### Inline element → primitive mapping

| What you see in Trade.jsx | Replace with |
|---|---|
| `<button className="primary-btn">` or similar | `<Button variant="primary" size="...">` |
| Buy button (any styling) | `<Button variant="buy" size="...">` |
| Sell button (any styling) | `<Button variant="sell" size="...">` |
| Plain text button (Cancel/Skip etc.) | `<Button variant="tertiary" size="...">` |
| `<button>` with just an icon | `<IconButton size="sm|md|lg">` |
| Tab pills row | `<Tabs ...>` (keep the same tabs, same labels, same active default) |
| `<img src="https://i.pravatar.cc/...">` for avatars | `<Avatar initial="X" />` |
| Manual `${value.toLocaleString()}` for money | `<Money value={value} />` |
| Manual `+ {pct.toFixed(2)}%` or `- {pct}%` for trend | `<TrendValue value={pct} />` |
| Countdown like `5:23s` rendered manually | `<Timer seconds={n} />` |
| Hand-rolled SVG icon | Equivalent `lucide-react` icon |

### Size choices

Keep button sizes faithful to what's there today:
- The most prominent CTA in the page → `size="lg"`
- Buy/Sell pair inside an expanded card → `size="md"`
- Anything inline / smaller → `size="sm"`

If a button doesn't exist in the original, do not invent one.

### Text content

All headings, labels, captions, button text, tab labels stay verbatim from `Trade.jsx`. Do not rewrite "Trading Market" to "TRADING MARKET" unless it was uppercase originally; the primitives' `font-display` styling already handles tracking/case where needed.

---

## Step 1 · Extract the mock data unchanged

The current `Trade.jsx` has a `FOUNDERS` array and possibly an `EVENT_SERIES` constant inline. Move them out **without changing any values**.

### Create `src/lib/mock-data.ts`

Copy `FOUNDERS`, `EVENT_SERIES`, and any other top-level constants from `Trade.jsx` verbatim. Add a TypeScript `interface` for `Founder` based on the actual fields present in the source array. Do not add fields that aren't there, do not rename fields, do not change values.

The interface:

```ts
export interface Founder {
  id: string;
  name: string;
  company: string;
  // ... add the rest by reading the actual fields in Trade.jsx
}

export const FOUNDERS: Founder[] = [
  // ... copy verbatim from Trade.jsx
];

// If EVENT_SERIES exists in Trade.jsx, copy it too:
export const EVENT_SERIES = [/* verbatim */];
```

⚠️ If a founder field doesn't exist in `Trade.jsx`, do not add it. If `EVENT_SERIES` doesn't exist as a separate const but is inlined in JSX, leave it inline — don't extract it.

---

## Step 2 · Convert Trade.jsx to Trade.tsx, structure-preserved

### 2.1 · Rename and re-type, no logic changes

Create `src/pages/Trade.tsx` with the same top-level structure as `Trade.jsx`:

- Same imports (now updated to use primitives instead of legacy classes)
- Same `useState` calls in the same order with the same initial values
- Same handler functions with the same names and bodies
- Same JSX tree, but with primitives swapped in per Step 0's mapping
- Same export name (`export function Trade` or `export const Trade = ...`, matching whatever the source uses)

### 2.2 · Component split

If `Trade.jsx` already defines internal sub-components (e.g. `EventPerformance`, `TradingMarket`, `CollapsedFounder`, `ExpandedFounder`, `Header`, `PitchTheOne`), move each to its own file under `src/pages/trade/sections/`, keeping the **same component name**. Do not rename `CollapsedFounder` to `FounderRow`, do not rename `EventPerformance` to anything else.

The folder layout becomes:

```
src/pages/
  Trade.tsx                      ← top-level page, composes the sections
  trade/
    sections/
      Header.tsx                 ← if Trade.jsx has an inline Header, extract it
      EventPerformance.tsx       ← keeps its current name and content
      TradingMarket.tsx          ← keeps its current name and content
      CollapsedFounder.tsx       ← keeps its current name and content
      ExpandedFounder.tsx        ← keeps its current name and content
      PitchTheOne.tsx            ← only if it exists in Trade.jsx; same name
```

⚠️ If `Trade.jsx` defines all of these inline as nested function components rather than as named ones, keep the same names when extracting. If `Trade.jsx` uses different names than what I've listed, use the actual names from the source — those names above are guesses based on earlier conversations.

⚠️ If `Trade.jsx` does NOT have, say, a `PitchTheOne` component, do not create one. The list above is exhaustive of what *might* exist; only port what *does* exist.

### 2.3 · Per-section conversion rules

For each section file:

1. The component takes the same props it took inline in `Trade.jsx` (if it took any).
2. The JSX tree inside is structurally identical to the inline version.
3. Wrap container `<div className="glass...">` becomes `<GlassCard tone="..." fill="..." size="...">` per Step 0.
4. Inline buttons become `<Button>`.
5. Manual number formatting becomes `<Money>` / `<TrendValue>` / `<Timer>`.
6. Hand-rolled SVG icons become `lucide-react` icons inside `<IconButton>` (when they were already buttons) or as bare lucide elements (when they were decorative).
7. Avatar images / initials become `<Avatar>`.
8. Tab pills become `<Tabs>`.
9. Spacing/margin classes (`mb-3`, `gap-2`, `flex`, etc.) stay as-is — those are layout, not visual style. Do not strip or restyle them.

### 2.4 · TypeScript conversion

- Add prop interfaces for any component that takes props.
- Use `Founder` from `mock-data.ts` as the type for any prop that's a founder object.
- All `useState` calls get type inference from initial values; no explicit generics needed unless the initial value is `null` or `undefined`.
- Event handlers get the proper event types (`React.MouseEvent<HTMLButtonElement>` etc.) only where TS complains; otherwise use inference.

---

## Step 3 · Update the top-level Trade composer

`Trade.tsx` (the page file itself) stays close to its original shape — same wrappers, same section order, same wrapper divs. Just imports the section components from their new locations.

Example shape (this is illustrative; match the actual original structure):

```tsx
import { Header } from './trade/sections/Header';
import { EventPerformance } from './trade/sections/EventPerformance';
import { TradingMarket } from './trade/sections/TradingMarket';
// ...etc, only those that exist

export function Trade() {
  // Whatever state lived at the page level in Trade.jsx stays at the page level
  // (e.g. `expandedFounderId` if it was lifted that high)

  return (
    <>
      <Header />
      <EventPerformance />
      <TradingMarket />
      {/* ...same order as Trade.jsx */}
    </>
  );
}
```

If the original `Trade.jsx` lifted state up to the top-level (e.g. tracking which founder is expanded), keep it there. If it kept state local to `TradingMarket`, keep it there. **Do not relocate state.**

---

## Step 4 · Delete the old file

Once `Trade.tsx` works:

```bash
rm src/pages/Trade.jsx
```

Confirm `src/router/index.tsx` still resolves: the router import line `import { Trade } from '@/pages/Trade'` works for both `.jsx` and `.tsx`, so no router edit is needed.

---

## Step 5 · Verify

### 5.1 · Type check

```bash
npx tsc --noEmit
```

Expected to pass. Common failures:
- A primitive prop name mismatch — read the primitive source under `src/components/primitives/` and use its actual prop names.
- A missing Founder field — if you typed something Trade.jsx didn't actually use, drop it; if Trade.jsx uses a field you didn't type, add it.

### 5.2 · Visual diff vs the previous build

```bash
npm run dev
```

Open `/trade`. **Side-by-side compare with a screenshot of the previous build** (before this phase). The screen should look like the same page, with the cards now using the v2.1.5 borders/glows/typography instead of the legacy `.halo-*` look.

What should be **identical**:
- Section order
- Section content (every label, every number, every word)
- Which cards are expanded by default
- Which tabs are active by default
- Which buttons exist where
- Click-to-expand behavior
- Tab switching behavior
- Any countdown / timer display
- The chart inside Event Performance

What should be **different** (because of the design system swap):
- Card borders (now conic metal gradient per v2.1.5, not LED halo)
- Card backgrounds (now semantic per `tone`/`fill`)
- Button styling (now primitive-driven, with proper shimmer where applicable)
- Number rendering (now via `Money` / `TrendValue` with consistent tracking and color)
- Icons (now lucide-react, stroke-width 1.5)
- Avatars (now via Avatar primitive)

### 5.3 · Code-quality grep

```bash
# No legacy classes anywhere under the trade page
grep -rn "halo-\|glass-tinted\|glass-strong\|seg-on" src/pages/Trade.tsx src/pages/trade/
# Should output nothing.

# No raw className="glass" containers (the primitive replaces them)
grep -rn 'className="glass"' src/pages/Trade.tsx src/pages/trade/
# Should output nothing.

# Sanity: the page file is a thin composer
wc -l src/pages/Trade.tsx
```

`Trade.tsx` itself should be roughly the same size as `Trade.jsx` was *before* sub-components were extracted — minus the inline visual definitions, plus imports. If `Trade.jsx` was 350 lines, `Trade.tsx` after extracting 4–6 sections will likely be 30–80 lines. The section files together account for the rest.

### 5.4 · Functional checks

Walk through every interaction on `/trade`:
- ✅ Clicking a collapsed founder expands it (and collapses any previously expanded one, or whatever the original did — match the original).
- ✅ Clicking the expanded founder collapses it (if that's how the original behaved).
- ✅ Tab switches reorder/filter the list (if the original did this).
- ✅ Buy / Sell buttons fire whatever handler they fired before (likely a `console.log` or a placeholder for Phase 5).
- ✅ The countdown timer continues to count down (if the original had one).
- ✅ The event chart still renders.

If any interaction broke, the bug is almost certainly in how a handler was wired through the new primitive — the primitives all support `onClick`, but Buy/Sell/`<Button>` may need the handler on `onClick`, not on a `onPress` or similar.

---

## Acceptance Criteria

Phase 4 is done when ALL of these are true:

- [ ] `src/pages/Trade.jsx` is deleted
- [ ] `src/pages/Trade.tsx` exists and imports from `src/pages/trade/sections/`
- [ ] Every section component that existed inline in `Trade.jsx` exists as its own file under `src/pages/trade/sections/`, with the **same component name** as before
- [ ] `src/lib/mock-data.ts` exists with FOUNDERS (and any other extracted constants) typed via a `Founder` interface
- [ ] No `.halo-*`, `.glass-tinted-*`, `.glass-strong`, `.glass`, `.seg-on` classes anywhere under `src/pages/Trade.tsx` or `src/pages/trade/`
- [ ] All buttons use `<Button>`; all icon-only buttons use `<IconButton>`
- [ ] All glass cards use `<GlassCard>`
- [ ] All numbers use `<Money>` / `<TrendValue>` / `<Timer>` (whichever applies)
- [ ] All avatars use `<Avatar>`
- [ ] All tab rows use `<Tabs>`
- [ ] All hand-rolled SVG icons that survived from Phase 1's `Icons.jsx` deletion are now `lucide-react` icons
- [ ] `npx tsc --noEmit` passes
- [ ] Visual side-by-side: same layout, same content, same order, same interactions; only the styling has shifted to v2.1.5

---

## Common pitfalls to avoid

1. **Inventing content**. If the original doesn't have a sentiment indicator, do not add one. If the original doesn't show a "vs last month" delta, do not add one. If the original has 4 founders, the result has 4 founders — same names, same companies, same data.

2. **Renaming components**. `CollapsedFounder` stays `CollapsedFounder`. `EventPerformance` stays `EventPerformance`. The names are part of the user's mental model of their codebase.

3. **Reordering**. The page's vertical order matches the original line-for-line.

4. **Restyling primitives to match old look**. The primitives are the source of truth now. Do not pass overrides like `style={{ background: 'rgba(...)' }}` to a `GlassCard` to make it look more like the old `halo-blue`. The whole point is to replace the old look with the design system.

5. **Touching Charts.jsx**. The user has approved the existing `EventChart` and `Sparkline` visuals. Do not modify them. If `Sparkline` requires a `color` prop, pass the same color the original passed. If you find yourself wanting to "auto-determine color from series direction" — stop, that's not part of this phase.

6. **Touching primitives**. If a primitive's API doesn't match what you need, that's a signal that you're trying to do something the design system doesn't support — which means you're probably going beyond what the original Trade.jsx actually does. Re-read the original.

---

## What Phase 5 will do

Phase 5 will add the modal layer on top of this refactored page:

- `BuySellSheet` — wired to the `<Button variant="buy">` and `<Button variant="sell">` calls inside `ExpandedFounder`
- `EventInfoDialog` — wired to whichever icon button in the header opens event details (only if such a button exists in `Trade.jsx`)
- `RulesDialog` — wired to whichever button in the header opens the rules (only if such a button exists)

The handlers wired in this phase (likely `console.log` placeholders) will be swapped out for `setSheetOpen(true)` calls in Phase 5.
