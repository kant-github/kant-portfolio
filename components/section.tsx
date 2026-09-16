import { EntryRow } from "@/components/entry-row";
import { Reveal } from "@/components/reveal";
import type { Section as SectionData } from "@/lib/data";

export function Section({ section }: { section: SectionData }) {
	return (
		<section id={section.id} className="mt-16 w-full">
			<Reveal>
				<h2 className="font-mono text-[13px] leading-4 tracking-[0.04em] text-mute uppercase">
					{section.label}
				</h2>

				{section.intro ? (
					<p className="mt-7 text-mute">{section.intro}</p>
				) : null}
			</Reveal>

			<div className="mt-12 flex flex-col gap-y-10">
				{section.entries.map((entry, index) => (
					<Reveal key={entry.meta} delay={index * 0.05}>
						<EntryRow entry={entry} />
					</Reveal>
				))}
			</div>
		</section>
	);
}
