import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame} from 'remotion';
import {DocPage, Honesty, Line, Paper, Photo, Plate, Ring, Roll, Say, Sheet, Shot, Source, Tag, clamp, inr, lerp, ramp} from './kit';
import {Stairs} from './chB';
import {Quote} from './chD';
import {S, W, an, hero} from './t';
import {C, F} from './theme';

const FR = 'h1_front';
const CAG = 'CAG పర్ఫార్మెన్స్ ఆడిట్ · కాళేశ్వరం ప్రాజెక్ట్ · ఎగ్జిక్యూటివ్ సమ్మరీ';
const Coin: React.FC<{x: number; y: number; r: number; label: string; k?: number}> = ({x, y, r, label, k = 1}) => (
	<g transform={`translate(${x} ${y})`}>
		<path d={`M0 0 L0 ${-r} A${r} ${r} 0 ${k > 0.5 ? 1 : 0} 1 ${r * Math.sin(k * 2 * Math.PI)} ${-r * Math.cos(k * 2 * Math.PI)} Z`} fill="#D9A520" stroke={C.ink} strokeWidth={6} />
		{k >= 0.999 ? <circle r={r} fill="#D9A520" stroke={C.ink} strokeWidth={6} /> : <circle r={r} fill="none" stroke={C.ink} strokeWidth={4} strokeDasharray="10 10" />}
		<text textAnchor="middle" y={r * 0.2} fontFamily="Inter Tight" fontWeight={800} fontSize={r * 0.6} fill={C.ink}>{label}</text>
	</g>
);
const Box: React.FC<{x: number; text: string; at: number; done?: boolean}> = ({x, text, at}) => {
	const f = useCurrentFrame();
	const t = ramp(f, at, 10);
	return (
		<div style={{position: 'absolute', left: x, top: 380, width: 500, height: 330, transform: `translateY(${(1 - t) * 40}px)`, opacity: t, background: '#FBF6E9', borderRadius: 10, boxShadow: '0 18px 36px rgba(40,20,0,0.35)', padding: 30, boxSizing: 'border-box', fontFamily: F.te, color: C.ink}}>
			<div style={{width: 70, height: 70, border: `6px solid ${C.ink}`, borderRadius: 8}} />
			<div style={{fontWeight: 700, fontSize: 44, lineHeight: 1.35, marginTop: 20}}>{text}</div>
		</div>
	);
};

