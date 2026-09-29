export type Theme = "light" | "dark";

const NO_TRANSITIONS = "*,*::before,*::after{transition:none!important}";
const REVEAL = { duration: 560, easing: "cubic-bezier(0.22, 1, 0.36, 1)" };

/**
 * Puts the new theme on <html> right now. next-themes would do the same, but
 * only in an effect after React renders — too late for the view transition,
 * which needs the page already changed when its callback returns.
 *
 * Colour transitions are held off while the class flips, so every hover fade
 * on the page does not play at once.
 */
function paint(next: Theme) {
	const root = document.documentElement;
	const style = document.createElement("style");
	style.textContent = NO_TRANSITIONS;
	document.head.append(style);

	root.classList.remove("light", "dark");
	root.classList.add(next);
	root.style.colorScheme = next;

	// force the new styles in before the transitions come back
	window.getComputedStyle(document.body);
	window.setTimeout(() => style.remove(), 1);
}

/**
 * Switches the theme, growing the new one out of (x, y) as a circle where the
 * browser supports view transitions. `save` hands the choice to next-themes so
 * it is stored and survives a reload.
 */
export function switchTheme(
	next: Theme,
	x: number,
	y: number,
	save: (theme: Theme) => void,
) {
	const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

	if (still || !("startViewTransition" in document)) {
		paint(next);
		save(next);
		return;
	}

	const radius = Math.hypot(
		Math.max(x, window.innerWidth - x),
		Math.max(y, window.innerHeight - y),
	);

	const transition = document.startViewTransition(() => {
		paint(next);
		save(next);
	});

	transition.ready
		.then(() => {
			document.documentElement.animate(
				{
					clipPath: [
						`circle(0px at ${x}px ${y}px)`,
						`circle(${radius}px at ${x}px ${y}px)`,
					],
				},
				{ ...REVEAL, pseudoElement: "::view-transition-new(root)" },
			);
		})
		.catch(() => {});
}
