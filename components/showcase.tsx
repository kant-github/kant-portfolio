"use client";

import Image from "next/image";
import { useCallback, useRef, useState, type CSSProperties } from "react";
import { CONTENT_INDEX } from "@/components/section";
import {
	ShowcaseLightbox,
	type CardRect,
} from "@/components/showcase-lightbox";
import { showcase } from "@/lib/data";

/**
 * A fanned deck of screenshots, the way perfolios.shwn.design does it.
 *
 * The geometry below is measured from that page rather than guessed, so the
 * resting fan is the same shape and the same size as the reference.
 *
 * Every card is identical and pinned to the middle of the deck. Nothing about
 * a card's box ever changes — only its transform — so the whole thing is one
 * animated property and the cards can never disagree about where they are.
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
function placeFor(
	index: number,
	focused: number | null,
	count: number,
): Place {
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
	const [open, setOpen] = useState<number | null>(null);
	const [focused, setFocused] = useState<number | null>(null);
	const cards = useRef<(HTMLButtonElement | null)[]>([]);

	/**
	 * Measured live rather than captured on click, so the lightbox flies from
	 * wherever the card actually is — and the cards move now.
	 */
	const getCardRect = useCallback((index: number): CardRect | null => {
		const card = cards.current[index];
		if (!card) return null;

		const rect = card.getBoundingClientRect();

		return {
			top: rect.top,
			left: rect.left,
			width: rect.width,
			height: rect.height,
			// a click always opens the card it is hovering, and that card has
			// already straightened up
			rotate: 0,
		};
	}, []);

	/** The middle card carries the name line while nothing is hovered. */
	const named = focused ?? Math.floor(middleOf(showcase.length));

	return (
		<>
			<div
				className="stage-item stage-soft flex flex-col gap-4"
				style={{ "--i": stageIndex } as CSSProperties}
			>
				{/* The cards are absolutely placed, so the deck needs its own
				    height. `--deck-scale` shrinks the whole fan on a phone rather
				    than restacking it — see `.deck` in globals.css. */}
				<div className="deck" onPointerLeave={() => setFocused(null)}>
					{showcase.map((shot, index) => {
						const at = placeFor(index, focused, showcase.length);

						return (
							<button
								// the src alone is not unique: the same shot can
								// appear twice in the deck
								key={`${shot.src}-${index}`}
								ref={(node) => {
									cards.current[index] = node;
								}}
								type="button"
								aria-label={`Open ${shot.name}`}
								onClick={() => setOpen(index)}
								onPointerEnter={() => setFocused(index)}
								onFocus={() => setFocused(index)}
								style={{
									zIndex: layerFor(index, showcase.length),
									// the scale sits before the offset so the whole
									// fan shrinks together, spacing included
									transform: `translate(-50%, -50%) scale(var(--deck-scale)) translate(${at.x}px, ${at.y}px) rotate(${at.tilt}deg)`,
								}}
								className="shot-frame deck-card w-[210px]"
							>
								<Image
									src={shot.src}
									alt={shot.alt}
									width={1200}
									height={900}
									sizes="210px"
									className="aspect-16/10 w-full rounded-[6.5px] object-cover object-top"
								/>
							</button>
						);
					})}
				</div>

				{/* the line is always present, so nothing jumps as the name changes */}
				<p className="text-center text-[15px] text-ink">
					{showcase[named]?.name}
				</p>
			</div>

			<ShowcaseLightbox
				items={showcase}
				index={open}
				getCardRect={getCardRect}
				onClose={() => setOpen(null)}
				onIndexChange={setOpen}
			/>
		</>
	);
}
