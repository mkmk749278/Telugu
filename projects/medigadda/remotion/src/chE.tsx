import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {DocPage, Flow, Grains, Honesty, Paper, Photo, Plate, Ring, Roll, Say, Shot, Source, Tag, clamp, lerp, ramp} from './kit';
import {Quote} from './chD';
import {S, W, an, hero} from './t';
import {C, F} from './theme';

const FR = 'h1_front', U = 'h1_under';
type P2 = [number, number];
const RECON = 'రిపోర్ట్ ల ఆధారంగా మేం గీసిన బొమ్మ · ILLUSTRATION';
// under the raft, through the weak wall, up to the river bed downstream (the 'under' camera)
const LEAK: P2[] = [[0.02, 0.6], [0.3, 0.66], [0.56, 0.67], [0.668, 0.69], [0.78, 0.62], [0.9, 0.45], [0.96, 0.4]];
const SAND: P2[] = [[0.4, 0.57], [0.56, 0.63], [0.668, 0.69], [0.78, 0.62], [0.9, 0.45], [0.96, 0.4]];

/** s151-s206: the reconstruction, said as a reconstruction: 2019 to the evening, then the grouting. */
export const ChE: React.FC = () => {
	const f = useCurrentFrame();
	const months = Math.floor(interpolate(f, [W(163, 'నెలల') - 10, S(164)], [1, 9], clamp));
	const jet = W(165, 'బుల్లెట్') - 12;
	const settle = W(191, 'దిగింది') - 14;
	const sh = f >= settle && f < settle + 16 ? Math.sin((f - settle) * 2.2) * 6 * (1 - (f - settle) / 16) : 0;
	const mm = interpolate(f, [W(194, 'వన్') - 16, W(194, 'మీటర్లు')], [0, 1.256], clamp);
	return (
		<>
			{/* 151-163: 2019: opened, gates down, a barrage used like a dam */}
			<Shot from={S(151)} to={S(164)}>
				<Plate layers={[{src: hero('h1_wide_road'), at: S(151)}, {src: hero('h1_front_open'), at: S(155) - 6, fade: 16}, {src: hero('h1_front_rockwall'), at: W(157, 'దించారు') - 6, fade: 30}]} cam={[{f: S(151), s: 1.1, x: 0.5, y: 0.5}, {f: S(155), s: 1.3, x: 0.5, y: 0.5}, {f: S(160), s: 1.35, x: 0.42, y: 0.5}, {f: S(163), s: 1.7, x: 0.46, y: 0.64}, {f: S(164), s: 1.8, x: 0.5, y: 0.66}]}>
					{f >= W(163, 'ఒత్తిడి') - 20 ? [0.2, 0.32, 0.44].map((u, i) => {
						const x = lerp(an(FR, 'bed_up')[0], an(FR, 'raft_tl')[0], u + 0.4), y = an(FR, 'bed_up')[1] - 0.02;
						return (
							<svg key={i} viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
								<path d={`M${x * 1920} ${y * 1080 - 90 + 6 * Math.sin(f / 5 + i)} l0 60 m-12 -16 l12 18 l12 -18`} stroke={C.yellow} strokeWidth={8} fill="none" strokeLinecap="round" opacity={ramp(f, W(163, 'ఒత్తిడి') - 20 + i * 3, 8)} />
							</svg>
						);
					}) : null}
				</Plate>
				<Say text="బ్లాక్ 7 కింద ఏం జరిగి ఉంటుంది?" at={W(151, 'బ్లాక్')} until={S(152)} y={930} size={58} color={C.ink} bg={C.yellow} />
				<Say text="కింద జరిగింది ఎవరూ కళ్ళతో చూడలేదు" at={S(154)} until={S(155)} y={930} size={54} />
				<Say text="2019" at={S(155)} until={S(164)} x={150} y={150} align="left" size={120} font={F.num} color={C.yellow} />
				<Say text="ఓపెన్ అయింది" at={S(156)} until={S(157)} y={930} size={54} />
				<Say text="గేట్లు దించారు" at={S(157)} until={S(158)} y={930} size={54} />
				<Say text="నీళ్ళు నిలబడ్డాయి" at={S(158)} until={S(159)} y={930} size={54} />
				<Say text="పంపులు తిరిగాయి" at={S(159)} until={S(160)} y={930} size={54} />
				<Say text={`నిండు నీటి ఒత్తిడి · ${months} నెలలు`} at={W(163, 'నెలల') - 10} until={S(164)} y={930} size={56} color={C.yellow} />
				<Honesty text={RECON} from={S(151)} to={S(164)} />
			</Shot>
			<Shot from={S(159)} to={S(160)} x={6} hold={0} out={6}>
				<Photo video src="photos/v_pipes.mp4" from={S(159)} to={S(160) + 6} zoom={[1.02, 1.06]} pan={[0, 0, 0, 0]} credit="MEIL / Wikimedia Commons · CC BY 3.0" />
				<Say text="పంపులు తిరిగాయి" at={S(159)} y={930} size={54} />
			</Shot>
			{/* 160-162: the real river from space: the bed in 2019, the pond held full in 2022 */}
			<Shot from={S(160)} to={S(163)} x={10} out={10} hold={0}>
				<Plate layers={[{src: 'sat/s2_2019-02-18.jpg', at: S(160)}, {src: 'sat/s2_2022-11-19.jpg', at: W(162, 'డ్యామ్') - 20, fade: 36}]} cam={[{f: S(160), s: 1.15, x: 0.42, y: 0.4}, {f: S(163), s: 1.5, x: 0.38, y: 0.36}]}>
					<Tag p={[0.4, 0.34]} text="మేడిగడ్డ బ్యారేజ్" at={S(160) + 6} until={S(163)} dx={150} dy={-110} size={44} />
				</Plate>
				<Say text="బ్యారేజ్: నీళ్ళని మళ్ళించేది" at={W(160, 'మళ్ళించే') - 20} until={S(162)} x={1380} y={760} size={46} />
				<Say text="డ్యామ్: నీళ్ళు నిలవ చేసేది" at={W(161, 'నిలవ') - 10} until={S(162)} x={1380} y={850} size={46} />
				<Say text="బ్యారేజీలని డ్యామ్ లాగా వాడారు" at={W(162, 'డ్యామ్')} until={S(163)} y={940} size={56} color={C.white} bg={C.orange} />
				<Say text={f < W(162, 'డ్యామ్') - 4 ? 'ఫిబ్రవరి 2019' : 'నవంబర్ 2022'} at={S(160) + 4} until={S(163)} x={150} y={150} align="left" size={64} color={C.yellow} />
				<Source text="శాటిలైట్: Copernicus Sentinel-2 · రిపోర్ట్ పై వార్తలు (Deccan Chronicle)" from={S(160) + 6} to={S(163)} />
			</Shot>
			{/* 164-173: downstream: the jet, the blocks gone, nobody inspected */}
			<Shot from={S(164)} to={S(169)}>
				<Plate layers={[{src: hero('h1_front_rockwall'), at: S(164)}, {src: hero('h1_front_noblocks'), at: W(167, 'కొట్టుకుపోయాయని') - 14, fade: 26}]} cam={[{f: S(164), s: 1.8, x: 0.5, y: 0.66}, {f: S(165), s: 2.2, x: 0.62, y: 0.56}, {f: S(166), s: 2.3, x: 0.78, y: 0.56}, {f: S(169), s: 2.5, x: 0.8, y: 0.57}]}>
					<Flow pts={[an(FR, 'gate_bot', -0.02, -0.01), an(FR, 'gate_bot', 0.03, 0), an(FR, 'raft_tr', -0.02, -0.012), an(FR, 'apron_end', 0, -0.012), an(FR, 'blocks_end', -0.06, -0.01)]} at={jet} draw={14} w={12} speed={11} color="#dff1ff" />
					<Tag p={an(FR, 'apron_end', 0.06, -0.005)} text="కాంక్రీట్ బ్లాక్స్" at={W(166, 'కాంక్రీట్')} until={W(167, 'కొట్టుకుపోయాయని')} dx={40} dy={-150} size={40} />
					<Ring p={an(FR, 'scour')} at={W(167, 'కొట్టుకుపోయాయని')} until={S(169)} r={90} color={C.orange} />
				</Plate>
				<Say text="మొదటి దెబ్బ: కింద వైపు" at={S(164)} until={S(165)} y={150} size={56} color={C.ink} bg={C.yellow} />
				<Say text="2019 లోనే బ్లాక్స్ కొట్టుకుపోయాయి" at={W(167, 'కొట్టుకుపోయాయని') - 6} until={S(168)} y={150} size={56} color={C.white} bg={C.orange} />
				<Say text="ఒక్క గేట్ కొంచెం తెరిస్తే? మోడల్ స్టడీస్ లో చూడలేదు" at={S(168)} until={S(169)} y={150} size={48} />
				<Source text="NDSA ఫైనల్ రిపోర్ట్ పై వార్తలు (The South First)" from={S(167)} to={S(169)} />
				<Honesty text={RECON} from={S(164)} to={S(169)} />
			</Shot>
			<Shot from={S(169)} to={S(174)}>
				<Paper>
					<div style={{position: 'absolute', left: 260, top: 210, display: 'flex', gap: 30}}>
						{['2019', '2020', '2021', '2022', '2023'].map((y, i) => (
							<div key={y} style={{width: 250, height: 250, background: '#FBF6E9', border: `5px solid ${C.ink}`, borderRadius: 10, opacity: ramp(f, S(171) + i * 5, 8), boxSizing: 'border-box', textAlign: 'center', fontFamily: F.num}}>
								<div style={{background: C.ink, color: '#fff', fontWeight: 800, fontSize: 44}}>{y}</div>
								<div style={{fontFamily: F.te, fontWeight: 700, fontSize: 34, color: C.inkSoft, marginTop: 26}}>తనిఖీ</div>
								<div style={{fontWeight: 800, fontSize: 80, color: C.red, opacity: ramp(f, W(171, 'తనిఖీ') + i * 3, 5), lineHeight: 1}}>✕</div>
							</div>
						))}
					</div>
					<Say text="దెబ్బ తగిలింది. మరి రిపేర్?" at={S(169)} until={S(171)} y={130} size={56} color={C.ink} bg={C.yellow} />
				</Paper>
			</Shot>
			<Shot from={S(172)} to={S(174)} x={10}>
				<DocPage src="docs/ndsa-2.png" from={S(172)} to={S(174)} box={[0.2, 0.582, 0.69, 0.08]} hl={S(172) + 8} aspect={0.684} zoom={[1.0, 1.75]} />
				<Say text="మెయింటెనెన్స్ లో పెద్ద లోపం" at={W(173, 'మెయింటెనెన్స్')} y={930} size={58} color={C.white} bg={C.orange} />
				<Source text="NDSA కమిటీ రిపోర్ట్ · 1 నవంబర్ 2023 · అసలు పేజీ" from={S(172) + 6} to={S(174)} />
			</Shot>
			{/* 174-190: under the raft: a way, then grain by grain; nothing shows above */}
			<Shot from={S(174)} to={S(188)}>
				<Plate layers={[{src: hero('h1_under_rockwall'), at: S(174)}, {src: hero('h1_under_void1'), at: S(180) - 10, fade: 90}, {src: hero('h1_under_void2'), at: S(184), fade: 110}]} cam={[{f: S(174), s: 1.0, x: 0.45, y: 0.36}, {f: S(176), s: 1.25, x: 0.56, y: 0.55}, {f: S(178), s: 1.5, x: 0.62, y: 0.6}, {f: S(182), s: 1.35, x: 0.56, y: 0.58}, {f: S(188), s: 1.2, x: 0.5, y: 0.54}]}>
					<Tag p={[0.668, 0.72]} text="నాసిరకం అని రిపోర్ట్ చెప్పిన గోడ" at={W(176, 'నాసిరకం')} until={S(178)} dx={-80} dy={150} size={36} />
					<Flow pts={LEAK} at={W(177, 'దారి') - 16} draw={50} w={6} until={S(188)} speed={2.4} />
					<Grains pts={SAND} at={W(179, 'ఇసుక') - 6} until={S(188)} n={16} period={95} r={5} grow={0.25} />
				</Plate>
				<Say text="పైన: నిండు నీళ్ళు" at={S(174)} until={S(177)} x={420} y={140} size={46} />
				<Say text="కింద వైపు: రక్షణ పోయిన నేల" at={S(175)} until={S(177)} x={1460} y={140} size={46} />
				<Say text="నీళ్ళకి దారి దొరికింది" at={W(177, 'దారి')} until={S(178)} y={940} size={58} color={C.blueLight} />
				<Say text="మొదట్లో నీళ్ళు మాత్రమే" at={S(178)} until={S(179)} y={940} size={52} />
				<Say text="తర్వాత: ఒక్కొక్క ఇసుక రేణువు" at={W(179, 'ఒక్కొక్క') - 6} until={S(180)} y={940} size={58} color={C.ink} bg={C.yellow} />
				<Say text="ఎప్పుడు మొదలైందో ఎవరికీ తెలియదు" at={S(180)} until={S(181)} y={940} size={52} />
				<Say text="2022 వరద ఎంత పెంచిందో: వివరాల్లో లేదు" at={S(181)} until={S(182)} y={940} size={48} />
				<Say text="పైపింగ్ ఒక్క రోజు పని కాదు" at={S(183)} until={S(184)} y={940} size={56} />
				<Say text="నిలబడిన నీళ్ళు + టైమ్ = చాలు" at={S(185)} until={S(186)} y={940} size={60} color={C.ink} bg={C.yellow} />
				<Say text="వరద రోజు నిలబడింది · మామూలు రోజున కుంగింది" at={S(187)} until={S(188)} y={940} size={50} />
				<Honesty text={RECON} from={S(174)} to={S(188)} />
			</Shot>
			{/* 188-190: above, nothing shows */}
			<Shot from={S(188)} to={S(191)}>
				<AbsoluteFill style={{clipPath: 'inset(0 0 50% 0)'}}>
					<Plate layers={[{src: hero('h1_wide_water'), at: S(188)}]} cam={[{f: S(188), s: 2.0, x: 0.6, y: 0.62}, {f: S(191), s: 2.2, x: 0.62, y: 0.62}]} />
				</AbsoluteFill>
				<AbsoluteFill style={{clipPath: 'inset(50% 0 0 0)'}}>
					<Plate layers={[{src: hero('h1_under_void2'), at: S(188)}]} cam={[{f: S(188), s: 1.9, x: 0.46, y: 0.32}, {f: S(191), s: 2.1, x: 0.46, y: 0.32}]}>
						<Grains pts={SAND} at={S(188) - 200} n={16} period={95} r={5} />
					</Plate>
				</AbsoluteFill>
				<div style={{position: 'absolute', left: 0, right: 0, top: 536, height: 8, background: C.yellow}} />
				<Say text="పైన: బండ్లు తిరుగుతున్నాయి · గేట్లు పనిచేస్తున్నాయి" at={S(188)} y={170} size={46} />
				<Say text="పైకి ఏమీ కనిపించలేదు" at={S(190)} y={470} size={58} color={C.ink} bg={C.yellow} />
				<Say text="కింద" at={S(188)} x={160} y={610} size={46} />
				<Honesty text={RECON} from={S(188)} to={S(191)} />
			</Shot>
			{/* 191-195: the evening: the raft goes down; 1.256 m; a man's chest */}
			<Shot from={S(191)} to={S(196)}>
				<div style={{position: 'absolute', inset: 0, transform: `translate(${sh}px, ${sh}px)`}}>
					<Plate layers={[{src: hero('h1_front_void2'), at: S(191)}, {src: hero('h1_front_settled'), at: settle, fade: 14}]} cam={[{f: S(191), s: 1.6, x: 0.52, y: 0.56}, {f: S(193), s: 1.9, x: 0.5, y: 0.5}, {f: S(194), s: 2.4, x: 0.47, y: 0.44}, {f: S(196), s: 2.6, x: 0.46, y: 0.44}]}>
						<Tag p={an(FR, 'pier_mid')} text="పిల్లర్ 20" at={S(193)} until={S(196)} dx={-200} dy={-40} size={36} bg={C.orange} color={C.white} />
						{f >= W(194, 'వన్') - 16 ? (
							<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible'}}>
								<g transform={`translate(${an(FR, 'pier_top')[0] * 1920 + 120} ${an(FR, 'pier_top')[1] * 1080 - 6})`}>
									<line x1={0} y1={0} x2={0} y2={52 * (mm / 1.256)} stroke={C.yellow} strokeWidth={7} />
									<line x1={-16} y1={0} x2={16} y2={0} stroke={C.yellow} strokeWidth={6} /><line x1={-16} y1={52 * (mm / 1.256)} x2={16} y2={52 * (mm / 1.256)} stroke={C.yellow} strokeWidth={6} />
								</g>
							</svg>
						) : null}
					</Plate>
				</div>
				<Say text="21 అక్టోబర్ 2023 · సాయంత్రం" at={S(191)} until={S(193)} x={150} y={150} align="left" size={60} font={F.te} />
				<Say text="రాఫ్ట్, పిల్లర్లు ఒకే ముక్క" at={S(192)} until={S(193)} y={940} size={52} />
				<Say text="దిగాయి · ఒరిగాయి · పగిలాయి" at={W(193, 'దిగాయి')} until={S(194)} y={940} size={58} color={C.white} bg={C.orange} />
				<Roll to={1.256} decimals={3} start={W(194, 'వన్') - 16} land={W(194, 'మీటర్లు')} until={S(196)} x={1420} y={300} size={140} suffix=" మీ." />
				<Say text="24 అక్టోబర్ కి" at={W(194, 'అక్టోబర్')} until={S(196)} x={1420} y={170} size={48} />
				{f >= S(195) - 4 ? (
					<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, opacity: ramp(f, S(195) - 4, 8)}}>
						<g transform="translate(1420 880)" stroke={C.white} strokeWidth={9} strokeLinecap="round" fill="none">
							<circle cx={0} cy={-330} r={34} fill={C.white} /><path d="M0 -294 L0 -130 M0 -130 L-40 0 M0 -130 L40 0 M0 -260 L-60 -170 M0 -260 L60 -170" />
							<line x1={-150} y1={-246} x2={150} y2={-246} stroke={C.yellow} strokeWidth={7} strokeDasharray="14 10" />
						</g>
					</svg>
				) : null}
				<Say text="దాదాపు ఒక మనిషి ఛాతీ ఎత్తు" at={S(195)} until={S(196)} x={1420} y={950} size={46} color={C.ink} bg={C.yellow} />
				<Source text="NDSA రిపోర్ట్ ల ఆధారంగా · 1.256 మీ.: The South First" from={S(192)} to={S(196)} />
				<Honesty text={RECON} from={S(191)} to={S(196)} />
			</Shot>
			{/* "cracked": the committee's own crack map of pier 20, on its word, then back to the cutaway for the number */}
			<Shot from={W(193, 'పగిలాయి') - 4} to={W(194, 'అక్టోబర్') - 6} x={6} out={8} hold={0}>
				<DocPage src="docs/ndsa-10.png" from={W(193, 'పగిలాయి') - 4} to={W(194, 'అక్టోబర్')} box={[0.02, 0.445, 0.62, 0.25]} aspect={0.752} zoom={[2.3, 3.0]} />
				<Say text="పిల్లర్ 20 · పగుళ్ళ మ్యాప్" at={W(193, 'పగిలాయి') - 2} y={985} size={54} color={C.white} bg={C.orange} />
				<Source text="NDSA కమిటీ రిపోర్ట్ · 1 నవంబర్ 2023 · అసలు పేజీ" from={W(193, 'పగిలాయి')} to={W(194, 'అక్టోబర్')} />
			</Shot>
			{/* 196-200: the cause as reported; maybe under other blocks; Annaram and Sundilla */}
			<Shot from={S(196)} to={S(201)}>
				<Paper>
					<Quote at={S(196)} until={S(198)} en="due to piping and substandard secant pile cutoffs in Medigadda Barrage" hl={S(197)} te="పైపింగ్ · నాసిరకం సీకెంట్ పైల్ కటాఫ్ లు" teAt={S(197)} src="NDSA ఫైనల్ రిపోర్ట్, 24 ఏప్రిల్ 2025 · వార్తల ప్రకారం (Siasat)" />
				</Paper>
			</Shot>
			<Shot from={S(198)} to={S(201)}>
				<Plate layers={[{src: hero('h3_plan_none'), at: S(198)}]} cam={[{f: S(198), s: 1.2, x: 0.4, y: 0.5}, {f: S(201), s: 1.35, x: 0.6, y: 0.5}]}>
					{[10, 24, 38, 52, 66, 78].map((b, i) => <Say key={b} text="?" at={W(199, 'మిగతా') + i * 3} x={an('h3_plan', `b${b}`)[0] * 1920} y={an('h3_plan', `b${b}`)[1] * 1080 - 40} size={70} color={C.ink} bg={C.yellow} font={F.num} />)}
				</Plate>
				<Say text="ఇలాంటి ఖాళీలు మిగతా బ్లాక్స్ కింద కూడా ఉండొచ్చు" at={S(199)} until={S(200)} y={930} size={52} />
				<Say text="అన్నారం, సుందిళ్ళ: ఇలాంటి లీకేజీ గుర్తులే" at={S(200)} until={S(201)} y={930} size={52} color={C.ink} bg={C.yellow} />
				<Source text="NDSA ఫైనల్ రిపోర్ట్ పై వార్తలు (The South First)" from={S(198) + 8} to={S(201)} />
				<Honesty text="ILLUSTRATION" from={S(198)} to={S(201)} />
			</Shot>
			{/* 201-206: the snag: grouted before the tests */}
			<Shot from={S(201)} to={S(207)}>
				<Plate layers={[{src: hero('h1_under_settled'), at: S(201)}, {src: hero('h1_under_grouted'), at: W(203, 'నింపేశారు') - 30, fade: 34}]} cam={[{f: S(201), s: 1.15, x: 0.5, y: 0.5}, {f: S(203), s: 1.6, x: 0.46, y: 0.56}, {f: S(205), s: 1.75, x: 0.46, y: 0.56}, {f: S(207), s: 1.5, x: 0.55, y: 0.56}]}>
					<Tag p={an(U, 'void')} text="సిమెంట్ తో నింపేశారు" at={W(203, 'సిమెంట్')} until={S(205)} dx={90} dy={170} size={44} />
					{f >= S(206) ? (
						<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, overflow: 'visible', opacity: ramp(f, S(206), 12)}}>
							<path d="M768 700 C900 650 1100 760 1280 720 C1500 660 1640 520 1780 440" stroke={C.yellow} strokeWidth={7} fill="none" strokeDasharray="6 22" strokeLinecap="round" strokeDashoffset={-f * 0.8} />
						</svg>
					) : null}
				</Plate>
				<Say text="కానీ ఒక పెద్ద చిక్కు" at={S(201)} until={S(202)} y={150} size={56} color={C.ink} bg={C.yellow} />
				<Say text="టెస్ట్ లు పూర్తి కాకముందే · అనుమతి లేకుండా" at={S(203)} until={S(204)} y={150} size={50} />
				<Say text="నేల అసలు ఎలా ఉండేదో: ఇక తెలుసుకోవడం కష్టం" at={S(204)} until={S(205)} y={150} size={48} />
				<Say text="జబ్బు తేలకముందే కుట్లు" at={S(205)} until={S(206)} y={940} size={64} color={C.white} bg={C.orange} />
				<Say text="ఇసుక ఏ దారిలో వెళ్ళింది? స్పష్టమైన జవాబు లేదు" at={S(206)} until={S(207)} y={940} size={50} />
				<Say text="?" at={S(206) + 10} until={S(207)} x={1280} y={600} size={120} color={C.ink} bg={C.yellow} font={F.num} />
				<Source text="NDSA · వార్తల ప్రకారం (Deccan Chronicle)" from={S(202)} to={S(206)} />
				<Honesty text={RECON} from={S(201)} to={S(207)} />
			</Shot>
		</>
	);
};
void Ring;
