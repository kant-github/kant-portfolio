"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<MotionConfig reducedMotion="user" transition={{ ease: [...EASE] }}>
			{children}
		</MotionConfig>
	);
}
