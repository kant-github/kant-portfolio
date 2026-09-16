"use client";

import { useCallback, useSyncExternalStore } from "react";
import {
	getServerMuted,
	isMuted,
	setMuted,
	subscribeMuted,
} from "@/lib/sargam";

export function useSound() {
	const muted = useSyncExternalStore(subscribeMuted, isMuted, getServerMuted);

	const toggle = useCallback(() => {
		setMuted(!isMuted());
	}, []);

	return { muted, toggle };
}
