import type { ReactNode } from "react";

const DOTS =
	"radial-gradient(circle, rgb(255 255 255 / 0.1) 1px, transparent 1px)";

export function Band({
	children,
	className = "",
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div
			className={`relative left-1/2 w-screen -translate-x-1/2 overflow-hidden border-y border-line py-12 sm:py-20 ${className}`}
			style={{ backgroundImage: DOTS, backgroundSize: "8px 8px" }}
		>
			{children}
		</div>
	);
}
