import type { Block } from "@/lib/writing/types";

export const requests: Block[] = [
	{
		type: "p",
		text: "At AppX the backend serves around four hundred million requests a day. That number is on my CV and it sounds enormous, so it is worth saying plainly what it does and does not mean, because the honest version is more interesting than the impressive-sounding one.",
	},

	{ type: "h2", text: "Divide it first", id: "divide-it" },
	{
		type: "p",
		text: "Four hundred million a day is about 4,600 a second if the traffic were spread evenly across twenty-four hours.",
	},
	{
		type: "stat",
		value: "~4,600/s",
		label: "average requests per second",
		note: "400,000,000 ÷ 86,400 seconds",
	},
	{
		type: "p",
		text: "That is a real number and it is also the least useful number in the set, because traffic is never flat. Nobody uses a product for educators and creators uniformly at four in the morning.",
	},

	{ type: "h2", text: "The average is not the problem", id: "peaks" },
	{
		type: "p",
		text: "Real traffic has a shape. It follows the day, and on top of the daily curve sit spikes — a push notification, a class starting, a creator posting a link. A quiet minute becomes a very loud one in a few seconds.",
	},
	{
		type: "diagram",
		name: "traffic-peaks",
		caption: "The average is a flat line nobody ever experiences. Capacity has to cover the spike.",
		wide: true,
	},
	{
		type: "p",
		text: "So capacity is not sized against the average, it is sized against the peak, plus room to be wrong. If you build for 4,600 a second you will be down during the exact minute that matters most — the one where the most people are trying to use the thing.",
	},
	{
		type: "callout",
		tone: "warn",
		title: "The spike is self-inflicted more often than you think",
		text: "The loudest spikes usually come from something we did: a notification going out to everyone at once, a cache expiring for everyone at once, a cron job on the hour. Those are all schedulable, and spreading them out is cheaper than buying servers to survive them.",
	},

	{ type: "h2", text: "Averages hide the people having a bad time", id: "percentiles" },
	{
		type: "p",
		text: "The same trap applies to response times. \"Average response time is 120ms\" tells you almost nothing, because the average is dragged around by the bulk of easy requests.",
	},
	{
		type: "p",
		text: "**Percentiles** are the useful shape. **p50** is the middle: half of requests were faster. **p99** means ninety-nine percent were faster than this and one percent were slower. At 4,600 requests a second, that slowest one percent is **46 requests every second** having a bad time — thousands of real people a day.",
	},
	{
		type: "p",
		text: "The tail is also where your reputation lives. Nobody remembers the fast median. They remember the time the app hung.",
	},
	{
		type: "diagram",
		name: "latency-budget",
		caption: "A response time is a budget. Most of it is usually spent waiting on someone else.",
	},

	{ type: "h2", text: "Most of the work is avoiding work", id: "avoiding-work" },
	{
		type: "p",
		text: "The cheapest request is the one you never serve. Almost all of the engineering here is about stopping a request before it reaches the expensive thing, which is nearly always the database.",
	},
	{
		type: "p",
		text: "A request passes a series of layers, and each one is a chance to answer early and stop:",
	},
	{
		type: "diagram",
		name: "cache-hierarchy",
		caption: "Every layer that answers is a layer of load the database never sees.",
		wide: true,
	},
	{
		type: "list",
		items: [
			"**The browser** already has it, so no request leaves the device at all.",
			"**The CDN** — servers near the user holding copies of anything the same for everyone. It answers without ever contacting us.",
			"**An in-process cache** in the app itself, for the tiny set of things every request needs.",
			"**Redis**, shared by every app server, for things that are expensive to compute and fine to be a few seconds old.",
			"**The database**, which we would like to be the layer of last resort.",
		],
	},
	{
		type: "p",
		text: "A **cache hit rate** is just the share of requests answered by a layer instead of passing through. Moving that number a few points is worth far more than making the database faster, because it removes the work entirely rather than speeding it up.",
	},

	{ type: "h3", text: "The stampede" },
	{
		type: "p",
		text: "Caching has one failure mode worth knowing by name. A popular key expires. In the same instant, every request that wanted it misses, and all of them go to the database to rebuild the same value. The database gets hit with a few thousand copies of one query.",
	},
	{
		type: "p",
		text: "This is a **cache stampede**, or the thundering herd. The fix is to let one request do the rebuild and make the rest wait for that result — take a short lock on the key, and if you cannot get the lock, wait and read. Staggering expiry times slightly so a whole set of keys does not die together helps too.",
	},
	{
		type: "image",
		src: "/images/writing/memes/cache-expired.jpg",
		alt: "The Ancient Aliens meme: a man with wild hair gesturing with both hands mid-sentence.",
		caption: "I am not saying it was the cache. But it was the cache.",
		width: 500,
		height: 436,
	},

	{ type: "h2", text: "The rest is failing well", id: "failing-well" },
	{
		type: "p",
		text: "At this volume something is always a bit broken. A dependency is slow, a node is restarting, a network path is having a moment. The goal is not a system that never fails. It is a system where one failure stays one failure.",
	},

	{ type: "h3", text: "Timeouts on every outbound call" },
	{
		type: "p",
		text: "A call with no timeout will wait forever, and while it waits it holds a connection, a thread, and memory. A single slow dependency quietly consumes your whole capacity — every worker ends up parked on it and healthy requests have nowhere to run. A timeout converts an unbounded wait into a fast, contained failure you can handle.",
	},

	{ type: "h3", text: "Circuit breakers" },
	{
		type: "p",
		text: "If a dependency is failing, retrying it immediately is unkind to both of you. You are adding load to something already struggling, and paying the timeout every time.",
	},
	{
		type: "p",
		text: "A **circuit breaker** wraps the call and watches it. When failures cross a threshold it **opens** and fails instantly without trying, which gives the dependency room to recover. After a cool-off it goes **half-open** and lets a single request through as a test. If that works it closes and traffic resumes; if not, it opens again.",
	},
	{
		type: "diagram",
		name: "circuit-breaker",
		caption: "Closed, open, half-open. The middle state is what protects the thing that is already hurting.",
	},

	{ type: "h3", text: "A queue for anything that can wait" },
	{
		type: "p",
		text: "Plenty of work does not need to happen before the user gets a response. Emails, thumbnails, analytics, syncing to some other system. Putting that on a queue does two things: the response returns sooner, and the spike gets absorbed. A queue that is briefly a thousand items deep is a queue doing its job. The same thousand items done inline is an outage.",
	},

	{
		type: "quote",
		text: "Scale is not one clever trick. It is a lot of ordinary decisions about what you refuse to do on the hot path.",
	},

	{ type: "h2", text: "What the number actually means", id: "what-it-means" },
	{
		type: "p",
		text: "Four hundred million requests a day does not mean the code is exotic. Most of it is ordinary. What the number really buys you is that the boring things have to be right, because at this volume a rare event is a regular one.",
	},
	{
		type: "p",
		text: "Something that fails one time in a million happens four hundred times a day. You stop being able to call anything an edge case, and that changes how you write code more than any framework does.",
	},

	{
		type: "takeaways",
		items: [
			"Divide the big number first. 400M/day is ~4,600/s on average — and the average is the least useful number you have.",
			"Size for the peak, not the mean. The loudest spikes are usually self-inflicted and schedulable.",
			"Watch p99, not the average. One percent of 4,600/s is 46 unhappy requests every second.",
			"The cheapest request is one you never serve. Each cache layer is load the database never sees.",
			"Name the stampede: when a hot key expires, one rebuild should serve everyone waiting.",
			"Timeouts, circuit breakers and queues exist so one failure stays one failure.",
			"At this volume, one-in-a-million happens 400 times a day. Nothing is an edge case.",
		],
	},
];
