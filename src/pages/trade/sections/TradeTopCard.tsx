import { BalanceRow } from "./BalanceRow";
import { EventPerformance } from "./EventPerformance";
import { YourHoldings } from "./YourHoldings";
import type { TradeSide } from "../BuySellDialog";

export interface TradeTopCardProps {
  secondsLeft: number;
  onTrade: (founderId: string, side: TradeSide) => void;
}

// SVG mask whose bottom edge mirrors the arc curve.
// Tuned so the mask's curve overlays the arc rainbow stroke at the typical
// TradeTopCard content height (~536px). Sides at viewBox Y≈555 (≈92.5%),
// peak at Y≈582 (≈97%) — matches `M 0 18 Q 400 78 800 18` in the arc SVG.
const ARC_MASK =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' " +
  "viewBox='0 0 800 600' preserveAspectRatio='none'>" +
  "<path d='M 0 0 H 800 V 558 Q 400 606 0 558 Z' fill='black'/></svg>\")";

export function TradeTopCard({ secondsLeft, onTrade }: TradeTopCardProps) {
  return (
    <div className="relative isolate mt-1 mb-2">
      <div
        aria-hidden
        className="absolute z-0 pointer-events-none"
        style={{
          left: "-28px",
          right: "-28px",
          top: "-56px",
          bottom: "0px",
          background:
            // Each radial sits at one of the arc-gradient color stops along the bottom
            // edge (12% / 35% / 55% / 78%), fading upward — together they reproduce
            // the arc's rainbow (purple → blue → purple → orange) as a soft nebula.
            // Purple stop @ 12%
            "radial-gradient(60% 115% at 12% 100%, rgba(162,89,255,0.34) 0%, rgba(162,89,255,0.12) 38%, transparent 75%), " +
            // Blue stop @ 35%
            "radial-gradient(60% 115% at 35% 100%, rgba(79,124,255,0.36) 0%, rgba(79,124,255,0.14) 38%, transparent 75%), " +
            // Purple stop @ 55%
            "radial-gradient(60% 115% at 55% 100%, rgba(162,89,255,0.34) 0%, rgba(162,89,255,0.12) 38%, transparent 75%), " +
            // Orange stop @ 78%
            "radial-gradient(60% 115% at 78% 100%, rgba(255,138,0,0.30) 0%, rgba(255,138,0,0.10) 38%, transparent 75%)",
          WebkitMaskImage: ARC_MASK,
          maskImage: ARC_MASK,
          WebkitMaskSize: "100% 100%",
          maskSize: "100% 100%",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
        }}
      />
      <div className="relative flex flex-col gap-7">
        <BalanceRow secondsLeft={secondsLeft} />
        <EventPerformance />
        <YourHoldings onTrade={onTrade} />
        <HoldingsArcDivider />
      </div>
    </div>
  );
}

function HoldingsArcDivider() {
  return (
    <div
      aria-hidden
      className="relative -mx-6 sm:-mx-7 h-16 pointer-events-none"
      style={{ marginTop: -4, marginBottom: -8 }}
    >
      <svg
        className="absolute inset-x-0 top-0 w-full h-full overflow-visible"
        viewBox="0 0 800 80"
        preserveAspectRatio="none"
        style={{
          filter:
            "drop-shadow(0 0 5px rgba(232,242,255,0.65)) " +
            "drop-shadow(0 0 14px rgba(162,89,255,0.75)) " +
            "drop-shadow(0 0 28px rgba(79,124,255,0.50)) " +
            "drop-shadow(0 0 48px rgba(162,89,255,0.32))",
        }}
      >
        <defs>
          <linearGradient id="holdings-arc-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#A259FF" stopOpacity="0" />
            <stop offset="12%" stopColor="#A259FF" stopOpacity="0.9" />
            <stop offset="35%" stopColor="#4F7CFF" />
            <stop offset="55%" stopColor="#A259FF" />
            <stop offset="78%" stopColor="#FF8A00" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#FF8A00" stopOpacity="0" />
          </linearGradient>
          {/* metal-white sheen — sky meeting ocean: a thin specular highlight */}
          <linearGradient id="holdings-arc-sheen" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#E8F2FF" stopOpacity="0" />
            <stop offset="25%" stopColor="#E8F2FF" stopOpacity="0.55" />
            <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="75%" stopColor="#E8F2FF" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#E8F2FF" stopOpacity="0" />
          </linearGradient>
        </defs>
        {/* Main rainbow arc */}
        <path
          d="M 0 18 Q 400 78 800 18"
          stroke="url(#holdings-arc-grad)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
        {/* Metal-white sheen — thin inset highlight catching the light */}
        <path
          d="M 90 24 Q 400 70 710 24"
          stroke="url(#holdings-arc-sheen)"
          strokeWidth="0.9"
          fill="none"
          strokeLinecap="round"
          opacity="0.95"
        />
      </svg>
    </div>
  );
}
