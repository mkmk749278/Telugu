import {noise2D} from '@remotion/noise';
import React from 'react';
import {AbsoluteFill, Easing, Img, interpolate, random, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {C, F} from './theme';

// ------------------------------------------------------------------ motion helpers
const io = Easing.bezier(0.45, 0, 0.25, 1);
export const tw = (f: number, a: number, b: number, from: number, to: number, e = io): number =>
	interpolate(f, [a, b], [from, to], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: e});
export const spring1 = (f: number, at: number, fps: number, d = 0.55): number => tw(f, at, at + fps * d, 0, 1, Easing.bezier(0.2, 0.9, 0.3, 1.05));
const src = (f: string): string => staticFile(f.startsWith('media/') || f.startsWith('fonts/') ? f : `media/${f}`);

// ------------------------------------------------------------------ atmosphere (layer 2 in every frame)
export const Grain: React.FC<{o?: number}> = ({o = 0.1}) => {
	const f = useCurrentFrame();
	// pre-rendered noise frames (tools/make_tex.py): an SVG turbulence per frame cost ~40% of the render
	return <Img src={staticFile(`tex/grain${Math.floor(f / 2) % 6}.png`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', mixBlendMode: 'overlay', opacity: o, pointerEvents: 'none'}} />;
};
export const Vignette: React.FC<{s?: number}> = ({s = 0.6}) => (
	<AbsoluteFill style={{pointerEvents: 'none', background: `radial-gradient(ellipse 75% 70% at 50% 48%, rgba(0,0,0,0) 45%, rgba(0,0,0,${s}) 100%)`}} />
);
export const Dust: React.FC<{n?: number; seed?: string}> = ({n = 26, seed = 'd'}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{pointerEvents: 'none'}}>
			{Array.from({length: n}).map((_, i) => {
				const x = random(`${seed}x${i}`) * 1920 + noise2D(`${seed}a${i}`, f / 300, 0) * 60;
				const y = ((random(`${seed}y${i}`) * 1080 - f * (0.15 + random(`${seed}v${i}`) * 0.3)) % 1080 + 1080) % 1080;
				const r = 1 + random(`${seed}r${i}`) * 2.2;
				return <div key={i} style={{position: 'absolute', left: x, top: y, width: r, height: r, borderRadius: r, background: 'rgba(255,230,190,0.5)', filter: 'blur(0.6px)'}} />;
			})}
		</AbsoluteFill>
	);
};
export const Atmos: React.FC<{dust?: boolean; v?: number}> = ({dust = true, v = 0.6}) => (
	<>
		{dust ? <Dust /> : null}
		<Vignette s={v} />
		<Grain />
	</>
);

