import { ChevronDown, Sparkles } from "lucide-react";
import { GlassCard } from "@/components/primitives";

export interface AiSummaryBarProps {
  /** e.g. 3 — count shown like "[3]" */
  count: number;
  question: string;
  onExpand: () => void;
}

export function AiSummaryBar({ count, question, onExpand }: AiSummaryBarProps) {
  return (
    <button
      type="button"
      onClick={onExpand}
      aria-label="Expand AI summary"
      aria-expanded={false}
      className="block w-full text-left mt-3 hover:brightness-110 transition-all"
    >
      <GlassCard tone="primary" size="sm">
        <div className="flex items-center gap-3">
          <Sparkles
            size={18}
            strokeWidth={1.75}
            className="text-pt-blue shrink-0"
          />
          <div className="leading-tight min-w-0 flex-1">
            <div className="text-[10px] text-pt-text-2 font-display tracking-wider uppercase">
              AI Summary
            </div>
            <div className="font-display text-white text-[13px] font-semibold truncate mt-0.5">
              <span className="text-pt-blue num mr-1">[{count}]</span>
              {question}
            </div>
          </div>
          <ChevronDown
            size={16}
            strokeWidth={1.75}
            className="text-pt-text-2 shrink-0"
          />
        </div>
      </GlassCard>
    </button>
  );
}
