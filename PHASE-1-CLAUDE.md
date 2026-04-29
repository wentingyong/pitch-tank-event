# PitchTank · Phase 1 — Foundation Setup

> Instructions for Claude Code to execute autonomously.

## Goal

Set up the project foundation for PitchTank's design system v2.1.5 refactor. **No visual changes** in this phase — the app must look identical after Phase 1. We're laying down TypeScript, design tokens, fonts, and shadcn/ui infrastructure.

## Context

- Existing project: React 18 + Vite + Tailwind, JSX only
- Current files in `src/`: `App.jsx`, `main.jsx`, `index.css`, `components/`, `pages/`
- We are migrating to TypeScript, adding shadcn/ui, and replacing the design tokens
- Existing `Charts.jsx` and `BottomNav.jsx` must remain functional after this phase
- Existing `Trade.jsx` must remain functional after this phase (will be refactored in Phase 4)
- Existing `Icons.jsx` will be removed in Phase 2 (lucide replaces it). For Phase 1, leave it.

## Execution Order

Follow these steps **in order**. Verify each step before moving to the next.

---

## Step 1 · Install dependencies

Run these commands in the project root:

```bash
npm install react-router-dom clsx tailwind-merge class-variance-authority lucide-react @fontsource/tomorrow @fontsource-variable/inter tailwindcss-animate
```

```bash
npm install -D typescript @types/node @types/react @types/react-dom
```

Verify `package.json` now contains all of the above.

---

## Step 2 · Delete obsolete files

```bash
rm -f src/main.jsx src/App.jsx vite.config.js
```

These will be replaced by `.tsx` versions in subsequent steps.

---

## Step 3 · Create TypeScript configs

### Create `tsconfig.json` (project root)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true,
    "allowJs": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

### Create `tsconfig.node.json` (project root)

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
```

---

## Step 4 · Create new Vite config (TypeScript + path alias)

### Create `vite.config.ts` (project root)

```ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

---

## Step 5 · Create design system token files

### Create `src/styles/tokens.css`

This is the **complete PitchTank Design System v2.1.5** as CSS variables and component classes. The colors and structure here are final — do not modify them.

