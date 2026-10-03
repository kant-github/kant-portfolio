import { CommitTimeline } from "@/components/diagrams/commit-timeline";
import type { DiagramName } from "@/lib/case-studies/types";
import {
	ACCENT,
	Arrow,
	Box,
	Caption,
	Heads,
	INK,
	LINE,
	MUTE,
	SURFACE,
	Svg,
} from "@/components/diagrams/parts";

function LineVsLoop() {
	const leftMid = 160;
	const rightMid = 460;
	const stops = ["start", "build", "ship"];

	return (
		<Svg
			viewBox="0 0 620 214"
			title="A project drawn as a line that ends, beside a product drawn as a loop that keeps going"
		>
			<Heads />

			<text
				x={leftMid}
				y={30}
				textAnchor="middle"
				fontSize={11}
				fill={MUTE}
			>
				PROJECT
			</text>

			<line
				x1={leftMid - 105}
				y1={112}
				x2={leftMid + 95}
				y2={112}
				stroke={MUTE}
				strokeWidth={1.5}
				markerEnd="url(#head-plain)"
			/>
			{stops.map((label, index) => {
				const x = leftMid - 105 + index * 95;
				return (
					<g key={label}>
						<circle cx={x} cy={112} r={4} fill={MUTE} />
						<text
							x={x}
							y={136}
							textAnchor="middle"
							fontSize={9}
							fill={MUTE}
						>
							{label}
						</text>
					</g>
				);
			})}
			<line
				x1={leftMid + 100}
				y1={100}
				x2={leftMid + 100}
				y2={124}
				stroke={LINE}
				strokeWidth={1.5}
			/>
			<text
				x={leftMid}
				y={178}
				textAnchor="middle"
				fontSize={10}
				fill={MUTE}
			>
				done when it works
			</text>

			<line
				x1={310}
				y1={26}
				x2={310}
				y2={224}
				stroke={LINE}
				strokeWidth={1}
			/>

			<text
				x={rightMid}
				y={26}
				textAnchor="middle"
				fontSize={11}
				fill={ACCENT}
			>
				PRODUCT
			</text>

			<circle
				cx={rightMid}
				cy={112}
				r={54}
				fill="none"
				stroke={ACCENT}
				strokeWidth={1.5}
			/>
			<path
				d={`M ${rightMid - 6} 52 L ${rightMid + 4} 58 L ${rightMid - 6} 64 Z`}
				fill={ACCENT}
			/>
			{[
				["ship", rightMid, 44],
				["watch", rightMid + 78, 116],
				["learn", rightMid, 188],
				["cut", rightMid - 78, 116],
			].map(([label, x, y]) => (
				<text
					key={label as string}
					x={x as number}
					y={y as number}
					textAnchor="middle"
					fontSize={9}
					fill={MUTE}
				>
					{label as string}
				</text>
			))}
			<text
				x={rightMid}
				y={109}
				textAnchor="middle"
				fontSize={10}
				fill={INK}
			>
				never
			</text>
			<text
				x={rightMid}
				y={123}
				textAnchor="middle"
				fontSize={10}
				fill={INK}
			>
				finished
			</text>
		</Svg>
	);
}

