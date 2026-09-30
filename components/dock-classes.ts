/** Shared looks for the dock at the bottom and the social rail on the left. */

export const ICON_CLASS =
	"group/item relative cursor-pointer rounded-md p-1.5 text-neutral-500 transition-colors hover:bg-black/5 hover:text-neutral-900 focus-visible:outline-none dark:text-neutral-400 dark:hover:bg-white/6 dark:hover:text-neutral-100";

const TIP_BASE =
	"pointer-events-none invisible absolute rounded-lg bg-dock-tip px-2.5 py-1.5 font-mono text-[10px] leading-none tracking-label whitespace-nowrap text-dock-tip-ink uppercase opacity-0 shadow-dock-tip ring-1 ring-dock-tip-edge transition duration-200 ease-out group-hover/item:visible group-hover/item:scale-100 group-hover/item:opacity-100 group-focus-visible/item:visible group-focus-visible/item:scale-100 group-focus-visible/item:opacity-100";

/** Tooltip that pops up above the icon. */
export const TIP_CLASS = `${TIP_BASE} -top-9 left-1/2 -translate-x-1/2 translate-y-1 scale-95 group-hover/item:translate-y-0 group-focus-visible/item:translate-y-0`;

/** Tooltip that slides out to the right of the icon. */
export const TIP_RIGHT_CLASS = `${TIP_BASE} top-1/2 left-full ml-2.5 -translate-x-1 -translate-y-1/2 scale-95 group-hover/item:translate-x-0 group-focus-visible/item:translate-x-0`;

/** The frosted glass pill both bars sit in. */
export const PILL_CLASS =
	"pointer-events-auto rounded-[15px] border border-black/10 bg-white/85 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.18)] ring-1 ring-neutral-200/50 ring-offset-2 ring-offset-(--page) backdrop-blur-2xl ring-inset dark:border-white/4 dark:bg-neutral-950/85 dark:shadow-[0_12px_40px_-8px_rgba(0,0,0,0.55)] dark:ring-neutral-800/20";
