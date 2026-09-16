import Image from "next/image";
import { CopyEmail } from "@/components/copy-email";
import { NameBlock } from "@/components/name-block";
import { Reveal } from "@/components/reveal";
import { YcBadge } from "@/components/yc-badge";
import { profile } from "@/lib/data";

export function Hero() {
	return (
		<header className="w-full">
			<Reveal>
				<div className="relative w-fit">
					<div className="relative size-14 overflow-hidden rounded-[14px]">
						<Image
							src="/images/Rishi.JPG"
							alt={profile.name}
							width={56}
							height={56}
							priority
							className="size-full object-cover"
						/>
					</div>
					<span className="absolute right-0 bottom-0 size-[15px] rounded-full border-2 border-page bg-green-500" />
				</div>

				<NameBlock />

				<p className="text-mute">{profile.role}</p>

				<p className="mt-7 text-mute">
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
					based in {profile.location} {profile.flag} where I build
					backend systems that hold up at scale, and the product
					interfaces that sit on top of them.
				</p>

				<CopyEmail />
			</Reveal>
		</header>
	);
}
