import { GlassCard } from '@/components/primitives';

export function ChatPage() {
  return (
    <div className="pt-6">
      <h1 className="font-display text-2xl uppercase tracking-wide mb-6">
        Chat
      </h1>
      <GlassCard tone="frame" size="md">
        <p className="text-pt-text-2 text-sm text-center py-8">
          Community chat coming soon.
        </p>
      </GlassCard>
    </div>
  );
}
