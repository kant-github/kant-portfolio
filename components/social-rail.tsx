"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { BrandMark } from "@/components/brand-marks";
import {
	ICON_CLASS,
	PILL_CLASS,
	TIP_RIGHT_CLASS,
} from "@/components/dock-classes";
import { SocialCard } from "@/components/social-card";
import { socialAccounts, type SocialId } from "@/lib/data";

/** How long the card stays after the pointer leaves the rail and the card. */
const LINGER = 160;

/**
 * A short vertical bar of social icons on the left edge of the screen.
 * Resting on an icon slides a card out to its right (social-card.tsx);
 * moving to another icon swaps the card in place. Clicking an icon opens
 * the profile itself. Phones and tablets keep the footer icons instead:
 * the rail only shows once there is empty space beside the centred column.
 */
export function SocialRail() {
	const [activeId, setActiveId] = useState<SocialId | null>(null);
	const timer = useRef<number>(undefined);

	const active =
		socialAccounts.find((account) => account.id === activeId) ?? null;

	const show = useCallback((id: SocialId) => {
		window.clearTimeout(timer.current);
		setActiveId(id);
	}, []);

	const hide = useCallback(() => {
		window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => setActiveId(null), LINGER);
	}, []);

	const hold = useCallback(() => window.clearTimeout(timer.current), []);

	useEffect(() => () => window.clearTimeout(timer.current), []);

	useEffect(() => {
		if (!activeId) return;

		function handleKeyDown(event: KeyboardEvent) {
			if (event.key === "Escape") setActiveId(null);
		}

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [activeId]);

	return (
		<div
			className="pointer-events-none fixed top-1/2 left-4 z-40 hidden -translate-y-1/2 lg:block"
			onPointerLeave={hide}
			onBlur={(event) => {
				if (!event.currentTarget.contains(event.relatedTarget)) hide();
			}}
		>
			<nav
				aria-label="Social profiles"
				className={`rail-in flex flex-col gap-1 p-1 ${PILL_CLASS}`}
				onPointerEnter={hold}
			>
				{socialAccounts.map((account) => {
					const external = !account.href.startsWith("mailto:");

					return (
						<a
							key={account.id}
							href={account.href}
							target={external ? "_blank" : undefined}
							rel={external ? "noreferrer" : undefined}
							aria-label={`${account.name}, ${account.handle}`}
							aria-describedby={
								activeId === account.id
									? "social-card"
									: undefined
							}
							onPointerEnter={() => show(account.id)}
							onFocus={() => show(account.id)}
							className={`${ICON_CLASS} block`}
						>
							<BrandMark id={account.id} className="size-4" />
							<span className={TIP_RIGHT_CLASS}>
								{account.name}
							</span>
						</a>
					);
				})}
			</nav>

			{/* The padding bridges the gap to the rail, so the pointer can
			    cross over without the card closing. */}
			<div
				className="pointer-events-auto absolute top-1/2 left-full -translate-y-1/2 pl-3"
				onPointerEnter={hold}
			>
				<AnimatePresence>
					{active ? <SocialCard account={active} /> : null}
				</AnimatePresence>
			</div>
		</div>
	);
}
