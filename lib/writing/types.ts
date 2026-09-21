/**
 * Article bodies are typed blocks rather than markdown or MDX. It keeps the
 * repo's "change the data, not the components" convention, every block is
 * type-checked, and a diagram can be a real React component instead of a
 * string the renderer has to interpret.
 *
 * Inline text in `p`, `list`, `callout` and `quote` supports a tiny markup the
 * renderer parses: `code`, **bold**, and [label](href). Nothing else — no
 * tables, no footnotes, no nested lists.
 */

export type DiagramName =
	| "ws-one-server"
	| "ws-two-servers"
	| "ws-redis"
	| "traffic-peaks"
	| "cache-hierarchy"
	| "circuit-breaker"
	| "latency-budget"
	| "line-vs-loop";

export type Block =
	| { type: "p"; text: string }
	| { type: "h2"; text: string; id: string }
	| { type: "h3"; text: string }
	| { type: "list"; ordered?: boolean; items: string[] }
	| { type: "code"; lang: string; file?: string; code: string }
	| { type: "diagram"; name: DiagramName; caption: string; wide?: boolean }
	| {
			type: "image";
			src: string;
			alt: string;
			caption?: string;
			width: number;
			height: number;
	  }
	| { type: "callout"; tone: "note" | "warn"; title: string; text: string }
	| { type: "quote"; text: string }
	| { type: "stat"; value: string; label: string; note?: string }
	| { type: "takeaways"; items: string[] };

export type PostMeta = {
	slug: string;
	/** ISO date, so it can be sorted and formatted. */
	date: string;
	title: string;
	/** One sentence. Used for the article intro and the page description. */
	summary: string;
};