```css
/* ============================================================
   PITCHTANK · TOKENS · v2.1.5
   ============================================================ */

:root {
  /* === COLORS · 视觉层 === */
  --c-blue:        #4F7CFF;
  --c-blue-deep:   #2B4FE0;
  --c-purple:      #A259FF;
  --c-cyan:        #00E5FF;
  --c-orange:      #FF8A00;
  --c-red:         #FF4757;
  --c-metal-blue:  #B8D4FF;
  --c-metal-white: #E8F2FF;
  --c-bg-deep:     #03040D;

  /* === TEXT === */
  --c-text-1: #FFFFFF;
  --c-text-2: rgba(255, 255, 255, 0.6);
  --c-text-3: rgba(255, 255, 255, 0.35);

  /* === RADIUS === */
  --radius-card:  18px;
  --radius-mini:  12px;
  --radius-pill:  999px;

  /* === BUTTON HEIGHT === */
  --btn-h-lg: 52px;
  --btn-h-md: 40px;
  --btn-h-sm: 32px;

  /* === MOTION === */
  --motion-fast: 150ms cubic-bezier(0.4, 0, 0.2, 1);
  --motion-base: 250ms cubic-bezier(0.4, 0, 0.2, 1);
  --motion-slow: 400ms cubic-bezier(0.4, 0, 0.2, 1);
}

/* ============================================================
   PAGE BACKGROUND · 星空 + 微弱色斑
   ============================================================ */
.page-bg {
  background:
    radial-gradient(2px 2px at 20% 30%, rgba(255,255,255,0.4) 50%, transparent 100%),
    radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.3) 50%, transparent 100%),
    radial-gradient(1.5px 1.5px at 80% 20%, rgba(184,212,255,0.5) 50%, transparent 100%),
    radial-gradient(1px 1px at 30% 80%, rgba(162,89,255,0.3) 50%, transparent 100%),
    radial-gradient(circle at 75% 25%, rgba(79,124,255,0.10) 0%, transparent 45%),
    radial-gradient(circle at 25% 80%, rgba(162,89,255,0.08) 0%, transparent 45%),
    var(--c-bg-deep);
}

/* ============================================================
   GLASS CARD · 基础 + 6 个 tone × active 修饰
   ============================================================ */
.glass-card {
  position: relative;
  border-radius: var(--radius-card);
  backdrop-filter: blur(20px) saturate(1.2);
  -webkit-backdrop-filter: blur(20px) saturate(1.2);
  overflow: hidden;
  transition: all var(--motion-base);
  background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  box-shadow:
    inset 0 1px 0 rgba(255,255,255,0.08),
    0 4px 20px rgba(0,0,0,0.3);
}
.glass-card > * { position: relative; z-index: 1; }

.glass-card::after {
  content: "";
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.10));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
          mask-composite: exclude;
  pointer-events: none;
}

/* === TONE-FRAME · 容器 (无 bg) === */
.glass-card.tone-frame {
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  box-shadow:
    inset 0 1px 0 rgba(184,212,255,0.10),
    0 0 24px rgba(79,124,255,0.06);
}
.glass-card.tone-frame::after {
  background: linear-gradient(90deg,
    rgba(43,79,224,0.7) 0%,
    rgba(79,124,255,1) 25%,
    rgba(162,89,255,1) 60%,
    rgba(140,110,240,0.8) 80%,
    rgba(79,124,255,0.7) 100%
  );
}

/* === TONE-PRIMARY · 紫蓝水平渐变 (有 bg) === */
.glass-card.tone-primary {
  background:
    linear-gradient(90deg,
      rgba(43,79,224,0.18) 0%,
      rgba(79,124,255,0.22) 25%,
      rgba(140,110,240,0.22) 55%,
      rgba(162,89,255,0.20) 70%,
      rgba(79,124,255,0.18) 100%
    ),
    radial-gradient(ellipse 100% 60% at 50% 0%, rgba(184,212,255,0.10) 0%, transparent 70%);
  box-shadow:
    inset 0 1px 0 rgba(184,212,255,0.20),
    0 0 30px rgba(79,124,255,0.12),
    0 4px 20px rgba(0,0,0,0.3);
}
.glass-card.tone-primary::after {
  background: linear-gradient(90deg,
    rgba(43,79,224,0.7) 0%,
    rgba(79,124,255,1) 25%,
    rgba(162,89,255,1) 60%,
    rgba(140,110,240,0.8) 80%,
    rgba(79,124,255,0.7) 100%
  );
}

/* === TONE-PURPLE · active 选中 === */
.glass-card.tone-purple {
  background:
    radial-gradient(ellipse 70% 60% at 50% 0%, rgba(162,89,255,0.20) 0%, transparent 70%),
    radial-gradient(ellipse 40% 30% at 50% 100%, rgba(79,124,255,0.10) 0%, transparent 70%),
    linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
  box-shadow: inset 0 1px 0 rgba(220,200,255,0.25), 0 0 40px rgba(162,89,255,0.20), 0 4px 20px rgba(0,0,0,0.3);
}
.glass-card.tone-purple::after {
  background: conic-gradient(from 180deg at 50% 50%,
    rgba(162,89,255,0.4), rgba(220,200,255,1) 17%, rgba(162,89,255,0.6) 33%,
    rgba(79,124,255,0.4) 50%, rgba(162,89,255,0.6) 67%, rgba(220,200,255,1) 83%, rgba(162,89,255,0.4));
}

/* === TONE-CYAN · positive / 上涨 === */
.glass-card.tone-cyan {
  background:
    radial-gradient(ellipse 80% 70% at 50% 0%, rgba(0,229,255,0.22) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 50% 100%, rgba(79,124,255,0.10) 0%, transparent 70%),
    linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
  box-shadow: inset 0 1px 0 rgba(184,240,255,0.3), 0 0 50px rgba(0,229,255,0.25), 0 4px 20px rgba(0,0,0,0.3);
}
.glass-card.tone-cyan::after {
  background: conic-gradient(from 180deg at 50% 50%,
    rgba(0,229,255,0.5), rgba(184,240,255,1) 17%, rgba(0,229,255,0.7) 33%,
    rgba(79,124,255,0.4) 50%, rgba(0,229,255,0.7) 67%, rgba(184,240,255,1) 83%, rgba(0,229,255,0.5));
}

/* === TONE-FEATURED · purple → orange (Pitch The One) === */
.glass-card.tone-featured {
  background:
    radial-gradient(ellipse 70% 60% at 0% 0%, rgba(162,89,255,0.25) 0%, transparent 70%),
    radial-gradient(ellipse 70% 60% at 100% 100%, rgba(255,138,0,0.22) 0%, transparent 70%),
    linear-gradient(135deg, rgba(162,89,255,0.10) 0%, rgba(255,138,0,0.08) 100%);
  box-shadow:
    inset 0 1px 0 rgba(255,210,180,0.25),
    0 0 50px rgba(162,89,255,0.20),
    0 0 80px rgba(255,138,0,0.12),
    0 4px 20px rgba(0,0,0,0.3);
}
.glass-card.tone-featured::after {
  background: conic-gradient(from 225deg at 50% 50%,
    rgba(162,89,255,0.5), rgba(220,200,255,1) 8%, rgba(162,89,255,0.8) 25%,
    rgba(255,79,0,0.5) 50%, rgba(255,138,0,0.9) 67%, rgba(255,210,150,1) 83%,
    rgba(255,138,0,0.6) 94%, rgba(162,89,255,0.5));
}

/* === TONE-NEUTRAL · 列表项默认 === */
.glass-card.tone-neutral {
  background:
    radial-gradient(ellipse 60% 50% at 0% 0%, rgba(79,124,255,0.18) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 100% 100%, rgba(79,124,255,0.10) 0%, transparent 70%),
    linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%);
  box-shadow:
    inset 0 1px 0 rgba(184,212,255,0.18),
    0 0 24px rgba(79,124,255,0.15),
    0 4px 20px rgba(0,0,0,0.3);
}
.glass-card.tone-neutral::after {
  background: conic-gradient(from 225deg at 50% 50%,
    rgba(79,124,255,0.55) 0deg,
    rgba(184,212,255,0.95) 30deg,
    rgba(79,124,255,0.85) 90deg,
    rgba(140,170,255,0.5) 180deg,
    rgba(184,212,255,0.85) 270deg,
    rgba(79,124,255,0.55) 360deg
  );
}

/* === TONE-NEUTRAL · ACTIVE (只调亮 border) === */
.glass-card.tone-neutral.active {
  background:
    radial-gradient(ellipse 60% 50% at 0% 0%, rgba(79,124,255,0.18) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 100% 100%, rgba(79,124,255,0.10) 0%, transparent 70%),
    linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.02) 100%);
  box-shadow:
    inset 0 1px 0 rgba(184,212,255,0.18),
    0 0 24px rgba(79,124,255,0.15),
    0 4px 20px rgba(0,0,0,0.3);
}
.glass-card.tone-neutral.active::after {
  background: conic-gradient(from 225deg at 50% 50%,
    rgba(79,124,255,1) 0deg,
    rgba(255,255,255,1) 30deg,
    rgba(140,180,255,1) 90deg,
    rgba(184,212,255,1) 180deg,
    rgba(255,255,255,1) 270deg,
    rgba(79,124,255,1) 360deg
  );
}

/* === TONE-NEGATIVE === */
.glass-card.tone-negative {
  background:
    radial-gradient(ellipse 60% 50% at 0% 100%, rgba(255,138,0,0.15) 0%, transparent 70%),
    radial-gradient(ellipse 50% 40% at 100% 0%, rgba(255,71,87,0.10) 0%, transparent 70%),
    linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
  box-shadow: inset 0 1px 0 rgba(255,200,180,0.15), 0 0 30px rgba(255,138,0,0.10), 0 4px 20px rgba(0,0,0,0.3);
}
.glass-card.tone-negative::after {
  background: conic-gradient(from 45deg at 50% 50%,
    rgba(255,138,0,0.3), rgba(255,200,180,0.9) 8%, rgba(255,71,87,0.6) 25%,
    rgba(255,255,255,0.08) 50%, rgba(255,138,0,0.5) 75%, rgba(255,138,0,0.3));
}

/* === SIZES === */
.size-sm { padding: 12px 14px; }
.size-md { padding: 18px 20px; }
.size-lg { padding: 24px 26px; }

/* ============================================================
   BUTTONS
   ============================================================ */
.btn {
  font-family: 'Tomorrow', system-ui, sans-serif;
  font-weight: 500;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: 0;
  cursor: pointer;
  border-radius: var(--radius-mini);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all var(--motion-fast);
  white-space: nowrap;
  position: relative;
  overflow: hidden;
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--c-text-1);
}
.btn:active { transform: translateY(1px); filter: brightness(0.92); }
.btn:disabled { opacity: 0.35; cursor: not-allowed; }
.btn-lg { height: var(--btn-h-lg); padding: 0 24px; font-size: 14px; }
.btn-md { height: var(--btn-h-md); padding: 0 18px; font-size: 12px; }
.btn-sm { height: var(--btn-h-sm); padding: 0 14px; font-size: 11px; }

.btn::after {
  content: ""; position: absolute; inset: 0;
  border-radius: inherit; padding: 1px;
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none;
}

/* === PRIMARY · 紫蓝渐变 === */
.btn-primary {
  color: var(--c-metal-white);
  text-shadow: 0 0 12px rgba(184,212,255,0.6);
  background:
    linear-gradient(90deg,
      rgba(43,79,224,0.20) 0%,
      rgba(79,124,255,0.25) 30%,
      rgba(162,89,255,0.20) 70%,
      rgba(79,124,255,0.20) 100%
    ),
    rgba(255,255,255,0.03);
  box-shadow:
    inset 0 1px 0 rgba(184,212,255,0.25),
    0 0 24px rgba(79,124,255,0.20),
    0 0 32px rgba(162,89,255,0.15);
}
.btn-primary::after {
  background: linear-gradient(90deg,
    rgba(43,79,224,0.7) 0%,
    rgba(79,124,255,1) 25%,
    rgba(162,89,255,1) 60%,
    rgba(140,110,240,0.8) 80%,
    rgba(79,124,255,0.7) 100%
  );
}

/* === FEATURED · purple+orange (用 <span> 包文字) === */
.btn-featured {
  background:
    radial-gradient(ellipse 60% 100% at 0% 50%, rgba(162,89,255,0.18) 0%, transparent 60%),
    radial-gradient(ellipse 60% 100% at 100% 50%, rgba(255,138,0,0.15) 0%, transparent 60%),
    rgba(255,255,255,0.03);
  color: transparent;
  box-shadow: inset 0 1px 0 rgba(255,210,180,0.3), 0 0 28px rgba(162,89,255,0.30), 0 0 48px rgba(255,138,0,0.20);
}
.btn-featured > span {
  background: linear-gradient(90deg, #DCC8FF 0%, #FFC896 100%);
  -webkit-background-clip: text; background-clip: text;
  -webkit-text-fill-color: transparent;
  text-shadow: 0 0 14px rgba(220,150,200,0.6);
  font-family: inherit; font-weight: 500;
  letter-spacing: 0.05em; text-transform: uppercase;
}
.btn-featured::after {
  background: conic-gradient(from 225deg at 50% 50%,
    rgba(162,89,255,0.6), rgba(220,200,255,1) 8%, rgba(162,89,255,0.8) 25%,
    rgba(255,79,0,0.5) 50%, rgba(255,138,0,0.9) 67%, rgba(255,210,150,1) 83%, rgba(162,89,255,0.6));
}

/* === BUY · cyan === */
.btn-buy {
  color: var(--c-cyan); text-shadow: 0 0 12px rgba(0,229,255,0.7);
  background: radial-gradient(ellipse 100% 100% at 50% 50%, rgba(0,229,255,0.10) 0%, transparent 60%), rgba(255,255,255,0.02);
  box-shadow: inset 0 1px 0 rgba(184,240,255,0.2), 0 0 24px rgba(0,229,255,0.3);
}
.btn-buy::after {
  background: conic-gradient(from 180deg at 50% 50%,
    rgba(0,229,255,0.4), rgba(184,240,255,1) 25%, rgba(0,229,255,0.6) 50%,
    rgba(0,200,200,0.4) 75%, rgba(0,229,255,0.4));
}

/* === SELL · orange === */
.btn-sell {
  color: var(--c-orange); text-shadow: 0 0 12px rgba(255,138,0,0.6);
  background: radial-gradient(ellipse 100% 100% at 50% 50%, rgba(255,138,0,0.10) 0%, transparent 60%), rgba(255,255,255,0.02);
  box-shadow: inset 0 1px 0 rgba(255,200,150,0.2), 0 0 24px rgba(255,138,0,0.3);
}
.btn-sell::after {
  background: conic-gradient(from 0deg at 50% 50%,
    rgba(255,138,0,0.4), rgba(255,200,150,1) 25%, rgba(255,71,87,0.6) 50%,
    rgba(180,60,30,0.4) 75%, rgba(255,138,0,0.4));
}

/* === SECONDARY · 白色 ghost === */
.btn-secondary { color: var(--c-text-1); background: rgba(255,255,255,0.03); }
.btn-secondary::after {
  background: linear-gradient(135deg, rgba(255,255,255,0.3), rgba(255,255,255,0.08) 50%, rgba(255,255,255,0.2));
}

/* === TERTIARY · 纯文字 === */
.btn-tertiary { background: transparent; color: var(--c-text-2); box-shadow: none; }
.btn-tertiary::after { display: none; }
.btn-tertiary:hover { color: var(--c-text-1); }

/* === SHIMMER === */
.btn-shimmer::before {
  content: ''; position: absolute; top: 0; bottom: 0; left: 0;
  width: 100%;
  background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%);
  transform: translateX(-100%);
  animation: pt-shimmer 3s ease-in-out infinite;
  pointer-events: none; z-index: 0;
}
@keyframes pt-shimmer {
  0% { transform: translateX(-100%); }
  60% { transform: translateX(100%); }
  100% { transform: translateX(100%); }
}

/* ============================================================
   ICON BUTTON
   ============================================================ */
.icon-btn {
  border-radius: var(--radius-mini);
  background: rgba(255,255,255,0.03);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--motion-fast);
  color: var(--c-text-2);
  position: relative;
  border: 0;
}
.icon-btn::after {
  content: ""; position: absolute; inset: 0;
  border-radius: inherit; padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none;
}
.icon-btn:hover { color: var(--c-text-1); }
.icon-btn-sm { width: 32px; height: 32px; }
.icon-btn-md { width: 40px; height: 40px; }
.icon-btn-lg { width: 48px; height: 48px; }
.icon-btn.active { color: var(--c-purple); }
.icon-btn.active::after {
  background: conic-gradient(from 180deg,
    rgba(162,89,255,0.4), rgba(220,200,255,1),
    rgba(162,89,255,0.6), rgba(79,124,255,0.4), rgba(162,89,255,0.4)
  );
}
.icon-btn svg { width: 50%; height: 50%; }

/* ============================================================
   TABS
   ============================================================ */
.pt-tabs {
  display: inline-flex; background: rgba(255,255,255,0.02);
  border-radius: var(--radius-pill); padding: 4px; gap: 2px; position: relative;
}
.pt-tabs::after {
  content: ""; position: absolute; inset: 0;
  border-radius: inherit; padding: 1px;
  background: linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05));
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor; mask-composite: exclude;
  pointer-events: none;
}
.pt-tab {
  font-family: 'Tomorrow', system-ui, sans-serif;
  font-weight: 500; font-size: 11px;
  letter-spacing: 0.1em; text-transform: uppercase;
  padding: 8px 18px; border-radius: var(--radius-pill);
  background: transparent; border: 0; color: var(--c-text-2);
  cursor: pointer; transition: all var(--motion-fast);
}
.pt-tab:hover { color: var(--c-text-1); }
.pt-tab.active {
  color: var(--c-purple);
  text-shadow: 0 0 10px rgba(162,89,255,0.7);
  background: rgba(162,89,255,0.06);
  box-shadow:
    inset 0 0 0 1px rgba(220,200,255,0.4),
    inset 0 0 12px rgba(162,89,255,0.25),
    0 0 16px rgba(162,89,255,0.3);
}

/* ============================================================
   UTILITY · tabular numerics for all numbers
   ============================================================ */
.num {
  font-variant-numeric: tabular-nums;
  font-feature-settings: "tnum" 1;
}
```

