import { Avatar } from "@/components/primitives";
import { FOUNDERS, ringGradient, type Founder } from "@/lib/mock-data";
import type { TradeSide } from "../BuySellDialog";

const HOLDING_FOUNDER_IDS = ["f1", "f3", "f2", "f7", "f4"] as const;
const HOLDING_PERCENTS = [62, 16, 9, 8, 5] as const;

// Visual layout floor — every segment reserves at least this much
// width so its % label and avatar fit comfortably and all avatars
// can share a single baseline. The label always shows the real
// percentage; only the on-screen width is redistributed.
const MIN_DISPLAY_PCT = 11;

interface Holding {
  founder: Founder;
  pct: number;
  displayPct: number;
}

const HOLDINGS: Holding[] = (() => {
  const reserved = MIN_DISPLAY_PCT * HOLDING_PERCENTS.length;
  const remaining = 100 - reserved;
  return HOLDING_FOUNDER_IDS.map((id, i) => {
    const pct = HOLDING_PERCENTS[i];
    return {
      founder: FOUNDERS.find((f) => f.id === id)!,
      pct,
      displayPct: MIN_DISPLAY_PCT + (pct / 100) * remaining,
    };
  });
})();

const alpha = (hex: string, a: number) =>
  hex + Math.round(a * 255).toString(16).padStart(2, "0");

export interface YourHoldingsProps {
  onTrade: (founderId: string, side: TradeSide) => void;
}

export function YourHoldings({ onTrade }: YourHoldingsProps) {
  return (
    <div>
      <div className="flex items-end justify-between mb-3">
        <span className="text-[11px] uppercase tracking-[0.14em] text-pt-text-2">
          Your Holdings
        </span>
        <span className="font-display font-normal text-white text-[20px] num tracking-tight">
          $54,321.00
        </span>
      </div>

      <div className="flex gap-[3px] h-[52px]">
        {HOLDINGS.map((h) => {
          const [c1, c2] = ringGradient(h.founder.ring);
          return (
            <button
              type="button"
              key={h.founder.id}
              onClick={() => onTrade(h.founder.id, "buy")}
              className="holding-bar group relative rounded-[12px] flex items-center justify-end overflow-hidden min-w-0 cursor-pointer"
              style={
                {
                  width: `${h.displayPct}%`,
                  background: `linear-gradient(135deg, ${alpha(c1, 0.22)}, ${alpha(c2, 0.32)})`,
                  boxShadow: `inset 0 1px 0 ${alpha(c1, 0.45)}, 0 0 14px ${alpha(c1, 0.18)}`,
                  ["--seg-c1" as string]: c1,
                  ["--seg-c2" as string]: c2,
                } as React.CSSProperties
              }
              aria-label={`Trade ${h.founder.name} (${h.pct}%)`}
            >
              <span className="font-display font-normal text-white text-[14px] num leading-none whitespace-nowrap pr-2.5 drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]">
                {h.pct}%
              </span>
            </button>
          );
        })}
      </div>

      <div className="flex gap-[3px] mt-1.5">
        {HOLDINGS.map((h) => {
          const [c1, c2] = ringGradient(h.founder.ring);
          return (
            <div
              key={h.founder.id}
              className="flex flex-col items-start min-w-0"
              style={{ width: `${h.displayPct}%` }}
            >
              <div
                className="w-px border-l border-dashed ml-1 h-3"
                style={{ borderColor: "rgba(255,255,255,0.28)" }}
              />
              <button
                type="button"
                onClick={() => onTrade(h.founder.id, "buy")}
                className="holding-avatar -ml-1 mt-0.5 cursor-pointer transition-transform duration-200 hover:scale-110 focus:scale-110 focus:outline-none"
                style={
                  {
                    ["--seg-c1" as string]: c1,
                    ["--seg-c2" as string]: c2,
                  } as React.CSSProperties
                }
                aria-label={`Trade ${h.founder.name}`}
              >
                <Avatar
                  size="sm"
                  name={h.founder.name}
                  photo={h.founder.photo}
                  gradient={[c1, c2]}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
