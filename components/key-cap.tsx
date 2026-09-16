import type { ReactNode } from "react";

const BASE =
	"relative inline-flex size-[22px] shrink-0 items-center justify-center rounded-[4px] bg-linear-to-b from-white to-stone-100 font-sans text-[11px] leading-none font-semibold text-ink transition-all duration-150 ease-out dark:from-neutral-700 dark:to-neutral-800";

const RESTING =
	"shadow-[inset_0_1px_0_rgb(255_255_255/0.95),inset_0_0_0_1px_rgb(0_0_0/0.07),inset_0_-2px_2px_rgb(0_0_0/0.05),0_1px_0_rgb(0_0_0/0.16),0_2px_4px_rgb(0_0_0/0.12)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.13),inset_0_0_0_1px_rgb(255_255_255/0.06),inset_0_-2px_2px_rgb(0_0_0/0.35),0_1px_0_rgb(0_0_0/0.75),0_2px_5px_rgb(0_0_0/0.5)]";

const PRESSED =
	"translate-y-px shadow-[inset_0_1px_0_rgb(255_255_255/0.6),inset_0_0_0_1px_rgb(0_0_0/0.09),inset_0_2px_3px_rgb(0_0_0/0.09),0_0_0_rgb(0_0_0/0.16)] dark:shadow-[inset_0_1px_0_rgb(255_255_255/0.06),inset_0_0_0_1px_rgb(255_255_255/0.07),inset_0_2px_3px_rgb(0_0_0/0.5),0_0_0_rgb(0_0_0/0.75)]";

export function KeyCap({
	children,
	pressed = false,
}: {
	children: ReactNode;
	pressed?: boolean;
}) {
	return (
		<span className={`${BASE} ${pressed ? PRESSED : RESTING}`}>
			{children}
		</span>
	);
}
