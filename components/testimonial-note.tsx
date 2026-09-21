import type { CSSProperties } from "react";
import type { Testimonial } from "@/lib/testimonials";

const NOTE =
	"lit-edge relative flex h-full flex-col gap-3 rounded-md bg-linear-to-b from-card-top to-card-bottom p-5 shadow-note";

function initials(name: string) {
	return name
		.split(" ")
		.slice(0, 2)
		.map((part) => part.charAt(0))
		.join("")
		.toUpperCase();
}

export function TestimonialNote({
	item,
	number,
	pinned = false,
	lit = false,
	litDelayMs = 0,
}: {
	item: Testimonial;
	number: string;
	pinned?: boolean;
	lit?: boolean;
	litDelayMs?: number;
}) {
	const style = {
		"--lit-rim": 0.12,
		"--lit-intensity": 0.35,
		"--lit-delay": `${litDelayMs}ms`,
	} as CSSProperties;

	return (
		<div className="relative">
			{pinned ? (
				<span
					aria-hidden
					className="absolute -top-1.5 left-1/2 z-20 size-3 -translate-x-1/2 rounded-full bg-amber-500 ring-2"
					style={
						{
							"--tw-ring-color": "var(--pin-ring)",
						} as CSSProperties
					}
				/>
			) : null}

			<figure className={`${NOTE} ${lit ? "is-lit" : ""}`} style={style}>
				<div className="flex items-center gap-3">
					<span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-card-inset font-mono text-xs tracking-label text-mute">
						{initials(item.name)}
					</span>

					<figcaption className="min-w-0">
						<p className="text-sm leading-tight font-semibold text-ink">
							{item.name}
						</p>
						<p className="text-xs leading-tight font-light text-mute">
							{item.role}
						</p>
					</figcaption>

					<span className="ml-auto font-mono text-xs leading-none tracking-label text-mute">
						{number}
					</span>
				</div>

				<blockquote className="text-xs leading-relaxed font-light tracking-tight text-mute">
					{item.quote}
				</blockquote>
			</figure>
		</div>
	);
}
