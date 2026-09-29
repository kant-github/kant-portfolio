/**
 * One flag, so a component that owns a global key shortcut can tell whether a
 * modal is open without importing the modal — or knowing it exists.
 *
 * Deliberately a module-level variable rather than context: the consumer
 * ([copy-email.tsx](../components/copy-email.tsx)) reads it inside a keydown
 * handler, where a re-render is neither needed nor wanted.
 */
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
