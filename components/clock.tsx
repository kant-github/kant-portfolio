"use client";

import { useSyncExternalStore } from "react";

let snapshot = 0;

function subscribe(onChange: () => void) {
	snapshot = Date.now();
	onChange();

	const id = window.setInterval(() => {
		snapshot = Date.now();
		onChange();
	}, 1000);

	return () => window.clearInterval(id);
}

function getSnapshot() {
	return snapshot;
}

function getServerSnapshot() {
	return 0;
}

function pad(value: number) {
	return value.toString().padStart(2, "0");
}

export function Clock() {
	const now = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

	if (!now) return <span>--&nbsp;:&nbsp;--&nbsp;:&nbsp;-- UTC</span>;

	const date = new Date(now);
	const time = [
		date.getUTCHours(),
		date.getUTCMinutes(),
		date.getUTCSeconds(),
	]
		.map(pad)
		.join(" : ");

	return (
		<span suppressHydrationWarning>
			{time}
			&nbsp;UTC
		</span>
	);
}
