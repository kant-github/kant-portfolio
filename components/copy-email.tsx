"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import { RiCheckLine } from "react-icons/ri";
import { KeyCap } from "@/components/key-cap";
import { copyText } from "@/lib/clipboard";
import { profile } from "@/lib/data";

const RESET_DELAY = 2000;

type State = "idle" | "copied" | "failed";

const LABEL: Record<State, string> = {
	idle: "to copy my email",
	copied: "email copied to clipboard",
	failed: "the browser blocked the copy",
};

const swap = {
	initial: { opacity: 0, scale: 0.5 },
	animate: { opacity: 1, scale: 1 },
	exit: { opacity: 0, scale: 0.5 },
	transition: { duration: 0.16, ease: [0.22, 1, 0.36, 1] },
} as const;

export function CopyEmail() {
	const [state, setState] = useState<State>("idle");

	const copy = useCallback(async () => {
		setState((await copyText(profile.email)) ? "copied" : "failed");
	}, []);

	useEffect(() => {
		if (state === "idle") return;

		const timer = window.setTimeout(() => setState("idle"), RESET_DELAY);
		return () => window.clearTimeout(timer);
	}, [state]);

	useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key.toLowerCase() !== "c") return;
			if (event.metaKey || event.ctrlKey || event.altKey) return;

			// event.target is the document itself until something on the page
			// has been focused, and the document has no closest().
			const target = event.target;
			if (
				target instanceof Element &&
				target.closest("input, textarea, [contenteditable='true']")
			)
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
				{state === "idle" ? "Press" : null}
				<KeyCap pressed={state === "copied"}>
					<AnimatePresence mode="wait" initial={false}>
						{state === "copied" ? (
							<motion.span
								key="done"
								{...swap}
								className="inline-flex"
							>
								<RiCheckLine className="size-3.5 text-green-500" />
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
				<span aria-live="polite">{LABEL[state]}</span>
			</button>
		</div>
	);
}
