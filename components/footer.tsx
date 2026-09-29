import Image from "next/image";
import type { CSSProperties } from "react";
import { socialLinks } from "@/lib/data";

export function Footer() {
	return (
		<footer className="border-t border-line pt-6">
			<ul
				className="stage-item flex items-center gap-2"
				style={{ "--i": 0 } as CSSProperties}
			>
				{socialLinks.map((link) => (
					<li key={link.name}>
						<a
							href={link.href}
							target={
								link.href.startsWith("mailto:")
									? undefined
									: "_blank"
							}
							rel="noreferrer"
							aria-label={link.name}
							title={link.name}
							className="flex size-9 items-center justify-center rounded-md opacity-80 transition duration-200 hover:-translate-y-0.5 hover:bg-surface hover:opacity-100"
						>
							<Image
								src={link.icon}
								alt=""
								width={18}
								height={18}
								unoptimized
								className="size-[18px]"
							/>
						</a>
					</li>
				))}
			</ul>
		</footer>
	);
}