/** The desk: dark walnut under a warm lamp, drifting slowly (never a flat void). */
export const Desk: React.FC<{lamp?: number}> = ({lamp = 1}) => {
	const f = useCurrentFrame();
	const lx = 48 + noise2D('lx', f / 420, 0) * 5;
	return (
		<AbsoluteFill style={{background: C.desk, overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `translate(${noise2D('dx', f / 600, 0) * 18}px, ${noise2D('dy', 0, f / 650) * 12}px) scale(1.1) rotate(-3deg)`}}>
				<Img src={staticFile('tex/desk.jpg')} style={{width: '100%', height: '100%', objectFit: 'cover'}} />
			</AbsoluteFill>
			<AbsoluteFill style={{background: `radial-gradient(ellipse 52% 58% at ${lx}% 42%, rgba(255,190,120,${0.22 * lamp}) 0%, rgba(0,0,0,0) 72%)`, mixBlendMode: 'screen'}} />
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ labels
export const Tag: React.FC<{text: string}> = ({text}) => (
	<div style={{position: 'absolute', right: 56, top: 44, fontFamily: F.label, fontWeight: 700, fontSize: 22, letterSpacing: '0.22em', color: C.cream, padding: '8px 14px', background: 'rgba(0,0,0,0.55)', border: `1.5px solid rgba(246,238,221,0.55)`}}>
		{text}
	</div>
);
export const Credit: React.FC<{text?: string}> = ({text}) =>
	text ? (
		<div style={{position: 'absolute', left: 40, bottom: 26, maxWidth: 1100, fontFamily: F.label, fontWeight: 500, fontSize: 17, color: 'rgba(246,238,221,0.78)', textShadow: '0 1px 3px #000'}}>{text}</div>
	) : null;
/** Source line for excerpts and quotes (top left). */
export const Source: React.FC<{text: string}> = ({text}) => (
	<div style={{position: 'absolute', left: 56, top: 48, fontFamily: F.label, fontWeight: 700, fontSize: 24, letterSpacing: '0.14em', color: C.gold, textShadow: '0 2px 6px #000'}}>{text}</div>
);

/** A Telugu label with an optional English line under it, bottom-left, on a scrim. */
export const Label: React.FC<{te?: string; en?: string; at?: number; y?: number}> = ({te, en, at = 6, y = 150}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring1(f, at, fps);
	return (
		<div style={{position: 'absolute', left: 72, bottom: y, opacity: p, transform: `translateY(${(1 - p) * 26}px)`}}>
			{te ? <div style={{fontFamily: F.te, fontWeight: 800, fontSize: 64, color: C.cream, textShadow: '0 3px 14px rgba(0,0,0,0.9)', lineHeight: 1.25}}>{te}</div> : null}
			{en ? <div style={{fontFamily: F.label, fontWeight: 700, fontSize: 30, letterSpacing: '0.16em', color: C.gold, marginTop: 6, textShadow: '0 2px 8px #000'}}>{en}</div> : null}
		</div>
	);
};

// ------------------------------------------------------------------ photos
export type Move = 'in' | 'out' | 'l' | 'r' | 'up' | 'down';
export type Grade = 'bw' | 'archive' | 'warm' | 'modern' | 'night';
const GR: Record<Grade, string> = {
	bw: 'grayscale(1) contrast(1.15) brightness(0.9)',
	archive: 'sepia(0.5) contrast(1.1) brightness(0.9) saturate(0.85)',
	warm: 'sepia(0.18) contrast(1.06) brightness(0.92) saturate(0.95)',
	modern: 'contrast(1.05) brightness(0.93)',
	night: 'grayscale(0.4) contrast(1.15) brightness(0.62) hue-rotate(-10deg)',
};
const camOf = (move: Move, p: number): string => {
	const k = 1.06;
	switch (move) {
		case 'in':
			return `scale(${k + 0.14 * p})`;
		case 'out':
			return `scale(${k + 0.14 * (1 - p)})`;
		case 'l':
			return `scale(${k + 0.08}) translateX(${50 - 100 * p}px)`;
		case 'r':
			return `scale(${k + 0.08}) translateX(${-50 + 100 * p}px)`;
		case 'up':
			return `scale(${k + 0.08}) translateY(${40 - 80 * p}px)`;
		case 'down':
			return `scale(${k + 0.08}) translateY(${-40 + 80 * p}px)`;
	}
};

/** Full-bleed photo with a visible camera move; portraits sit on a blurred copy of themselves. */
export const PhotoShot: React.FC<{
	file: string;
	dur: number;
	move?: Move;
	focus?: string;
	grade?: Grade;
	contain?: boolean;
	credit?: string;
	tag?: string;
	te?: string;
	en?: string;
	labelAt?: number;
}> = ({file, dur, move = 'in', focus = '50% 45%', grade = 'warm', contain, credit, tag, te, en, labelAt}) => {
	const f = useCurrentFrame();
	const p = tw(f, 0, dur, 0, 1, Easing.inOut(Easing.sin));
	return (
		<AbsoluteFill style={{background: C.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: camOf(move, p), transformOrigin: focus}}>
				{contain ? <Img src={src(file)} style={{position: 'absolute', inset: -80, width: 'calc(100% + 160px)', height: 'calc(100% + 160px)', objectFit: 'cover', filter: `${GR[grade]} blur(30px) brightness(0.4)`}} /> : null}
				<Img src={src(file)} style={{width: '100%', height: '100%', objectFit: contain ? 'contain' : 'cover', objectPosition: focus, filter: GR[grade]}} />
			</AbsoluteFill>
			<Atmos dust={false} />
			{te || en ? <Label te={te} en={en} at={labelAt} /> : null}
			{tag ? <Tag text={tag} /> : null}
			<Credit text={credit} />
		</AbsoluteFill>
	);
};

/** A photo as a print dropped on the desk, the camera drifting over it. */
export const PrintShot: React.FC<{file: string; dur: number; width?: number; rot?: number; grade?: Grade; credit?: string; te?: string; en?: string; caption?: string; labelAt?: number}> = ({
	file,
	dur,
	width = 900,
	rot = -2.5,
	grade = 'archive',
	credit,
	te,
	en,
	caption,
	labelAt,
}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring1(f, 0, fps, 0.7);
	const cam = tw(f, 0, dur, 1.0, 1.12, Easing.inOut(Easing.sin));
	const sway = noise2D(file, f / 200, 0);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${cam})`}}>
				<Desk />
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1400}}>
					<div
						style={{
							width,
							padding: 20,
							paddingBottom: caption ? 64 : 20,
							background: 'linear-gradient(160deg, #EFE6D2 0%, #E2D5BA 60%, #D6C6A5 100%)',
							boxShadow: `0 40px 90px rgba(0,0,0,0.65), 0 5px 12px rgba(0,0,0,0.4)`,
							transform: `translateY(${(1 - p) * 110 - 30}px) rotateX(${7 + sway * 2}deg) rotateY(${-5 + sway * 3}deg) rotate(${rot + sway * 0.8}deg)`,
							opacity: Math.min(1, p * 1.6),
						}}
					>
						<Img src={src(file)} style={{width: '100%', display: 'block', filter: GR[grade]}} />
						{caption ? <div style={{fontFamily: F.label, fontWeight: 700, fontSize: 26, letterSpacing: '0.18em', color: '#4A3B28', marginTop: 16, textAlign: 'center'}}>{caption}</div> : null}
					</div>
				</AbsoluteFill>
			</AbsoluteFill>
			<Atmos />
			{te || en ? <Label te={te} en={en} at={labelAt} y={110} /> : null}
			<Credit text={credit} />
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ the book and its pages
/** The memoir on the desk. Cover from the publisher's press kit (shown as the subject of the review). */
export const BookShot: React.FC<{dur: number; te?: string; en?: string; labelAt?: number; open?: boolean}> = ({dur, te, en, labelAt, open}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring1(f, 0, fps, 0.8);
	const cam = tw(f, 0, dur, 1.0, 1.16, Easing.inOut(Easing.sin));
	const sway = noise2D('book', f / 220, 0);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${cam})`, transformOrigin: '50% 42%'}}>
				<Desk lamp={1.2} />
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1600}}>
					<div style={{transform: `translateY(${(1 - p) * 120 - 20}px) rotateX(${14 + sway * 2}deg) rotateY(${-10 + sway * 3}deg) rotateZ(${-4 + sway}deg)`, transformStyle: 'preserve-3d'}}>
						{open ? (
							<div style={{display: 'flex', boxShadow: '0 50px 100px rgba(0,0,0,0.7)'}}>
								{[0, 1].map((k) => (
									<div key={k} style={{width: 560, height: 780, background: `linear-gradient(${k ? 90 : 270}deg, #E6DAC1 0%, #F2EADA 18%, #F2EADA 100%)`, padding: 60, boxSizing: 'border-box'}}>
										{Array.from({length: 22}).map((_, i) => (
											<div key={i} style={{height: 9, margin: '15px 0', background: 'rgba(40,30,20,0.22)', width: `${82 + random(`ln${k}${i}`) * 18}%`}} />
										))}
									</div>
								))}
							</div>
						) : (
							<Img src={src('book/cover.jpg')} style={{width: 560, display: 'block', boxShadow: '0 50px 100px rgba(0,0,0,0.75), -14px 0 0 #2a2119'}} />
						)}
					</div>
				</AbsoluteFill>
			</AbsoluteFill>
			<Atmos />
			{te || en ? <Label te={te} en={en} at={labelAt} y={110} /> : null}
		</AbsoluteFill>
	);
};

