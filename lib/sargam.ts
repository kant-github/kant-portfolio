type Note = {
	name: string;
	frequency: number;
};

export const SARGAM: Note[] = [
	{ name: "Sa", frequency: 261.63 },
	{ name: "Re", frequency: 293.66 },
	{ name: "Ga", frequency: 329.63 },
	{ name: "Ma", frequency: 349.23 },
	{ name: "Pa", frequency: 392.0 },
	{ name: "Dha", frequency: 440.0 },
	{ name: "Ni", frequency: 493.88 },
	{ name: "Sa'", frequency: 523.25 },
	{ name: "Re'", frequency: 587.33 },
];

const ATTACK = 0.012;
const RELEASE = 1.1;
const PEAK_GAIN = 0.16;
const HARMONIC_GAIN = 0.3;

const STORAGE_KEY = "sound";

function readStoredMute() {
	if (typeof window === "undefined") return false;

	try {
		return localStorage.getItem(STORAGE_KEY) === "off";
	} catch {
		return false;
	}
}

let context: AudioContext | null = null;
let unlockBound = false;
let muted = readStoredMute();

const muteListeners = new Set<() => void>();

export function isMuted() {
	return muted;
}

export function getServerMuted() {
	return false;
}

export function setMuted(next: boolean) {
	muted = next;

	try {
		localStorage.setItem(STORAGE_KEY, next ? "off" : "on");
	} catch {}

	for (const listener of muteListeners) listener();
}

export function subscribeMuted(listener: () => void) {
	muteListeners.add(listener);
	return () => {
		muteListeners.delete(listener);
	};
}

function bindUnlock(ctx: AudioContext) {
	if (unlockBound) return;
	unlockBound = true;

	const unlock = () => {
		void ctx.resume();
		window.removeEventListener("pointerdown", unlock);
		window.removeEventListener("keydown", unlock);
	};

	window.addEventListener("pointerdown", unlock);
	window.addEventListener("keydown", unlock);
}

function getContext() {
	if (typeof window === "undefined") return null;

	if (!context) {
		context = new AudioContext();
		bindUnlock(context);
	}

	if (context.state === "suspended") void context.resume();

	return context;
}

function voice(ctx: AudioContext, frequency: number, type: OscillatorType) {
	const oscillator = ctx.createOscillator();
	oscillator.type = type;
	oscillator.frequency.value = frequency;
	return oscillator;
}

export function playNote(index: number) {
	if (muted) return;

	const ctx = getContext();
	if (!ctx) return;

	const note = SARGAM[index % SARGAM.length];
	const now = ctx.currentTime;

	const gain = ctx.createGain();
	gain.gain.setValueAtTime(0.0001, now);
	gain.gain.linearRampToValueAtTime(PEAK_GAIN, now + ATTACK);
	gain.gain.exponentialRampToValueAtTime(0.0001, now + RELEASE);

	const tone = ctx.createBiquadFilter();
	tone.type = "lowpass";
	tone.frequency.value = 3000;

	const fundamental = voice(ctx, note.frequency, "triangle");
	const harmonic = voice(ctx, note.frequency * 2, "sine");

	const harmonicGain = ctx.createGain();
	harmonicGain.gain.value = HARMONIC_GAIN;

	fundamental.connect(tone);
	harmonic.connect(harmonicGain).connect(tone);
	tone.connect(gain).connect(ctx.destination);

	fundamental.start(now);
	harmonic.start(now);
	fundamental.stop(now + RELEASE + 0.1);
	harmonic.stop(now + RELEASE + 0.1);
}
