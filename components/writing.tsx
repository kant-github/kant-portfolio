import Link from "next/link";
import type { CSSProperties } from "react";
import { CONTENT_INDEX, Section } from "@/components/section";
import { postList } from "@/lib/writing";

export function Writing() {
	return (
		<Section
			label="Writing"
			intro="Notes on what I am building and learning."
		>
			<ul className="flex flex-col">
				{postList.map((post, index) => (
					<li key={post.slug}>
						<Link
							href={`/writing/${post.slug}`}
							className="stage-item stage-rule flex items-baseline gap-4 py-3 transition-opacity hover:opacity-70"
							style={
								{
									"--i": CONTENT_INDEX + index,
									"--rule-origin":
										index % 2 ? "right" : "left",
								} as CSSProperties
							}
						>
							<span className="w-16 shrink-0 font-mono text-xs tracking-label text-mute">
								{post.display}
							</span>
							<span className="flex-1 text-ink">
								{post.title}
							</span>
							<span className="shrink-0 font-mono text-xs tracking-label text-mute">
								{post.minutes} m
							</span>
						</Link>
					</li>
				))}
			</ul>
		</Section>
	);
}
