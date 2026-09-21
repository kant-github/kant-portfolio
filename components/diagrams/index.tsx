import type { DiagramName } from "@/lib/writing/types";
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
	WARN,
} from "@/components/diagrams/parts";

function WsOneServer() {
	return (
		<Svg
			viewBox="0 0 560 190"
			title="One server holding every connection in a room, broadcasting by looping over memory"
		>
			<Heads />
			<Box x={20} y={30} w={90} h={34} label="Player A" />
			<Box x={20} y={78} w={90} h={34} label="Player B" />
			<Box x={20} y={126} w={90} h={34} label="Player C" />

			<Box
				x={230}
				y={62}
				w={120}
				h={66}
				label="Server"
				sub="rooms in memory"
				tone="accent"
			/>

			<Arrow x1={110} y1={47} x2={228} y2={85} tone="accent" />
			<Arrow x1={110} y1={95} x2={228} y2={95} tone="accent" />
			<Arrow x1={110} y1={143} x2={228} y2={105} tone="accent" />

			<Box
				x={430}
				y={62}
				w={110}
				h={66}
				label="room: 42"
				sub="Set of 3 sockets"
			/>
			<Arrow x1={352} y1={95} x2={428} y2={95} />
			<Caption x={280} y={175}>
				one process can see every socket, so a broadcast is a loop
			</Caption>
		</Svg>
	);
}

function WsTwoServers() {
	return (
		<Svg
			viewBox="0 0 560 230"
			title="Two servers behind a load balancer, where server A cannot reach players connected to server B"
		>
			<Heads />
			<Box x={20} y={90} w={96} h={40} label="Load" sub="balancer" />

			<Box
				x={190}
				y={28}
				w={120}
				h={54}
				label="Server A"
				sub="host + Player A"
				tone="accent"
			/>
			<Box
				x={190}
				y={148}
				w={120}
				h={54}
				label="Server B"
				sub="Player B + C"
				tone="warn"
			/>

			<Arrow x1={116} y1={100} x2={188} y2={60} />
			<Arrow x1={116} y1={112} x2={188} y2={168} />

			<Box x={410} y={28} w={130} h={54} label="gets the message" />
			<Box
				x={410}
				y={148}
				w={130}
				h={54}
				label="hears nothing"
				tone="warn"
			/>

			<Arrow
				x1={310}
				y1={55}
				x2={408}
				y2={55}
				tone="accent"
				label="broadcast"
			/>
			<Arrow
				x1={310}
				y1={175}
				x2={408}
				y2={175}
				tone="warn"
				dashed
				label="never sent"
			/>

			<text x={280} y={118} textAnchor="middle" fontSize={10} fill={WARN}>
				A and B cannot see each other&apos;s sockets
			</text>
			<Caption x={280} y={220}>
				no error is thrown — server A told everyone it could see
			</Caption>
		</Svg>
	);
}

function WsRedis() {
	return (
		<Svg
			viewBox="0 0 640 250"
			title="Redis Pub/Sub carrying a message between servers so each one delivers to its own sockets"
		>
			<Heads />
			<Box
				x={20}
				y={100}
				w={110}
				h={48}
				label="Server A"
				sub="publishes"
				tone="accent"
			/>
			<Box
				x={265}
				y={96}
				w={110}
				h={56}
				label="Redis"
				sub="channel room:42"
				tone="accent"
			/>
			<Box
				x={510}
				y={40}
				w={110}
				h={48}
				label="Server B"
				sub="subscribed"
			/>
			<Box
				x={510}
				y={160}
				w={110}
				h={48}
				label="Server C"
				sub="subscribed"
			/>

			<Arrow
				x1={130}
				y1={124}
				x2={263}
				y2={124}
				tone="accent"
				label="publish"
			/>
			<Arrow
				x1={375}
				y1={112}
				x2={508}
				y2={70}
				tone="accent"
				label="push"
			/>
			<Arrow
				x1={375}
				y1={136}
				x2={508}
				y2={180}
				tone="accent"
				label="push"
			/>

			<Box x={510} y={-2} w={110} h={30} label="its own sockets" />
			<Box x={510} y={218} w={110} h={30} label="its own sockets" />
			<Arrow x1={565} y1={38} x2={565} y2={30} />
			<Arrow x1={565} y1={210} x2={565} y2={216} />

			<Caption x={320} y={236}>
				no server needs to know about another server&apos;s connections
			</Caption>
		</Svg>
	);
}

