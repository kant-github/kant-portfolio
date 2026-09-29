"use client";

import { AnimatePresence, animate, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
	RiArrowLeftSLine,
	RiArrowRightSLine,
	RiArrowRightUpLine,
	RiCloseLine,
} from "react-icons/ri";
import type { Shot } from "@/lib/data";
import { closeOverlay, openOverlay } from "@/lib/overlay-state";

/**
 * The backdrop fades all the way in, and its tint lives in the background
 * colour instead (`bg-page/70`).
 *
 * It has to be that way round. An opaque background on a half-opaque element
 * paints straight over the blurred layer underneath it, so the blur does
 * nothing and the page behind shows through sharp — which is exactly what the
 * first attempt looked like.
 */
const BACKDROP = 1;
const TRAVEL = { duration: 0.44, ease: [0.22, 1, 0.36, 1] as const };

/**
 * The caption leaves far faster than the picture does. It is not travelling
 * anywhere — it has no card to fly back to — so holding it on screen for the
 * whole return flight just looks like it was forgotten.
 */
const META_IN = {
	duration: 0.3,
	ease: [0.22, 1, 0.36, 1] as const,
	delay: 0.14,
};
const META_OUT = { duration: 0.12, ease: [0.4, 0, 1, 1] as const };
const META_HIDDEN = { opacity: 0, transform: "translateY(6px)" };
const META_SHOWN = { opacity: 1, transform: "translateY(0px)" };

const FOCUSABLE =
	'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

function useScrollLock(active: boolean) {
	useEffect(() => {
		if (!active) return;

		const { body, documentElement: root } = document;
		const gap = window.innerWidth - root.clientWidth;
		const previous = {
			overflow: body.style.overflow,
			paddingRight: body.style.paddingRight,
		};

		body.style.overflow = "hidden";
		if (gap > 0) body.style.paddingRight = `${gap}px`;

		return () => {
			body.style.overflow = previous.overflow;
			body.style.paddingRight = previous.paddingRight;
		};
	}, [active]);
}

