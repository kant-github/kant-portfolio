import { profile } from "@/lib/data";

type Payload = {
	name?: string;
	email?: string;
	message?: string;
};

export async function POST(request: Request) {
	const apiKey = process.env.RESEND_API_KEY;

	if (!apiKey) {
		return Response.json({ delivered: false, reason: "unconfigured" });
	}

	let body: Payload;

	try {
		body = await request.json();
	} catch {
		return Response.json({ error: "Invalid body" }, { status: 400 });
	}

	const name = body.name?.trim();
	const email = body.email?.trim();
	const message = body.message?.trim();

	if (!name || !email || !message) {
		return Response.json({ error: "Missing fields" }, { status: 400 });
	}

	const res = await fetch("https://api.resend.com/emails", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			from: "Portfolio <onboarding@resend.dev>",
			to: [profile.email],
			reply_to: email,
			subject: `New message from ${name}`,
			text: `${name} <${email}>\n\n${message}`,
		}),
	});

	if (!res.ok) {
		return Response.json({ error: "Send failed" }, { status: 502 });
	}

	return Response.json({ delivered: true });
}