function TrafficPeaks() {
	// A day of traffic: a low overnight trough, a working-day plateau, and one
	// notification spike that dwarfs the mean.
	const points = [
		12, 9, 7, 6, 6, 8, 14, 26, 38, 44, 47, 45, 48, 52, 49, 46, 44, 92, 58,
		42, 36, 28, 20, 15,
	];
	const w = 620;
	const h = 170;
	const stepX = w / (points.length - 1);
	const max = 100;
	const y = (v: number) => h - (v / max) * (h - 30) - 10;
	const path = points
		.map(
			(v, i) =>
				`${i === 0 ? "M" : "L"} ${(i * stepX).toFixed(1)} ${y(v).toFixed(1)}`,
		)
		.join(" ");
	const mean = points.reduce((a, b) => a + b, 0) / points.length;

	return (
		<Svg
			viewBox={`0 0 ${w} ${h + 34}`}
			title="A day of traffic showing the flat average line against a spike roughly twice the daily plateau"
		>
			<Heads />
			<line
				x1={0}
				y1={h - 10}
				x2={w}
				y2={h - 10}
				stroke={LINE}
				strokeWidth={1}
			/>

			<path
				d={`${path} L ${w} ${h - 10} L 0 ${h - 10} Z`}
				fill={SURFACE}
			/>
			<path
				d={path}
				fill="none"
				stroke={ACCENT}
				strokeWidth={1.75}
				strokeLinejoin="round"
			/>

			<line
				x1={0}
				y1={y(mean)}
				x2={w}
				y2={y(mean)}
				stroke={MUTE}
				strokeWidth={1}
				strokeDasharray="5 5"
			/>
			<text x={6} y={y(mean) - 6} fontSize={10} fill={MUTE}>
				average ~4,600/s
			</text>

			<circle cx={17 * stepX} cy={y(92)} r={4} fill={WARN} />
			<text
				x={17 * stepX - 8}
				y={y(92) - 10}
				textAnchor="end"
				fontSize={10}
				fill={WARN}
			>
				notification goes out
			</text>

			<Caption x={0} y={h + 22} anchor="start">
				00:00
			</Caption>
			<Caption x={w / 2} y={h + 22}>
				capacity has to cover the spike, not the line
			</Caption>
			<Caption x={w} y={h + 22} anchor="end">
				24:00
			</Caption>
		</Svg>
	);
}

function CacheHierarchy() {
	const layers = [
		{ label: "Browser", sub: "already has it" },
		{ label: "CDN", sub: "near the user" },
		{ label: "App cache", sub: "in process" },
		{ label: "Redis", sub: "shared" },
		{ label: "Database", sub: "last resort" },
	];
	const w = 640;
	const boxW = 108;
	const gap = (w - layers.length * boxW) / (layers.length - 1);

	return (
		<Svg
			viewBox="0 0 640 170"
			title="Five layers a request passes through, from the browser to the database, each able to answer and stop"
		>
			<Heads />
			{layers.map((layer, index) => {
				const x = index * (boxW + gap);
				return (
					<g key={layer.label}>
						<Box
							x={x}
							y={46}
							w={boxW}
							h={52}
							label={layer.label}
							sub={layer.sub}
							tone={
								index === layers.length - 1 ? "warn" : "accent"
							}
						/>
						{index < layers.length - 1 ? (
							<Arrow
								x1={x + boxW}
								y1={72}
								x2={x + boxW + gap - 2}
								y2={72}
								dashed
							/>
						) : null}
						<text
							x={x + boxW / 2}
							y={120}
							textAnchor="middle"
							fontSize={9}
							fill={MUTE}
						>
							↑ answers here
						</text>
					</g>
				);
			})}
			<text x={0} y={28} fontSize={10} fill={INK}>
				request →
			</text>
			<Caption x={320} y={150}>
				every layer that answers is load the database never sees
			</Caption>
		</Svg>
	);
}

