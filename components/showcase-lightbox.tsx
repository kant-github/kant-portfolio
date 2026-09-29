"use client";

import { animate, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
	useCallback,
	useEffect,
	useLayoutEffect,
	useRef,
	useState,
} from "react";
import { createPortal } from "react-dom";
import {
	RiArrowLeftSLine,
	RiArrowRightSLine,
	RiArrowRightUpLine,
	RiCloseLine,
} from "react-icons/ri";
import type { Shot } from "@/lib/data";
import { closeOverlay, openOverlay } from "@/lib/overlay-state";

export type CardRect = {
	top: number;
	left: number;
	width: number;
	height: number;
	rotate: number;
};

type Flip = { x: number; y: number; scale: number; rotate: number };

const BACKDROP = 0.94;
const TRAVEL = { duration: 0.44, ease: [0.22, 1, 0.36, 1] as const };

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
	getCardRect,
	onClose,
	onIndexChange,
}: {
	items: Shot[];
	index: number | null;
	getCardRect: (index: number) => CardRect | null;
	onClose: () => void;
	onIndexChange: (next: number) => void;
}) {
	const [mounted, setMounted] = useState(false);
	const panelRef = useRef<HTMLDivElement>(null);
	const frameRef = useRef<HTMLDivElement>(null);
	const backdropRef = useRef<HTMLButtonElement>(null);
	const [closing, setClosing] = useState(false);
	const still = useReducedMotion() === true;

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

	const flipFor = useCallback(
		(at: number): Flip | null => {
			const frame = frameRef.current;
			const card = getCardRect(at);
			if (!frame || !card) return null;

			const to = frame.getBoundingClientRect();

			return {
				x: card.left + card.width / 2 - (to.left + to.width / 2),
				y: card.top + card.height / 2 - (to.top + to.height / 2),
				scale: card.width / to.width,
				rotate: card.rotate,
			};
		},
		[getCardRect],
	);

	useLayoutEffect(() => {
		if (index === null) return;

		const frame = frameRef.current;
		const backdrop = backdropRef.current;
		if (!frame || !backdrop) return;

		const from = flipFor(index);

		if (still || !from) {
			frame.style.transform = "none";
			backdrop.style.opacity = String(BACKDROP);
			return;
		}

		frame.style.transform = `translate(${from.x}px, ${from.y}px) scale(${from.scale}) rotate(${from.rotate}deg)`;
		backdrop.style.opacity = "0";

		const flight = animate(
			frame,
			{ transform: "translate(0px, 0px) scale(1) rotate(0deg)" },
			TRAVEL,
		);
		const fade = animate(backdrop, { opacity: BACKDROP }, TRAVEL);

		return () => {
			flight.stop();
			fade.stop();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [open, still]);

	const requestClose = useCallback(async () => {
		if (closing || index === null) return;

		const frame = frameRef.current;
		const backdrop = backdropRef.current;
		const back = flipFor(index);

		if (still || !frame || !backdrop || !back) {
			onClose();
			return;
		}

		setClosing(true);

		await Promise.all([
			animate(
				frame,
				{
					transform: `translate(${back.x}px, ${back.y}px) scale(${back.scale}) rotate(${back.rotate}deg)`,
				},
				TRAVEL,
			),
			animate(backdrop, { opacity: 0 }, TRAVEL),
		]);

		setClosing(false);
		onClose();
	}, [closing, index, flipFor, still, onClose]);

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
			{shot && index !== null ? (
				<div
					key="lightbox"
					className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-8"
				>
					<button
						ref={backdropRef}
						type="button"
						aria-label="Close"
						tabIndex={-1}
						onClick={() => void requestClose()}
						className="absolute inset-0 cursor-default bg-black opacity-0"
					/>

					<div
						ref={panelRef}
						role="dialog"
						aria-modal="true"
						aria-labelledby="showcase-title"
						className="relative flex w-full max-w-4xl flex-col gap-4"
					>
						<div
							ref={frameRef}
							className="overflow-hidden rounded-xl bg-white p-1.5 shadow-card will-change-transform"
						>
							<Image
								key={shot.src}
								src={shot.src}
								alt={shot.alt}
								width={shot.width}
								height={shot.height}
								sizes="(min-width: 896px) 896px, 92vw"
								priority
								unoptimized
								className="h-auto w-full rounded-lg"
							/>
						</div>

						<div className="showcase-meta flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
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
									onClick={() => void requestClose()}
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
