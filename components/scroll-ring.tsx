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
const RADIUS = 13.5;

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
			className="pointer-events-none absolute inset-0 z-10 size-full"
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
				// No drop-shadow here: the svg clips at its square bounds, so a
				// glow gets cut off and reads as a blue square behind the ring.
				style={{ strokeDashoffset: offset }}
			/>
		</svg>
	);
}
