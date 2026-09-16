import { YcBadge } from "@/components/yc-badge";
import type { Entry } from "@/lib/data";

const META_CLASS =
	"font-mono text-[13px] leading-4 tracking-[0.04em] text-mute md:w-44 md:shrink-0 md:pt-1";

export function EntryRow({ entry }: { entry: Entry }) {
	return (
		<div className="flex flex-col gap-y-1 md:flex-row md:gap-y-0">
			<div className={META_CLASS}>
				{entry.metaHref ? (
					<a
						href={entry.metaHref}
						target="_blank"
						rel="noreferrer"
						className="transition-opacity hover:opacity-70"
					>
						{entry.meta}
					</a>
				) : (
					entry.meta
				)}
			</div>

			<div className="max-w-[42rem]">
				{entry.title ? (
					<h3 className="text-ink">
						{entry.lead ? `${entry.lead} ` : null}
						{entry.href ? (
							<a
								href={entry.href}
								target="_blank"
								rel="noreferrer"
								className="inline-flex items-center gap-1.5 transition-opacity hover:opacity-70"
							>
								{entry.badge === "yc" ? <YcBadge /> : null}
								{entry.title}
							</a>
						) : (
							entry.title
						)}
					</h3>
				) : null}

				<p className={entry.title ? "mt-1 text-mute" : "text-mute"}>
					{entry.description}
				</p>
			</div>
		</div>
	);
}
