"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { RiCloseLine, RiZoomInLine } from "react-icons/ri";
import type { Block, Note } from "@/lib/case-studies/types";
import {
	useEscape,
	useFocusTrap,
	useMounted,
	useOverlay,
	useScrollLock,
} from "@/lib/overlay-hooks";

type ShotBlock = Extract<Block, { type: "shot" }>;

const FADE = { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const };

function Pins({
	notes,
	active,
	onActive,
}: {
	notes: Note[];
	active: number | null;
	onActive: (index: number | null) => void;
}) {
	return notes.map((note, index) => (
		<span
			key={note.title}
			aria-hidden="true"
			onPointerEnter={() => onActive(index)}
			onPointerLeave={() => onActive(null)}
			className={`shot-pin ${active === index ? "is-active" : ""}`}
			style={{ left: `${note.x}%`, top: `${note.y}%` }}
		>
			{index + 1}
		</span>
	));
}

function Zoom({
	shot,
	open,
	onClose,
}: {
	shot: ShotBlock;
	open: boolean;
	onClose: () => void;
}) {
	const mounted = useMounted();
	const panelRef = useRef<HTMLDivElement>(null);

	useScrollLock(open);
	useOverlay(open);
	useEscape(open, onClose);
	useFocusTrap(panelRef, open);

	if (!mounted) return null;

	return createPortal(
		<AnimatePresence>
			{open ? (
				<motion.div
					ref={panelRef}
					role="dialog"
					aria-modal="true"
					aria-label={shot.alt}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={FADE}
					onClick={onClose}
					className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm sm:p-10"
				>
					<button
						type="button"
						onClick={onClose}
						aria-label="Close"
						className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
					>
						<RiCloseLine className="size-5" aria-hidden="true" />
					</button>

					<motion.div
						initial={{ scale: 0.97 }}
						animate={{ scale: 1 }}
						exit={{ scale: 0.97 }}
						transition={FADE}
						className="relative w-full max-w-[min(96vw,1600px)]"
					>
						<Image
							src={shot.src}
							alt={shot.alt}
							width={shot.width}
							height={shot.height}
							sizes="96vw"
							className="h-auto w-full rounded-lg"
						/>
						{shot.notes ? (
							<Pins notes={shot.notes} active={null} onActive={() => {}} />
						) : null}
					</motion.div>
				</motion.div>
			) : null}
		</AnimatePresence>,
		document.body,
	);
}

export function Shot({
	priority = false,
	...shot
}: ShotBlock & { priority?: boolean }) {
	const [open, setOpen] = useState(false);
	const [active, setActive] = useState<number | null>(null);
	const close = useCallback(() => setOpen(false), []);
	const { notes } = shot;

	return (
		<figure className="figure not-prose">
			<div className="shot-frame">
				<div className="relative">
					<button
						type="button"
						onClick={() => setOpen(true)}
						aria-label={`Zoom: ${shot.alt}`}
						className="group relative block w-full cursor-zoom-in overflow-hidden rounded-[6.5px]"
					>
						<Image
							src={shot.src}
							alt={shot.alt}
							width={shot.width}
							height={shot.height}
							priority={priority}
							sizes="(min-width: 720px) 680px, calc(100vw - 2rem)"
							className="h-auto w-full"
						/>
						<span className="absolute right-2.5 bottom-2.5 flex size-7 items-center justify-center rounded-full bg-black/40 text-white opacity-0 backdrop-blur transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
							<RiZoomInLine className="size-3.5" aria-hidden="true" />
						</span>
					</button>
					{notes ? (
						<Pins notes={notes} active={active} onActive={setActive} />
					) : null}
				</div>
			</div>

			{notes ? (
				<ol className="shot-legend">
					{notes.map((note, index) => (
						<li
							key={note.title}
							onPointerEnter={() => setActive(index)}
							onPointerLeave={() => setActive(null)}
							className="shot-legend-row"
						>
							<span
								className={`shot-pin is-static ${active === index ? "is-active" : ""}`}
							>
								{index + 1}
							</span>
							<span className="text-[15px] leading-[1.5] font-medium text-ink">
								{note.title}
							</span>
							<span className="text-[15px] leading-[1.6] text-mute sm:col-start-3">
								{note.text}
							</span>
						</li>
					))}
				</ol>
			) : null}

			{shot.caption ? <figcaption>{shot.caption}</figcaption> : null}

			<Zoom shot={shot} open={open} onClose={close} />
		</figure>
	);
}
