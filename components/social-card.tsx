"use client";

import { AnimatePresence, motion } from "framer-motion";
import { FACES } from "@/components/social-faces";
import type { SocialAccount } from "@/lib/data";
import { EASE } from "@/lib/motion";

/** Bank card: 85.60 x 53.98 mm, corner radius 3.18 mm at 280px wide. */
const RATIO = "85.6 / 53.98";
const RADIUS = 11;

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
 * The card itself, at whatever width the caller sets: the face for this
 * platform (components/social-faces.tsx), the light on it, and a link over
 * the whole thing. The rail and the phone row both use it.
 */
export function SocialCardShell({
	account,
	className = "",
	focusable = false,
	swap = false,
}: {
	account: SocialAccount;
	className?: string;
	/** Whether the link over the card takes keyboard focus. */
	focusable?: boolean;
	/** Cross-fade between faces when the account changes. */
	swap?: boolean;
}) {
	const external = !account.href.startsWith("mailto:");
	const Face = FACES[account.id];

	const face = (
		<motion.div
			key={account.id}
			{...(swap ? FACE : {})}
			className="absolute inset-0"
			style={{ borderRadius: RADIUS }}
		>
			<Face account={account} />
		</motion.div>
	);

	return (
		<div
			className={`social-card relative select-none ${className}`}
			style={{ aspectRatio: RATIO, borderRadius: RADIUS }}
		>
			{swap ? (
				<AnimatePresence initial={false}>{face}</AnimatePresence>
			) : (
				face
			)}

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
				tabIndex={focusable ? 0 : -1}
				className="absolute inset-0 z-[5] outline-none focus-visible:ring-2 focus-visible:ring-ink/40 focus-visible:ring-offset-2 focus-visible:ring-offset-page"
				style={{ borderRadius: RADIUS }}
			/>
		</div>
	);
}

/**
 * The card beside the rail. It keeps its size and place while the pointer
 * moves along the rail; only the face changes.
 */
export function SocialCard({ account }: { account: SocialAccount }) {
	return (
		<motion.div {...CARD} id="social-card" role="tooltip">
			<SocialCardShell account={account} className="w-[280px]" swap />
		</motion.div>
	);
}
