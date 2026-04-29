import { Info } from 'lucide-react';
import { GlassCard } from '@/components/primitives';
import { EventChart } from '@/components/Charts';
import { EVENT_SERIES } from '@/lib/mock-data';

export function EventPerformance() {
  const waypoints = [
    { t: 0.0 },
    { t: 0.25 },
    { t: 0.5 },
    { t: 0.75 },
    { t: 1.0 },
  ];

  return (
    <GlassCard tone="frame" size="md" className="event-performance-card mb-4">
      <div className="flex items-center gap-1.5 mb-1.5 px-1">
        <span className="font-display text-white/95 text-[14px] font-medium">Event Performance</span>
        <Info size={12} color="#7C8AA6" strokeWidth={1.5} />
      </div>
      <EventChart series={EVENT_SERIES} waypoints={waypoints} />
    </GlassCard>
  );
}
