import type { CSSProperties } from "react";

/**
 * A mono label that sets itself one character at a time with a caret running
 * ahead of the text. Pure render, so this stays a Server Component — the
 * animation is entirely CSS driven off the stage progress it inherits.
 */
export function SplitLabel({
	text,
	className,
}: {
	text: string;
	className?: string;
}) {
	const chars = [...text];

	return (
		<p
			aria-label={text}
			className={`stage-item stage-label ${className ?? ""}`}
			style={{ "--i": 0, "--cn": chars.length } as CSSProperties}
		>
			{chars.map((char, index) => (
				<span
					key={`${char}-${index}`}
					aria-hidden="true"
					className="stage-char"
					style={{ "--ci": index } as CSSProperties}
				>
					{char === " " ? " " : char}
				</span>
			))}
		</p>
	);
}
