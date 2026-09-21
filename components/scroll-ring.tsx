"use client";

import {
	motion,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform,
} from "framer-motion";
import { useEffect } from "react";

const SIZE = 36;
const RADIUS = 15;

/**
 * Fills as the page scrolls and closes exactly at the bottom.
 *
 * Progress is measured directly rather than through useScroll's default
 * container detection, which did not track the document reliably here. One
 * passive listener, and the value is written to a MotionValue so no React
 * render happens while scrolling.
 *
 * The arc uses pathLength={1}, so the dash maths is a plain 0-to-1 value and
 * never depends on the circle's real circumference.
 */
export function ScrollRing() {
	const prefersReducedMotion = useReducedMotion();
	const raw = useMotionValue(0);

	useEffect(() => {
		const update = () => {
			const root = document.documentElement;
			const max = root.scrollHeight - root.clientHeight;

			raw.set(
				max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1,
			);
		};

		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);

		return () => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, [raw]);

	const smooth = useSpring(raw, {
		stiffness: 140,
		damping: 28,
		mass: 0.3,
		restDelta: 0.0005,
	});

	const progress = prefersReducedMotion ? raw : smooth;
	const offset = useTransform(progress, (value) => 1 - value);

	return (
		<svg
			viewBox={`0 0 ${SIZE} ${SIZE}`}
			className="pointer-events-none absolute inset-0 size-full"
			aria-hidden="true"
		>
			<circle
				cx={SIZE / 2}
				cy={SIZE / 2}
				r={RADIUS}
				fill="none"
				stroke="var(--color-dock-track)"
				strokeWidth={2}
			/>
			<motion.circle
				cx={SIZE / 2}
				cy={SIZE / 2}
				r={RADIUS}
				fill="none"
				stroke="var(--color-dock-progress)"
				strokeWidth={2}
				strokeLinecap="round"
				pathLength={1}
				strokeDasharray="1 1"
				transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
				// A tight glow on a 30px arc — enough to read as lit, cheap
				// enough that it costs nothing at this size.
				style={{
					strokeDashoffset: offset,
					filter: "drop-shadow(0 0 4px rgb(59 130 246 / 0.85))",
				}}
			/>
		</svg>
	);
}
