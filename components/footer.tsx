import type { CSSProperties } from "react";
import { profile } from "@/lib/data";

const WEATHER_URL = `https://api.open-meteo.com/v1/forecast?latitude=${profile.latitude}&longitude=${profile.longitude}&current=temperature_2m`;

async function getTemperature() {
	try {
		const res = await fetch(WEATHER_URL, { next: { revalidate: 1800 } });
		if (!res.ok) return null;

		const data = await res.json();
		const value = data?.current?.temperature_2m;

		return typeof value === "number" ? Math.round(value) : null;
	} catch {
		return null;
	}
}

export async function Footer() {
	const temperature = await getTemperature();

	return (
		<footer className="flex items-center justify-between gap-4 border-t border-line pt-6 font-mono text-xs tracking-label text-mute uppercase">
			<span className="stage-item" style={{ "--i": 0 } as CSSProperties}>
				{profile.location}
			</span>
			{temperature === null ? null : (
				<span
					className="stage-item"
					style={{ "--i": 1 } as CSSProperties}
				>
					{temperature}°C
				</span>
			)}
		</footer>
	);
}
