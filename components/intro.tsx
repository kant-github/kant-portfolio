import type { CSSProperties } from "react";
import { CopyEmail } from "@/components/copy-email";
import { YcBadge } from "@/components/yc-badge";
import { profile } from "@/lib/data";

export function Intro() {
	return (
		<section className="flex flex-col gap-6">
			<p
				className="stage-item stage-blur text-mute"
				style={{ "--i": 3 } as CSSProperties}
			>
				Hey, I&apos;m Rishi, a full stack developer at{" "}
				<a
					href={profile.companyHref}
					target="_blank"
					rel="noreferrer"
					className="inline-flex items-center gap-1.5 text-ink transition-opacity hover:opacity-70"
				>
					<YcBadge />
					{profile.company}
				</a>{" "}
				based in {profile.location}, where I build backend systems that
				hold up at scale and the product interfaces that sit on top of
				them.
			</p>

			<div className="stage-item" style={{ "--i": 3.6 } as CSSProperties}>
				<CopyEmail />
			</div>
		</section>
	);
}
