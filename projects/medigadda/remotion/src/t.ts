import anchors from './anchors.json';
import {s0, s1, w0} from './timing';

export {sentences, DURATION, FPS, AUDIO_FRAMES} from './timing';
/** Start and end frame of a sentence; the frame of a word inside it. */
export const S = s0;
export const E = s1;
export const W = w0;
type P2 = [number, number];
const A = anchors as unknown as Record<string, Record<string, P2>>;
/** A named point of a hero plate (0-1). */
export const an = (fam: string, name: string, dx = 0, dy = 0): P2 => {
	const p = A[fam]?.[name];
	if (!p) throw new Error(`anchor ${fam}.${name}`);
	return [p[0] + dx, p[1] + dy];
};
export const hero = (n: string): string => `hero/${n}.jpg`;
