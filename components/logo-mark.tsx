import type { CSSProperties, ReactNode } from "react";

export function LogoMark({ children }: { children: ReactNode }) {
	return (
		<span
			className="lit-edge is-lit relative inline-flex size-4 shrink-0 items-center justify-center rounded-[4px] bg-surface align-middle"
			style={
				{
					"--lit-rim": 0.14,
					"--lit-intensity": 0.08,
					"--lit-spread-end": "70%",
				} as CSSProperties
			}
		>
			{children}
		</span>
	);
}
