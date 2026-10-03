import { taste } from "@/lib/case-studies/content/taste";
import { readingMinutes } from "@/lib/case-studies/reading-time";
import type { Block, PostMeta } from "@/lib/case-studies/types";

export const posts = [
	{
		slug: "taste-is-the-new-moat",
		date: "2025-10-31",
		title: "Taste is the new moat",
		summary:
			"How I built Winterfell end to end in 23 days, and why taste matters more now that AI can write the code.",
		kind: "Winterfell",
		cover: {
			src: "/images/case-studies/taste/landing.png",
			alt: "The Winterfell landing page: a purple city of black towers behind the line “Ship Solana Contracts in Minutes not Months” and a prompt box.",
			width: 1920,
			height: 995,
		},
		facts: [
			{ name: "Build time", value: "23 days", label: "first commit to demo" },
			{ name: "Commits", value: "264", label: "in those 23 days" },
			{ name: "Prize", value: "$1,000", label: "Superteam hackathon" },
			{ name: "Services", value: "4 apps", label: "in one monorepo" },
		],
	},
] as const satisfies readonly PostMeta[];

export type Slug = (typeof posts)[number]["slug"];

export const bodies: Record<Slug, Block[]> = {
	"taste-is-the-new-moat": taste,
};

export function getPost(slug: string) {
	const meta = posts.find((post) => post.slug === slug);
	if (!meta) return null;

	const blocks = bodies[meta.slug];

	return { meta, blocks, minutes: readingMinutes(blocks) };
}

export function shortDate(iso: string) {
	const [year, month, day] = iso.split("-");
	return `${day}/${month}/${year.slice(2)}`;
}

export function monthYear(iso: string) {
	return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-GB", {
		month: "short",
		year: "numeric",
		timeZone: "UTC",
	});
}

export const postList = posts.map((post) => ({
	...post,
	minutes: readingMinutes(bodies[post.slug]),
	display: monthYear(post.date),
}));
