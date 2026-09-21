import type { ReactNode } from "react";

/**
 * Shared pieces for the article diagrams.
 *
 * Every diagram is an inline SVG with a viewBox and no fixed pixel size, so it
 * scales in the 640px column and in a full-bleed Band. Colours come from the
 * theme tokens, so they sit correctly on the page background and change with it.
 */

export const INK = "var(--ink)";
export const MUTE = "var(--mute)";
export const LINE = "rgb(255 255 255 / 0.14)";
export const SURFACE = "rgb(255 255 255 / 0.045)";
export const ACCENT = "#2767ff";
export const WARN = "#e5893b";

export function Svg({
	viewBox,
	title,
	children,
}: {
	viewBox: string;
	title: string;
	children: ReactNode;
}) {
	return (
		<svg
			viewBox={viewBox}
			role="img"
			aria-label={title}
			className="block h-auto w-full"
			fontFamily="var(--font-geist-mono), ui-monospace, monospace"
		>
			<title>{title}</title>
			{children}
		</svg>
	);
}

export function Box({
	x,
	y,
	w,
	h,
	label,
	sub,
	tone = "plain",
}: {
	x: number;
	y: number;
	w: number;
	h: number;
	label: string;
	sub?: string;
	tone?: "plain" | "accent" | "warn";
}) {
	const stroke = tone === "accent" ? ACCENT : tone === "warn" ? WARN : LINE;

	return (
		<g>
			<rect
				x={x}
				y={y}
				width={w}
				height={h}
				rx={6}
				fill={SURFACE}
				stroke={stroke}
				strokeWidth={1}
			/>
			<text
				x={x + w / 2}
				y={sub ? y + h / 2 - 3 : y + h / 2 + 4}
				textAnchor="middle"
				fontSize={11}
				fill={INK}
			>
				{label}
			</text>
			{sub ? (
				<text
					x={x + w / 2}
					y={y + h / 2 + 12}
					textAnchor="middle"
					fontSize={9}
					fill={MUTE}
				>
					{sub}
				</text>
			) : null}
		</g>
	);
}

export function Arrow({
	x1,
	y1,
	x2,
	y2,
	tone = "plain",
	dashed = false,
	label,
}: {
	x1: number;
	y1: number;
	x2: number;
	y2: number;
	tone?: "plain" | "accent" | "warn";
	dashed?: boolean;
	label?: string;
}) {
	const stroke = tone === "accent" ? ACCENT : tone === "warn" ? WARN : MUTE;
	const midX = (x1 + x2) / 2;
	const midY = (y1 + y2) / 2;

	return (
		<g>
			<line
				x1={x1}
				y1={y1}
				x2={x2}
				y2={y2}
				stroke={stroke}
				strokeWidth={1.25}
				strokeDasharray={dashed ? "4 4" : undefined}
				markerEnd={`url(#head-${tone})`}
			/>
			{label ? (
				<text
					x={midX}
					y={midY - 6}
					textAnchor="middle"
					fontSize={9}
					fill={MUTE}
				>
					{label}
				</text>
			) : null}
		</g>
	);
}

/** Arrow heads have to be declared once per svg document. */
export function Heads() {
	return (
		<defs>
			{[
				["plain", MUTE],
				["accent", ACCENT],
				["warn", WARN],
			].map(([name, color]) => (
				<marker
					key={name}
					id={`head-${name}`}
					viewBox="0 0 8 8"
					refX={7}
					refY={4}
					markerWidth={6}
					markerHeight={6}
					orient="auto-start-reverse"
				>
					<path d="M 0 1 L 7 4 L 0 7 z" fill={color} />
				</marker>
			))}
		</defs>
	);
}

export function Caption({
	x,
	y,
	children,
	fill = MUTE,
	anchor = "middle",
}: {
	x: number;
	y: number;
	children: ReactNode;
	fill?: string;
	anchor?: "start" | "middle" | "end";
}) {
	return (
		<text x={x} y={y} textAnchor={anchor} fontSize={9} fill={fill}>
			{children}
		</text>
	);
}