function CircuitBreaker() {
	return (
		<Svg
			viewBox="0 0 560 200"
			title="Circuit breaker states: closed, open and half-open, and the transitions between them"
		>
			<Heads />
			<Box
				x={20}
				y={70}
				w={120}
				h={56}
				label="CLOSED"
				sub="calls pass through"
				tone="accent"
			/>
			<Box
				x={220}
				y={70}
				w={120}
				h={56}
				label="OPEN"
				sub="fail instantly"
				tone="warn"
			/>
			<Box
				x={420}
				y={70}
				w={120}
				h={56}
				label="HALF-OPEN"
				sub="let one through"
			/>

			<Arrow
				x1={140}
				y1={88}
				x2={218}
				y2={88}
				tone="warn"
				label="too many failures"
			/>
			<Arrow x1={340} y1={88} x2={418} y2={88} label="after cool-off" />

			<path
				d="M 480 126 C 480 176, 80 176, 80 128"
				fill="none"
				stroke={ACCENT}
				strokeWidth={1.25}
				markerEnd="url(#head-accent)"
			/>
			<text
				x={280}
				y={172}
				textAnchor="middle"
				fontSize={9}
				fill={ACCENT}
			>
				test call succeeded → close
			</text>

			<path
				d="M 470 68 C 430 24, 300 24, 282 66"
				fill="none"
				stroke={WARN}
				strokeWidth={1.25}
				strokeDasharray="4 4"
				markerEnd="url(#head-warn)"
			/>
			<text x={376} y={26} textAnchor="middle" fontSize={9} fill={WARN}>
				still failing → open again
			</text>
		</Svg>
	);
}

function LatencyBudget() {
	const parts = [
		{ label: "app code", value: 12, tone: ACCENT },
		{ label: "database", value: 38, tone: MUTE },
		{ label: "cache", value: 6, tone: ACCENT },
		{ label: "other services", value: 31, tone: MUTE },
		{ label: "network", value: 13, tone: MUTE },
	];
	const w = 600;
	const total = parts.reduce((sum, part) => sum + part.value, 0);
	let x = 0;

	return (
		<Svg
			viewBox="0 0 600 150"
			title="A response time broken into parts, showing most of it is spent waiting on other systems"
		>
			<text x={0} y={18} fontSize={10} fill={INK}>
				one response, 100% of its time
			</text>
			{parts.map((part) => {
				const width = (part.value / total) * w;
				const bar = (
					<g key={part.label}>
						<rect
							x={x}
							y={32}
							width={width - 2}
							height={30}
							rx={3}
							fill={part.tone === ACCENT ? ACCENT : SURFACE}
							stroke={part.tone === ACCENT ? ACCENT : LINE}
							strokeWidth={1}
							opacity={part.tone === ACCENT ? 0.85 : 1}
						/>
						<text
							x={x + width / 2}
							y={82}
							textAnchor="middle"
							fontSize={9}
							fill={MUTE}
						>
							{part.label}
						</text>
						<text
							x={x + width / 2}
							y={96}
							textAnchor="middle"
							fontSize={9}
							fill={INK}
						>
							{part.value}%
						</text>
					</g>
				);
				x += width;
				return bar;
			})}
			<Caption x={300} y={128}>
				the code you write is rarely the slow part — waiting is
			</Caption>
			<Caption x={300} y={142}>
				shape is illustrative, not measured
			</Caption>
		</Svg>
	);
}

function LineVsLoop() {
	// Strict mirror: two 300-wide halves, centred at 160 and 460, divider at
	// 310. Every element is placed relative to its own half's centre, which is
	// what keeps the whole drawing balanced.
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

			{/* the line: 210 wide, centred on leftMid */}
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
			{/* the full stop: a short bar where the line runs out */}
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

			{/* the loop: r=54 centred on rightMid, so both halves balance */}
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

const DIAGRAMS: Record<DiagramName, () => React.ReactElement> = {
	"ws-one-server": WsOneServer,
	"ws-two-servers": WsTwoServers,
	"ws-redis": WsRedis,
	"traffic-peaks": TrafficPeaks,
	"cache-hierarchy": CacheHierarchy,
	"circuit-breaker": CircuitBreaker,
	"latency-budget": LatencyBudget,
	"line-vs-loop": LineVsLoop,
};

export function Diagram({ name }: { name: DiagramName }) {
	const Component = DIAGRAMS[name];
	return <Component />;
}
