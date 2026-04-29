import { useState } from 'react';

const NavItem = ({ icon, label, active, onClick }) => {
	const iconSrc = {
		rankings: "/nav-icons/ranking.svg",
		chat: "/nav-icons/chat.svg",
		network: "/nav-icons/network.svg",
		portfolio: "/nav-icons/portfolio.svg"
	}[icon];

	if (icon === "trade") {
		// Trade: glowing glass sphere - center of icon sits on the arc edge
		return (
			<button
				onClick={onClick}
				className="relative flex flex-col items-center select-none"
				style={{ flex: 1, paddingBottom: 10 }}
				aria-label={label}
			>
				{/* Glowing orb - positioned so center cuts the arc */}
				<div style={{
					marginBottom: -25,
					position: 'relative'
				}}>
					<img
						src="/nav-trade-orb.png"
						alt="Trade"
						style={{
							width: 60,
							height: 60,
							display: "block",
							filter: active ? "brightness(1.1)" : "brightness(0.95)"
						}}
					/>
				</div>
				{/* Spacer to align text with other items */}
				<div style={{ height: 38 }} />
				{/* Label - aligned with other nav items */}
				<div style={{
					fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
					fontSize: 11,
					fontWeight: 400,
					color: "#FFFFFF",
					textShadow: active ? "0 0 6px rgba(167,195,252,1)" : "none",
					marginBottom: 2
				}}>
					{label}
				</div>
				{/* Active underline - only shows when active */}
				{active && (
					<div style={{
						width: 24,
						height: 2,
						borderRadius: 1,
						background: "linear-gradient(90deg, #3B82F6 0%, #A855F7 100%)",
						boxShadow: "0 0 4px rgba(138,92,255,0.8)"
					}} />
				)}
			</button>
		);
	}

	// Side nav items (Rankings, Chat, Network, Portfolio)
	return (
		<button
			onClick={onClick}
			className="relative flex flex-col items-center justify-end select-none transition-all duration-200"
			style={{ flex: 1, paddingBottom: 10 }}
			aria-label={label}
		>
			{/* Icon */}
			<div style={{ marginBottom: 3 }}>
				<img
					src={iconSrc}
					alt={label}
					style={{
						width: 18,
						height: 18,
						display: "block",
						filter: active
							? "brightness(1.2) drop-shadow(0 0 2px rgba(255,255,255,0.6))"
							: "brightness(0.7) opacity(0.7)"
					}}
				/>
			</div>
			{/* Label */}
			<div style={{
				fontFamily: '"Inter Variable", Inter, system-ui, sans-serif',
				fontSize: 11,
				fontWeight: 400,
				color: active ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.7)",
				textShadow: active ? "0 0 3px rgba(255,255,255,0.4)" : "none"
			}}>
				{label}
			</div>
		</button>
	);
};

export const BottomNav = ({ tab, setTab }) => (
	<div
		className="fixed inset-x-0 bottom-0 z-30 pointer-events-none flex items-end justify-center"
		style={{ height: 100 }}
	>
		<div
			className="pointer-events-auto relative"
			style={{
				width: '100%',
				maxWidth: 390,
				height: 100,
				overflow: 'visible'
			}}
		>
			{/* Horizon glow arc - purple to blue gradient */}
			<img
				src="/nav-bg2.png"
				alt=""
				style={{
					position: "absolute",
					left: '50%',
					bottom: 0,
					transform: 'translateX(-50%)',
					width: '220%',
					height: 'auto',
					objectFit: 'contain',
					pointerEvents: "none"
				}}
			/>

			{/* Nav items container */}
			<div
				className="absolute inset-0 flex items-end justify-between"
				style={{
					paddingLeft: '10%',
					paddingRight: '10%',
					paddingBottom: 10,
					zIndex: 10
				}}
			>
				<NavItem icon="rankings" label="Rankings" active={tab === "rankings"} onClick={() => setTab("rankings")} />
				<NavItem icon="chat" label="Chat" active={tab === "chat"} onClick={() => setTab("chat")} />
				<NavItem icon="trade" label="Trade" active={tab === "trade"} onClick={() => setTab("trade")} />
				<NavItem icon="network" label="Network" active={tab === "network"} onClick={() => setTab("network")} />
				<NavItem icon="portfolio" label="Portfolio" active={tab === "portfolio"} onClick={() => setTab("portfolio")} />
			</div>
		</div>
	</div>
);
