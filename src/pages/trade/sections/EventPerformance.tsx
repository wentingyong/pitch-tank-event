import { EventChart } from "@/components/Charts";
import { EVENT_SERIES } from "@/lib/mock-data";

export function EventPerformance() {
  const waypoints = [
    { t: 0.0 },
    { t: 0.25 },
    { t: 0.5 },
    { t: 0.75 },
    { t: 1.0 },
  ];

  return (
    <div className="event-performance-glow">
      <div className="mb-1.5 px-1">
        <span className="text-[11px] uppercase tracking-[0.14em] text-pt-text-2">
          Event Performance
        </span>
      </div>
      <EventChart series={EVENT_SERIES} waypoints={waypoints} />
    </div>
  );
}
