import type { CSSProperties, ReactNode } from "react";

/**
 * The small tile every company logo sits in, so a square YC mark and a
 * rounded Twenty mark read as the same kind of thing. Just a faint fill and
 * a soft light on the top-left edge, kept almost invisible on purpose.
 */
export function LogoMark({ children }: { children: ReactNode }) {
	return (
		<span
			className="lit-edge is-lit relative inline-flex size-[18px] shrink-0 items-center justify-center rounded-[5px] bg-surface align-middle"
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
