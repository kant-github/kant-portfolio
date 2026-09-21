"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { Band } from "@/components/band";
import { Section } from "@/components/section";
import { TestimonialNote } from "@/components/testimonial-note";
import {
	BOARD,
	PLACEMENT,
	THREADS,
	pct,
	testimonials,
	threadPath,
} from "@/lib/testimonials";

const ENTER_MS = 700;
const ENTER_STAGGER_MS = 90;
const HOVER_MS = 180;
const LIT_BASE_DELAY_MS = 300;

export function Testimonials() {
	const boardRef = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = useReducedMotion();
	const [revealed, setRevealed] = useState(false);
	const [settled, setSettled] = useState(false);

	// This board is the largest animation on the site and used to run
	// regardless of the OS setting.
	const still = prefersReducedMotion === true;
	const shown = revealed || still;
	const [focused, setFocused] = useState<string | null>(null);

	useEffect(() => {
		if (still) return;

		const el = boardRef.current;
		if (!el) return;

		const io = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setRevealed(true);
					io.disconnect();
				}
			},
			{ threshold: 0.15 },
		);

		io.observe(el);
		const failSafe = window.setTimeout(() => setRevealed(true), 2000);

		return () => {
			io.disconnect();
			window.clearTimeout(failSafe);
		};
	}, [still]);

	useEffect(() => {
		if (!revealed) return;

		const last = (testimonials.length - 1) * ENTER_STAGGER_MS + ENTER_MS;
		const timer = window.setTimeout(() => setSettled(true), last);

		return () => window.clearTimeout(timer);
	}, [revealed]);

	const numbers = useMemo(
		() =>
			new Map(
				testimonials.map((item, index) => [
					item.id,
					String(index + 1).padStart(3, "0"),
				]),
			),
		[],
	);

	return (
		<Section
			label="Testimonials"
			intro="A few words from people I have worked with."
		>
			<Band className="hidden lg:block">
				<div
					ref={boardRef}
					onPointerLeave={() => setFocused(null)}
					className="relative mx-auto w-full max-w-295"
					style={{ aspectRatio: `${BOARD.w} / ${BOARD.h}` }}
				>
					<svg
						viewBox={`0 0 ${BOARD.w} ${BOARD.h}`}
						fill="none"
						preserveAspectRatio="none"
						className="pointer-events-none absolute inset-0 z-0 size-full"
						aria-hidden="true"
					>
						{THREADS.map(([from, to], index) => {
							const a = PLACEMENT[from];
							const b = PLACEMENT[to];
							if (!a || !b) return null;

							const active = focused === from || focused === to;
							const dim = focused !== null && !active;

							return (
								<path
									key={`${from}-${to}`}
									d={threadPath(a, b)}
									fill="none"
									strokeLinecap="round"
									stroke={
										active
											? "var(--thread-hot)"
											: "var(--thread-rest)"
									}
									strokeWidth={
										BOARD.pin * (active ? 0.3 : 0.22)
									}
									pathLength={1}
									strokeDasharray={1}
									strokeDashoffset={shown ? 0 : 1}
									opacity={dim ? 0.35 : 1}
									style={{
										transition: still
											? "none"
											: "stroke-dashoffset 0.9s cubic-bezier(0.32,0,0,1), stroke 0.35s ease-out, stroke-width 0.35s ease-out, opacity 0.35s ease-out",
										transitionDelay: revealed
											? `${350 + index * 70}ms, 0ms, 0ms, 0ms`
											: "0ms",
									}}
								/>
							);
						})}
					</svg>

					{testimonials.map((item, index) => {
						const place = PLACEMENT[item.id];
						if (!place) return null;

						const dimmed = focused !== null && focused !== item.id;

						return (
							<div
								key={item.id}
								onPointerEnter={() => setFocused(item.id)}
								className="absolute z-10 origin-top transition ease-out"
								style={{
									left: pct(place.x, BOARD.w),
									top: pct(place.y, BOARD.h),
									width: pct(place.w, BOARD.w),
									transform: `translateX(-50%) rotate(${place.tilt}deg) translateY(${shown ? "0px" : "-12px"}) scale(${focused === item.id ? 1.03 : 1})`,
									opacity: shown ? (dimmed ? 0.45 : 1) : 0,
									transitionDuration: still
										? "0ms"
										: `${settled ? HOVER_MS : ENTER_MS}ms`,
									transitionDelay:
										revealed && !settled
											? `${index * ENTER_STAGGER_MS}ms`
											: "0ms",
								}}
							>
								<TestimonialNote
									item={item}
									number={numbers.get(item.id) ?? "000"}
									pinned
									lit={shown}
									litDelayMs={
										LIT_BASE_DELAY_MS +
										index * ENTER_STAGGER_MS
									}
								/>
							</div>
						);
					})}
				</div>
			</Band>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:hidden">
				{testimonials
					.filter((item) => !item.phoneHidden)
					.map((item, index) => (
						<TestimonialNote
							key={item.id}
							item={item}
							number={numbers.get(item.id) ?? "000"}
							lit={shown}
							litDelayMs={
								LIT_BASE_DELAY_MS + index * ENTER_STAGGER_MS
							}
						/>
					))}
			</div>
		</Section>
	);
}
