import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
import {Honesty, Photo, Roll, Say, Shot, Source} from './kit';
import {S, W} from './t';
import {C, F} from './theme';

/**
 * Real footage first, 3D only for the science (owner, 2026-11-15; PLAYBOOK §8). These beats are about the place, the
 * event, the structure working, people or today, so they play real Creative Commons footage (cut by
 * tools/cut_footage.py from the YouTube downloads; licence checked in each .info.json) over the chapters. The 3D,
 * the documents and the diagrams stay underneath for the mechanism and the evidence.
 *
 * Every reel says where its footage is from (ILLUSTRATIVE FOOTAGE when it is not the place the voice names) and
 * credits the channel and licence. Each reel line keeps `from:` and `to:` on one line: tools/sfx_cues.py reads them
 * to keep sound effects of the hidden layer out of these windows.
 */
type Cut = {clip: string; at: number; startAt?: number; rate?: number; zoom?: [number, number]; pan?: [number, number, number, number]; credit: string};
const MEIL = 'Megha Engineering (MEIL) / YouTube · CC BY';

const Reel: React.FC<{from: number; to: number; cuts: Cut[]; label?: string; shakeAt?: number; children?: React.ReactNode}> = ({from, to, cuts, label, shakeAt, children}) => {
	const f = useCurrentFrame();
	const k = shakeAt !== undefined && f >= shakeAt && f < shakeAt + 14 ? Math.sin((f - shakeAt) * 2.4) * 7 * (1 - (f - shakeAt) / 14) : 0;
	return (
		<Shot from={from} to={to} x={8} out={8} hold={0}>
			<AbsoluteFill style={{transform: `translate(${k}px, ${k * 0.6}px) scale(${k ? 1.02 : 1})`}}>
				{cuts.map((c, i) => {
					const end = i + 1 < cuts.length ? cuts[i + 1].at + 8 : to + 8;
					return (
						<Shot key={c.clip + i} from={c.at} to={end} x={i ? 8 : 0} hold={0}>
							<Photo src={`footage/${c.clip}.mp4`} video from={c.at} to={end} startAt={c.startAt ?? 0} rate={c.rate ?? 1} zoom={c.zoom ?? [1.02, 1.08]} pan={c.pan ?? [0, 0, -12, -6]} credit={c.credit} />
						</Shot>
					);
				})}
			</AbsoluteFill>
			<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,6,2,0.42) 0%, transparent 26%, transparent 70%, rgba(10,6,2,0.5) 100%)'}} />
			{children}
			{label ? <Honesty text={label} from={from} to={to} /> : null}
		</Shot>
	);
};

