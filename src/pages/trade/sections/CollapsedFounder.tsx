import { ChevronDown } from "lucide-react";
import { Avatar, Button, GlassCard, Money, TrendValue } from "@/components/primitives";
import { Sparkline } from "@/components/Charts";
import type { Founder } from "@/lib/mock-data";

export interface CollapsedFounderProps {
  f: Founder;
  onExpand: () => void;
  onTrade: () => void;
}

export function CollapsedFounder({ f, onExpand, onTrade }: CollapsedFounderProps) {
  const isUp = f.change >= 0;
  return (
    <GlassCard
      tone="frame"
      size="sm"
      className="mb-3 hover:brightness-110 transition-all"
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onExpand}
          className="flex items-center gap-2 flex-1 min-w-0 text-left"
          aria-label={`Expand ${f.name}`}
        >
          <Avatar size="sm" name={f.name} photo={f.photo} />
          <div className="leading-tight min-w-0 flex-1">
            <div className="font-display text-white text-[12.5px] font-semibold truncate">
              {f.name}
            </div>
            <div className="text-[10.5px] text-pt-text-2 truncate">
              {f.company}
            </div>
          </div>
          <div className="opacity-90 shrink-0">
            <Sparkline
              width={42}
              height={22}
              series={f.series}
              color={isUp ? "#40F3C5" : "#FF8A2B"}
              live
            />
          </div>
          <div className="text-right leading-tight shrink-0">
            <div className="font-display text-white text-[11.5px] font-semibold num">
              <Money value={f.price} />
            </div>
            <TrendValue value={f.change} className="text-[10.5px]" />
          </div>
        </button>
        <Button
          variant="primary"
          size="sm"
          onClick={onTrade}
          className="!h-7 !px-2.5 !text-[10px] shrink-0"
        >
          Trade
        </Button>
        <button
          type="button"
          onClick={onExpand}
          aria-label={`Show details for ${f.name}`}
          className="shrink-0 -ml-1 -mr-2 p-1 hover:brightness-125 transition-all"
        >
          <ChevronDown size={13} color="#7C8AA6" strokeWidth={1.5} />
        </button>
      </div>
    </GlassCard>
  );
}
