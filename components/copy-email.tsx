"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { RiCheckLine } from "react-icons/ri";
import { KeyCap } from "@/components/key-cap";
import { copyText } from "@/lib/clipboard";
import { profile } from "@/lib/data";

const RESET_DELAY = 2000;

const swap = {
	initial: { opacity: 0, scale: 0.5 },
	animate: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 0.5 },
	transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
} as const;

export function CopyEmail() {
	const [copied, setCopied] = useState(false);

	const copy = useCallback(async () => {
		setCopied(await copyText(profile.email));
	}, []);

	useEffect(() => {
		if (!copied) return;

		const timer = window.setTimeout(() => setCopied(false), RESET_DELAY);
		return () => window.clearTimeout(timer);
	}, [copied]);

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key.toLowerCase() !== "c") return;
			if (event.metaKey || event.ctrlKey || event.altKey) return;

			const target = event.target as HTMLElement | null;
			if (target?.closest("input, textarea, [contenteditable='true']"))
				return;

			event.preventDefault();
			void copy();
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [copy]);

	return (
		<div className="mt-7">
			<button
				type="button"
				onClick={() => void copy()}
				aria-label={`Copy ${profile.email} to clipboard`}
				className="inline-flex cursor-pointer items-center gap-1.5 text-left text-mute transition-opacity hover:opacity-70"
			>
				Press
				<KeyCap pressed={copied}>
					<AnimatePresence mode="wait" initial={false}>
						{copied ? (
							<motion.span
								key="done"
								{...swap}
								className="inline-flex"
							>
								<RiCheckLine className="size-[14px] text-green-500" />
							</motion.span>
						) : (
							<motion.span
								key="letter"
								{...swap}
								className="inline-flex"
							>
								C
							</motion.span>
						)}
					</AnimatePresence>
				</KeyCap>
				to copy my email
			</button>
		</div>
	);
}
