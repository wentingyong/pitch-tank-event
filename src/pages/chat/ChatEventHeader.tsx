import { ArrowLeft, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@/components/primitives";

export interface ChatEventHeaderProps {
  onOpenRules: () => void;
}

export function ChatEventHeader({ onOpenRules }: ChatEventHeaderProps) {
  const navigate = useNavigate();
  return (
    <div className="flex items-stretch justify-between gap-2">
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <IconButton
          size="sm"
          aria-label="Back"
          icon={<ArrowLeft size={14} strokeWidth={1.75} />}
          onClick={() => navigate(-1)}
          className="shrink-0"
        />
        <img
          src="/icons/icon-192.png"
          alt=""
          aria-hidden
          className="w-8 h-8 rounded-mini object-cover shrink-0"
        />
        <div className="leading-tight min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="font-display font-semibold text-white text-[14px] tracking-tight truncate">
              PitchTank Live
            </span>
            <span className="inline-flex items-center px-1.5 h-[16px] rounded-pt-pill text-[8.5px] font-display font-semibold tracking-wider uppercase text-pt-purple bg-pt-purple/15 ring-1 ring-pt-purple/40 shrink-0">
              Live
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10.5px] text-pt-text-2">
            <span className="truncate">Early-Stage Pitch Event</span>
            <span
              aria-label="2.4k online"
              className="inline-flex items-center gap-1 shrink-0"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.7)]" />
            </span>
          </div>
        </div>
        <div className="inline-flex items-center gap-1 px-2 h-7 rounded-mini bg-white/[0.03] ring-1 ring-white/10 shrink-0">
          <Users size={11} strokeWidth={1.75} className="text-pt-text-2" />
          <span className="font-display font-semibold text-white text-[11px] num">
            2.4k
          </span>
        </div>
      </div>

      <button
        type="button"
        aria-label="Open chat room rules"
        onClick={onOpenRules}
        className="shrink-0 self-center w-10 h-10 hover:brightness-125 transition-all"
      >
        <img
          src="/chat/chat-question.png"
          alt=""
          aria-hidden
          className="w-full h-full object-contain"
        />
      </button>
    </div>
  );
}
