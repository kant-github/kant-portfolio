import { Contact } from "@/components/contact";
import { Dock } from "@/components/dock";
import { Experience } from "@/components/experience";
import { Footer } from "@/components/footer";
import { Header } from "@/components/header";
import { Intro } from "@/components/intro";
import { Personal } from "@/components/personal";
import { ScrollStage } from "@/components/scroll-stage";
import { Stack } from "@/components/stack";
import { Testimonials } from "@/components/testimonials";
import { Work } from "@/components/work";
import { Writing } from "@/components/writing";

export default function Home() {
	return (
		<div className="flex min-h-screen w-full justify-center overflow-x-hidden">
			<main
				id="top"
				className="flex w-full max-w-160 flex-col gap-10 px-4 pt-10 pb-32"
			>
				<div className="stage overture flex flex-col gap-10">
					<Header />
					<Intro />
				</div>
				<ScrollStage id="work" holdMs={1500}>
					<Work />
				</ScrollStage>
				<ScrollStage id="experience" holdMs={1500}>
					<Experience />
				</ScrollStage>
				<ScrollStage id="testimonials">
					<Testimonials />
				</ScrollStage>
				<ScrollStage id="stack">
					<Stack />
				</ScrollStage>
				<ScrollStage id="writing">
					<Writing />
				</ScrollStage>
				<ScrollStage id="personal">
					<Personal />
				</ScrollStage>
				<ScrollStage id="contact" latchAtBottom>
					<Contact />
				</ScrollStage>

				<ScrollStage latchAtBottom>
					<Footer />
				</ScrollStage>
			</main>

			<Dock />
		</div>
	);
}
