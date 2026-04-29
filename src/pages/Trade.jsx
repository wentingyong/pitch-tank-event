import { useState, useEffect, useMemo } from 'react';
import { Info, HelpCircle, Clock, BarChart3, ChevronRight, ChevronDown, Trophy, Diamond, TrendingUp, ArrowUpDown, Search } from 'lucide-react';
import { EventChart, Sparkline } from '../components/Charts';

// ----- Mock data ---------------------------------------------------------

const EVENT_SERIES = [
	920, 945, 930, 955, 940, 920, 905, 895, 905, 935,
	990, 1040, 1075, 1060, 1020, 985, 950, 980, 1010, 1045,
	1080, 1110, 1095, 1075, 1090, 1115, 1130, 1145, 1160, 1175,
	1188, 1175, 1160, 1145, 1130, 1140, 1155, 1165, 1170, 1185
];

// Sparkline series — varied shapes so they don't look identical
const seriesA = [12, 13, 12, 14, 15, 14, 15, 16, 15, 17, 18, 17, 19, 20, 21, 20, 22, 21, 23, 24];
const seriesB = [22, 21, 21, 20, 21, 22, 21, 22, 23, 22, 23, 24, 23, 24, 25, 24, 25, 26, 25, 26];
const seriesC = [16, 17, 16, 18, 17, 18, 19, 18, 17, 18, 19, 20, 19, 20, 21, 22, 21, 22, 23, 22];
const seriesD = [9, 10, 11, 10, 11, 12, 11, 12, 13, 12, 13, 12, 13, 14, 13, 14, 15, 14, 15, 16];
const seriesE = [22, 21, 22, 21, 20, 19, 20, 19, 18, 19, 20, 19, 20, 21, 20, 21, 22, 21, 22, 21];
const seriesF = [14, 15, 14, 15, 16, 15, 16, 17, 18, 17, 18, 19, 18, 19, 20, 19, 20, 21, 22, 23];
const seriesG = [11, 12, 11, 12, 13, 14, 13, 14, 15, 16, 15, 16, 17, 16, 17, 18, 17, 18, 19, 18];

const FOUNDERS = [
	{ id: "f1", name: "Maya Kapoor", company: "LunaWorks AI", initial: "M", price: 23746.15, change: +1.98, marketCap: 99900.00, sentiment: 78, holders: "2.1K", volume: "$84.2K", series: seriesA, ring: "from-cyan-400 via-blue-500 to-violet-500" },
	{ id: "f2", name: "Arjun Reyes", company: "NebulaPay", initial: "A", price: 18402.55, change: +0.74, marketCap: 72100.00, sentiment: 64, holders: "1.7K", volume: "$61.0K", series: seriesC, ring: "from-violet-400 to-fuchsia-500" },
	{ id: "f3", name: "Priya Wen", company: "OrbitMesh", initial: "P", price: 15820.00, change: -1.21, marketCap: 60800.00, sentiment: 52, holders: "1.4K", volume: "$48.6K", series: seriesE, ring: "from-emerald-400 to-cyan-500" },
	{ id: "f4", name: "Diego Marín", company: "GreenGrid", initial: "D", price: 12390.40, change: +3.42, marketCap: 48500.00, sentiment: 71, holders: "1.2K", volume: "$39.1K", series: seriesF, ring: "from-amber-400 to-orange-500" },
	{ id: "f5", name: "Naomi Park", company: "BrightAngle", initial: "N", price: 9871.10, change: +0.12, marketCap: 38200.00, sentiment: 58, holders: "910", volume: "$24.4K", series: seriesB, ring: "from-pink-400 to-violet-500" },
	{ id: "f6", name: "Sasha Lin", company: "CosmicVC", initial: "S", price: 7642.88, change: -2.07, marketCap: 29900.00, sentiment: 41, holders: "780", volume: "$18.2K", series: seriesG, ring: "from-sky-400 to-blue-500" },
	{ id: "f7", name: "Elias Forrest", company: "NovaFund", initial: "E", price: 5210.30, change: +0.54, marketCap: 21400.00, sentiment: 60, holders: "612", volume: "$11.8K", series: seriesD, ring: "from-fuchsia-400 to-rose-500" },
];

// ----- Tiny utilities ----------------------------------------------------

