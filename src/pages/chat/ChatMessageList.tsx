import { ChevronDown } from 'lucide-react';
import { ChatMessageItem } from './ChatMessageItem';
import type { ChatMessage } from './fixtures';

export interface ChatMessageListProps {
  messages: ChatMessage[];
  onJumpToLatest?: () => void;
  hasNew?: boolean;
}

export function ChatMessageList({
  messages,
  onJumpToLatest,
  hasNew = true,
}: ChatMessageListProps) {
  return (
    <div className="mt-4">
      <div className="flex flex-col gap-4">
        {messages.map((m) => (
          <ChatMessageItem key={m.id} message={m} />
        ))}
      </div>
      {hasNew && (
        <div className="flex justify-center mt-4">
          <button
            type="button"
            onClick={onJumpToLatest}
            className="inline-flex items-center gap-1.5 text-pt-blue text-[12px] font-display font-semibold hover:brightness-125 transition-all"
          >
            <ChevronDown size={14} strokeWidth={2} />
            New messages
          </button>
        </div>
      )}
    </div>
  );
}
