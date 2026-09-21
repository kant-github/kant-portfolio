import Image from "next/image";
import type { CSSProperties } from "react";
import { CONTENT_INDEX, Section } from "@/components/section";
import { stack } from "@/lib/data";

export function Stack() {
	return (
		<Section label="Stack" intro="The tools I reach for on most days.">
			<ul className="stage-dense flex flex-wrap gap-1">
				{stack.map((item, index) => (
					<li
						key={item.name}
						className="stage-item"
						style={
							{ "--i": CONTENT_INDEX + index } as CSSProperties
						}
					>
						<a
							href={item.href}
							target="_blank"
							rel="noreferrer"
							title={`${item.name} — ${item.note}`}
							className="flex size-18 items-center justify-center transition duration-200"
						>
							<Image
								src={item.logo}
								alt={item.name}
								width={36}
								height={36}
								className="size-9 object-contain"
							/>
						</a>
					</li>
				))}
			</ul>
		</Section>
	);
}
