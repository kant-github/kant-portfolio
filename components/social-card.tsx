"use client";

import {
	AnimatePresence,
	motion,
	useMotionTemplate,
	useReducedMotion,
	useSpring,
} from "framer-motion";
import {
	useCallback,
	useState,
	type CSSProperties,
	type PointerEvent,
} from "react";
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

/** How far a corner dips back under the pointer, in degrees. */
const MAX_TILT = 7;

/** How far the rim catch slides as the pointer crosses the card, in %. */
const CATCH_TRAVEL = 20;

const LIFT_SCALE = 1.015;

const SPRING = { stiffness: 260, damping: 22, mass: 0.7 };

/**
 * The card leans away from the pointer, like a card resting on something
 * soft: the corner under the pointer dips back and the far side lifts. The
 * rim light slides with it, and the shadow grows while the card is up. It
 * all springs back when the pointer leaves.
 */
function useTilt(enabled: boolean) {
	const reduced = useReducedMotion();
	const on = enabled && !reduced;

	const [tilting, setTilting] = useState(false);
	const rotateX = useSpring(0, SPRING);
	const rotateY = useSpring(0, SPRING);
	const scale = useSpring(1, SPRING);
	const lift = useSpring(0, SPRING);
	const catchX = useSpring(0, SPRING);

	const lx = useMotionTemplate`${catchX}%`;

	const onPointerMove = useCallback(
		(event: PointerEvent<HTMLElement>) => {
			if (!on) return;

			const rect = event.currentTarget.getBoundingClientRect();
			const px = (event.clientX - rect.left) / rect.width;
			const py = (event.clientY - rect.top) / rect.height;

			rotateY.set((px - 0.5) * 2 * MAX_TILT);
			rotateX.set((0.5 - py) * 2 * MAX_TILT);
			catchX.set((0.5 - px) * 2 * CATCH_TRAVEL);
			scale.set(LIFT_SCALE);
			lift.set(1);
			setTilting(true);
		},
		[on, rotateX, rotateY, catchX, scale, lift],
	);

	const onPointerLeave = useCallback(() => {
		rotateX.set(0);
		rotateY.set(0);
		catchX.set(0);
		scale.set(1);
		lift.set(0);
		setTilting(false);
	}, [rotateX, rotateY, catchX, scale, lift]);

	return {
		tilting: on && tilting,
		style: on
			? {
					rotateX,
					rotateY,
					scale,
					"--card-lift": lift,
					"--card-lx": lx,
					transformStyle: "preserve-3d" as const,
				}
			: undefined,
		handlers: on ? { onPointerMove, onPointerLeave } : {},
	};
}

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
	tilt = false,
}: {
	account: SocialAccount;
	className?: string;
	/** Whether the link over the card takes keyboard focus. */
	focusable?: boolean;
	/** Cross-fade between faces when the account changes. */
	swap?: boolean;
	/** Lean away from the pointer. Needs `perspective` on the parent. */
	tilt?: boolean;
}) {
	const external = !account.href.startsWith("mailto:");
	const Face = FACES[account.id];
	const lean = useTilt(tilt);

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
		<motion.div
			{...lean.handlers}
			data-face={account.id}
			className={`social-card relative select-none ${
				lean.tilting ? "is-tilting" : ""
			} ${className}`}
			style={
				{
					aspectRatio: RATIO,
					borderRadius: RADIUS,
					...lean.style,
				} as CSSProperties
			}
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
		</motion.div>
	);
}

/**
 * The card beside the rail. It keeps its size and place while the pointer
 * moves along the rail; only the face changes.
 */
export function SocialCard({ account }: { account: SocialAccount }) {
	return (
		<motion.div
			{...CARD}
			id="social-card"
			role="tooltip"
			style={{ perspective: 900 }}
		>
			<SocialCardShell
				account={account}
				className="w-[280px]"
				swap
				tilt
			/>
		</motion.div>
	);
}