---

## Step 6 · Replace the global stylesheet

### Replace `src/index.css` entirely with:

```css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* PitchTank Design System Tokens */
@import './styles/tokens.css';

/* Self-hosted fonts */
@import '@fontsource/tomorrow/400.css';
@import '@fontsource/tomorrow/500.css';
@import '@fontsource/tomorrow/600.css';
@import '@fontsource-variable/inter';

/* === Global === */
html, body {
  background: var(--c-bg-deep);
  color: var(--c-text-1);
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

body {
  font-family: 'Inter Variable', 'Inter', system-ui, sans-serif;
}

/* === Hide scrollbar (utility) === */
.no-scrollbar::-webkit-scrollbar { display: none; }
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* === iOS safe area === */
@supports (padding-bottom: env(safe-area-inset-bottom)) {
  .pb-safe {
    padding-bottom: calc(env(safe-area-inset-bottom) + 20px) !important;
  }
}
```

---

## Step 7 · Replace Tailwind config

### Replace `tailwind.config.js` entirely with:

```js
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // PitchTank token bridge → CSS variables in tokens.css
        'pt-blue':       'var(--c-blue)',
        'pt-blue-deep':  'var(--c-blue-deep)',
        'pt-cyan':       'var(--c-cyan)',
        'pt-purple':     'var(--c-purple)',
        'pt-orange':     'var(--c-orange)',
        'pt-red':        'var(--c-red)',
        'pt-metal-blue': 'var(--c-metal-blue)',
        'pt-metal-white':'var(--c-metal-white)',
        'pt-bg':         'var(--c-bg-deep)',
        'pt-text-1':     'var(--c-text-1)',
        'pt-text-2':     'var(--c-text-2)',
        'pt-text-3':     'var(--c-text-3)',

        // shadcn defaults
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
      },
      borderRadius: {
        'card': 'var(--radius-card)',
        'mini': 'var(--radius-mini)',
        'pt-pill': 'var(--radius-pill)',
        // shadcn
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      height: {
        'btn-lg': 'var(--btn-h-lg)',
        'btn-md': 'var(--btn-h-md)',
        'btn-sm': 'var(--btn-h-sm)',
      },
      fontFamily: {
        display: ['Tomorrow', 'system-ui', 'sans-serif'],
        sans:    ['"Inter Variable"', 'Inter', 'system-ui', 'sans-serif'],
        mono:    ['ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      transitionTimingFunction: {
        'pt-ease': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
```

