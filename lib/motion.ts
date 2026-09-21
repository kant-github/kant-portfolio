// Shared motion vocabulary. These numbers were tuned together, so changing one
// usually means revisiting its neighbours.

/** Expo-out. The house curve — everything on the site uses it. */
export const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Scroll window for a staged section: progress starts when the section's top
 * enters the lower 8% of the viewport and completes when it reaches 42% of
 * viewport height.
 */
export const STAGE_OFFSET = ["start 0.92", "start 0.42"] as const;

/** Takes the edge off a fast trackpad flick without feeling laggy. */
export const STAGE_SPRING = {
	stiffness: 120,
	damping: 28,
	mass: 0.35,
} as const;

/** How much of a section's progress each --i step waits before starting. */
export const STAGE_STEP = 0.07;

/** How much progress one staged item takes to resolve once it starts. */
export const STAGE_WINDOW = 0.38;

/** Beat spacing and length for the load overture at the top of the page. */
export const OVERTURE_STAGGER = 0.09;
export const OVERTURE_DURATION = 0.55;

/** Progress at which a section's own inner animation should take over. */
export const STAGE_HANDOFF = 0.35;
