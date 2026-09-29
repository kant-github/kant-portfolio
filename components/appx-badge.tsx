import Image from "next/image";
import { LogoMark } from "@/components/logo-mark";

/** AppX's own mark, the tilted phone with an X, cut from their site's logo. */
export function AppxBadge() {
	return (
		<LogoMark>
			<Image
				src="/images/logos/appx.png"
				alt="AppX"
				width={13}
				height={13}
				unoptimized
				className="size-[13px] shrink-0"
			/>
		</LogoMark>
	);
}
