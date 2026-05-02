import { useMemo, useState, type CSSProperties, type ReactNode } from 'react';
import { Sparkles, Users, User } from 'lucide-react';
import { PageHero } from './network/components/PageHero';
import { SponsorsPanel } from './network/SponsorsPanel';
import { JudgesPanel } from './network/JudgesPanel';
import { FoundersPanel } from './network/FoundersPanel';
import { founders, toMarketFounder } from './network/fixtures';
import { BuySellDialog, type TradeSide } from './trade/BuySellDialog';

type NetworkTab = 'sponsors' | 'judges' | 'founders';

interface TabSpec {
  value: NetworkTab;
  label: string;
  icon: ReactNode;
  /** Solid color used when the tab is active; matches the panel theme. */
  color: string;
  /** rgb() base for translucent overlays. */
  rgb: string;
}

const TABS: TabSpec[] = [
  { value: 'sponsors', label: 'Sponsors', icon: <Sparkles className="w-3 h-3" />, color: '#FF8A00', rgb: '255,138,0' },
  { value: 'judges',   label: 'Judges',   icon: <Users    className="w-3 h-3" />, color: '#7AB8FF', rgb: '79,124,255' },
  { value: 'founders', label: 'Founders', icon: <User     className="w-3 h-3" />, color: '#00E5FF', rgb: '0,229,255' },
];

function activeTabStyle(rgb: string, color: string): CSSProperties {
  return {
    color,
    textShadow: `0 0 10px rgba(${rgb},0.7)`,
    background: `rgba(${rgb},0.08)`,
    boxShadow: `inset 0 0 0 1px rgba(${rgb},0.55), inset 0 0 12px rgba(${rgb},0.22), 0 0 16px rgba(${rgb},0.32)`,
  };
}

export function NetworkPage() {
  const [tab, setTab] = useState<NetworkTab>('sponsors');
  const [tradeFounderId, setTradeFounderId] = useState<string | null>(null);
  const [tradeSide] = useState<TradeSide>('buy');

  const tradeFounder = useMemo(() => {
    if (!tradeFounderId) return null;
    const f = founders.find((x) => x.id === tradeFounderId);
    return f ? toMarketFounder(f) : null;
  }, [tradeFounderId]);

  return (
    <div className="relative">
      <PageHero />

      <div className="pt-tabs !flex w-full mb-5" role="tablist">
        {TABS.map((t) => {
          const isActive = tab === t.value;
          return (
            <button
              key={t.value}
              role="tab"
              aria-selected={isActive}
              onClick={() => setTab(t.value)}
              className="pt-tab flex-1"
              style={isActive ? activeTabStyle(t.rgb, t.color) : undefined}
            >
              <span className="inline-flex items-center justify-center gap-1.5">
                {t.icon}
                {t.label}
              </span>
            </button>
          );
        })}
      </div>

      {tab === 'sponsors' && <SponsorsPanel />}
      {tab === 'judges' && <JudgesPanel />}
      {tab === 'founders' && (
        <FoundersPanel onTrade={(id) => setTradeFounderId(id)} />
      )}

      <BuySellDialog
        open={tradeFounder !== null}
        onOpenChange={(next) => {
          if (!next) setTradeFounderId(null);
        }}
        founder={tradeFounder}
        initialSide={tradeSide}
      />
    </div>
  );
}