export const Footage: React.FC = () => (
	<>
		{/* s3-s8: the evening of 21 Oct 2023 on the Godavari; the bridge, the sound, the walk */}
		<Reel from={S(3)} to={S(9)} shakeAt={W(7, 'శబ్దం')} label="ILLUSTRATIVE FOOTAGE · కాళేశ్వరం ప్రాజెక్ట్, గోదావరి (MEIL)" cuts={[
			{clip: 'evening', at: S(3), credit: MEIL},
			{clip: 'barrage_air', at: S(5), rate: 0.74, credit: MEIL},
			{clip: 'barrage_deck', at: S(6), credit: MEIL},
			{clip: 'engineer', at: S(7), rate: 0.7, credit: MEIL},
			{clip: 'bridge_walk', at: S(8), credit: 'Sumedhbhim / YouTube · CC BY'},
		]}>
			<Say text="21 అక్టోబర్ 2023" at={W(3, 'అక్టోబర్')} until={S(7)} x={120} y={170} align="left" size={84} font={F.num} />
			<Say text="శనివారం · సాయంత్రం 6:30 ప్రాంతం" at={S(4)} until={S(7)} x={120} y={278} align="left" size={46} />
			<Say text="గోదావరి · తెలంగాణ – మహారాష్ట్ర బోర్డర్" at={W(5, 'తెలంగాణ')} until={S(7)} x={120} y={360} align="left" size={46} />
			<Say text="పైన రోడ్ బ్రిడ్జ్: బండ్లు మామూలుగానే" at={S(6)} until={S(7)} y={920} size={50} />
			<Say text="పెద్ద శబ్దం" at={W(7, 'శబ్దం')} until={S(8)} y={900} size={72} color={C.yellow} />
			<Say text="డ్యూటీ ఇంజనీర్ + L&T ఫోర్మన్: బ్రిడ్జ్ మీద నడిచి చూశారు" at={W(8, 'బ్రిడ్జ్')} until={S(9)} y={920} size={46} />
		</Reel>
		{/* s11-s15: the July 2022 flood it survived (the paradox) */}
		<Reel from={S(11)} to={S(16)} label="ILLUSTRATIVE FOOTAGE · గోదావరి మీద వేరే ప్రాజెక్ట్‌ల వరద (MEIL)" cuts={[
			{clip: 'flood_gates', at: S(11), credit: MEIL},
			{clip: 'flood_jet', at: W(11, 'ట్వెంటీ', 1) - 10, credit: MEIL},
			{clip: 'flood_above', at: S(12), credit: MEIL},
			{clip: 'flood_air', at: S(13), credit: MEIL},
			{clip: 'flood_close', at: S(15) - 10, rate: 0.9, credit: MEIL},
		]}>
			<Say text="జులై 2022" at={W(11, 'జులైలో') - 20} until={S(14)} x={120} y={160} align="left" size={70} font={F.te} />
			<Roll to={28.7} decimals={1} start={W(11, 'ట్వెంటీ', 1) - 22} land={W(11, 'లక్షల')} until={S(14)} x={460} y={300} size={130} suffix=" లక్షల క్యూసెక్కులు" />
			<Say text="డిజైన్ వరద: 28.25 లక్షలు" at={W(12, 'డిజైన్')} until={S(14)} x={120} y={430} align="left" size={46} />
			<Say text="అప్పుడు నిలబడింది" at={S(13)} until={S(14)} y={920} size={64} color={C.yellow} />
			<Say text="కుంగిన రోజు: అంత వరద లేదు" at={S(14) + 8} until={S(16)} y={900} size={56} />
			<Say text="బ్యారేజ్ వయసు: 4 ఏళ్ళు" at={S(15)} until={S(16)} y={990} size={50} color={C.yellow} />
			<Source text="వరద లెక్క: Telangana Today" from={S(11) + 20} to={S(14)} />
		</Reel>
		{/* s24: the place before the map: the Pranahita at the border, the Godavari at Kaleshwaram */}
		<Reel from={S(24)} to={W(24, 'ట్వెంటీ') - 4} cuts={[
			{clip: 'pranahita', at: S(24), credit: 'Sumedhbhim / YouTube · CC BY'},
			{clip: 'kaleshwaram', at: W(24, 'కాళేశ్వరం') - 6, credit: 'Karthik Rose Vlogs / YouTube · CC BY'},
		]}>
			<Say text="ప్రాణహిత · మహారాష్ట్ర–తెలంగాణ బోర్డర్" at={S(24) + 6} until={W(24, 'కాళేశ్వరం') - 6} y={920} size={50} />
			<Say text="కాళేశ్వరం · గోదావరి ఒడ్డు (2025)" at={W(24, 'కాళేశ్వరం')} until={W(24, 'ట్వెంటీ') - 4} y={920} size={50} />
		</Reel>
		{/* s29: opened in June 2019: the Lakshmi pump house's first water, beside the barrage */}
		<Reel from={S(29)} to={S(30)} label="లక్ష్మి (మేడిగడ్డ) పంప్ హౌస్ · మొదటి పంపింగ్, 21 జూన్ 2019" cuts={[{clip: 'first_pumping', at: S(29), credit: MEIL}]}>
			<Say text="ఓపెన్: జూన్ 2019" at={S(29)} until={S(30)} y={920} size={60} color={C.ink} bg={C.yellow} />
		</Reel>
		{/* s114: a bore filled with concrete makes one pile */}
		<Reel from={W(114, 'బోర్') - 6} to={S(116)} label="ILLUSTRATIVE FOOTAGE · వేరే ప్రాజెక్ట్‌లో పైల్ రిగ్ (ఒమన్)" cuts={[
			{clip: 'auger', at: W(114, 'బోర్') - 6, credit: 'PROFESSIONAL CIVIL ENGINEERING / YouTube · CC BY'},
			{clip: 'rig', at: W(114, 'కాంక్రీట్') - 4, rate: 0.7, credit: 'PROFESSIONAL CIVIL ENGINEERING / YouTube · CC BY'},
		]}>
			<Say text="బోర్ వేసి · కాంక్రీట్ నింపితే: ఒక పైల్" at={W(114, 'బోర్')} until={S(116)} y={920} size={52} />
		</Reel>
		{/* s138: before a barrage, bores are drilled to see the ground */}
		<Reel from={S(138)} to={S(139)} label="ILLUSTRATIVE FOOTAGE · వేరే ప్రాజెక్ట్‌లో బోర్ (ఒమన్)" cuts={[{clip: 'auger', at: S(138), startAt: 120, credit: 'PROFESSIONAL CIVIL ENGINEERING / YouTube · CC BY'}]}>
			<Say text="బోర్లు వేసి, కింద నేలని చూస్తారు" at={S(138) + 6} until={S(139)} y={920} size={52} />
		</Reel>
		{/* s156-s158: opened, gates down, water held */}
		<Reel from={S(156)} to={S(159)} label="ILLUSTRATIVE FOOTAGE · గోదావరి మీద బ్యారేజీలు (MEIL)" cuts={[
			{clip: 'gates_down', at: S(156), credit: MEIL},
			{clip: 'water_held', at: S(158) - 4, credit: MEIL},
		]}>
			<Say text="2019" at={S(156)} until={S(159)} x={150} y={150} align="left" size={120} font={F.num} color={C.yellow} />
			<Say text="ఓపెన్ అయింది" at={S(156)} until={S(157)} y={930} size={54} />
			<Say text="గేట్లు దించారు" at={S(157)} until={S(158)} y={930} size={54} />
			<Say text="నీళ్ళు నిలబడ్డాయి" at={S(158)} until={S(159)} y={930} size={54} />
		</Reel>
		{/* s165: lift a gate a little and the water shoots out from the bottom */}
		<Reel from={S(165)} to={S(166)} label="ILLUSTRATIVE FOOTAGE · గోదావరి మీద వేరే బ్యారేజ్ (MEIL)" cuts={[{clip: 'gate_jet', at: S(165), rate: 0.72, credit: MEIL}]}>
			<Say text="గేట్ కింద నుంచి: బుల్లెట్ లాగా" at={W(165, 'బుల్లెట్') - 6} until={S(166)} y={920} size={58} color={C.white} bg={C.orange} />
		</Reel>
		{/* s292: today, when a flood comes, the gates are lifted and the water let go */}
		<Reel from={S(292)} to={S(293)} label="ILLUSTRATIVE FOOTAGE · వేరే బ్యారేజ్ (MEIL)" cuts={[{clip: 'release', at: S(292), credit: MEIL}]}>
			<Say text="వరద వస్తే: గేట్లు ఎత్తి కిందికి" at={S(292)} until={S(293)} y={920} size={54} />
		</Reel>
		{/* s313-s315: the diaphragm wall Andhra knows from Polavaram */}
		<Reel from={S(313)} to={S(316)} label="పోలవరం · డయాఫ్రమ్ వాల్ పనులు (MEIL, 2024)" cuts={[
			{clip: 'dwall_works', at: S(313), rate: 0.95, credit: MEIL},
			{clip: 'dwall_grab', at: S(315) - 4, rate: 0.55, credit: MEIL},
		]}>
			<Say text="1. DIAPHRAGM WALL" at={S(313)} until={S(316)} y={160} size={60} color={C.ink} bg={C.yellow} font={F.num} />
			<Say text="నేలలోకి పోసే కాంక్రీట్ గోడ" at={S(315)} until={S(316)} y={920} size={54} />
		</Reel>
		{/* s333: this much work in three barrages in one working season */}
		<Reel from={S(333)} to={S(334)} label="ILLUSTRATIVE FOOTAGE · లక్ష్మి పంప్ హౌస్ నిర్మాణం, 2018 (MEIL)" cuts={[{clip: 'construction', at: S(333), rate: 0.9, credit: MEIL}]}>
			<Say text="మూడు బ్యారేజీల్లో ఇంత పని: ఒకే ఒక్క వర్కింగ్ సీజన్ లో" at={S(333)} until={S(334)} y={920} size={48} />
		</Reel>
		{/* s343-s344: we see the gates, we see the water */}
		<Reel from={S(343)} to={S(345)} label="ILLUSTRATIVE FOOTAGE (MEIL)" cuts={[
			{clip: 'see_gates', at: S(343), credit: MEIL},
			{clip: 'see_water', at: S(344) - 4, credit: MEIL},
		]}>
			<Say text="గేట్లు చూస్తాం" at={S(343)} until={S(344)} y={920} size={60} />
			<Say text="నీళ్ళు చూస్తాం" at={S(344)} until={S(345)} y={920} size={60} />
		</Reel>
		{/* s348: on the Godavari or the Krishna */}
		<Reel from={S(348)} to={S(349)} label="గోదావరి (MEIL)" cuts={[{clip: 'godavari_air', at: S(348), rate: 0.8, credit: MEIL}]}>
			<Say text="గోదావరి మీదైనా · కృష్ణ మీదైనా" at={S(348)} until={S(349)} y={170} size={56} />
		</Reel>
		{/* s351, s353: the next film is under the ground too */}
		<Reel from={S(351)} to={S(352)} label="ILLUSTRATIVE FOOTAGE · వేరే టన్నెల్ (MEIL)" cuts={[{clip: 'tunnel_crew', at: S(351), rate: 0.8, credit: MEIL}]}>
			<Say text="నెక్స్ట్ వీడియో కూడా భూమి కిందే" at={S(351)} until={S(352)} y={160} size={56} />
		</Reel>
		<Reel from={S(353)} to={S(354)} label="ILLUSTRATIVE FOOTAGE · వేరే టన్నెల్ (MEIL)" cuts={[{clip: 'tunnel_deep', at: S(353), rate: 0.8, credit: MEIL}]}>
			<Say text="కొండ లోపల ఏముంది?" at={S(353)} until={S(354)} y={920} size={64} color={C.ink} bg={C.yellow} />
		</Reel>
	</>
);
