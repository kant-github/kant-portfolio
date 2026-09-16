"use client";

import { motion } from "framer-motion";

export function HoverPill() {
	return (
		<motion.span
			aria-hidden
			layoutId="dockHover"
			className="absolute inset-0 rounded-xl bg-ink/[0.06]"
			transition={{
				type: "spring",
				stiffness: 210,
				damping: 22,
				mass: 1.2,
			}}
		/>
	);
}
