import React from 'react';
import {AbsoluteFill, Easing, Img, OffthreadVideo, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {C, F} from './theme';

// Every helper is a pure function of the absolute film frame.
export const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const ease = Easing.bezier(0.22, 0.61, 0.36, 1);
/** 0 → 1 from frame `a` over `d` frames, eased. */
export const ramp = (f: number, a: number, d = 12): number => interpolate(f, [a, a + d], [0, 1], {...clamp, easing: ease});
/** 1 between a and b with soft edges. */
export const win = (f: number, a: number, b: number, d = 10): number => Math.min(ramp(f, a, d), 1 - ramp(f, b - d, d));
export const lerp = (a: number, b: number, t: number): number => a + (b - a) * t;
export const inr = (n: number): string => {
	const s = Math.round(n).toString();
	if (s.length <= 3) return s;
	const last = s.slice(-3);
	return s.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + last;
};

/** A shot lives from `from` to `to` (absolute frames) and fades in over `x` frames on top of the one before. */
export const Shot: React.FC<{from: number; to: number; x?: number; out?: number; hold?: number; children: React.ReactNode}> = ({from, to, x = 8, out = 0, hold = 12, children}) => {
	const f = useCurrentFrame();
	// a shot stays under the next one while that one fades in over it: no dip to black at a cut
	if (f < from || f >= to + Math.max(out, hold)) return null;
	const o = Math.min(x > 0 ? ramp(f, from, x) : 1, out > 0 ? 1 - ramp(f, to, out) : 1);
	return <AbsoluteFill style={{opacity: o}}>{children}</AbsoluteFill>;
};

/** Drafting paper with its grid, drifting slowly so the base is never still. */
export const Paper: React.FC<{dark?: number; children?: React.ReactNode}> = ({dark = 0, children}) => {
	const f = useCurrentFrame();
	const dx = (f * 0.18) % 40;
	return (
		<AbsoluteFill style={{background: C.paper}}>
			<AbsoluteFill
				style={{
					backgroundImage: `linear-gradient(rgba(60,80,95,0.16) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(60,80,95,0.16) 1.5px, transparent 1.5px), linear-gradient(rgba(60,80,95,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(60,80,95,0.07) 1px, transparent 1px)`,
					backgroundSize: '200px 200px, 200px 200px, 40px 40px, 40px 40px',
					backgroundPosition: `${-dx}px ${-dx * 0.5}px`,
					transform: `scale(${1.04 + 0.02 * Math.sin(f / 140)})`,
				}}
			/>
			<AbsoluteFill style={{background: `radial-gradient(ellipse at 30% 20%, rgba(255,214,150,0.35), transparent 55%), radial-gradient(ellipse at center, transparent 45%, rgba(60,35,10,${0.38 + dark}) 100%)`}} />
			{children}
		</AbsoluteFill>
	);
};

export type Key = {f: number; s: number; x: number; y: number};
const camAt = (keys: Key[], f: number): {s: number; x: number; y: number} => {
	if (keys.length === 1) return keys[0];
	const fs = keys.map((k) => k.f);
	const o = {...clamp, easing: Easing.inOut(Easing.cubic)};
	return {s: interpolate(f, fs, keys.map((k) => k.s), o), x: interpolate(f, fs, keys.map((k) => k.x), o), y: interpolate(f, fs, keys.map((k) => k.y), o)};
};
export type Layer = {src: string; at: number; fade?: number};

/**
 * A hero plate (or a photo) with states that dissolve on their frames and a keyed camera. `x`,`y` are the point of
 * the plate (0-1) held at the centre of the screen; children are drawn in plate pixels (1920x1080) and move with it.
 */
export const Plate: React.FC<{layers: Layer[]; cam: Key[]; breathe?: number; children?: React.ReactNode}> = ({layers, cam, breathe = 0.012, children}) => {
	const f = useCurrentFrame();
	const k = camAt(cam, f);
	const s = k.s * (1 + breathe * Math.sin(f / 97) + 0.0004 * Math.max(0, f - cam[0].f));
	const tx = (0.5 - k.x) * 1920 * s + 5 * Math.sin(f / 61);
	const ty = (0.5 - k.y) * 1080 * s + 3 * Math.cos(f / 83);
	return (
		<AbsoluteFill style={{background: C.night, overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `translate(${tx}px, ${ty}px) scale(${s})`, transformOrigin: '50% 50%'}}>
				{layers.map((l, i) => {
					const next = layers[i + 1];
					if (f < l.at - 1 || (next && f > next.at + (next.fade ?? 14) + 2)) return null;
					return <Img key={l.src + i} src={staticFile(l.src)} style={{position: 'absolute', inset: 0, width: 1920, height: 1080, objectFit: 'cover', opacity: i === 0 ? 1 : ramp(f, l.at, l.fade ?? 14)}} />;
				})}
				<AbsoluteFill>{children}</AbsoluteFill>
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 55%, rgba(20,10,0,0.45) 100%)', pointerEvents: 'none'}} />
		</AbsoluteFill>
	);
};

