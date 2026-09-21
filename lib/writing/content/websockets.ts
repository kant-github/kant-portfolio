import type { Block } from "@/lib/writing/types";

export const websockets: Block[] = [
	{
		type: "p",
		text: "I built a real-time quiz platform called Nocturn. Everyone in a room sees the same question at the same moment, answers within a few seconds, and sees the scoreboard move. When it runs on one server this is genuinely easy. The first time I ran it on two, it broke in a way that took me a while to understand.",
	},
	{
		type: "p",
		text: "This is what breaks, why it breaks, and what I did about it.",
	},

	{ type: "h2", text: "What a WebSocket actually is", id: "what-is-a-websocket" },
	{
		type: "p",
		text: "A normal web request is a short conversation. The browser asks, the server answers, and the line is dropped. If the server later has something new to say, it has no way to reach you. You have to ask again.",
	},
	{
		type: "p",
		text: "A **WebSocket** is a connection that stays open. The browser and the server keep the line up and either side can speak whenever it wants. That is the whole appeal: the server can push a new question to you without you asking for it.",
	},
	{
		type: "p",
		text: "The cost is that an open line is a thing the server has to hold on to. A request is over in milliseconds and the memory is reclaimed. A WebSocket sits in memory for the length of the game. Ten thousand players means ten thousand live objects that a specific process is responsible for. That single sentence is the source of every problem in this article.",
	},

	{ type: "h2", text: "Why one server is easy", id: "one-server" },
	{
		type: "p",
		text: "With one server, a room is just an array in memory. Somebody joins, you push their connection into the array. You want to broadcast, you loop over it and write to each one.",
	},
	{
		type: "code",
		lang: "ts",
		file: "rooms.ts",
		code: `// one process, one source of truth
const rooms = new Map<string, Set<WebSocket>>();

function join(roomId: string, socket: WebSocket) {
  if (!rooms.has(roomId)) rooms.set(roomId, new Set());
  rooms.get(roomId)!.add(socket);
}

function broadcast(roomId: string, payload: unknown) {
  const message = JSON.stringify(payload);
  for (const socket of rooms.get(roomId) ?? []) {
    socket.send(message);
  }
}`,
	},
	{
		type: "diagram",
		name: "ws-one-server",
		caption: "One process holds every connection, so a broadcast is a loop over memory.",
	},
	{
		type: "p",
		text: "There is nothing clever here and that is the point. Every connection in the room is reachable from the same process, so the process can always answer the question \"who else is in this room\".",
	},

	{ type: "h2", text: "Then you add a second server", id: "two-servers" },
	{
		type: "p",
		text: "One server eventually runs out of memory, or you want to deploy without kicking everyone off. So you run two and put a **load balancer** in front — a piece of software that spreads incoming connections across your servers.",
	},
	{
		type: "p",
		text: "Now the players in a single room are split across two processes. The host is connected to server A. Half the players are parked on server B. The host answers a question, server A loops over its array, and only the people who happened to land on A hear about it.",
	},
	{
		type: "diagram",
		name: "ws-two-servers",
		caption: "Server A cannot see server B's sockets, so half the room never hears the message.",
	},
	{
		type: "p",
		text: "Nothing errors. No exception is thrown, no log line appears. Server A did exactly what you asked and told everyone it could see. The bug is silent, it only shows up under load, and it looks like a flaky network. That is what made it hard.",
	},
	{
		type: "image",
		src: "/images/writing/memes/works-on-one-server.jpg",
		alt: "The distracted boyfriend meme: a man turning to look at another woman while his partner stares at him in disbelief.",
		caption:
			"Me looking at horizontal scaling, and the single server that was working perfectly well.",
		width: 1200,
		height: 800,
	},

	{ type: "h3", text: "Why sticky sessions only postpone it" },
	{
		type: "p",
		text: "The usual first fix is **sticky sessions**: tell the load balancer to keep sending the same user back to the same server. This does not help. Stickiness keeps one *user* on one server. It does not keep a *room* on one server, and a room is the thing that has to be whole.",
	},
	{
		type: "p",
		text: "You could route by room instead, sending everyone in room 42 to server A. That does work, right up until room 42 gets popular and server A falls over on its own, or you deploy and have to move every room at once. You have swapped a correctness problem for a capacity problem.",
	},

	{ type: "h2", text: "Moving the fan-out one layer down", id: "redis-pubsub" },
	{
		type: "p",
		text: "The fix is to stop asking a server to know about connections it does not own. Instead of a server broadcasting to the room, it broadcasts to something every server is listening to.",
	},
	{
		type: "p",
		text: "I used **Redis Pub/Sub**. Publish and subscribe is a very small idea: a sender publishes a message to a named channel, and everyone subscribed to that channel gets a copy. Redis does not store it, does not know who you are, and does not care whether anyone was listening.",
	},
	{
		type: "p",
		text: "Each server subscribes to the channels for the rooms it currently serves. Sending an event becomes two hops: publish to Redis, Redis pushes it to every subscribed server, and each server writes to its own local sockets — the loop it was already good at.",
	},
	{
		type: "diagram",
		name: "ws-redis",
		caption: "Each server owns only its own sockets. Redis carries the message between them.",
		wide: true,
	},
	{
		type: "code",
		lang: "ts",
		file: "fanout.ts",
		code: `// one connection to publish, a separate one to subscribe:
// a Redis connection in subscriber mode cannot run normal commands
const publisher = createClient();
const subscriber = publisher.duplicate();

await subscriber.subscribe(\`room:\${roomId}\`, (message) => {
  // this fires on every server subscribed to the room
  broadcastLocally(roomId, message);
});

async function send(roomId: string, payload: unknown) {
  await publisher.publish(\`room:\${roomId}\`, JSON.stringify(payload));
}`,
	},
	{
		type: "callout",
		tone: "note",
		title: "One detail that costs an afternoon",
		text: "A Redis connection in subscriber mode cannot run ordinary commands. If you subscribe on the same client you use for everything else, your next `get` fails. You need two connections, which is what `duplicate()` is for.",
	},

	{ type: "h2", text: "What Pub/Sub does not give you", id: "what-pubsub-lacks" },
	{
		type: "p",
		text: "This is the part I would want to be asked about in an interview, because it is where the design either holds or quietly loses data.",
	},
	{
		type: "p",
		text: "Redis Pub/Sub is **fire and forget**. It hands the message to whoever is connected at that instant and then forgets it ever existed. Concretely:",
	},
	{
		type: "list",
		items: [
			"**No delivery guarantee.** If a server is mid-reconnect when you publish, it does not get the message. There is no retry and nothing tells you it was missed.",
			"**No replay.** A server that starts thirty seconds late has no way to catch up. The message is gone, not stored.",
			"**No ordering across channels.** Two messages on two channels can arrive in either order on the receiving side.",
		],
	},
	{
		type: "p",
		text: "For a scoreboard tick or a \"player joined\" badge, none of that matters. Miss one and the next one corrects it a second later.",
	},
	{
		type: "p",
		text: "For moving the whole room to the next question, it matters completely. That has to happen exactly once. If two servers both decide it is time, players get double-advanced. If nobody does, the game hangs and every player is staring at a question that will not move.",
	},
	{
		type: "quote",
		text: "Broadcasts are for things you can afford to miss. Anything that must happen exactly once does not belong in a broadcast.",
	},

	{ type: "h2", text: "So transitions got their own worker", id: "orchestrator" },
	{
		type: "p",
		text: "I pulled question transitions out of the socket layer entirely and gave them to a separate orchestrator process. It owns the clock. When a question expires it decides — once — that the room advances, writes that to the database, and only then publishes the result for the socket servers to deliver.",
	},
	{
		type: "p",
		text: "The important part is that the decision and the broadcast are separate steps. The broadcast is still fire-and-forget, and that is fine now, because the truth already lives in the database. A player whose message went missing asks \"what question are we on?\" on reconnect and gets the right answer.",
	},
	{
		type: "list",
		ordered: true,
		items: [
			"The orchestrator takes a short **lock** on the room, so only one worker can act even if two are running.",
			"It writes the new question index to the database. This is the moment the change is real.",
			"It publishes an event for the socket servers to fan out to players.",
			"Any player who missed the event catches up on reconnect from the database, not from the broadcast.",
		],
	},
	{
		type: "p",
		text: "A dropped worker cannot stall a game, because the lock expires and another worker picks the room up. A duplicated worker cannot double-advance it, because the lock stops the second one and the database write is the single source of truth.",
	},

	{ type: "h2", text: "The unglamorous parts", id: "unglamorous" },
	{
		type: "p",
		text: "Two things that are never in the tutorial and always in production.",
	},
	{
		type: "p",
		text: "**Reconnects.** Phones lock, tunnels drop, laptops sleep. A client will disappear and come back, and when it does it must be able to ask for current state rather than assume it stayed in sync. If your only path to state is the live message stream, a ten second disconnect means a broken game.",
	},
	{
		type: "p",
		text: "**Dead connections.** A socket can be closed at the other end without your server being told, so you sit there holding memory for someone who left twenty minutes ago. A **heartbeat** — a small ping on a timer, with the connection dropped if nothing comes back — is what reclaims that memory.",
	},

	{ type: "h2", text: "When Pub/Sub is the wrong tool", id: "when-not-pubsub" },
	{
		type: "p",
		text: "Pub/Sub was right for Nocturn because the messages are small, frequent, and disposable. A missed scoreboard update is corrected by the next one.",
	},
	{
		type: "p",
		text: "If a missed message is not self-correcting — a payment, an order, an audit trail — you want a log rather than a broadcast. **Redis Streams** or **Kafka** keep the message, track how far each consumer has read, and let a consumer that was offline pick up where it left off. That is a different tool for a different promise, and reaching for it here would have been weight I did not need.",
	},

	{
		type: "takeaways",
		items: [
			"One server is easy because one process can see every connection in the room.",
			"Two servers break silently. Nothing errors; half the room just never hears you.",
			"Redis Pub/Sub moves fan-out one layer down so no server needs to know another's sockets.",
			"Pub/Sub is fire-and-forget: no delivery guarantee, no replay, no ordering.",
			"Anything that must happen exactly once needs a lock and a database write, not a broadcast.",
			"Clients must be able to ask for state on reconnect instead of assuming they stayed in sync.",
		],
	},
];
