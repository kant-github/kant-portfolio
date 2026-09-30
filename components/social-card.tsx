"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FACES } from "@/components/social-faces";
import type { SocialAccount } from "@/lib/data";
import { EASE } from "@/lib/motion";

/** Bank card: 85.60 x 53.98 mm, corner radius 3.18 mm. */
const WIDTH = 280;
const HEIGHT = Math.round((WIDTH * 53.98) / 85.6);
const RADIUS = Math.round((WIDTH * 3.18) / 85.6);

/** The card slides out from the rail. */
const CARD = {
	initial: { opacity: 0, x: -10, scale: 0.97 },
	animate: { opacity: 1, x: 0, scale: 1 },
	exit: { opacity: 0, x: -6, scale: 0.98 },
	transition: { duration: 0.26, ease: EASE },
} as const;

/** Moving between icons swaps one face for the next, in place. */
const FACE = {
	initial: { opacity: 0 },
	animate: { opacity: 1 },
	exit: { opacity: 0 },
	transition: { duration: 0.22, ease: EASE },
} as const;

/**
 * The card beside the rail. The shell keeps its size and place while the
 * pointer moves along the rail; only the face (components/social-faces.tsx)
 * changes.
 */
export function SocialCard({ account }: { account: SocialAccount }) {
	const external = !account.href.startsWith("mailto:");
	const Face = FACES[account.id];

	return (
		<motion.div
			{...CARD}
			id="social-card"
			role="tooltip"
			style={{ width: WIDTH, height: HEIGHT, borderRadius: RADIUS }}
			className="social-card relative select-none"
		>
			<AnimatePresence initial={false}>
				<motion.div
					key={account.id}
					{...FACE}
					className="absolute inset-0"
					style={{ borderRadius: RADIUS }}
				>
					<Face account={account} />
				</motion.div>
			</AnimatePresence>

			{/* a soft light from the top-left, and one sweep across the face
			    as the card comes out */}
			<span
				aria-hidden="true"
				className="card-light"
				style={{ borderRadius: RADIUS }}
			/>

			<a
				href={account.href}
				target={external ? "_blank" : undefined}
				rel={external ? "noreferrer" : undefined}
				aria-label={`Open ${account.name}, ${account.handle}`}
				tabIndex={-1}
				className="absolute inset-0 z-[5]"
				style={{ borderRadius: RADIUS }}
			/>
		</motion.div>
	);
}
