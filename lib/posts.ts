export const postBodies: Record<string, string[]> = {
	"scaling-websockets-with-redis": [
		"A single WebSocket server is easy. Every connection lives in one process, so broadcasting to a room is a loop over an array held in memory.",
		"The moment you run two servers behind a load balancer that breaks. A host connected to server A cannot reach a participant parked on server B, because neither process knows the other's sockets exist.",
		"Redis Pub/Sub fixes this by moving the fan-out one layer down. Each server subscribes to the channels for the rooms it is serving. Publishing an event sends it to Redis, Redis pushes it to every subscribed server, and each server delivers it to its own local sockets.",
		"The part worth planning for is ordering. Pub/Sub gives you no delivery guarantee, so anything that must arrive exactly once, such as a question transition, belongs in a dedicated worker rather than a broadcast.",
	],
	"400-million-requests": [
		"Four hundred million requests a day sounds enormous until you divide it. That is roughly 4,600 per second on average, and averages are the least useful number in the set.",
		"Traffic is not flat. A single notification can push a quiet minute into a peak that is ten times the mean, so the capacity that matters is the peak, not the average.",
		"Most of the work is avoiding work. Cache what does not change, collapse duplicate reads, and keep the hot path free of anything that touches disk.",
		"The rest is failing well. Timeouts on every outbound call, a circuit breaker so one slow dependency cannot take the whole service down, and a queue for anything the user does not need answered right now.",
	],
	"project-vs-product": [
		"A project is finished when it works. A product is finished when someone keeps using it, which means it is never really finished.",
		"That single difference changes what you build. A project optimises for the demo. A product optimises for the second week, when the novelty is gone and only the usefulness remains.",
		"It also changes what you cut. On a project you cut whatever is slowing you down. On a product you cut whatever nobody uses, which is a much harder thing to admit.",
		"The most useful habit I picked up is asking who breaks if this disappears. If the answer is nobody, it was a project.",
	],
};
