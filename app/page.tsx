import { Dock } from "@/components/dock";
import { Hero } from "@/components/hero";
import { Section } from "@/components/section";
import { sections } from "@/lib/data";

export default function Home() {
	return (
		<div className="flex min-h-screen w-full justify-center bg-page">
			<main className="w-full max-w-[700px] px-6 pt-32 pb-24 md:px-8">
				<Hero />

				{sections.map((section) => (
					<Section key={section.id} section={section} />
				))}
			</main>

			<Dock />
		</div>
	);
}
