import { useEffect, useRef, useState } from "react";
import { CURRENT_USER } from "@/lib/current-user";
import { ChatEventHeader } from "./chat/ChatEventHeader";
import { AiSummaryBar } from "./chat/AiSummaryBar";
import { SummaryQuestionsPanel } from "./chat/SummaryQuestionsPanel";
import { ChatMessageList } from "./chat/ChatMessageList";
import { ChatComposer } from "./chat/ChatComposer";
import { ChatRulesModal } from "./chat/ChatRulesModal";
import {
  messages as initialMessages,
  summaryQuestions,
  type ChatMessage,
} from "./chat/fixtures";

type SummaryState = "collapsed" | "expanded";

function formatNow(): string {
  return new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export function ChatPage() {
  const [summaryState, setSummaryState] = useState<SummaryState>("collapsed");
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [pendingScrollId, setPendingScrollId] = useState<string | null>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);

  const handleSend = (text: string) => {
    const id = `me-${Date.now()}`;
    const newMessage: ChatMessage = {
      id,
      user: CURRENT_USER.name,
      colorClass: "text-cyan-400",
      avatarPhoto: CURRENT_USER.photo,
      time: formatNow(),
      message: text,
    };
    setMessages((prev) => [...prev, newMessage]);
    setPendingScrollId(id);
  };

  // After the freshly-sent message renders, scroll the page to the bottom so
  // the user's own message is visible above the composer.
  useEffect(() => {
    if (!pendingScrollId) return;
    bottomAnchorRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
    setPendingScrollId(null);
  }, [pendingScrollId]);

  return (
    <div className="pt-4">
      <div className="sticky top-0 z-30 -mx-6 px-6 pt-4 pb-1 -mt-4 bg-pt-bg/85 backdrop-blur-md">
        <ChatEventHeader onOpenRules={() => setIsRulesOpen(true)} />

        {summaryState === "collapsed" && (
          <AiSummaryBar
            count={3}
            question="What is the marketing strategy?"
            onExpand={() => setSummaryState("expanded")}
          />
        )}
        {summaryState === "expanded" && (
          <SummaryQuestionsPanel
            questions={summaryQuestions}
            onCollapse={() => setSummaryState("collapsed")}
          />
        )}
      </div>

      <ChatMessageList messages={messages} hasNew={false} />
      {/* Reserves vertical room equal to the composer's height so the last
          message clears the fixed composer when we scrollIntoView. */}
      <div ref={bottomAnchorRef} aria-hidden className="h-36" />

      <ChatComposer onSend={handleSend} />

      <ChatRulesModal open={isRulesOpen} onOpenChange={setIsRulesOpen} />
    </div>
  );
}
