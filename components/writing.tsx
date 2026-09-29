"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { RiArrowDownSLine } from "react-icons/ri";
import { CONTENT_INDEX, Section } from "@/components/section";
import { postList } from "@/lib/writing";

const ROW = 40;
const RAIL = 12;
const END_X = 26;
const BEND = 7;
const TRUNK_TOP = 30;
const DASH = "3.5 3";

function rowCentre(index: number) {
	return ROW + index * ROW + ROW / 2;
}

function Trunk({ toY }: { toY: number }) {
	return (
		<path d={`M ${RAIL} ${TRUNK_TOP} V ${toY}`} strokeDasharray={DASH} />
	);
}

function Corner({ index }: { index: number }) {
	const y = rowCentre(index);

	return (
		<>
			<path
				d={`M ${RAIL} ${y - BEND} Q ${RAIL} ${y} ${RAIL + BEND} ${y}`}
			/>
			<path
				d={`M ${RAIL + BEND} ${y} H ${END_X}`}
				strokeDasharray={DASH}
			/>
		</>
	);
}

function Connectors({ count, lit }: { count: number; lit: number | null }) {
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
				<Trunk toY={rowCentre(count - 1) - BEND} />
				{Array.from({ length: count }, (_, index) => (
					<Corner key={index} index={index} />
				))}
			</g>

			{lit === null ? null : (
				<g stroke="var(--color-tree-accent)">
					<Trunk toY={rowCentre(lit) - BEND} />
					<Corner index={lit} />
				</g>
			)}
		</svg>
	);
}

export function Writing() {
	const [lit, setLit] = useState<number | null>(null);

	return (
		<Section label="Writing">
			<div
				className="relative flex flex-col"
				onPointerLeave={() => setLit(null)}
			>
				<Connectors count={postList.length} lit={lit} />

				<div
					className="stage-item flex h-10 items-center gap-2.5"
					style={{ "--i": CONTENT_INDEX } as CSSProperties}
				>
					<span className="ml-0.5 flex size-5 shrink-0 items-center justify-center rounded-[5px] bg-tree-accent text-white">
						<RiArrowDownSLine
							className="size-3.5"
							aria-hidden="true"
						/>
					</span>
					<span className="font-medium text-ink">
						Notes on what I am building and learning.
					</span>
				</div>

				<ul className="flex flex-col">
					{postList.map((post, index) => {
						const active = lit === index;

						return (
							<li
								key={post.slug}
								className="tree-row stage-item"
								style={
									{
										"--i": CONTENT_INDEX + 1 + index,
									} as CSSProperties
								}
							>
								<Link
									href={`/writing/${post.slug}`}
									onPointerEnter={() => setLit(index)}
									onFocus={() => setLit(index)}
									className={`ml-6 flex h-full items-center gap-2.5 rounded-lg px-2.5 transition-colors duration-200 focus-visible:outline-none ${
										active ? "bg-tree-row" : ""
									}`}
								>
									<span
										aria-hidden="true"
										className={`size-2.5 shrink-0 rounded-[3px] border transition-colors duration-200 ${
											active
												? "border-tree-accent"
												: "border-mute/70"
										}`}
									/>

									<span
										className={`flex-1 truncate text-sm transition-colors duration-200 ${
											active ? "text-ink" : "text-mute"
										}`}
									>
										{post.title}
									</span>
								</Link>
							</li>
						);
					})}
				</ul>
			</div>
		</Section>
	);
}
