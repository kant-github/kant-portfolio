"use client";

import { useEffect, useSyncExternalStore, type RefObject } from "react";
import { closeOverlay, openOverlay } from "@/lib/overlay-state";

const noop = () => () => {};

/** False on the server and during hydration, true once in the browser. */
export function useMounted() {
	return useSyncExternalStore(
		noop,
		() => true,
		() => false,
	);
}

export const FOCUSABLE =
	'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** Stops the page behind an overlay from scrolling, without a layout jump. */
export function useScrollLock(active: boolean) {
	useEffect(() => {
		if (!active) return;

		const { body, documentElement: root } = document;
		const gap = window.innerWidth - root.clientWidth;
		const previous = {
			overflow: body.style.overflow,
			paddingRight: body.style.paddingRight,
		};

		body.style.overflow = "hidden";
		if (gap > 0) body.style.paddingRight = `${gap}px`;

		return () => {
			body.style.overflow = previous.overflow;
			body.style.paddingRight = previous.paddingRight;
		};
	}, [active]);
}

/**
 * Marks an overlay as open for the rest of the page (the dock hides, the
 * keyboard shortcuts go quiet) and puts focus back where it was on close.
 */
export function useOverlay(open: boolean) {
	useEffect(() => {
		if (!open) return;

		openOverlay();
		document.documentElement.dataset.overlay = "open";

		return () => {
			closeOverlay();
			delete document.documentElement.dataset.overlay;
		};
	}, [open]);

	useEffect(() => {
		if (!open) return;

		const opener = document.activeElement;

		return () => {
			if (opener instanceof HTMLElement) opener.focus();
		};
	}, [open]);
}

/** Focus lands on the first control on open and Tab wraps inside the panel. */
export function useFocusTrap(
	panelRef: RefObject<HTMLElement | null>,
	open: boolean,
) {
	useEffect(() => {
		if (!open) return;

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key !== "Tab") return;

			const stops =
				panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
			if (!stops || stops.length === 0) return;

			const first = stops[0];
			const last = stops[stops.length - 1];

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, panelRef]);

	useEffect(() => {
		if (!open) return;

		const stops =
			panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE);
		stops?.[0]?.focus();
	}, [open, panelRef]);
}

export function useEscape(open: boolean, onClose: () => void) {
	useEffect(() => {
		if (!open) return;

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key !== "Escape") return;
			event.preventDefault();
			onClose();
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [open, onClose]);
}
