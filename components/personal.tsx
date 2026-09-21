import type { CSSProperties } from "react";
import Image from "next/image";
import { CONTENT_INDEX, Section } from "@/components/section";
import { personal } from "@/lib/data";

const CAPTION_CLASS = "font-mono text-xs tracking-label text-mute uppercase";

// Each photo leans a little, the way a pile of prints would sit.
const TILT = ["-5deg", "3deg", "-2deg", "4deg", "-3deg"];

const CARD_CLASS =
	"relative shrink-0 rounded-lg bg-white p-1 shadow-card rotate-(--tilt) transition duration-300 hover:z-10 hover:-translate-y-2 hover:rotate-0";

// The cards sit in one row, each overlapping the last by a quarter of its own
// width. Solving n*w - (n-1)*(w/4) = 100 keeps the row exactly full whatever
// the photo count is: 40% each for three photos, 30.8% for four, and so on.
function rowSizing(count: number) {
	const width = 400 / (3 * count + 1);
	return { width: `${width}%`, overlap: `${width / 4}%` };
}

export function Personal() {
	const { width, overlap } = rowSizing(personal.photos.items.length);

	return (
		<Section label="Personal" intro={personal.blurb}>
			<div className="flex flex-col gap-6">
				<div className="flex flex-col gap-4">
					<div
						className="stage-item stage-soft flex justify-center px-2"
						style={{ "--i": CONTENT_INDEX } as CSSProperties}
					>
						{personal.photos.items.map((photo, index) => (
							<figure
								key={photo.src}
								style={
									{
										"--tilt": TILT[index % TILT.length],
										width,
										marginLeft:
											index === 0 ? 0 : `-${overlap}`,
									} as CSSProperties
								}
								className={CARD_CLASS}
							>
								<Image
									src={photo.src}
									alt={photo.alt}
									width={800}
									height={600}
									sizes="(min-width: 640px) 256px, 40vw"
									className="aspect-4/3 w-full rounded-sm object-cover"
								/>
							</figure>
						))}
					</div>

					<div
						className="stage-item flex items-center justify-between gap-4"
						style={{ "--i": CONTENT_INDEX + 1 } as CSSProperties}
					>
						<p className={CAPTION_CLASS}>
							{personal.photos.caption}
						</p>
						<a
							href={personal.photos.href}
							target="_blank"
							rel="noreferrer"
							className={`${CAPTION_CLASS} transition-opacity hover:opacity-70`}
						>
							{personal.photos.linkLabel}
						</a>
					</div>
				</div>
			</div>
		</Section>
	);
}
