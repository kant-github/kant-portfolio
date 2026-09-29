"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
	useCallback,
	useRef,
	useState,
	useSyncExternalStore,
	type CSSProperties,
} from "react";
import { CONTENT_INDEX } from "@/components/section";
import { ShowcaseLightbox } from "@/components/showcase-lightbox";
import { showcase } from "@/lib/data";
import { EASE } from "@/lib/motion";

/**
 * A fanned deck of screenshots, the way perfolios.shwn.design does it.
 *
 * The geometry below is measured from that page rather than guessed, so the
 * resting fan is the same shape and the same size as the reference.
 *
 * Every card is pinned to the middle of the deck and moved from there.
 *
 * The move is driven by framer motion values rather than a CSS transform
 * string, because each card is also a shared-layout element: it is the same
 * element that flies open into the lightbox. Framer's projection can only
 * subtract transforms it set itself, so a hand-written `transform` here would
 * be measured as part of the card and the flight would start in the wrong
 * place. See `.deck-card` in globals.css.
 */

/** Frame width, including the 5px border around the shot (see `.shot-frame`). */
const CARD = 210;
/** How far apart the cards sit at rest. */
const STEP = 75;
/** Fan angle per card, away from the middle. */
const TILT = 4.5;
/** How far the open card rises out of the deck. */
const LIFT = 16;

/**
 * Centre-to-centre distance that just clears the open card: two half-widths
 * and a small gap.
 */
const CLEAR = CARD + 8;
/** How tightly the cards that got out of the way stack behind each other. */
const PACK = 22;
/** Cards with no room to clear the open one only edge away from it. */
const PUSH = 20;

/**
 * How much smaller the whole fan is on a phone.
 *
 * This used to be a `scale()` inside each card's transform. It cannot be:
 * framer never sees a CSS transform, so it would measure the card at 210px
 * while it was really 147px on screen and the flight would land short. The
 * factor is applied to the numbers instead, and `.deck-card` / `.shot-frame`
 * size themselves off the matching `--deck-scale`.
 */
const SMALL = 0.7;
const WIDE = "(min-width: 640px)";

function watch(query: string) {
	return (onChange: () => void) => {
		const media = window.matchMedia(query);
		media.addEventListener("change", onChange);
		return () => media.removeEventListener("change", onChange);
	};
}

function reads(query: string) {
	return () => window.matchMedia(query).matches;
}

const subscribeWide = watch(WIDE);
const readWide = reads(WIDE);

function getServerSnapshot() {
	return true;
}

function middleOf(count: number) {
	return (count - 1) / 2;
}

/** Where card `index` sits when nothing is open: an even fan about the middle. */
function restX(index: number, count: number) {
	return (index - middleOf(count)) * STEP;
}

function restTilt(index: number, count: number) {
	return (index - middleOf(count)) * TILT;
}

/**
 * Fixed by the card's place in the fan, not by which card is open — the
 * reference never restacks. It does not need to: the cards that are not open
 * move far enough aside that the order stops mattering.
 */
function layerFor(index: number, count: number) {
	return Math.ceil(count / 2) - Math.abs(index - Math.floor(middleOf(count)));
}

/**
 * The name under the deck. It comes up out of a blur and leaves upwards, so a
 * swap reads as one name handing over to the next rather than two separate
 * fades.
 */
const NAME_ENTER = { opacity: 0, filter: "blur(4px)", y: 4 };
const NAME_REST = { opacity: 1, filter: "blur(0px)", y: 0 };
const NAME_LEAVE = {
	opacity: 0,
	filter: "blur(4px)",
	y: -4,
	// shorter than the entrance: sweeping across the deck leaves one layer
	// per card behind, and they need to clear faster than they arrive
	transition: { duration: 0.18, ease: EASE },
};
const NAME_TRAVEL = { duration: 0.28, ease: EASE };

/** The fan's own movement, kept at the feel the CSS transition had. */
const FAN = { duration: 0.5, ease: EASE };

type Place = { x: number; y: number; tilt: number };

/**
 * The open card straightens up and lifts, staying where it already was. The
 * rest get out of its way, towards whichever end of the deck they are already
 * nearest.
 *
 * The side holding more cards has room to clear the open card entirely, so it
 * packs tight beyond it. The shorter side has nowhere to go, so it only edges
 * outwards.
 */
