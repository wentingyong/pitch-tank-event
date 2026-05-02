import { type FormEvent, useEffect, useRef, useState } from "react";
import { AtSign, Send, ShieldCheck, Smile } from "lucide-react";
import { GlassCard, IconButton } from "@/components/primitives";
import { cn } from "@/lib/utils";

export interface ChatComposerProps {
  onSend: (text: string) => void;
}

const MENTION_TAG = "@Question ";
const EMOJIS = [
  "🔥",
  "❤️",
  "😂",
  "👍",
  "🎉",
  "💯",
  "✨",
  "🚀",
  "😢",
  "😎",
  "🤔",
  "🙌",
  "👀",
  "🥹",
  "🙏",
  "😅",
  "😍",
  "👏",
  "💪",
  "⚡️",
];

export function ChatComposer({ onSend }: ChatComposerProps) {
  const [text, setText] = useState("");
  const [emojiOpen, setEmojiOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const emojiRootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!emojiOpen) return;
    const onDocPointerDown = (e: MouseEvent) => {
      if (emojiRootRef.current?.contains(e.target as Node)) return;
      setEmojiOpen(false);
    };
    document.addEventListener("mousedown", onDocPointerDown);
    return () => document.removeEventListener("mousedown", onDocPointerDown);
  }, [emojiOpen]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setText("");
    setEmojiOpen(false);
  };

  const insertMention = () => {
    setText((prev) =>
      prev.startsWith(MENTION_TAG) ? prev : `${MENTION_TAG}${prev}`,
    );
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const insertEmoji = (emoji: string) => {
    setText((prev) => prev + emoji);
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  const hasContent = text.trim().length > 0;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 bg-pt-bg/85 backdrop-blur-lg"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 8px)" }}
    >
      <div
        aria-hidden
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(to right, transparent 0%, rgba(0,229,255,0.6) 25%, rgba(162,89,255,0.85) 60%, transparent 100%)",
        }}
      />
      <div className="mx-auto w-full max-w-[430px] px-4 pt-3">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <IconButton
            type="button"
            size="md"
            aria-label="Insert @Question"
            icon={<AtSign size={16} strokeWidth={1.75} />}
            onClick={insertMention}
            className="shrink-0"
          />
          <label
            className={cn(
              "relative flex-1 flex items-center h-10 rounded-mini bg-white/[0.03] ring-1 transition-all",
              hasContent
                ? "ring-pt-blue/80 shadow-[0_0_14px_rgba(79,124,255,0.25)]"
                : "ring-white/12 focus-within:ring-pt-blue/60",
            )}
          >
            {/* font-size MUST stay >= 16px: iOS Safari auto-zooms inputs
                under 16px on focus and never zooms back out. */}
            <input
              ref={inputRef}
              type="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="@Question  Ask a question to the founder"
              aria-label="Message"
              className="flex-1 bg-transparent border-0 outline-none px-3.5 text-[16px] text-white placeholder:text-pt-text-3 min-w-0"
            />
            <div ref={emojiRootRef} className="relative shrink-0">
              <button
                type="button"
                aria-label="Open emoji picker"
                aria-expanded={emojiOpen}
                aria-haspopup="dialog"
                onClick={() => setEmojiOpen((v) => !v)}
                className="px-2 h-full text-pt-text-2 hover:text-white transition-all"
              >
                <Smile size={16} strokeWidth={1.75} />
              </button>
              {emojiOpen && (
                <div
                  role="dialog"
                  aria-label="Emoji picker"
                  className="absolute bottom-full right-0 mb-4 z-50 w-[232px]"
                >
                  <GlassCard tone="primary" size="sm">
                    <div className="grid grid-cols-5 gap-1">
                      {EMOJIS.map((emo) => (
                        <button
                          key={emo}
                          type="button"
                          onClick={() => insertEmoji(emo)}
                          className="h-9 rounded-mini text-[18px] leading-none hover:bg-white/[0.08] transition-all"
                        >
                          {emo}
                        </button>
                      ))}
                    </div>
                  </GlassCard>
                </div>
              )}
            </div>
          </label>
          <IconButton
            type="submit"
            size="md"
            active={hasContent}
            aria-label="Send message"
            icon={<Send size={15} strokeWidth={1.75} />}
            className="shrink-0"
            disabled={!hasContent}
          />
        </form>
        <div className="flex items-center justify-center gap-2 mt-2 text-[10.5px] text-pt-text-2">
          <ShieldCheck
            size={11}
            strokeWidth={1.75}
            className="text-pt-text-3"
          />
          <span>Be respectful. Keep it constructive.</span>
          <span className="text-white/15">|</span>
          <a
            href="#community-guidelines"
            className="text-pt-blue font-display hover:brightness-125 transition-all"
          >
            Community Guidelines
          </a>
        </div>
      </div>
    </div>
  );
}
