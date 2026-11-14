import React from 'react';
import {useCurrentFrame} from 'remotion';
import {DocPage, Flow, Honesty, Line, Paper, Photo, Plate, Ring, Roll, Say, Sheet, Shot, Source, Tag, lerp, ramp} from './kit';
import {seep} from './chC';
import {S, W, an, hero} from './t';
import {C, F} from './theme';

const FR = 'h1_front';
/** A report's own words on a sheet: the English line as published, the Telugu sense under it, the source at the foot. */
export const Quote: React.FC<{at: number; until?: number; en?: string; te: string; teAt?: number; src: string; hl?: number; x?: number; y?: number; w?: number; h?: number; rot?: number}> = ({at, until, en, te, teAt, src, hl, x = 960, y = 520, w = 1300, h = 520, rot = -1.6}) => (
	<Sheet at={at} until={until} x={x} y={y} w={w} h={h} rot={rot}>
		<div style={{position: 'absolute', left: 60, right: 60, bottom: 30, fontFamily: F.te, fontSize: 30, fontWeight: 500, color: C.inkSoft, borderTop: `3px solid ${C.inkSoft}`, paddingTop: 8}}>{src}</div>
		{en ? <Line text={`“${en}”`} at={at + 6} hl={hl ?? at + 14} size={40} weight={600} font={F.num} /> : null}
		<Line text={te} at={teAt ?? at + 10} hl={en ? undefined : hl ?? at + 14} size={en ? 44 : 50} weight={700} mt={en ? 26 : 10} />
	</Sheet>
);

const Leaf: React.FC<{x: number; y: number; day: string; month: string; at: number; note?: string; color?: string}> = ({x, y, day, month, at, note, color = C.red}) => {
	const f = useCurrentFrame();
	const t = ramp(f, at, 10);
	return (
		<div style={{position: 'absolute', left: x, top: y, width: 300, height: 340, transform: `translate(-50%,-50%) rotate(${-3 + 3 * t}deg) scale(${0.7 + 0.3 * t})`, opacity: t, background: '#FBF6E9', borderRadius: 10, boxShadow: '0 20px 40px rgba(40,20,0,0.4)', overflow: 'hidden', fontFamily: F.num, textAlign: 'center'}}>
			<div style={{background: color, color: '#fff', fontWeight: 700, fontSize: 40, padding: '8px 0', fontFamily: F.te}}>{month}</div>
			<div style={{fontWeight: 800, fontSize: 170, color: C.ink, lineHeight: 1.1}}>{day}</div>
			{note ? <div style={{fontFamily: F.te, fontWeight: 700, fontSize: 30, color: C.inkSoft, marginTop: -8}}>{note}</div> : null}
		</div>
	);
};

