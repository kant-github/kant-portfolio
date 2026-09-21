export type Testimonial = {
	id: string;
	quote: string;
	name: string;
	role: string;
	phoneHidden?: boolean;
};

export type Spot = {
	x: number;
	y: number;
	w: number;
	tilt: number;
};

export const BOARD = { w: 1600, h: 770, pin: 8 };

export const testimonials: Testimonial[] = [
	{
		id: "t1",
		quote: "Shipped the whole real-time layer faster than we scoped it, and it has not gone down since. The kind of engineer you hand a hard problem to and then stop worrying about it.",
		name: "Jane Doe",
		role: "Engineering Lead",
	},
	{
		id: "t2",
		quote: "Handed him a vague brief and got back something better than what we described. He asked the three questions nobody else thought to ask.",
		name: "John Roe",
		role: "Product Manager",
	},
	{
		id: "t3",
		quote: "The kind of engineer who fixes the problem behind the problem. Our incident count dropped for reasons that only became obvious months later.",
		name: "Alex Doe",
		role: "Founder",
	},
	{
		id: "t4",
		quote: "Turned a flaky prototype into something we could actually put in front of customers, without ever making it feel like a rewrite.",
		name: "Sam Roe",
		role: "Design Lead",
		phoneHidden: true,
	},
	{
		id: "t5",
		quote: "Clear communication, no drama, and the code still reads well six months later. That last part is rarer than it should be.",
		name: "Riya Doe",
		role: "Backend Engineer",
	},
	{
		id: "t6",
		quote: "Reviews from him made the whole team better. Direct about the problem, never about the person.",
		name: "Mark Roe",
		role: "Platform Engineer",
		phoneHidden: true,
	},
];

export const PLACEMENT: Record<string, Spot> = {
	t1: { x: 330, y: 90, w: 430, tilt: -2 },
	t2: { x: 800, y: 60, w: 430, tilt: 2 },
	t3: { x: 1270, y: 130, w: 440, tilt: -1.5 },
	t4: { x: 300, y: 430, w: 440, tilt: 1.5 },
	t5: { x: 790, y: 500, w: 430, tilt: -2 },
	t6: { x: 1265, y: 540, w: 440, tilt: 2 },
};

export const THREADS: [string, string][] = [
	["t1", "t2"],
	["t2", "t3"],
	["t1", "t4"],
	["t2", "t5"],
	["t3", "t6"],
	["t4", "t5"],
	["t5", "t6"],
];

export function pct(value: number, total: number) {
	return `${(value / total) * 100}%`;
}

export function threadPath(a: Spot, b: Spot) {
	return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
}