/**
 * A page of the excerpt as typeset text on paper (plainly typography, never a fake scan), the highlighter sweeping
 * the quoted words as the voice reaches them. `lines`: the excerpt's own words; `hi`: [line index, from, to] frames.
 */
export const ExcerptShot: React.FC<{dur: number; lines: string[]; hi?: [number, number, number][]; source: string; te?: string; under?: React.ReactNode}> = ({dur, lines, hi = [], source, te, under}) => {
	const seedR = random(`ex${lines.join('')}`);
	const tilt = (seedR - 0.5) * 5;
	const shift = (random(`exs${lines[0]}`) - 0.5) * 160;
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring1(f, 0, fps, 0.7);
	const cam = tw(f, 0, dur, 1.02, 1.14, Easing.inOut(Easing.sin));
	const sway = noise2D(lines[0] ?? 'x', f / 260, 0);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${cam}) translateY(${tw(f, 0, dur, 20, -20)}px)`}}>
				{under ? <Dim>{under}</Dim> : <Desk />}
				<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', perspective: 1100}}>
					<div
						style={{
							width: 1240,
							padding: '70px 90px',
							background: 'linear-gradient(165deg, #F3EBD8 0%, #E6D8B9 75%, #D9C59E 100%)',
							boxShadow: '0 45px 90px rgba(0,0,0,0.65)',
							transform: `translate(${shift}px, ${(1 - p) * 120}px) rotateX(${9 + sway * 1.5}deg) rotateY(${-4 + sway * 2}deg) rotateZ(${tilt}deg)`,
							opacity: Math.min(1, p * 1.5),
						}}
					>
						{lines.map((l, i) => {
							const h = hi.find((x) => x[0] === i);
							const hp = h ? tw(f, h[1], h[2], 0, 1, Easing.out(Easing.quad)) : 0;
							return (
								<div key={i} style={{position: 'relative', fontFamily: F.en, fontSize: 52, lineHeight: 1.42, color: C.ink, margin: '4px 0'}}>
									<span style={{position: 'relative', zIndex: 1}}>{l}</span>
									{h ? <div style={{position: 'absolute', left: -8, top: '18%', height: '66%', width: `calc(${hp * 100}% + 16px)`, background: C.gold, opacity: 0.6, mixBlendMode: 'multiply', borderRadius: 6}} /> : null}
								</div>
							);
						})}
					</div>
				</AbsoluteFill>
			</AbsoluteFill>
			<Atmos />
			<Source text={source} />
			{te ? <Label te={te} at={8} y={60} /> : null}
		</AbsoluteFill>
	);
};

// ------------------------------------------------------------------ type
/** Big Telugu words landing one by one on their own frames, over any background child. */
export const Words: React.FC<{items: {t: string; at: number; red?: boolean; gold?: boolean}[]; size?: number; y?: number; sub?: string; subAt?: number}> = ({items, size = 120, y = 0, sub, subAt = 0}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', transform: `translateY(${y}px)`}}>
			<div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'center', maxWidth: 1600, textAlign: 'center'}}>
				{items.map((w, i) => {
					const p = spring1(f, w.at, fps, 0.4);
					return (
						<span key={i} style={{fontFamily: F.te, fontWeight: 800, fontSize: size, lineHeight: 1.3, color: w.red ? C.red : w.gold ? C.gold : C.cream, opacity: p, transform: `translateY(${(1 - p) * 40}px) scale(${0.92 + 0.08 * p})`, display: 'inline-block', margin: '0 0.18em', textShadow: '0 6px 30px rgba(0,0,0,0.85)'}}>
							{w.t}
						</span>
					);
				})}
			</div>
			{sub ? <div style={{marginTop: 26, fontFamily: F.label, fontWeight: 700, fontSize: 34, letterSpacing: '0.2em', color: C.gold, opacity: spring1(f, subAt, fps)}}>{sub}</div> : null}
		</AbsoluteFill>
	);
};

/** A date/place stamp: big numerals with a ruled line, over a dark moving ground or a photo child. */
export const StampShot: React.FC<{dur: number; big: string; sub?: string; subAt?: number; file?: string; grade?: Grade; credit?: string}> = ({dur, big, sub, subAt = 10, file, grade = 'night', credit}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring1(f, 2, fps, 0.6);
	const line = tw(f, 4, 26, 0, 1);
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: C.night}}>
			{file ? (
				<AbsoluteFill style={{transform: `scale(${tw(f, 0, dur, 1.18, 1.04)})`}}>
					<Img src={src(file)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: `${GR[grade]} brightness(0.55)`}} />
				</AbsoluteFill>
			) : (
				<Desk lamp={0.6} />
			)}
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				<div style={{fontFamily: F.label, fontWeight: 800, fontSize: 150, letterSpacing: '0.06em', color: C.cream, opacity: p, transform: `scale(${1.12 - 0.12 * p})`, textShadow: '0 8px 40px rgba(0,0,0,0.9)'}}>{big}</div>
				<div style={{width: 900 * line, height: 3, background: C.gold, margin: '18px 0'}} />
				{sub ? <div style={{fontFamily: F.label, fontWeight: 700, fontSize: 44, letterSpacing: '0.24em', color: C.gold, opacity: spring1(f, subAt, fps)}}>{sub}</div> : null}
			</AbsoluteFill>
			<Atmos />
			<Credit text={credit} />
		</AbsoluteFill>
	);
};

/** A quote card: who said it, the line in Telugu (as the voice says it), the original in English, the source. */
export const QuoteShot: React.FC<{dur: number; who: string; te: string; en: string; source: string; file?: string; credit?: string; accent?: string; plain?: boolean}> = ({dur, who, te, en, source, file, credit, accent = C.gold, plain}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring1(f, 0, fps, 0.6);
	const q = spring1(f, 10, fps, 0.6);
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${tw(f, 0, dur, 1.0, 1.08)})`}}>
				<Desk lamp={0.8} />
			</AbsoluteFill>
			{file ? (
				<div style={{position: 'absolute', left: 110, top: 200, width: 460, padding: 16, background: '#E9DFC9', boxShadow: '0 30px 70px rgba(0,0,0,0.6)', transform: `rotate(-3deg) translateY(${(1 - p) * 80}px)`, opacity: p}}>
					<Img src={src(file)} style={{width: '100%', display: 'block', filter: GR.bw}} />
				</div>
			) : null}
			<div style={{position: 'absolute', left: file ? 680 : 200, right: 140, top: 230, opacity: q, transform: `translateY(${(1 - q) * 30}px)`}}>
				<div style={{fontFamily: F.label, fontWeight: 800, fontSize: 34, letterSpacing: '0.18em', color: accent}}>{who}</div>
				<div style={{fontFamily: F.te, fontWeight: 700, fontSize: 64, lineHeight: 1.35, color: C.cream, marginTop: 22}}>{te}</div>
				<div style={{fontFamily: F.en, fontStyle: 'italic', fontSize: 38, lineHeight: 1.3, color: C.grey, marginTop: 24}}>{plain ? en : `“${en}”`}</div>
				<div style={{fontFamily: F.label, fontWeight: 600, fontSize: 22, letterSpacing: '0.12em', color: C.grey, marginTop: 26}}>{source}</div>
			</div>
			<Atmos />
			<Credit text={credit} />
		</AbsoluteFill>
	);
};