const fmtMoney = (n, dp = 2) =>
	n.toLocaleString("en-US", { minimumFractionDigits: dp, maximumFractionDigits: dp });

const formatTimer = (s) => {
	const m = Math.floor(s / 60);
	const r = s % 60;
	return `${m}:${String(r).padStart(2, "0")}s`;
};

// ----- UI atoms ----------------------------------------------------------

const Avatar = ({ initial = "?", size = 40, ringClass = "from-cyan-400 to-violet-500" }) => (
	<div className={`avatar-ring`} style={{ width: size, height: size }}>
		<div
			className={`w-full h-full rounded-full bg-gradient-to-br ${ringClass} flex items-center justify-center font-display font-semibold text-white`}
			style={{ fontSize: size * 0.42 }}
		>
			<span className="drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">{initial}</span>
		</div>
	</div>
);

const IconButton = ({ children, onClick, label }) => (
	<button
		aria-label={label}
		onClick={onClick}
		className="w-9 h-9 rounded-full glass flex items-center justify-center text-muted hover:text-white transition-colors"
	>
		{children}
	</button>
);

const Pill = ({ children, className = "", onClick }) => (
	<button
		onClick={onClick}
		className={`pill rounded-full px-3 h-8 inline-flex items-center gap-1.5 text-[12px] text-white/90 hover:bg-white/[0.06] transition-colors ${className}`}
	>
		{children}
	</button>
);

// ----- Sections ----------------------------------------------------------

const Header = () => (
	<div className="flex items-center justify-between pt-3 pb-3">
		<div className="flex items-center gap-3">
			<Avatar initial="F" size={42} ringClass="from-cyan-400 via-blue-500 to-violet-500" />
			<div className="leading-tight">
				<div className="text-[11px] text-muted">Good Evening,</div>
				<div className="font-display font-semibold text-white text-[15px] tracking-tight">FirstName LastName</div>
			</div>
		</div>
		<div className="flex items-center gap-2">
			<IconButton label="Info"><Info size={16} strokeWidth={1.5} /></IconButton>
			<IconButton label="Help"><HelpCircle size={16} strokeWidth={1.5} /></IconButton>
		</div>
	</div>
);

const BalanceRow = ({ secondsLeft }) => (
	<div className="flex items-start justify-between mt-1 mb-3">
		<div>
			<div className="text-[11px] uppercase tracking-[0.14em] text-muted/90">Your Balance</div>
			<div className="font-display font-semibold text-white text-[44px] leading-[1.05] num tracking-tight mt-0.5 neon-white">
				$1,000
			</div>
			<div className="flex items-center gap-1.5 mt-1.5 text-[12px] num">
				<span className="text-mint flex items-center gap-1">
					<TrendingUp size={10} color="#40F3C5" strokeWidth={1.5} />
					$10 (1%)
				</span>
				<span className="text-muted">· 30 mins</span>
			</div>

		</div>

		<div className="flex flex-col items-end gap-2 mt-1">

			<Pill className="!h-9 !px-3.5">
				<BarChart3 size={14} color="#A7B3C9" strokeWidth={1.5} />
				<span className="text-white/90">Holdings History</span>
				<ChevronRight size={12} color="#A7B3C9" strokeWidth={1.5} />
			</Pill>
			<Pill className="!h-9 !px-3.5 !pr-3 border-blue/40 !bg-[rgba(42,120,255,0.10)]">
				<Clock size={14} color="#23D6FF" strokeWidth={1.5} />
				<span className="num text-white neon-cyan">Trading closes in {formatTimer(secondsLeft)}</span>
			</Pill>
		</div>
	</div>
);

const EventPerformance = () => {
	const waypoints = [
		{ t: 0.0 },
		{ t: 0.25 },
		{ t: 0.5 },
		{ t: 0.75 },
		{ t: 1.0 },
	];
	return (
		<section className="glass rounded-[22px] p-3.5 pb-1 mb-4">
			<div className="flex items-center gap-1.5 mb-1.5 px-1">
				<span className="font-display text-white/95 text-[14px] font-medium">Event Performance</span>
				<Info size={12} color="#7C8AA6" strokeWidth={1.5} />
			</div>
			<EventChart series={EVENT_SERIES} waypoints={waypoints} />
		</section>
	);
};

