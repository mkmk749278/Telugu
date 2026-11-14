import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {DocPage, Flow, Grains, Honesty, Line, Paper, Photo, Plate, Ring, Roll, Say, Sheet, Shot, Source, Tag, clamp, ramp} from './kit';
import {E, S, W, an, hero} from './t';
import {C, F} from './theme';

const FR = 'h1_front';
type P2 = [number, number];

/** A pencil line that draws itself. */
const Draw: React.FC<{d: string; at: number; dur?: number; w?: number; color?: string; len?: number; dash?: string; o?: number}> = ({d, at, dur = 24, w = 8, color = C.blue, len = 3000, dash, o = 1}) => {
	const f = useCurrentFrame();
	if (f < at) return null;
	const t = ramp(f, at, dur);
	return dash ? <path d={d} fill="none" stroke={color} strokeWidth={w} strokeDasharray={dash} strokeLinecap="round" opacity={o * t} /> : <path d={d} fill="none" stroke={color} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" strokeDasharray={len} strokeDashoffset={len * (1 - t)} opacity={o} />;
};
const Pin: React.FC<{x: number; y: number; text: string; at: number; until?: number; side?: 'l' | 'r' | 't' | 'b'; color?: string; size?: number; sub?: string}> = ({x, y, text, at, until = 1e9, side = 'r', color = C.red, size = 44, sub}) => {
	const f = useCurrentFrame();
	if (f < at - 1 || f > until + 8) return null;
	const t = ramp(f, at, 8) * (1 - ramp(f, until, 8));
	const pos: React.CSSProperties = side === 'r' ? {left: x + 26, top: y, transform: 'translateY(-50%)'} : side === 'l' ? {right: 1920 - x + 26, top: y, transform: 'translateY(-50%)'} : side === 't' ? {left: x, top: y - 30, transform: 'translate(-50%,-100%)'} : {left: x, top: y + 30, transform: 'translateX(-50%)'};
	return (
		<div style={{position: 'absolute', inset: 0, opacity: t}}>
			<div style={{position: 'absolute', left: x - 14, top: y - 14 - (1 - t) * 40, width: 28, height: 28, borderRadius: 14, background: color, border: `4px solid ${C.ink}`, boxSizing: 'border-box'}} />
			<div style={{position: 'absolute', ...pos, fontFamily: F.te, fontWeight: 700, fontSize: size, color: C.ink, background: 'rgba(255,249,236,0.92)', padding: '2px 14px 4px', borderRadius: 6, whiteSpace: 'nowrap', lineHeight: 1.25}}>
				{text}
				{sub ? <div style={{fontSize: size * 0.66, fontWeight: 500}}>{sub}</div> : null}
			</div>
		</div>
	);
};

