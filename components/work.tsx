import type { CSSProperties } from "react";
import { LABEL_CLASS } from "@/components/section";
import { Showcase } from "@/components/showcase";
import { SplitLabel } from "@/components/split-label";

/**
 * The one section that leads with its content: the deck opens the page, and
 * the heading reads as a caption underneath it rather than a title above it.
 *
 * That flip is why this does not use `Section` — the stage indices have to run
 * deck, label, intro rather than the other way round.
 */
export function Work() {
	return (
		<section className="flex flex-col gap-6">
			<Showcase stageIndex={0} />

			<div className="flex flex-col gap-1.5">
				<SplitLabel text="Work" index={1} className={LABEL_CLASS} />

				<p
					className="stage-item stage-blur text-mute"
					style={{ "--i": 2 } as CSSProperties}
				>
					A few things I have built recently. Happy to walk through
					any of them.
				</p>
			</div>
		</section>
	);
}
