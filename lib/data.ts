export type Entry = {
	meta: string;
	metaHref?: string;
	lead?: string;
	title?: string;
	badge?: "yc";
	href?: string;
	description: string;
};

export type Section = {
	id: string;
	label: string;
	intro?: string;
	entries: Entry[];
};

export const profile = {
	name: "Rishi Kant",
	role: "Full Stack Developer",
	email: "kantrishi7779@gmail.com",
	company: "AppX",
	companyHref: "https://appx.co.in",
	location: "Noida, India",
	flag: "🇮🇳",
};

export const socials = {
	github: "https://github.com/kant-github",
	linkedin: "https://www.linkedin.com/in/kant-linked/",
	x: "https://x.com/khairrishi",
};

export const sections: Section[] = [
	{
		id: "experience",
		label: "Experience",
		intro: "A short overview of where I've worked so far: mostly backend systems built to stay up under load, and the product interfaces sitting on top of them.",
		entries: [
			{
				meta: "NOV 2025 – NOW",
				lead: "Full stack developer at",
				title: "AppX",
				href: "https://appx.co.in",
				badge: "yc",
				description:
					"Building applications and dashboards from the ground up for educators and creators, and the backend behind them, which serves 400 million requests a day with high availability.",
			},
			{
				meta: "2025",
				lead: "Open-source contributor at",
				title: "Twenty",
				href: "https://github.com/twentyhq/twenty",
				description:
					"Fixed UI bugs across the codebase, improving layout and responsiveness, and worked with the community to keep the design consistent across the platform.",
			},
		],
	},
	{
		id: "projects",
		label: "Projects",
		entries: [
			{
				meta: "nocturn.app",
				metaHref: "https://nocturn.app",
				title: "Nocturn",
				href: "https://nocturn.app",
				description:
					"A real-time quiz platform where players compete for on-chain rewards, with rooms synced over WebSockets and Redis Pub/Sub, and an orchestrator service driving question transitions.",
			},
			{
				meta: "winterfell.dev",
				metaHref: "https://winterfell.dev",
				title: "Winterfell",
				href: "https://winterfell.dev",
				description:
					"An AI-powered platform for writing, testing and deploying Anchor smart contracts on Solana, straight from the browser. Won 1st place at the Superteam India Hackathon.",
			},
		],
	},
	{
		id: "skills",
		label: "Skills",
		entries: [
			{
				meta: "FRONTEND",
				description: "ReactJS, NextJS, Recoil, Tailwind CSS",
			},
			{
				meta: "BACKEND",
				description:
					"NodeJS, ExpressJS, WebSockets, Redis, Pub/Sub, Kafka",
			},
			{
				meta: "DEVOPS",
				description:
					"Docker, Git, AWS (EC2, S3, IAM, CloudFront), CI/CD, GitHub Actions, NginX",
			},
			{
				meta: "TOOLS",
				description: "Linux, VSCode, GitHub, Postman",
			},
		],
	},
	{
		id: "extras",
		label: "Extras",
		entries: [
			{
				meta: "SUPERTEAM INDIA",
				title: "1st place, Superteam India Hackathon",
				description:
					"Won first prize for Winterfell. The product picked up real users after launch.",
			},
			{
				meta: "SPEAKER",
				title: "Project vs Product Mindset",
				description:
					"Ran a session on the difference between building a project and building a product: intent, user empathy, and thinking past the demo.",
			},
		],
	},
];
