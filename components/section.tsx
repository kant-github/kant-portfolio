import type { CSSProperties, ReactNode } from "react";
import { SplitLabel } from "@/components/split-label";

export const LABEL_CLASS =
	"font-mono text-[11px] tracking-label text-mute uppercase";

export const CONTENT_INDEX = 2;

export function Section({
	label,
	intro,
	children,
}: {
	label: string;
	/** Rich, not just a string: a section may want a word picked out of it. */
	intro?: ReactNode;
	children: ReactNode;
}) {
	return (
		<section className="flex flex-col gap-6">
			<div className="flex flex-col gap-1.5">
				<SplitLabel text={label} className={LABEL_CLASS} />

				{intro ? (
					<p
						className="stage-item stage-blur text-mute"
						style={{ "--i": 1 } as CSSProperties}
					>
						{intro}
					</p>
				) : null}
			</div>

			{children}
		</section>
	);
}
