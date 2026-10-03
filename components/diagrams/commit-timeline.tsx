"use client";

import { animate, motion, useInView, useReducedMotion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { EASE } from "@/lib/motion";

/* Commits per day on bottle-nex/winterfell main, 9–31 Oct 2025 (git log). */
const COMMITS = [
	13, 11, 9, 23, 11, 3, 4, 12, 10, 9, 15, 6, 22, 6, 10, 32, 28, 5, 1, 6, 4, 24,
	0,
];
const TOTAL = COMMITS.reduce((sum, n) => sum + n, 0);
const START = new Date(Date.UTC(2025, 9, 9));

const MILESTONES = [
	{ day: 0, title: "Idea in class, repo live by 8:30 PM", anchor: "start" },
	{ day: 12, title: "First production deploy", anchor: "middle" },
	{ day: 22, title: "Hackathon demo", anchor: "end" },
] as const;

const W = 680;
const H = 300;
const X0 = 44;
const X1 = 636;
const STEP = (X1 - X0) / (COMMITS.length - 1);
const BAR_W = 14;
const BAR_BASE = 152;
const BAR_MAX = 104;
const TRACK_Y = 178;

const INK = "var(--ink)";
const MUTE = "var(--mute)";
const LINE = "var(--diagram-line)";
const ACCENT = "var(--color-tree-accent)";
const SANS = "var(--font-inter), system-ui, sans-serif";

function dayX(day: number) {
	return X0 + day * STEP;
}

function dayLabel(day: number) {
	const date = new Date(START.getTime() + day * 86_400_000);
	return `${date.getUTCDate()} ${date.toLocaleDateString("en-GB", { month: "short", timeZone: "UTC" })}`;
}

const peak = Math.max(...COMMITS);
const milestoneDays = new Set<number>(MILESTONES.map((m) => m.day));

/** Counts from 0 to the total once the chart is on screen. */
function useCount(on: boolean, to: number, still: boolean) {
	const [value, setValue] = useState(still ? to : 0);

	useEffect(() => {
		if (!on || still) return;
		const controls = animate(0, to, {
			duration: 1.4,
			delay: 0.5,
			ease: EASE,
			onUpdate: (v) => setValue(Math.round(v)),
		});
		return () => controls.stop();
	}, [on, to, still]);

	return value;
}

export function CommitTimeline() {
	const ref = useRef<SVGSVGElement>(null);
	const inView = useInView(ref, { once: true, margin: "-15% 0px -25% 0px" });
	const still = useReducedMotion() ?? false;
	const show = still || inView;
	const total = useCount(inView, TOTAL, still);

	const at = (t: number) => (still ? 0 : t);
	const dur = (t: number) => (still ? 0 : t);

	return (
		<svg
			ref={ref}
			viewBox={`0 0 ${W} ${H}`}
			role="img"
			aria-label={`Commits per day from 9 to 31 October 2025, ${TOTAL} in total, with the three milestones marked.`}
			className="block h-auto w-full"
			fontFamily="var(--font-geist-mono), ui-monospace, monospace"
		>
			<title>Winterfell: 23 days of commits</title>

			{/* readout */}
			<text x={X0} y={28} fontSize={11} fill={MUTE} letterSpacing="0.06em">
				COMMITS PER DAY
			</text>
			<text
				x={X1}
				y={30}
				fontSize={22}
				fontFamily={SANS}
				fontWeight={600}
				letterSpacing="-0.02em"
				textAnchor="end"
				fill={INK}
			>
				{total}
			</text>
			<text
				x={X1}
				y={46}
				fontSize={10}
				letterSpacing="0.06em"
				textAnchor="end"
				fill={MUTE}
			>
				COMMITS IN 23 DAYS
			</text>

			{/* peak guide */}
			<motion.line
				x1={X0}
				y1={BAR_BASE - BAR_MAX}
				x2={X1}
				y2={BAR_BASE - BAR_MAX}
				stroke={LINE}
				strokeDasharray="3 4"
				initial={{ opacity: 0 }}
				animate={show ? { opacity: 1 } : undefined}
				transition={{ duration: dur(0.4), delay: at(0.9) }}
			/>
			<motion.text
				x={X0}
				y={BAR_BASE - BAR_MAX - 6}
				fontSize={10}
				fill={MUTE}
				initial={{ opacity: 0 }}
				animate={show ? { opacity: 1 } : undefined}
				transition={{ duration: dur(0.4), delay: at(0.9) }}
			>
				peak {peak} · 24 Oct
			</motion.text>

			{/* bars */}
			{COMMITS.map((count, day) => {
				const h = Math.max(2, (count / peak) * BAR_MAX);
				const x = dayX(day) - BAR_W / 2;
				const hot = milestoneDays.has(day);

				return (
					<g key={day}>
						<title>{`${dayLabel(day)} · ${count} commit${count === 1 ? "" : "s"}`}</title>
						<motion.rect
							x={x}
							y={BAR_BASE - h}
							width={BAR_W}
							height={h}
							rx={2}
							fill={hot ? ACCENT : INK}
							fillOpacity={hot ? 0.9 : count === 0 ? 0.08 : 0.22}
							style={{ transformBox: "fill-box", transformOrigin: "bottom" }}
							initial={{ scaleY: 0 }}
							animate={show ? { scaleY: 1 } : undefined}
							transition={{
								duration: dur(0.55),
								delay: at(0.35 + day * 0.04),
								ease: EASE,
							}}
						/>
					</g>
				);
			})}

			{/* track */}
			<motion.line
				x1={X0}
				y1={TRACK_Y}
				x2={X1}
				y2={TRACK_Y}
				stroke={LINE}
				strokeWidth={1.5}
				strokeLinecap="round"
				initial={{ pathLength: 0 }}
				animate={show ? { pathLength: 1 } : undefined}
				transition={{ duration: dur(1), ease: EASE }}
			/>
			{COMMITS.map((_, day) => (
				<motion.line
					key={day}
					x1={dayX(day)}
					y1={TRACK_Y - 3}
					x2={dayX(day)}
					y2={TRACK_Y + 3}
					stroke={LINE}
					initial={{ opacity: 0 }}
					animate={show ? { opacity: 1 } : undefined}
					transition={{ duration: dur(0.3), delay: at(0.15 + day * 0.035) }}
				/>
			))}
			{[0, 7, 14].map((day) => (
				<motion.text
					key={day}
					x={dayX(day)}
					y={TRACK_Y + 20}
					fontSize={10}
					fill={MUTE}
					textAnchor={day === 0 ? "start" : "middle"}
					initial={{ opacity: 0 }}
					animate={show ? { opacity: 1 } : undefined}
					transition={{ duration: dur(0.3), delay: at(0.4 + day * 0.035) }}
				>
					{dayLabel(day)}
				</motion.text>
			))}
			<motion.text
				x={X1}
				y={TRACK_Y + 20}
				fontSize={10}
				fill={MUTE}
				textAnchor="end"
				initial={{ opacity: 0 }}
				animate={show ? { opacity: 1 } : undefined}
				transition={{ duration: dur(0.3), delay: at(1.2) }}
			>
				{dayLabel(22)}
			</motion.text>

			{/* milestones */}
			{MILESTONES.map((m, index) => {
				const x = dayX(m.day);
				const delay = at(1.1 + index * 0.25);

				return (
					<g key={m.day}>
						<motion.circle
							cx={x}
							cy={TRACK_Y}
							r={5}
							fill="none"
							stroke={ACCENT}
							strokeWidth={1.5}
							initial={{ r: 5, opacity: 0 }}
							animate={show ? { r: [5, 16], opacity: [0.7, 0] } : undefined}
							transition={{ duration: dur(0.9), delay, ease: "easeOut" }}
						/>
						<motion.circle
							cx={x}
							cy={TRACK_Y}
							r={5}
							fill="var(--page)"
							stroke={ACCENT}
							strokeWidth={2}
							style={{ transformBox: "fill-box", transformOrigin: "center" }}
							initial={{ scale: 0 }}
							animate={show ? { scale: 1 } : undefined}
							transition={{
								type: "spring",
								stiffness: 420,
								damping: 22,
								delay,
							}}
						/>
						<motion.line
							x1={x}
							y1={TRACK_Y + 8}
							x2={x}
							y2={TRACK_Y + 40}
							stroke={LINE}
							initial={{ pathLength: 0 }}
							animate={show ? { pathLength: 1 } : undefined}
							transition={{ duration: dur(0.4), delay: delay + 0.1, ease: EASE }}
						/>
						<motion.g
							initial={{ opacity: 0, y: 4 }}
							animate={show ? { opacity: 1, y: 0 } : undefined}
							transition={{ duration: dur(0.45), delay: delay + 0.25, ease: EASE }}
						>
							<text
								x={x}
								y={TRACK_Y + 58}
								fontSize={10}
								fill={ACCENT}
								letterSpacing="0.06em"
								textAnchor={m.anchor}
							>
								{dayLabel(m.day).toUpperCase()} · DAY {m.day + 1}
							</text>
							<text
								x={x}
								y={TRACK_Y + 76}
								fontSize={12.5}
								fontFamily={SANS}
								fontWeight={500}
								fill={INK}
								textAnchor={m.anchor}
							>
								{m.title}
							</text>
						</motion.g>
					</g>
				);
			})}
		</svg>
	);
}
