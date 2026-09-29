/**
 * Soft edges at the top and bottom of the screen, so content blurs and fades
 * out as it scrolls past instead of being cut off by a hard line.
 *
 * Each edge stacks four blur layers. Every layer is stronger than the last but
 * reaches less far in, so the blur builds up towards the edge. A last layer
 * fades to the page colour on top.
 */
const LAYERS = [
	{ blur: "backdrop-blur-[4px]", reach: "70%" },
	{ blur: "backdrop-blur-[12px]", reach: "45%" },
	{ blur: "backdrop-blur-[28px]", reach: "26%" },
	{ blur: "backdrop-blur-[48px]", reach: "13%" },
];

function Edge({ side }: { side: "top" | "bottom" }) {
	const towards = side === "top" ? "to bottom" : "to top";

	return (
		<div
			aria-hidden="true"
			className={`pointer-events-none fixed inset-x-0 z-30 h-20 ${
				side === "top" ? "top-0" : "bottom-0"
			}`}
		>
			{LAYERS.map((layer) => (
				<div
					key={layer.reach}
					className={`absolute inset-0 ${layer.blur}`}
					style={{
						maskImage: `linear-gradient(${towards}, black, transparent ${layer.reach})`,
					}}
				/>
			))}
			<div
				className="absolute inset-0"
				style={{
					background: `linear-gradient(${towards}, var(--page), transparent)`,
				}}
			/>
		</div>
	);
}

export function EdgeBlur() {
	return (
		<>
			<Edge side="top" />
			<Edge side="bottom" />
		</>
	);
}
