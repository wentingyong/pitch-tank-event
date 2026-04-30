import { ChevronDown } from "lucide-react";
import {
  Avatar,
  Button,
  GlassCard,
  IconButton,
  Money,
  TrendValue,
} from "@/components/primitives";
import { ExpandedSparkline } from "@/components/Charts";
import { ringGradient, type Founder } from "@/lib/mock-data";
import type { TradeSide } from "../BuySellDialog";

export interface ExpandedFounderProps {
  f: Founder;
  onCollapse: () => void;
  onTrade: (side: TradeSide) => void;
}

export function ExpandedFounder({ f, onCollapse, onTrade }: ExpandedFounderProps) {
  const isUp = f.change >= 0;
  return (
    <GlassCard tone="purple" active size="md" className="relative mb-3">
      <IconButton
        size="sm"
        aria-label="Collapse"
        onClick={onCollapse}
        className="!absolute top-3 right-3 !z-20 pointer-events-auto"
        icon={<ChevronDown size={14} strokeWidth={1.5} />}
      />

      {/* Top row: avatar + name + price */}
      <div className="flex items-start gap-3">
        <Avatar size="md" name={f.name} photo={f.photo} gradient={ringGradient(f.ring)} />
        <div className="flex-1 leading-tight pt-0.5">
          <div className="font-display text-white text-[15px] font-semibold tracking-tight">
            {f.name}
          </div>
          <div className="text-[12px] text-pt-text-2">{f.company}</div>
        </div>
        <div className="text-right pt-0.5 pr-7">
          <div className="font-display text-white text-[15px] font-semibold tracking-tight">
            <Money value={f.price} />
          </div>
          <div className="text-[12px] flex items-center justify-end">
            <TrendValue value={f.change} />
          </div>
        </div>
      </div>

      {/* Sparkline strip */}
      <div className="mt-2 mb-3 -mx-1 overflow-hidden">
        <ExpandedSparkline
          width={358}
          height={74}
          series={f.series}
          color={isUp ? "#40F3C5" : "#FF8A2B"}
          live
        />
      </div>

      {/* Stats row */}
      <div
        className="rounded-[14px] grid grid-cols-3 mb-3.5 overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.03)",
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)",
        }}
      >
        <div className="px-3 py-2.5 text-center border-r border-white/5">
          <div className="text-[10px] uppercase tracking-wider text-pt-text-2">
            Market Cap.
          </div>
          <div className="font-display text-[14px] mt-0.5">
            <Money value={f.marketCap} />
          </div>
        </div>
        <div className="px-3 py-2.5 text-center border-r border-white/5">
          <div className="text-[10px] uppercase tracking-wider text-pt-text-2">
            Holders
          </div>
          <div className="font-display num text-white text-[15px] mt-0.5">
            {f.holders}
          </div>
        </div>
        <div className="px-3 py-2.5 text-center">
          <div className="text-[10px] uppercase tracking-wider text-pt-text-2">
            Volume
          </div>
          <div className="font-display num text-white text-[15px] mt-0.5">
            {f.volume}
          </div>
        </div>
      </div>

      {/* Buy / Sell */}
      <div className="grid grid-cols-2 gap-3">
        <Button variant="buy" size="md" onClick={() => onTrade("buy")}>
          Buy
        </Button>
        <Button variant="sell" size="md" onClick={() => onTrade("sell")}>
          Sell
        </Button>
      </div>
    </GlassCard>
  );
}
