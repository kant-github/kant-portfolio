"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { RiVolumeMuteFill, RiVolumeUpFill } from "react-icons/ri";
import { VerifiedBadge } from "@/components/verified-badge";
import { useSound } from "@/lib/sound";

const ICON_CLASS = "size-[15px] text-mute transition-colors";

export function NameBadge({ active }: { active: boolean }) {
	const prefersReducedMotion = useReducedMotion();
	const { muted, toggle } = useSound();

	const face = active ? (muted ? "muted" : "sound") : "verified";

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label={muted ? "Turn hover sound on" : "Turn hover sound off"}
			className={`group/badge relative inline-flex size-[17px] shrink-0 items-center justify-center ${
				active ? "cursor-pointer" : "pointer-events-none"
			}`}
		>
			<AnimatePresence initial={false} mode="wait">
				<motion.span
					key={face}
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
					transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
					className="absolute inset-0 flex items-center justify-center"
				>
					{face === "verified" ? <VerifiedBadge /> : null}
					{face === "sound" ? (
						<RiVolumeUpFill
							className={`${ICON_CLASS} group-hover/badge:text-ink`}
						/>
					) : null}
					{face === "muted" ? (
						<RiVolumeMuteFill
							className={`${ICON_CLASS} group-hover/badge:text-ink`}
						/>
					) : null}
				</motion.span>
			</AnimatePresence>
		</button>
	);
}
