"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import {
	useCallback,
	useState,
	useSyncExternalStore,
	type CSSProperties,
} from "react";
import { CONTENT_INDEX } from "@/components/section";
import { ShowcaseLightbox } from "@/components/showcase-lightbox";
import { showcase } from "@/lib/data";
import { EASE } from "@/lib/motion";

const CARD = 210;

const STEP = 75;

const TILT = 4.5;

const LIFT = 16;

const CLEAR = CARD + 8;

const PACK = 22;

const PUSH = 20;

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

function restX(index: number, count: number) {
	return (index - middleOf(count)) * STEP;
}

function restTilt(index: number, count: number) {
	return (index - middleOf(count)) * TILT;
}

function layerFor(index: number, count: number) {
	return Math.ceil(count / 2) - Math.abs(index - Math.floor(middleOf(count)));
}

const NAME_ENTER = { opacity: 0, filter: "blur(4px)", y: 4 };
const NAME_REST = { opacity: 1, filter: "blur(0px)", y: 0 };
const NAME_LEAVE = {
	opacity: 0,
	filter: "blur(4px)",
	y: -4,

	transition: { duration: 0.18, ease: EASE },
};
const NAME_TRAVEL = { duration: 0.28, ease: EASE };

const FAN = { duration: 0.5, ease: EASE };

type Place = { x: number; y: number; tilt: number };

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
				<div className="deck" onPointerLeave={() => setFocused(null)}>
					{showcase.map((shot, index) => {
						const at = placeFor(index, focused, showcase.length);

						return (
							<motion.button
								key={`${shot.src}-${index}-${isWide ? "w" : "n"}`}

								layoutId={`shot-${index}`}
								type="button"
								aria-label={`Open ${shot.name}`}
								onClick={() => setOpen(index)}
								onPointerEnter={() => setFocused(index)}

								onFocus={(event) => {
									if (
										event.currentTarget.matches(
											":focus-visible",
										)
									) {
										setFocused(index);
									}
								}}

								initial={false}

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

				<div className="relative h-6">
					<AnimatePresence initial={false}>
						{focused === null ? null : (
							<motion.p
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
