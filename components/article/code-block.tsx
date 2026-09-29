import { createHighlighter, type Highlighter } from "shiki";
import { CopyButton } from "@/components/article/copy-button";

const THEMES = { light: "vitesse-light", dark: "vitesse-dark" } as const;
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
				<span>{file ?? lang}</span>
				<span className="code-lang">{lang}</span>
				<CopyButton code={code} />
			</figcaption>

			<div
				className="code-body"
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</figure>
	);
}
