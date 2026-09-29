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
	date: string;
	title: string;
	summary: string;
	kind: string;
};
