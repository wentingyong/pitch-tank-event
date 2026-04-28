export const Icon = ({ name, size = 18, color = "currentColor", strokeWidth = 1.6, fill = "none", className = "" }) => {
	const s = size;
	const stroke = color;
	const props = {
		width: s,
		height: s,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke,
		strokeWidth,
		strokeLinecap: "round",
		strokeLinejoin: "round",
		className,
	};

	switch (name) {
		case "info":
			return (
				<svg {...props}>
					<circle cx="12" cy="12" r="9" />
					<path d="M12 8h.01" />
					<path d="M11 12h1v5h1" />
				</svg>
			);
		case "help":
			return (
				<svg {...props}>
					<circle cx="12" cy="12" r="9" />
					<path d="M9.5 9.2a2.5 2.5 0 0 1 4.9.6c0 1.6-2.4 1.7-2.4 3.4" />
					<path d="M12 17.2h.01" />
				</svg>
			);
		case "clock":
			return (
				<svg {...props}>
					<circle cx="12" cy="12" r="9" />
					<path d="M12 7v5l3 2" />
				</svg>
			);
		case "chart":
			return (
				<svg {...props}>
					<path d="M4 19V5" />
					<path d="M4 19h16" />
					<path d="M7 15l3-3 3 2 4-6" />
				</svg>
			);
		case "chev":
			return (
				<svg {...props}>
					<path d="M9 6l6 6-6 6" />
				</svg>
			);
		case "trophy":
			return (
				<svg {...props}>
					<path d="M8 4h8v3a4 4 0 0 1-8 0V4z" />
					<path d="M5 4h3v2a3 3 0 0 1-3-3V4z" transform="translate(0)" />
					<path d="M5 5H3v1a3 3 0 0 0 3 3" />
					<path d="M19 5h2v1a3 3 0 0 1-3 3" />
					<path d="M10 14h4" />
					<path d="M9 20h6" />
					<path d="M12 14v6" />
				</svg>
			);
		case "diamond":
			return (
				<svg {...props}>
					<path d="M6 4h12l3 5-9 11L3 9z" />
					<path d="M3 9h18" />
					<path d="M9 4l3 5 3-5" />
					<path d="M9 9l3 11 3-11" />
				</svg>
			);
		case "triangle-up":
			return (
				<svg width={s} height={s} viewBox="0 0 24 24" fill={stroke} className={className}>
					<path d="M12 6l8 12H4z" />
				</svg>
			);
		case "down":
			return (
				<svg {...props}>
					<path d="M6 10l6 6 6-6" />
				</svg>
			);
		case "sort":
			return (
				<svg {...props}>
					<path d="M7 5v14" />
					<path d="M4 8l3-3 3 3" />
					<path d="M17 19V5" />
					<path d="M14 16l3 3 3-3" />
				</svg>
			);
		case "search":
			return (
				<svg {...props}>
					<circle cx="11" cy="11" r="6" />
					<path d="M20 20l-3.5-3.5" />
				</svg>
			);
		default:
			return null;
	}
};
