import { useState } from "react";
import { ChevronUp, Sparkles, ThumbsUp } from "lucide-react";
import { GlassCard } from "@/components/primitives";
import { cn } from "@/lib/utils";
import type { SummaryQuestion } from "./fixtures";

export interface SummaryQuestionsPanelProps {
  questions: SummaryQuestion[];
  onCollapse: () => void;
}

export function SummaryQuestionsPanel({
  questions,
  onCollapse,
}: SummaryQuestionsPanelProps) {
  const [upvoted, setUpvoted] = useState<Record<string, boolean>>({});

  const toggle = (id: string) =>
    setUpvoted((prev) => ({ ...prev, [id]: !prev[id] }));

  return (
    <GlassCard tone="frame" size="md" className="mt-3">
      <div className="flex items-start gap-3">
        <Sparkles
          size={20}
          strokeWidth={1.75}
          className="text-pt-cyan shrink-0 mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="font-display font-semibold text-white text-[15px] tracking-tight">
            Summary Questions
          </div>
          <div className="text-[11px] text-pt-text-2 mt-0.5">
            Top questions from the audience
          </div>
        </div>
        <button
          type="button"
          onClick={onCollapse}
          aria-label="Collapse AI summary"
          aria-expanded={true}
          className="inline-flex items-center gap-1.5 px-2.5 h-7 rounded-mini bg-white/[0.04] ring-1 ring-white/15 text-pt-text-2 hover:text-white hover:brightness-110 transition-all shrink-0 text-[11px] font-display"
        >
          Collapse
          <ChevronUp size={12} strokeWidth={2} />
        </button>
      </div>

      <ul className="mt-4 divide-y divide-white/8">
        {questions.map((q) => {
          const active = !!upvoted[q.id];
          const displayCount = q.count + (active ? 1 : 0);
          return (
            <li
              key={q.id}
              className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0"
            >
              <span className="font-display font-semibold text-pt-cyan text-[12.5px] num shrink-0 w-9">
                [{displayCount}]
              </span>
              <span className="flex-1 min-w-0 text-white text-[12.5px] truncate">
                {q.text}
              </span>
              <button
                type="button"
                onClick={() => toggle(q.id)}
                aria-label={active ? "Remove upvote" : "Upvote question"}
                aria-pressed={active}
                className={cn(
                  "p-1.5 rounded-mini transition-all shrink-0",
                  active
                    ? "text-pt-cyan drop-shadow-[0_0_6px_rgba(0,229,255,0.6)]"
                    : "text-pt-text-2 hover:text-white",
                )}
              >
                <ThumbsUp
                  size={14}
                  strokeWidth={active ? 2.25 : 1.75}
                  fill={active ? "currentColor" : "none"}
                />
              </button>
            </li>
          );
        })}
      </ul>
    </GlassCard>
  );
}
