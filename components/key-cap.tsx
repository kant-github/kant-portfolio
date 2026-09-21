import type { ReactNode } from "react";

const BASE =
	"relative inline-flex size-5.5 shrink-0 items-center justify-center rounded-md bg-linear-to-b from-neutral-700 to-neutral-800 font-sans text-xs leading-none font-semibold text-ink transition-all duration-150 ease-out";

export function KeyCap({
	children,
	pressed = false,
}: {
	children: ReactNode;
	pressed?: boolean;
}) {
	return (
		<span
			className={`${BASE} key-tap ${pressed ? "translate-y-px shadow-key-pressed" : "shadow-key"}`}
		>
			{children}
		</span>
	);
}
