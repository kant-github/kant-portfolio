import type { ReactNode } from "react";

const PATTERN = /(`[^`]+`|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

export function Inline({ text }: { text: string }) {
	const parts = text.split(PATTERN).filter((part) => part !== "");

	return (
		<>
			{parts.map((part, index) => {
				const key = `${index}-${part.slice(0, 12)}`;

				if (part.startsWith("`") && part.endsWith("`")) {
					return <code key={key}>{part.slice(1, -1)}</code>;
				}

				if (part.startsWith("**") && part.endsWith("**")) {
					return <strong key={key}>{part.slice(2, -2)}</strong>;
				}

				const link = /^\[([^\]]+)\]\(([^)]+)\)$/.exec(part);
				if (link) {
					const [, label, href] = link;
					const external = href.startsWith("http");

					return (
						<a
							key={key}
							href={href}
							target={external ? "_blank" : undefined}
							rel={external ? "noreferrer" : undefined}
						>
							{label}
						</a>
					);
				}

				return <span key={key}>{part}</span>;
			})}
		</>
	);
}

export function InlineText({ text }: { text: string }): ReactNode {
	return <Inline text={text} />;
}
