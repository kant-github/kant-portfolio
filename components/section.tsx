import type { CSSProperties, ReactNode } from "react";
import { SplitLabel } from "@/components/split-label";

export const LABEL_CLASS =
	"font-mono text-xs tracking-label text-mute uppercase";

/** Section parts take the first indices; content rows continue from here. */
export const CONTENT_INDEX = 2;

export function Section({
	label,
	intro,
	children,
}: {
	label: string;
	intro?: string;
	children: ReactNode;
}) {
	return (
		<section className="flex flex-col gap-6">
			<SplitLabel text={label} className={LABEL_CLASS} />

			{intro ? (
				<p
					className="stage-item stage-blur text-mute"
					style={{ "--i": 1 } as CSSProperties}
				>
					{intro}
				</p>
			) : null}

			{children}
		</section>
	);
}
