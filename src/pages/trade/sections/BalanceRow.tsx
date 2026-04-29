import { Clock, BarChart3, ChevronRight, TrendingUp } from "lucide-react";
import { GlassCard, Timer, TrendValue } from "@/components/primitives";

export interface BalanceRowProps {
  secondsLeft: number;
}

export function BalanceRow({ secondsLeft }: BalanceRowProps) {
  return (
    <div className="flex items-start justify-between mt-1 mb-3">
      <div>
        <div className="text-[11px] uppercase tracking-[0.14em] text-pt-text-2">
          Your Balance
        </div>
        <div className="font-display font-semibold text-white text-[44px] leading-[1.05] num tracking-tight mt-0.5">
          $1,000
        </div>
        <div className="flex items-center gap-1.5 mt-1.5 text-[12px] num">
          <span className="text-pt-cyan flex items-center gap-1">
            <TrendingUp size={10} color="#40F3C5" strokeWidth={1.5} />
            $10 (1%)
          </span>
          <span className="text-pt-text-2">· 30 mins</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 mt-1">
        <GlassCard
          tone="frame"
          size="sm"
          className="!rounded-full inline-flex items-center gap-1.5 !h-9 !px-3.5 !py-0 text-[12px]"
        >
          <BarChart3 size={14} color="#A7B3C9" strokeWidth={1.5} />
          <span className="text-white/90">Holdings History</span>
          <ChevronRight size={12} color="#A7B3C9" strokeWidth={1.5} />
        </GlassCard>
        <GlassCard
          tone="featured"
          size="sm"
          className="!rounded-full inline-flex items-center gap-1.5 !h-9 !px-3.5 !py-0 text-[12px]"
        >
          <Clock size={14} color="#FFC896" strokeWidth={1.5} />
          <span className="featured-timer-text num">
            Trading closes in <Timer seconds={secondsLeft} />
          </span>
        </GlassCard>
      </div>
    </div>
  );
}
