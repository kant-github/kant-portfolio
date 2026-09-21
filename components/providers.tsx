"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";

/**
 * reducedMotion="user" makes every framer animation in the tree respect the
 * OS setting, which replaces the per-component checks that used to be spread
 * around and were easy to forget.
 */
export function Providers({ children }: { children: ReactNode }) {
	return (
		<MotionConfig reducedMotion="user" transition={{ ease: [...EASE] }}>
			{children}
		</MotionConfig>
	);
}
