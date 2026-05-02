import { GlassCard } from '@/components/primitives';
import { Pill } from './components/Pill';
import { PortraitCard } from './components/PortraitCard';
import { leadJudge, otherJudges, type Judge } from './fixtures';

export function JudgesPanel() {
  return (
    <div className="flex flex-col gap-4">
      <Pill tone="eyebrow" className="!text-pt-blue">
        Judges
      </Pill>

      <JudgeCard judge={leadJudge} variant="lead" />

      {otherJudges.map((j) => (
        <JudgeCard key={j.id} judge={j} variant="row" />
      ))}
    </div>
  );
}

function JudgeCard({
  judge,
  variant,
}: {
  judge: Judge;
  variant: 'lead' | 'row';
}) {
  const isLead = variant === 'lead';
  const portraitWidth = isLead ? 'w-[42%]' : 'w-[36%]';

  return (
    <GlassCard tone="primary" size="sm">
      <div className="flex gap-3 items-stretch">
        <div className={`shrink-0 ${portraitWidth}`}>
          <PortraitCard photo={judge.photo} name={judge.name} aspect="portrait" />
        </div>

        <div className="flex-1 min-w-0 flex flex-col gap-1.5 py-1">
          {isLead && (
            <div className="self-start">
              <Pill tone="frame">Lead Judge</Pill>
            </div>
          )}

          <div className="font-display text-white text-lg font-semibold leading-tight">
            {judge.name}
          </div>

          <div className="text-pt-blue text-[12px] font-medium leading-tight">
            {judge.role}, {judge.firm}
          </div>

          <p className="text-pt-text-2 text-[12px] leading-snug mt-0.5 mb-1">
            {judge.bio}
          </p>

          <Pill tone="eyebrow" className="mt-auto mb-1 !text-pt-blue">
            Expertise
          </Pill>

          <div className="flex flex-wrap gap-1.5">
            {judge.expertise.map((e) => (
              <Pill key={e} tone="frame">
                {e}
              </Pill>
            ))}
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
