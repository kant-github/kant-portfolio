"use client";

import Link from "next/link";
import { useState, type CSSProperties } from "react";
import { PushPin } from "@/components/push-pin";
import { CONTENT_INDEX, Section } from "@/components/section";
import { postList } from "@/lib/writing";

export function Writing() {
	const [lit, setLit] = useState<number | null>(null);

	return (
		<Section label="Case studies" intro="Notes on what I am building and learning.">
			<ul className="flex flex-col" onPointerLeave={() => setLit(null)}>
				{postList.map((post, index) => {
					const active = lit === index;

					return (
						<li
							key={post.slug}
							className="tree-row stage-item"
							style={{ "--i": CONTENT_INDEX + index } as CSSProperties}
						>
							<Link
								href={`/writing/${post.slug}`}
								onPointerEnter={() => setLit(index)}
								onFocus={() => setLit(index)}
								className={`-mx-2.5 flex h-full items-center gap-2.5 rounded-lg px-2.5 transition-colors duration-200 focus-visible:outline-none ${
									active ? "bg-tree-row" : ""
								}`}
							>
								<PushPin active={active} />

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
		</Section>
	);
}
