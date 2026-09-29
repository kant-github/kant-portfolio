"use client";

import Image from "next/image";
import {
	useCallback,
	useRef,
	useState,
	useSyncExternalStore,
	type CSSProperties,
} from "react";
import { CONTENT_INDEX } from "@/components/section";
import {
	ShowcaseLightbox,
	type CardRect,
} from "@/components/showcase-lightbox";
import { showcase } from "@/lib/data";

// Card width is a percentage too (see SCATTER_FRAME), so the whole
// arrangement scales as one piece and stays centred at every width. With a
// 31% card, the group runs 7% -> 93%, which leaves equal margins either side.
const LAYOUT = [
	{ left: "7%", top: "2%", rotate: -5, z: 10 },
	{ left: "43%", top: "0%", rotate: 3, z: 20 },
	{ left: "23%", top: "34%", rotate: -3, z: 40 },
	{ left: "62%", top: "36%", rotate: 4, z: 30 },
];

// Entry is owned by the surrounding ScrollStage. Only hover lives here, so the
// two never fight over the same transform.
const HOVER =
	"transition duration-300 ease-out hover:z-50 hover:-translate-y-3 hover:rotate-0 hover:scale-104";

const SCATTER_FRAME = `absolute w-[31%] cursor-pointer rounded-xl bg-white p-1 shadow-card rotate-(--tilt) sm:rounded-lg sm:p-1.5 ${HOVER}`;

const STACK_FRAME = `w-full cursor-pointer rounded-xl bg-white p-1 shadow-card ${HOVER}`;

const WIDE = "(min-width: 640px)";

function subscribe(onChange: () => void) {
	const query = window.matchMedia(WIDE);
	query.addEventListener("change", onChange);
	return () => query.removeEventListener("change", onChange);
}

function getSnapshot() {
	return window.matchMedia(WIDE).matches;
}

function getServerSnapshot() {
	return true;
}

export function Showcase() {
	const isWide = useSyncExternalStore(
		subscribe,
		getSnapshot,
		getServerSnapshot,
	);

	const [open, setOpen] = useState<number | null>(null);
	const cards = useRef<(HTMLButtonElement | null)[]>([]);

	/**
	 * Measured live rather than captured on click, so closing lands on
	 * whichever card the arrows left you on — and stays correct if the page
	 * was resized while the overlay was up.
	 */
	const getCardRect = useCallback(
		(index: number): CardRect | null => {
			const card = cards.current[index];
			if (!card) return null;

			const rect = card.getBoundingClientRect();

			return {
				top: rect.top,
				left: rect.left,
				width: rect.width,
				height: rect.height,
				rotate: isWide
					? (LAYOUT[index % LAYOUT.length]?.rotate ?? 0)
					: 0,
			};
		},
		[isWide],
	);

	return (
		<>
			<div
				className={
					isWide
						? "stage-item stage-soft relative mx-auto h-88 w-full max-w-295 lg:h-120"
						: "stage-item stage-soft mx-auto flex w-full max-w-88 flex-col gap-5 px-4"
				}
				style={{ "--i": CONTENT_INDEX } as CSSProperties}
			>
				{showcase.map((shot, index) => {
					const spot = LAYOUT[index % LAYOUT.length];

					return (
						<button
							key={shot.src}
							ref={(node) => {
								cards.current[index] = node;
							}}
							type="button"
							aria-label={`Open ${shot.name}`}
							onClick={() => setOpen(index)}
							style={
								isWide
									? ({
											left: spot.left,
											top: spot.top,
											zIndex: spot.z,
											"--tilt": `${spot.rotate}deg`,
										} as CSSProperties)
									: undefined
							}
							className={isWide ? SCATTER_FRAME : STACK_FRAME}
						>
							<Image
								src={shot.src}
								alt={shot.alt}
								width={1200}
								height={900}
								sizes="(min-width: 640px) 380px, 90vw"
								className="aspect-4/3 w-full rounded-[8px] object-cover ring-1 ring-black/10 sm:rounded-md"
							/>
						</button>
					);
				})}
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
