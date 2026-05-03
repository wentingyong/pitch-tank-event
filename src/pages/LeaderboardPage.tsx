import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import {
  GlassCard,
  Tabs,
  Avatar,
  Money,
  IconButton,
} from "@/components/primitives";
import type { TabOption } from "@/components/primitives";
import { cn } from "@/lib/utils";
import { investors, founders, ME_ID, type Player } from "./leaderboard/fixtures";

type Board = "investors" | "founders";
type Rank = 1 | 2 | 3;

const TAB_OPTIONS: ReadonlyArray<TabOption<Board>> = [
  { value: "investors", label: "Investors" },
  { value: "founders", label: "Founders" },
];

const PODIUM_TONE = {
  1: "featured",
  2: "cyan",
  3: "purple",
} as const;

const PODIUM_AMOUNT_COLOR = {
  1: "text-pt-orange",
  2: "text-pt-cyan",
  3: "text-pt-purple",
} as const;

export function LeaderboardPage() {
  const navigate = useNavigate();
  const [board, setBoard] = useState<Board>("investors");
  const players = board === "investors" ? investors : founders;

  const myIndex = players.findIndex((p) => p.id === ME_ID);
  const myRank = myIndex + 1;
  const me = myIndex >= 0 ? players[myIndex] : undefined;
  const top3 = players.slice(0, 3);
  const restRange = players.slice(3, 10);
  const showSelfRow = !!me && myRank > 3;
  const restToRender = showSelfRow
    ? restRange.filter((p) => p.id !== ME_ID)
    : restRange;

  return (
    <div className="relative isolate pt-6">
      {/* bg + skyline match BottomNav's phone-column constraint:
          centered horizontally, capped at 430px wide. */}
      <div
        aria-hidden
        className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 -z-10 w-full max-w-[430px] bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url(/leaderboard/leaderboard-bg.webp)" }}
      />
      <div
        aria-hidden
        className="fixed bottom-0 left-1/2 -translate-x-1/2 -z-[5] w-full max-w-[430px] pointer-events-none"
      >
        <img
          src="/leaderboard/skyline.webp"
          alt=""
          className="w-full h-auto object-cover"
        />
      </div>

      <IconButton
        size="md"
        aria-label="Back"
        icon={<ArrowLeft />}
        className="absolute left-0 z-10"
        onClick={() => navigate(-1)}
      />

      <header className="flex flex-col items-center text-center">
        <img
          src="/leaderboard/logo.png"
          alt="PitchTank"
          className="h-[20vh] w-auto object-contain"
        />

        <div
          className="mt-2 text-md font-bold tracking-[0.2em]"
          style={{
            background:
              "linear-gradient(90deg, var(--c-cyan), var(--c-purple))",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            WebkitTextFillColor: "transparent",
            textShadow: "0 0 12px rgba(140,180,255,0.45)",
          }}
        >
          May 8, 2026
        </div>
        <div className="mt-3 flex items-center justify-center gap-3 w-full">
          <span
            aria-hidden
            className="h-px flex-1 max-w-[80px]"
            style={{
              background:
                "linear-gradient(to right, transparent, var(--c-cyan))",
            }}
          />
          <h1
            className="font-display text-3xl uppercase font-bold tracking-wider text-pt-text-1 whitespace-nowrap"
            style={{ textShadow: "0 0 20px rgba(184,212,255,0.35)" }}
          >
            Leaderboard
          </h1>
          <span
            aria-hidden
            className="h-px flex-1 max-w-[80px]"
            style={{
              background:
                "linear-gradient(to left, transparent, var(--c-purple))",
            }}
          />
        </div>
      </header>

      <div className="mt-3 flex justify-center">
        <Tabs<Board> options={TAB_OPTIONS} value={board} onChange={setBoard} />
      </div>

      <Podium top3={top3} />

      {showSelfRow && me && (
        <div className="mt-5">
          <div
            className="text-pt-cyan text-xs text-center mb-2 tracking-wider"
            style={{ textShadow: "0 0 8px rgba(0,229,255,0.45)" }}
          >
            You are at
          </div>
          <SelfRow rank={myRank} player={me} />
        </div>
      )}

      <div className={showSelfRow ? "mt-3" : "mt-5"}>
        {restToRender.map((p) => {
          const rank = players.findIndex((x) => x.id === p.id) + 1;
          return <Row key={p.id} rank={rank} player={p} />;
        })}
      </div>
    </div>
  );
}

