import {
  TrendingUp,
  Rocket,
  Globe,
  Users,
  Sparkles,
  GraduationCap,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { GlassCard, Button } from '@/components/primitives';
import { Pill } from './components/Pill';
import { SponsorLogo } from './components/SponsorLogo';
import { StatRow } from './components/StatRow';
import { sponsors, type Sponsor, type StatIcon } from './fixtures';

const ICONS: Record<StatIcon, React.ReactNode> = {
  trending: <TrendingUp className="w-full h-full" />,
  rocket: <Rocket className="w-full h-full" />,
  globe: <Globe className="w-full h-full" />,
  users: <Users className="w-full h-full" />,
  sparkles: <Sparkles className="w-full h-full" />,
  graduation: <GraduationCap className="w-full h-full" />,
  building: <Building2 className="w-full h-full" />,
};

export function SponsorsPanel() {
  return (
    <div className="flex flex-col gap-4">
      {sponsors.map((s) => (
        <SponsorCard key={s.id} sponsor={s} />
      ))}
    </div>
  );
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <GlassCard tone="featured" size="md">
      {sponsor.isFeatured && (
        <div className="mb-3">
          <Pill tone="featured" icon={<Sparkles className="w-2.5 h-2.5" />}>
            Featured Sponsor
          </Pill>
        </div>
      )}

      {/* Header: logo + name block */}
      <div className="flex items-start gap-3 mb-3">
        <SponsorLogo
          src={sponsor.logo}
          name={sponsor.name}
          size="md"
          style={sponsor.logoStyle}
        />

        <div className="min-w-0 flex-1 pt-0.5">
          <Pill tone="eyebrow" className="block !text-pt-orange">
            {sponsor.category}
          </Pill>

          <div className="font-display text-white text-[17px] font-semibold leading-tight mt-1.5">
            {sponsor.name}
          </div>

          <div className="text-pt-text-2 text-[12px] leading-snug mt-1">
            {sponsor.tagline}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-pt-text-2 text-[13px] leading-relaxed mb-4">
        {sponsor.description}
      </p>

      {/* Highlights — vertical stack reads cleaner on mobile than 3 cramped columns */}
      <div className="flex flex-col gap-2.5 mb-4">
        {sponsor.highlights.map((h, i) => (
          <StatRow
            key={i}
            icon={ICONS[h.icon]}
            value={h.value}
            label={h.label}
            accent="orange"
          />
        ))}
      </div>

      {/* CTA */}
      <a
        href={sponsor.website}
        target="_blank"
        rel="noreferrer noopener"
        className="block"
      >
        <Button variant="primary" size="md" className="w-full">
          <span className="inline-flex items-center gap-1.5">
            Visit Site
            <ExternalLink className="w-3.5 h-3.5" />
          </span>
        </Button>
      </a>
    </GlassCard>
  );
}
