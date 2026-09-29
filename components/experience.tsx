import type { CSSProperties } from "react";
import { AppxBadge } from "@/components/appx-badge";
import { CONTENT_INDEX, Section } from "@/components/section";
import { TwentyBadge } from "@/components/twenty-badge";
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
						<p className="font-mono text-[11px] tracking-label text-mute uppercase">
							{item.period}
						</p>

						<p className="text-[15px] font-medium text-ink">
							{item.role}{" "}
							<a
								href={item.href}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-70"
							>
								{item.badge === "appx" ? <AppxBadge /> : null}
								{item.badge === "twenty" ? (
									<TwentyBadge />
								) : null}
								{item.org}
							</a>
							{item.yc ? (
								<span className="ml-1.5 inline-flex items-center text-[13px] font-normal text-mute">
									(
									<span className="mr-1 ml-0.5 inline-flex">
										<YcBadge />
									</span>
									YC {item.yc})
								</span>
							) : null}
						</p>

						<p className="text-mute">{item.description}</p>
					</article>
				))}
			</div>
		</Section>
	);
}