/** s269-s358: the money, today, the saying, the close. */
export const ChG: React.FC = () => {
	const f = useCurrentFrame();
	const paise = interpolate(f, [W(279, 'ఫిఫ్టీ') - 20, W(279, 'పైసలు')], [1.5, 0.52], clamp);
	const cost = interpolate(f, [W(323, 'ట్వెంటీ', 1) - 20, W(323, 'కోట్లు'), W(324, 'ఫోర్') - 16, W(324, 'కోట్లకు')], [0, 2500, 2500, 4193], clamp);
	const pinX = lerp(272, 468, ramp(f, W(331, 'డిసెంబర్') - 14, 18));
	return (
		<>
			{/* 269-271: the first step carries a big sum */}
			<Shot from={S(269)} to={S(272)}>
				<Paper>
					<Stairs from={S(269)} lit={[S(269), S(269), S(269), S(269)]} x={330} y={900} k={0.9} />
					<Say text="ఇప్పుడు డబ్బు" at={S(269)} until={S(271)} y={170} size={72} color={C.ink} bg={C.yellow} />
					<Say text="ఈ మొదటి మెట్టు మీద: చాలా పెద్ద లెక్క" at={W(271, 'మొదటి')} y={170} size={56} />
					<Say text="₹" at={W(271, 'పెద్ద')} x={480} y={640} size={150} color={C.ink} bg={C.yellow} font={F.num} />
				</Paper>
			</Shot>
			{/* 272-279: CAG: 81,911 told, 1,47,427 likely; 1.50 claimed, 0.52 found */}
			<Shot from={S(272)} to={S(277)}>
				<DocPage src="docs/cag-1.png" from={S(272)} to={S(277)} box={[0.202, 0.137, 0.666, 0.036]} hl={W(275, 'ఖర్చు') - 10} zoom={[0.9, 2.0]} />
				<Say text="CAG ఆడిట్ రిపోర్ట్ · ఫిబ్రవరి 2024 లో అసెంబ్లీకి" at={W(272, 'కాగ్')} until={S(275)} y={140} size={46} />
				<Say text="లెక్కలు: మార్చ్ 2022 వరకే (కుంగడానికి ముందువి)" at={S(273)} until={S(275)} y={230} size={42} />
				<Roll to={81911} start={W(275, 'ఎయిటీ') - 18} land={W(275, 'కోట్లు')} until={S(277)} x={520} y={900} size={84} prefix="₹" suffix=" కోట్లు" />
				<Say text="CWC కి చెప్పిన ఖర్చు" at={W(275, 'చెప్పిన')} until={S(277)} x={520} y={800} size={40} />
				<Roll from={81911} to={147427} start={W(276, 'వన్') - 18} land={W(276, 'కోట్లు')} until={S(277)} x={1400} y={900} size={84} prefix="₹" suffix=" కోట్లు" color={C.white} bg={C.orange} />
				<Say text="CAG అంచనా: దాటొచ్చు" at={S(276)} until={S(277)} x={1400} y={800} size={40} />
				<Source text={CAG} from={S(272) + 10} to={S(277)} />
			</Shot>
			<Shot from={S(277)} to={S(280)}>
				<DocPage src="docs/cag-1.png" from={S(277)} to={S(280)} box={[0.231, 0.354, 0.638, 0.036]} hl={W(279, 'కాగ్')} zoom={[1.5, 2.0]} />
				<AbsoluteFill style={{background: 'rgba(23,17,10,0.35)'}} />
				<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
					<Coin x={520} y={640} r={120} label="₹1" />
					<path d="M700 640 L860 640 m-30 -24 l34 24 l-34 24" stroke={C.white} strokeWidth={10} fill="none" strokeLinecap="round" />
					{f < W(279, 'ఫిఫ్టీ') - 20 ? (
						<g opacity={ramp(f, W(278, 'రూపాయిన్నర') - 10, 10)}><Coin x={1080} y={640} r={120} label="₹1" /><Coin x={1340} y={640} r={120} label="50p" k={0.5} /></g>
					) : (
						<Coin x={1140} y={640} r={120} label={`${Math.round(Math.min(paise, 1.5) * 100)}p`} k={Math.min(1, paise)} />
					)}
				</svg>
				<Say text="ఒక రూపాయి పెడితే ఎంత తిరిగి వస్తుంది?" at={S(277)} y={150} size={54} />
				<Say text="ప్రాజెక్ట్ రిపోర్ట్: ₹1.50" at={W(278, 'రూపాయిన్నర') - 10} until={W(279, 'ఫిఫ్టీ') - 20} x={1200} y={880} size={56} />
				<Say text="CAG లెక్క: 52 పైసలు" at={W(279, 'ఫిఫ్టీ')} x={1200} y={880} size={64} color={C.white} bg={C.orange} />
				<Source text={CAG} from={S(277)} to={S(280)} />
			</Shot>
			{/* 280-288: to the farmer's acre */}
			<Shot from={S(280)} to={S(289)}>
				<AbsoluteFill>
					<Photo src="photos/paddy.jpg" from={S(280)} to={S(289)} credit="Wikimedia Commons · CC BY-SA 3.0" zoom={[1.05, 1.22]} pan={[30, -20, -40, 10]} />
					<AbsoluteFill style={{background: 'linear-gradient(90deg, transparent 35%, rgba(23,17,10,0.72) 62%)'}} />
					<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
						<g transform={`translate(120 ${520 - 0.02 * (f - S(280))}) scale(${0.92 + 0.0002 * (f - S(280))})`}>
							<path d="M0 300 L260 0 L900 0 L760 300 Z" fill="none" stroke={C.yellow} strokeWidth={9} strokeDasharray={2600} strokeDashoffset={2600 * (1 - ramp(f, W(281, 'ఎకరానికి') - 30, 30))} />
							<path d="M-40 330 L60 330" stroke={C.blue} strokeWidth={16} strokeLinecap="round" strokeDasharray="20 12" strokeDashoffset={-f * 1.5} />
						</g>
					</svg>
					<Say text="ఒక ఎకరం" at={W(281, 'ఎకరానికి') - 20} until={S(289)} x={520} y={900} size={46} color={C.ink} bg={C.yellow} />
					<Roll to={46364} start={W(281, 'ఫార్టీ') - 20} land={W(281, 'రూపాయలు')} until={S(289)} x={1380} y={330} size={120} prefix="₹" color={C.ink} bg={C.yellow} />
					<Say text="ప్రతి ఏడాది · ప్రతి ఎకరానికి" at={W(281, 'ప్రతి')} until={S(289)} x={1380} y={210} size={46} />
					<Say text="కరెంట్ + మెయింటెనెన్స్" at={W(281, 'కరెంట్')} until={S(289)} x={1380} y={450} size={42} />
					<Say text="ఇది రైతు కట్టాలా? కాదు" at={S(282)} until={S(285)} x={1380} y={590} size={52} />
					<Say text="నీటి పన్ను వేసే ఆలోచన లేదు" at={S(284)} until={S(285)} x={1380} y={690} size={44} />
					<Say text="ఖర్చు మొత్తం గవర్నమెంట్ మీద" at={S(285)} until={S(287)} x={1380} y={590} size={48} />
					<Say text="అంటే మన అందరి మీద" at={S(286)} until={S(287)} x={1380} y={690} size={56} color={C.white} bg={C.orange} />
					<Say text="తేల్చేది: పొలానికి నీళ్ళు చేరిన రోజే" at={W(287, 'పంపులు') - 20} until={S(288)} x={1380} y={640} size={46} />
					<Say text="ముందు మొదటి మెట్టు నిలబడాలి" at={W(288, 'మొదటి')} x={1380} y={640} size={52} color={C.ink} bg={C.yellow} />
				</AbsoluteFill>
				<Source text={`${CAG} · ₹46,364`} from={S(281)} to={S(289)} />
			</Shot>
			{/* 289-303: today; can water be lifted meanwhile */}
			<Shot from={S(289)} to={S(294)}>
				<Plate layers={[{src: 'sat/s2_2022-11-19.jpg', at: S(289)}, {src: 'sat/s2_2025-02-21.jpg', at: S(291) - 6, fade: 40}]} cam={[{f: S(289), s: 1.15, x: 0.42, y: 0.4}, {f: S(294), s: 1.55, x: 0.36, y: 0.34}]}>
					<Tag p={[0.4, 0.34]} text="మేడిగడ్డ బ్యారేజ్" at={S(289) + 6} until={S(294)} dx={150} dy={-110} size={44} />
				</Plate>
				<Say text={f < S(291) + 10 ? 'నవంబర్ 2022' : 'ఫిబ్రవరి 2025'} at={S(289) + 4} until={S(294)} x={1770} y={240} align="right" size={60} color={C.yellow} />
				<Say text="ఈ రోజు మేడిగడ్డ ఎక్కడ ఉంది?" at={S(289)} until={S(290)} y={150} size={60} color={C.ink} bg={C.yellow} />
				<Say text="కుంగి 3 ఏళ్ళు దాటింది" at={S(290)} until={S(294)} x={420} y={170} size={54} />
				<Say text="నీళ్ళు నిలవ చెయ్యడం లేదు · గేట్లు ఎత్తే ఉంచారు" at={S(291)} until={S(293)} y={930} size={48} />
				<Say text="కన్నేపల్లి పంప్ హౌస్: అక్టోబర్ 2023 నుంచి ఖాళీ" at={S(293)} until={S(294)} y={930} size={50} color={C.white} bg={C.orange} />
				<Source text="శాటిలైట్: Copernicus Sentinel-2 · Telangana Today" from={S(289) + 6} to={S(294)} />
			</Shot>
			<Shot from={S(294)} to={S(304)}>
				<Paper>
					<Say text="ఈలోపు నీళ్ళు ఎత్తలేరా?" at={S(295)} y={150} size={68} color={C.ink} bg={C.yellow} />
					<Sheet at={S(296)} x={520} y={560} w={800} h={520} rot={-1.6}>
						<Line text="హరీష్ రావు · కొంతమంది రిటైర్డ్ ఇంజనీర్లు" at={S(296) + 4} size={34} color={C.inkSoft} />
						<Line text="ఎత్తొచ్చు" at={W(296, 'ఎత్తొచ్చు')} hl={W(296, 'ఎత్తొచ్చు') + 4} size={64} weight={700} />
						<Line text="నాకు మూడు నెలలు ఇరిగేషన్ డిపార్ట్మెంట్ ఇవ్వండి, చూపిస్తాను" at={S(297)} size={38} />
						<Line text="పంపులు నడపొచ్చు" at={S(298)} size={38} />
					</Sheet>
					<Sheet at={S(299)} x={1400} y={560} w={800} h={520} rot={1.6}>
						<Line text="గవర్నమెంట్ జవాబు" at={S(299) + 4} size={34} color={C.inkSoft} />
						<Line text="ఇప్పుడు కుదరదు" at={W(301, 'కుదరదు') - 20} hl={W(301, 'కుదరదు') - 14} size={64} weight={700} />
						<Line text="సేఫ్టీ కోసం గేట్లు తెరిచే ఉంచాలి" at={S(300)} size={38} />
						<Line text="రిపేర్ పూర్తయ్యే వరకు టెక్నికల్ గా కుదరదు" at={S(301)} size={38} />
					</Sheet>
				</Paper>
				<Source text="Deccan Chronicle (8 జులై 2026) · Telangana Today (5 నవంబర్ 2026)" from={S(296)} to={S(304)} />
			</Shot>
			<Shot from={S(302)} to={S(304)} x={10}>
				<DocPage src="docs/ndsa-3.png" from={S(302)} to={S(304)} box={[0.2, 0.186, 0.69, 0.05]} hl={S(303)} aspect={0.702} zoom={[1.0, 1.75]} />
				<Say text="ఈ స్థితిలో నీళ్ళు నింపితే బ్యారేజ్ ఇంకా దెబ్బ తింటుంది" at={S(303)} y={930} size={48} color={C.ink} bg={C.yellow} />
				<Source text="NDSA కమిటీ రిపోర్ట్ · 1 నవంబర్ 2023 · అసలు పేజీ" from={S(302) + 6} to={S(304)} />
			</Shot>
			{/* 304-310: why three years */}
			<Shot from={S(304)} to={S(311)}>
				<Paper>
					<Say text="రిపేర్ మొదలవడానికి మూడేళ్ళు ఎందుకు?" at={S(304)} y={150} size={58} color={C.ink} bg={C.yellow} />
					<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
						<line x1={200} y1={520} x2={1720} y2={520} stroke={C.inkSoft} strokeWidth={10} strokeLinecap="round" />
						<line x1={200} y1={520} x2={200 + 1520 * interpolate(f, [S(304), S(305), S(306), W(309, 'టూ') - 4, S(311)], [0, 0.02, 0.48, 0.64, 1], clamp)} y2={520} stroke={C.orange} strokeWidth={14} strokeLinecap="round" />
						{[[200, 'అక్టోబర్ 2023', 'కుంగింది', S(304)], [930, 'ఏప్రిల్ 2025', 'ఫైనల్ రిపోర్ట్', W(305, 'ఏడాదిన్నర') - 10], [1173, 'అక్టోబర్ 2025', 'కన్సల్టెంట్లని పిలిచారు', W(309, 'కన్సల్టెంట్లని') - 4], [1720, 'డిసెంబర్ 2026', 'పనుల టార్గెట్', S(310) + 20]].map(([x, d, n, at], i) => (
							<g key={i} opacity={ramp(f, at as number, 8)}>
								<circle cx={x as number} cy={520} r={18} fill={C.ink} />
								<text x={x as number} y={i % 2 ? 620 : 460} textAnchor="middle" fontFamily="Noto Sans Telugu" fontWeight={700} fontSize={38} fill={C.ink}>{d}</text>
								<text x={x as number} y={i % 2 ? 670 : 410} textAnchor="middle" fontFamily="Noto Sans Telugu" fontWeight={500} fontSize={32} fill={C.inkSoft}>{n}</text>
							</g>
						))}
					</svg>
					<Say text="2024 వర్షాకాలానికి ముందు చెయ్యమన్న తాత్కాలిక పనులు: పూర్తిగా జరగలేదు" at={S(307)} until={S(309)} y={820} size={42} />
					<Say text="డిపార్ట్మెంట్ ఇంకా వేగంగా కదలాలి" at={S(308)} until={S(309)} y={920} size={46} color={C.white} bg={C.orange} />
					<Say text="అంటే కుంగిన రెండేళ్ళకి" at={S(310)} y={860} size={54} color={C.ink} bg={C.yellow} />
				</Paper>
				<Source text="NDSA ఫైనల్ రిపోర్ట్ పై వార్తలు (Siasat, Deccan Chronicle) · Telangana Today" from={S(305)} to={S(311)} />
			</Shot>
			{/* 311-318: the repair: a diaphragm wall, a longer floor */}
			<Shot from={S(311)} to={S(316)}>
				<Plate layers={[{src: hero('h2_piles_gap'), at: S(311)}, {src: hero('h2_piles_dwall'), at: W(315, 'కాంక్రీట్') - 16, fade: 26}]} cam={[{f: S(311), s: 1.15, x: 0.5, y: 0.5}, {f: S(314), s: 1.5, x: 0.5, y: 0.47}, {f: S(316), s: 1.3, x: 0.5, y: 0.5}]} />
				<Say text="రిపేర్ ప్లాన్: రెండు పెద్ద పనులు" at={S(311)} until={S(312)} y={150} size={54} />
				<Say text="1. DIAPHRAGM WALL" at={S(312)} until={S(316)} y={150} size={76} font={F.num} color={C.ink} bg={C.yellow} />
				<Say text="పోలవరం వల్ల అందరికీ తెలిసిన మాట" at={S(313)} until={S(314)} y={940} size={48} />
				<Say text="పెన్సిళ్ళ గోడ కాదు" at={S(314)} until={S(315)} y={940} size={56} />
				<Say text="నేలలోకి పోసే కాంక్రీట్ గోడ" at={S(315)} until={S(316)} y={940} size={56} color={C.ink} bg={C.yellow} />
				<Source text="వార్తల ప్రకారం: Telangana Today (అక్టోబర్ 2026)" from={S(311) + 10} to={S(316)} />
				<Honesty text="ILLUSTRATION" from={S(311)} to={S(316)} />
			</Shot>
			<Shot from={S(316)} to={S(322)}>
				<Plate layers={[{src: hero('h1_front_open'), at: S(316)}, {src: hero('h1_front_repaired'), at: W(316, 'పొడిగించడం') - 50, fade: 40}, {src: hero('h1_front_settled'), at: S(319), fade: 16}]} cam={[{f: S(316), s: 1.5, x: 0.7, y: 0.56}, {f: S(318), s: 1.25, x: 0.6, y: 0.58}, {f: S(319), s: 1.3, x: 0.52, y: 0.55}, {f: S(322), s: 1.7, x: 0.5, y: 0.5}]}>
					<Tag p={an(FR, 'ext_end', -0.08, 0)} text="60 మీ. వరకు" at={W(316, 'సిక్స్టీ')} until={S(319)} dx={-20} dy={-170} size={48} />
					<Ring p={an(FR, 'ds_rock', 0, -0.06)} at={S(318)} until={S(319)} r={70} />
					<Ring p={an(FR, 'apron_end', 0.07, 0)} at={S(318)} until={S(319)} r={80} />
					<Ring p={an(FR, 'pier_mid')} at={S(319)} until={S(322)} r={150} color={C.orange} />
				</Plate>
				<Say text="2. గేట్ల కింద వైపు కాంక్రీట్ నేల పొడిగింపు" at={S(316)} until={S(318)} y={150} size={50} color={C.ink} bg={C.yellow} />
				<Say text="రిపోర్ట్ చూపించిన రెండు బలహీనతలకే: ఈ రెండు మందులు" at={S(318)} until={S(319)} y={940} size={46} />
				<Say text="బ్లాక్ 7: ఇంకా తేలలేదు" at={S(319)} until={S(322)} y={150} size={60} color={C.white} bg={C.orange} />
				<Say text="బలపరచాలా?" at={W(320, 'బలపరచాలా')} until={S(321)} x={520} y={940} size={52} />
				<Say text="పగలగొట్టి మళ్ళీ కట్టాలా?" at={W(320, 'పగలగొట్టి')} until={S(321)} x={1380} y={940} size={52} />
				<Say text="పక్క బ్లాక్స్ కి దెబ్బ తగలకూడదు: NDSA హెచ్చరిక" at={S(321)} until={S(322)} y={940} size={46} />
				<Source text="వార్తల ప్రకారం: Telangana Today (అక్టోబర్ 2026)" from={S(316) + 10} to={S(322)} />
				<Honesty text="ILLUSTRATION · స్కేల్ ప్రకారం కాదు" from={S(316)} to={S(322)} />
			</Shot>
			{/* 322-334: cost, who pays, the dates */}
			<Shot from={S(322)} to={S(330)}>
				<Paper>
					<Say text="ఖర్చు? (మూడు బ్యారేజీలకి కలిపి)" at={S(322)} until={S(325)} y={170} size={54} />
					<div style={{position: 'absolute', left: 960, top: 420, transform: 'translate(-50%,-50%)', fontFamily: F.num, fontWeight: 800, fontSize: 170, color: C.ink, opacity: ramp(f, W(323, 'ట్వెంటీ', 1) - 20, 8) * (1 - ramp(f, S(325) - 6, 8)), fontVariantNumeric: 'tabular-nums', whiteSpace: 'nowrap'}}>
						₹{inr(cost)} <span style={{fontFamily: F.te, fontSize: 80}}>కోట్లు</span>
					</div>
					<Say text="అక్టోబర్ 2026 వార్త: దాదాపు ₹2,500 కోట్లు" at={W(323, 'ట్వెంటీ', 1)} until={S(325)} x={560} y={640} size={42} />
					<Say text="నవంబర్ మొదటి వారం: ₹4,000 కోట్లకు పైన" at={S(324)} until={S(325)} x={1380} y={640} size={42} color={C.white} bg={C.orange} />
					{f >= S(325) ? (
						<>
							<Say text="ఎవరు కట్టాలి?" at={S(325)} y={170} size={60} color={C.ink} bg={C.yellow} />
							<Sheet at={S(326)} x={540} y={520} w={760} h={330} rot={-1.6}>
								<Line text="కట్టడంలో లోపాలకి" at={S(326) + 4} size={40} color={C.inkSoft} />
								<Line text="కంపెనీలు" at={W(326, 'కంపెనీలు')} hl={W(326, 'కంపెనీలు') + 4} size={64} weight={700} />
							</Sheet>
							<Sheet at={S(327)} x={1380} y={520} w={760} h={330} rot={1.6}>
								<Line text="అదనపు పనులకి" at={S(327) + 4} size={40} color={C.inkSoft} />
								<Line text="గవర్నమెంట్" at={W(327, 'గవర్నమెంట్')} hl={W(327, 'గవర్నమెంట్') + 4} size={64} weight={700} />
							</Sheet>
							<Say text="ఇది గవర్నమెంట్ చెప్తున్న మాట" at={S(328)} y={770} size={42} />
							<Say text="కంపెనీలు: ముందు మా పాత బిల్లులు క్లియర్ చెయ్యండి" at={S(329)} y={900} size={48} color={C.white} bg={C.orange} />
						</>
					) : null}
				</Paper>
				<Source text="Telangana Today (8 అక్టోబర్, 5 నవంబర్ 2026)" from={S(322) + 10} to={S(330)} />
			</Shot>
			<Shot from={S(330)} to={S(335)}>
				<Paper>
					<div style={{position: 'absolute', left: 180, top: 380, display: 'flex', gap: 12}}>
						{['నవం', 'డిసెం', 'జన', 'ఫిబ్ర', 'మార్చ్', 'ఏప్రి', 'మే', 'జూన్'].map((m, i) => (
							<div key={m} style={{width: 184, height: 200, background: i >= 1 && f >= W(333, 'ఒకే') - 10 ? C.yellow : '#FBF6E9', border: `5px solid ${C.ink}`, borderRadius: 8, boxSizing: 'border-box', opacity: ramp(f, S(330) + i * 3, 8), textAlign: 'center', fontFamily: F.te, fontWeight: 700, fontSize: 44, color: C.ink, paddingTop: 20}}>
								{m}
								<div style={{fontFamily: F.num, fontSize: 34, color: C.inkSoft}}>{i < 2 ? '2026' : '2027'}</div>
							</div>
						))}
					</div>
					<div style={{position: 'absolute', left: pinX - 25, top: 310, width: 50, height: 50, borderRadius: 25, background: C.red, border: `5px solid ${C.ink}`, boxSizing: 'border-box'}} />
					<div style={{position: 'absolute', left: pinX - 120, top: 250, width: 240, textAlign: 'center', fontFamily: F.te, fontWeight: 700, fontSize: 34, color: C.red}}>పనులు మొదలు</div>
					<div style={{position: 'absolute', left: 1644 - 25, top: 310, width: 50, height: 50, borderRadius: 25, background: C.blue, border: `5px solid ${C.ink}`, boxSizing: 'border-box', opacity: ramp(f, W(332, 'జూన్') - 6, 8)}} />
					<Say text="ముందు చెప్పింది: నవంబర్ మధ్యలో" at={S(330)} until={S(331)} y={170} size={50} />
					<Say text="5 నవంబర్ 2026 · ముఖ్యమంత్రి రేవంత్ రెడ్డి రివ్యూ: డిసెంబర్ లో మొదలు" at={S(331)} until={S(332)} y={170} size={44} />
					<Say text="టార్గెట్: జూన్ 2027" at={W(332, 'జూన్') - 6} until={S(335)} y={170} size={64} color={C.ink} bg={C.yellow} />
					<Say text="మూడు బ్యారేజీల్లో ఇంత పని: ఒకే ఒక్క వర్కింగ్ సీజన్ లో" at={S(333)} until={S(334)} y={760} size={48} />
					<Say text="ఇది చిన్న టార్గెట్ కాదు" at={S(334)} y={760} size={58} color={C.white} bg={C.orange} />
				</Paper>
				<Source text="Telangana Today (5 నవంబర్ 2026) · NewsMeter" from={S(330) + 10} to={S(335)} />
			</Shot>
			{/* 335-339: three things to watch */}
			<Shot from={S(335)} to={S(340)}>
				<Paper>
					<Say text="ఇకమీదట మేడిగడ్డ వార్త వచ్చినప్పుడు: మూడు విషయాలు" at={S(335)} y={190} size={52} color={C.ink} bg={C.yellow} />
					<Box x={170} text="డిసెంబర్ లో పనులు నిజంగా మొదలయ్యాయా?" at={S(336)} />
					<Box x={710} text="బ్లాక్ 7 మీద నిర్ణయం వచ్చిందా?" at={S(337)} />
					<Box x={1250} text="జూన్ 2027 కి కన్నేపల్లి పంపులు తిరిగాయా?" at={S(338)} />
					<Say text="ఈ మూడూ జరిగితే: మొదటి మెట్టు మళ్ళీ నిలబడినట్టు" at={S(339)} y={860} size={54} />
				</Paper>
			</Shot>
			{/* 340-349: the saying */}
			<Shot from={S(340)} to={S(350)}>
				<Plate layers={[{src: hero('h1_front_water'), at: S(340)}, {src: hero('h1_front_void2'), at: S(342) - 6, fade: 24}, {src: hero('h3_plan_6'), at: W(346, 'ఎయిటీ') - 14, fade: 20}, {src: hero('h1_front_rockwall'), at: S(347), fade: 20}]} cam={[{f: S(340), s: 1.2, x: 0.5, y: 0.42}, {f: S(342), s: 1.5, x: 0.5, y: 0.44}, {f: S(343), s: 1.9, x: 0.52, y: 0.66}, {f: W(346, 'ఎయిటీ') - 14, s: 1.6, x: 0.5, y: 0.56}, {f: W(346, 'ఎయిటీ') + 10, s: 1.15, x: 0.5, y: 0.5}, {f: S(347), s: 1.3, x: 0.5, y: 0.5}, {f: S(349), s: 1.5, x: 0.5, y: 0.7}, {f: S(350), s: 2.2, x: 0.5, y: 0.76}]} />
				<AbsoluteFill style={{background: 'linear-gradient(180deg, rgba(10,6,2,0.85) 0%, rgba(10,6,2,0.85) 52%, transparent 62%)', opacity: ramp(f, S(342) - 4, 16) * (1 - ramp(f, S(343), 20))}} />
				<Say text="కట్టడం కనిపించేది పైన" at={S(341)} until={S(346)} y={170} size={76} color={C.white} />
				<Say text="నిలబడేది కింద" at={S(342)} until={S(346)} y={300} size={92} color={C.ink} bg={C.yellow} />
				<Say text="85 బోర్లు వెయ్యాల్సిన చోట 6" at={W(346, 'ఎయిటీ')} until={S(347)} y={170} size={72} color={C.white} bg={C.orange} />
				<Say text="ఇది తెలంగాణ ఒక్కదాని పాఠం కాదు" at={S(347)} until={S(348)} y={170} size={56} />
				<Say text="గోదావరి మీదైనా · కృష్ణ మీదైనా" at={S(348)} until={S(349)} y={170} size={56} />
				<Say text="కింద నేలని ఎంత చూశారు?" at={S(349)} y={300} size={96} color={C.ink} bg={C.yellow} />
				<Honesty text="ILLUSTRATION" from={S(340)} to={S(350)} />
			</Shot>
			{/* 350-358: the close */}
			<Shot from={S(350)} to={1e9}>
				<Paper>
					<Say text="సబ్స్క్రైబ్ చేసుకోండి" at={W(350, 'ఛానల్')} until={S(351)} y={480} size={84} color={C.white} bg={C.red} />
					<Say text="రిపోర్ట్ పేజీలతో సహా · గొడవ లేకుండా" at={S(350)} until={S(351)} y={320} size={52} />
					{f >= S(351) && f < S(354) ? (
						<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0, opacity: ramp(f, S(351), 10)}}>
							<path d="M200 760 Q600 300 1000 420 Q1400 250 1760 760 Z" fill="#8B7A5C" stroke={C.ink} strokeWidth={7} />
							<path d={`M260 720 L${260 + 900 * ramp(f, S(352), 60)} 720`} stroke={C.night} strokeWidth={46} strokeLinecap="round" />
							<circle cx={260 + 900 * ramp(f, S(352), 60)} cy={720} r={30} fill={C.orange} opacity={ramp(f, W(352, 'పైకప్పు') - 6, 8)} />
						</svg>
					) : null}
					<Say text="నెక్స్ట్ వీడియో కూడా భూమి కిందే" at={S(351)} until={S(354)} y={160} size={56} />
					<Say text="SLBC టన్నెల్ · దాదాపు 14 కి.మీ. లోపల" at={S(352)} until={S(354)} y={880} size={50} />
					<Say text="కొండ లోపల ఏముంది?" at={S(353)} until={S(354)} y={980} size={60} color={C.ink} bg={C.yellow} />
					<Say text="మీ ఊరి దగ్గర ఏ ప్రాజెక్ట్ కింద ఏం జరిగిందో మేం చూడాలి?" at={S(355)} until={S(357)} y={440} size={52} w={1400} />
					<Say text="కింద కామెంట్ లో రాయండి" at={S(356)} until={S(357)} y={640} size={60} color={C.ink} bg={C.yellow} />
					<Say text="Be Practical with Kishore" at={S(357)} y={440} size={110} font={F.num} color={C.ink} bg={null} weight={800} />
					<Say text="తెలుగు" at={S(357) + 8} y={570} size={64} color={C.white} bg={C.ink} />
					<Say text="ప్రాక్టికల్ గా ఉందాం" at={S(358)} y={720} size={72} color={C.ink} bg={C.yellow} />
				</Paper>
			</Shot>
		</>
	);
};
void Quote; void Tag;
