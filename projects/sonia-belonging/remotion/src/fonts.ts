import {loadFont} from '@remotion/fonts';
import {continueRender, delayRender, staticFile} from 'remotion';

let started = false;
// Vendored OFL fonts (public/fonts), never fetched at render time.
export const loadFilmFonts = (): void => {
	if (started) {
		return;
	}
	started = true;
	const h = delayRender('fonts');
	const f = (family: string, file: string, weight: string, style = 'normal') => loadFont({family, url: staticFile(`fonts/${file}`), weight, style});
	Promise.all([
		...['500', '700', '800'].map((w) => f('Noto Serif Telugu', `noto-serif-telugu-telugu-${w}-normal.woff2`, w)),
		...['500', '700'].map((w) => f('Noto Sans Telugu', `noto-sans-telugu-telugu-${w}-normal.woff2`, w)),
		...['400', '600'].flatMap((w) => ['normal', 'italic'].map((s) => f('EB Garamond', `eb-garamond-latin-${w}-${s}.woff2`, w, s))),
		...['600', '700'].map((w) => f('Cinzel', `cinzel-latin-${w}-normal.woff2`, w)),
		...['500', '700', '800'].map((w) => f('Inter Tight', `inter-tight-latin-${w}-normal.woff2`, w)),
	]).then(() => continueRender(h));
};
