import React, { useState, useId } from 'react';

/* Generate a smooth SVG path from points using Catmull-Rom-ish bezier */
function smoothPath(points) {
	if (!points || points.length < 2) return "";
	const p = points;
	let d = `M ${p[0][0].toFixed(2)} ${p[0][1].toFixed(2)}`;
	for (let i = 0; i < p.length - 1; i++) {
		const p0 = p[i - 1] || p[i];
		const p1 = p[i];
		const p2 = p[i + 1];
		const p3 = p[i + 2] || p2;
		const cp1x = p1[0] + (p2[0] - p0[0]) / 6;
		const cp1y = p1[1] + (p2[1] - p0[1]) / 6;
		const cp2x = p2[0] - (p3[0] - p1[0]) / 6;
		const cp2y = p2[1] - (p3[1] - p1[1]) / 6;
		d += ` C ${cp1x.toFixed(2)} ${cp1y.toFixed(2)}, ${cp2x.toFixed(2)} ${cp2y.toFixed(2)}, ${p2[0].toFixed(2)} ${p2[1].toFixed(2)}`;
	}
	return d;
}

/* Map a numeric series to fitted points */
function fitSeries(values, w, h, padTop = 8, padBottom = 8, padLeft = 0, padRight = 0) {
	const lo = Math.min(...values);
	const hi = Math.max(...values);
	const range = hi - lo || 1;
	const innerW = w - padLeft - padRight;
	const innerH = h - padTop - padBottom;
	return values.map((v, i) => [
		padLeft + (i / (values.length - 1)) * innerW,
		padTop + (1 - (v - lo) / range) * innerH,
	]);
}

