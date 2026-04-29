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

function getNiceDomain(values, anchor = 1000) {
	const lo = Math.min(...values, anchor);
	const hi = Math.max(...values, anchor);
	const rawRange = Math.max(hi - lo, 1);
	const steps = [25, 50, 100, 200, 250, 500, 1000, 2000, 5000];
	const step = steps.find((s) => s >= rawRange / 2) || steps[steps.length - 1];
	const min = Math.floor(lo / step) * step;
	const max = Math.ceil(hi / step) * step;
	const ticks = [];
	for (let value = max; value >= min; value -= step) {
		ticks.push(value);
	}
	if (anchor >= min && anchor <= max && !ticks.includes(anchor)) {
		ticks.push(anchor);
		ticks.sort((a, b) => b - a);
	}
	return { min, max, step, ticks };
}

/* Map a numeric series to fitted points */
function fitSeries(values, w, h, padTop = 8, padBottom = 8, padLeft = 0, padRight = 0, domain) {
	const lo = domain?.min ?? Math.min(...values);
	const hi = domain?.max ?? Math.max(...values);
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
	const padTop = 16;
	const padBottom = 32;
	const padLeft = 44;
	const padRight = 16;
	const [hoverIdx, setHoverIdx] = useState(null);

	const domain = getNiceDomain(series, 1000);
	const pts = fitSeries(series, W, H, padTop, padBottom, padLeft, padRight, domain);
	const linePath = smoothPath(pts);
	const last = pts[pts.length - 1];
	const plotLeft = padLeft;
	const plotRight = W - padRight;
	const plotTop = padTop;
	const plotBottom = H - padBottom;
	const plotW = plotRight - plotLeft;
	const plotH = plotBottom - plotTop;
	const valueToY = (value) => plotTop + (1 - (value - domain.min) / (domain.max - domain.min || 1)) * plotH;

	// Area fill — extend to baseline
	const areaPath = `${linePath} L ${last[0].toFixed(2)} ${plotBottom} L ${pts[0][0].toFixed(2)} ${plotBottom} Z`;

	const yLines = domain.ticks.map((value) => ({
		value,
		label: `$${value.toLocaleString("en-US")}`,
		y: valueToY(value),
		isAnchor: value === 1000,
	}));

	// Checkpoint dots at 30-min intervals matching waypoints
	const checkpoints = waypoints.map((wp) => {
		const idx = Math.round(wp.t * (series.length - 1));
		return { t: wp.t, x: pts[idx][0], y: pts[idx][1], value: series[idx] };
	});

	// Time axis labels
	const xLabels = ["6:00 PM", "6:30", "7:00", "7:30", "8:00"];
	const xTicks = xLabels.map((label, i) => ({
		label,
		x: plotLeft + (i / (xLabels.length - 1)) * plotW,
	}));

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
	const activeTickIdx = Math.round((activeIdx / (series.length - 1)) * (xTicks.length - 1));
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
				{yLines.map((g) => (
					<g key={g.value}>
						<line
							x1={plotLeft}
							x2={plotRight}
							y1={g.y}
							y2={g.y}
							stroke={g.isAnchor ? "rgba(232,251,255,0.34)" : "rgba(167,179,201,0.18)"}
							strokeWidth={g.isAnchor ? "1.2" : "1"}
							strokeDasharray={g.isAnchor ? "5 7" : "2 7"}
							strokeLinecap="round"
						/>
						<line
							x1={plotLeft - 4}
							x2={plotLeft}
							y1={g.y}
							y2={g.y}
							stroke={g.isAnchor ? "rgba(232,251,255,0.72)" : "rgba(167,179,201,0.45)"}
							strokeWidth="1.1"
						/>
						<text
							x={plotLeft - 10}
							y={g.y + 3}
							textAnchor="end"
							fontSize="9.5"
							fill={g.isAnchor ? "rgba(232,251,255,0.95)" : "rgba(167,179,201,0.82)"}
							fontFamily="Tomorrow, system-ui, sans-serif"
							className="num"
							fontWeight={g.isAnchor ? "600" : "400"}
						>
							{g.label}
						</text>
					</g>
				))}
				{xTicks.map((tick) => (
					<line
						key={`xtick-${tick.label}`}
						x1={tick.x}
						x2={tick.x}
						y1={plotBottom}
						y2={plotBottom + 4}
						stroke="rgba(167,179,201,0.45)"
						strokeWidth="1"
					/>
				))}
			</g>

			{/* Area fill */}
			<path d={areaPath} fill="url(#evt-fill)" />

			{/* Moving crosshair tied to the active point */}
			<g opacity={hoverIdx !== null ? "1" : "0.78"}>
				<line
					x1={activePoint.x}
					x2={activePoint.x}
					y1={plotTop}
					y2={plotBottom}
					stroke="url(#evt-vline)"
					strokeWidth="1.5"
				/>
				<line
					x1={plotLeft}
					x2={plotRight}
					y1={activePoint.y}
					y2={activePoint.y}
					stroke="rgba(35,214,255,0.34)"
					strokeWidth="1.3"
					strokeDasharray="4 6"
					strokeLinecap="round"
				/>
				<line
					x1={activePoint.x}
					x2={activePoint.x}
					y1={plotBottom}
					y2={plotBottom + 7}
					stroke="rgba(232,251,255,0.82)"
					strokeWidth="1.2"
				/>
				<line
					x1={plotLeft - 7}
					x2={plotLeft}
					y1={activePoint.y}
					y2={activePoint.y}
					stroke="rgba(232,251,255,0.82)"
					strokeWidth="1.2"
				/>
				{hoverIdx !== null && (
					<text
						x={plotLeft - 10}
						y={Math.min(Math.max(activePoint.y + 3, plotTop + 4), plotBottom - 2)}
						textAnchor="end"
						fontSize="9.5"
						fill="#E8FBFF"
						fontFamily="Tomorrow, system-ui, sans-serif"
						className="num"
						fontWeight="600"
					>
						${Math.round(activePoint.value).toLocaleString("en-US")}
					</text>
				)}
			</g>

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
						fontFamily="Tomorrow, system-ui, sans-serif"
					>
						Mar 29
					</text>
					<text
						x="0"
						y="-4"
						textAnchor="middle"
						fontSize="12"
						fill="#E8FBFF"
						fontFamily="Tomorrow, system-ui, sans-serif"
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
			{xTicks.map((tick, i) => {
				const isActive = i === activeTickIdx;
				return (
					<g key={tick.label}>
						{isActive && (
							<rect
								x={tick.x - 22}
								y={H - 20}
								width="44"
								height="15"
								rx="7.5"
								fill="rgba(35,214,255,0.12)"
								stroke="rgba(35,214,255,0.28)"
							/>
						)}
						<text
							x={tick.x}
							y={H - 9}
							textAnchor="middle"
							fontSize="9.5"
							fill={isActive ? "#E8FBFF" : "rgba(167,179,201,0.8)"}
							fontFamily="Tomorrow, system-ui, sans-serif"
							className="num"
							fontWeight={isActive ? "600" : "400"}
						>
							{tick.label}
						</text>
					</g>
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

/* Expanded trend chart with axes for founder detail cards */
export const ExpandedSparkline = ({ width = 358, height = 74, series, color = "#40F3C5", live = false }) => {
	const W = width;
	const H = height;
	const padTop = 8;
	const padBottom = 20;
	const padLeft = 30;
	const padRight = 8;
	const domain = getNiceDomain(series, 0);
	const pts = fitSeries(series, W, H, padTop, padBottom, padLeft, padRight, domain);
	const linePath = smoothPath(pts);
	const last = pts[pts.length - 1];
	const plotLeft = padLeft;
	const plotRight = W - padRight;
	const plotBottom = H - padBottom;
	const plotH = H - padTop - padBottom;
	const valueToY = (value) => padTop + (1 - (value - domain.min) / (domain.max - domain.min || 1)) * plotH;
	const areaPath = `${linePath} L ${last[0].toFixed(2)} ${plotBottom} L ${pts[0][0].toFixed(2)} ${plotBottom} Z`;
	const id = useId();
	const fillId = `ef-${id}`;
	const glowId = `eg-${id}`;
	const yTicks = [domain.max, Math.round((domain.max + domain.min) / 2), domain.min];
	const xLabels = ["6:00 PM", "6:30", "7:00", "7:30", "8:00"];

	return (
		<svg
			width="100%"
			viewBox={`0 0 ${W} ${H}`}
			className={live ? "spark-live block" : "block"}
			style={{ color, overflow: "visible" }}
		>
			<defs>
				<linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
					<stop offset="0%" stopColor={color} stopOpacity="0.50" />
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

			<g className="chart-grid">
				{yTicks.map((value) => {
					const y = valueToY(value);
					return (
						<g key={`y-${value}`}>
							<line
								x1={plotLeft}
								x2={plotRight}
								y1={y}
								y2={y}
								stroke="rgba(167,179,201,0.16)"
								strokeDasharray="2 7"
								strokeLinecap="round"
							/>
							<line
								x1={plotLeft - 4}
								x2={plotLeft}
								y1={y}
								y2={y}
								stroke="rgba(167,179,201,0.42)"
							/>
							<text
								x={plotLeft - 8}
								y={y + 3}
								textAnchor="end"
								fontSize="8"
								fill="rgba(167,179,201,0.72)"
								fontFamily="Tomorrow, system-ui, sans-serif"
								className="num"
							>
								{value}
							</text>
						</g>
					);
				})}
				{xLabels.map((label, i) => {
					const x = plotLeft + (i / (xLabels.length - 1)) * (plotRight - plotLeft);
					return (
						<g key={label}>
							<line
								x1={x}
								x2={x}
								y1={plotBottom}
								y2={plotBottom + 4}
								stroke="rgba(167,179,201,0.38)"
							/>
							<text
								x={x}
								y={H - 5}
								textAnchor="middle"
								fontSize="8"
								fill="rgba(167,179,201,0.72)"
								fontFamily="Tomorrow, system-ui, sans-serif"
								className="num"
							>
								{label}
							</text>
						</g>
					);
				})}
			</g>

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
			<path d={linePath} stroke={color} strokeWidth="1.35" fill="none" strokeLinecap="round" strokeLinejoin="round" />
			<circle cx={last[0]} cy={last[1]} r="2.4" fill={color} />
			<circle cx={last[0]} cy={last[1]} r="6" fill={color} opacity="0.35" filter={`url(#${glowId})`} />
		</svg>
	);
};
