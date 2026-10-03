import { CaseStudies } from "@/components/case-studies";
import { Dock } from "@/components/dock";
import { Experience } from "@/components/experience";
import { Personal } from "@/components/personal";
import { Reach } from "@/components/reach";
import { ScrollStage } from "@/components/scroll-stage";
import { SocialRail } from "@/components/social-rail";
import { Work } from "@/components/work";

export default function Home() {
	return (
		<div className="flex min-h-screen w-full justify-center overflow-x-hidden">
			<main
				id="top"
				className="flex w-full max-w-160 flex-col gap-14 px-4 pt-34 pb-32"
			>
				<div id="work" className="stage overture scroll-mt-10">
					<Work />
				</div>
				<ScrollStage id="experience" holdMs={1500}>
					<Experience />
				</ScrollStage>
				<ScrollStage id="case-studies">
					<CaseStudies />
				</ScrollStage>

				<ScrollStage id="personal" latchAtBottom>
					<Personal />
				</ScrollStage>

				<div className="lg:hidden">
					<ScrollStage id="reach" latchAtBottom>
						<Reach />
					</ScrollStage>
				</div>
			</main>

			<Dock />
			<SocialRail />
		</div>
	);
}