/* Big neon chart with hover tooltip, checkpoint dots, gradient line */
export const EventChart = ({ width = 358, height = 168, series, waypoints }) => {
	const W = width;
	const H = height;
	const padTop = 14;
	const padBottom = 26;
	const padLeft = 38;
	const padRight = 14;
	const [hoverIdx, setHoverIdx] = useState(null);

	const pts = fitSeries(series, W, H, padTop, padBottom, padLeft, padRight);
	const linePath = smoothPath(pts);
	const last = pts[pts.length - 1];

	// Area fill — extend to baseline
	const areaPath = `${linePath} L ${last[0].toFixed(2)} ${H - padBottom} L ${pts[0][0].toFixed(2)} ${H - padBottom} Z`;

	// Gridlines: 1200 / 1000 / 800
	const yLines = [
		{ label: "$1,200", t: 0.0 },
		{ label: "$1,000", t: 0.5 },
		{ label: "$800", t: 1.0 },
	];

	// Checkpoint dots at 30-min intervals matching waypoints
	const checkpoints = waypoints.map((wp) => {
		const idx = Math.round(wp.t * (series.length - 1));
		return { t: wp.t, x: pts[idx][0], y: pts[idx][1], value: series[idx] };
	});

	// Time axis labels
	const xLabels = ["6:00 PM", "6:30", "7:00", "7:30", "8:00"];

	// Mouse/touch interaction
	const handlePointerMove = (e) => {
		const svg = e.currentTarget;
		const rect = svg.getBoundingClientRect();
		const clientX = e.clientX || (e.touches && e.touches[0]?.clientX);
		if (!clientX) return;
		const x = ((clientX - rect.left) / rect.width) * W;
		// Find closest point
		let closest = 0;
		let minDist = Infinity;
		pts.forEach((p, i) => {
			const d = Math.abs(p[0] - x);
			if (d < minDist) {
				minDist = d;
				closest = i;
			}
		});
		setHoverIdx(closest);
	};

	const handlePointerLeave = () => setHoverIdx(null);

	// Active point: hover index if hovering, otherwise latest (last) point
	const activeIdx = hoverIdx !== null ? hoverIdx : series.length - 1;
	const activePoint = {
		x: pts[activeIdx][0],
		y: pts[activeIdx][1],
		value: series[activeIdx],
		idx: activeIdx,
	};
	const isLatest = hoverIdx === null;

	return (
		<svg
			width="100%"
			viewBox={`0 0 ${W} ${H}`}
			className="block"
			style={{ overflow: "visible" }}
			onPointerMove={handlePointerMove}
			onPointerLeave={handlePointerLeave}
			onTouchStart={handlePointerMove}
		>
			<defs>
				<linearGradient id="evt-line" x1="0" y1="0" x2="1" y2="0">
					<stop offset="0%" stopColor="#23D6FF" />
					<stop offset="50%" stopColor="#2A78FF" />
					<stop offset="100%" stopColor="#8A5CFF" />
				</linearGradient>
				<linearGradient id="evt-fill" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#2A78FF" stopOpacity="0.65" />
					<stop offset="55%" stopColor="#2A78FF" stopOpacity="0.18" />
					<stop offset="100%" stopColor="#2A78FF" stopOpacity="0" />
				</linearGradient>
				<linearGradient id="evt-vline" x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor="#2A78FF" stopOpacity="0" />
					<stop offset="20%" stopColor="#2A78FF" stopOpacity="0.35" />
					<stop offset="80%" stopColor="#2A78FF" stopOpacity="0.35" />
					<stop offset="100%" stopColor="#2A78FF" stopOpacity="0" />
				</linearGradient>
				<filter id="evt-glow" x="-30%" y="-100%" width="160%" height="320%">
					<feGaussianBlur stdDeviation="2" result="b1" />
					<feGaussianBlur stdDeviation="5" result="b2" />
					<feGaussianBlur stdDeviation="11" result="b3" />
					<feGaussianBlur stdDeviation="20" result="b4" />
					<feMerge>
						<feMergeNode in="b4" />
						<feMergeNode in="b3" />
						<feMergeNode in="b2" />
						<feMergeNode in="b1" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
				<filter id="evt-dot-glow" x="-200%" y="-200%" width="500%" height="500%">
					<feGaussianBlur stdDeviation="6" />
				</filter>
			</defs>

			{/* Grid lines + Y labels */}
			<g className="chart-grid">
				{yLines.map((g, i) => {
					const y = padTop + g.t * (H - padTop - padBottom);
					return (
						<g key={i}>
							<line x1={padLeft} x2={W - padRight} y1={y} y2={y} />
							<text
								x={padLeft - 8}
								y={y + 3}
								textAnchor="end"
								fontSize="9.5"
								fill="rgba(167,179,201,0.85)"
								fontFamily="Space Grotesk"
								className="num"
							>
								{g.label}
							</text>
						</g>
					);
				})}
			</g>

			{/* Area fill */}
			<path d={areaPath} fill="url(#evt-fill)" />

			{/* Line: gradient stroke with triple-stacked glow */}
			<path
				d={linePath}
				fill="none"
				stroke="url(#evt-line)"
				strokeWidth="3"
				strokeLinecap="round"
				strokeLinejoin="round"
				filter="url(#evt-glow)"
				opacity="0.95"
			/>
			<path d={linePath} fill="none" stroke="url(#evt-line)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
			<path d={linePath} fill="none" stroke="#FFFFFF" strokeOpacity="0.9" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />

			{/* Checkpoint dots (always visible, subtle) */}
			{checkpoints.map((cp, i) => {
				const colors = ["#23D6FF", "#23D6FF", "#2A78FF", "#8A5CFF", "#8A5CFF"];
				const color = colors[i] || "#2A78FF";
				return (
					<g key={`cp-${i}`}>
						<circle cx={cp.x} cy={cp.y} r="2.5" fill={color} opacity="0.5" />
						<circle cx={cp.x} cy={cp.y} r="5" fill={color} opacity="0.2" />
					</g>
				);
			})}

			{/* Vertical hover line (gradient fade top/bottom) */}
			{hoverIdx !== null && (
				<line
					x1={activePoint.x}
					x2={activePoint.x}
					y1={padTop}
					y2={H - padBottom}
					stroke="url(#evt-vline)"
					strokeWidth="1.5"
				/>
			)}

			{/* Active dot (latest with breathing animation, or hover position) */}
			<g className={isLatest ? "dot-pulse" : ""}>
				<circle cx={activePoint.x} cy={activePoint.y} r="14" fill="#23D6FF" opacity="0.55" filter="url(#evt-dot-glow)" />
				<circle cx={activePoint.x} cy={activePoint.y} r="9" fill="#23D6FF" opacity="0.30" />
				<circle cx={activePoint.x} cy={activePoint.y} r="4.6" fill="#0B1220" stroke="#E8FBFF" strokeWidth="1.8" />
				<circle cx={activePoint.x} cy={activePoint.y} r="2" fill="#E8FBFF" />
			</g>

			{/* Tooltip (only show when hovering) */}
			{hoverIdx !== null && (
				<g transform={`translate(${activePoint.x}, ${Math.max(activePoint.y - 32, 20)})`}>
					<rect
						x="-40"
						y="-26"
						width="80"
						height="24"
						rx="10"
						fill="rgba(11,18,32,0.98)"
						stroke="rgba(42,120,255,0.7)"
						strokeWidth="1"
						filter="url(#evt-dot-glow)"
					/>
					<text
						x="0"
						y="-16"
						textAnchor="middle"
						fontSize="9"
						fill="rgba(167,179,201,0.9)"
						fontFamily="Space Grotesk"
					>
						Mar 29
					</text>
					<text
						x="0"
						y="-4"
						textAnchor="middle"
						fontSize="12"
						fill="#E8FBFF"
						fontFamily="Space Grotesk"
						className="num"
						fontWeight="600"
					>
						${activePoint.value.toLocaleString("en-US", {
							minimumFractionDigits: 2,
							maximumFractionDigits: 2,
						})}
					</text>
				</g>
			)}

			{/* X labels */}
			{xLabels.map((label, i) => {
				const x = padLeft + (i / (xLabels.length - 1)) * (W - padLeft - padRight);
				return (
					<text
						key={i}
						x={x}
						y={H - 8}
						textAnchor="middle"
						fontSize="9.5"
						fill="rgba(167,179,201,0.8)"
						fontFamily="Space Grotesk"
						className="num"
					>
						{label}
					</text>
				);
			})}
		</svg>
	);
};