/** A number counting up to land on its word, with its unit. */
export const CounterShot: React.FC<{dur: number; value: number; land: number; unit: string; sub?: string; file?: string}> = ({dur, value, land, unit, sub, file}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const n = Math.round(tw(f, 0, land, 0, value, Easing.out(Easing.cubic)));
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: C.night}}>
			{file ? (
				<AbsoluteFill style={{transform: `scale(${tw(f, 0, dur, 1.15, 1.03)})`}}>
					<Img src={src(file)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: 'contrast(1.05) brightness(0.42) blur(2px)'}} />
				</AbsoluteFill>
			) : (
				<Desk />
			)}
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				<div style={{fontFamily: F.label, fontWeight: 800, fontSize: 230, color: C.gold, lineHeight: 1, textShadow: '0 10px 50px rgba(0,0,0,0.8)'}}>{n.toLocaleString('en-IN')}</div>
				<div style={{fontFamily: F.te, fontWeight: 800, fontSize: 76, color: C.cream, marginTop: 10, opacity: spring1(f, land - 6, fps)}}>{unit}</div>
				{sub ? <div style={{fontFamily: F.label, fontWeight: 700, fontSize: 30, letterSpacing: '0.2em', color: C.grey, marginTop: 14, opacity: spring1(f, land, fps)}}>{sub}</div> : null}
			</AbsoluteFill>
			<Atmos />
		</AbsoluteFill>
	);
};

