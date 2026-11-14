import React from 'react';
import {useCurrentFrame} from 'remotion';
import {Flow, Grains, Honesty, Paper, Photo, Plate, Ring, Say, Shot, Tag, lerp, ramp} from './kit';
import {S, W, an, hero} from './t';
import {C, F} from './theme';

const FR = 'h1_front';
type P2 = [number, number];
/** The seepage path under the raft for a given cutoff depth: 'none' | 'short' | 'rock'. */
export const seep = (wall: 'none' | 'short' | 'rock', fam = FR): P2[] => {
	const a = (n: string, dx = 0, dy = 0) => an(fam, n, dx, dy);
	const k = fam === FR ? 1 : 2.6;
	if (wall === 'none') return [a('in_up', 0, -0.01), a('raft_bl', -0.03 * k, 0.03 * k), a('raft_bl', 0.03 * k, 0.03 * k), a('raft_br', -0.03 * k, 0.03 * k), a('raft_br', 0.035 * k, 0.03 * k), a('out_dn', 0, -0.005)];
	const u = wall === 'short' ? 'us_short' : 'us_rock', d = wall === 'short' ? 'ds_short' : 'ds_rock';
	return [a('in_up', 0, -0.01), a('us_top', -0.03 * k, 0.03 * k), a(u, -0.022 * k, 0), a(u, 0, 0.022 * k), a(u, 0.022 * k, 0), a('raft_bl', 0.05 * k, 0.035 * k), a('raft_br', -0.06 * k, 0.035 * k), a(d, -0.022 * k, 0), a(d, 0, 0.022 * k), a(d, 0.022 * k, 0), a('ds_top', 0.03 * k, 0.03 * k), a('out_dn', 0, -0.005)];
};

/** The village tank bund in section: the clear seep, the muddy seep, the tunnel (బుంగ). Our drawing. */
const Bund: React.FC<{from: number; muddy: number; soil: number; pipe: number}> = ({from, muddy, soil, pipe}) => {
	const f = useCurrentFrame();
	const m = ramp(f, muddy, 20);
	const pp = ramp(f, pipe, 50);
	const col = `rgb(${lerp(120, 122, m)},${lerp(190, 84, m)},${lerp(255, 30, m)})`;
	const z = 1 + 0.00035 * (f - from) + 0.5 * ramp(f, soil, 40);
	return (
		<Paper>
			<div style={{position: 'absolute', inset: 0, transform: `scale(${z}) translate(${-180 * ramp(f, soil, 40)}px, ${-60 * ramp(f, soil, 40)}px)`, transformOrigin: '50% 60%'}}>
				<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
					{/* tank water on the left */}
					<path d="M0 500 L760 500 L760 800 L0 800 Z" fill="rgba(30,111,217,0.55)" opacity={ramp(f, from, 12)} />
					<path d={`M0 ${500 + 3 * Math.sin(f / 9)} Q380 ${492 + 4 * Math.sin(f / 7)} 760 500`} stroke="#fff" strokeWidth={4} fill="none" opacity={0.7} />
					{/* the earth bund */}
					<path d="M520 800 L800 400 L1060 400 L1500 800 Z" fill="#9B6B3A" stroke={C.ink} strokeWidth={7} strokeLinejoin="round" />
					<path d="M0 800 L1920 800 L1920 1080 L0 1080 Z" fill="#7A5028" stroke={C.ink} strokeWidth={7} />
					{Array.from({length: 46}).map((_, i) => <circle key={i} cx={640 + ((i * 97) % 760)} cy={470 + ((i * 53) % 300)} r={4} fill="#6b4420" opacity={0.6} />)}
					{/* the tunnel grows back from the exit towards the water */}
					<path d="M1330 690 C1180 680 1020 650 760 640" stroke="#2a1606" strokeWidth={30 * pp + 2} strokeLinecap="round" fill="none" strokeDasharray={640} strokeDashoffset={640 * (1 - pp)} />
					{/* the seep on the dry side */}
					<path d={`M1330 690 C1420 720 1480 760 1560 800 L1700 800`} stroke={col} strokeWidth={10 + 12 * m} strokeLinecap="round" fill="none" strokeDasharray="26 14" strokeDashoffset={-f * (2 + 4 * m)} opacity={ramp(f, from + 30, 15)} />
					<ellipse cx={1680} cy={806} rx={90 + 60 * m} ry={12} fill={col} opacity={0.8 * ramp(f, from + 40, 15)} />
					{/* grass and a tree on the bund */}
					{Array.from({length: 14}).map((_, i) => <path key={i} d={`M${810 + i * 18} 400 l-4 -22 M${816 + i * 18} 400 l6 -18`} stroke="#3d6b22" strokeWidth={4} />)}
					<path d="M930 400 L930 300" stroke="#4a2e12" strokeWidth={12} /><circle cx={930} cy={270} r={58} fill="#3d6b22" stroke={C.ink} strokeWidth={5} />
				</svg>
				{f >= soil ? (
					<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
						{Array.from({length: 9}).map((_, i) => {
							const ph = ((f - soil) / 60 + i * 0.618) % 1;
							return <circle key={i} cx={lerp(1000, 1620, ph)} cy={lerp(655, 795, ph * ph) + Math.sin(i * 9) * 6} r={7} fill="#5a3410" stroke="#2a1606" strokeWidth={2} opacity={Math.min(1, ph * 6, (1 - ph) * 6)} />;
						})}
					</svg>
				) : null}
				{/* people on the bund: elders running when it turns muddy */}
				{[0, 1, 2].map((i) => {
					const run = ramp(f, muddy + 14 + i * 5, 50);
					const x = lerp(840 + i * 56, 1330 + i * 40, run), y = lerp(400, 660 + i * 6, run);
					const sw = Math.sin((f + i * 5) / 2.2) * 14 * (run > 0 && run < 1 ? 1 : 0);
					return (
						<svg key={i} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
							<g stroke={C.ink} strokeWidth={7} strokeLinecap="round" fill="none">
								<circle cx={x} cy={y - 74} r={12} fill={C.ink} />
								<path d={`M${x} ${y - 62} L${x} ${y - 26} M${x} ${y - 26} L${x - 8 + sw} ${y} M${x} ${y - 26} L${x + 8 - sw} ${y} M${x} ${y - 52} L${x + 16 + sw} ${y - 36} M${x} ${y - 52} L${x - 14 - sw} ${y - 38}`} />
							</g>
						</svg>
					);
				})}
			</div>
			<div style={{position: 'absolute', left: 150, top: 560, fontFamily: F.teSerif, fontWeight: 700, fontSize: 44, color: C.white, opacity: ramp(f, from + 10, 10) * (1 - ramp(f, soil, 20)), textShadow: '0 2px 8px rgba(0,0,60,0.6)'}}>చెరువు</div>
		</Paper>
	);
};

