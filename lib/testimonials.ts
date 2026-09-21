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
		quote: "Honestly, I handed him the realtime piece expecting to babysit it. Never had to. It shipped early and it just kept working.",
		name: "Anjan Suman",
		role: "Engineering Lead",
	},
	{
		id: "t2",
		quote: "I gave him a pretty vague brief and got back something better than what I described. He asked me three questions nobody else thought to ask.",
		name: "Piyush Raj",
		role: "Product Manager",
	},
	{
		id: "t3",
		quote: "He fixes the thing behind the thing. Our incident count dropped and it took me months to work out that was why.",
		name: "Aniruddha Maradwar",
		role: "Founder",
	},
	{
		id: "t4",
		quote: "He took a prototype that broke if you looked at it wrong and made it something we could actually put in front of customers. Never once felt like a rewrite.",
		name: "Ashish M",
		role: "Design Lead",
		phoneHidden: true,
	},
	{
		id: "t5",
		quote: "No drama, always clear about what he is doing, and I can still read the code six months later. That last part is rarer than it should be.",
		name: "Keshav Bagaade",
		role: "Backend Engineer",
	},
	{
		id: "t6",
		quote: "His reviews made the whole team better. Always direct about the problem, never about the person. Took me a while to learn that one.",
		name: "Harkirat Singh",
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
