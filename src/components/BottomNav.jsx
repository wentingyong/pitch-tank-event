const navIcons = {
	rankings: "/nav-icons/ranking.svg",
	chat: "/nav-icons/chat.svg",
	network: "/nav-icons/network.svg",
	portfolio: "/nav-icons/portfolio.svg"
};

// `icon` doubles as the route key (rankings/portfolio routes unchanged);
// only the visible label is renamed per the new nav design.
const sideItemsLeft = [
	{ icon: "rankings", label: "Leaderboard", tone: "cyan" },
	{ icon: "chat", label: "Chat", tone: "cyan" }
];

const sideItemsRight = [
	{ icon: "network", label: "Network", tone: "magenta" },
	{ icon: "portfolio", label: "Profile", tone: "magenta" }
];

const labelFont = {
	fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
	fontSize: 10,
	fontWeight: 500,
	lineHeight: 1.1,
	letterSpacing: "0.02em"
};

const toneStyles = {
	cyan: {
		activeFilter: [
			"brightness(0) invert(1)",
			"drop-shadow(0 0 2px rgba(255,255,255,1))",
			"drop-shadow(0 0 7px rgba(120,210,255,0.95))",
			"drop-shadow(0 0 14px rgba(40,150,255,0.6))"
		].join(" "),
		activeColor: "#FFFFFF",
		activeShadow: "0 0 5px rgba(255,255,255,0.85), 0 0 12px rgba(80,180,255,0.85)",
		underline: "linear-gradient(90deg, #6FE5FF 0%, #BFFFFF 52%, #6FE5FF 100%)",
		underlineGlow: "0 0 7px rgba(90,205,255,1), 0 0 14px rgba(59,130,246,0.85)"
	},
	magenta: {
		activeFilter: [
			"brightness(0) invert(1)",
			"drop-shadow(0 0 2px rgba(255,255,255,1))",
			"drop-shadow(0 0 7px rgba(225,150,255,0.95))",
			"drop-shadow(0 0 14px rgba(190,90,255,0.6))"
		].join(" "),
		activeColor: "#FFFFFF",
		activeShadow: "0 0 5px rgba(255,255,255,0.85), 0 0 12px rgba(210,120,255,0.85)",
		underline: "linear-gradient(90deg, #E8B5FF 0%, #FFE4FF 52%, #E8B5FF 100%)",
		underlineGlow: "0 0 7px rgba(220,140,255,1), 0 0 14px rgba(160,80,255,0.85)"
	}
};

const inactiveSideFilter = [
	"brightness(0) invert(1)",
	"opacity(0.42)"
].join(" ");

const activeTradeFilter = [
	"brightness(1.18)",
	"saturate(1.2)",
	"drop-shadow(0 0 6px rgba(255,255,255,0.65))",
	"drop-shadow(0 0 18px rgba(139,92,246,0.95))",
	"drop-shadow(0 0 26px rgba(35,214,255,0.55))"
].join(" ");

const inactiveTradeFilter = [
	"brightness(0.92)",
	"saturate(0.95)",
	"drop-shadow(0 0 8px rgba(120,80,200,0.45))"
].join(" ");

const NavBackground = () => (
	<img
		src="/nav-icons/nav-bg2.webp"
		alt=""
		style={{
			position: "absolute",
			left: "50%",
			bottom: -8,
			transform: "translateX(-50%)",
			width: "100%",
			height: "100%",
			display: "block",
			objectFit: "cover",
			pointerEvents: "none"
		}}
	/>
);

const SideUnderline = ({ active, tone }) => {
	const t = toneStyles[tone];
	return (
		<div
			aria-hidden="true"
			style={{
				position: "absolute",
				left: 0,
				right: 0,
				bottom: 12,
				display: "flex",
				justifyContent: "center",
				opacity: active ? 1 : 0,
				transition: "opacity 180ms ease"
			}}
		>
			<span
				style={{
					width: 18,
					height: 3,
					borderRadius: 999,
					background: t.underline,
					boxShadow: t.underlineGlow
				}}
			/>
		</div>
	);
};

const SideNavItem = ({ icon, label, tone, active, onClick }) => {
	const t = toneStyles[tone];
	return (
		<button
			onClick={onClick}
			className="relative select-none"
			style={{ width: 60, height: 70 }}
			aria-label={label}
		>
			<div
				aria-hidden="true"
				style={{
					position: "absolute",
					left: 0,
					right: 0,
					top: 8,
					height: 24,
					display: "flex",
					alignItems: "center",
					justifyContent: "center"
				}}
			>
				<img
					src={navIcons[icon]}
					alt=""
					style={{
						width: 24,
						height: 24,
						display: "block",
						filter: active ? t.activeFilter : inactiveSideFilter,
						transition: "filter 180ms ease"
					}}
				/>
			</div>
			<div
				style={{
					...labelFont,
					position: "absolute",
					left: 0,
					right: 0,
					top: 36,
					height: 12,
					textAlign: "center",
					color: active ? t.activeColor : "rgba(190,200,235,0.55)",
					textShadow: active ? t.activeShadow : "none",
					transition: "color 180ms ease, text-shadow 180ms ease"
				}}
			>
				{label}
			</div>
			<SideUnderline active={active} tone={tone} />
		</button>
	);
};

const TradeNavItem = ({ active, onClick }) => (
	<button
		onClick={onClick}
		className="relative select-none"
		style={{ width: 70, height: 70 }}
		aria-label="Trade"
	>
		<div
			aria-hidden="true"
			style={{
				position: "absolute",
				left: "50%",
				top: -20,
				transform: "translateX(-50%)",
				width: 72,
				height: 72,
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			}}
		>
			<img
				src="/nav-trade-orb.png"
				alt=""
				style={{
					width: 72,
					height: 72,
					display: "block",
					filter: active ? activeTradeFilter : inactiveTradeFilter,
					transition: "filter 200ms ease, transform 200ms ease",
					transform: active ? "scale(1.04)" : "scale(1)"
				}}
			/>
		</div>
	</button>
);

export const BottomNav = ({ tab, setTab }) => (
	<div
		className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-end justify-center"
		style={{ width: "100%", maxWidth: 430, height: 88 }}
	>
		<div
			className="pointer-events-auto relative"
			style={{ width: "100%", height: 88, overflow: "visible" }}
		>
			<NavBackground />

			{/* Left cluster: hugs the flat raised section on the left */}
			<div
				className="absolute bottom-0 flex items-end"
				style={{ left: 8, gap: 4, zIndex: 10 }}
			>
				{sideItemsLeft.map((item) => (
					<SideNavItem
						key={item.icon}
						icon={item.icon}
						label={item.label}
						tone={item.tone}
						active={tab === item.icon}
						onClick={() => setTab(item.icon)}
					/>
				))}
			</div>

			{/* Trade orb seated in the center notch */}
			<div
				className="absolute bottom-1 left-1/2 -translate-x-1/2"
				style={{ zIndex: 11 }}
			>
				<TradeNavItem active={tab === "trade"} onClick={() => setTab("trade")} />
			</div>

			{/* Right cluster: hugs the flat raised section on the right */}
			<div
				className="absolute bottom-0 flex items-end"
				style={{ right: 8, gap: 4, zIndex: 10 }}
			>
				{sideItemsRight.map((item) => (
					<SideNavItem
						key={item.icon}
						icon={item.icon}
						label={item.label}
						tone={item.tone}
						active={tab === item.icon}
						onClick={() => setTab(item.icon)}
					/>
				))}
			</div>
		</div>
	</div>
);
