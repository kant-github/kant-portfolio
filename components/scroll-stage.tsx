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
	id?: string;
	holdMs?: number;
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

	const latched = useMotionValue(0);
	const smooth = useSpring(latched, STAGE_SPRING);

	const holding = useRef(holdMs > 0);

	useMotionValueEvent(scrollYProgress, "change", (value) => {
		if (holding.current) return;
		if (value > latched.get()) latched.set(value);
	});

	useLayoutEffect(() => {
		if (holding.current) return;

		const value = scrollYProgress.get();
		latched.set(value);
		smooth.jump(value);

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

			if (window.scrollY > window.innerHeight) smooth.jump(value);
		};

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
