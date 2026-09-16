"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";
import {
	RiGithubFill,
	RiLinkedinFill,
	RiMailFill,
	RiTwitterXFill,
} from "react-icons/ri";
import { HoverPill } from "@/components/hover-pill";
import { ThemeToggle } from "@/components/theme-toggle";
import { profile, socials } from "@/lib/data";

const links = [
	{ label: "Email", href: `mailto:${profile.email}`, Icon: RiMailFill },
	{ label: "GitHub", href: socials.github, Icon: RiGithubFill },
	{ label: "LinkedIn", href: socials.linkedin, Icon: RiLinkedinFill },
	{ label: "X", href: socials.x, Icon: RiTwitterXFill },
];

const THEME_ITEM = "theme";

export function Dock() {
	const prefersReducedMotion = useReducedMotion();
	const [hovered, setHovered] = useState<string | null>(null);

	return (
		<div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2">
			<motion.nav
				aria-label="Site actions"
				initial={
					prefersReducedMotion
						? false
						: { opacity: 0, y: 16, filter: "blur(8px)" }
				}
				animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
				transition={{
					duration: 0.5,
					delay: 0.2,
					ease: [0.22, 1, 0.36, 1],
				}}
				onMouseLeave={() => setHovered(null)}
				className="pointer-events-auto flex items-center gap-2 rounded-2xl bg-linear-to-br from-white to-stone-100 p-1 shadow-[inset_1px_1px_0_rgb(255_255_255/0.5),0_1px_1px_rgb(0_0_0/0.04),0_4px_12px_rgb(0_0_0/0.06),0_16px_40px_rgb(0_0_0/0.1)] dark:from-neutral-900 dark:to-neutral-950 dark:shadow-[inset_1px_1px_0_rgb(255_255_255/0.055),0_1px_1px_rgb(0_0_0/0.3),0_4px_14px_rgb(0_0_0/0.35),0_16px_44px_rgb(0_0_0/0.45)]"
			>
				<ThemeToggle
					hovered={hovered === THEME_ITEM}
					onHover={(on) => setHovered(on ? THEME_ITEM : null)}
				/>

				<span
					aria-hidden
					className="h-6 w-px shrink-0 rounded-full bg-linear-to-b from-transparent via-black/12 to-transparent dark:via-white/16"
				/>

				<div className="flex items-center gap-0.5">
					{links.map(({ label, href, Icon }) => (
						<a
							key={label}
							href={href}
							aria-label={label}
							target={
								href.startsWith("mailto:")
									? undefined
									: "_blank"
							}
							rel="noreferrer"
							onMouseEnter={() => setHovered(label)}
							onFocus={() => setHovered(label)}
							onBlur={() => setHovered(null)}
							className="relative cursor-pointer rounded-xl p-2 text-mute transition-all duration-200 hover:text-ink active:scale-95"
						>
							{hovered === label ? <HoverPill /> : null}
							<Icon className="relative size-4" />
						</a>
					))}
				</div>
			</motion.nav>
		</div>
	);
}
