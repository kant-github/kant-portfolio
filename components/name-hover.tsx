"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import { playNote } from "@/lib/sargam";

const HUE_RANGE = 300;
const LIFT = -6;

const GLIDE = {
	duration: 0.3,
	ease: [0.22, 1, 0.36, 1],
} as const;

type Glyph = {
	character: string;
	note: number | null;
};

function toGlyphs(text: string): Glyph[] {
	let note = -1;

	return text.split("").map((character) => {
		if (character === " ") return { character, note: null };

		note += 1;
		return { character, note };
	});
}

function hueFor(note: number, total: number) {
	if (total < 2) return 0;
	return Math.round((note * HUE_RANGE) / (total - 1));
}

export function NameHover({ text }: { text: string }) {
	const prefersReducedMotion = useReducedMotion();
	const [hovered, setHovered] = useState<number | null>(null);

	const glyphs = toGlyphs(text);
	const total = glyphs.filter((glyph) => glyph.note !== null).length;

	return (
		<span
			className="inline-flex"
			aria-label={text}
			onMouseLeave={() => setHovered(null)}
		>
			{glyphs.map(({ character, note }, index) => {
				if (note === null) {
					return (
						<span key={`space-${index}`} aria-hidden>
							&nbsp;
						</span>
					);
				}

				const isHovered = hovered === index;
				const lifted = isHovered && !prefersReducedMotion;

				return (
					<span
						key={`${character}-${index}`}
						aria-hidden
						onMouseEnter={() => {
							setHovered(index);
							playNote(note);
						}}
						className="inline-block cursor-default transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
						style={
							isHovered
								? {
										color: `hsl(${hueFor(note, total)} 85% 55%)`,
									}
								: undefined
						}
					>
						<motion.span
							className="inline-block transform-gpu will-change-transform"
							animate={{ y: lifted ? LIFT : 0 }}
							transition={GLIDE}
						>
							{character}
						</motion.span>
					</span>
				);
			})}
		</span>
	);
}