export function ShowcaseLightbox({
	items,
	index,
	onClose,
	onIndexChange,
}: {
	items: Shot[];
	index: number | null;
	onClose: () => void;
	onIndexChange: (next: number) => void;
}) {
	const [mounted, setMounted] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);
	const metaRef = useRef<HTMLDivElement>(null);

	useEffect(() => setMounted(true), []);

	const open = index !== null;
	useScrollLock(open);

	useEffect(() => {
		if (!open) return;

		openOverlay();
		document.documentElement.dataset.overlay = "open";

		return () => {
			closeOverlay();
			delete document.documentElement.dataset.overlay;
		};
	}, [open]);

	useEffect(() => {
		if (!open) return;

		const opener = document.activeElement;

		return () => {
			if (opener instanceof HTMLElement) opener.focus();
		};
	}, [open]);

	/**
	 * The caption is the only thing driven by hand here.
	 *
	 * The picture is not animated in this file at all. It shares a `layoutId`
	 * with the deck card, so framer measures both boxes and morphs one into
	 * the other — animating width and height separately and scale-correcting
	 * as it goes.
	 */
	useEffect(() => {
		if (index === null) return;

		const meta = metaRef.current;
		if (!meta) return;

		const caption = animate(meta, META_SHOWN, META_IN);
		return () => caption.stop();
		// Only on open: the arrows swap the picture inside a frame that is
		// already in place.
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open]);

	/**
	 * Closes at once.
	 *
	 * Unmounting is what hands the picture back to framer to fly home, so
	 * anything awaited here is dead time on screen. The previous version
	 * awaited the backdrop fade first — 440ms of nothing moving, and then the
	 * picture flew home over a page that had already gone bare.
	 *
	 * The backdrop now fades in parallel, through its own AnimatePresence.
	 */
	const requestClose = useCallback(() => {
		if (index === null) return;
		onClose();
	}, [index, onClose]);

	const step = useCallback(
		(delta: number) => {
			if (index === null) return;
			onIndexChange((index + delta + items.length) % items.length);
		},
		[index, items.length, onIndexChange],
	);

	useEffect(() => {
		if (!open) return;

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") {
				event.preventDefault();
				void requestClose();
				return;
			}

			if (event.key === "ArrowLeft") {
				event.preventDefault();
				step(-1);
				return;
			}

			if (event.key === "ArrowRight") {
				event.preventDefault();
				step(1);
				return;
			}

			if (event.key !== "Tab") return;

			const stops =
				panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
			if (!stops || stops.length === 0) return;

			const first = stops[0];
			const last = stops[stops.length - 1];

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, requestClose, step]);

	useEffect(() => {
		if (!open) return;

		const stops =
			panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
		stops?.[0]?.focus();
	}, [open]);

	if (!mounted) return null;

	const shot = index === null ? null : items[index];

	return createPortal(
		<>
			{/* Its own presence, on its own layer. The panel below unmounts the
			    instant you close so the picture can start flying home, and the
			    backdrop stays behind to fade out alongside it. */}
			<AnimatePresence>
				{open ? (
					<motion.button
						key="backdrop"
						type="button"
						aria-label="Close"
						tabIndex={-1}
						initial={{ opacity: 0 }}
						animate={{ opacity: BACKDROP }}
						exit={{ opacity: 0 }}
						transition={TRAVEL}
						onClick={requestClose}
						// Off the moment it starts leaving. It is still on
						// screen while it fades, and a full-screen button at
						// zero opacity would otherwise swallow every click on
						// the page behind it.
						style={{ pointerEvents: open ? "auto" : "none" }}
						className="fixed inset-0 z-[59] cursor-default bg-page/70 backdrop-blur-xl"
					/>
				) : null}
			</AnimatePresence>

			{shot && index !== null ? (
				<div
					key="lightbox"
					// lets a click outside the panel reach the backdrop below
					className="pointer-events-none fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
				>
					<div
						ref={panelRef}
						role="dialog"
						aria-modal="true"
						aria-labelledby="showcase-title"
						className="pointer-events-auto relative flex w-full max-w-lg flex-col gap-4"
					>
						<motion.div
							// the same id the deck card carries: framer treats
							// them as one element and morphs between them
							layoutId={`shot-${index}`}
							// without this the node roots itself at its React
							// parent, whose transforms and scroll do not apply
							// to an element portalled under <body> — and the
							// flight silently starts from the wrong place
							data-framer-portal-id="showcase"
							transition={TRAVEL}
							// the same frame class the deck card uses, so the
							// border, hairline, lit rim and shadow are one
							// element throughout and nothing snaps
							className="shot-frame w-full overflow-hidden"
							style={{
								aspectRatio: `${shot.width} / ${shot.height}`,
							}}
						>
							{/* Scale-corrected. The frame is scaled non-uniformly
							    while it morphs, and a plain child inherits that
							    — the picture was rendering at ratio 1.57 when
							    its true ratio is 1.33, an 18% squash that ran
							    for the whole flight. `layout` makes framer undo
							    the parent's scale each frame, so the picture
							    keeps its shape and the frame crops it instead. */}
							<motion.div layout className="size-full">
								<Image
									key={shot.src}
									src={shot.src}
									alt={shot.alt}
									width={shot.width}
									height={shot.height}
									sizes="(min-width: 512px) 512px, 92vw"
									priority
									unoptimized
									// object-cover at the shot's own ratio crops
									// nothing here, and crops to 16:10 back in the
									// deck — so the crop simply opens out as the
									// frame changes shape
									className="size-full object-cover object-top"
								/>
							</motion.div>
						</motion.div>

						<div
							ref={metaRef}
							className="showcase-meta flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
						>
							<div className="flex min-w-0 flex-col gap-1">
								<h3
									id="showcase-title"
									className="text-[15px] font-medium text-ink"
								>
									{shot.name}
								</h3>
								<p className="text-[13px] leading-relaxed text-mute">
									{shot.blurb}
								</p>
							</div>

							<div className="flex shrink-0 items-center gap-1.5 self-end sm:self-auto">
								<button
									type="button"
									aria-label="Previous project"
									onClick={() => step(-1)}
									className="flex size-9 items-center justify-center rounded-full text-mute ring-1 ring-line transition hover:bg-surface hover:text-ink"
								>
									<RiArrowLeftSLine className="size-4.5" />
								</button>
								<button
									type="button"
									aria-label="Next project"
									onClick={() => step(1)}
									className="flex size-9 items-center justify-center rounded-full text-mute ring-1 ring-line transition hover:bg-surface hover:text-ink"
								>
									<RiArrowRightSLine className="size-4.5" />
								</button>
								<a
									href={shot.href}
									target="_blank"
									rel="noreferrer"
									className="flex h-9 items-center gap-1.5 rounded-full px-3.5 font-mono text-[11px] tracking-label text-ink uppercase ring-1 ring-line transition hover:bg-surface"
								>
									Visit
									<RiArrowRightUpLine className="size-3.5" />
								</a>
								<button
									type="button"
									aria-label="Close"
									onClick={requestClose}
									className="flex size-9 items-center justify-center rounded-full text-mute ring-1 ring-line transition hover:bg-surface hover:text-ink"
								>
									<RiCloseLine className="size-4.5" />
								</button>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</>,
		document.body,
	);
}
