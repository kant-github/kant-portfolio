"use client";

import {
	useCallback,
	useEffect,
	useRef,
	useState,
	type CSSProperties,
} from "react";
import { CONTENT_INDEX } from "@/components/section";
import { SocialCardShell } from "@/components/social-card";
import { socialAccounts } from "@/lib/data";

/** Cards rise in one after another as the section scrolls into view. */
const STEP = 0.45;

/**
 * The four cards in a row you swipe sideways. Each card snaps into place
 * and the next one peeks in from the right edge. Dots under the row show
 * which card is in view; tapping a dot scrolls to it.
 */
export function SocialDeck() {
	const scroller = useRef<HTMLUListElement>(null);
	const [active, setActive] = useState(0);

	/** Distance from one card's left edge to the next: card width plus gap. */
	const stride = useCallback(() => {
		const list = scroller.current;
		const first = list?.firstElementChild;
		const second = first?.nextElementSibling;
		if (!(first instanceof HTMLElement)) return 0;
		if (!(second instanceof HTMLElement)) return first.offsetWidth;
		return second.offsetLeft - first.offsetLeft;
	}, []);

	useEffect(() => {
		const list = scroller.current;
		if (!list) return;

		const update = () => {
			const step = stride();
			if (step > 0) {
				setActive(
					Math.max(
						0,
						Math.min(
							socialAccounts.length - 1,
							Math.round(list.scrollLeft / step),
						),
					),
				);
			}
		};

		list.addEventListener("scroll", update, { passive: true });
		return () => list.removeEventListener("scroll", update);
	}, [stride]);

	const goTo = useCallback(
		(index: number) => {
			scroller.current?.scrollTo({
				left: index * stride(),
				behavior: "smooth",
			});
		},
		[stride],
	);

	return (
		<div className="social-deck flex flex-col gap-4">
			<ul
				ref={scroller}
				aria-label="Social profiles"
				className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-4 px-4 pt-1 pb-3"
			>
				{socialAccounts.map((account, index) => (
					<li
						key={account.id}
						className="stage-item shrink-0 snap-start"
						style={
							{
								"--i": CONTENT_INDEX + index * STEP,
							} as CSSProperties
						}
					>
						<SocialCardShell
							account={account}
							focusable
							className="w-[min(300px,82vw)]"
						/>
					</li>
				))}
			</ul>

			<div
				className="stage-item flex justify-center gap-2"
				style={{ "--i": CONTENT_INDEX + 1 } as CSSProperties}
			>
				{socialAccounts.map((account, index) => (
					<button
						key={account.id}
						type="button"
						aria-label={`Show ${account.name}`}
						aria-current={index === active ? "true" : undefined}
						onClick={() => goTo(index)}
						className="flex size-5 items-center justify-center"
					>
						<span
							className={`block h-1.5 rounded-full transition-all duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
								index === active
									? "w-4 bg-ink"
									: "w-1.5 bg-line"
							}`}
						/>
					</button>
				))}
			</div>
		</div>
	);
}
