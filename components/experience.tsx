import type { CSSProperties } from "react";
import { CONTENT_INDEX, Section } from "@/components/section";
import { YcBadge } from "@/components/yc-badge";
import { experience } from "@/lib/data";

export function Experience() {
	return (
		<Section
			label="Experience"
			intro="Where I have worked so far, and what I was responsible for."
		>
			<div className="flex flex-col gap-6">
				{experience.map((item, index) => (
					<article
						key={item.org}
						className="stage-item flex flex-col gap-1"
						style={
							{ "--i": CONTENT_INDEX + index } as CSSProperties
						}
					>
						<p className="font-mono text-xs tracking-label text-mute uppercase">
							{item.period}
						</p>

						<p className="text-ink">
							{item.role}{" "}
							<a
								href={item.href}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-70"
							>
								{item.badge === "yc" ? <YcBadge /> : null}
								{item.org}
							</a>
						</p>

						<p className="text-mute">{item.description}</p>
					</article>
				))}
			</div>
		</Section>
	);
}
