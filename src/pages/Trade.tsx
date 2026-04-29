import { useEffect, useMemo, useState } from 'react';
import { FOUNDERS } from '@/lib/mock-data';
import { Header } from './trade/sections/Header';
import { BalanceRow } from './trade/sections/BalanceRow';
import { EventPerformance } from './trade/sections/EventPerformance';
import { FeaturedBanner } from './trade/sections/FeaturedBanner';
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
      <BalanceRow secondsLeft={secondsLeft} />
      <EventPerformance />
      <FeaturedBanner />
      <TradingMarket
        founders={sorted}
        expandedId={expandedId}
        setExpandedId={setExpandedId}
        sort={sort}
        setSort={setSort}
        onTrade={(founderId, side) => setTradeDialog({ founderId, side })}
      />
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
