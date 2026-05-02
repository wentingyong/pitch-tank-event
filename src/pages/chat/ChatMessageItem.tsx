import {
  BadgeCheck,
  Check,
  Crown,
  Diamond,
  Star,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { Avatar } from '@/components/primitives';
import { cn } from '@/lib/utils';
import type { ChatBadge, ChatMessage } from './fixtures';

const BADGE_ICON: Record<ChatBadge, LucideIcon> = {
  bolt: Zap,
  crown: Crown,
  diamond: Diamond,
  check: Check,
  star: Star,
  verified: BadgeCheck,
};

/** Badge backgrounds map onto plain Tailwind colors so the chip pops without
    introducing any new design-system tokens. */
const BADGE_BG: Record<ChatBadge, string> = {
  bolt: 'bg-purple-500',
  crown: 'bg-blue-500',
  diamond: 'bg-purple-600',
  check: 'bg-emerald-500',
  star: 'bg-emerald-500',
  verified: 'bg-blue-500',
};

export interface ChatMessageItemProps {
  message: ChatMessage;
}

export function ChatMessageItem({ message }: ChatMessageItemProps) {
  const Badge = message.badge ? BADGE_ICON[message.badge] : null;
  const badgeBg = message.badge ? BADGE_BG[message.badge] : '';

  return (
    <div className="flex items-start gap-3">
      <div className="relative shrink-0">
        <Avatar
          size="md"
          name={message.user}
          photo={message.avatarPhoto}
          gradient={message.avatarGradient}
        />
        {Badge && (
          <span
            aria-hidden
            className={cn(
              'absolute -bottom-1 -right-1 w-4 h-4 rounded-[5px] flex items-center justify-center ring-2 ring-pt-bg',
              badgeBg
            )}
          >
            <Badge size={9} strokeWidth={2.5} className="text-white" />
          </span>
        )}
      </div>
      <div className="leading-tight min-w-0 flex-1 pt-0.5">
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              'font-display font-semibold text-[13px]',
              message.colorClass
            )}
          >
            {message.user}
          </span>
          <span className="text-[10px] text-pt-text-3 num">{message.time}</span>
        </div>
        <p className="mt-0.5 text-[13px] text-white/90 whitespace-pre-line break-words">
          {message.message}
        </p>
      </div>
    </div>
  );
}
