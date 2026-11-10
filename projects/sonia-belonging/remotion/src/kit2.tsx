import React from 'react';
import {AbsoluteFill, Easing, Img, staticFile, useCurrentFrame, useVideoConfig} from 'remotion';
import {IndiaMap, LonLat, MapPin, MapRoute, camFit, mapCam} from '../../../../lib/remotion/map/IndiaMap';
import {Atmos, Ground, spring1, tw} from './kit';
import {C, F} from './theme';

/** Numbered questions landing one by one (the film's open loops). */
export const QuestionsShot: React.FC<{items: {t: string; at: number}[]}> = ({items}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill>
			<Ground />
			<AbsoluteFill style={{justifyContent: 'center', paddingLeft: 170}}>
				{items.map((q, i) => {
					const p = spring1(f, q.at, fps, 0.5);
					const active = i === items.filter((x) => f >= x.at).length - 1;
					return (
						<div key={i} style={{display: 'flex', alignItems: 'baseline', gap: 36, margin: '26px 0', opacity: p * (active ? 1 : 0.5), transform: `translateX(${(1 - p) * -60}px)`}}>
							<div style={{fontFamily: F.label, fontWeight: 800, fontSize: 80, color: active ? C.gold : C.grey, width: 70}}>{i + 1}</div>
							<div style={{fontFamily: F.te, fontWeight: 800, fontSize: 72, color: C.cream, lineHeight: 1.3, maxWidth: 1450}}>{q.t}</div>
						</div>
					);
				})}
			</AbsoluteFill>
			<Atmos />
		</AbsoluteFill>
	);
};

/** A route on India's official map (the shared toolkit's boundary), the head travelling as the voice says it. */
export const MapShot: React.FC<{dur: number; a: {at: LonLat; label: string}; b: {at: LonLat; label: string}; head?: 'dot' | 'plane'; go: number; arrive: number}> = ({dur, a, b, head = 'dot', go, arrive}) => {
	const f = useCurrentFrame();
	const k0 = camFit([a.at, b.at], 420, 0);
	const k1 = camFit([a.at, b.at], 300, dur);
	const cam = mapCam([k0, k1], f);
	return (
		<AbsoluteFill style={{background: C.night}}>
			<svg width={1920} height={1080} viewBox="0 0 1920 1080">
				<IndiaMap cam={cam} reveal={tw(f, 0, 20, 0, 1)}>
					<MapPin at={a.at} from={4} cam={cam} label={a.label} side="right" />
					<MapRoute stops={[a.at, b.at]} from={go} dur={Math.max(20, arrive - go)} cam={cam} head={head} />
					<MapPin at={b.at} from={arrive} cam={cam} label={b.label} side="left" color={C.red} />
				</IndiaMap>
			</svg>
			<Atmos dust={false} />
			<div style={{position: 'absolute', left: 40, bottom: 26, fontFamily: F.label, fontSize: 17, color: 'rgba(246,238,221,0.7)'}}>Map: India's official boundary · Natural Earth (public domain)</div>
		</AbsoluteFill>
	);
};

