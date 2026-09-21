import { mindset } from "@/lib/writing/content/mindset";
import { requests } from "@/lib/writing/content/requests";
import { websockets } from "@/lib/writing/content/websockets";
import { readingMinutes } from "@/lib/writing/reading-time";
import type { Block, PostMeta } from "@/lib/writing/types";

export const posts = [
	{
		slug: "scaling-websockets-with-redis",
		date: "2025-09-12",
		title: "Scaling WebSockets past one server",
		summary:
			"One server is easy. The second one breaks your room in a way that never throws an error.",
	},
	{
		slug: "400-million-requests",
		date: "2025-08-28",
		title: "What 400 million requests a day actually looks like",
		summary:
			"Divide the number, size for the peak, and spend most of your effort avoiding work.",
	},
	{
		slug: "project-vs-product",
		date: "2025-07-14",
		title: "Project mindset vs product mindset",
		summary:
			"A project is done when it works. A product is done when people keep using it.",
	},
] as const satisfies readonly PostMeta[];

export type Slug = (typeof posts)[number]["slug"];

/**
 * Keyed by the slug union, so adding a post without a body — the old silent
 * build-time 404 — is now a compile error.
 */
export const bodies: Record<Slug, Block[]> = {
	"scaling-websockets-with-redis": websockets,
	"400-million-requests": requests,
	"project-vs-product": mindset,
};

export function getPost(slug: string) {
	const meta = posts.find((post) => post.slug === slug);
	if (!meta) return null;

	const blocks = bodies[meta.slug];

	return { meta, blocks, minutes: readingMinutes(blocks) };
}

/** DD/MM/YY, matching the rest of the site. */
export function shortDate(iso: string) {
	const [year, month, day] = iso.split("-");
	return `${day}/${month}/${year.slice(2)}`;
}

export const postList = posts.map((post) => ({
	...post,
	minutes: readingMinutes(bodies[post.slug]),
	display: shortDate(post.date),
}));