function Podium({ top3 }: { top3: Player[] }) {
  const ordered = [
    { p: top3[1], rank: 2 as Rank },
    { p: top3[0], rank: 1 as Rank },
    { p: top3[2], rank: 3 as Rank },
  ].filter((x) => !!x.p);

  return (
    <div className="mt-8 grid grid-cols-3 gap-3 items-end">
      {ordered.map(({ p, rank }) => (
        <div
          key={p.id}
          className={cn("flex flex-col items-center", rank === 1 && "-mt-3")}
        >
          <PodiumAvatar rank={rank} player={p} />
          <GlassCard
            tone={PODIUM_TONE[rank]}
            size="sm"
            className="mt-3 w-full text-center"
          >
            <div className="font-display text-white text-[12.5px] font-semibold leading-tight truncate">
              {p.name}
            </div>
            <div
              className={cn(
                "mt-1 font-display text-[11.5px] font-semibold num",
                PODIUM_AMOUNT_COLOR[rank],
              )}
            >
              <Money value={p.amount} decimals={0} />
            </div>
          </GlassCard>
        </div>
      ))}
    </div>
  );
}

function PodiumAvatar({ rank, player }: { rank: Rank; player: Player }) {
  const wrapper = rank === 1 ? "w-28 h-28" : "w-24 h-24";
  return (
    <div className={cn("relative", wrapper)}>
      <div className="absolute inset-[18%]">
        <Avatar
          size="xl"
          photo={player.photo}
          name={player.name}
          className="!w-full !h-full"
        />
      </div>
      <img
        src={`/leaderboard/ranking-${rank}.webp`}
        alt=""
        aria-hidden
        className="pointer-events-none absolute inset-0 w-full h-full object-contain"
      />
    </div>
  );
}

function SelfRow({ rank, player }: { rank: number; player: Player }) {
  return (
    <GlassCard
      tone="primary"
      size="sm"
      className="hover:brightness-110 transition-all"
    >
      <div className="flex items-center gap-2">
        <span className="font-display text-white text-[12.5px] font-semibold num w-5 text-center shrink-0">
          {rank}
        </span>
        <Avatar size="sm" photo={player.photo} name={player.name} />
        <div className="leading-tight min-w-0 flex-1">
          <div className="font-display text-white text-[12.5px] font-semibold truncate">
            {player.name}
          </div>
        </div>
        <div className="text-right leading-tight shrink-0">
          <div className="font-display text-white text-[11.5px] font-semibold num">
            <Money value={player.amount} decimals={0} />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function Row({ rank, player }: { rank: number; player: Player }) {
  return (
    <GlassCard
      tone="frame"
      size="sm"
      className="mb-3 hover:brightness-110 transition-all"
    >
      <div className="flex items-center gap-2">
        <span className="font-display text-pt-text-2 text-[12.5px] font-semibold num w-5 text-center shrink-0">
          {rank}
        </span>
        <Avatar size="sm" photo={player.photo} name={player.name} />
        <div className="leading-tight min-w-0 flex-1">
          <div className="font-display text-white text-[12.5px] font-semibold truncate">
            {player.name}
          </div>
        </div>
        <div className="text-right leading-tight shrink-0">
          <div className="font-display text-white text-[11.5px] font-semibold num">
            <Money value={player.amount} decimals={0} />
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
