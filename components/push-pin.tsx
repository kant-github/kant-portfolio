"use client";

import { useId } from "react";

/* A push pin drawn from scratch: blue plastic head, short neck, wide base
 * disc, steel needle, and a soft shadow on the page. The pin leans 12deg to
 * the left so the needle enters the page at an angle. `active` presses it in
 * (see .push-pin in globals.css). */
export function PushPin({ active = false }: { active?: boolean }) {
	const id = useId().replace(/[^a-zA-Z0-9]/g, "");
	const head = `${id}-head`;
	const neck = `${id}-neck`;
	const base = `${id}-base`;
	const steel = `${id}-steel`;
	const blur = `${id}-blur`;

	return (
		<svg
			viewBox="0 0 24 27"
			width={22}
			height={25}
			aria-hidden="true"
			overflow="visible"
			className={`push-pin block shrink-0 ${active ? "is-pressed" : ""}`}
		>
			<defs>
				<linearGradient id={head} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#1e40af" />
					<stop offset="0.2" stopColor="#3b82f6" />
					<stop offset="0.32" stopColor="#7cb0ff" />
					<stop offset="0.5" stopColor="#3b82f6" />
					<stop offset="0.82" stopColor="#2563eb" />
					<stop offset="1" stopColor="#1e3a8a" />
				</linearGradient>

				<linearGradient id={neck} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#1e3a8a" />
					<stop offset="0.35" stopColor="#2563eb" />
					<stop offset="0.55" stopColor="#3b82f6" />
					<stop offset="1" stopColor="#1e3a8a" />
				</linearGradient>

				<linearGradient id={base} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="#1e40af" />
					<stop offset="0.28" stopColor="#3b82f6" />
					<stop offset="0.42" stopColor="#6ea8ff" />
					<stop offset="0.7" stopColor="#2563eb" />
					<stop offset="1" stopColor="#1e3a8a" />
				</linearGradient>

				<linearGradient id={steel} x1="0" y1="0" x2="1" y2="0">
					<stop offset="0" stopColor="var(--pin-steel-lo)" />
					<stop offset="0.4" stopColor="var(--pin-steel-hi)" />
					<stop offset="1" stopColor="var(--pin-steel-lo)" />
				</linearGradient>

				<filter id={blur} x="-50%" y="-100%" width="200%" height="300%">
					<feGaussianBlur stdDeviation="1" />
				</filter>
			</defs>

			{/* Shadow lies flat on the page, so it stays outside the tilt. */}
			<ellipse
				className="push-pin-shadow"
				cx="13"
				cy="17.6"
				rx="5"
				ry="1.5"
				fill="#000"
				opacity="0.32"
				filter={`url(#${blur})`}
			/>

			<g transform="rotate(-12 13.5 25.6)">
				{/* Needle */}
				<path
					d="M12.6 17.2 H14.4 L13.5 25.6 Z"
					fill={`url(#${steel})`}
					stroke="var(--pin-steel-lo)"
					strokeWidth="0.3"
					strokeLinejoin="round"
				/>

				{/* Base disc */}
				<rect
					x="8.5"
					y="14.6"
					width="10"
					height="3"
					rx="1.5"
					fill={`url(#${base})`}
				/>
				<rect
					x="9"
					y="16.5"
					width="9"
					height="1.1"
					rx="0.55"
					fill="#172554"
					opacity="0.55"
				/>

				{/* Neck */}
				<rect
					x="11.5"
					y="10.2"
					width="4"
					height="5"
					rx="0.6"
					fill={`url(#${neck})`}
				/>

				{/* Head */}
				<rect
					x="7.5"
					y="3.1"
					width="12"
					height="8"
					rx="1.8"
					fill={`url(#${head})`}
				/>
				<ellipse
					cx="13.5"
					cy="3.1"
					rx="6"
					ry="1.6"
					fill="#9cc2ff"
					stroke="#2f6fe0"
					strokeWidth="0.5"
				/>
				<line
					x1="10"
					y1="5.4"
					x2="10"
					y2="9.6"
					stroke="#fff"
					strokeOpacity="0.45"
					strokeWidth="1"
					strokeLinecap="round"
				/>
			</g>
		</svg>
	);
}
