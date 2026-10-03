import type { Metadata } from "next";
import Link from "next/link";
import type { CSSProperties } from "react";
import { RiArrowLeftSLine } from "react-icons/ri";
import { notFound } from "next/navigation";
import { Blocks, Chapter } from "@/components/article/blocks";
import { ChapterTree } from "@/components/article/chapter-tree";
import { ProgressBar } from "@/components/article/progress-bar";
import { Shot } from "@/components/article/shot";
import { chapters, Toc } from "@/components/article/toc";
import { Dock } from "@/components/dock";
import { ScrollStage } from "@/components/scroll-stage";
import { LABEL_CLASS } from "@/components/section";
import { getPost, monthYear, posts } from "@/lib/case-studies";
import type { Block } from "@/lib/case-studies/types";

export function generateStaticParams() {
	return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
	params,
}: PageProps<"/case-studies/[slug]">): Promise<Metadata> {
	const { slug } = await params;
	const found = getPost(slug);

	if (!found) return {};

	return {
		title: found.meta.title,
		description: found.meta.summary,
		openGraph: {
			title: found.meta.title,
			description: found.meta.summary,
			type: "article",
			publishedTime: found.meta.date,
		},
	};
}

type ChapterBlock = Extract<Block, { type: "chapter" }>;

/** Splits the body into the intro and one slice per chapter. */
function splitChapters(blocks: Block[]) {
	const intro: Block[] = [];
	const slices: { heading: ChapterBlock; body: Block[] }[] = [];

	for (const block of blocks) {
		if (block.type === "chapter") {
			slices.push({ heading: block, body: [] });
		} else if (slices.length === 0) {
			intro.push(block);
		} else {
			slices[slices.length - 1].body.push(block);
		}
	}

	return { intro, slices };
}

function stageIndex(i: number) {
	return { "--i": i } as CSSProperties;
}

export default async function CaseStudy({
	params,
}: PageProps<"/case-studies/[slug]">) {
	const { slug } = await params;
	const found = getPost(slug);

	if (!found) notFound();

	const { meta, blocks, minutes } = found;
	const tree = chapters(blocks).map(({ id, n, title, short }) => ({
		id,
		n,
		title: short ?? title,
	}));
	const { intro, slices } = splitChapters(blocks);

	return (
		<div className="flex min-h-screen w-full justify-center overflow-x-clip">
			<ProgressBar />

			{/* The tree floats on the left, fixed, and the article is centred
			    like the home page. Below xl the tree is hidden and the compact
			    chapter list inside the article takes over. */}
			<aside className="fixed top-28 left-[max(1rem,calc(50%-40.25rem))] hidden w-60 xl:block">
				<ChapterTree title={meta.title} items={tree} />
			</aside>

				<main className="flex w-full max-w-[42.5rem] min-w-0 flex-col gap-10 px-4 pt-10 pb-32">
					<div className="stage overture">
						<Link
							href="/#case-studies"
							aria-label="Back to case studies"
							className="group stage-item inline-flex w-fit items-center gap-1.5 rounded-md border border-line bg-surface py-1.5 pr-3 pl-1.5 font-mono text-[11px] tracking-label text-mute uppercase transition-colors hover:border-ink/20 hover:text-ink"
							style={stageIndex(0)}
						>
							<RiArrowLeftSLine
								className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
								aria-hidden="true"
							/>
							Case studies
						</Link>

						<header className="article-head mt-10 flex flex-col gap-6">
							<p
								className={`stage-item ${LABEL_CLASS}`}
								style={stageIndex(1)}
							>
								Case study · {meta.kind} · {monthYear(meta.date)} ·{" "}
								{minutes} min read
							</p>
							<h1
								className="stage-item stage-blur article-title"
								style={stageIndex(2)}
							>
								{meta.title}
							</h1>
							<p className="stage-item article-lead" style={stageIndex(3)}>
								{meta.summary}
							</p>

							<dl className="facts stage-item" style={stageIndex(4)}>
								{meta.facts.map((fact) => (
									<div key={fact.name} className="fact">
										<dt className="fact-name">{fact.name}</dt>
										<dd className="fact-value">{fact.value}</dd>
										<dd className="fact-label">{fact.label}</dd>
									</div>
								))}
							</dl>
						</header>

						<div className="stage-item mt-12" style={stageIndex(5)}>
							<Shot type="shot" {...meta.cover} priority />
						</div>
					</div>

					<article className="article min-w-0">
						<div className="mb-12 xl:hidden">
							<Toc blocks={blocks} />
						</div>

						<Blocks items={intro} />

						{slices.map(({ heading, body }) => (
							<section key={heading.id} data-chapter={heading.id}>
								<ScrollStage className="stage-soft">
									<div className="stage-item" style={stageIndex(0)}>
										<Chapter block={heading} />
									</div>
									<div className="stage-item" style={stageIndex(1)}>
										<Blocks items={body.slice(0, 1)} />
									</div>
									<Blocks items={body.slice(1)} />
								</ScrollStage>
							</section>
						))}
					</article>
				</main>

			<Dock />
		</div>
	);
}
