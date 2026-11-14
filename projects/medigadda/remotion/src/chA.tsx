import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Flow, Honesty, Line, Paper, Plate, Ring, Roll, Say, Sheet, Shot, Source, Tag, ramp} from './kit';
import {E, S, W, an, hero} from './t';
import {C, F} from './theme';

const U = 'h1_under', FR = 'h1_front', WD = 'h1_wide';

/** Evening over a plate: the light goes blue and low. */
export const Dusk: React.FC<{k?: number}> = ({k = 1}) => <AbsoluteFill style={{background: `linear-gradient(180deg, rgba(20,30,70,${0.55 * k}) 0%, rgba(120,50,10,${0.28 * k}) 55%, rgba(10,10,30,${0.5 * k}) 100%)`, mixBlendMode: 'multiply'}} />;

/** Vehicles on the road deck: headlights moving between two plate points. */
const Lights: React.FC<{a: [number, number]; b: [number, number]; from: number; stopAt?: number}> = ({a, b, from, stopAt = 1e9}) => {
	const f = useCurrentFrame();
	const g = Math.min(f, stopAt);
	return (
		<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
			{[0, 0.37, 0.71].map((o, i) => {
				const t = ((g - from) / (150 + i * 40) + o) % 1;
				const d = i % 2 ? 1 - t : t;
				const x = (a[0] + (b[0] - a[0]) * d) * 1920, y = (a[1] + (b[1] - a[1]) * d) * 1080;
				return (
					<g key={i} opacity={Math.min(1, t * 10, (1 - t) * 10)}>
						<circle cx={x} cy={y} r={16} fill="rgba(255,230,150,0.35)" />
						<circle cx={x} cy={y} r={5} fill="#fff3c4" />
					</g>
				);
			})}
		</svg>
	);
};

