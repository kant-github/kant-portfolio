"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useState } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { chapterIndexForKey, isReservedKey, jumpToChapter } from "@/lib/keys";
import { EASE } from "@/lib/motion";

export type ChapterItem = { id: string; n: number; title: string };

const ROW = 34;
const RAIL = 12;
const END_X = 26;
const BEND = 7;
const TRUNK_TOP = 27;
const DASH = "3.5 3";
const SLIDE = { duration: 0.35, ease: EASE };

function rowCentre(index: number) {
	return ROW + index * ROW + ROW / 2;
}

function trunkPath(toY: number) {
	return `M ${RAIL} ${TRUNK_TOP} V ${toY}`;
}

function bendPath(index: number) {
	const y = rowCentre(index);
	return `M ${RAIL} ${y - BEND} Q ${RAIL} ${y} ${RAIL + BEND} ${y}`;
}

function armPath(index: number) {
	const y = rowCentre(index);
	return `M ${RAIL + BEND} ${y} H ${END_X}`;
}

/** The dashed tree behind the rows, plus a blue copy that follows the lit row. */
function Connectors({ count, lit }: { count: number; lit: number }) {
	const reduced = useReducedMotion();
	const transition = reduced ? { duration: 0 } : SLIDE;

	return (
		<svg
			width={END_X + 2}
			height={ROW * (count + 1)}
			viewBox={`0 0 ${END_X + 2} ${ROW * (count + 1)}`}
			aria-hidden="true"
			className="pointer-events-none absolute top-0 left-0"
			fill="none"
			strokeWidth={1.5}
			strokeLinecap="round"
		>
			<g stroke="var(--color-tree-line)">
				<path
					d={trunkPath(rowCentre(count - 1) - BEND)}
					strokeDasharray={DASH}
				/>
				{Array.from({ length: count }, (_, index) => (
					<g key={index}>
						<path d={bendPath(index)} />
						<path d={armPath(index)} strokeDasharray={DASH} />
					</g>
				))}
			</g>

			<g stroke="var(--color-tree-accent)">
				<motion.path
					initial={false}
					animate={{ d: trunkPath(rowCentre(lit) - BEND) }}
					transition={transition}
					strokeDasharray={DASH}
				/>
				<motion.path
					initial={false}
					animate={{ d: bendPath(lit) }}
					transition={transition}
				/>
				<motion.path
					initial={false}
					animate={{ d: armPath(lit) }}
					transition={transition}
					strokeDasharray={DASH}
				/>
			</g>
		</svg>
	);
}

/** Which chapter the reader is in: the last one crossing a band near the top. */
function useActiveChapter(items: ChapterItem[]) {
	const [active, setActive] = useState(0);
	useScrollSpy(items, setActive);
	return [active, setActive] as const;
}

function useScrollSpy(
	items: ChapterItem[],
	setActive: (index: number) => void,
) {
	useEffect(() => {
		const sections = items
			.map((item) =>
				document.querySelector<HTMLElement>(
					`[data-chapter="${item.id}"]`,
				),
			)
			.filter((section): section is HTMLElement => section !== null);

		if (sections.length === 0) return;

		const crossing = new Set<string>();

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					const id = (entry.target as HTMLElement).dataset.chapter;
					if (!id) continue;
					if (entry.isIntersecting) crossing.add(id);
					else crossing.delete(id);
				}

				let last = -1;
				items.forEach((item, index) => {
					if (crossing.has(item.id)) last = index;
				});

				if (last >= 0) setActive(last);
			},
			{ rootMargin: "-30% 0px -69% 0px" },
		);

		for (const section of sections) observer.observe(section);
		return () => observer.disconnect();
	}, [items, setActive]);
}

function useChapterKeys(
	items: ChapterItem[],
	active: number,
	onPress: (index: number) => void,
) {
	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (isReservedKey(event)) return;

			const key = event.key.toLowerCase();
			let next: number | null = null;

			if (key === "j") next = Math.min(active + 1, items.length - 1);
			else if (key === "k") next = Math.max(active - 1, 0);
			else {
				const index = chapterIndexForKey(key);
				if (index !== null && index < items.length) next = index;
			}

			if (next === null) return;

			event.preventDefault();
			onPress(next);
			jumpToChapter(items[next].id);
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [items, active, onPress]);
}

export function ChapterTree({
	title,
	items,
}: {
	title: string;
	items: ChapterItem[];
}) {
	const [active, setActive] = useActiveChapter(items);
	const [hover, setHover] = useState<number | null>(null);

	useChapterKeys(items, active, setActive);

	const lit = hover ?? active;

	return (
		<nav aria-label="Chapters">
			<div
				className="relative flex flex-col"
				onPointerLeave={() => setHover(null)}
			>
				<Connectors count={items.length} lit={lit} />

				<div className="flex h-[34px] items-center gap-2.5">
					<span className="ml-0.5 flex size-5 shrink-0 items-center justify-center rounded-[5px] bg-tree-accent text-white">
						<RiArrowDownSLine className="size-3.5" aria-hidden="true" />
					</span>
					<span className="truncate text-sm font-medium text-ink">
						{title}
					</span>
				</div>

				<ol className="flex flex-col">
					{items.map((item, index) => {
						const isLit = lit === index;
						const isActive = active === index;

						return (
							<li key={item.id} className="tree-row">
								<a
									href={`#${item.id}`}
									aria-current={isActive ? "location" : undefined}
									onPointerEnter={() => setHover(index)}
									onFocus={() => setHover(index)}
									onBlur={() => setHover(null)}
									onClick={(event) => {
										event.preventDefault();
										setActive(index);
										jumpToChapter(item.id);
									}}
									className={`ml-6 flex h-full items-center gap-2.5 rounded-lg px-2.5 transition-colors duration-200 focus-visible:outline-none ${
										isLit ? "bg-tree-row" : ""
									}`}
								>
									<span
										aria-hidden="true"
										className={`size-2.5 shrink-0 rounded-[3px] border transition-colors duration-200 ${
											isLit
												? "border-tree-accent"
												: "border-mute/70"
										} ${isActive ? "bg-tree-accent" : ""}`}
									/>

									<span
										className={`flex-1 truncate text-[13px] transition-colors duration-200 ${
											isLit ? "text-ink" : "text-mute"
										}`}
									>
										{item.title}
									</span>
								</a>
							</li>
						);
					})}
				</ol>
			</div>
		</nav>
	);
}
