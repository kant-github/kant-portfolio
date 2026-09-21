"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { IconType } from "react-icons";
import {
	RiGithubFill,
	RiLinkedinFill,
	RiMailLine,
	RiTwitterXFill,
} from "react-icons/ri";
import {
	useCallback,
	useState,
	type CSSProperties,
	type FormEvent,
} from "react";
import { CONTENT_INDEX, Section } from "@/components/section";
import { contactLinks, profile } from "@/lib/data";

type Status = "idle" | "sending" | "sent" | "error";

const ICONS: Record<string, IconType> = {
	mail: RiMailLine,
	x: RiTwitterXFill,
	github: RiGithubFill,
	linkedin: RiLinkedinFill,
};

const FIELD_CLASS =
	"w-full rounded-lg border border-line bg-surface px-3 py-2 text-ink placeholder:text-mute focus:border-ink/30 focus:outline-none";

function openMailClient(name: string, email: string, message: string) {
	const subject = encodeURIComponent(`Message from ${name || "the site"}`);
	const body = encodeURIComponent(`${message}\n\n${name} <${email}>`);
	window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
}

export function Contact() {
	const [status, setStatus] = useState<Status>("idle");

	const submit = useCallback(async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		const form = event.currentTarget;
		const data = new FormData(form);
		const name = String(data.get("name") ?? "");
		const email = String(data.get("email") ?? "");
		const message = String(data.get("message") ?? "");

		setStatus("sending");

		try {
			const res = await fetch("/api/contact", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ name, email, message }),
			});

			const result = await res.json();

			if (result?.delivered) {
				setStatus("sent");
				form.reset();
				return;
			}

			openMailClient(name, email, message);
			setStatus("idle");
		} catch {
			openMailClient(name, email, message);
			setStatus("idle");
		}
	}, []);

	return (
		<Section
			label="Contact"
			intro="Use the form, or reach me through any of the links below."
		>
			<form
				onSubmit={submit}
				className="stage-item flex flex-col gap-3"
				style={{ "--i": CONTENT_INDEX } as CSSProperties}
			>
				<div className="flex flex-col gap-3 sm:flex-row">
					<input
						name="name"
						required
						placeholder="Name"
						autoComplete="name"
						className={FIELD_CLASS}
					/>
					<input
						name="email"
						type="email"
						required
						placeholder="Email"
						autoComplete="email"
						className={FIELD_CLASS}
					/>
				</div>

				<textarea
					name="message"
					required
					rows={4}
					placeholder="Message"
					className={`${FIELD_CLASS} resize-none`}
				/>

				<div className="flex items-center gap-3">
					<button
						type="submit"
						disabled={status === "sending"}
						className="cursor-pointer rounded-lg border border-line bg-surface px-4 py-2 text-ink transition-opacity hover:opacity-70 disabled:opacity-50"
					>
						{status === "sending" ? "Sending" : "Send message"}
					</button>

					<AnimatePresence initial={false}>
						{status === "sent" ? (
							<motion.span
								key="sent"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								exit={{ opacity: 0 }}
								className="font-mono text-xs tracking-label text-mute uppercase"
							>
								Message sent
							</motion.span>
						) : null}
					</AnimatePresence>
				</div>
			</form>

			<ul className="flex flex-col">
				{contactLinks.map((link, index) => {
					const Icon = ICONS[link.icon];

					return (
						<li key={link.label}>
							<a
								href={link.href}
								target={
									link.href.startsWith("mailto:")
										? undefined
										: "_blank"
								}
								rel="noreferrer"
								className="stage-item stage-rule flex items-center justify-between gap-4 py-3 transition-opacity hover:opacity-70"
								style={
									{
										"--i": CONTENT_INDEX + 1 + index,
										"--rule-origin":
											index % 2 ? "right" : "left",
									} as CSSProperties
								}
							>
								<span className="flex items-center gap-2 font-mono text-xs tracking-label text-mute uppercase">
									<Icon
										className="size-4 shrink-0"
										aria-hidden="true"
									/>
									{link.label}
								</span>
								<span className="text-ink">{link.value}</span>
							</a>
						</li>
					);
				})}
			</ul>
		</Section>
	);
}
