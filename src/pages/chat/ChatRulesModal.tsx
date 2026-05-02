import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { Button, GlassCard, IconButton } from "@/components/primitives";

export interface ChatRulesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Rule = {
  icon: string;
  heading: string;
  body: string;
};

const RULES: Rule[] = [
  {
    icon: "/chat/chat-rule-1.png",
    heading: "Ask with @Question",
    body: "Use @Question to ask the founder a question.",
  },
  {
    icon: "/chat/chat-rule-2.png",
    heading: "Upvote questions",
    body: "Tap thumbs-up on questions you also want answered.",
  },
  {
    icon: "/chat/chat-rule-3.png",
    heading: "Top questions go to the MC",
    body: "The most-upvoted questions may be read live during the event.",
  },
  {
    icon: "/chat/chat-rule-4.png",
    heading: "Win the audience reward",
    body: "The most-upvoted question receives $10,000 virtual cash.",
  },
];

export function ChatRulesModal({ open, onOpenChange }: ChatRulesModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[80] bg-black/60 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0" />
        <Dialog.Content
          aria-describedby={undefined}
          className="fixed left-1/2 top-1/2 z-[90] -translate-x-1/2 -translate-y-1/2 w-[min(360px,calc(100vw-32px))] max-h-[calc(100dvh-24px)] overflow-y-auto outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0 data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95"
        >
          <GlassCard tone="primary" size="lg">
            <div className="flex flex-col items-center text-center pt-2">
              <img
                src="/chat/chat-rule-top.png"
                alt=""
                aria-hidden
                className="w-20 h-20 object-contain"
              />
              <Dialog.Title asChild>
                <h2 className="mt-3 font-display font-semibold text-white text-[22px] tracking-tight">
                  Chat Room Rules
                </h2>
              </Dialog.Title>
              <p className="mt-2 text-[13px] text-pt-text-2 leading-snug px-2">
                Ask smart questions. Vote for the ones you want answered.
              </p>
            </div>

            <ul className="mt-5 flex flex-col gap-3.5">
              {RULES.map((r) => (
                <li key={r.heading} className="flex items-start gap-3">
                  <img
                    src={r.icon}
                    alt=""
                    aria-hidden
                    className="w-14 h-14 object-contain shrink-0"
                  />
                  <div className="leading-tight pt-0.5 min-w-0">
                    <div className="font-display font-semibold text-white text-[14px]">
                      {r.heading}
                    </div>
                    <div className="text-[12px] text-pt-text-2 mt-1">
                      {r.body}
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <Dialog.Close asChild>
              <Button variant="primary" size="lg" className="mt-5 w-full">
                Got it
              </Button>
            </Dialog.Close>
          </GlassCard>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
