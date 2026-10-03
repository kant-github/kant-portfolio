import type { CSSProperties } from "react";
import { PhotoRow } from "@/components/photo-row";
import { CONTENT_INDEX, Section } from "@/components/section";
import { personal, profile } from "@/lib/data";

export function Personal() {
	return (
		<Section
			label="Personal"
			intro={
				<>
					I am{" "}
					<span className="font-medium text-ink">{profile.name}</span>
					, an engineer at {profile.company} in {profile.location},
					currently exploring infrastructure, the Ethereum chain,
					lending protocols, cryptography, and how MPC works under the
					hood.
					<br />
					<br />
					{personal.blurb}
				</>
			}
		>
			<div
				className="stage-item stage-soft"
				style={{ "--i": CONTENT_INDEX } as CSSProperties}
			>
				<PhotoRow photos={personal.photos.items} />
			</div>
		</Section>
	);
}
