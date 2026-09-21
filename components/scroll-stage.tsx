"use client";

import {
	motion,
	useMotionValue,
	useMotionValueEvent,
	useReducedMotion,
	useScroll,
	useSpring,
} from "framer-motion";
import {
	useEffect,
	useLayoutEffect,
	useRef,
	type CSSProperties,
	type ReactNode,
} from "react";
import { STAGE_OFFSET, STAGE_SPRING } from "@/lib/motion";

type ScrollStageProps = {
	children: ReactNode;
	className?: string;
	/** Anchor target for the dock's section links. */
	id?: string;
	/**
	 * Hold progress at 0 for this long after mount. Sections already on screen
	 * at load would otherwise arrive half-revealed next to the overture.
	 * Released early on the first user scroll.
	 */
	holdMs?: number;
	/**
	 * Finish the reveal once the document runs out of scroll. The last section
	 * and the footer can never bring their top edge far enough up the viewport
	 * to reach the end of the range on their own.
	 */
	latchAtBottom?: boolean;
};

export function ScrollStage({
	children,
	className,
	id,
	holdMs = 0,
	latchAtBottom = false,
}: ScrollStageProps) {
	const ref = useRef<HTMLDivElement>(null);
	const prefersReducedMotion = useReducedMotion();

	const { scrollYProgress } = useScroll({
		target: ref,
		offset: [...STAGE_OFFSET],
	});

	// Progress only ever moves forward, so scrolling back up never un-reveals
	// a section and nothing is ever caught half-blurred.
	const latched = useMotionValue(0);
	const smooth = useSpring(latched, STAGE_SPRING);

	const holding = useRef(holdMs > 0);

	useMotionValueEvent(scrollYProgress, "change", (value) => {
		if (holding.current) return;
		if (value > latched.get()) latched.set(value);
	});

	// A reload part-way down the page, or a back-navigation, restores the
	// scroll position before we mount. Jump straight to the right value rather
	// than animating up to it, which would flash.
	useLayoutEffect(() => {
		if (holding.current) return;

		const value = scrollYProgress.get();
		latched.set(value);
		smooth.jump(value);

		// Tells the failsafe in <head> that hydration landed.
		document.documentElement.dataset.stageReady = "1";
	}, [latched, smooth, scrollYProgress]);

	useEffect(() => {
		if (!holdMs) return;

		const release = () => {
			if (!holding.current) return;
			holding.current = false;

			const value = scrollYProgress.get();
			if (value <= latched.get()) return;

			latched.set(value);

			// Already scrolled well past it: springing up now would just be a
			// late animation on content the reader has already arrived at.
			if (window.scrollY > window.innerHeight) smooth.jump(value);
		};

		// Someone who scrolled before hydration has opted out of the opening,
		// so do not hold their content back behind it.
		if (window.scrollY > 0) {
			release();
			return;
		}

		const timer = window.setTimeout(release, holdMs);
		window.addEventListener("scroll", release, {
			once: true,
			passive: true,
		});

		return () => {
			window.clearTimeout(timer);
			window.removeEventListener("scroll", release);
		};
	}, [holdMs, latched, smooth, scrollYProgress]);

	// will-change goes on only while the section is genuinely moving, and is
	// keyed off the smoothed value so it survives the spring's settle.
	const live = useRef(false);

	useMotionValueEvent(smooth, "change", (value) => {
		const next = value > 0.0005 && value < 0.9995;
		if (next === live.current) return;

		live.current = next;
		ref.current?.classList.toggle("is-live", next);
	});

	useEffect(() => {
		if (!latchAtBottom) return;

		const element = ref.current;
		if (!element) return;

		const check = () => {
			const scrolled = window.innerHeight + window.scrollY;
			const atBottom =
				scrolled >= document.documentElement.scrollHeight - 2;

			element.classList.toggle("is-settled", atBottom);
		};

		check();
		window.addEventListener("scroll", check, { passive: true });
		window.addEventListener("resize", check);

		return () => {
			window.removeEventListener("scroll", check);
			window.removeEventListener("resize", check);
		};
	}, [latchAtBottom]);

	if (prefersReducedMotion) {
		return (
			<div id={id} className={`stage ${className ?? ""}`}>
				{children}
			</div>
		);
	}

	return (
		<motion.div
			id={id}
			ref={ref}
			className={`stage scroll-mt-10 ${className ?? ""}`}
			style={{ "--p": smooth } as CSSProperties}
		>
			{children}
		</motion.div>
	);
}
