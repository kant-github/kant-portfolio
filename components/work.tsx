import type { CSSProperties } from "react";
import { Band } from "@/components/band";
import { LABEL_CLASS } from "@/components/section";
import { Showcase } from "@/components/showcase";
import { SplitLabel } from "@/components/split-label";

/**
 * The only section whose heading lives inside its own band, so the label, the
 * intro and the cards all sit on the dotted ground together. That is why this
 * does not use <Section> — Section keeps its heading in the reading column,
 * and here the heading has to be inside the full-bleed band with the cards.
 */
export function Work() {
	return (
		<section>
			<Band>
				<div className="mx-auto flex w-full max-w-160 flex-col gap-1.5 px-4">
					<SplitLabel text="Work" className={LABEL_CLASS} />
					<p
						className="stage-item stage-blur text-mute"
						style={{ "--i": 1 } as CSSProperties}
					>
						A few things I have built recently. Happy to walk
						through any of them.
					</p>
				</div>

				<div className="mt-8">
					<Showcase />
				</div>
			</Band>
		</section>
	);
}
