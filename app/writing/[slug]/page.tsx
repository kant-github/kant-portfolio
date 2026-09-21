import type { Metadata } from "next";
import Link from "next/link";
import { RiArrowLeftSLine } from "react-icons/ri";
import { notFound } from "next/navigation";
import { Blocks } from "@/components/article/blocks";
import { ProgressBar } from "@/components/article/progress-bar";
import { Toc } from "@/components/article/toc";
import { Dock } from "@/components/dock";
import { LABEL_CLASS } from "@/components/section";
import { getPost, posts, shortDate } from "@/lib/writing";

export function generateStaticParams() {
	return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
	params,
}: PageProps<"/writing/[slug]">): Promise<Metadata> {
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

export default async function WritingPost({
	params,
}: PageProps<"/writing/[slug]">) {
	const { slug } = await params;
	const found = getPost(slug);

	if (!found) notFound();

	const { meta, blocks, minutes } = found;

	return (
		<div className="flex min-h-screen w-full justify-center overflow-x-hidden">
			<ProgressBar />

			<main className="flex w-full max-w-160 flex-col gap-10 px-4 pt-10 pb-32">
				<Link
					href="/#writing"
					aria-label="Back to writing"
					className="group inline-flex w-fit items-center gap-1.5 rounded-md border border-line bg-surface py-1.5 pr-3 pl-1.5 font-mono text-[11px] tracking-label text-mute uppercase transition-colors hover:border-white/20 hover:text-ink"
				>
					<RiArrowLeftSLine
						className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5"
						aria-hidden="true"
					/>
					Writing
				</Link>

				<article className="article">
					<header className="not-prose flex flex-col gap-3">
						<p className={LABEL_CLASS}>
							{shortDate(meta.date)} — {minutes} min read
						</p>
						<h1 className="text-[clamp(2rem,6vw,2.75rem)] leading-[1.12] font-semibold tracking-[-0.02em] text-ink">
							{meta.title}
						</h1>
						<p className="text-[1.0625rem] leading-relaxed text-mute">
							{meta.summary}
						</p>
					</header>

					<div className="mt-9 mb-10">
						<Toc blocks={blocks} />
					</div>

					<Blocks items={blocks} />
				</article>
			</main>

			<Dock />
		</div>
	);
}