/* Sparkline — small inline trend chart */
export const Sparkline = ({ width = 110, height = 34, series, color = "#40F3C5", live = false }) => {
	const W = width;
	const H = height;
	const pts = fitSeries(series, W, H, 4, 6);
	const linePath = smoothPath(pts);
	const last = pts[pts.length - 1];
	const areaPath = `${linePath} L ${last[0].toFixed(2)} ${H} L ${pts[0][0].toFixed(2)} ${H} Z`;
	const id = useId();
	const fillId = `sf-${id}`;
	const glowId = `sg-${id}`;

	return (
		<svg
			width={W}
			height={H}
			viewBox={`0 0 ${W} ${H}`}
			className={live ? "spark-live" : ""}
			style={{ color, overflow: "visible" }}
		>
			<defs>
				<linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={color} stopOpacity="0.55" />
					<stop offset="100%" stopColor={color} stopOpacity="0" />
				</linearGradient>
				<filter id={glowId} x="-50%" y="-100%" width="200%" height="320%">
					<feGaussianBlur stdDeviation="2" result="b1" />
					<feGaussianBlur stdDeviation="5" result="b2" />
					<feMerge>
						<feMergeNode in="b2" />
						<feMergeNode in="b1" />
						<feMergeNode in="SourceGraphic" />
					</feMerge>
				</filter>
			</defs>
			<path d={areaPath} fill={`url(#${fillId})`} />
			<path
				d={linePath}
				stroke={color}
				strokeWidth="2"
				fill="none"
				filter={`url(#${glowId})`}
				strokeLinecap="round"
				strokeLinejoin="round"
				opacity="0.9"
			/>
			<path d={linePath} stroke={color} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
			<circle cx={last[0]} cy={last[1]} r="2.4" fill={color} />
			<circle cx={last[0]} cy={last[1]} r="6" fill={color} opacity="0.35" filter={`url(#${glowId})`} />
		</svg>
	);
};
