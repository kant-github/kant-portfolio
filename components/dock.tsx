"use client";

import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useState, type MouseEvent } from "react";
import {
	RiArrowUpLine,
	RiBriefcase4Fill,
	RiBuilding2Fill,
	RiImage2Fill,
	RiMoonFill,
	RiQuillPenFill,
	RiSunFill,
} from "react-icons/ri";
import { ScrollRing } from "@/components/scroll-ring";
import { switchTheme } from "@/lib/theme-switch";

type DockItem = {
	name: string;
	href: string;
	icon: typeof RiBriefcase4Fill;
};

const SECTIONS: DockItem[] = [
	{ name: "Work", href: "/#work", icon: RiBriefcase4Fill },
	{ name: "Experience", href: "/#experience", icon: RiBuilding2Fill },
	{ name: "Writing", href: "/#writing", icon: RiQuillPenFill },
	{ name: "Personal", href: "/#personal", icon: RiImage2Fill },
];

const BUTTON_CLASS =
	"group/item relative flex size-7 items-center justify-center rounded-md text-dock-ink transition duration-200 ease-out hover:bg-dock-hover hover:text-dock-ink-hot focus-visible:bg-dock-hover focus-visible:text-dock-ink-hot focus-visible:outline-none active:translate-y-0 sm:size-8";

const TIP_CLASS =
	"pointer-events-none invisible absolute -top-8 left-1/2 -translate-x-1/2 translate-y-1 scale-95 rounded-lg bg-dock-tip px-2.5 py-1.5 font-mono text-[10px] leading-none tracking-label whitespace-nowrap text-dock-tip-ink uppercase opacity-0 shadow-dock-tip ring-1 ring-dock-tip-edge transition duration-200 ease-out group-hover/item:visible group-hover/item:translate-y-0 group-hover/item:scale-100 group-hover/item:opacity-100 group-focus-visible/item:visible group-focus-visible/item:translate-y-0 group-focus-visible/item:scale-100 group-focus-visible/item:opacity-100";

const GLIDE = {
	type: "spring",
	stiffness: 420,
	damping: 34,
	mass: 0.6,
} as const;

const DIVIDER_CLASS =
	"mx-1 h-4 w-px bg-linear-to-b from-dock-divider-top to-dock-divider-bottom";

export function Dock() {
	const [hovered, setHovered] = useState<string | null>(null);
	const { setTheme } = useTheme();

	function toggleTheme(event: MouseEvent<HTMLButtonElement>) {
		const rect = event.currentTarget.getBoundingClientRect();
		const dark = document.documentElement.classList.contains("dark");

		switchTheme(
			dark ? "light" : "dark",
			rect.left + rect.width / 2,
			rect.top + rect.height / 2,
			setTheme,
		);
	}

	const glider = (
		<motion.span
			layoutId="dock-glider"
			transition={GLIDE}
			className="absolute inset-0 z-0 rounded-md bg-dock-hover"
		/>
	);

	return (
		<div className="dock-in pointer-events-none fixed inset-x-0 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4">
			<nav
				aria-label="Sections"
				onPointerLeave={() => setHovered(null)}
				className="dock-surface dock-edge pointer-events-auto relative flex items-center gap-0.5 rounded-shot p-1 shadow-dock"
			>
				{SECTIONS.map((item) => {
					const Icon = item.icon;

					return (
						<a
							key={item.name}
							href={item.href}
							aria-label={item.name}
							className={BUTTON_CLASS}
							onPointerEnter={() => setHovered(item.name)}
							onFocus={() => setHovered(item.name)}
						>
							{hovered === item.name ? glider : null}
							<Icon
								className="relative z-10 size-3.5 sm:size-4"
								aria-hidden="true"
							/>
							<span className={TIP_CLASS}>{item.name}</span>
						</a>
					);
				})}

				<span className={DIVIDER_CLASS} aria-hidden="true" />

				<a
					href="/#top"
					aria-label="Back to top"
					className={BUTTON_CLASS}
					onPointerEnter={() => setHovered("top")}
					onFocus={() => setHovered("top")}
				>
					{hovered === "top" ? glider : null}
					<ScrollRing />
					<RiArrowUpLine
						className="relative z-10 size-3 sm:size-3.5"
						aria-hidden="true"
					/>
					<span className={TIP_CLASS}>Back to top</span>
				</a>

				<span className={DIVIDER_CLASS} aria-hidden="true" />

				<button
					type="button"
					aria-label="Switch between light and dark mode"
					className={`${BUTTON_CLASS} cursor-pointer`}
					onClick={toggleTheme}
					onPointerEnter={() => setHovered("theme")}
					onFocus={() => setHovered("theme")}
				>
					{hovered === "theme" ? glider : null}
					<RiMoonFill
						className="relative z-10 size-3.5 sm:size-4 dark:hidden"
						aria-hidden="true"
					/>
					<RiSunFill
						className="relative z-10 hidden size-3.5 sm:size-4 dark:block"
						aria-hidden="true"
					/>
					<span className={TIP_CLASS}>
						<span className="dark:hidden">Dark mode</span>
						<span className="hidden dark:inline">Light mode</span>
					</span>
				</button>
			</nav>
		</div>
	);
}
