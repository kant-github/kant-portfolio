import { createHighlighter, type Highlighter } from "shiki";
import { CopyButton } from "@/components/article/copy-button";

/**
 * Shiki uses real VS Code themes and TextMate grammars, so the colouring is
 * the same as the editor rather than a regex guess. It runs here in a Server
 * Component, which means the highlighting happens at build time and ships as
 * static HTML — no highlighting code reaches the browser.
 *
 * vitesse-dark is the closest fit for this site: its background is #121212
 * against the page's #0d0d0d, and its palette is muted rather than the
 * primary-colour rainbow most editor themes use.
 */
const THEME = "vitesse-dark";
const LANGS = ["ts", "tsx", "js", "json", "bash", "sql"] as const;

type Lang = (typeof LANGS)[number];

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter() {
	// Loading the grammars once per build rather than once per snippet.
	highlighterPromise ??= createHighlighter({
		themes: [THEME],
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
		theme: THEME,
	});

	return (
		<figure className="not-prose code-figure">
			<figcaption className="code-bar">
				<span>{file ?? lang}</span>
				<span className="code-lang">{lang}</span>
				<CopyButton code={code} />
			</figcaption>

			{/* shiki returns its own <pre><code>; the CSS below strips its
			    background so the block sits on the site's surface instead. */}
			<div
				className="code-body"
				// biome-ignore lint/security/noDangerouslySetInnerHtml: build-time shiki output
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</figure>
	);
}
