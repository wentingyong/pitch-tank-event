import { ChevronRight } from "lucide-react";
import { Avatar, GlassCard, Money, TrendValue } from "@/components/primitives";
import { Sparkline } from "@/components/Charts";
import { ringGradient, type Founder } from "@/lib/mock-data";

export interface CollapsedFounderProps {
  f: Founder;
  onExpand: () => void;
}

export function CollapsedFounder({ f, onExpand }: CollapsedFounderProps) {
  const isUp = f.change >= 0;
  return (
    <button
      onClick={onExpand}
      className="block w-full text-left mb-3 hover:brightness-110 transition-all"
    >
      <GlassCard tone="frame" size="sm">
        <div className="flex items-center gap-2.5">
          <Avatar size="sm" name={f.name} photo={f.photo} gradient={ringGradient(f.ring)} />
          <div className="leading-tight min-w-0 flex-1">
            <div className="font-display text-white text-[13px] font-semibold truncate">
              {f.name}
            </div>
            <div className="text-[11px] text-pt-text-2 truncate">
              {f.company}
            </div>
          </div>
          <div className="opacity-90 shrink-0">
            <Sparkline
              width={64}
              height={26}
              series={f.series}
              color={isUp ? "#40F3C5" : "#FF8A2B"}
              live
            />
          </div>
          <div className="text-right leading-tight shrink-0">
            <div className="font-display text-white text-[12.5px] font-semibold">
              <Money value={f.price} />
            </div>
            <TrendValue value={f.change} className="text-[11px]" />
          </div>
          <ChevronRight
            size={13}
            color="#7C8AA6"
            strokeWidth={1.5}
            className="shrink-0"
          />
        </div>
      </GlassCard>
    </button>
  );
}
