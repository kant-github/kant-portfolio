export type Entry = {
	meta: string;
	metaHref?: string;
	lead?: string;
	title?: string;
	badge?: "yc";
	href?: string;
	description: string;
	details?: string[];
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
				meta: "heydarwin.app",
				metaHref: "https://heydarwin.app",
				title: "Darwin",
				href: "https://heydarwin.app",
				description:
					"An autonomous engineering platform: teams file issues on a board, an agent picks one up inside a sandboxed VM, writes the fix and opens a pull request for review.",
				details: [
					"Five services split the work — API, an LLM router that picks the agent for each issue, a sandbox runner, the web app, and a reconciler — talking over Redis queues. The reconciler is the safety net: a process can die holding a claim, so it sweeps every thirty seconds for stale claims and runs that never reported back.",
					"Each issue gets its own machine. The runner boots an E2B sandbox, clones the repo with a short-lived GitHub token, and the agent commits, pushes a branch and opens the pull request from inside it.",
					"An agent reads the repository once on connect and writes a brief — stack, commands, conventions — that every later run starts from, next to a code graph it queries instead of grepping.",
					"Keyboard-first board: 36 chord shortcuts, a command palette, a searchable shortcut sheet. Kanban, Gantt and inbox views stay in sync live over WebSockets.",
					"Reviewing means seeing, not reading — every component the change touches is rebuilt on its own page at both commits with identical data, then checked by a headless browser.",
					"Claude Code, Codex and OpenCode sit behind one interface, pinned and baked into the sandbox image, so a project picks its agent and model per issue.",
				],
			},
			{
				meta: "winterfell.dev",
				metaHref: "https://winterfell.dev",
				title: "Winterfell",
				href: "https://winterfell.dev",
				description:
					"An AI-powered platform for writing, testing and deploying Anchor smart contracts on Solana, straight from the browser. Won 1st place at the Superteam India Hackathon.",
			},
			{
				meta: "nocturn.app",
				metaHref: "https://nocturn.app",
				title: "Nocturn",
				href: "https://nocturn.app",
				description:
					"A real-time quiz platform where players compete for on-chain rewards, with rooms synced over WebSockets and Redis Pub/Sub, and an orchestrator service driving question transitions.",
			},
		],
	},
	{
		id: "skills",
		label: "Skills",
		entries: [
			{
				meta: "ETHEREUM",
				description: "Ethereum basics, Solidity, Ethers.js",
			},
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
