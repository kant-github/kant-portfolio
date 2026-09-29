import type { CSSProperties } from "react";
import Image from "next/image";
import { CONTENT_INDEX, Section } from "@/components/section";
import { personal, profile } from "@/lib/data";

const TILT = ["-5deg", "3deg", "-2deg", "4deg", "-3deg"];

const CARD_CLASS =
	"relative shrink-0 rounded-lg bg-white p-1 shadow-card ring-1 ring-black/5 rotate-(--tilt) dark:ring-0 transition duration-300 hover:z-10 hover:-translate-y-2 hover:rotate-0";

function rowSizing(count: number) {
	const width = 400 / (3 * count + 1);
	return { width: `${width}%`, overlap: `${width / 4}%` };
}

export function Personal() {
	const { width, overlap } = rowSizing(personal.photos.items.length);

	return (
		<Section
			label="Personal"
			intro={
				// The name carries the site's usual emphasis and the rest sits
				// back in the muted tone the paragraph already has, so the eye
				// lands on who this is before reading the sentence.
				<>
					I am{" "}
					<span className="font-medium text-ink">{profile.name}</span>
					, an engineer at {profile.company} in {profile.location},
					currently exploring infrastructure, the Ethereum chain,
					lending protocols, cryptography, and how MPC works under the
					hood.
					{/* the personal half starts its own line: what I do, then
					    what I do when I am not doing it */}
					<br />
					<br />
					{personal.blurb}
				</>
			}
		>
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
				</div>
			</div>
		</Section>
	);
}
