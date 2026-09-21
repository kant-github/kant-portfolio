"use client";

import { useEffect, useState } from "react";
import { RiCheckLine, RiFileCopyLine } from "react-icons/ri";
import { copyText } from "@/lib/clipboard";

const RESET_DELAY = 2000;

export function CopyButton({ code }: { code: string }) {
	const [copied, setCopied] = useState(false);

	useEffect(() => {
		if (!copied) return;

		const timer = window.setTimeout(() => setCopied(false), RESET_DELAY);
		return () => window.clearTimeout(timer);
	}, [copied]);

	return (
		<button
			type="button"
			onClick={async () => setCopied(await copyText(code))}
			aria-label="Copy code to clipboard"
			className="flex cursor-pointer items-center gap-1.5 font-mono text-[11px] tracking-label text-mute uppercase transition-colors hover:text-ink"
		>
			{copied ? (
				<RiCheckLine
					className="size-3.5 text-green-500"
					aria-hidden="true"
				/>
			) : (
				<RiFileCopyLine className="size-3.5" aria-hidden="true" />
			)}
			<span aria-live="polite">{copied ? "Copied" : "Copy"}</span>
		</button>
	);
}
