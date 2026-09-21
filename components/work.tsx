import { Section } from "@/components/section";
import { Showcase } from "@/components/showcase";

export function Work() {
	return (
		<Section
			label="Work"
			intro="A few things I have built recently. Happy to walk through any of them."
		>
			<Showcase />
		</Section>
	);
}
