import type { Block } from "@/lib/case-studies/types";

const WORDS_PER_MINUTE = 200;
const SECONDS_PER_FIGURE = 12;
const SECONDS_PER_CODE_BLOCK = 20;

function countWords(text: string) {
	return text.trim().split(/\s+/).filter(Boolean).length;
}

function countAll(texts: string[]) {
	return texts.reduce((sum, text) => sum + countWords(text), 0);
}

export function readingMinutes(blocks: Block[]) {
	let words = 0;
	let seconds = 0;

	for (const block of blocks) {
		switch (block.type) {
			case "p":
			case "h3":
			case "quote":
				words += countWords(block.text);
				break;
			case "chapter":
				words += countWords(block.title);
				break;
			case "list":
			case "takeaways":
				words += countAll(block.items);
				break;
			case "callout":
				words += countWords(block.title) + countWords(block.text);
				break;
			case "compare":
				words += countAll([...block.left.items, ...block.right.items]);
				break;
			case "steps":
				words += countAll(
					block.items.flatMap((item) => [item.title, item.text]),
				);
				break;
			case "timeline":
				words += countAll(
					block.items.flatMap((item) => [item.title, item.text]),
				);
				break;
			case "code":
				seconds += SECONDS_PER_CODE_BLOCK;
				break;
			case "diagram":
			case "shot":
				seconds += SECONDS_PER_FIGURE;
				words += countWords(block.caption ?? "");
				words += countAll(
					block.type === "shot"
						? (block.notes ?? []).map((note) => note.text)
						: [],
				);
				break;
		}
	}

	const totalSeconds = (words / WORDS_PER_MINUTE) * 60 + seconds;

	return Math.max(1, Math.round(totalSeconds / 60));
}
