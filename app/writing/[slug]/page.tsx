import Link from "next/link";
import { notFound } from "next/navigation";
import { posts } from "@/lib/data";
import { postBodies } from "@/lib/posts";

export function generateStaticParams() {
	return posts.map((post) => ({ slug: post.slug }));
}

export default async function WritingPost({
	params,
}: PageProps<"/writing/[slug]">) {
	const { slug } = await params;
	const post = posts.find((item) => item.slug === slug);
	const body = postBodies[slug];

	if (!post || !body) notFound();

	return (
		<div className="flex min-h-screen w-full justify-center">
			<main className="flex w-full max-w-160 flex-col gap-10 px-4 py-10">
				<Link
					href="/"
					className="font-mono text-xs tracking-label text-mute uppercase transition-opacity hover:opacity-70"
				>
					← Back
				</Link>

				<article className="flex flex-col gap-6">
					<header className="flex flex-col gap-2">
						<p className="font-mono text-xs tracking-label text-mute uppercase">
							{post.date} — {post.minutes} m
						</p>
						<h1 className="text-ink">{post.title}</h1>
					</header>

					{body.map((paragraph) => (
						<p key={paragraph.slice(0, 40)} className="text-mute">
							{paragraph}
						</p>
					))}
				</article>
			</main>
		</div>
	);
}