/** Background for type: dark paper with a faint ruled grid and a moving lamp. */
export const Ground: React.FC<{tone?: 'dark' | 'red'}> = ({tone = 'dark'}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{overflow: 'hidden', background: tone === 'red' ? '#1A0B09' : C.night}}>
			<AbsoluteFill style={{transform: `scale(1.1) translate(${noise2D('gx', f / 500, 0) * 30}px, ${noise2D('gy', 0, f / 520) * 20}px)`}}>
				<Desk lamp={tone === 'red' ? 0.5 : 0.8} />
			</AbsoluteFill>
			{tone === 'red' ? <AbsoluteFill style={{background: 'radial-gradient(ellipse 60% 55% at 50% 50%, rgba(200,55,45,0.22) 0%, rgba(0,0,0,0) 70%)'}} /> : null}
		</AbsoluteFill>
	);
};

/** A real picture behind type: a moving photo or an ink scene, dimmed and softened so the words read. */
export const Dim: React.FC<{file?: string; dur?: number; red?: boolean; children?: React.ReactNode}> = ({file, dur = 150, red, children}) => {
	const f = useCurrentFrame();
	return (
		<AbsoluteFill style={{background: C.night, overflow: 'hidden'}}>
			{file ? (
				<AbsoluteFill style={{transform: `scale(${tw(f, 0, dur, 1.06, 1.18, Easing.inOut(Easing.sin))})`}}>
					<Img src={src(file)} style={{width: '100%', height: '100%', objectFit: 'cover', filter: `${GR.bw} blur(3px) brightness(0.42)`}} />
				</AbsoluteFill>
			) : (
				<AbsoluteFill style={{filter: 'brightness(0.42) blur(2.5px)'}}>{children}</AbsoluteFill>
			)}
			<AbsoluteFill style={{background: red ? 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(120,20,15,0.45) 0%, rgba(0,0,0,0.5) 100%)' : 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.6) 100%)'}} />
		</AbsoluteFill>
	);
};
