import json from '../../vo/timing.json';

// Every frame comes from the approved audio (vo/timing.json): sentence boundaries from the pauses, words spread by
// their share of the sentence's letters. Never typed by hand, never from speech recognition.
type Word = {s: number; w: string; start: number; end: number; startFrame: number; endFrame: number};
type Sentence = {id: number; text: string; start: number; end: number; startFrame: number; endFrame: number};
const T = json as unknown as {fps: number; durationInFrames: number; audioSeconds: number; sentences: Sentence[]; words: Word[]};

export const FPS = T.fps;
export const DURATION = T.durationInFrames;
export const AUDIO_FRAMES = Math.ceil(T.audioSeconds * T.fps);
export const sentences = T.sentences;

/** Start frame of sentence `id`, a hair early so the picture lands on the word, never after it. */
export const s0 = (id: number): number => Math.max(0, T.sentences[id].startFrame - 3);
/** End frame of sentence `id`. */
export const s1 = (id: number): number => T.sentences[id].endFrame;
/** Start frame of the word in sentence `id` that begins with `prefix` (Telugu text as written in vo.txt). */
export const w0 = (id: number, prefix: string, nth = 0): number => {
	const hits = T.words.filter((w) => w.s === id && w.w.startsWith(prefix));
	if (!hits[nth]) {
		throw new Error(`timing: "${prefix}" not in sentence ${id}: ${T.sentences[id].text}`);
	}
	return Math.max(0, hits[nth].startFrame - 2);
};
export const sec = (s: number): number => Math.round(s * FPS);
