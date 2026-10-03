import { isOverlayOpen } from "@/lib/overlay-state";

/** True when a key press should be left alone: typing, shortcuts, overlays. */
export function isReservedKey(event: KeyboardEvent) {
	if (event.metaKey || event.ctrlKey || event.altKey) return true;
	if (isOverlayOpen()) return true;

	const target = event.target;
	return (
		target instanceof Element &&
		target.closest("input, textarea, select, [contenteditable='true']") !==
			null
	);
}

/** Scrolls a chapter heading into view and keeps the URL hash in step. */
export function jumpToChapter(id: string) {
	const heading = document.getElementById(id);
	if (!heading) return;

	heading.scrollIntoView({ block: "start" });
	history.replaceState(null, "", `#${id}`);
}

/** Maps a digit key to a chapter index: 1–9 → 0–8, 0 → 9. */
export function chapterIndexForKey(key: string) {
	if (!/^[0-9]$/.test(key)) return null;
	return key === "0" ? 9 : Number(key) - 1;
}
