"use client";

import {
	motion,
	useMotionValue,
	useReducedMotion,
	useSpring,
	useTransform,
} from "framer-motion";
import { useEffect } from "react";

const RADIUS = 8.5;

/** How far down the page the reader is, drawn as a ring that fills clockwise. */
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
			viewBox="0 0 24 24"
			className="size-6 shrink-0 -rotate-90"
			aria-hidden="true"
		>
			<circle
				cx="12"
				cy="12"
				r={RADIUS}
				fill="none"
				className="stroke-neutral-300 dark:stroke-neutral-600/70"
				strokeWidth={1.25}
			/>
			<motion.circle
				cx="12"
				cy="12"
				r={RADIUS}
				fill="none"
				stroke="#2667ff"
				strokeWidth={2}
				strokeLinecap="round"
				pathLength={1}
				strokeDasharray="1 1"
				style={{ strokeDashoffset: offset }}
			/>
		</svg>
	);
}
