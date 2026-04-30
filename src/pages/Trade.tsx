import { useEffect, useMemo, useState } from 'react';
import { FOUNDERS } from '@/lib/mock-data';
import { Header } from './trade/sections/Header';
import { TradeTopCard } from './trade/sections/TradeTopCard';
import { TradingMarket, type Sort } from './trade/sections/TradingMarket';
import { BuySellDialog, type TradeSide } from './trade/BuySellDialog';

export function Trade() {
  const [expandedId, setExpandedId] = useState<string | null>('f1');
  const [sort, setSort] = useState<Sort>('Price');
  const [secondsLeft, setSecondsLeft] = useState(5 * 60);
  const [tradeDialog, setTradeDialog] = useState<{
    founderId: string;
    side: TradeSide;
  } | null>(null);

  // Tick the trading-closes timer
  useEffect(() => {
    const t = setInterval(() => setSecondsLeft((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, []);

  const sorted = useMemo(() => {
    const arr = [...FOUNDERS];
    if (sort === 'Price') arr.sort((a, b) => b.price - a.price);
    else arr.sort((a, b) => a.name.localeCompare(b.name));
    return arr;
  }, [sort]);

  const selectedFounder = tradeDialog
    ? FOUNDERS.find((founder) => founder.id === tradeDialog.founderId) ?? null
    : null;

  return (
    <>
      <Header />
      <TradeTopCard
        secondsLeft={secondsLeft}
        onTrade={(founderId, side) => setTradeDialog({ founderId, side })}
      />
      <div className="relative">
        <div
          aria-hidden
          className="absolute -z-10 pointer-events-none"
          style={{
            left: '-28px',
            right: '-28px',
            top: 0,
            bottom: 0,
            background:
              // Horizon glow right under the arc — the "cosmic ocean surface"
              'radial-gradient(140% 60% at 50% 0%, rgba(60,120,230,0.36) 0%, rgba(30,70,180,0.22) 26%, transparent 62%), ' +
              // Deep navy body fading into the page-bg
              'linear-gradient(180deg, ' +
                'rgba(18,38,98,0.62) 0%, ' +
                'rgba(14,28,76,0.48) 22%, ' +
                'rgba(10,22,58,0.32) 55%, ' +
                'rgba(6,14,40,0.18) 85%, ' +
                'rgba(3,4,13,0) 100%)',
          }}
        />
        <TradingMarket
          founders={sorted}
          expandedId={expandedId}
          setExpandedId={setExpandedId}
          sort={sort}
          setSort={setSort}
          onTrade={(founderId, side) => setTradeDialog({ founderId, side })}
        />
      </div>
      <BuySellDialog
        open={tradeDialog !== null}
        onOpenChange={(open) => {
          if (!open) setTradeDialog(null);
        }}
        founder={selectedFounder}
        initialSide={tradeDialog?.side ?? 'buy'}
      />
    </>
  );
}
