import type { Block } from "@/lib/writing/types";

export const mindset: Block[] = [
	{
		type: "p",
		text: "I have shipped things that worked perfectly and were still failures. Not because the code was bad, but because I had built a project when what was needed was a product. They look identical while you are making them. They stop looking identical the week after.",
	},

	{ type: "h2", text: "The difference in one line", id: "the-difference" },
	{
		type: "p",
		text: "A project is finished when it works. A product is finished when people keep using it — which means it is never really finished.",
	},
	{
		type: "diagram",
		name: "line-vs-loop",
		caption: "One has an end you can point at. The other only has a next round.",
		wide: true,
	},
	{
		type: "p",
		text: "That sounds like a quote for a slide, so here is what it actually changes.",
	},

	{ type: "h2", text: "It changes what you build", id: "what-you-build" },
	{
		type: "p",
		text: "A project optimises for the demo. The demo is a controlled five minutes: known data, a happy path, someone who knows where not to click. Everything I build for that moment is aimed at the moment.",
	},
	{
		type: "p",
		text: "A product optimises for the second week. The novelty has worn off, the data is messy, and the person using it is tired and did not read anything. Nobody is impressed any more. The only thing left is whether it is useful.",
	},
	{
		type: "p",
		text: "Concretely, the second week is where empty states, error messages, the fifth time you do the same task, and what happens on a bad connection all start to matter. None of those show up in a demo. All of them decide whether someone comes back.",
	},

	{ type: "h2", text: "It changes what you cut", id: "what-you-cut" },
	{
		type: "p",
		text: "On a project you cut whatever is slowing you down. The deadline is the boss and anything not on the path to it goes.",
	},
	{
		type: "p",
		text: "On a product you cut whatever nobody uses. That is a much harder thing to do, because it is usually something you were proud of. Deleting a feature you spent three weeks on, because the numbers say four people touched it, is the least fun part of this and probably the most valuable.",
	},
	{
		type: "callout",
		tone: "note",
		title: "Every feature has rent",
		text: "A shipped feature is not free after it ships. It has to be maintained, tested, documented, and carried through every future change. A feature nobody uses is not neutral — it is a small tax on everything you do next.",
	},
	{
		type: "image",
		src: "/images/writing/memes/one-more-feature.jpg",
		alt: "The Boromir meme from Lord of the Rings: a man holding up one hand as he begins to speak.",
		caption: "One does not simply ship a feature and stop paying for it.",
		width: 568,
		height: 335,
	},

	{ type: "h2", text: "It changes what done means", id: "what-done-means" },
	{
		type: "p",
		text: "On a project, done is the merge. On a product, the merge is roughly the middle. After it there is watching whether anyone uses it, finding out they use it differently than you expected, and fixing the thing you only learn by watching.",
	},
	{
		type: "p",
		text: "This is why I stopped treating \"it works\" as the finish line. It works is table stakes. The real questions come after: does anyone reach for it, does it hold up when it is busy, and can the next person understand it six months from now.",
	},

	{ type: "h2", text: "The test I use", id: "the-test" },
	{
		type: "p",
		text: "The most useful habit I have picked up is one question:",
	},
	{
		type: "quote",
		text: "Who breaks if this disappears tomorrow?",
	},
	{
		type: "p",
		text: "If I can name them, it is a product, and it deserves the boring work — monitoring, error handling, a migration path, documentation someone else can follow.",
	},
	{
		type: "p",
		text: "If the answer is nobody, it was a project. That is completely fine. Projects are how you learn, and most of what I know came from building things nobody depended on. The mistake is not building projects. The mistake is giving a project product-level effort, or shipping a product with project-level care.",
	},

	{ type: "h2", text: "Why this matters for the engineering", id: "why-it-matters" },
	{
		type: "p",
		text: "This is not really a philosophy post. It decides technical choices.",
	},
	{
		type: "list",
		items: [
			"A project can hold state in memory. A product has to survive a restart.",
			"A project can skip the migration. A product has data that already exists and cannot be dropped.",
			"A project can log to the console. A product needs to tell you it is unhealthy before a user does.",
			"A project can be understood because you just wrote it. A product has to be understood by whoever is on call at 2am.",
		],
	},
	{
		type: "p",
		text: "Every one of those is a real trade-off with a real cost. Knowing which of the two you are building is what tells you whether paying that cost is discipline or waste.",
	},

	{
		type: "takeaways",
		items: [
			"A project is done when it works. A product is done when people keep using it, so it never is.",
			"Projects optimise for the demo. Products optimise for the second week, when only usefulness is left.",
			"On a project you cut what slows you down. On a product you cut what nobody uses — much harder.",
			"Every shipped feature charges rent in maintenance forever.",
			"Ask who breaks if this disappears. If you can name them, do the boring work.",
			"The mistake is not building projects. It is mismatching the effort to the thing.",
		],
	},
];