// The sketch map (not to scale): the Godavari from the west, the Pranahita from the north, joined at Kaleshwaram.
const GOD = 'M-40 560 C200 520 380 600 560 560 C700 530 800 470 930 500 C1010 520 1050 560 1100 600';
const PRA = 'M1010 -30 C1040 120 980 240 1040 360 C1080 440 1090 520 1100 600';
const DOWN = 'M1100 600 C1180 680 1300 720 1420 800 C1540 880 1700 900 1960 980';
const PL = {yel: [330, 562], sun: [600, 548], ann: [860, 484], kal: [1100, 600], med: [1420, 800], tum: [1024, 130]} as const;
const SketchMap: React.FC<{from: number; to: number; cam?: (f: number) => {s: number; x: number; y: number}; children?: React.ReactNode}> = ({from, to, cam, children}) => {
	const f = useCurrentFrame();
	const c = cam ? cam(f) : {s: 1 + 0.0002 * (f - from), x: 960, y: 540};
	return (
		<Paper>
			<div style={{position: 'absolute', inset: 0, transform: `translate(${960 - c.x * c.s}px, ${540 - c.y * c.s}px) scale(${c.s})`, transformOrigin: '0 0'}}>
				<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					<Draw d={GOD} at={from} w={26} color="rgba(30,111,217,0.25)" /><Draw d={GOD} at={from} w={12} />
					<Draw d={PRA} at={from + 10} w={22} color="rgba(30,111,217,0.25)" /><Draw d={PRA} at={from + 10} w={10} />
					<Draw d={DOWN} at={from + 22} w={34} color="rgba(30,111,217,0.25)" /><Draw d={DOWN} at={from + 22} w={16} />
					<path d={GOD} fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="10 40" strokeDashoffset={-f * 1.5} opacity={0.7} />
					<path d={DOWN} fill="none" stroke="#fff" strokeWidth={4} strokeDasharray="10 40" strokeDashoffset={-f * 1.5} opacity={0.7} />
					<path d={PRA} fill="none" stroke="#fff" strokeWidth={3} strokeDasharray="10 40" strokeDashoffset={-f * 1.5} opacity={0.7} />
				</svg>
				{children}
			</div>
			<Honesty text="స్కెచ్ · స్కేల్ ప్రకారం కాదు" from={from} to={to} />
		</Paper>
	);
};
const RiverName: React.FC<{x: number; y: number; text: string; at: number; rot?: number}> = ({x, y, text, at, rot = 0}) => {
	const f = useCurrentFrame();
	return <div style={{position: 'absolute', left: x, top: y, transform: `translate(-50%,-50%) rotate(${rot}deg)`, opacity: ramp(f, at, 10), fontFamily: F.teSerif, fontWeight: 700, fontSize: 40, color: C.blue, whiteSpace: 'nowrap'}}>{text}</div>;
};

/** The staircase: the river falls to the right, the water is lifted step by step to the left. */
export const Stairs: React.FC<{from: number; lit: number[]; broken?: number; whole?: number; x?: number; y?: number; k?: number; load?: React.ReactNode}> = ({from, lit, broken = 1e9, whole = 1e9, x = 250, y = 880, k = 1, load}) => {
	const f = useCurrentFrame();
	const names = ['మేడిగడ్డ', 'అన్నారం', 'సుందిళ్ళ', 'ఎల్లంపల్లి'];
	const w = 330 * k, h = 150 * k;
	const br = f >= broken && f < whole;
	return (
		<div style={{position: 'absolute', left: 0, top: 0, width: 1920, height: 1080}}>
			<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
				{names.map((_, i) => {
					const on = ramp(f, lit[i], 10);
					const sx = x + i * w, sy = y - i * h;
					const b0 = i === 0 && br;
					const shake = b0 ? Math.sin((f - broken) * 1.7) * 5 * Math.max(0, 1 - (f - broken) / 20) : 0;
					return (
						<g key={i} opacity={ramp(f, from + i * 5, 10)} transform={`translate(${shake} ${b0 ? 22 * ramp(f, broken, 10) : 0}) rotate(${b0 ? 4 * ramp(f, broken, 10) : 0} ${sx + w / 2} ${sy})`}>
							<rect x={sx} y={sy - h} width={w} height={h + i * h + 40} fill={b0 ? '#b9b3a6' : '#d7d1c3'} stroke={C.ink} strokeWidth={5} />
							<rect x={sx} y={sy - h} width={w} height={16} fill={i === 0 && f >= lit[0] ? C.orange : C.concrete} opacity={0.4 + 0.6 * on} />
							{b0 ? <path d={`M${sx + w * 0.45} ${sy - h} l14 40 l-22 34 l18 46 l-12 60`} stroke={C.ink} strokeWidth={6} fill="none" strokeDasharray={300} strokeDashoffset={300 * (1 - ramp(f, broken, 12))} /> : null}
							{/* the lift: water going up this step */}
							{i > 0 && f >= lit[i] && !(br && true) ? <path d={`M${sx - 30} ${sy - 20} L${sx - 30} ${sy - h - 26} L${sx + 30} ${sy - h - 26}`} stroke={C.blue} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="18 16" strokeDashoffset={-f * 2.2} /> : null}
							{i === 0 && f >= lit[0] && !br ? <path d={`M${sx - 60} ${sy + 20} L${sx - 60} ${sy - h - 26} L${sx + 30} ${sy - h - 26}`} stroke={C.blue} strokeWidth={10} fill="none" strokeLinecap="round" strokeDasharray="18 16" strokeDashoffset={-f * 2.2} /> : null}
						</g>
					);
				})}
				<path d={`M${x - 220} ${y + 90} L${x + 4 * w + 100} ${y + 90}`} stroke={C.blue} strokeWidth={14} strokeLinecap="round" opacity={0.5} />
				<path d={`M${x + 4 * w + 100} ${y + 90} L${x - 220} ${y + 90}`} stroke="#fff" strokeWidth={4} strokeDasharray="12 40" strokeDashoffset={-f * 2} />
			</svg>
			{names.map((n, i) => (
				<div key={n} style={{position: 'absolute', left: x + i * w + w / 2, top: y - i * h - h + 34, transform: 'translateX(-50%)', opacity: ramp(f, lit[i], 8), fontFamily: F.te, fontWeight: 700, fontSize: 40 * Math.max(0.85, k), color: C.ink, whiteSpace: 'nowrap'}}>{n}</div>
			))}
			<div style={{position: 'absolute', left: x - 200, top: y + 108, fontFamily: F.teSerif, fontWeight: 700, fontSize: 36, color: C.blue, opacity: ramp(f, from, 10)}}>గోదావరి కిందికి పారుతుంది →</div>
			{load}
		</div>
	);
};