const FeaturedBanner = () => (
	<section className="relative rounded-[22px] glass-tinted-orange p-3.5 mb-4 overflow-hidden">
		<div className="relative flex items-center justify-between">
			<div className="flex items-center gap-3">
				<div className="w-10 h-10 rounded-xl flex items-center justify-center"
					style={{
						background: "linear-gradient(180deg, rgba(138,92,255,0.35), rgba(42,120,255,0.20))",
						boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10), 0 0 18px rgba(138,92,255,0.45)"
					}}>
					<Trophy size={18} color="#F0D49B" strokeWidth={1.5} />
				</div>
				<div className="leading-tight">
					<div className="font-display text-white text-[14px] font-semibold tracking-tight">Pitch THE One</div>
					<div className="text-[11px] text-muted">Choose your champion</div>
				</div>
			</div>
			<div className="flex items-center gap-2">
				<div className="text-right leading-tight">
					<div className="text-[12px] text-white/90">Polymarket</div>
					<div className="text-[10px] text-muted">Prediction Market</div>
				</div>
				<div className="w-9 h-9 rounded-lg flex items-center justify-center"
					style={{
						background: "linear-gradient(180deg, rgba(35,214,255,0.20), rgba(42,120,255,0.10))",
						boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.10)"
					}}>
					<Diamond size={16} color="#23D6FF" strokeWidth={1.5} />
				</div>
			</div>
		</div>
	</section>
);

const Segmented = ({ value, options, onChange }) => (
	<div className="glass-tinted-purple p-0.5 inline-flex rounded-full">
		{options.map((opt) => {
			const on = opt === value;
			return (
				<button key={opt} onClick={() => onChange(opt)}
					className={`px-3 h-7 rounded-full text-[12px] transition-all ${on ? "seg-on" : "text-muted hover:text-white/90"}`}>
					{opt}
				</button>
			);
		})}
	</div>
);

// ----- Founder cards -----------------------------------------------------

const ExpandedFounder = ({ f, onCollapse }) => {
	const isUp = f.change >= 0;
	return (
		<div className="relative rounded-[20px] glass-strong halo-blue p-3.5 mb-3 overflow-hidden">
			<button onClick={onCollapse}
				aria-label="Collapse"
				className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-white/80"
				style={{ background: "rgba(255,255,255,0.04)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.08)" }}>
				<ChevronDown size={14} strokeWidth={1.5} />
			</button>

			{/* Top row: avatar + name + price */}
			<div className="flex items-start gap-3">
				<Avatar initial={f.initial} size={42} ringClass={f.ring} />
				<div className="flex-1 leading-tight pt-0.5">
					<div className="font-display text-white text-[15px] font-semibold tracking-tight">{f.name}</div>
					<div className="text-[12px] text-muted">{f.company}</div>
				</div>
				<div className="text-right pt-0.5 pr-7">
					<div className="font-display num text-white text-[15px] font-semibold tracking-tight">${fmtMoney(f.price)}</div>
					<div className={`num text-[12px] ${isUp ? "text-mint" : "text-orange"} flex items-center justify-end gap-1`}>
						{isUp
							? <TrendingUp size={9} color="#40F3C5" strokeWidth={1.5} />
							: <ChevronDown size={9} color="#FF8A2B" strokeWidth={1.5} />}
						{isUp ? "+" : ""}{f.change.toFixed(2)}%
					</div>
				</div>
			</div>

			{/* Sparkline strip */}
			<div className="mt-2 mb-2.5 -mx-1 overflow-hidden">
				<Sparkline width={358} height={42} series={f.series} color={isUp ? "#40F3C5" : "#FF8A2B"} live />
			</div>

			{/* Market cap */}
			<div className="text-[12px] text-muted mb-3">
				Market Cap. <span className="num text-white/95">${fmtMoney(f.marketCap)}</span>
			</div>

			{/* Stats row */}
			<div className="rounded-[14px] grid grid-cols-3 mb-3.5 overflow-hidden"
				style={{ background: "rgba(255,255,255,0.03)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.06)" }}>
				<div className="px-3 py-2.5 text-center border-r border-white/5">
					<div className="text-[10px] uppercase tracking-wider text-muted">Sentiment</div>
					<div className="font-display num text-[14px] mt-0.5">
						<span className="text-white">{f.sentiment}%</span>{" "}
						<span className="text-mint text-[12px]">Bullish</span>
					</div>
				</div>
				<div className="px-3 py-2.5 text-center border-r border-white/5">
					<div className="text-[10px] uppercase tracking-wider text-muted">Holders</div>
					<div className="font-display num text-white text-[15px] mt-0.5">{f.holders}</div>
				</div>
				<div className="px-3 py-2.5 text-center">
					<div className="text-[10px] uppercase tracking-wider text-muted">Volume</div>
					<div className="font-display num text-white text-[15px] mt-0.5">{f.volume}</div>
				</div>
			</div>

			{/* Buy / Sell */}
			<div className="grid grid-cols-2 gap-3">
				<button className="btn-buy h-12 rounded-[14px] font-display font-semibold text-[16px] tracking-tight press">
					Buy
				</button>
				<button className="btn-sell h-12 rounded-[14px] font-display font-semibold text-[16px] tracking-tight press">
					Sell
				</button>
			</div>
		</div>
	);
};