function Iceberg() {
	const water = 92;
	const checks = [
		["real user?", 230, 128],
		["invite or error?", 230, 163],
		["accept first?", 230, 198],
		["who can invite?", 230, 233],
		["already a member?", 395, 128],
		["link expired?", 395, 163],
		["wrong account?", 395, 198],
		["double click?", 395, 233],
	] as const;

	return (
		<Svg
			viewBox="0 0 620 292"
			title="An iceberg. Above the water is one Add collaborator button. Below the water are eight checks it needs."
		>
			<polygon
				points={`245,${water} 280,30 340,30 375,${water}`}
				fill={SURFACE}
				stroke={LINE}
			/>
			<Box x={250} y={44} w={120} h={30} label="Add collaborator" tone="accent" />

			<polygon
				points={`212,${water + 2} 408,${water + 2} 520,172 470,274 150,282 88,182`}
				fill={SURFACE}
				stroke={LINE}
			/>

			<line
				x1={0}
				y1={water}
				x2={620}
				y2={water}
				stroke={ACCENT}
				strokeWidth={1}
				strokeDasharray="5 5"
				opacity={0.6}
			/>

			<Caption x={16} y={60} anchor="start">
				WHAT USERS SEE
			</Caption>
			<Caption x={16} y={124} anchor="start">
				WHAT YOU BUILD
			</Caption>

			{checks.map(([label, x, y]) => (
				<g key={label}>
					<circle cx={x - 62} cy={y - 3} r={2} fill={ACCENT} />
					<text x={x - 54} y={y} fontSize={10} fill={INK}>
						{label}
					</text>
				</g>
			))}
		</Svg>
	);
}

function WinterfellPipeline() {
	const top = 40;
	const bottom = 160;
	const h = 46;

	return (
		<Svg
			viewBox="0 0 640 262"
			title="Two rows. Generate: prompt, planner, coder, finalizer, storage. Build: terminal, WebSocket, queue, Kubernetes job, with logs flowing back to the terminal."
		>
			<Heads />

			<Caption x={10} y={24} anchor="start">
				GENERATE
			</Caption>
			<Box x={10} y={top} w={90} h={h} label="prompt" sub="you type" />
			<Box x={130} y={top} w={110} h={h} label="planner" sub="plan + files" />
			<Box x={270} y={top} w={110} h={h} label="coder" sub="streams code" tone="accent" />
			<Box x={410} y={top} w={100} h={h} label="finalizer" sub="writes the IDL" />
			<Box x={540} y={top} w={90} h={h} label="storage" sub="files saved" />
			<Arrow x1={100} y1={top + h / 2} x2={128} y2={top + h / 2} />
			<Arrow x1={240} y1={top + h / 2} x2={268} y2={top + h / 2} />
			<Arrow x1={380} y1={top + h / 2} x2={408} y2={top + h / 2} />
			<Arrow x1={510} y1={top + h / 2} x2={538} y2={top + h / 2} />
			<Caption x={320} y={110}>
				every stage streams back to the browser (SSE)
			</Caption>

			<line x1={10} y1={128} x2={630} y2={128} stroke={LINE} strokeWidth={1} />

			<Caption x={10} y={146} anchor="start">
				BUILD
			</Caption>
			<Box x={10} y={bottom} w={90} h={h} label="terminal" sub="browser" />
			<Box x={130} y={bottom} w={110} h={h} label="WebSocket" sub="socket app" />
			<Box x={270} y={bottom} w={110} h={h} label="queue" sub="BullMQ on Redis" />
			<Box x={410} y={bottom} w={100} h={h} label="k8s job" sub="anchor build" tone="accent" />
			<Arrow x1={100} y1={bottom + h / 2} x2={128} y2={bottom + h / 2} />
			<Arrow x1={240} y1={bottom + h / 2} x2={268} y2={bottom + h / 2} />
			<Arrow x1={380} y1={bottom + h / 2} x2={408} y2={bottom + h / 2} />

			<path
				d={`M 460 ${bottom + h} V 234 H 55 V ${bottom + h + 3}`}
				fill="none"
				stroke={MUTE}
				strokeWidth={1.25}
				strokeDasharray="4 4"
				markerEnd="url(#head-plain)"
			/>
			<Caption x={257} y={252}>
				logs stream back through Redis pub/sub
			</Caption>
		</Svg>
	);
}

const DIAGRAMS: Record<DiagramName, () => React.ReactElement> = {
	"line-vs-loop": LineVsLoop,
	iceberg: Iceberg,
	"winterfell-pipeline": WinterfellPipeline,
	"commit-timeline": CommitTimeline,
};

export function Diagram({ name }: { name: DiagramName }) {
	const Component = DIAGRAMS[name];
	return <Component />;
}