/** s24-s58: where it is, its one job, the staircase, why here, and what it stands on. */
export const ChB: React.FC = () => {
	const f = useCurrentFrame();
	const mapCam = (g: number) => {
		const t = interpolate(g, [S(24), W(24, 'కాళేశ్వరం'), W(24, 'మేడిగడ్డ'), S(26)], [0, 1, 2, 3], clamp);
		return {s: interpolate(t, [0, 1, 2, 3], [1.0, 1.25, 1.45, 1.55]), x: interpolate(t, [0, 1, 2, 3], [960, 1060, 1260, 1330]), y: interpolate(t, [0, 1, 2, 3], [540, 560, 700, 740])};
	};
	const map2 = (g: number) => {
		const t = interpolate(g, [S(40), S(44), W(48, 'కిందికి'), S(50)], [0, 1, 2, 3], clamp);
		return {s: interpolate(t, [0, 1, 2, 3], [1.05, 1.3, 1.2, 1.15]), x: interpolate(t, [0, 1, 2, 3], [1000, 1040, 1220, 1180]), y: interpolate(t, [0, 1, 2, 3], [460, 260, 560, 520])};
	};
	const slide = ramp(f, W(48, 'మేడిగడ్డకి') - 30, 30);
	return (
		<>
			{/* 24-25: the map */}
			<Shot from={S(24)} to={S(26)}>
				<SketchMap from={S(24)} to={S(26)} cam={mapCam}>
					<RiverName x={420} y={480} text="గోదావరి" at={W(24, 'గోదావరికి')} rot={-4} />
					<RiverName x={930} y={230} text="ప్రాణహిత" at={W(24, 'ప్రాణహిత')} rot={78} />
					<Pin x={PL.kal[0]} y={PL.kal[1]} text="కాళేశ్వరం" at={W(24, 'కాళేశ్వరం')} side="l" color={C.ink} />
					<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
						<Draw d={`M${PL.kal[0] + 30} ${PL.kal[1] - 40} L${PL.med[0] + 30} ${PL.med[1] - 40}`} at={W(24, 'ట్వెంటీ') - 10} dur={20} w={6} color={C.ink} len={500} />
					</svg>
					<Say text="సుమారు 20 కి.మీ." at={W(24, 'ట్వెంటీ')} x={1330} y={640} size={40} bg={C.yellow} color={C.ink} />
					<Pin x={PL.med[0]} y={PL.med[1]} text="మేడిగడ్డ బ్యారేజ్" at={W(24, 'మేడిగడ్డ')} side="b" size={48} />
					<Say text="జయశంకర్ భూపాలపల్లి జిల్లా" at={S(25)} x={1420} y={950} size={38} bg="rgba(255,249,236,0.92)" color={C.ink} />
					<Say text="మహదేవపూర్ మండలం" at={W(25, 'మహదేవపూర్')} x={1420} y={1010} size={38} bg="rgba(255,249,236,0.92)" color={C.ink} />
				</SketchMap>
				<Source text="CAG రిపోర్ట్, 2024" from={S(24) + 30} to={S(26)} />
			</Shot>
			{/* 26-30: the barrage in numbers */}
			<Shot from={S(26)} to={S(31)}>
				<Plate layers={[{src: hero('h3_plan_none'), at: S(26)}]} cam={[{f: S(26), s: 1.25, x: 0.25, y: 0.52}, {f: S(28), s: 1.1, x: 0.5, y: 0.5}, {f: S(31), s: 1.25, x: 0.72, y: 0.5}]}>
					<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
						<Draw d={`M${an('h3_plan', 'left')[0] * 1920} ${an('h3_plan', 'left')[1] * 1080 - 120} L${an('h3_plan', 'right')[0] * 1920} ${an('h3_plan', 'right')[1] * 1080 - 120}`} at={W(26, 'వన్') - 14} dur={26} w={8} color={C.yellow} len={2000} />
					</svg>
				</Plate>
				<Roll to={1.6} decimals={1} start={W(26, 'వన్') - 16} land={W(26, 'సిక్స్')} until={S(31)} x={400} y={190} size={120} suffix=" కి.మీ. పొడవు" />
				<Roll to={85} start={S(27)} land={W(27, 'ఎయిటీ') + 14} until={S(31)} x={1500} y={190} size={120} suffix=" గేట్లు" />
				<Say text="కట్టింది: L&T" at={S(28)} until={S(31)} x={400} y={900} size={54} />
				<Say text="ఓపెన్: జూన్ 2019" at={W(29, 'జూన్') - 8} until={S(31)} x={960} y={900} size={54} />
				<Say text="BRS గవర్నమెంట్ (కేసీఆర్)" at={W(30, 'కేసీఆర్')} until={S(31)} x={1540} y={900} size={48} />
				<Honesty text="ILLUSTRATION · స్కేల్ ప్రకారం కాదు" from={S(26)} to={S(31)} />
			</Shot>
			{/* 31-33: its one job: gates down, the river rises */}
			<Shot from={S(31)} to={S(34)}>
				<Plate layers={[{src: hero('h1_front_open'), at: S(31)}, {src: hero('h1_front_water'), at: W(32, 'దించి') - 4, fade: 40}]} cam={[{f: S(31), s: 1.3, x: 0.42, y: 0.46}, {f: S(34), s: 1.55, x: 0.36, y: 0.46}]}>
					<Tag p={an(FR, 'gate_top', 0, 0.06)} text="గేట్లు దించితే" at={W(32, 'గేట్లు')} until={S(34)} dx={130} dy={-150} size={42} />
					<Tag p={an(FR, 'pond', 0.1, 0)} text="నీళ్ళు ఎత్తుకి లేస్తాయి" at={W(32, 'ఎత్తుకి')} until={S(34)} dx={-40} dy={-170} size={42} bg={C.blueLight} />
				</Plate>
				<Say text="దీని పని ఒక్కటే" at={S(31)} until={S(32)} y={930} size={60} color={C.yellow} />
				<Honesty text="ILLUSTRATION" from={S(31)} to={S(34)} />
			</Shot>
			{/* 33-39: the staircase */}
			<Shot from={S(33)} to={S(40)}>
				<Paper>
					<Stairs from={S(33)} lit={[W(33, 'కన్నేపల్లి'), W(34, 'అన్నారం'), W(35, 'సుందిళ్ళ'), W(36, 'ఎల్లంపల్లి')]} broken={W(39, 'విరిగితే')} />
					<Say text="కన్నేపల్లి పంప్ హౌస్" at={W(33, 'కన్నేపల్లి')} until={S(37)} x={250} y={1000} size={40} bg={C.blue} />
					<Say text="మెట్టు మెట్టుగా పైకి" at={W(37, 'మెట్టు')} until={S(38)} x={1300} y={820} size={60} color={C.ink} bg={C.yellow} />
					<Say text="మేడిగడ్డ = మొదటి మెట్టు" at={W(38, 'మొదటి')} until={S(40)} x={1300} y={820} size={60} color={C.white} bg={C.orange} />
					<Say text="నీళ్ళు కిందే ఉండిపోతాయి" at={W(39, 'కిందే')} until={S(40)} x={1300} y={930} size={50} />
				</Paper>
				<Honesty text="స్కెచ్ · స్కేల్ ప్రకారం కాదు" from={S(33)} to={S(40)} />
			</Shot>
			<Shot from={W(33, 'కన్నేపల్లి') - 4} to={S(34)} x={8} out={8} hold={0}>
				<Photo video src="photos/v_pump.mp4" from={W(33, 'కన్నేపల్లి') - 4} to={S(34) + 8} rate={0.8} zoom={[1.02, 1.08]} pan={[0, 0, 0, 0]} credit="MEIL / Wikimedia Commons · CC BY 3.0" />
				<Say text="కన్నేపల్లి (లక్ష్మి) పంప్ హౌస్" at={W(33, 'కన్నేపల్లి')} y={940} size={52} />
			</Shot>
			{/* 40-51: why here: Tummidihetti to Medigadda */}
			<Shot from={S(40)} to={S(49)}>
				<SketchMap from={S(40)} to={S(49)} cam={map2}>
					<RiverName x={930} y={300} text="ప్రాణహిత" at={S(40)} rot={78} />
					<RiverName x={420} y={480} text="గోదావరి" at={S(40)} rot={-4} />
					<Pin x={PL.kal[0]} y={PL.kal[1]} text="కాళేశ్వరం" at={S(40)} side="l" color={C.ink} size={36} />
					<Say text="2008 · ఉమ్మడి ఆంధ్రప్రదేశ్" at={W(42, 'టూ')} until={S(45)} x={520} y={150} size={48} bg="rgba(255,249,236,0.92)" color={C.ink} />
					<Say text="ప్రాణహిత–చేవెళ్ళ" at={W(43, 'ప్రాణహిత')} until={S(45)} x={520} y={230} size={56} bg={C.ink} color={C.white} />
					<div style={{position: 'absolute', inset: 0, transform: `translate(${(PL.med[0] - PL.tum[0]) * slide}px, ${(PL.med[1] - PL.tum[1]) * slide}px)`}}>
						<Pin x={PL.tum[0]} y={PL.tum[1]} text={slide > 0.9 ? 'మేడిగడ్డ' : 'తుమ్మిడిహెట్టి'} at={W(44, 'తుమ్మిడిహెట్టి')} side="r" size={46} sub={slide > 0.9 ? 'నీళ్ళు తీసుకునే కొత్త చోటు' : 'నీళ్ళు తీసుకోవాల్సిన చోటు'} />
					</div>
				</SketchMap>
				{/* in screen space: inside the map the camera carried it off the left edge */}
				<Say text="2016: రీ డిజైన్" at={W(47, 'రీ')} until={S(49)} x={960} y={900} size={54} bg={C.yellow} color={C.ink} />
				<Source text="CAG రిపోర్ట్, 2024" from={S(45)} to={S(49)} />
			</Shot>
			<Shot from={S(45)} to={S(47)} x={10} out={8}>
				<DocPage src="docs/cag-3.png" from={S(45)} to={S(47)} box={[0.19, 0.199, 0.689, 0.035]} hl={W(46, 'సరిపడా') - 10} zoom={[0.95, 2.3]} />
				<Say text="2015: సెంట్రల్ వాటర్ కమిషన్" at={W(45, 'సెంట్రల్') - 8} until={S(47)} y={150} size={52} />
				<Say text="తుమ్మిడిహెట్టి దగ్గర సరిపడా నీళ్ళు దొరకవు" at={S(46)} until={S(47)} y={950} size={50} color={C.yellow} />
				<Source text="CAG పర్ఫార్మెన్స్ ఆడిట్ · ఎగ్జిక్యూటివ్ సమ్మరీ" from={S(45) + 10} to={S(47)} />
			</Shot>
			<Shot from={S(49)} to={S(52)}>
				<Paper>
					<Sheet at={S(49)} x={620 - 120 * ramp(f, W(49, 'గొడవ'), 16)} y={480} w={620} h={300} rot={-4}>
						<Line text="సరైన మార్పు" at={S(49) + 4} size={60} weight={700} />
					</Sheet>
					<Sheet at={S(49) + 5} x={1300 + 120 * ramp(f, W(49, 'గొడవ'), 16)} y={520} w={620} h={300} rot={3}>
						<Line text="తప్పు మార్పు" at={S(49) + 9} size={60} weight={700} />
					</Sheet>
					<Say text="ఈ గొడవలోకి మనం వెళ్ళడం లేదు" at={S(50)} until={S(51)} y={860} size={58} />
					<Say text="మనం కిందికి వెళ్తున్నాం ↓" at={S(51)} y={860} size={64} color={C.ink} bg={C.yellow} />
				</Paper>
			</Shot>
			{/* 52-58: it stands on sand, not rock */}
			<Shot from={S(52)} to={S(59)}>
				<Plate layers={[{src: hero('h1_front_road'), at: S(52)}]} cam={[{f: S(52), s: 1.3, x: 0.5, y: 0.45}, {f: S(54), s: 1.7, x: 0.5, y: 0.72}, {f: S(57), s: 1.5, x: 0.4, y: 0.76}, {f: S(59), s: 1.25, x: 0.45, y: 0.62}]}>
					<Tag p={an(FR, 'rock_mid', 0.25, -0.04)} text="రాయి" at={W(53, 'రాయి')} until={S(59)} dx={-140} dy={60} size={48} bg={C.white} />
					<Tag p={an(FR, 'sand_mid', 0.1, 0)} text="ఇసుక" at={S(54)} until={S(59)} dx={-140} dy={-70} size={64} />
					<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
						<Draw d={`M${an(FR, 'bed_dn')[0] * 1920 - 60} ${an(FR, 'bed_dn')[1] * 1080 + 16} L${an(FR, 'bed_dn')[0] * 1920 - 60} ${an(FR, 'rock_top')[1] * 1080 - 70}`} at={W(57, 'లోతులో') - 12} w={7} color={C.yellow} len={400} />
					</svg>
					<Tag p={[an(FR, 'bed_dn')[0] - 0.031, an(FR, 'bed_dn')[1] + 0.1]} text="గట్టి రాయి చాలా లోతులో" at={W(57, 'లోతులో')} until={S(59)} dx={-90} dy={110} size={40} />
				</Plate>
				<Say text="దేని మీద నిలబడి ఉంది?" at={W(52, 'దేని')} until={S(53)} y={140} size={60} color={C.yellow} />
				<Say text="ఇది తప్పు కాదు · ఇంజనీరింగ్ లో పాత పద్ధతే" at={S(56)} until={S(59)} y={140} size={50} />
				<Honesty text="ILLUSTRATION · స్కేల్ ప్రకారం కాదు" from={S(52)} to={S(59)} />
			</Shot>
		</>
	);
};
void E; void Flow; void Grains; void Ring; void AbsoluteFill;
