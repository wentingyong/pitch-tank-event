import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { GlassCard, Button } from '@/components/primitives';

export function PolymarketPage() {
  const navigate = useNavigate();
  return (
    <div className="pt-6">
      <Button variant="tertiary" size="sm" onClick={() => navigate('/trade')} className="mb-4">
        <ArrowLeft size={14} strokeWidth={1.5} />
        Back to Trade
      </Button>
      <h1 className="font-display text-2xl uppercase tracking-wide mb-6">
        Pitch The One
      </h1>
      <GlassCard tone="featured" size="md">
        <p className="text-pt-text-2 text-sm text-center py-8">
          Polymarket prediction integration coming soon.
        </p>
      </GlassCard>
    </div>
  );
}