const CollapsedFounder = ({ f, onExpand }) => {
	const isUp = f.change >= 0;
	return (
		<button onClick={onExpand}
			className="w-full text-left rounded-[18px] glass-tinted-cyan mb-3 p-3 press hover:brightness-110 transition-all">
			<div className="flex items-center gap-2.5">
				<Avatar initial={f.initial} size={34} ringClass={f.ring} />
				<div className="leading-tight min-w-0 flex-1">
					<div className="font-display text-white text-[13px] font-semibold truncate">{f.name}</div>
					<div className="text-[11px] text-muted truncate">{f.company}</div>
				</div>
				<div className="opacity-90 shrink-0">
					<Sparkline width={64} height={26} series={f.series} color={isUp ? "#40F3C5" : "#FF8A2B"} live />
				</div>
				<div className="text-right leading-tight shrink-0">
					<div className="font-display num text-white text-[12.5px] font-semibold">${fmtMoney(f.price)}</div>
					<div className={`num text-[11px] ${isUp ? "text-mint" : "text-orange"}`}>
						{isUp ? "+" : ""}{f.change.toFixed(2)}%
					</div>
				</div>
				<ChevronRight size={13} color="#7C8AA6" strokeWidth={1.5} className="shrink-0" />
			</div>
		</button>
	);
};

// ----- Trading Market panel ---------------------------------------------

const TradingMarket = ({ founders, expandedId, setExpandedId, sort, setSort }) => (
	<section className="relative rounded-[24px] glass-tinted-blue p-3.5 mb-5 overflow-hidden">
		<div className="relative flex items-center justify-between mb-3 px-0.5">
			<div className="font-display text-white text-[18px] font-semibold tracking-tight neon-white">Trading Market</div>
			<div className="flex items-center gap-2">
				<span className="text-[11px] text-muted">sort by</span>
				<Segmented value={sort} options={["Price", "A-Z"]} onChange={setSort} />
			</div>
		</div>

		<div className="relative">
			{founders.map((f) => {
				if (f.id === expandedId) {
					return (
						<ExpandedFounder key={f.id} f={f}
							onCollapse={() => setExpandedId(null)} />
					);
				}
				return (
					<CollapsedFounder key={f.id} f={f}
						onExpand={() => setExpandedId(f.id)} />
				);
			})}
		</div>
	</section>
);

// ----- Trade Page ---------------------------------------------------------------

export const Trade = () => {
	const [expandedId, setExpandedId] = useState("f1");
	const [sort, setSort] = useState("Price");
	const [secondsLeft, setSecondsLeft] = useState(5 * 60);

	// Tick the trading-closes timer
	useEffect(() => {
		const t = setInterval(() => setSecondsLeft(s => Math.max(0, s - 1)), 1000);
		return () => clearInterval(t);
	}, []);

	const sorted = useMemo(() => {
		const arr = [...FOUNDERS];
		if (sort === "Price") arr.sort((a, b) => b.price - a.price);
		else arr.sort((a, b) => a.name.localeCompare(b.name));
		return arr;
	}, [sort]);

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
			/>
		</>
	);
};