/** s59-s91: the raft, seepage, the tank bund, the cutoff walls, the floating structure. */
export const ChC: React.FC = () => {
	const f = useCurrentFrame();
	const flip = ramp(f, W(64, 'కాళ్ళ') - 8, 14);
	return (
		<>
			{/* 59-67: built in the order the voice says it */}
			<Shot from={S(59)} to={S(68)}>
				<Plate layers={[{src: hero('h1_front_bare'), at: S(59)}, {src: hero('h1_front_raft'), at: W(60, 'కాంక్రీట్') - 8, fade: 22}, {src: hero('h1_front_piers'), at: W(65, 'పిల్లర్లు') - 8, fade: 14}, {src: hero('h1_front_gates'), at: W(66, 'గేట్లు') - 8, fade: 12}, {src: hero('h1_front_road'), at: W(67, 'రోడ్') - 8, fade: 12}]} cam={[{f: S(59), s: 1.25, x: 0.5, y: 0.6}, {f: S(61), s: 1.7, x: 0.5, y: 0.62}, {f: S(65), s: 1.6, x: 0.5, y: 0.56}, {f: S(68), s: 1.3, x: 0.5, y: 0.47}]}>
					<Tag p={an(FR, 'raft_mid', -0.06, 0)} text="రాఫ్ట్" at={W(61, 'రాఫ్ట్')} until={S(68)} dx={-190} dy={130} size={60} />
					<Tag p={an(FR, 'pier_mid')} text="పిల్లర్లు" at={W(65, 'పిల్లర్లు')} until={S(68)} dx={-250} dy={-70} size={42} bg={C.white} />
					<Tag p={an(FR, 'gate_top', 0, 0.05)} text="గేట్లు" at={W(66, 'గేట్లు')} until={S(68)} dx={-230} dy={-150} size={42} bg={C.white} />
					<Tag p={an(FR, 'deck')} text="రోడ్" at={W(67, 'రోడ్')} until={S(68)} dx={170} dy={-80} size={42} bg={C.white} />
				</Plate>
				{/* the house slab: over the head, then under the feet */}
				{f >= S(62) - 2 && f < S(65) ? (
					<div style={{position: 'absolute', right: 110, top: 150, width: 430, height: 380, background: 'rgba(255,249,236,0.95)', borderRadius: 12, boxShadow: '0 12px 30px rgba(0,0,0,0.4)', opacity: ramp(f, S(62) - 2, 8) * (1 - ramp(f, S(65) - 8, 8))}}>
						<svg viewBox="0 0 430 380" style={{position: 'absolute', inset: 0}}>
							<rect x={70} y={lerp(70, 290, flip)} width={290} height={30} fill={C.concrete} stroke={C.ink} strokeWidth={5} />
							<g opacity={1 - flip}><path d="M90 100 L90 300 M340 100 L340 300" stroke={C.ink} strokeWidth={8} /></g>
							<g stroke={C.ink} strokeWidth={7} strokeLinecap="round" fill="none" transform={`translate(215 ${lerp(300, 290, flip)})`}>
								<circle cx={0} cy={-104} r={15} fill={C.ink} /><path d="M0 -88 L0 -40 M0 -40 L-16 0 M0 -40 L16 0 M0 -76 L-24 -50 M0 -76 L24 -50" />
							</g>
							<path d="M20 322 L410 322" stroke={C.ochre} strokeWidth={6} opacity={flip} />
						</svg>
						<div style={{position: 'absolute', left: 0, right: 0, bottom: 10, textAlign: 'center', fontFamily: F.te, fontWeight: 700, fontSize: 36, color: C.ink}}>{flip < 0.5 ? 'ఇంటి స్లాబ్: తల మీద' : 'రాఫ్ట్: కాళ్ళ కింద'}</div>
					</div>
				) : null}
				<Say text="ఇసుక మీద ఎలా నిలబెడతారు?" at={S(59)} until={S(60)} y={150} size={60} color={C.yellow} />
				<Honesty text="ILLUSTRATION · స్కేల్ ప్రకారం కాదు" from={S(59)} to={S(68)} />
			</Shot>
			{/* 68-75: gates down, water looks for a way under */}
			<Shot from={S(68)} to={S(76)}>
				<Plate layers={[{src: hero('h1_front_road'), at: S(68)}, {src: hero('h1_front_water'), at: W(68, 'దించితే') - 6, fade: 30}]} cam={[{f: S(68), s: 1.3, x: 0.5, y: 0.47}, {f: S(71), s: 1.75, x: 0.5, y: 0.62}, {f: S(74), s: 1.9, x: 0.6, y: 0.62}, {f: S(76), s: 2.3, x: 0.68, y: 0.58}]}>
					<Tag p={an(FR, 'pond', 0.08, 0)} text="ఎత్తుగా నీళ్ళు" at={W(68, 'ఎత్తుగా')} until={S(72)} dx={0} dy={-130} size={42} bg={C.blueLight} />
					<Tag p={an(FR, 'tail', -0.06, 0)} text="కింద నది" at={W(69, 'కిందికి')} until={S(72)} dx={20} dy={-130} size={42} bg={C.blueLight} />
					<Flow pts={seep('none')} at={W(71, 'ఇసుకలోంచి') - 10} draw={70} w={8} speed={f >= S(75) ? 5 : 2} />
					<Ring p={an(FR, 'out_dn')} at={W(75, 'బయటికి') - 20} until={S(76)} r={60} color={C.orange} />
					<Tag p={an(FR, 'out_dn')} text="ఎంత జోరుగా బయటికి?" at={W(75, 'జోరుగా')} until={S(76)} dx={60} dy={-150} size={46} bg={C.orange} color={C.white} />
				</Plate>
				<Say text="ప్రతి బ్యారేజ్ కింద ఇలా ఊరుతూనే ఉంటాయి · మామూలే" at={S(72)} until={S(74)} y={150} size={48} />
				<Honesty text="ILLUSTRATION · స్కేల్ ప్రకారం కాదు" from={S(68)} to={S(76)} />
			</Shot>
			{/* 76-82: the village tank bund */}
			<Shot from={S(76)} to={S(83)}>
				<Bund from={S(76)} muddy={W(78, 'మురికిగా') - 6} soil={W(79, 'మట్టి') - 6} pipe={W(80, 'సొరంగం') - 20} />
				<Say text="మీ ఊరి చెరువు కట్ట" at={W(76, 'చెరువు')} until={S(78)} y={170} size={64} color={C.ink} bg={C.yellow} />
				<Say text="తేట నీళ్ళు: పట్టించుకోరు" at={W(77, 'తేట')} until={S(78)} x={1500} y={930} size={46} bg={C.blue} />
				<Say text="మురికి నీళ్ళు: పరిగెత్తుతారు" at={W(78, 'మురికిగా')} until={S(80)} x={1420} y={930} size={46} bg="#7A541E" />
				<Say text="నీళ్ళతో పాటు మట్టి కూడా" at={W(79, 'మట్టి')} until={S(81)} y={170} size={54} />
				<Say text="బుంగ" at={W(81, 'బుంగ')} x={700} y={300} size={110} color={C.ink} bg={C.yellow} />
				<Say text="= PIPING" at={W(82, 'పైపింగ్')} x={1180} y={300} size={96} font={F.num} />
				<Honesty text="ILLUSTRATION" from={S(76)} to={S(83)} />
			</Shot>
			<Shot from={S(82)} to={S(83)} x={8} hold={0} out={8}>
				<Photo src="photos/sandboil.jpg" from={S(82)} to={S(83) + 8} zoom={[1.1, 1.25]} pan={[0, 0, -20, 10]} credit="US Army Corps of Engineers / Wikimedia Commons · Public domain" label="అమెరికాలో ఒక కట్ట దగ్గర ఇసుక బుంగ · ILLUSTRATIVE" />
				<Say text="బుంగ = PIPING" at={S(82)} y={920} size={84} color={C.ink} bg={C.yellow} />
				<Say text="బుంగ చుట్టూ ఇసుక బస్తాలు" at={S(82) + 12} y={1010} size={38} />
			</Shot>
			{/* 83-91: cutoffs: the longer way round; the floating structure */}
			<Shot from={S(83)} to={S(92)}>
				<Plate layers={[{src: hero('h1_front_water'), at: S(83)}, {src: hero('h1_front_short'), at: W(83, 'గోడలు') - 10, fade: 26}]} cam={[{f: S(83), s: 1.6, x: 0.5, y: 0.6}, {f: S(85), s: 1.9, x: 0.5, y: 0.68}, {f: S(89), s: 1.8, x: 0.5, y: 0.7}, {f: S(91), s: 2.5, x: 0.6, y: 0.76}, {f: S(92), s: 2.6, x: 0.6, y: 0.76}]}>
					<Flow pts={seep('none')} at={S(83) - 40} until={W(83, 'గోడలు') + 6} w={8} draw={1} />
					<Tag p={an(FR, 'us_short', 0, -0.04)} text="కటాఫ్" at={W(84, 'కటాఫ్')} until={S(89)} dx={-170} dy={60} size={52} />
					<Tag p={an(FR, 'ds_short', 0, -0.04)} text="కటాఫ్" at={W(84, 'కటాఫ్')} until={S(89)} dx={150} dy={70} size={52} />
					<Flow pts={seep('short')} at={W(85, 'గోడ') - 10} draw={80} until={S(92)} w={8} speed={f >= W(87, 'తగ్గుతుంది') ? 0.8 : 2} />
					<Ring p={an(FR, 'ds_short', 0, 0.03)} at={W(91, 'ముట్టుకోకుండా') - 6} until={S(92)} r={50} />
					<Tag p={an(FR, 'ds_short', 0, 0.03)} text="రాయిని ముట్టుకోదు" at={W(91, 'ముట్టుకోకుండా')} until={S(92)} dx={90} dy={-10} size={34} />
				</Plate>
				<Say text="దారి పొడవు పెరుగుతుంది" at={S(86)} until={S(89)} x={480} y={150} size={50} />
				<Say text="నీళ్ళ జోరు తగ్గుతుంది" at={S(87)} until={S(89)} x={1440} y={150} size={50} />
				<Say text="ఇసుక కదిలే ప్రమాదం తగ్గుతుంది" at={S(88)} until={S(89)} y={250} size={50} color={C.yellow} />
				<Say text="FLOATING STRUCTURE" at={W(89, 'ఫ్లోటింగ్')} until={S(92)} y={140} size={76} font={F.num} color={C.ink} bg={C.yellow} />
				<Say text="తేలుతుందని కాదు · ఇసుక మీదే కూర్చుంటుంది" at={S(90)} until={S(92)} y={250} size={46} />
				<Honesty text="ILLUSTRATION · స్కేల్ ప్రకారం కాదు" from={S(83)} to={S(92)} />
			</Shot>
		</>
	);
};
void Grains;
