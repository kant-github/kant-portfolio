import { Section } from "@/components/section";
import { SocialDeck } from "@/components/social-deck";

/**
 * The last section on phones and tablets: the four social cards in a row.
 * Wider screens have the rail on the left instead (components/social-rail.tsx).
 */
export function Reach() {
	return (
		<Section label="Reach me" intro="Say hello on any of these.">
			<SocialDeck />
		</Section>
	);
}
