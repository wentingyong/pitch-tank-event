import { GlassCard, Tabs } from '@/components/primitives';
import type { Founder } from '@/lib/mock-data';
import { CollapsedFounder } from './CollapsedFounder';
import { ExpandedFounder } from './ExpandedFounder';

export type Sort = 'Price' | 'A-Z';

export interface TradingMarketProps {
  founders: Founder[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  sort: Sort;
  setSort: (s: Sort) => void;
}

export function TradingMarket({
  founders,
  expandedId,
  setExpandedId,
  sort,
  setSort,
}: TradingMarketProps) {
  return (
    <GlassCard tone="frame" size="md" className="mb-5">
      <div className="relative flex items-center justify-between mb-3 px-0.5">
        <div className="font-display text-white text-[18px] font-semibold tracking-tight">
          Trading Market
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-[11px] text-pt-text-2 leading-none">sort by</span>
          <Tabs<Sort>
            value={sort}
            onChange={setSort}
            options={[
              { value: 'Price', label: 'Price' },
              { value: 'A-Z', label: 'A-Z' },
            ]}
          />
        </div>
      </div>

      <div className="relative">
        {founders.map((f) =>
          f.id === expandedId ? (
            <ExpandedFounder key={f.id} f={f} onCollapse={() => setExpandedId(null)} />
          ) : (
            <CollapsedFounder key={f.id} f={f} onExpand={() => setExpandedId(f.id)} />
          )
        )}
      </div>
    </GlassCard>
  );
}
