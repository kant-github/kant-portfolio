"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import { useEffect } from "react";

/**
 * Measured directly rather than through framer's useScroll container
 * detection, which did not track the document reliably here. One passive
 * listener, written to a MotionValue, so no React render happens on scroll.
 */
export function ProgressBar() {
	const prefersReducedMotion = useReducedMotion();
	const raw = useMotionValue(0);

	useEffect(() => {
		const update = () => {
			const root = document.documentElement;
			const max = root.scrollHeight - root.clientHeight;

			raw.set(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 1);
		};

		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);

		return () => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, [raw]);

	const smooth = useSpring(raw, { stiffness: 160, damping: 30, mass: 0.3 });
	const progress = prefersReducedMotion ? raw : smooth;

	return (
		<div
			aria-hidden="true"
			className="fixed inset-x-0 top-0 z-50 h-0.5 bg-line/40"
		>
			<motion.div
				className="h-full origin-left bg-dock-progress"
				style={{ scaleX: progress }}
			/>
		</div>
	);
}
