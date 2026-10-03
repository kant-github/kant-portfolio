import type { Block } from "@/lib/case-studies/types";

const SHOTS = "/images/case-studies/taste";

export const taste: Block[] = [
	{
		type: "p",
		text: "I gave this as a talk at Bootcamp 1.0. The slides were short, so this is the long version. It has the code, the numbers, and the parts I had to skip on stage.",
	},
	{
		type: "p",
		text: "It is not a talk about how to write code. It is about approach: owning what you build from the first screen to the last edge case. I use Winterfell as the example all the way through, because I built it end to end and I know where every mistake is.",
	},

	{ type: "chapter", n: 1, title: "The AI era", id: "ai-era" },
	{
		type: "p",
		text: "AI can now copy almost anything. Design, frontend, backend, you name it. There is a loud debate online about whether we still need human engineers, or whether AI has made the whole field pointless.",
	},
	{
		type: "p",
		text: "So what is left for us?",
	},
	{
		type: "p",
		text: "My answer: the code is getting cheap, but **judgement is not**. A model can write a sign-in page in ten seconds. It will not ask what happens when a Google user wants to export to GitHub. It will not notice the tab eating two gigabytes of memory. Someone has to care about those things, and that care is what people feel when they use your app.",
	},
	{
		type: "takeaways",
		items: [
			"Writing code is no longer the hard part. Knowing what good looks like is.",
		],
	},

	{ type: "chapter", n: 2, title: "The 1% difference", id: "one-percent" },
	{
		type: "p",
		text: "Most apps that fail do not fail on the big feature. They fail on a hundred small things that nobody checked. Each one is about 1% of the experience. Alone, none of them matters. Together, they decide if someone comes back. That is the butterfly effect: tiny details, big result.",
	},
	{
		type: "p",
		text: "Here are the six I care about most, each with a real example from Winterfell.",
	},

	{ type: "h3", text: "Edge cases" },
	{
		type: "p",
		text: "Every user gets 3 contracts a day. The easy version of this is a 429 error and the message “limit reached”. That is correct, and also useless. The user's next question is “ok, when can I try again?”, and the server already knows the answer.",
	},
	{
		type: "p",
		text: "So the server finds your oldest contract inside the last 24 hours. Your next slot opens exactly 24 hours after it. That time goes back with the error, and the chat box shows “You have reached your daily limit, try again at 4:12 PM”.",
	},
	{
		type: "code",
		lang: "ts",
		file: "apps/server/src/middlewares/middleware.dailyRateLimit.ts",
		code: `const window_start = new Date(Date.now() - DailyRateLimit.WINDOW_MS);

const contracts = await prisma.contract.findMany({
    where: { userId: user.id, createdAt: { gte: window_start } },
    orderBy: { createdAt: 'asc' },
});

if (contracts.length >= limit.CONTRACTS_PER_DAY) {
    const oldest = contracts[0].createdAt;
    const allowed_time = new Date(oldest.getTime() + DailyRateLimit.WINDOW_MS);
    ResponseWriter.custom(res, 429, {
        success: false,
        message: 'Limit reached',
        meta: { next_allowed_time: allowed_time.toISOString() },
    });
    return;
}`,
	},
	{
		type: "p",
		text: "Notice this is a **rolling** window, not a reset at midnight. If it reset at midnight, someone could use 3 contracts at 11:58 PM and 3 more at 12:01 AM. With a rolling window, “3 a day” really means any 24 hours.",
	},
	{
		type: "p",
		text: "There is a second limit too: 3 messages per contract. When you hit it, the box does not just say no. It offers “start new chat” and carries your template over to the new chat, so you do not lose what you were doing.",
	},

	{ type: "h3", text: "Micro-interactions" },
	{
		type: "p",
		text: "Generating a contract takes a while. A spinner for 40 seconds feels broken. So the loader tells you what is happening right now: “Analyzing Request”, then “Generating Code”, then “Creating Files”. While a file is being written, it shows that file's name and icon.",
	},
	{
		type: "p",
		text: "Nothing got faster. But the wait feels shorter, because you can see progress. People forgive slow. They do not forgive silent.",
	},

	{ type: "h3", text: "Performance" },
	{
		type: "p",
		text: "This is my favourite bug. While a contract streamed in, the Chrome tab froze and then crashed with “Aw, Snap!” (out of memory). Small contracts were fine. Big ones killed the tab.",
	},
	{
		type: "p",
		text: "Here is how the stream works. The server sends events, one per line. The browser gets the data in small chunks, adds each chunk to a buffer, and splits the buffer on newlines to find full events.",
	},
	{
		type: "p",
		text: "The problem: the last event holds **every generated file**, so it is one line of several megabytes with no newline until the very end. On every new chunk, the old code split the whole buffer again from the start. A 2 MB event in 1 KB chunks means about 2,000 chunks, and each one re-reads everything that came before. The work grows with the square of the size. That added up to **2 GB** of memory churn on the main thread.",
	},
	{
		type: "p",
		text: "The fix is one idea: remember where you already looked. Anything before that point cannot contain a newline, so never read it again.",
	},
	{
		type: "code",
		lang: "ts",
		file: "apps/web/src/lib/server/generate_contract.ts",
		code: `buffer += decoder.decode(value, { stream: true });

let nl = buffer.indexOf('\\n', search_from);
while (nl !== -1) {
    handle_line(buffer.slice(0, nl));
    buffer = buffer.slice(nl + 1);
    nl = buffer.indexOf('\\n');
}
// nothing before this point can contain a newline, so never rescan it
search_from = buffer.length;`,
	},
	{
		type: "p",
		text: "Same output, byte for byte. In a test that copies the real loop, memory churn went from **2.00 GB to 0.002 GB**, and the time went from **1626 ms to 35 ms**.",
	},
	{
		type: "callout",
		tone: "note",
		title: "Why this matters beyond Winterfell",
		text: "Any time you add to a growing buffer and then scan the whole buffer, you have this bug waiting for big input. Chat apps, log viewers and file uploads all hit it. Ask yourself: does my loop re-read data it has already read?",
	},

	{ type: "h3", text: "Thoughtful defaults" },
	{
		type: "p",
		text: "A default is a decision you make so the user does not have to. Enter sends the message and Shift + Enter adds a new line, because that is what every chat app taught people.",
	},
	{
		type: "p",
		text: "Builds are a less visible example. Building an Anchor program is slow. If you press build twice without changing anything, the second build is wasted. So before each build, the server hashes the code and compares it to the hash saved at the last build.",
	},
	{
		type: "code",
		lang: "ts",
		file: "apps/socket/src/services/services.build_cache.ts",
		code: `static check_build_cache(contract: Contract) {
    if (contract.lastBuildStatus === 'NEVER_BUILT') return false;
    const old_contract_hash = contract.codeHash;
    const current_state_hash = this.create_hash(contract.code);
    return old_contract_hash === current_state_hash;
}`,
	},
	{
		type: "p",
		text: "If they match, the terminal answers “Build retrieved from cache” in a moment instead of a minute. The user never sees this decision. They just feel that the app is fast.",
	},

	{ type: "h3", text: "The do-it-now mindset" },
	{
		type: "p",
		text: "When you notice a small problem, fix it now. Not next sprint. “Later” is where small problems go to become the reason people leave. Most of the fixes above took less than an hour. Writing a ticket about them would have taken almost as long.",
	},

	{ type: "h3", text: "UI/UX and DX" },
	{
		type: "p",
		text: "DX means developer experience. Winterfell's users are developers, so the app should feel like their own tools. It has a real terminal (Cmd/Ctrl + J), file search (Cmd + K) and a shortcut sheet (Cmd + /). The terminal even handles typos like a shell does.",
	},
	{
		type: "shot",
		src: `${SHOTS}/terminal.png`,
		alt: "The Winterfell playground with the terminal open. It lists the winter commands, and a mistyped “winter buildl” gets “command not found. Try --help”.",
		caption: "A typo gets a hint, not a stack trace.",
		width: 1920,
		height: 1080,
		wide: true,
	},
	{
		type: "takeaways",
		items: [
			"Small details add up. Users cannot name them, but they feel them.",
			"Always tell people what is happening and what they can do next.",
		],
	},

	{ type: "chapter", n: 3, title: "Project vs product", id: "project-vs-product" },
	{
		type: "p",
		text: "These two look the same while you are building them. They stop looking the same the week after you ship.",
	},
	{
		type: "compare",
		left: {
			title: "Project",
			items: [
				"Built to show what it does.",
				"Bugs and improvements are “next sprint” problems.",
				"Shortcuts are taken to hit the deadline.",
			],
		},
		right: {
			title: "Product",
			items: [
				"Built so real users can come in and smash it.",
				"You own quality at every level, and refine it until it truly serves people.",
				"Thinks about scale, maintenance and what comes next.",
			],
		},
	},
	{
		type: "diagram",
		name: "line-vs-loop",
		caption: "One has an end you can point at. The other only has a next round.",
		wide: true,
	},
	{
		type: "p",
		text: "A project is done when it works. A product is done when people keep using it, which means it is never really done. A product mindset means spending time on details other people would skip. Most of this case study is those details.",
	},

	{
		type: "chapter",
		n: 4,
		title: "23 days: the Winterfell timeline",
		short: "23 days",
		id: "timeline",
	},
	{
		type: "p",
		text: "Winterfell is like Lovable, but for Solana smart contracts. You type “create a counter program”, and it writes the Anchor code, sets up the files, and builds it for you in the browser.",
	},
	{
		type: "diagram",
		name: "commit-timeline",
		caption: "Every bar is one day of commits on the Winterfell repo. The three nodes are the moments that mattered.",
	},
	{
		type: "timeline",
		items: [
			{
				when: "Early Sep 2025",
				title: "The spark",
				text: "I went to a Solana event in Mumbai run by Superteam and Apex. I saw teams building deep Web3 infrastructure, and some had grown from small projects to billion-dollar revenue. That changed what I thought was possible.",
			},
			{
				when: "9 Oct, 7:30 PM",
				title: "The idea lands in class",
				text: "In a 100x class we were taking apart how Lovable is built. Kirat said that if someone built Lovable for Anchor smart contracts, it would be a good fit for the Colosseum and Superteam hackathons. The class ended at 7:30.",
			},
			{
				when: "9 Oct, 8:30 PM",
				title: "The repo is live",
				text: "One hour later the repo was live, the database was set up, and sign-in worked. The first commit is from 8:27 PM.",
			},
			{
				when: "21 Oct",
				title: "First production deploy",
				text: "The first fixes for the production deploy on Vercel land.",
			},
			{
				when: "31 Oct",
				title: "23 days in",
				text: "23 days and 264 commits after the first one, the core app is built. Winterfell went on to win a $1000 prize in a Superteam hackathon. I kept going after that: 260 more commits in November and 215 in December.",
			},
		],
	},
	{
		type: "shot",
		src: `${SHOTS}/playground.png`,
		alt: "The Winterfell playground. On the left, the chat with an execution checklist from Planning to Completed. In the middle, the project files. On the right, the generated Rust code for a counter program.",
		caption: "The playground: chat on the left, files in the middle, code on the right.",
		width: 1920,
		height: 1080,
		wide: true,
	},
	{ type: "h3", text: "How the parts fit together" },
	{
		type: "p",
		text: "Shipping fast does not mean one big file. Winterfell is a monorepo with four apps: `web` (Next.js), `server` (Express, Prisma and Postgres), `socket` (WebSockets), and `kubernetes` (builds). Each part does one job.",
	},
	{
		type: "diagram",
		name: "winterfell-pipeline",
		caption: "Top: a prompt becomes code. Bottom: the code gets built in its own container.",
		wide: true,
	},
	{
		type: "p",
		text: "**Generating.** Your prompt goes to a planning model first. It decides the contract name, the plan and which files will change. Then a coding model streams the code, and a small model at the end writes the IDL (the description of your program that clients use). Each stage is sent to the browser as it happens, using Server-Sent Events, a one-way stream from server to browser. That is what drives the loader from chapter 2.",
	},
	{
		type: "p",
		text: "**Building.** Building Rust takes minutes and a lot of CPU, so it must not run on the web server. The browser sends “build” over a WebSocket. The socket server puts a job on a queue (BullMQ on Redis). A worker starts a Kubernetes Job, which is a short-lived container just for your build. It runs `anchor build` and sends the logs back through Redis to your terminal.",
	},
	{
		type: "p",
		text: "One build failing or hanging cannot slow down anyone else. Each job has a 15-minute limit and is cleaned up after it finishes.",
	},
	{
		type: "takeaways",
		items: [
			"Speed comes from clear parts, not from skipping structure.",
			"Keep slow and heavy work away from the server that answers requests.",
		],
	},

	{
		type: "chapter",
		n: 5,
		title: "Understand the user journey",
		short: "The user journey",
		id: "journey",
	},
	{
		type: "p",
		text: "Before building screens, I map the path a user takes, from hearing about the app to trusting it. Every stage has its own way to lose them.",
	},
	{
		type: "steps",
		items: [
			{
				title: "Entry",
				text: "Users find Winterfell in places developers already spend time.",
			},
			{
				title: "Getting in",
				text: "Sign in with Google or GitHub. GitHub is needed to export code.",
			},
			{
				title: "Discovery",
				text: "Clear navigation shows who we are and what the app does.",
			},
			{
				title: "Playground",
				text: "Where the real value is. Loading, skeletons and retries live here.",
			},
			{
				title: "Retention",
				text: "Did they get what they came for? If they feel stuck once, they leave.",
			},
		],
	},
	{ type: "h3", text: "Getting in: two buttons, one hidden problem" },
	{
		type: "p",
		text: "Our users are developers, and the best feature is pushing your contract to your own GitHub repo. To do that, Winterfell needs GitHub access with the `repo` scope. So GitHub sign-in is important. But not everyone wants to start with GitHub, so Google sign-in is there too.",
	},
	{
		type: "p",
		text: "That creates a problem. Someone signs in with Google, builds a contract, then clicks export. Now they need GitHub. If they sign in with GitHub, the easy code would create a **second account**, and their contract would be stuck in the first one.",
	},
	{
		type: "p",
		text: "So “Connect GitHub” sets a short cookie (it lasts 5 minutes) with the current user's id before starting the GitHub sign-in. When GitHub sends the user back, the server sees the cookie and attaches GitHub to the existing account instead of creating a new one. If that GitHub account already belongs to someone else, it refuses.",
	},
	{ type: "h3", text: "Playground: plan for the bad network" },
	{
		type: "p",
		text: "Even a small edge case here can ruin the whole experience. The terminal runs over a WebSocket, and connections drop: laptop sleeps, Wi-Fi switches, server restarts. If the app just gives up, the user's terminal is dead and they do not know why.",
	},
	{
		type: "p",
		text: "So the client reconnects by itself. It waits 1 second, then 2, then 4, doubling up to 30 seconds. This is called exponential backoff. If thousands of clients lose the server at once, they do not all hammer it at the same moment when it comes back. After 5 tries it keeps trying every 5 seconds. And if the user closed the connection on purpose, it does not reconnect at all.",
	},
	{
		type: "code",
		lang: "ts",
		file: "apps/web/src/class/socket.client.ts",
		code: `private attempt_reconnect() {
    if (this.is_manually_closed) return;

    this.reconnect_attempts++;

    let delay: number;

    if (this.reconnect_attempts <= this.max_reconnect_attempts) {
        delay = this.reconnect_delay;
        this.reconnect_delay = Math.min(this.reconnect_delay * 2, this.max_reconnect_delay);
    } else {
        delay = this.persistent_reconnect_delay;
        this.reconnect_delay = 1000;
    }

    this.reconnect_timeout = setTimeout(() => {
        if (!this.is_manually_closed) this.initialize_connection();
    }, delay);
}`,
	},
	{
		type: "p",
		text: "The same thinking is on the server. Jobs on the queue retry up to 3 times with growing delays. And if you send a second prompt while the first is still generating, the server says no (409) instead of running two at once and mixing up your files.",
	},
	{
		type: "takeaways",
		items: [
			"Map the journey first. Each stage loses people in a different way.",
			"Assume the network will fail, and decide what the user sees when it does.",
		],
	},

	{
		type: "chapter",
		n: 6,
		title: "The iceberg principle",
		short: "The iceberg",
		id: "iceberg",
	},
	{
		type: "p",
		text: "This example is from another app I built, not Winterfell. It had a simple feature: **add collaborator**. One input, one button. It looks like a ten-minute job.",
	},
	{
		type: "diagram",
		name: "iceberg",
		caption: "What the user sees is the tip. The checks underneath are the real work.",
		wide: true,
	},
	{
		type: "p",
		text: "As developers, we usually skip what is under the water. But should we? Ask three questions:",
	},
	{
		type: "list",
		ordered: true,
		items: [
			"Does this email belong to a real user on the platform?",
			"If not, what happens? Show an error, send an invite, or keep it pending?",
			"If yes, do we add them right away, or only after they accept?",
		],
	},
	{
		type: "p",
		text: "Here is how I would answer them, and why.",
	},
	{
		type: "p",
		text: "**Always send an invite, even to existing users.** Adding someone to a project without asking is a way to spam them, and it gives you two code paths to maintain. With invites, there is one path: create an invite, then the person accepts it.",
	},
	{
		type: "p",
		text: "**Do not tell the inviter whether the email has an account.** If the app says “no user with this email”, anyone can type emails to find out who uses your platform. So the message is always “Invite sent”. Only the email itself is different: “join the project” or “create an account to join”.",
	},
	{
		type: "p",
		text: "**Give the invite a state.** An invite is `pending`, then `accepted`, `declined` or `expired`. Saving that state is what lets you show “Pending” in the list, resend, or cancel.",
	},
	{
		type: "code",
		lang: "sql",
		file: "invites.sql",
		code: `create type invite_status as enum ('pending', 'accepted', 'declined', 'expired');

create table invites (
  id          uuid primary key default gen_random_uuid(),
  project_id  uuid not null references projects(id) on delete cascade,
  email       text not null,
  invited_by  uuid not null references users(id),
  status      invite_status not null default 'pending',
  token       text not null unique,
  expires_at  timestamptz not null,
  created_at  timestamptz not null default now()
);

-- one open invite per person per project
create unique index one_open_invite
  on invites (project_id, lower(email))
  where status = 'pending';`,
	},
	{
		type: "p",
		text: "That last index is easy to miss. Without it, a double click on “Invite” sends two emails and creates two rows. With it, the database refuses the second one, even if two requests arrive at the same moment.",
	},
	{
		type: "p",
		text: "Accepting needs care too. The link might be old. It might be opened by a different account than the one invited. And creating the member and updating the invite must happen together, so they go in one transaction (all steps succeed, or none do).",
	},
	{
		type: "code",
		lang: "ts",
		file: "accept-invite.ts",
		code: `export async function acceptInvite(token: string, userId: string) {
  return db.$transaction(async (tx) => {
    const invite = await tx.invite.findUnique({ where: { token } });
    if (!invite || invite.status !== "pending") return { ok: false, reason: "invalid" };

    if (invite.expiresAt < new Date()) {
      await tx.invite.update({ where: { id: invite.id }, data: { status: "expired" } });
      return { ok: false, reason: "expired" };
    }

    const user = await tx.user.findUnique({ where: { id: userId } });
    if (user?.email.toLowerCase() !== invite.email.toLowerCase()) {
      return { ok: false, reason: "wrong-account" };
    }

    await tx.member.create({ data: { projectId: invite.projectId, userId, role: "editor" } });
    await tx.invite.update({ where: { id: invite.id }, data: { status: "accepted" } });
    return { ok: true };
  });
}`,
	},
	{
		type: "p",
		text: "Each `reason` becomes a clear screen: “This invite has expired, ask for a new one” or “You are signed in as a different account”. None of this is visible on the surface. All of it is what makes onboarding feel smooth.",
	},
	{
		type: "takeaways",
		items: [
			"Before building a “simple” feature, list what can go wrong underneath.",
			"Let the database protect rules you cannot afford to break.",
		],
	},

	{
		type: "chapter",
		n: 7,
		title: "Good design feels obvious",
		short: "Design feels obvious",
		id: "design",
	},
	{
		type: "quote",
		text: "If a user has to think too much, the design has failed.",
	},
	{ type: "h3", text: "Spacing" },
	{
		type: "p",
		text: "Use more spacing, not more content. Good websites do not feel crowded. Even on one screen, the layout should feel clean, text should be easy to read, and elements should not fight for attention.",
	},
	{
		type: "p",
		text: "Minimal design is a personal choice. But minimal does not mean empty. It means only what is needed. White space is not wasted space. It helps people focus on one thing at a time.",
	},
	{ type: "h3", text: "Typography and colour" },
	{
		type: "p",
		text: "Typography is order. It decides what people see first, what they see next, and so on. You control that with four things: font size, font weight, colour and position.",
	},
	{
		type: "p",
		text: "Keep the colour palette small. It keeps the mood consistent across the site. And remember that colour pulls the eye before text does, so use your strongest colour only on the one thing you want people to do.",
	},
	{
		type: "p",
		text: "Keep animations few. Think of them as communication, not decoration. An animation should tell you something: this opened, this moved, this is loading.",
	},
	{ type: "h3", text: "Reading the Winterfell landing page" },
	{
		type: "p",
		text: "Here is the landing page with those rules marked. Follow the numbers in the order your eyes move.",
	},
	{
		type: "shot",
		src: `${SHOTS}/landing.png`,
		alt: "The Winterfell landing page with five numbered markers on the headline, prompt box, top navigation, sign-in button and the links at the bottom left.",
		width: 1920,
		height: 995,
		wide: true,
		notes: [
			{
				x: 72,
				y: 26,
				title: "Seen first",
				text: "The headline. Large, bold and light-coloured on a dark scene, so it wins.",
			},
			{
				x: 71.5,
				y: 49,
				title: "Seen second",
				text: "A big input box with a clear example inside. You know what to type without reading docs.",
			},
			{
				x: 63.5,
				y: 4.5,
				title: "Everything in one place",
				text: "Features, pricing, FAQ and about, grouped in one small bar.",
			},
			{
				x: 98.5,
				y: 4.5,
				title: "The one key button",
				text: "Sign in is the only filled purple button up top, so it is easy to find.",
			},
			{
				x: 18.5,
				y: 92,
				title: "Support, not shouting",
				text: "Explore Playground and the docs link sit quietly in the corner for people who want more.",
			},
		],
	},
	{
		type: "takeaways",
		items: [
			"Decide what people should see first, second and third, then design for that order.",
			"Spacing, a small palette and calm motion do most of the work.",
		],
	},

	{
		type: "chapter",
		n: 8,
		title: "Taste is not personal preference",
		short: "Taste is trained",
		id: "taste",
	},
	{
		type: "p",
		text: "At the talk I asked the room a question: is taste just personal preference?",
	},
	{
		type: "quote",
		text: "If taste is just personal preference, then everyone's is already perfect.",
		by: "Paul Graham, co-founder of Y Combinator",
	},
	{
		type: "p",
		text: "That cannot be true, because some apps clearly feel better than others. So taste is something you can get better at. You cannot download it, and nobody can force it on you. You train it with intent.",
	},
	{
		type: "p",
		text: "Start with one habit: look at websites as a developer, not only as a user. When something feels good, stop and ask why. Then save it for your next project.",
	},
	{
		type: "steps",
		items: [
			{
				title: "Inspiration",
				text: "Scroll real products, not side projects.",
			},
			{
				title: "Decode",
				text: "Work out why they behave the way they do.",
			},
			{
				title: "Internalize",
				text: "Rebuild those interactions yourself.",
			},
			{
				title: "Refine",
				text: "Remove what is not needed and make it yours, even if you copied it first.",
			},
		],
	},
	{
		type: "p",
		text: "You do not always need a Figma file to start. A design in your head is just imagination. The real work happens when the design is built, made fast, and holds up with real users.",
	},

	{
		type: "chapter",
		n: 9,
		title: "Write it with your bare hands",
		short: "Bare hands",
		id: "bare-hands",
	},
	{
		type: "p",
		text: "Learn to write clean code, not just UIs. And when you are learning something, write it yourself. Stop using Cursor or any agent tool for that part.",
	},
	{
		type: "p",
		text: "Writing code by hand is becoming a rare skill. I have seen projects so heavily generated that one file had about 2,800 lines, with emojis in the comments.",
	},
	{
		type: "p",
		text: "Every line of code is a liability. It has to be read, tested and changed later. AI is great when you already know what good code looks like. When you do not, it just helps you make more of the bad kind, faster.",
	},
	{
		type: "quote",
		text: "The hard work of thinking can't be outsourced to AI, only amplified by it.",
		by: "a line Kirat shared on X",
	},
	{
		type: "p",
		text: "UI is the voice of your application. It is how all the work underneath speaks to people. So the work underneath must be solid, and the UI must say it well.",
	},

	{ type: "chapter", n: 10, title: "Remember this", id: "remember" },
	{
		type: "quote",
		text: "In a world of scarcity, we treasure tools. In a world of abundance, we treasure taste.",
	},
	{
		type: "p",
		text: "Today almost everyone has the same powerful tools. What sets people and products apart is not the tools. It is the judgement, design sense and decisions behind how they are used.",
	},
	{
		type: "p",
		text: "Or, as I said at the end of the talk: “Quality ke peeche bhago, design jhak maar ke peeche aayegi.” Chase quality, and good design will follow you whether it wants to or not.",
	},
	{
		type: "takeaways",
		items: [
			"Code is cheap now. Judgement is what people pay for.",
			"Fix the 1% things now, not next sprint.",
			"Map the user journey and plan for each way it can break.",
			"Every simple feature has an iceberg under it.",
			"Taste is trained: look, decode, rebuild, refine.",
		],
	},
	{
		type: "p",
		text: "The code from the class is on GitHub at [kant-github/winterfell-class](https://github.com/kant-github/winterfell-class).",
	},
];
