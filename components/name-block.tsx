"use client";

import { useState } from "react";
import { NameBadge } from "@/components/name-badge";
import { NameHover } from "@/components/name-hover";
import { profile } from "@/lib/data";

export function NameBlock() {
	const [active, setActive] = useState(false);

	return (
		<h1
			onMouseEnter={() => setActive(true)}
			onMouseLeave={() => setActive(false)}
			onFocus={() => setActive(true)}
			onBlur={() => setActive(false)}
			className="mt-6 flex w-fit items-center gap-1.5 py-1 pr-6 text-[15px] leading-6 font-medium text-ink"
		>
			<NameHover text={profile.name} />
			<NameBadge active={active} />
		</h1>
	);
}
