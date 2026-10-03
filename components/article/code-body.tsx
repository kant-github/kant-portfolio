"use client";

import { useEffect, useRef } from "react";

/** The highlighted code, with a soft fade on the right while it can scroll. */
export function CodeBody({ html }: { html: string }) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const body = ref.current;
		const pre = body?.querySelector("pre");
		if (!body || !pre) return;

		const update = () => {
			const more = pre.scrollWidth - pre.clientWidth - pre.scrollLeft > 2;
			body.classList.toggle("has-more", more);
		};

		update();
		pre.addEventListener("scroll", update, { passive: true });
		const observer = new ResizeObserver(update);
		observer.observe(pre);

		return () => {
			pre.removeEventListener("scroll", update);
			observer.disconnect();
		};
	}, [html]);

	return (
		<div
			ref={ref}
			className="code-body"
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
}