/** s0-s23: the void, the evening, the paradox, the open loop. */
export const ChA: React.FC = () => {
	const f = useCurrentFrame();
	const thud = W(7, 'శబ్దం');
	const shake = f >= thud && f < thud + 14 ? Math.sin((f - thud) * 2.4) * 7 * (1 - (f - thud) / 14) : 0;
	const sunk = W(9, 'దిగిపోయి');
	return (
		<>
			{/* 0-2: under the raft, the void opens on its word; NDSA's words, not ours */}
			<Shot from={0} to={S(3)} x={0}>
				<Plate layers={[{src: hero('h1_under_rockwall'), at: 0}, {src: hero('h1_under_void1'), at: W(0, 'కాంక్రీట్') - 6, fade: 30}, {src: hero('h1_under_void2'), at: W(0, 'ఖాళీ') - 12, fade: 20}]} cam={[{f: 0, s: 1.0, x: 0.5, y: 0.42}, {f: W(0, 'ఖాళీ'), s: 1.5, x: 0.46, y: 0.55}, {f: S(3), s: 1.75, x: 0.45, y: 0.56}]}>
					<Tag p={an(U, 'raft_tr', -0.16, 0.06)} text="కాంక్రీట్ రాఫ్ట్" at={W(0, 'కాంక్రీట్')} until={S(1)} dx={-60} dy={-150} size={40} bg={C.white} />
					<Tag p={an(U, 'sand_mid', 0.62, 0.12)} text="ఇసుక" at={W(0, 'ఇసుకకి')} until={S(1)} dx={-110} dy={70} size={40} bg={C.white} />
					<Ring p={an(U, 'void')} at={W(0, 'ఖాళీ')} until={S(3)} r={150} />
					<Tag p={an(U, 'void', 0.02, 0.02)} text="ఖాళీ" at={W(0, 'ఖాళీ')} until={S(3)} dx={150} dy={150} size={64} />
				</Plate>
				<Sheet at={S(2) - 4} until={S(3) - 6} x={560} y={300} w={900} h={300} rot={-2}>
					<Line text="NATIONAL DAM SAFETY AUTHORITY" at={S(2)} size={34} weight={700} font={F.num} />
					<Line text="నేషనల్ డ్యామ్ సేఫ్టీ అథారిటీ" at={W(2, 'నేషనల్')} hl={W(2, 'నేషనల్') + 4} size={54} weight={700} />
					<Line text="ఫైనల్ రిపోర్ట్ · 24 ఏప్రిల్ 2025" at={W(2, 'రిపోర్ట్')} size={38} color={C.inkSoft} />
				</Sheet>
				<Say text="ఇది నా మాట కాదు" at={S(1)} until={S(2) - 2} y={930} size={56} />
				<Honesty text="ILLUSTRATION · స్కేల్ ప్రకారం కాదు" from={0} to={S(3)} />
			</Shot>
			{/* 3-9: the evening of 21 Oct 2023: the bridge, the sound, pier 20 */}
			<Shot from={S(3)} to={S(10)} x={10}>
				<div style={{position: 'absolute', inset: 0, transform: `translate(${shake}px, ${shake * 0.6}px)`}}>
					<Plate layers={[{src: hero('h1_wide_water'), at: S(3)}, {src: hero('h1_wide_settled'), at: sunk - 4, fade: 16}]} cam={[{f: S(3), s: 1.05, x: 0.5, y: 0.5}, {f: S(7), s: 1.35, x: 0.58, y: 0.42}, {f: S(9), s: 1.9, x: 0.6, y: 0.4}, {f: S(10), s: 2.1, x: 0.6, y: 0.42}]}>
						<Lights a={an(WD, 'deck_near')} b={an(WD, 'deck_far')} from={S(3)} stopAt={sunk + 20} />
						<Ring p={an(WD, 'pier_top', 0, 0.03)} at={W(9, 'పిల్లర్')} until={S(10)} r={95} color={C.orange} />
						<Tag p={an(WD, 'pier_top', 0, 0.03)} text="బ్లాక్ 7" at={W(9, 'బ్లాక్')} until={S(10)} dx={-170} dy={-120} size={40} />
						<Tag p={an(WD, 'pier_top', 0.01, 0.06)} text="పిల్లర్ నం. 20" at={W(9, 'పిల్లర్')} until={S(10)} dx={170} dy={-60} size={40} bg={C.orange} color={C.white} />
					</Plate>
					<Dusk k={0.9} />
				</div>
				<Say text="21 అక్టోబర్ 2023" at={W(3, 'అక్టోబర్')} until={S(7)} x={120} y={150} align="left" size={84} font={F.num} />
				<Say text="శనివారం · సాయంత్రం 6:30 ప్రాంతం" at={S(4)} until={S(7)} x={120} y={258} align="left" size={46} />
				<Say text="గోదావరి · తెలంగాణ – మహారాష్ట్ర బోర్డర్" at={W(5, 'తెలంగాణ')} until={S(7)} x={120} y={340} align="left" size={46} />
				<Say text="పెద్ద శబ్దం" at={thud} until={S(8)} y={900} size={72} color={C.yellow} />
				<Say text="కిందికి దిగిపోయాయి" at={sunk} until={S(10)} y={930} size={60} color={C.white} bg={C.orange} />
				<Honesty text="ILLUSTRATION" from={S(3)} to={S(10)} />
			</Shot>
			{/* 10-15: the paradox: the 2022 flood it survived */}
			<Shot from={S(10)} to={S(16)}>
				<Plate layers={[{src: hero('h1_front_open'), at: S(10)}, {src: hero('h1_front_water'), at: S(14), fade: 20}]} cam={[{f: S(10), s: 1.15, x: 0.45, y: 0.5}, {f: S(13), s: 1.4, x: 0.5, y: 0.47}, {f: S(16), s: 1.2, x: 0.55, y: 0.5}]}>
					<Flow pts={[an(FR, 'pond', -0.1, -0.05), an(FR, 'pond_gate', -0.06, -0.03), an(FR, 'tail_gate', 0.05, -0.05), an(FR, 'tail', 0.05, -0.04)]} at={S(11)} until={S(14)} w={16} speed={7} />
				</Plate>
				<Say text="జులై 2022" at={W(11, 'జులైలో') - 20} until={S(14)} x={120} y={150} align="left" size={70} font={F.te} />
				<Roll to={28.7} decimals={1} start={W(11, 'ట్వెంటీ', 1) - 22} land={W(11, 'లక్షల')} until={S(14)} x={400} y={290} size={130} suffix=" లక్షల క్యూసెక్కులు" />
				<Say text="డిజైన్ వరద: 28.25 లక్షలు" at={W(12, 'డిజైన్')} until={S(14)} x={120} y={420} align="left" size={46} />
				<Say text="అప్పుడు నిలబడింది" at={S(13)} until={S(14)} y={930} size={60} color={C.yellow} />
				<Say text="కుంగిన రోజు: అంత వరద లేదు" at={S(14) + 8} until={S(16)} y={900} size={56} />
				<Say text="బ్యారేజ్ వయసు: 4 ఏళ్ళు" at={S(15)} until={S(16)} y={990} size={52} color={C.yellow} />
				<Source text="వరద లెక్క: Telangana Today" from={S(11) + 20} to={S(14)} />
				<Honesty text="ILLUSTRATION" from={S(10)} to={S(16)} />
			</Shot>
			{/* 16-23: why on an ordinary day; the complaint; they looked below; into the sand */}
			<Shot from={S(16)} to={S(24)}>
				<Plate layers={[{src: hero('h1_front_water'), at: S(16)}, {src: hero('h1_front_rockwall'), at: W(20, 'పునాదిలో') - 10, fade: 20}]} cam={[{f: S(16), s: 1.2, x: 0.55, y: 0.5}, {f: S(19), s: 1.45, x: 0.52, y: 0.4}, {f: W(20, 'కింద'), s: 1.5, x: 0.52, y: 0.42}, {f: S(21), s: 2.1, x: 0.52, y: 0.7}, {f: W(23, 'ఇసుకలోకి'), s: 2.2, x: 0.5, y: 0.7}, {f: S(24), s: 3.6, x: 0.5, y: 0.74}]}>
					<Ring p={an(FR, 'under_mid')} at={W(20, 'పునాదిలో')} until={S(23)} r={120} />
				</Plate>
				<Say text="మామూలు రోజున ఎందుకు కుంగింది?" at={W(16, 'మామూలు')} until={S(17)} y={930} size={64} color={C.yellow} />
				<Sheet at={S(17)} until={S(19)} x={520} y={330} w={860} h={330} rot={-2.2}>
					<Line text="FIR నం. 174/2023" at={S(17) + 4} size={56} weight={700} font={F.te} />
					<Line text="మహదేవపూర్ పోలీస్ స్టేషన్" at={W(17, 'పోలీస్')} size={44} />
					<Line text="ఎవరో కావాలని చేశారేమో?" at={S(18)} hl={S(18) + 6} size={46} weight={700} />
				</Sheet>
				<Say text="పైన వెతకలేదు" at={W(19, 'పైన')} until={S(20)} y={160} size={56} />
				<Say text="కింద · పునాదిలో" at={W(20, 'కింద')} until={S(23)} y={930} size={64} color={C.yellow} />
				<Say text="వాళ్ళు ఏం తేల్చారు?" at={S(21)} until={S(23)} x={480} y={260} size={52} />
				<Say text="అవతలి వైపు జవాబు?" at={W(22, 'అవతలి')} until={S(23)} x={1440} y={260} size={52} />
				<Say text="రిపోర్ట్ లు చేతిలో పట్టుకుని" at={W(23, 'రిపోర్ట్')} until={S(24)} y={170} size={52} />
				<Honesty text="ILLUSTRATION" from={S(16)} to={S(24)} />
			</Shot>
		</>
	);
};
void E;
void Paper;
void ramp;
