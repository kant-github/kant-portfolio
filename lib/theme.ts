"use client";

import { useCallback, useSyncExternalStore } from "react";

export type Theme = "light" | "dark";

function subscribe(onStoreChange: () => void) {
	const observer = new MutationObserver(onStoreChange);

	observer.observe(document.documentElement, {
		attributes: true,
		attributeFilter: ["class"],
	});

	return () => observer.disconnect();
}

function getSnapshot(): Theme {
	return document.documentElement.classList.contains("dark")
		? "dark"
		: "light";
}

function getServerSnapshot(): null {
	return null;
}

export function useTheme() {
	const theme = useSyncExternalStore(
		subscribe,
		getSnapshot,
		getServerSnapshot,
	);

	const toggle = useCallback(() => {
		const next: Theme = document.documentElement.classList.contains("dark")
			? "light"
			: "dark";

		document.documentElement.classList.toggle("dark", next === "dark");
		localStorage.setItem("theme", next);
	}, []);

	return { theme, toggle };
}
