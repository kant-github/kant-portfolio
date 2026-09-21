import type { Block } from "@/lib/writing/types";

const WORDS_PER_MINUTE = 200;
const SECONDS_PER_FIGURE = 12;
const SECONDS_PER_CODE_BLOCK = 20;

function countWords(text: string) {
	return text.trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Derived from the body rather than typed by hand, which is how the old
 * numbers drifted (four short paragraphs were labelled "6 m").
 */
export function readingMinutes(blocks: Block[]) {
	let words = 0;
	let seconds = 0;

	for (const block of blocks) {
		switch (block.type) {
			case "p":
			case "h2":
			case "h3":
				words += countWords(block.text);
				break;
			case "quote":
				words += countWords(block.text);
				break;
			case "list":
			case "takeaways":
				words += block.items.reduce((sum, item) => sum + countWords(item), 0);
				break;
			case "callout":
				words += countWords(block.title) + countWords(block.text);
				break;
			case "stat":
				words += countWords(block.label) + countWords(block.note ?? "");
				break;
			case "code":
				seconds += SECONDS_PER_CODE_BLOCK;
				break;
			case "diagram":
			case "image":
				seconds += SECONDS_PER_FIGURE;
				words += countWords(
					block.type === "diagram" ? block.caption : (block.caption ?? ""),
				);
				break;
		}
	}

	const totalSeconds = (words / WORDS_PER_MINUTE) * 60 + seconds;

	return Math.max(1, Math.round(totalSeconds / 60));
}
