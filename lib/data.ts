export const profile = {
	name: "Rishi Kant",
	role: "Engineer",
	email: "kantrishi7779@gmail.com",
	established: "2003",
	location: "Noida, India",
	company: "AppX",
	companyHref: "https://appx.co.in",
	avatar: "/images/Rishi.JPG",
};

export const socials = {
	github: "https://github.com/kant-github",
	linkedin: "https://www.linkedin.com/in/kant-linked/",
	x: "https://x.com/khairrishi",
};

export const socialLinks = [
	{
		name: "Email",
		href: `mailto:${profile.email}`,
		icon: "/images/social/gmail.svg",
	},
	{ name: "GitHub", href: socials.github, icon: "/images/social/github.svg" },
	{ name: "X", href: socials.x, icon: "/images/social/x.svg" },
	{
		name: "LinkedIn",
		href: socials.linkedin,
		icon: "/images/social/linkedin.svg",
	},
];

export type Shot = {
	src: string;
	/** Describes the screenshot, for anyone who cannot see it. */
	alt: string;
	name: string;
	/** Live site. */
	href: string;
	/** One line, shown when the card is opened. */
	blurb: string;
	/** True pixel size, so the opened card can use each shot's own ratio
	 * rather than forcing them all into the card's 4:3 crop. */
	width: number;
	height: number;
};

export const showcase: Shot[] = [
	{
		src: "/images/work/matcha.png",
		alt: "The Matcha board, showing every issue a team has filed laid out on one screen.",
		name: "Matcha",
		href: "https://heydarwin.app",
		blurb: "An engineering board where an agent picks up an issue, works on it in its own sandbox, and opens the pull request for review.",
		width: 1200,
		height: 900,
	},
	{
		src: "/images/work/highgarden.png",
		alt: "The HighGarden trading screen, with an open market and its price chart.",
		name: "HighGarden",
		href: "https://highgarden.trade",
		blurb: "A prediction market built on Solana, made to settle fast.",
		width: 3024,
		height: 1964,
	},
	{
		src: "/images/work/winterfell.png",
		alt: "The Winterfell editor, writing a Solana smart contract in the browser.",
		name: "Winterfell",
		href: "https://winterfell.dev",
		blurb: "Write, test and deploy Anchor smart contracts on Solana from the browser. First place at the Superteam India Hackathon.",
		width: 3024,
		height: 1964,
	},
	{
		src: "/images/work/nocturn.png",
		alt: "A live Nocturn quiz room, with players and the current question on screen.",
		name: "Nocturn",
		href: "https://nocturn.app",
		blurb: "A real-time quiz platform where players compete for on-chain rewards, with rooms synced over WebSockets and Redis Pub/Sub.",
		width: 1200,
		height: 900,
	},
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
		role: "Engineer at",
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