type P2 = [number, number];
const px = (p: P2): P2 => [p[0] * 1920, p[1] * 1080];
const pathOf = (pts: P2[], smooth = true): string => {
	const q = pts.map(px);
	if (!smooth || q.length < 3) return 'M' + q.map((p) => p.join(' ')).join(' L');
	let d = `M${q[0][0]} ${q[0][1]}`;
	for (let i = 0; i < q.length - 1; i++) {
		const p0 = q[Math.max(0, i - 1)], p1 = q[i], p2 = q[i + 1], p3 = q[Math.min(q.length - 1, i + 2)];
		d += ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6} ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6} ${p2[0]} ${p2[1]}`;
	}
	return d;
};
const polyLen = (pts: P2[]): number => pts.map(px).reduce((a, p, i, q) => (i ? a + Math.hypot(p[0] - q[i - 1][0], p[1] - q[i - 1][1]) : 0), 0);
const along = (pts: P2[], t: number): P2 => {
	const q = pts.map(px);
	const L = polyLen(pts);
	let d = Math.max(0, Math.min(1, t)) * L;
	for (let i = 1; i < q.length; i++) {
		const seg = Math.hypot(q[i][0] - q[i - 1][0], q[i][1] - q[i - 1][1]);
		if (d <= seg || i === q.length - 1) return [lerp(q[i - 1][0], q[i][0], seg ? d / seg : 0), lerp(q[i - 1][1], q[i][1], seg ? d / seg : 0)];
		d -= seg;
	}
	return q[q.length - 1];
};

/** Water finding its way: a line that draws itself from `at`, then keeps flowing (moving dashes). In plate coords (0-1). */
export const Flow: React.FC<{pts: P2[]; at: number; draw?: number; until?: number; color?: string; w?: number; speed?: number; arrow?: boolean}> = ({pts, at, draw = 30, until = 1e9, color = C.blueLight, w = 7, speed = 2, arrow = true}) => {
	const f = useCurrentFrame();
	if (f < at || f > until + 10) return null;
	const L = polyLen(pts) * 1.15;
	const t = ramp(f, at, draw);
	const o = 1 - ramp(f, until, 10);
	const head = along(pts, t);
	const back = along(pts, Math.max(0, t - 0.03));
	const ang = (Math.atan2(head[1] - back[1], head[0] - back[0]) * 180) / Math.PI;
	return (
		<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, opacity: o, overflow: 'visible'}}>
			<path d={pathOf(pts)} fill="none" stroke="rgba(10,30,70,0.55)" strokeWidth={w + 6} strokeLinecap="round" strokeDasharray={`${L}`} strokeDashoffset={L * (1 - t)} />
			<path d={pathOf(pts)} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeDasharray={`${L}`} strokeDashoffset={L * (1 - t)} />
			<path d={pathOf(pts)} fill="none" stroke="#fff" strokeWidth={w * 0.4} strokeLinecap="round" strokeDasharray="14 46" strokeDashoffset={-f * speed} opacity={0.85 * t} />
			{arrow && t > 0.05 ? <polygon points="0,-13 26,0 0,13" fill={color} stroke="rgba(10,30,70,0.6)" strokeWidth={2} transform={`translate(${head[0]} ${head[1]}) rotate(${ang})`} /> : null}
		</svg>
	);
};

/** Sand grains leaving one by one along a path, `n` on the way at once after `at`; `rate` grows with time. */
export const Grains: React.FC<{pts: P2[]; at: number; until?: number; n?: number; period?: number; r?: number; grow?: number}> = ({pts, at, until = 1e9, n = 10, period = 70, r = 6, grow = 0}) => {
	const f = useCurrentFrame();
	if (f < at || f > until) return null;
	const live = Math.min(n, 1 + Math.floor(((f - at) / 30) * (1 + grow)));
	return (
		<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			{Array.from({length: live}).map((_, i) => {
				const ph = ((f - at) / period + i * 0.6180339) % 1;
				const p = along(pts, ph);
				const j = Math.sin(i * 12.9898 + ph * 9) * 7;
				return <circle key={i} cx={p[0] + j * 0.4} cy={p[1] + j} r={r * (0.7 + 0.5 * ((i * 7) % 5) / 5)} fill={C.ochre} stroke="#5a3a0a" strokeWidth={1.5} opacity={Math.min(1, ph * 8, (1 - ph) * 8)} />;
			})}
		</svg>
	);
};

/** A label pinned to a point of the plate with a leader line; lands on its word. */
export const Tag: React.FC<{p: P2; text: string; at: number; until?: number; dx?: number; dy?: number; size?: number; color?: string; bg?: string; sub?: string}> = ({p, text, at, until = 1e9, dx = 120, dy = -90, size = 46, color = C.ink, bg = C.yellow, sub}) => {
	const f = useCurrentFrame();
	if (f < at - 1 || f > until + 8) return null;
	const t = ramp(f, at, 9);
	const o = t * (1 - ramp(f, until, 8));
	const [x, y] = px(p);
	const right = dx >= 0;
	return (
		<div style={{position: 'absolute', inset: 0, opacity: o}}>
			<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				<line x1={x} y1={y} x2={x + dx * t} y2={y + dy * t} stroke={C.night} strokeWidth={7} />
				<line x1={x} y1={y} x2={x + dx * t} y2={y + dy * t} stroke={bg} strokeWidth={3.5} />
				<circle cx={x} cy={y} r={9} fill={bg} stroke={C.night} strokeWidth={3} />
			</svg>
			<div style={{position: 'absolute', left: right ? x + dx : undefined, right: right ? undefined : 1920 - (x + dx), top: y + dy, transform: `translateY(-50%) scale(${0.85 + 0.15 * t})`, transformOrigin: right ? 'left center' : 'right center', background: bg, color, fontFamily: F.te, fontWeight: 700, fontSize: size, lineHeight: 1.25, padding: '6px 20px 8px', borderRadius: 8, boxShadow: '0 6px 18px rgba(0,0,0,0.45)', whiteSpace: 'nowrap'}}>
				{text}
				{sub ? <div style={{fontSize: size * 0.62, fontWeight: 500, marginTop: -2}}>{sub}</div> : null}
			</div>
		</div>
	);
};

/** A ring that locks onto a point on its word. */
export const Ring: React.FC<{p: P2; at: number; until?: number; r?: number; color?: string}> = ({p, at, until = 1e9, r = 70, color = C.yellow}) => {
	const f = useCurrentFrame();
	if (f < at || f > until + 8) return null;
	const t = ramp(f, at, 10);
	const [x, y] = px(p);
	return (
		<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: 1 - ramp(f, until, 8)}}>
			<circle cx={x} cy={y} r={r * (1.8 - 0.8 * t)} fill="none" stroke={C.night} strokeWidth={11} opacity={t} />
			<circle cx={x} cy={y} r={r * (1.8 - 0.8 * t)} fill="none" stroke={color} strokeWidth={6} opacity={t} strokeDasharray="22 10" strokeDashoffset={-f * 1.2} />
		</svg>
	);
};

/** Screen-space text that lands on its word: a number, a date, 2-4 words. */
export const Say: React.FC<{text: string; at: number; until?: number; x?: number; y?: number; size?: number; color?: string; bg?: string | null; align?: 'left' | 'center' | 'right'; font?: string; weight?: number; w?: number}> = ({text, at, until = 1e9, x = 960, y = 540, size = 64, color = C.white, bg = 'rgba(23,17,10,0.86)', align = 'center', font = F.te, weight = 700, w}) => {
	const f = useCurrentFrame();
	if (f < at - 1 || f > until + 8) return null;
	const t = ramp(f, at, 8);
	const o = t * (1 - ramp(f, until, 8));
	const tr = align === 'center' ? '-50%' : align === 'right' ? '-100%' : '0';
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, transform: `translate(${tr}, -50%) translateY(${(1 - t) * 18}px)`, opacity: o, fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1.28, color, background: bg ?? undefined, padding: bg ? '8px 26px 10px' : 0, borderRadius: 10, whiteSpace: w ? 'normal' : 'nowrap', textAlign: align, textShadow: bg ? undefined : '0 3px 14px rgba(0,0,0,0.75)', boxShadow: bg ? '0 8px 24px rgba(0,0,0,0.4)' : undefined}}>
			{text}
		</div>
	);
};

/** A number that rolls to its value and lands on frame `land`. */
export const Roll: React.FC<{from?: number; to: number; start: number; land: number; until?: number; x?: number; y?: number; size?: number; prefix?: string; suffix?: string; color?: string; bg?: string | null; decimals?: number}> = ({from = 0, to, start, land, until = 1e9, x = 960, y = 540, size = 110, prefix = '', suffix = '', color = C.yellow, bg = 'rgba(23,17,10,0.86)', decimals = 0}) => {
	const f = useCurrentFrame();
	if (f < start - 1 || f > until + 8) return null;
	const v = interpolate(f, [start, land], [from, to], {...clamp, easing: Easing.out(Easing.cubic)});
	const txt = decimals ? v.toFixed(decimals) : inr(v);
	const o = ramp(f, start, 6) * (1 - ramp(f, until, 8));
	const pop = 1 + 0.08 * Math.max(0, 1 - Math.abs(f - land) / 6);
	return (
		<div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%, -50%) scale(${pop})`, opacity: o, fontFamily: F.num, fontWeight: 800, fontSize: size, color, background: bg ?? undefined, padding: bg ? '4px 30px 8px' : 0, borderRadius: 12, whiteSpace: 'nowrap', fontVariantNumeric: 'tabular-nums', textShadow: bg ? undefined : '0 3px 14px rgba(0,0,0,0.75)'}}>
			{prefix}
			{txt}
			<span style={{fontFamily: F.te, fontSize: size * 0.5, fontWeight: 700}}>{suffix}</span>
		</div>
	);
};

