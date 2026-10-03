"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useState, type CSSProperties } from "react";
import { EASE } from "@/lib/motion";

const TILT = [-5, 3, -2, 4, -3];
const LIFT = 16;
const FAN = { duration: 0.5, ease: EASE };

/* Photos overlap by a quarter of their width at rest. When one is focused,
 * the side with more room clears it fully; the other side just nudges away,
 * the same way the project deck moves. Offsets are percentages of a card. */
const CLEAR = 32;
const PACK = 10;
const PUSH = 8;

type Photo = { src: string; alt: string };
type Place = { x: string; y: number; tilt: number; z: number };

function placeFor(index: number, focused: number | null, count: number): Place {
	const tilt = TILT[index % TILT.length];

	if (focused === null) return { x: "0%", y: 0, tilt, z: 0 };
	if (index === focused) return { x: "0%", y: -LIFT, tilt: 0, z: 10 };

	const side = index < focused ? -1 : 1;
	const before = focused;
	const after = count - focused - 1;
	const roomy = side === -1 ? before > after : after > before;
	const rank = Math.abs(index - focused);
	const shift = roomy ? CLEAR + PACK * (rank - 1) : PUSH;

	return { x: `${side * shift}%`, y: 0, tilt, z: 0 };
}

function rowSizing(count: number) {
	const width = 400 / (3 * count + 1);
	return { width: `${width}%`, overlap: `${width / 4}%` };
}

export function PhotoRow({ photos }: { photos: Photo[] }) {
	const [focused, setFocused] = useState<number | null>(null);
	const { width, overlap } = rowSizing(photos.length);

	return (
		<div
			className="flex justify-center px-2"
			onPointerLeave={() => setFocused(null)}
		>
			{photos.map((photo, index) => {
				const at = placeFor(index, focused, photos.length);

				return (
					<motion.figure
						key={photo.src}
						onPointerEnter={() => setFocused(index)}
						initial={false}
						animate={{ x: at.x, y: at.y, rotate: at.tilt }}
						transition={FAN}
						style={
							{
								width,
								marginLeft: index === 0 ? 0 : `-${overlap}`,
								zIndex: at.z,
							} as CSSProperties
						}
						className="relative shrink-0 rounded-lg bg-white p-1 shadow-card ring-1 ring-black/5 dark:ring-0"
					>
						<Image
							src={photo.src}
							alt={photo.alt}
							width={800}
							height={600}
							sizes="(min-width: 640px) 256px, 40vw"
							className="aspect-4/3 w-full rounded-sm object-cover"
						/>
					</motion.figure>
				);
			})}
		</div>
	);
}