---

## Step 8 · Create utility libraries

### Create `src/lib/utils.ts`

```ts
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
```

### Create `src/lib/format.ts`

```ts
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
```

---

## Step 9 · Create new entry points (TypeScript)

### Create `src/main.tsx`

```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### Create `src/App.tsx`

This preserves the existing Phase 0 behavior — useState-based tab switching. We'll migrate to react-router in Phase 3.

```tsx
import { useState } from 'react';
import { Trade } from './pages/Trade';
import { BottomNav } from './components/BottomNav';

function App() {
  const [tab, setTab] = useState('trade');

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

---

## Step 10 · Update index.html

Ensure `index.html` references `/src/main.tsx` (not `.jsx`):

```html
<script type="module" src="/src/main.tsx"></script>
```

---

## Step 11 · Initialize shadcn/ui

Run:

```bash
npx shadcn@latest init
```

Answer prompts as follows:
- Style: **New York**
- Base color: **Slate**
- CSS file: **src/index.css**
- CSS variables: **yes**
- Tailwind config: **tailwind.config.js**
- Components alias: **@/components**
- Utils alias: **@/lib/utils**
- React Server Components: **No**

**Important: shadcn init will overwrite three files.** After init completes:

1. Restore `tailwind.config.js` from Step 7
2. Restore `src/index.css` from Step 6
3. `src/lib/utils.ts` should already match Step 8 — no action needed

`components.json` (created by shadcn) should be left alone.

---

## Step 12 · Verify

### 12.1 · Type check

```bash
npx tsc --noEmit
```

Should complete with no errors. Allowed warnings: any pre-existing warnings from `Charts.jsx`, `BottomNav.jsx`, `Trade.jsx`, `Icons.jsx` (those JSX files were not migrated; `allowJs: true` makes this OK).

### 12.2 · Dev server

```bash
npm run dev
```

Open the app in browser. Verify:
- App renders identically to before Phase 1 (no visual regression)
- Console shows no errors
- Network tab shows Tomorrow and Inter font files loading
- The Trade page works as before (tab switching, expansion, sparklines)

### 12.3 · Sanity test the tokens

In browser DevTools console:

```js
getComputedStyle(document.documentElement).getPropertyValue('--c-cyan')
// Should output: " #00E5FF"

getComputedStyle(document.documentElement).getPropertyValue('--c-purple')
// Should output: " #A259FF"
```

If both return correct values, design tokens are wired up correctly.

---

## Acceptance Criteria

Phase 1 is done when ALL of these are true:

- [ ] `npm run dev` starts without errors
- [ ] App visually identical to before Phase 1
- [ ] `npx tsc --noEmit` passes
- [ ] Tomorrow and Inter fonts load in browser
- [ ] CSS variables `--c-cyan` and `--c-purple` resolve to correct hex
- [ ] `src/main.tsx`, `src/App.tsx` exist (not `.jsx`)
- [ ] `vite.config.ts` exists (not `.js`)
- [ ] `src/styles/tokens.css` exists with the full v2.1.5 token set
- [ ] `src/lib/utils.ts` and `src/lib/format.ts` exist
- [ ] `components.json` exists (from shadcn init)
- [ ] No file in the repo references `vite.config.js`, `main.jsx`, or `App.jsx`

---

## What stays unchanged in Phase 1

These files keep their current state — they will be addressed in later phases:

- `src/components/BottomNav.jsx` — works as-is
- `src/components/Charts.jsx` — works as-is, will be touched in Phase 4
- `src/components/Icons.jsx` — works as-is, will be deleted in Phase 2 (replaced by lucide-react)
- `src/pages/Trade.jsx` — works as-is, will be refactored in Phase 4

---

## What Phase 2 will do

Phase 2 will create 6 React primitive components (`<GlassCard>`, `<Button>`, `<IconButton>`, `<Tabs>`, `<Avatar>`, `<TrendValue>`, `<Money>`, `<Timer>`, `<Sentiment>`) using cva, all backed by the CSS classes already defined in `tokens.css`. A temporary `/playground` route will showcase them. The existing Trade page will not be modified yet.
