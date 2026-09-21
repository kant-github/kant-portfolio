import Link from "next/link";
import { LABEL_CLASS } from "@/components/section";

export default function NotFound() {
	return (
		<div className="flex min-h-screen w-full items-center justify-center px-4">
			<main className="flex max-w-160 flex-col items-start gap-4">
				<p className={LABEL_CLASS}>404</p>
				<h1 className="text-[clamp(1.75rem,5vw,2.25rem)] leading-tight font-semibold text-ink">
					This page does not exist.
				</h1>
				<p className="text-mute">
					The link may be old, or I may have moved something.
				</p>
				<Link
					href="/"
					className={`${LABEL_CLASS} mt-2 transition-opacity hover:opacity-70`}
				>
					← Back home
				</Link>
			</main>
		</div>
	);
}
