import { useNavigate } from 'react-router-dom';
import { GlassCard, Button } from '@/components/primitives';

export function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className="page-bg min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-[400px] space-y-8">
        <header className="text-center">
          <h1 className="font-display text-5xl uppercase tracking-wide bg-gradient-to-r from-white via-pt-metal-blue to-pt-purple bg-clip-text text-transparent">
            PitchTank
          </h1>
          <p className="text-pt-text-2 mt-3 text-sm">
            Turn pitches into markets
          </p>
        </header>

        <GlassCard tone="primary" size="lg" className="space-y-4">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/trade')}
          >
            Sign in
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="w-full"
            onClick={() => navigate('/trade')}
          >
            Create account
          </Button>
        </GlassCard>

        <p className="text-pt-text-3 text-xs text-center">
          Login flow coming soon — for now, both buttons go to /trade.
        </p>
      </div>
    </div>
  );
}
