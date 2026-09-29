import { useId } from "react";

// eight short rays around the centre, every 45deg, from r=8.5 out to r=10.5
const RAYS = Array.from({ length: 8 }, (_, index) => {
	const angle = (index * Math.PI) / 4;
	const point = (radius: number) =>
		[12 + radius * Math.cos(angle), 12 + radius * Math.sin(angle)].map(
			(value) => Number(value.toFixed(2)),
		);
	const [x1, y1] = point(8.5);
	const [x2, y2] = point(10.5);
	return { x1, y1, x2, y2 };
});

/**
 * One drawing that is a sun in light mode and a moon in dark mode, so the
 * switch morphs rather than swaps. Three moving parts, all driven by the
 * `.dark` class on <html> (see `.theme-icon` in globals.css):
 *
 * - the body: one circle, small as the sun's disc, grown into the moon
 * - the bite: a circle in the mask that slides in from the top-right corner
 *   and cuts the crescent out of the body
 * - the rays: spin a quarter turn and shrink into the centre as night falls
 */
export function ThemeIcon({ className = "" }: { className?: string }) {
	const mask = `theme-bite-${useId().replace(/:/g, "")}`;

	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			aria-hidden="true"
			className={`theme-icon ${className}`}
		>
			<mask id={mask}>
				<rect width="24" height="24" fill="#fff" />
				<circle
					className="theme-icon-bite"
					cx="17.5"
					cy="6.5"
					r="7"
					fill="#000"
				/>
			</mask>

			<circle
				className="theme-icon-body"
				cx="12"
				cy="12"
				r="9"
				fill="currentColor"
				mask={`url(#${mask})`}
			/>

			<g
				className="theme-icon-rays"
				stroke="currentColor"
				strokeWidth="2"
				strokeLinecap="round"
			>
				{RAYS.map((ray) => (
					<line key={`${ray.x1}-${ray.y1}`} {...ray} />
				))}
			</g>
		</svg>
	);
}
