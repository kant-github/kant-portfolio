"use client";

import { useTheme } from "next-themes";
import {
	useEffect,
	useId,
	useLayoutEffect,
	useRef,
	useState,
	type MouseEvent,
} from "react";
import {
	RiBriefcase4Fill,
	RiBuilding2Fill,
	RiImage2Fill,
	RiQuillPenFill,
} from "react-icons/ri";
import { ScrollRing } from "@/components/scroll-ring";
import { ThemeIcon } from "@/components/theme-icon";
import { switchTheme } from "@/lib/theme-switch";

type DockItem = {
	id: string;
	name: string;
	icon: typeof RiBriefcase4Fill;
};

const SECTIONS: DockItem[] = [
	{ id: "work", name: "Work", icon: RiBriefcase4Fill },
	{ id: "experience", name: "Experience", icon: RiBuilding2Fill },
	{ id: "writing", name: "Writing", icon: RiQuillPenFill },
	{ id: "personal", name: "Personal", icon: RiImage2Fill },
];

const TEXT_CLASS = "text-xs font-medium text-neutral-900 dark:text-neutral-200";

const ICON_CLASS =
	"group/item relative cursor-pointer rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-black/5 hover:text-neutral-900 focus-visible:outline-none dark:text-neutral-400 dark:hover:bg-white/6 dark:hover:text-neutral-100";

const TIP_CLASS =
	"pointer-events-none invisible absolute -top-9 left-1/2 -translate-x-1/2 translate-y-1 scale-95 rounded-lg bg-dock-tip px-2.5 py-1.5 font-mono text-[10px] leading-none tracking-label whitespace-nowrap text-dock-tip-ink uppercase opacity-0 shadow-dock-tip ring-1 ring-dock-tip-edge transition duration-200 ease-out group-hover/item:visible group-hover/item:translate-y-0 group-hover/item:scale-100 group-hover/item:opacity-100 group-focus-visible/item:visible group-focus-visible/item:translate-y-0 group-focus-visible/item:scale-100 group-focus-visible/item:opacity-100";

/** A thin column of dots between the dock's three parts. */
function Divider() {
	const id = useId().replace(/:/g, "");

	return (
		<div
			className="relative h-8 w-3 shrink-0 self-center"
			aria-hidden="true"
		>
			<svg
				className="pointer-events-none absolute inset-y-0 left-1/2 block h-full w-[3px] -translate-x-1/2"
				preserveAspectRatio="none"
			>
				<defs>
					<pattern
						id={id}
						width="4"
						height="6"
						patternUnits="userSpaceOnUse"
					>
						<circle
							cx="2"
							cy="3"
							r="1"
							className="fill-neutral-300 dark:fill-neutral-700"
						/>
					</pattern>
				</defs>
				<rect width="100%" height="100%" fill={`url(#${id})`} />
			</svg>
		</div>
	);
}

/**
 * The name of the section the reader is in: the last one whose top has
 * passed about a third of the way down the screen. Pages without these
 * sections read "Top".
 */
function useCurrentSection() {
	const [current, setCurrent] = useState("Top");

	useEffect(() => {
		const update = () => {
			const line = window.innerHeight * 0.35;
			const root = document.documentElement;
			// the last section can be too short to ever reach the line, so the
			// bottom of the page counts as being in it
			const atBottom =
				window.scrollY + window.innerHeight >= root.scrollHeight - 2;
			let name = "Top";

			for (const section of SECTIONS) {
				const node = document.getElementById(section.id);
				if (node && node.getBoundingClientRect().top <= line) {
					name = section.name;
				}
			}

			if (atBottom && document.getElementById(SECTIONS.at(-1)!.id)) {
				name = SECTIONS.at(-1)!.name;
			}

			setCurrent(name);
		};

		update();
		window.addEventListener("scroll", update, { passive: true });
		window.addEventListener("resize", update);

		return () => {
			window.removeEventListener("scroll", update);
			window.removeEventListener("resize", update);
		};
	}, []);

	return current;
}

/**
 * The section name next to the ring. Its box is exactly as wide as the word,
 * so the whole dock grows and shrinks with it. The width eases from one word
 * to the next instead of jumping, and the new word fades in.
 */
function SectionLabel({ text }: { text: string }) {
	const measure = useRef<HTMLSpanElement>(null);
	const [width, setWidth] = useState<number>();

	useLayoutEffect(() => {
		if (measure.current) {
			setWidth(measure.current.offsetWidth);
		}
	}, [text]);

	return (
		<span
			className="relative block h-4 overflow-hidden transition-[width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]"
			style={{ width }}
		>
			{/* invisible copy that sets the width to aim for */}
			<span
				ref={measure}
				aria-hidden="true"
				className={`${TEXT_CLASS} invisible absolute whitespace-nowrap`}
			>
				{text}
			</span>

			<span
				key={text}
				className={`${TEXT_CLASS} dock-label-in absolute top-0 left-0 leading-4 whitespace-nowrap transition-colors hover:text-neutral-500 dark:hover:text-neutral-400`}
			>
				{text}
			</span>
		</span>
	);
}

export function Dock() {
	const { setTheme } = useTheme();
	const current = useCurrentSection();

	// read from <html> rather than React state: the class is the truth, and it
	// is already right on the first click, before next-themes has hydrated
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

	return (
		<div className="pointer-events-none fixed inset-x-0 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-50 flex justify-center px-4">
			<nav
				aria-label="Sections"
				className="dock-in pointer-events-auto flex flex-col rounded-[15px] border border-black/10 bg-white/85 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.18)] ring-1 ring-neutral-200/50 ring-offset-2 ring-offset-(--page) backdrop-blur-2xl ring-inset dark:border-white/4 dark:bg-neutral-950/85 dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.55)] dark:ring-neutral-800/20"
			>
				<div className="flex items-center justify-center gap-2 p-1">
					{/* The icon reads the theme from the class on <html>, so the
					    server HTML is right whichever theme loads. */}
					<button
						type="button"
						aria-label="Switch between light and dark mode"
						onClick={toggleTheme}
						className={`${ICON_CLASS} ml-1`}
					>
						<ThemeIcon className="size-4" />
						<span className={TIP_CLASS}>
							<span className="dark:hidden">Dark mode</span>
							<span className="hidden dark:inline">
								Light mode
							</span>
						</span>
					</button>

					<Divider />

					<a
						href="#top"
						aria-label="Back to top"
						className="flex items-center gap-2 pl-0.5"
					>
						<ScrollRing />
						<SectionLabel text={current} />
					</a>

					<Divider />

					<div className="-ml-1 flex items-center gap-1 pr-2 pl-1">
						{SECTIONS.map((item) => {
							const Icon = item.icon;

							return (
								<a
									key={item.id}
									href={`/#${item.id}`}
									aria-label={item.name}
									className={ICON_CLASS}
								>
									<Icon
										className="size-4"
										aria-hidden="true"
									/>
									<span className={TIP_CLASS}>
										{item.name}
									</span>
								</a>
							);
						})}
					</div>
				</div>
			</nav>
		</div>
	);
}
