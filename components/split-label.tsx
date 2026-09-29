import type { CSSProperties } from "react";

export function SplitLabel({
	text,
	className,
	index = 0,
}: {
	text: string;
	className?: string;

	index?: number;
}) {
	const chars = [...text];

	return (
		<p
			aria-label={text}
			className={`stage-item stage-label ${className ?? ""}`}
			style={{ "--i": index, "--cn": chars.length } as CSSProperties}
		>
			{chars.map((char, at) => (
				<span
					key={`${char}-${at}`}
					aria-hidden="true"
					className="stage-char"
					style={{ "--ci": at } as CSSProperties}
				>
					{char === " " ? " " : char}
				</span>
			))}
		</p>
	);
}
