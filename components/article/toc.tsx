import { LABEL_CLASS } from "@/components/section";
import type { Block } from "@/lib/case-studies/types";

export function chapters(blocks: Block[]) {
	return blocks.filter(
		(block): block is Extract<Block, { type: "chapter" }> =>
			block.type === "chapter",
	);
}

/** The compact chapter list shown above the article on narrow screens. */
export function Toc({ blocks }: { blocks: Block[] }) {
	const headings = chapters(blocks);

	if (headings.length < 3) return null;

	return (
		<nav
			aria-label="Chapters"
			className="not-prose rounded-lg border border-line bg-surface px-4 py-4"
		>
			<p className={LABEL_CLASS}>Chapters</p>
			<ol className="mt-3 grid gap-x-6 sm:grid-cols-2">
				{headings.map((heading) => (
					<li key={heading.id}>
						<a
							href={`#${heading.id}`}
							className="flex items-center gap-2.5 py-1.5 text-sm text-mute no-underline transition-colors hover:text-ink"
						>
							<span
								aria-hidden="true"
								className="size-2.5 shrink-0 rounded-[3px] border border-mute/70"
							/>
							<span className="w-5 shrink-0 font-mono text-[11px] text-mute/70">
								{String(heading.n).padStart(2, "0")}
							</span>
							<span className="truncate">{heading.short ?? heading.title}</span>
						</a>
					</li>
				))}
			</ol>
		</nav>
	);
}
