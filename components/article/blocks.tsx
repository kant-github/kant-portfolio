import Image from "next/image";
import type { CSSProperties } from "react";
import {
	RiAlertFill,
	RiInformationFill,
	RiLightbulbFlashFill,
} from "react-icons/ri";
import { CodeBlock } from "@/components/article/code-block";
import { Inline } from "@/components/article/inline";
import { Band } from "@/components/band";
import { Diagram } from "@/components/diagrams";
import { LABEL_CLASS } from "@/components/section";
import type { Block } from "@/lib/writing/types";

function Figure({
	caption,
	wide,
	children,
}: {
	caption?: string;
	wide?: boolean;
	children: React.ReactNode;
}) {
	const figure = (
		<figure className={wide ? "mx-auto w-full max-w-3xl px-4" : "my-8"}>
			{children}
			{/* styled by `.article figcaption` — sentence case, not the
			    uppercase label treatment */}
			{caption ? <figcaption>{caption}</figcaption> : null}
		</figure>
	);

	// A wide figure breaks out of the 640px column through Band, which is the
	// only full-bleed primitive on the site.
	return wide ? <Band className="my-10">{figure}</Band> : figure;
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
	const Icon = tone === "warn" ? RiAlertFill : RiInformationFill;

	return (
		<aside
			className="lit-edge my-7 rounded-md border border-line bg-linear-to-b from-card-top to-card-bottom p-5 shadow-note"
			style={{ "--lit-rim": 0.1 } as CSSProperties}
		>
			<p className="flex items-center gap-2 text-ink">
				<Icon
					className={`size-4 shrink-0 ${tone === "warn" ? "text-amber-400" : "text-mute"}`}
					aria-hidden="true"
				/>
				<strong className="font-medium">{title}</strong>
			</p>
			<p className="mt-2 text-mute">
				<Inline text={text} />
			</p>
		</aside>
	);
}

function Takeaways({ items }: { items: string[] }) {
	return (
		<aside className="my-10 rounded-md border border-line bg-surface p-5">
			<p className={`flex items-center gap-2 ${LABEL_CLASS}`}>
				<RiLightbulbFlashFill className="size-3.5" aria-hidden="true" />
				The short version
			</p>
			<ul className="mt-4 flex flex-col gap-2.5">
				{items.map((item) => (
					<li key={item} className="flex gap-3 text-mute">
						<span aria-hidden="true" className="text-line">
							—
						</span>
						<span>
							<Inline text={item} />
						</span>
					</li>
				))}
			</ul>
		</aside>
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

					case "h2":
						return (
							<h2 key={key} id={block.id}>
								{block.text}
							</h2>
						);

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
							<Figure
								key={key}
								caption={block.caption}
								wide={block.wide}
							>
								{/* tabIndex makes the scroller keyboard-reachable; a
								    scrollable region without it fails WCAG 2.1.1 */}
								<div
									role="region"
									aria-label={`${block.caption} (scrolls sideways on small screens)`}
									tabIndex={0}
									className="diagram-scroll"
								>
									<Diagram name={block.name} />
								</div>
							</Figure>
						);

					case "image":
						return (
							<Figure key={key} caption={block.caption}>
								{/* framed like the gallery photos and capped well under the
								    text column, so a meme reads as an aside not a banner */}
								<span className="mx-auto block max-w-sm rounded-lg bg-white p-1 shadow-card">
									<Image
										src={block.src}
										alt={block.alt}
										width={block.width}
										height={block.height}
										sizes="(min-width: 640px) 384px, 90vw"
										className="h-auto w-full rounded-md"
									/>
								</span>
							</Figure>
						);

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
						return (
							<Band key={key} className="my-12">
								<blockquote className="mx-auto max-w-160 px-4 text-center text-[1.35rem] leading-[1.45] text-ink">
									<Inline text={block.text} />
								</blockquote>
							</Band>
						);

					case "stat":
						return (
							<div
								key={key}
								className="my-8 flex flex-col items-center gap-1 rounded-md border border-line bg-surface py-6"
							>
								<p className="font-mono text-3xl text-ink">
									{block.value}
								</p>
								<p className={LABEL_CLASS}>{block.label}</p>
								{block.note ? (
									<p className="mt-1 font-mono text-xs text-mute">
										{block.note}
									</p>
								) : null}
							</div>
						);

					case "takeaways":
						return <Takeaways key={key} items={block.items} />;
				}
			})}
		</>
	);
}
