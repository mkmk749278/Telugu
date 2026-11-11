import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {Atmos, spring1, tw} from './kit';
import {C, F} from './theme';

type Side = {file: string; credit: string; year: string; te: string};

/** The mirror: two real photos side by side, 1984 and 2004, each panel opening on the line that names it. */
export const SplitShot: React.FC<{dur: number; left: Side; right: Side; leftAt: number; rightAt: number}> = ({dur, left, right, leftAt, rightAt}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const open = tw(f, rightAt - 6, rightAt + 26, 0, 1, Easing.inOut(Easing.cubic));
	const panel = (s: Side, at: number, x: 'l' | 'r', w: number) => {
		const p = spring1(f, at, fps, 0.6);
		const cam = tw(f, 0, dur, 1.08, 1.2, Easing.inOut(Easing.sin));
		return (
			<div style={{position: 'absolute', top: 0, bottom: 0, [x === 'l' ? 'left' : 'right']: 0, width: w, overflow: 'hidden', borderLeft: x === 'r' ? `4px solid ${C.gold}` : undefined}}>
				<Img src={staticFile(`media/${s.file}`)} style={{position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', transform: `scale(${cam}) translateX(${(x === 'l' ? -1 : 1) * tw(f, 0, dur, 20, -20)}px)`, filter: 'grayscale(1) contrast(1.12) brightness(0.62)'}} />
				<div style={{position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0) 55%)'}} />
				<div style={{position: 'absolute', left: 56, bottom: 120, opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
					<div style={{fontFamily: F.label, fontWeight: 800, fontSize: 120, color: x === 'l' ? C.cream : C.gold, lineHeight: 1, textShadow: '0 6px 30px #000'}}>{s.year}</div>
					<div style={{fontFamily: F.te, fontWeight: 800, fontSize: 56, color: C.cream, marginTop: 14, textShadow: '0 3px 14px #000'}}>{s.te}</div>
				</div>
				<div style={{position: 'absolute', left: 56, bottom: 26, fontFamily: F.label, fontSize: 17, color: 'rgba(246,238,221,0.78)'}}>{s.credit}</div>
			</div>
		);
	};
	const lw = 1920 - 960 * open;
	return (
		<AbsoluteFill style={{background: C.night}}>
			{panel(left, leftAt, 'l', lw)}
			{open > 0 ? panel(right, rightAt, 'r', 1920 - lw) : null}
			<Atmos dust={false} />
		</AbsoluteFill>
	);
};
