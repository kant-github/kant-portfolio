"use client";

import { HoverPill } from "@/components/hover-pill";
import { ThemeIcon } from "@/components/theme-icons";
import { useTheme } from "@/lib/theme";

type ThemeToggleProps = {
	hovered: boolean;
	onHover: (hovered: boolean) => void;
};

export function ThemeToggle({ hovered, onHover }: ThemeToggleProps) {
	const { theme, toggle } = useTheme();

	return (
		<button
			type="button"
			onClick={toggle}
			onMouseEnter={() => onHover(true)}
			onFocus={() => onHover(true)}
			onBlur={() => onHover(false)}
			aria-label={
				theme === "dark"
					? "Switch to light theme"
					: "Switch to dark theme"
			}
			className="relative cursor-pointer rounded-xl p-2 text-mute transition-all duration-200 hover:text-ink active:scale-95"
		>
			{hovered ? <HoverPill /> : null}
			<ThemeIcon theme={theme} />
		</button>
	);
}