/** s92-s150: the two reports: floating vs rigid, the pencil wall, the records, the boreholes. */
export const ChD: React.FC = () => {
	const f = useCurrentFrame();
	const gone = ramp(f, W(128, 'ఎలెవెన్') - 10, 20);
	const torn = ramp(f, W(144, 'నాలుగు') - 4, 24);
	return (
		<>
			{/* 92-96: the committee */}
			<Shot from={S(92)} to={S(97)}>
				<Paper>
					<Leaf x={480} y={470} day="21" month="అక్టోబర్ 2023" at={S(92) + 4} note="కుంగిన రోజు" />
					<Leaf x={960} y={470} day="22" month="అక్టోబర్ 2023" at={W(93, 'మరుసటి')} note="కమిటీ వేశారు" color={C.ink} />
					<Leaf x={1440} y={470} day="1" month="నవంబర్ 2023" at={W(96, 'నవంబర్')} note="రిపోర్ట్" color={C.blue} />
					<Say text="ఆరుగురు సభ్యుల కమిటీ" at={W(93, 'ఆరుగురు')} y={800} size={56} color={C.ink} bg={C.yellow} />
					<Say text="హెడ్: అనిల్ జైన్ · NDSA మెంబర్ (డిజాస్టర్ & రెజిలియెన్స్)" at={W(94, 'నేషనల్')} until={S(95)} y={900} size={44} />
					<Say text="మేడిగడ్డలో ఏం వేరుగా జరిగింది?" at={S(92)} until={W(93, 'మరుసటి')} y={150} size={58} color={C.ink} bg={C.yellow} />
				</Paper>
			</Shot>
			<Shot from={S(95)} to={S(97)} x={10}>
				<DocPage src="docs/ndsa-5.png" from={S(95)} to={S(97)} box={[0.11, 0.455, 0.82, 0.05]} hl={S(95) + 14} aspect={0.708} zoom={[0.95, 1.7]} />
				<Say text="సైట్ కి వచ్చి చూశారు · 1 నవంబర్ న రిపోర్ట్" at={S(95)} y={960} size={46} />
				<Source text="NDSA కమిటీ రిపోర్ట్ · 1 నవంబర్ 2023 · అసలు పేజీ" from={S(95) + 6} to={S(97)} />
			</Shot>
			{/* 97-105: floating on paper, rigid on the ground */}
			<Shot from={S(97)} to={S(101)}>
				<DocPage src="docs/ndsa-2.png" from={S(97)} to={S(101)} box={[0.2, 0.208, 0.69, 0.046]} hl={S(98) - 4} aspect={0.684} zoom={[0.95, 1.75]} lift={0.06} />
				<Say text="ఫ్లోటింగ్ స్ట్రక్చర్ గా డిజైన్ చేశారు" at={S(98)} until={S(100)} y={830} size={52} />
				<Say text="కానీ రిజిడ్ స్ట్రక్చర్ గా కట్టారు" at={W(99, 'రిజిడ్') - 6} until={S(100)} y={930} size={58} color={C.white} bg={C.orange} />
				<Say text="అంటే ఏంటి?" at={S(100)} y={930} size={64} color={C.ink} bg={C.yellow} />
				<Source text="NDSA కమిటీ రిపోర్ట్ · 1 నవంబర్ 2023 · అసలు పేజీ" from={S(97) + 6} to={S(101)} />
			</Shot>
			<Shot from={S(101)} to={S(106)}>
				<Plate layers={[{src: hero('h1_front_short'), at: S(101)}, {src: hero('h1_front_rockwall'), at: W(102, 'రాయి') - 14, fade: 26}]} cam={[{f: S(101), s: 1.7, x: 0.5, y: 0.68}, {f: S(103), s: 2.0, x: 0.5, y: 0.74}, {f: S(105), s: 1.7, x: 0.5, y: 0.7}, {f: S(106), s: 1.9, x: 0.56, y: 0.68}]}>
					<Ring p={an(FR, 'us_rock', 0, -0.012)} at={W(102, 'రాయి')} until={S(104)} r={46} />
					<Ring p={an(FR, 'ds_rock', 0, -0.012)} at={W(102, 'రాయి')} until={S(104)} r={46} />
					<Tag p={an(FR, 'ds_rock', 0, -0.012)} text="గోడలు రాయి దాకా" at={W(102, 'రాయి')} until={S(105)} dx={130} dy={30} size={40} />
					<Tag p={an(FR, 'raft_mid')} text="రాఫ్ట్ ఇంకా ఇసుక మీదే" at={S(103)} until={S(105)} dx={-200} dy={-190} size={40} bg={C.white} />
					{[0.3, 0.45, 0.6, 0.75].map((u, i) => {
						const x = lerp(an(FR, 'raft_bl')[0], an(FR, 'raft_br')[0], u), y = lerp(an(FR, 'raft_bl')[1], an(FR, 'raft_br')[1], u);
						const a = W(105, 'పైకి') - 10 + i * 3;
						return f >= a ? (
							<svg key={i} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
								<path d={`M${x * 1920} ${y * 1080 + 70 - 6 * Math.sin(f / 5 + i)} l0 -52 m-12 14 l12 -16 l12 16`} stroke={C.blueLight} strokeWidth={8} fill="none" strokeLinecap="round" opacity={ramp(f, a, 8)} />
							</svg>
						) : null;
					})}
				</Plate>
				<Say text="పైకి నెట్టే నీటి ఒత్తిడి లెక్క మారిపోతుంది" at={W(105, 'నీటి') - 6} until={S(106)} y={150} size={50} />
				<Source text="NDSA కమిటీ రిపోర్ట్ · 1 నవంబర్ 2023" from={S(104)} to={S(106)} />
				<Honesty text="ILLUSTRATION · స్కేల్ ప్రకారం కాదు" from={S(101)} to={S(106)} />
			</Shot>
			{/* 106-112: you might ask me, Kishore */}
			<Shot from={S(106)} to={S(113)}>
				<Plate layers={[{src: hero('h1_front_rockwall'), at: S(106)}]} cam={[{f: S(106), s: 1.9, x: 0.56, y: 0.68}, {f: S(110), s: 2.5, x: 0.62, y: 0.72}, {f: S(113), s: 3.2, x: 0.63, y: 0.72}]}>
					<Flow pts={[an(FR, 'in_up'), an(FR, 'us_top', -0.03, 0.03), an(FR, 'us_rock', -0.03, -0.03)]} at={S(108)} until={S(111)} draw={30} />
					<Ring p={an(FR, 'ds_short')} at={W(110, 'నిజంగా')} until={S(113)} r={70} color={C.orange} />
				</Plate>
				<Say text="కిషోర్, గోడ రాయి దాకా వెళ్తే ఇంకా గట్టిదే కదా?" at={S(107)} until={S(109)} y={160} size={52} bg="rgba(255,249,236,0.95)" color={C.ink} />
				<Say text="నిజమే" at={S(109)} until={S(110)} y={920} size={70} color={C.yellow} />
				<Say text="గోడ నిజంగా గోడ అయితే" at={S(110)} until={S(111)} y={920} size={64} color={C.white} bg={C.orange} />
				<Say text="SECANT PILE" at={W(112, 'సీకెంట్')} until={S(113)} y={160} size={96} font={F.num} color={C.ink} bg={C.yellow} />
				<Honesty text="ILLUSTRATION · స్కేల్ ప్రకారం కాదు" from={S(106)} to={S(113)} />
			</Shot>
			{/* 113-117: how a secant pile wall is made */}
			<Shot from={S(113)} to={S(118)}>
				<Plate layers={[{src: hero('h2_piles_build01'), at: S(113)}, {src: hero('h2_piles_build04'), at: W(116, 'ఇంకో') - 6, fade: 12}, {src: hero('h2_piles_build07'), at: W(117, 'వరసగా') - 4, fade: 12}, {src: hero('h2_piles_build10'), at: W(117, 'అతుక్కుని') - 6, fade: 12}, {src: hero('h2_piles_sound'), at: W(117, 'గోడ') - 6, fade: 12}]} cam={[{f: S(113), s: 1.7, x: 0.3, y: 0.5}, {f: S(116), s: 1.6, x: 0.36, y: 0.5}, {f: S(118), s: 1.15, x: 0.5, y: 0.5}]}>
					<Tag p={an('h2_piles', 'p0', 0, 0.05)} text="ఒక పైల్" at={W(115, 'పైల్')} until={S(117)} dx={-90} dy={-130} size={46} />
				</Plate>
				<Say text="ఒకే ముక్కగా పోసిన గోడ కాదు" at={W(113, 'ఒకే')} until={S(114)} y={930} size={54} />
				<Say text="పక్కదాని మీదకి ఎక్కేలా" at={W(116, 'ఎక్కేలా') - 8} until={S(117)} y={930} size={54} color={C.yellow} />
				<Honesty text="ILLUSTRATION" from={S(113)} to={S(118)} />
			</Shot>
			<Shot from={W(114, 'బోర్') - 6} to={S(116)} x={8} out={8} hold={0}>
				<Photo src="photos/pile_rig.jpg" from={W(114, 'బోర్') - 6} to={S(116) + 8} credit="MTA New York / Wikimedia Commons · CC BY 2.0" zoom={[1.05, 1.2]} pan={[0, 60, 0, -60]} label="వేరే ప్రాజెక్ట్ లో పైల్ రిగ్ · ILLUSTRATIVE" />
				<Say text="బోర్ వేసి · కాంక్రీట్ నింపి: ఒక పైల్" at={W(114, 'బోర్')} y={940} size={54} />
			</Shot>
			<Shot from={W(117, 'అతుక్కుని') - 4} to={S(118)} x={8} out={8} hold={0}>
				<Photo src="photos/pile_wall.jpg" from={W(117, 'అతుక్కుని') - 4} to={S(118) + 8} credit="Falk Arnhold / Wikimedia Commons · CC BY-SA 4.0" zoom={[1.1, 1.3]} pan={[-60, 0, 20, 20]} label="వేరే ప్రాజెక్ట్ లో పైల్ గోడ (జర్మనీ) · ILLUSTRATIVE" />
				<Say text="పైల్స్ ఒకదానికొకటి అతుక్కుని: ఒక గోడ" at={W(117, 'అతుక్కుని')} y={940} size={54} color={C.ink} bg={C.yellow} />
			</Shot>
			{/* 118-123: the pencils; one gap is a window; only the water sees it */}
			<Shot from={S(118)} to={S(124)}>
				<Plate layers={[{src: hero('h2_pencils_sound'), at: S(118)}, {src: hero('h2_pencils_gap'), at: W(120, 'సందు') - 12, fade: 16}]} cam={[{f: S(118), s: 1.15, x: 0.5, y: 0.5}, {f: S(120), s: 1.35, x: 0.5, y: 0.48}, {f: S(121), s: 2.3, x: 0.52, y: 0.45}, {f: S(124), s: 2.7, x: 0.52, y: 0.45}]}>
					<Ring p={an('h2_pencils', 'gap')} at={W(120, 'సందు')} until={S(122)} r={80} />
					<Flow pts={[an('h2_pencils', 'gap', -0.09, -0.02), an('h2_pencils', 'gap', -0.02, 0), an('h2_pencils', 'gap', 0.02, 0.01), an('h2_pencils', 'gap', 0.1, 0.05)]} at={W(123, 'నీళ్ళకి') - 8} draw={22} w={5} arrow={false} />
				</Plate>
				<Say text="పక్కదానికి గట్టిగా అతుక్కుంటే: గోడ" at={S(119)} until={S(120)} y={930} size={54} />
				<Say text="సందు మిగిలితే: గోడ కాదు" at={W(120, 'సందు')} until={S(121)} y={930} size={54} color={C.white} bg={C.orange} />
				<Say text="కిటికీ" at={W(121, 'కిటికీ')} until={S(122)} y={900} size={120} color={C.ink} bg={C.yellow} />
				<Say text="భూమి కింద ఎవరికీ కనిపించదు" at={S(122)} until={S(123)} y={930} size={54} />
				<Say text="నీళ్ళకి తప్ప" at={S(123)} until={S(124)} y={930} size={72} color={C.blueLight} />
			</Shot>
			{/* 124-129: the committee on quality control; 20 asked, 11 given */}
			<Shot from={S(124)} to={S(130)}>
				<Paper>

					{f >= S(126) ? (
						<div style={{position: 'absolute', left: 210, top: 250, width: 1500, display: 'flex', flexWrap: 'wrap', gap: 22}}>
							{Array.from({length: 20}).map((_, i) => {
								const a = W(127, 'ట్వెంటీ') - 12 + i * 1.2;
								const miss = i >= 11;
								return (
									<div key={i} style={{width: 128, height: 150, borderRadius: 8, background: miss ? 'transparent' : '#D8B56A', border: `5px ${miss && gone > 0.5 ? 'dashed' : 'solid'} ${C.ink}`, opacity: ramp(f, a, 6) * (miss ? 1 - 0.55 * gone : 1), boxSizing: 'border-box', position: 'relative', backgroundColor: miss ? `rgba(216,181,106,${1 - gone})` : '#D8B56A'}}>
										<div style={{position: 'absolute', left: 8, top: -16, width: 56, height: 16, background: C.ink, borderRadius: '6px 6px 0 0'}} />
										<div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.num, fontWeight: 800, fontSize: 54, color: C.ink}}>{i + 1}</div>
									</div>
								);
							})}
						</div>
					) : null}
					<Say text="అడిగింది: 20 రకాల రికార్డులు" at={W(127, 'ట్వెంటీ')} until={S(130)} x={520} y={150} size={52} />
					<Say text="ఇచ్చింది: 11" at={W(128, 'ఎలెవెన్')} until={S(130)} x={1400} y={150} size={60} color={C.ink} bg={C.yellow} />
					<Say text="క్వాలిటీ కంట్రోల్ రిపోర్టులు" at={W(129, 'క్వాలిటీ')} until={S(130)} x={560} y={900} size={46} color={C.white} bg={C.orange} />
					<Say text="వర్షాకాలానికి ముందు, తర్వాత తనిఖీల రిపోర్టులు" at={W(129, 'వర్షాకాలానికి')} until={S(130)} x={1330} y={900} size={44} color={C.white} bg={C.orange} />
				</Paper>
				<Source text="NDSA కమిటీ రిపోర్ట్ · 1 నవంబర్ 2023" from={S(126)} to={S(130)} />
			</Shot>
			<Shot from={S(124)} to={S(126)} out={8}>
				<DocPage src="docs/ndsa-2.png" from={S(124)} to={S(126)} box={[0.2, 0.074, 0.69, 0.052]} hl={S(125) + 6} aspect={0.684} zoom={[1.0, 1.75]} />
				<Say text="గట్టి క్వాలిటీ కంట్రోల్ జరగలేదు" at={W(125, 'క్వాలిటీ') - 6} y={930} size={56} color={C.white} bg={C.orange} />
				<Source text="NDSA కమిటీ రిపోర్ట్ · 1 నవంబర్ 2023 · అసలు పేజీ" from={S(124) + 6} to={S(126)} />
			</Shot>
			{/* 130-136: the final report, and honestly: only what the papers carried */}
			<Shot from={S(130)} to={S(137)}>
				<Paper>
					<div style={{position: 'absolute', left: 960, top: 500, width: 560, height: 700, transform: `translate(-50%,-50%) rotate(${-4 + 0.3 * Math.sin(f / 90)}deg) scale(${0.85 + 0.0005 * (f - S(130))})`, background: '#F4EEDD', boxShadow: `${14}px ${14}px 0 #d9d0b8, ${28}px ${28}px 0 #c9bfa4, 0 40px 70px rgba(40,20,0,0.5)`, borderRadius: 4, padding: 50, boxSizing: 'border-box', opacity: ramp(f, S(130), 10)}}>
						<div style={{fontFamily: F.num, fontWeight: 800, fontSize: 40, color: C.ink, lineHeight: 1.3}}>NATIONAL DAM SAFETY AUTHORITY</div>
						<div style={{fontFamily: F.te, fontWeight: 700, fontSize: 44, color: C.ink, marginTop: 40, lineHeight: 1.4}}>మేడిగడ్డ, అన్నారం, సుందిళ్ళ బ్యారేజీలపై ఫైనల్ రిపోర్ట్</div>
						<div style={{fontFamily: F.te, fontWeight: 500, fontSize: 36, color: C.inkSoft, marginTop: 40}}>24 ఏప్రిల్ 2025</div>
						<div style={{position: 'absolute', left: 50, bottom: 40, fontFamily: F.te, fontSize: 28, color: C.inkSoft}}>మా బొమ్మ · అసలు కవర్ కాదు</div>
					</div>
					<Say text="ఏప్రిల్ 2025" at={W(130, 'ఏప్రిల్')} until={S(133)} x={330} y={300} size={64} color={C.ink} bg={C.yellow} />
					<Say text="దాదాపు 350 పేజీలు" at={S(131)} until={S(133)} x={330} y={420} size={50} />
					<Say text="కమిటీ హెడ్: చంద్రశేఖర్ అయ్యర్" at={W(132, 'చంద్రశేఖర్')} until={S(133)} x={1560} y={360} size={44} />
					<Say text="పూర్తి కాపీ పబ్లిక్ గా దొరకలేదు" at={S(134)} until={S(137)} y={930} size={56} color={C.white} bg={C.orange} />
					<Say text="ఇక్కడి నుంచి: ఆ రిపోర్ట్ పై పేపర్లలో వచ్చిన వివరాలు" at={S(135)} until={S(137)} y={1010} size={42} />
					<Say text="2 నంబర్లు · 1 మార్పు" at={W(136, 'రెండు')} until={S(137)} x={1560} y={360} size={60} color={C.ink} bg={C.yellow} />
				</Paper>
			</Shot>
			{/* 137-141: 85 boreholes asked, 6 drilled */}
			<Shot from={S(137)} to={S(142)}>
				<Plate layers={[{src: hero('h3_plan_none'), at: S(137)}, {src: hero('h3_plan_85'), at: W(139, 'ఎయిటీ') - 6, fade: 22}, {src: hero('h3_plan_6'), at: W(140, 'సిక్స్') - 6, fade: 20}]} cam={[{f: S(137), s: 1.4, x: 0.5, y: 0.52}, {f: S(139), s: 1.15, x: 0.5, y: 0.5}, {f: S(140), s: 1.15, x: 0.5, y: 0.5}, {f: S(141), s: 2.6, x: 0.16, y: 0.55}, {f: S(142), s: 2.6, x: 0.84, y: 0.55}]} />
				<Roll to={85} start={W(139, 'ఎయిటీ') - 20} land={W(139, 'ఎయిటీ') + 8} until={S(141)} x={520} y={200} size={150} suffix=" వెయ్యాలి" />
				<Roll from={85} to={6} start={W(140, 'సిక్స్') - 14} land={W(140, 'సిక్స్') + 6} until={S(142)} x={1400} y={200} size={170} suffix=" వేశారు" color={C.white} bg={C.orange} />
				<Say text="1.6 కి.మీ. కట్టడానికి: ఆరు చోట్ల మాత్రమే" at={W(141, 'ఆరు') - 10} until={S(142)} y={940} size={54} />
				<Source text="NDSA ఫైనల్ రిపోర్ట్ పై వార్తలు (The South First) · CBIP గైడ్లైన్స్" from={S(139)} to={S(142)} />
				<Honesty text="ILLUSTRATION · పిన్నుల చోట్లు ఊహ" from={S(137)} to={S(142)} />
			</Shot>
			<Shot from={S(138)} to={W(139, 'ఎయిటీ') - 26} x={8} hold={0} out={8}>
				<Photo src="photos/cores.jpg" from={S(138)} to={W(139, 'ఎయిటీ') - 18} zoom={[1.05, 1.2]} pan={[30, 0, -30, 0]} credit="MARUM, V. Diekamp / Wikimedia Commons · CC BY 4.0" label="బోర్ల నుంచి తీసిన నమూనాల గది (వేరే చోట) · ILLUSTRATIVE" />
				<Say text="బోర్లు వేసి, కింద నేల నమూనాలు తీసి చూస్తారు" at={W(138, 'బోర్లు') - 20} y={940} size={50} />
			</Shot>
			{/* 142-144: the project report: a year needed, four months taken */}
			<Shot from={S(142)} to={S(145)}>
				<Paper>
					<div style={{position: 'absolute', left: 240, top: 330, width: 1440, display: 'flex', gap: 14}}>
						{Array.from({length: 12}).map((_, i) => {
							const away = i >= 4 ? torn : 0;
							return (
								<div key={i} style={{width: 108, height: 150, background: i < 4 ? C.yellow : '#FBF6E9', border: `4px solid ${C.ink}`, borderRadius: 8, boxSizing: 'border-box', opacity: ramp(f, W(143, 'ఏడాది') - 14 + i * 1.5, 6) * (1 - 0.75 * away), transform: `translateY(${away * (60 + i * 6)}px) rotate(${away * (i % 2 ? 9 : -8)}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: F.num, fontWeight: 800, fontSize: 60, color: C.ink}}>{i + 1}</div>
							);
						})}
					</div>
					<Say text="డీటెయిల్డ్ ప్రాజెక్ట్ రిపోర్ట్ (DPR)" at={W(143, 'డీటెయిల్డ్')} y={170} size={56} />
					<Say text="కావాల్సింది: ఒక ఏడాది" at={W(143, 'ఏడాది')} until={S(144)} y={640} size={54} />
					<Say text="తయారైంది: 4 నెలల్లో" at={W(144, 'నాలుగు')} y={640} size={64} color={C.white} bg={C.orange} />
				</Paper>
				<Source text="NDSA ఫైనల్ రిపోర్ట్ పై వార్తలు (The South First)" from={S(142) + 10} to={S(145)} />
			</Shot>
			{/* 145-150: sheet piles planned, secant piles built; who signed */}
			<Shot from={S(145)} to={S(151)}>
				<Plate layers={[{src: hero('h2_piles_sound'), at: S(145)}]} cam={[{f: S(145), s: 1.2, x: 0.5, y: 0.5}, {f: S(148), s: 1.4, x: 0.5, y: 0.48}, {f: S(151), s: 1.25, x: 0.5, y: 0.5}]} />
				{f < W(147, 'సీకెంట్') + 4 ? (
					<div style={{position: 'absolute', left: 360, top: 250, width: 1200, height: 560, background: '#FBF6E9', borderRadius: 8, boxShadow: '0 30px 60px rgba(40,20,0,0.5)', opacity: ramp(f, S(145), 10) * (1 - ramp(f, W(147, 'సీకెంట్') - 8, 12)), transform: `rotate(-1.4deg) scale(${1 + 0.0004 * (f - S(145))})`}}>
						<svg viewBox="0 0 1200 560" style={{position: 'absolute', inset: 0}}>
							{/* interlocked steel sheet piles seen from above (our drawing) */}
							<path d={'M80 300 ' + Array.from({length: 9}).map((_, i) => `l40 ${i % 2 ? 90 : -90} l76 0`).join(' ')} fill="none" stroke="#4A5560" strokeWidth={18} strokeLinejoin="round" strokeDasharray={2400} strokeDashoffset={2400 * (1 - ramp(f, W(146, 'షీట్') - 14, 34))} />
							<text x={600} y={500} textAnchor="middle" fontFamily="Noto Sans Telugu" fontWeight={700} fontSize={40} fill={C.inkSoft}>ఒకదానికొకటి లాక్ అయ్యే స్టీల్ షీట్లు · పై నుంచి చూస్తే</text>
						</svg>
					</div>
				) : null}
				<Say text="ముందు అనుకున్నది: షీట్ పైల్స్" at={W(146, 'షీట్') - 8} until={S(147)} y={160} size={52} />
				<Say text="వేసింది: సీకెంట్ పైల్స్" at={W(147, 'సీకెంట్') - 4} until={S(148)} y={160} size={60} color={C.white} bg={C.orange} />
				<Sheet at={S(148)} until={S(151)} x={960} y={620} w={1000} h={360} rot={-1.2}>
					<Line text="నిర్ణయం తీసుకున్నది: ____________" at={S(148) + 4} size={48} weight={700} />
					<Line text="సంతకం: ____________" at={W(148, 'సంతకం')} size={48} weight={700} />
					<Line text="ఏ కోర్ట్ లోనూ ఇంకా తేలలేదు" at={S(149)} hl={S(149) + 8} size={44} />
				</Sheet>
				<Source text="NDSA ఫైనల్ రిపోర్ట్ పై వార్తలు (The South First)" from={S(146)} to={S(148)} />
				<Honesty text="ILLUSTRATION" from={S(145)} to={S(148)} />
			</Shot>
		</>
	);
};
void seep; void Roll; void Tag;
