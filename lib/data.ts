export const profile = {
	name: "Rishi Kant",
	role: "Full Stack Developer",
	email: "kantrishi7779@gmail.com",
	established: "2003",
	location: "Noida, India",
	latitude: 28.5355,
	longitude: 77.391,
	company: "AppX",
	companyHref: "https://appx.co.in",
	avatar: "/images/Rishi.JPG",
};

export const socials = {
	github: "https://github.com/kant-github",
	linkedin: "https://www.linkedin.com/in/kant-linked/",
	x: "https://x.com/khairrishi",
};

export type Shot = {
	src: string;
	alt: string;
};

export const showcase: Shot[] = [
	{ src: "/images/work/matcha.png", alt: "Matcha" },
	{ src: "/images/work/highgarden.png", alt: "HighGarden" },
	{ src: "/images/work/winterfell.png", alt: "Winterfell" },
	{ src: "/images/work/nocturn.png", alt: "Nocturn" },
];

export type ExperienceItem = {
	period: string;
	role: string;
	org: string;
	href: string;
	badge?: "yc";
	description: string;
};

export const experience: ExperienceItem[] = [
	{
		period: "NOV 2025 – NOW",
		role: "Full stack developer at",
		org: "AppX",
		href: "https://appx.co.in",
		badge: "yc",
		description:
			"Building applications and dashboards from the ground up for educators and creators, and the backend behind them, which serves 400 million requests a day with high availability.",
	},
	{
		period: "2025",
		role: "Open-source contributor at",
		org: "Twenty",
		href: "https://github.com/twentyhq/twenty",
		description:
			"Fixed UI bugs across the codebase, improving layout and responsiveness, and worked with the community to keep the design consistent across the platform.",
	},
];

export type StackItem = {
	name: string;
	note: string;
	logo: string;
	href: string;
};

export const stack: StackItem[] = [
	{
		name: "TypeScript",
		note: "Language",
		logo: "/images/stack/typescript.svg",
		href: "https://typescriptlang.org",
	},
	{
		name: "Next.js",
		note: "Framework",
		logo: "/images/stack/nextjs.svg",
		href: "https://nextjs.org",
	},
	{
		name: "React",
		note: "Interfaces",
		logo: "/images/stack/react.svg",
		href: "https://react.dev",
	},
	{
		name: "Tailwind CSS",
		note: "Styling",
		logo: "/images/stack/tailwindcss.svg",
		href: "https://tailwindcss.com",
	},
	{
		name: "Node.js",
		note: "Runtime",
		logo: "/images/stack/nodejs.svg",
		href: "https://nodejs.org",
	},
	{
		name: "Socket.IO",
		note: "Realtime",
		logo: "/images/stack/socketio.svg",
		href: "https://socket.io",
	},
	{
		name: "PostgreSQL",
		note: "Database",
		logo: "/images/stack/postgresql.svg",
		href: "https://postgresql.org",
	},
	{
		name: "Redis",
		note: "Cache & Pub/Sub",
		logo: "/images/stack/redis.svg",
		href: "https://redis.io",
	},
	{
		name: "Kafka",
		note: "Streaming",
		logo: "/images/stack/kafka.svg",
		href: "https://kafka.apache.org",
	},
	{
		name: "Docker",
		note: "Containers",
		logo: "/images/stack/docker.svg",
		href: "https://docker.com",
	},
	{
		name: "Kubernetes",
		note: "Orchestration",
		logo: "/images/stack/kubernetes.svg",
		href: "https://kubernetes.io",
	},
	{
		name: "AWS",
		note: "Infrastructure",
		logo: "/images/stack/amazonwebservices.svg",
		href: "https://aws.amazon.com",
	},
	{
		name: "Solana",
		note: "On-chain",
		logo: "/images/stack/solana.svg",
		href: "https://solana.com",
	},
	{
		name: "Ethereum",
		note: "On-chain",
		logo: "/images/stack/ethereum.svg",
		href: "https://ethereum.org",
	},
	{
		name: "Solidity",
		note: "Smart contracts",
		logo: "/images/stack/solidity.svg",
		href: "https://soliditylang.org",
	},
	{
		name: "Hardhat",
		note: "Contract tooling",
		logo: "/images/stack/hardhat.svg",
		href: "https://hardhat.org",
	},
	{
		name: "GitHub",
		note: "Code & CI",
		logo: "/images/stack/github.svg",
		href: "https://github.com",
	},
];

export const personal = {
	blurb: "Away from the terminal I am usually listening to something loud or reading about distributed systems.",
	photos: {
		caption: "Some moments from this year",
		linkLabel: "See more on X",
		href: socials.x,
		items: [
			{
				src: "/images/gallery/01.jpg",
				alt: "With friends on a night out",
			},
			{
				src: "/images/gallery/04.jpg",
				alt: "An evening walk with a friend",
			},
			{
				src: "/images/gallery/02.jpg",
				alt: "A late night build session around the table",
			},
			{
				src: "/images/gallery/03.jpg",
				alt: "An evening walk with a friend",
			},
		],
	},
};

export const contactLinks = [
	{
		label: "Email",
		value: profile.email,
		href: `mailto:${profile.email}`,
		icon: "mail" as const,
	},
	{
		label: "X.com",
		value: "@khairrishi",
		href: socials.x,
		icon: "x" as const,
	},
	{
		label: "GitHub",
		value: "@kant-github",
		href: socials.github,
		icon: "github" as const,
	},
	{
		label: "LinkedIn",
		value: "/in/kant-linked",
		href: socials.linkedin,
		icon: "linkedin" as const,
	},
];
