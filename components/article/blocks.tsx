import type { ReactNode } from "react";
import {
	RiAlertFill,
	RiInformationFill,
	RiLightbulbFlashFill,
} from "react-icons/ri";
import { CodeBlock } from "@/components/article/code-block";
import { Inline } from "@/components/article/inline";
import { Shot } from "@/components/article/shot";
import { Diagram } from "@/components/diagrams";
import { LABEL_CLASS } from "@/components/section";
import type { Block } from "@/lib/case-studies/types";

export function pad(n: number) {
	return String(n).padStart(2, "0");
}

/** One shell for every side box: an icon chip and label up top, body below. */
function Panel({
	icon: Icon,
	label,
	tone = "note",
	children,
}: {
	icon: typeof RiInformationFill;
	label: string;
	tone?: "note" | "warn";
	children: ReactNode;
}) {
	return (
		<aside className={`panel not-prose ${tone === "warn" ? "is-warn" : ""}`}>
			<div className="panel-label">
				<Icon className="panel-icon size-3" aria-hidden="true" />
				<span className="font-mono text-[11px] tracking-label uppercase">
					{label}
				</span>
			</div>
			{children}
		</aside>
	);
}

function Callout({
	tone,
	title,
	text,
}: {
	tone: "note" | "warn";
	title: string;
	text: string;
}) {
	return (
		<Panel
			icon={tone === "warn" ? RiAlertFill : RiInformationFill}
			label={tone === "warn" ? "Careful" : "Note"}
			tone={tone}
		>
			<p className="text-sm leading-[1.4] font-medium text-ink">{title}</p>
			<p className="mt-2 text-sm leading-[1.6] text-mute">
				<Inline text={text} />
			</p>
		</Panel>
	);
}

function Takeaways({ items }: { items: string[] }) {
	return (
		<Panel icon={RiLightbulbFlashFill} label="TL;DR">
			<ul className="flex flex-col gap-2.5">
				{items.map((item) => (
					<li
						key={item}
						className="flex gap-3.5 text-[15px] leading-[1.6] text-prose"
					>
						<span
							aria-hidden="true"
							className="mt-[9px] size-[5px] shrink-0 rounded-[1.5px] bg-tree-accent"
						/>
						<span>
							<Inline text={item} />
						</span>
					</li>
				))}
			</ul>
		</Panel>
	);
}

function Quote({ text, by }: Extract<Block, { type: "quote" }>) {
	const [name, role] = by ? by.split(/,\s*/, 2) : [];

	return (
		<figure className="pull-quote not-prose">
			<blockquote>
				<Inline text={text} />
			</blockquote>
			{name ? (
				<figcaption>
					{name}
					{role ? <span className="text-mute/60"> · {role}</span> : null}
				</figcaption>
			) : null}
		</figure>
	);
}

function Compare({ left, right }: Extract<Block, { type: "compare" }>) {
	return (
		<div className="not-prose my-10 grid gap-4 sm:grid-cols-2">
			{[left, right].map((side, column) => {
				const strong = column === 1;

				return (
					<div
						key={side.title}
						className={`compare-card ${strong ? "is-strong" : ""}`}
					>
						<p
							className={`${LABEL_CLASS} ${strong ? "text-tree-accent" : ""}`}
						>
							{side.title}
						</p>
						<ol className="mt-5 flex flex-col gap-3.5">
							{side.items.map((item, index) => (
								<li
									key={item}
									className="flex gap-3 text-[15px] leading-[1.6]"
								>
									<span className="pt-1 font-mono text-[11px] text-mute/70">
										{pad(index + 1)}
									</span>
									<span className={strong ? "text-ink" : "text-mute"}>
										<Inline text={item} />
									</span>
								</li>
							))}
						</ol>
					</div>
				);
			})}
		</div>
	);
}

function Steps({ items }: Extract<Block, { type: "steps" }>) {
	return (
		<ol className="not-prose my-10 flex flex-col">
			{items.map((item, index) => (
				<li key={item.title} className="step relative flex gap-5 pb-7 last:pb-0">
					<span className="relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border border-line bg-page font-mono text-[11px] text-ink">
						{pad(index + 1)}
					</span>
					<div className="flex flex-col gap-1 pt-0.5">
						<p className="text-[15px] font-medium text-ink">{item.title}</p>
						<p className="text-[15px] leading-relaxed text-mute">
							<Inline text={item.text} />
						</p>
					</div>
				</li>
			))}
		</ol>
	);
}

function Timeline({ items }: Extract<Block, { type: "timeline" }>) {
	return (
		<ol className="not-prose my-12 border-t border-line">
			{items.map((item) => (
				<li
					key={item.when}
					className="grid gap-2 border-b border-line py-6 sm:grid-cols-[8.5rem_minmax(0,1fr)] sm:gap-8"
				>
					<p className="font-mono text-[12px] leading-[1.6] tracking-label text-mute uppercase sm:pt-[3px]">
						{item.when}
					</p>
					<div className="flex flex-col gap-1.5">
						<p className="text-[17px] leading-[1.4] font-medium text-ink">
							{item.title}
						</p>
						<p className="text-[15px] leading-[1.65] text-mute">
							<Inline text={item.text} />
						</p>
					</div>
				</li>
			))}
		</ol>
	);
}

export function Chapter({ block }: { block: Extract<Block, { type: "chapter" }> }) {
	return (
		<h2 id={block.id} className="chapter">
			<span className="chapter-n">{pad(block.n)}</span>
			<span>{block.title}</span>
		</h2>
	);
}

export function Blocks({ items }: { items: Block[] }) {
	return (
		<>
			{items.map((block, index) => {
				const key = `${block.type}-${index}`;

				switch (block.type) {
					case "p":
						return (
							<p key={key}>
								<Inline text={block.text} />
							</p>
						);

					case "chapter":
						return <Chapter key={key} block={block} />;

					case "h3":
						return <h3 key={key}>{block.text}</h3>;

					case "list":
						return block.ordered ? (
							<ol key={key}>
								{block.items.map((item) => (
									<li key={item}>
										<Inline text={item} />
									</li>
								))}
							</ol>
						) : (
							<ul key={key}>
								{block.items.map((item) => (
									<li key={item}>
										<Inline text={item} />
									</li>
								))}
							</ul>
						);

					case "code":
						return (
							<CodeBlock
								key={key}
								code={block.code}
								file={block.file}
								lang={block.lang}
							/>
						);

					case "diagram":
						return (
							<figure key={key} className="not-prose figure">
								<div className="figure-card">
									<div
										role="region"
										aria-label={`${block.caption} (scrolls sideways on small screens)`}
										tabIndex={0}
										className="diagram-scroll"
									>
										<Diagram name={block.name} />
									</div>
								</div>
								<figcaption>{block.caption}</figcaption>
							</figure>
						);

					case "shot":
						return <Shot key={key} {...block} />;

					case "compare":
						return <Compare key={key} {...block} />;

					case "steps":
						return <Steps key={key} {...block} />;

					case "timeline":
						return <Timeline key={key} {...block} />;

					case "callout":
						return (
							<Callout
								key={key}
								tone={block.tone}
								title={block.title}
								text={block.text}
							/>
						);

					case "quote":
						return <Quote key={key} {...block} />;

					case "takeaways":
						return <Takeaways key={key} items={block.items} />;
				}
			})}
		</>
	);
}
