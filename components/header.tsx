import Image from "next/image";
import type { CSSProperties } from "react";
import { profile } from "@/lib/data";

export function Header() {
	return (
		<header className="flex flex-col pt-20">
			<div
				className="stage-item lit-edge relative size-14 rounded-shot"
				style={
					{
						"--i": 1.2,
						"--lit-intensity": 0.4,
					} as CSSProperties
				}
			>
				<div className="size-full overflow-hidden rounded-shot">
					<Image
						src={profile.avatar}
						alt={profile.name}
						width={56}
						height={56}
						priority
						className="size-full object-cover"
					/>
				</div>
				<span
					role="img"
					aria-label="Online"
					title="Online"
					className="dot-pop absolute -right-0.25 -bottom-0.25 size-4 rounded-full border-2 border-black bg-green-400 shadow-dot"
				/>
			</div>

			<p
				className="stage-item stage-blur mt-4 text-[15px] font-medium text-ink"
				style={{ "--i": 2 } as CSSProperties}
			>
				{profile.name}
			</p>
			<p
				className="stage-item stage-blur text-mute"
				style={{ "--i": 2.3 } as CSSProperties}
			>
				{profile.role}
			</p>
		</header>
	);
}
