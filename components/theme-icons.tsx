"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { Theme } from "@/lib/theme";

export function SunIcon() {
	return (
		<svg viewBox="0 0 24 24" className="size-full" aria-hidden>
			<circle cx="12" cy="12" r="5" fill="currentColor" />
			<g
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
				fill="none"
			>
				<path d="M12 1.5v2.2M12 20.3v2.2M22.5 12h-2.2M3.7 12H1.5M19.42 4.58l-1.56 1.56M6.14 17.86l-1.56 1.56M19.42 19.42l-1.56-1.56M6.14 6.14L4.58 4.58" />
			</g>
		</svg>
	);
}

export function MoonIcon() {
	return (
		<svg viewBox="0 0 24 24" className="size-full" aria-hidden>
			<path
				fill="currentColor"
				d="M21.53 14.32a9.5 9.5 0 0 1-11.85-11.85a1 1 0 0 0-1.25-1.22A11 11 0 1 0 22.75 15.57a1 1 0 0 0-1.22-1.25"
			/>
		</svg>
	);
}

export function ThemeIcon({ theme }: { theme: Theme | null }) {
	const prefersReducedMotion = useReducedMotion();

	return (
		<span className="relative block size-4">
			<AnimatePresence initial={false}>
				{theme ? (
					<motion.span
						key={theme}
						initial={
							prefersReducedMotion
								? false
								: {
										rotate: -140,
										scale: 0.3,
										opacity: 0,
										filter: "blur(5px)",
									}
						}
						animate={{
							rotate: 0,
							scale: 1,
							opacity: 1,
							filter: "blur(0px)",
						}}
						exit={
							prefersReducedMotion
								? undefined
								: {
										rotate: 140,
										scale: 0.3,
										opacity: 0,
										filter: "blur(5px)",
									}
						}
						transition={{
							duration: 0.5,
							ease: [0.22, 1, 0.36, 1],
						}}
						className="absolute inset-0 block"
					>
						{theme === "dark" ? <SunIcon /> : <MoonIcon />}
					</motion.span>
				) : null}
			</AnimatePresence>
		</span>
	);
}