/** Three years on one line: 1984, 1991, 2004, each landing on its own sentence. */
export const TimelineShot: React.FC<{nodes: {year: string; te: string; at: number}[]}> = ({nodes}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const xs = [380, 960, 1540];
	const line = tw(f, 0, nodes[nodes.length - 1].at + 10, 0, 1);
	return (
		<AbsoluteFill>
			<Ground />
			<div style={{position: 'absolute', left: 300, top: 540, width: 1320 * line, height: 4, background: C.gold}} />
			{nodes.map((n, i) => {
				const p = spring1(f, n.at, fps, 0.5);
				return (
					<div key={i} style={{position: 'absolute', left: xs[i] - 260, width: 520, top: 360, textAlign: 'center', opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
						<div style={{fontFamily: F.label, fontWeight: 800, fontSize: 110, color: i === nodes.length - 1 ? C.gold : C.cream}}>{n.year}</div>
						<div style={{width: 30, height: 30, borderRadius: 30, background: C.red, margin: '22px auto 30px', boxShadow: '0 0 30px rgba(200,55,45,0.8)'}} />
						<div style={{fontFamily: F.te, fontWeight: 700, fontSize: 52, color: C.cream, lineHeight: 1.3}}>{n.te}</div>
					</div>
				);
			})}
			<Atmos />
		</AbsoluteFill>
	);
};

/** The viewer's question as three options to answer in the comments. */
export const PollShot: React.FC<{q: string; qAt: number; options: {t: string; at: number}[]}> = ({q, qAt, options}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill>
			<Ground />
			<div style={{position: 'absolute', top: 150, width: '100%', textAlign: 'center', fontFamily: F.te, fontWeight: 800, fontSize: 96, color: C.gold, opacity: spring1(f, qAt, fps)}}>{q}</div>
			<div style={{position: 'absolute', top: 360, left: 260, right: 260}}>
				{options.map((o, i) => {
					const p = spring1(f, o.at, fps, 0.5);
					return (
						<div key={i} style={{display: 'flex', alignItems: 'center', gap: 34, margin: '28px 0', padding: '22px 36px', border: `2px solid rgba(233,196,106,${0.35 + 0.5 * p})`, background: 'rgba(0,0,0,0.45)', opacity: p, transform: `translateY(${(1 - p) * 30}px)`}}>
							<div style={{fontFamily: F.label, fontWeight: 800, fontSize: 60, color: C.gold}}>{['A', 'B', 'C'][i]}</div>
							<div style={{fontFamily: F.te, fontWeight: 700, fontSize: 58, color: C.cream}}>{o.t}</div>
						</div>
					);
				})}
			</div>
			<Atmos />
		</AbsoluteFill>
	);
};

/** The outro: the channel's name, only here at the end. */
export const OutroShot: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const p = spring1(f, 6, fps, 0.8);
	const out = tw(f, dur - 30, dur, 1, 0);
	return (
		<AbsoluteFill style={{opacity: out}}>
			<Ground />
			<AbsoluteFill style={{alignItems: 'center', justifyContent: 'center'}}>
				<div style={{fontFamily: F.label, fontWeight: 800, fontSize: 92, letterSpacing: '0.04em', color: C.cream, opacity: p, transform: `scale(${1.08 - 0.08 * p})`}}>Be Practical with Kishore</div>
				<div style={{width: 760 * p, height: 3, background: C.gold, margin: '24px 0'}} />
				<div style={{fontFamily: F.te, fontWeight: 800, fontSize: 64, color: C.gold, opacity: spring1(f, 22, fps)}}>తెలుగు</div>
				<div style={{fontFamily: F.te, fontWeight: 700, fontSize: 44, color: C.grey, marginTop: 40, opacity: spring1(f, 40, fps)}}>మళ్ళీ కలుద్దాం</div>
			</AbsoluteFill>
			<Atmos />
		</AbsoluteFill>
	);
};

/** The sources this film stands on, as a list on paper. */
export const SourcesShot: React.FC<{dur: number; rows: string[]; at: number[]}> = ({dur, rows, at}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill style={{overflow: 'hidden'}}>
			<AbsoluteFill style={{transform: `scale(${tw(f, 0, dur, 1.02, 1.12, Easing.inOut(Easing.sin))})`}}>
				<Ground />
			</AbsoluteFill>
			<div style={{position: 'absolute', left: 260, top: 170, fontFamily: F.label, fontWeight: 800, fontSize: 40, letterSpacing: '0.22em', color: C.gold}}>THIS FILM USES ONLY</div>
			{rows.map((r, i) => {
				const p = spring1(f, at[i] ?? 0, fps, 0.4);
				return (
					<div key={i} style={{position: 'absolute', left: 260, top: 270 + i * 110, fontFamily: F.en, fontSize: 60, color: C.cream, opacity: p, transform: `translateX(${(1 - p) * -40}px)`}}>
						<span style={{color: C.gold, marginRight: 28}}>—</span>
						{r}
					</div>
				);
			})}
			<Atmos />
		</AbsoluteFill>
	);
};

export const PLACE: Record<string, LonLat> = {
	delhi: [77.21, 28.61],
	kolkata: [88.36, 22.57],
	vizag: [83.22, 17.69],
	sriperumbudur: [79.95, 12.97],
};

export const Still: React.FC<{file: string}> = ({file}) => <Img src={staticFile(`media/${file}`)} />;
