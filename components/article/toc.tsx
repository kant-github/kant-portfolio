import { LABEL_CLASS } from "@/components/section";
import type { Block } from "@/lib/writing/types";

/**
 * A skim path for anyone who will not read the whole thing. Inline rather than
 * a sidebar, so it works the same at 640px and at 375px.
 */
export function Toc({ blocks }: { blocks: Block[] }) {
	const headings = blocks.filter((block) => block.type === "h2");

	if (headings.length < 3) return null;

	return (
		<nav
			aria-label="In this article"
			className="not-prose rounded-md border border-line bg-surface px-5 py-4"
		>
			<p className={LABEL_CLASS}>In this article</p>
			<ol className="mt-3 flex flex-col">
				{headings.map((heading, index) => (
					<li key={heading.id}>
						<a
							href={`#${heading.id}`}
							className="flex items-baseline gap-3 border-b border-line py-2 text-[15px] text-mute no-underline transition-opacity last:border-b-0 hover:opacity-70"
						>
							<span className="w-5 shrink-0 font-mono text-[11px] text-line">
								{String(index + 1).padStart(2, "0")}
							</span>
							<span>{heading.text}</span>
						</a>
					</li>
				))}
			</ol>
		</nav>
	);
}
