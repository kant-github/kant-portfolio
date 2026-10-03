import { createHighlighter, type Highlighter } from "shiki";
import { CodeBody } from "@/components/article/code-body";
import { CopyButton } from "@/components/article/copy-button";

const THEMES = { light: "min-light", dark: "vesper" } as const;
const LANGS = ["ts", "tsx", "js", "json", "bash", "sql"] as const;

type Lang = (typeof LANGS)[number];

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
	highlighterPromise ??= createHighlighter({
		themes: Object.values(THEMES),
		langs: [...LANGS],
	});

	return highlighterPromise;
}

function isSupported(lang: string): lang is Lang {
	return (LANGS as readonly string[]).includes(lang);
}

export async function CodeBlock({
	code,
	file,
	lang,
}: {
	code: string;
	file?: string;
	lang: string;
}) {
	const highlighter = await getHighlighter();

	const html = highlighter.codeToHtml(code, {
		lang: isSupported(lang) ? lang : "text",
		themes: THEMES,

		defaultColor: false,
	});

	return (
		<figure className="not-prose code-figure">
			<figcaption className="code-bar">
				<span className="min-w-0 truncate">{file ?? lang}</span>
				<span className="code-lang shrink-0">{lang}</span>
				<CopyButton code={code} />
			</figcaption>

			<CodeBody html={html} />
		</figure>
	);
}
