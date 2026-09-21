"use client";

import Image from "next/image";
import { useSyncExternalStore, type CSSProperties } from "react";
import { Band } from "@/components/band";
import { CONTENT_INDEX } from "@/components/section";
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

const SCATTER_FRAME = `absolute w-[31%] rounded-xl bg-white p-1 shadow-card rotate-(--tilt) sm:rounded-lg sm:p-1.5 ${HOVER}`;

const STACK_FRAME = `w-full rounded-xl bg-white p-1 shadow-card ${HOVER}`;

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

	return (
		<Band>
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
						<figure
							key={shot.src}
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
								className="aspect-4/3 w-full rounded-[8px] sm:rounded-md object-cover ring-1 ring-black/10"
							/>
						</figure>
					);
				})}
			</div>
		</Band>
	);
}
