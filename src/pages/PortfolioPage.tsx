import { GlassCard } from '@/components/primitives';

export function PortfolioPage() {
  return (
    <div className="pt-6">
      <h1 className="font-display text-2xl uppercase tracking-wide mb-6">
        Portfolio
      </h1>
      <GlassCard tone="frame" size="md">
        <p className="text-pt-text-2 text-sm text-center py-8">
          Your holdings will appear here.
        </p>
      </GlassCard>
    </div>
  );
}
