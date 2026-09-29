"use client";

import { MotionConfig } from "framer-motion";
import { ThemeProvider } from "next-themes";
import type { ReactNode } from "react";
import { EASE } from "@/lib/motion";

export function Providers({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="dark"
			enableSystem={false}
			disableTransitionOnChange
		>
			<MotionConfig reducedMotion="user" transition={{ ease: [...EASE] }}>
				{children}
			</MotionConfig>
		</ThemeProvider>
	);
}