function placeFor(index: number, focused: number | null, count: number): Place {
	if (focused === null) {
		return { x: restX(index, count), y: 0, tilt: restTilt(index, count) };
	}

	if (index === focused) {
		return { x: restX(index, count), y: -LIFT, tilt: 0 };
	}

	const side = index < focused ? -1 : 1;
	const before = focused;
	const after = count - focused - 1;
	const roomy = side === -1 ? before > after : after > before;
	const rank = Math.abs(index - focused);

	const x = roomy
		? restX(focused, count) + side * (CLEAR + PACK * (rank - 1))
		: restX(index, count) + side * PUSH;

	return { x, y: 0, tilt: restTilt(index, count) };
}

export function Showcase({
	stageIndex = CONTENT_INDEX,
}: {
	/** Its place in the section's reveal order. */
	stageIndex?: number;
}) {
	const isWide = useSyncExternalStore(
		subscribeWide,
		readWide,
		getServerSnapshot,
	);
	const k = isWide ? 1 : SMALL;

	const [open, setOpen] = useState<number | null>(null);
	const [focused, setFocused] = useState<number | null>(null);
	/**
	 * Closing puts the deck back to rest.
	 *
	 * The deck sits behind the backdrop while the lightbox is up, so it never
	 * sees the pointer leave — without this it stays fanned open around the
	 * card you opened, on a phone and on a desktop alike.
	 */
	const handleClose = useCallback(() => {
		setOpen(null);
		setFocused(null);
	}, []);

	return (
		<>
			<div
				className="stage-item stage-soft flex flex-col gap-4"
				style={{ "--i": stageIndex } as CSSProperties}
			>
				{/* The cards are absolutely placed, so the deck needs its own
				    height. On a phone the whole fan is smaller — a real size
				    change, not a scale; see `.deck` in globals.css. */}
				<div className="deck" onPointerLeave={() => setFocused(null)}>
					{showcase.map((shot, index) => {
						const at = placeFor(index, focused, showcase.length);

						return (
							<motion.button
								// The src alone is not unique — the same shot can
								// appear twice in the deck.
								//
								// The breakpoint is in the key on purpose. The
								// server has to guess a width, so the first
								// render is the desktop fan; without the
								// remount, framer would treat the correction to
								// the phone fan as a change to animate and
								// every phone load would slide into place.
								key={`${shot.src}-${index}-${isWide ? "w" : "n"}`}
								// the card and the opened frame are the same
								// element as far as framer is concerned, which is
								// what makes one morph into the other
								layoutId={`shot-${index}`}
								type="button"
								aria-label={`Open ${shot.name}`}
								onClick={() => setOpen(index)}
								onPointerEnter={() => setFocused(index)}
								// Keyboard focus only. The lightbox hands focus
								// back to the card it came from when it closes,
								// and a plain onFocus would take that as a
								// reason to fan the deck open again — the deck
								// would sit open until you hovered it.
								onFocus={(event) => {
									if (
										event.currentTarget.matches(
											":focus-visible",
										)
									) {
										setFocused(index);
									}
								}}
								// no entry animation: without this the cards
								// render stacked at the deck's centre and only
								// fan out once the first frame runs, which
								// reads as a flash on every load
								initial={false}
								// motion values, not a transform string: framer
								// has to own these to be able to subtract them
								// when it measures
								animate={{
									x: at.x * k,
									y: at.y * k,
									rotate: at.tilt,
								}}
								transition={FAN}
								style={{
									zIndex: layerFor(index, showcase.length),
								}}
								className="shot-frame deck-card"
							>
								<Image
									src={shot.src}
									alt={shot.alt}
									width={1200}
									height={900}
									sizes="210px"
									className="aspect-16/10 w-full rounded-[6.5px] object-cover object-top"
								/>
							</motion.button>
						);
					})}
				</div>

				{/* The name belongs to whichever card is open, so there is
				    nothing to say until one is. The box keeps its height
				    either way, so the page never jumps.

				    Both names are on top of each other while they swap — the
				    old one rises and blurs away as the new one comes up out of
				    a blur — which is why they are taken out of the flow. */}
				<div className="relative h-6">
					<AnimatePresence initial={false}>
						{focused === null ? null : (
							<motion.p
								// by index, not by name: two cards can share a
								// name, and that should still animate
								key={focused}
								initial={NAME_ENTER}
								animate={NAME_REST}
								exit={NAME_LEAVE}
								transition={NAME_TRAVEL}
								className="absolute inset-x-0 text-center text-sm font-medium text-ink"
							>
								{showcase[focused].name}
							</motion.p>
						)}
					</AnimatePresence>
				</div>
			</div>

			<ShowcaseLightbox
				items={showcase}
				index={open}
				onClose={handleClose}
				onIndexChange={setOpen}
			/>
		</>
	);
}