/** Honesty label, top right. */
export const Honesty: React.FC<{text: string; from: number; to: number}> = ({text, from, to}) => {
	const f = useCurrentFrame();
	if (f < from || f > to) return null;
	return (
		<div style={{position: 'absolute', right: 56, top: 44, opacity: win(f, from, to, 8), fontFamily: F.te, fontWeight: 700, fontSize: 32, letterSpacing: 1, color: C.white, background: 'rgba(23,17,10,0.82)', border: `2px solid ${C.yellow}`, padding: '4px 16px 6px', borderRadius: 6}}>{text}</div>
	);
};

/** Source strip, bottom left: which document, its date. */
export const Source: React.FC<{text: string; from: number; to: number}> = ({text, from, to}) => {
	const f = useCurrentFrame();
	if (f < from || f > to) return null;
	return (
		<div style={{position: 'absolute', left: 56, bottom: 44, opacity: win(f, from, to, 8), fontFamily: F.te, fontWeight: 500, fontSize: 32, color: C.white, background: 'rgba(23,17,10,0.82)', borderLeft: `8px solid ${C.yellow}`, padding: '6px 18px 8px', borderRadius: 4, transform: `translateX(${(1 - ramp(f, from, 10)) * -30}px)`}}>{text}</div>
	);
};

