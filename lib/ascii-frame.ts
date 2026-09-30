/**
 * A frame of typewriter characters for the paper card: dense `$` and `#`
 * in the top-left and bottom-right corners, thinning out to `-`, `|` and
 * `.` along the edges, and empty in the middle. Same output every time.
 */

/** Dense to empty. */
const RAMP = "$$%#*+=-|:. ";

/** Where the frame stops and the empty middle begins, 0 to 1. */
const REACH = 0.5;

/** A number in [0, 1) that depends only on the cell. */
function hash(x: number, y: number) {
	let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
	h = Math.imul(h ^ (h >>> 13), 1274126177);
	return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

/** How far a point is from a corner, with bands that hug the two edges. */
function cornerDistance(x: number, y: number) {
	return Math.min(
		Math.hypot(x, y * 1.25),
		y * 2.8 + x * 0.7,
		x * 2.8 + y * 0.7,
	);
}

export function asciiFrame(cols: number, rows: number) {
	const lines: string[] = [];

	for (let r = 0; r < rows; r++) {
		let line = "";

		for (let c = 0; c < cols; c++) {
			const x = c / (cols - 1);
			const y = r / (rows - 1);
			const d = Math.min(
				cornerDistance(x, y),
				cornerDistance(1 - x, 1 - y),
			);
			const ragged = (hash(c, r) - 0.5) * 0.14;
			const t = (d + ragged) / REACH;
			const index = Math.min(
				RAMP.length - 1,
				Math.max(0, Math.floor(t * RAMP.length)),
			);

			line += RAMP[index];
		}

		lines.push(line);
	}

	return lines.join("\n");
}
