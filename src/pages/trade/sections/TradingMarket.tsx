import { ArrowUp } from "lucide-react";
import { Tabs } from "@/components/primitives";
import type { Founder } from "@/lib/mock-data";
import type { TradeSide } from "../BuySellDialog";
import { CollapsedFounder } from "./CollapsedFounder";
import { ExpandedFounder } from "./ExpandedFounder";

export type Sort = "Price" | "A-Z";

export interface TradingMarketProps {
  founders: Founder[];
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  sort: Sort;
  setSort: (s: Sort) => void;
  onTrade: (founderId: string, side: TradeSide) => void;
}

export function TradingMarket({
  founders,
  expandedId,
  setExpandedId,
  sort,
  setSort,
  onTrade,
}: TradingMarketProps) {
  return (
    <div className="mb-5">
      <div className="relative flex items-start justify-between mb-4 px-0.5">
        <img
          src="/trading-market-logo.png"
          alt="Trading Market"
          width={327}
          height={163}
          draggable={false}
          className="block w-[170px] h-auto select-none"
          style={{
            filter:
              "drop-shadow(0 0 14px rgba(184,212,255,0.30)) drop-shadow(0 0 28px rgba(162,89,255,0.18))",
          }}
        />
        <div className="flex flex-col items-start gap-1 pt-1">
          <span className="text-[11px] text-pt-text-2 leading-none pl-2.5">
            sort by
          </span>
          <Tabs<Sort>
            value={sort}
            onChange={setSort}
            options={[
              {
                value: "Price",
                label: (
                  <span className="inline-flex items-center gap-0.5">
                    Price
                    <ArrowUp size={10} strokeWidth={2} />
                  </span>
                ),
              },
              { value: "A-Z", label: "A-Z" },
            ]}
          />
        </div>
      </div>

      <div className="relative">
        {founders.map((f) =>
          f.id === expandedId ? (
            <ExpandedFounder
              key={f.id}
              f={f}
              onCollapse={() => setExpandedId(null)}
              onTrade={(side) => onTrade(f.id, side)}
            />
          ) : (
            <CollapsedFounder
              key={f.id}
              f={f}
              onExpand={() => setExpandedId(f.id)}
              onTrade={() => onTrade(f.id, "buy")}
            />
          ),
        )}
      </div>
    </div>
  );
}
