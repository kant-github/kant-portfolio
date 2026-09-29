let openCount = 0;

export function openOverlay() {
	openCount += 1;
}

export function closeOverlay() {
	openCount = Math.max(0, openCount - 1);
}

export function isOverlayOpen() {
	return openCount > 0;
}
