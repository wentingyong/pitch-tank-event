import {
  Sparkles,
  TrendingUp,
  Rocket,
  Globe,
  Users,
  GraduationCap,
  Building2,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { GlassCard, Button, Money } from '@/components/primitives';
import { Pill } from './components/Pill';
import { PortraitCard } from './components/PortraitCard';
import { ProjectMark } from './components/ProjectMark';
import { founders, type Founder, type StatIcon } from './fixtures';
import { cn } from '@/lib/utils';

const ICONS: Record<StatIcon, React.ReactNode> = {
  trending: <TrendingUp className="w-full h-full" />,
  rocket: <Rocket className="w-full h-full" />,
  globe: <Globe className="w-full h-full" />,
  users: <Users className="w-full h-full" />,
  sparkles: <Sparkles className="w-full h-full" />,
  graduation: <GraduationCap className="w-full h-full" />,
  building: <Building2 className="w-full h-full" />,
};

export interface FoundersPanelProps {
  onTrade: (founderId: string) => void;
}

export function FoundersPanel({ onTrade }: FoundersPanelProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <Pill tone="eyebrow" className="!text-pt-cyan">
          Founders
        </Pill>
        <p className="text-pt-text-2 text-[13px] mt-2 leading-snug">
          Connect with visionary builders shaping the future.
        </p>
      </div>

      {founders.map((f) => (
        <FounderCard key={f.id} founder={f} onTrade={() => onTrade(f.id)} />
      ))}
    </div>
  );
}

function FounderCard({
  founder,
  onTrade,
}: {
  founder: Founder;
  onTrade: () => void;
}) {
  const isUp = founder.stockChange >= 0;

  return (
    <GlassCard tone="cyan" size="md">
      {founder.isFeatured && (
        <div className="mb-3">
          <Pill
            tone="frame"
            icon={<Sparkles className="w-2.5 h-2.5" />}
            className="!text-pt-cyan"
          >
            Featured Founder
          </Pill>
        </div>
      )}

      {/* Header: portrait + name block */}
      <div className="flex items-start gap-3 mb-3">
        <div className="w-[72px] shrink-0">
          <PortraitCard
            photo={founder.photo}
            name={founder.name}
            aspect="square"
            className="rounded-xl"
          />
        </div>

        <div className="min-w-0 flex-1 pt-0.5">
          <div className="font-display text-white text-[17px] font-semibold leading-tight">
            {founder.name}
          </div>
          <div className="text-pt-cyan text-[10.5px] uppercase tracking-[0.18em] font-medium mt-1">
            {founder.title}
          </div>
        </div>
      </div>

      {/* Bio */}
      <p className="text-pt-text-2 text-[13px] leading-relaxed mb-4">
        {founder.bio}
      </p>

      {/* Project section */}
      <div
        className="rounded-xl p-3 mb-4"
        style={{
          background: 'rgba(255,255,255,0.03)',
          boxShadow: 'inset 0 0 0 1px rgba(184,212,255,0.12)',
        }}
      >
        <Pill tone="eyebrow" className="block mb-2.5 !text-pt-cyan">
          Project
        </Pill>

        <div className="flex items-center gap-3 mb-3">
          <ProjectMark
            src={founder.project.mark}
            letter={founder.project.letter}
            size="md"
          />
          <div className="min-w-0">
            <div className="font-display text-white text-base font-semibold leading-tight">
              {founder.project.name}
            </div>
            <p className="text-pt-text-2 text-[12px] leading-snug mt-1">
              {founder.project.tagline}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2 pt-1">
          {founder.project.stats.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="flex items-center justify-center w-9 h-9 rounded-lg shrink-0"
                style={{
                  background: 'rgba(0,229,255,0.12)',
                  boxShadow: 'inset 0 0 0 1px rgba(0,229,255,0.45)',
                  color: 'var(--c-cyan)',
                }}
              >
                <span className="inline-flex w-[18px] h-[18px]">
                  {ICONS[s.icon]}
                </span>
              </div>
              <div className="min-w-0 leading-tight pt-0.5">
                <div className="text-pt-cyan text-[10px] uppercase tracking-[0.18em] font-medium">
                  {s.label}
                </div>
                <div className="text-white text-[12.5px] font-medium mt-0.5">
                  {s.value}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stock summary + Trade CTA */}
      <div className="flex items-center justify-between gap-3">
        <div className="leading-tight min-w-0">
          <div className="text-pt-text-3 text-[10px] uppercase tracking-[0.18em] font-medium">
            Stock
          </div>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="font-display text-white text-base font-semibold num">
              <Money value={founder.stockPrice} decimals={0} />
            </span>
            <span
              className={cn(
                'inline-flex items-center text-[11px] font-medium num',
                isUp ? 'text-pt-cyan' : 'text-pt-orange',
              )}
            >
              {isUp ? (
                <ArrowUpRight className="w-3 h-3" />
              ) : (
                <ArrowDownRight className="w-3 h-3" />
              )}
              {isUp ? '+' : ''}
              {founder.stockChange.toFixed(1)}%
            </span>
          </div>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={onTrade}
          className="shrink-0"
        >
          Trade
        </Button>
      </div>
    </GlassCard>
  );
}
