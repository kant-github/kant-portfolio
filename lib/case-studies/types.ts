export type DiagramName =
	| "line-vs-loop"
	| "iceberg"
	| "winterfell-pipeline"
	| "commit-timeline";

/** A numbered pin on a screenshot. x and y are percentages of the image. */
export type Note = {
	x: number;
	y: number;
	title: string;
	text: string;
};

export type Block =
	| { type: "p"; text: string }
	| { type: "chapter"; n: number; title: string; short?: string; id: string }
	| { type: "h3"; text: string }
	| { type: "list"; ordered?: boolean; items: string[] }
	| { type: "code"; lang: string; file?: string; code: string }
	| { type: "diagram"; name: DiagramName; caption: string; wide?: boolean }
	| {
			type: "shot";
			src: string;
			alt: string;
			caption?: string;
			width: number;
			height: number;
			wide?: boolean;
			notes?: Note[];
	  }
	| {
			type: "compare";
			left: { title: string; items: string[] };
			right: { title: string; items: string[] };
	  }
	| { type: "steps"; items: { title: string; text: string }[] }
	| {
			type: "timeline";
			items: { when: string; title: string; text: string }[];
	  }
	| { type: "callout"; tone: "note" | "warn"; title: string; text: string }
	| { type: "quote"; text: string; by?: string }
	| { type: "takeaways"; items: string[] };

export type Fact = { name: string; value: string; label: string };

export type PostMeta = {
	slug: string;
	date: string;
	title: string;
	summary: string;
	kind: string;
	cover: { src: string; alt: string; width: number; height: number };
	facts: Fact[];
};