/** A real photo or clip, slowly moving, with its credit. */
export const Photo: React.FC<{src: string; from: number; to: number; credit?: string; zoom?: [number, number]; pan?: [number, number, number, number]; video?: boolean; startAt?: number; label?: string; rate?: number}> = ({src, from, to, credit, zoom = [1.06, 1.16], pan = [0, 0, -30, -14], video = false, startAt = 0, label, rate = 1}) => {
	const f = useCurrentFrame();
	const t = interpolate(f, [from, to], [0, 1], clamp);
	const st: React.CSSProperties = {position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${lerp(zoom[0], zoom[1], t)}) translate(${lerp(pan[0], pan[2], t)}px, ${lerp(pan[1], pan[3], t)}px)`};
	return (
		<AbsoluteFill style={{background: C.night, overflow: 'hidden'}}>
			{video ? <OffthreadVideo src={staticFile(src)} startFrom={startAt} playbackRate={rate} muted style={st} /> : <Img src={staticFile(src)} style={st} />}
			<AbsoluteFill style={{background: 'radial-gradient(ellipse at center, transparent 50%, rgba(20,10,0,0.5) 100%)'}} />
			{credit ? <div style={{position: 'absolute', right: 40, bottom: 28, fontFamily: F.num, fontWeight: 500, fontSize: 26, color: 'rgba(255,249,236,0.92)', textShadow: '0 2px 6px #000'}}>{credit}</div> : null}
			{label ? <Honesty text={label} from={from} to={to} /> : null}
		</AbsoluteFill>
	);
};

/** A sheet of paper on the desk (a quote, a list, a form), tilted in one desk pose, sliding in. */
export const Sheet: React.FC<{at: number; until?: number; x?: number; y?: number; w?: number; h?: number; rot?: number; children: React.ReactNode; tint?: string}> = ({at, until = 1e9, x = 960, y = 540, w = 1180, h = 640, rot = -1.6, children, tint = '#FBF6E9'}) => {
	const f = useCurrentFrame();
	if (f < at - 1 || f > until + 10) return null;
	const t = ramp(f, at, 14);
	const o = 1 - ramp(f, until, 10);
	return (
		<div style={{position: 'absolute', left: x - w / 2, top: y - h / 2, width: w, height: h, background: tint, borderRadius: 4, boxShadow: '0 30px 60px rgba(40,20,0,0.45), 0 2px 0 rgba(0,0,0,0.15)', transform: `translateY(${(1 - t) * 140}px) rotate(${rot + (1 - t) * 3 + 0.25 * Math.sin(f / 120)}deg) scale(${0.96 + 0.04 * t + 0.00012 * Math.max(0, f - at)})`, opacity: t * o, padding: '46px 60px', boxSizing: 'border-box', fontFamily: F.te, color: C.ink}}>
			{children}
		</div>
	);
};

/** A line of text on a sheet that is highlighted in yellow as the voice reads it. */
export const Line: React.FC<{text: string; at: number; hl?: number; size?: number; weight?: number; color?: string; font?: string; mt?: number}> = ({text, at, hl, size = 46, weight = 500, color = C.ink, font = F.te, mt = 10}) => {
	const f = useCurrentFrame();
	const t = ramp(f, at, 8);
	const h = hl === undefined ? 0 : ramp(f, hl, 18);
	return (
		<div style={{marginTop: mt, opacity: t, transform: `translateY(${(1 - t) * 12}px)`}}>
			<span style={{fontFamily: font, fontSize: size, fontWeight: weight, color, lineHeight: 1.4, backgroundImage: `linear-gradient(${C.yellow}, ${C.yellow})`, backgroundRepeat: 'no-repeat', backgroundSize: `${h * 100}% 86%`, backgroundPosition: '0 60%', padding: '0 6px', boxDecorationBreak: 'clone', WebkitBoxDecorationBreak: 'clone'}}>{text}</span>
		</div>
	);
};

/** The real page of a document in the desk pose, pulling from the letterhead to a highlighted box. `box` in page 0-1. */
export const DocPage: React.FC<{src: string; from: number; to: number; box?: [number, number, number, number]; hl?: number; aspect?: number; zoom?: [number, number]}> = ({src, from, to, box, hl, aspect = 0.707, zoom = [0.92, 1.9]}) => {
	const f = useCurrentFrame();
	const H = 1500, W = H * aspect;
	const t = interpolate(f, [from, (hl ?? from) + 20], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
	const cy = box ? box[1] + box[3] / 2 : 0.3;
	const cx = box ? box[0] + box[2] / 2 : 0.5;
	const s = lerp(zoom[0] * (1080 / H), zoom[1] * (1080 / H), t) * (1 + 0.0003 * (f - from));
	const fx = lerp(0.5, cx, t), fy = lerp(0.22, cy, t);
	const h = hl === undefined ? 0 : ramp(f, hl, 16);
	return (
		<Paper dark={0.1}>
			<div style={{position: 'absolute', left: 960, top: 540, width: W, height: H, transform: `translate(-50%,-50%) rotate(${-1.6 + 0.2 * Math.sin(f / 110)}deg) scale(${s}) translate(${(0.5 - fx) * W}px, ${(0.5 - fy) * H}px)`, boxShadow: '0 30px 70px rgba(40,20,0,0.5)', background: '#fff'}}>
				<Img src={staticFile(src)} style={{width: W, height: H}} />
				{box ? <div style={{position: 'absolute', left: box[0] * W, top: box[1] * H, width: box[2] * W * h, height: box[3] * H, background: 'rgba(255,210,31,0.42)', mixBlendMode: 'multiply', borderRadius: 3}} /> : null}
			</div>
		</Paper>
	);
};
