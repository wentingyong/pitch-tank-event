const navIcons = {
	rankings: "/nav-icons/ranking.svg",
	chat: "/nav-icons/chat.svg",
	network: "/nav-icons/network.svg",
	portfolio: "/nav-icons/portfolio.svg"
};

const navItems = [
	{ icon: "rankings", label: "Rankings" },
	{ icon: "chat", label: "Chat" },
	{ icon: "trade", label: "Trade" },
	{ icon: "network", label: "Network" },
	{ icon: "portfolio", label: "Portfolio" }
];

const labelFont = {
	fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
	fontSize: 11,
	fontWeight: 400,
	lineHeight: 1.1
};

const activeSideIconFilter = [
	"brightness(1.7)",
	"saturate(1.35)",
	"drop-shadow(0 0 2px rgba(255,255,255,0.95))",
	"drop-shadow(0 0 8px rgba(40,146,255,1))",
	"drop-shadow(0 0 16px rgba(59,130,246,0.72))"
].join(" ");

const inactiveSideIconFilter = [
	"brightness(0.66)",
	"saturate(0.82)",
	"opacity(0.72)",
	"drop-shadow(0 0 2px rgba(111,126,210,0.24))"
].join(" ");

const activeTradeFilter = [
	"brightness(1.18)",
	"saturate(1.18)",
	"drop-shadow(0 0 6px rgba(255,255,255,0.62))",
	"drop-shadow(0 0 18px rgba(139,92,246,0.92))",
	"drop-shadow(0 0 24px rgba(35,214,255,0.55))"
].join(" ");

const inactiveTradeFilter = "brightness(0.82) saturate(0.9) opacity(0.86)";

const ArcBackground = () => (
	<img
		src="/nav-bg2.png"
		alt=""
		style={{
			position: "absolute",
			left: "50%",
			bottom: 0,
			transform: "translateX(-50%)",
			width: "100%",
			height: "110%",
			display: "block",
			objectFit: "cover",
			pointerEvents: "none"
		}}
	/>
);

const ActiveUnderline = ({ variant = "side", active }) => {
	const isTrade = variant === "trade";
	return (
		<div
			aria-hidden="true"
			style={{
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				gap: isTrade ? 5 : 0,
				position: "absolute",
				left: 0,
				right: 0,
				bottom: 9,
				height: 8,
				opacity: active ? 1 : 0,
				transition: "opacity 180ms ease"
			}}
		>
			{isTrade && (
				<span
					style={{
						width: 5,
						height: 5,
						borderRadius: 999,
						background: "#7AB8FF",
						boxShadow: "0 0 7px rgba(80,150,255,1), 0 0 14px rgba(80,150,255,0.72)"
					}}
				/>
			)}
			<span
				style={{
					width: isTrade ? 30 : 25,
					height: 4,
					borderRadius: 999,
					background: isTrade
						? "linear-gradient(90deg, #78C8FF 0%, #7D72FF 46%, #FF73F3 100%)"
						: "linear-gradient(90deg, #6FE5FF 0%, #BFFFFF 52%, #6FE5FF 100%)",
					boxShadow: isTrade
						? "0 0 7px rgba(112,183,255,0.95), 0 0 12px rgba(255,96,239,0.78)"
						: "0 0 7px rgba(90,205,255,1), 0 0 15px rgba(59,130,246,0.86)"
				}}
			/>
		</div>
	);
};

const SideNavItem = ({ icon, label, active, onClick }) => (
	<button
		onClick={onClick}
		className="relative select-none"
		style={{ flex: 1, minWidth: 0, height: 100 }}
		aria-label={label}
	>
		<div
			aria-hidden="true"
			style={{
				position: "absolute",
				left: 0,
				right: 0,
				bottom: 34,
				width: 32,
				height: 32,
				marginLeft: "auto",
				marginRight: "auto",
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			}}
		>
			<img
				src={navIcons[icon]}
				alt=""
				style={{
					width: 30,
					height: 30,
					display: "block",
					filter: active ? activeSideIconFilter : inactiveSideIconFilter,
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
				bottom: 20,
				height: 13,
				textAlign: "center",
				color: active ? "#FFFFFF" : "rgba(185,190,232,0.66)",
				textShadow: active
					? "0 0 5px rgba(255,255,255,0.82), 0 0 13px rgba(51,136,255,0.78)"
					: "none",
				transition: "color 180ms ease, text-shadow 180ms ease"
			}}
		>
			{label}
		</div>
		<ActiveUnderline active={active} />
	</button>
);

const TradeNavItem = ({ label, active, onClick }) => (
	<button
		onClick={onClick}
		className="relative select-none"
		style={{ flex: 1, minWidth: 0, height: 100 }}
		aria-label={label}
	>
		<div
			aria-hidden="true"
			style={{
				position: "absolute",
				left: 0,
				right: 0,
				bottom: 46,
				width: 66,
				height: 66,
				marginLeft: "auto",
				marginRight: "auto",
				display: "flex",
				alignItems: "center",
				justifyContent: "center"
			}}
		>
			<img
				src="/nav-trade-orb.png"
				alt=""
				style={{
					width: 66,
					height: 66,
					display: "block",
					filter: active ? activeTradeFilter : inactiveTradeFilter,
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
				bottom: 23,
				height: 13,
				textAlign: "center",
				color: active ? "#FFFFFF" : "rgba(184,196,255,0.74)",
				textShadow: active
					? "0 0 5px rgba(255,255,255,0.92), 0 0 12px rgba(139,92,246,0.78)"
					: "none",
				transition: "color 180ms ease, text-shadow 180ms ease"
			}}
		>
			{label}
		</div>
		<ActiveUnderline variant="trade" active={active} />
	</button>
);

const NavItem = ({ icon, label, active, onClick }) => {
	if (icon === "trade") {
		return <TradeNavItem label={label} active={active} onClick={onClick} />;
	}

	return <SideNavItem icon={icon} label={label} active={active} onClick={onClick} />;
};

export const BottomNav = ({ tab, setTab }) => (
	<div
		className="fixed bottom-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none flex items-end justify-center"
		style={{ width: "100%", maxWidth: 430, height: 100 }}
	>
		<div
			className="pointer-events-auto relative"
			style={{
				width: "100%",
				height: 100,
				overflow: "visible"
			}}
		>
			<ArcBackground />

			<div
				className="absolute inset-0 flex items-end justify-between"
				style={{
					paddingLeft: "10%",
					paddingRight: "10%",
					zIndex: 10
				}}
			>
				{navItems.map((item) => (
					<NavItem
						key={item.icon}
						icon={item.icon}
						label={item.label}
						active={tab === item.icon}
						onClick={() => setTab(item.icon)}
					/>
				))}
			</div>
		</div>
	</div>
);
