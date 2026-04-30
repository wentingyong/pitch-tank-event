import { useState } from "react";
import { Star, Bell, TrendingUp, Users, Plus, Search, Zap } from "lucide-react";
import {
  GlassCard,
  Button,
  IconButton,
  Tabs,
  Avatar,
  TrendValue,
  Money,
  Timer,
} from "@/components/primitives";

export function Playground() {
  const [tab, setTab] = useState<"market" | "portfolio" | "events">("market");
  const [period, setPeriod] = useState<"24h" | "week" | "month">("month");

  return (
    <div className="min-h-screen p-6 md:p-10 max-w-3xl mx-auto space-y-12">
      <header>
        <h1 className="font-display text-4xl uppercase tracking-wide bg-gradient-to-r from-white via-pt-metal-blue to-pt-purple bg-clip-text text-transparent">
          Playground
        </h1>
        <p className="text-pt-text-2 mt-2 text-sm">
          Phase 2 verification — all primitives in one page.
        </p>
      </header>

      {/* GlassCard tones */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-pt-text-3 uppercase">
          Glass Cards
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <GlassCard tone="primary" size="md">
            <div className="text-xs text-pt-text-3 uppercase tracking-widest mb-1">
              Primary
            </div>
            <Money value={23094.57} className="font-display text-2xl block" />
          </GlassCard>
          <GlassCard tone="frame" size="md">
            <div className="text-xs text-pt-text-3 uppercase tracking-widest mb-1">
              Frame
            </div>
            <div className="font-display text-lg">Container · no bg</div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <GlassCard tone="purple" size="md">
            <div className="text-xs text-pt-text-3 uppercase tracking-widest mb-1">
              Purple
            </div>
            <div className="font-display text-pt-purple">Active</div>
          </GlassCard>
          <GlassCard tone="cyan" size="md">
            <div className="text-xs text-pt-text-3 uppercase tracking-widest mb-1">
              Cyan
            </div>
            <TrendValue value={24.56} />
          </GlassCard>
          <GlassCard tone="featured" size="md">
            <div className="text-xs text-pt-text-3 uppercase tracking-widest mb-1">
              Featured
            </div>
            <div className="font-display">Featured Card</div>
          </GlassCard>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <GlassCard tone="neutral" size="md">
            <div className="text-xs text-pt-text-3 uppercase tracking-widest mb-1">
              Neutral
            </div>
            <div>Default list item</div>
          </GlassCard>
          <GlassCard tone="neutral" active size="md">
            <div className="text-xs text-pt-text-3 uppercase tracking-widest mb-1">
              Neutral · Active
            </div>
            <div>Selected</div>
          </GlassCard>
          <GlassCard tone="negative" size="md">
            <div className="text-xs text-pt-text-3 uppercase tracking-widest mb-1">
              Negative
            </div>
            <TrendValue value={-4.21} />
          </GlassCard>
        </div>
      </section>

      {/* Buttons */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-pt-text-3 uppercase">
          Buttons
        </h2>

        <div className="grid grid-cols-3 gap-3">
          <Button variant="primary" size="lg">
            Confirm
          </Button>
          <Button variant="secondary" size="lg">
            View Market
          </Button>
          <Button variant="tertiary" size="lg">
            Learn More →
          </Button>
        </div>

        <Button variant="featured" size="lg" shimmer className="w-full">
          ★ Featured Action
        </Button>

        <div className="grid grid-cols-2 gap-3">
          <Button variant="buy" size="lg">
            ▲ Buy
          </Button>
          <Button variant="sell" size="lg">
            ▼ Sell
          </Button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <Button variant="primary" size="md" disabled>
            Disabled
          </Button>
          <Button variant="primary" size="md" loading loadingText="Processing">
            Save
          </Button>
          <Button variant="buy" size="md" loading loadingText="Buying">
            Buy
          </Button>
        </div>
      </section>

      {/* Icon Buttons */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-pt-text-3 uppercase">
          Icon Buttons
        </h2>
        <div className="flex gap-3 items-center flex-wrap">
          <IconButton
            size="sm"
            icon={<Star strokeWidth={1.5} />}
            aria-label="Star"
          />
          <IconButton
            size="md"
            icon={<Zap strokeWidth={1.5} />}
            aria-label="Zap"
          />
          <IconButton
            size="md"
            active
            icon={<TrendingUp strokeWidth={1.5} />}
            aria-label="Trending (active)"
          />
          <IconButton
            size="md"
            icon={<Bell strokeWidth={1.5} />}
            aria-label="Bell"
          />
          <IconButton
            size="md"
            icon={<Users strokeWidth={1.5} />}
            aria-label="Users"
          />
          <IconButton
            size="md"
            icon={<Plus strokeWidth={1.5} />}
            aria-label="Plus"
          />
          <IconButton
            size="lg"
            icon={<Search strokeWidth={1.5} />}
            aria-label="Search"
          />
        </div>
      </section>

      {/* Tabs */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-pt-text-3 uppercase">
          Tabs
        </h2>
        <div className="flex gap-4 flex-wrap">
          <Tabs
            value={tab}
            onChange={setTab}
            options={[
              { value: "market", label: "Market" },
              { value: "portfolio", label: "Portfolio" },
              { value: "events", label: "Events" },
            ]}
          />
          <Tabs
            value={period}
            onChange={setPeriod}
            options={[
              { value: "24h", label: "24H" },
              { value: "week", label: "Week" },
              { value: "month", label: "Month" },
            ]}
          />
        </div>
      </section>

      {/* Avatars */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-pt-text-3 uppercase">
          Avatars
        </h2>
        <div className="flex gap-3 items-center flex-wrap">
          <Avatar size="sm" name="Maya" />
          <Avatar size="md" name="Arjun" gradient={["#A259FF", "#4F7CFF"]} />
          <Avatar size="lg" name="Priya" gradient={["#00E5FF", "#21FFA6"]} />
          <Avatar size="xl" name="Diego" gradient={["#FF8A00", "#A259FF"]} />
          <Avatar size="md" src="https://i.pravatar.cc/150?u=demo" name="?" />
        </div>
      </section>

      {/* Data primitives */}
      <section className="space-y-4">
        <h2 className="font-mono text-xs tracking-widest text-pt-text-3 uppercase">
          Data primitives
        </h2>
        <GlassCard tone="primary" size="lg" className="space-y-3">
          <div>
            <div className="text-xs text-pt-text-3 uppercase tracking-widest">
              Money
            </div>
            <Money value={23094.57} className="font-display text-3xl block" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <div className="text-xs text-pt-text-3 uppercase tracking-widest">
                Trend +
              </div>
              <TrendValue value={12.34} />
            </div>
            <div>
              <div className="text-xs text-pt-text-3 uppercase tracking-widest">
                Trend -
              </div>
              <TrendValue value={-4.21} />
            </div>
            <div>
              <div className="text-xs text-pt-text-3 uppercase tracking-widest">
                Timer
              </div>
              <Timer seconds={300} countdown />
            </div>
          </div>
        </GlassCard>
      </section>
    </div>
  );
}
