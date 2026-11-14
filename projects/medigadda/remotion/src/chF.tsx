import React from 'react';
import {useCurrentFrame} from 'remotion';
import {DocPage, Line, Paper, Photo, Roll, Say, Sheet, Shot, Source, ramp} from './kit';
import {Quote} from './chD';
import {S, W} from './t';
import {C, F} from './theme';

const VOICES = ['కుట్ర వాదన', 'అప్పటి డిపార్ట్మెంట్', 'L&T', 'BRS నేతలు', 'కోర్ట్'];
/** The four voices and the court as tabs: the same size, the same colour, one lit at a time. */
const Tabs: React.FC<{on: number; from: number; to: number}> = ({on, from, to}) => {
	const f = useCurrentFrame();
	if (f < from || f > to) return null;
	return (
		<div style={{position: 'absolute', left: 0, right: 0, top: 36, display: 'flex', justifyContent: 'center', gap: 16, opacity: ramp(f, from, 10)}}>
			{VOICES.map((v, i) => (
				<div key={v} style={{fontFamily: F.te, fontWeight: 700, fontSize: 32, padding: '6px 22px 8px', borderRadius: 8, background: i === on ? C.ink : 'rgba(35,26,16,0.12)', color: i === on ? C.white : C.inkSoft, border: `3px solid ${C.ink}`}}>
					{i < 4 ? `${i + 1}. ` : ''}{v}
				</div>
			))}
		</div>
	);
};
/** A point on a card, and what answers it. */
const Point: React.FC<{x: number; y: number; n: string; text: string; at: number; ans?: string; ansAt?: number; open?: number; w?: number}> = ({x, y, n, text, at, ans, ansAt = 1e9, open = 1e9, w = 540}) => {
	const f = useCurrentFrame();
	if (f < at - 1) return null;
	const t = ramp(f, at, 10);
	return (
		<div style={{position: 'absolute', left: x, top: y, width: w, minHeight: 330, background: '#FBF6E9', borderRadius: 8, boxShadow: '0 18px 36px rgba(40,20,0,0.35)', padding: '26px 30px', boxSizing: 'border-box', opacity: t, transform: `translateY(${(1 - t) * 40}px) rotate(${(Number(n) - 2) * 1.2 + 0.2 * Math.sin(f / 100 + Number(n))}deg)`, fontFamily: F.te, color: C.ink}}>
			<div style={{fontFamily: F.num, fontWeight: 800, fontSize: 54, color: C.inkSoft}}>{n}</div>
			<div style={{fontWeight: 700, fontSize: 42, lineHeight: 1.35}}>{text}</div>
			{ans && f >= ansAt ? <div style={{marginTop: 16, fontSize: 32, fontWeight: 500, lineHeight: 1.4, borderTop: `3px solid ${C.blue}`, paddingTop: 10, color: C.blue, opacity: ramp(f, ansAt, 10)}}>{ans}</div> : null}
			{f >= open ? <div style={{marginTop: 16, fontSize: 34, fontWeight: 700, color: C.white, background: C.orange, padding: '4px 14px 6px', borderRadius: 6, display: 'inline-block', opacity: ramp(f, open, 10)}}>జవాబు దొరకలేదు</div> : null}
		</div>
	);
};

/** s207-s268: the other side, one voice at a time, then the court. */
export const ChF: React.FC = () => {
	const f = useCurrentFrame();
	const tmc = (v: number, at: number) => ramp(f, at, 30) * v;
	return (
		<>
			<Shot from={S(207)} to={S(210)}>
				<Paper>
					<Say text="ఇక్కడితో ఆపేస్తే: ఒక వైపు కథ" at={S(207)} until={S(208)} y={440} size={64} color={C.ink} bg={C.yellow} />
					<Say text="ఈ రిపోర్ట్ లని ఒప్పుకోని వాళ్ళు ఉన్నారు" at={S(208)} y={440} size={60} />
					<Say text="వాళ్ళ మాట కూడా వినాలి" at={S(209)} y={580} size={60} color={C.ink} bg={C.yellow} />
					<Tabs on={-1} from={S(208)} to={S(210)} />
				</Paper>
			</Shot>
			{/* voice 1: sabotage */}
			<Shot from={S(210)} to={S(229)}>
				<Paper>
					<Tabs on={0} from={S(210)} to={S(229)} />
					<Say text="మొదటి మాట: ఇది కుట్ర" at={S(210)} until={S(212)} y={440} size={64} color={C.ink} bg={C.yellow} />
					<Sheet at={S(212)} until={S(216)} x={620} y={520} w={900} h={500} rot={-2}>
						<Line text="FIR నం. 174/2023" at={W(214, 'ఎఫ్') - 6} size={60} weight={700} />
						<Line text="మహదేవపూర్ పోలీస్ స్టేషన్" at={W(212, 'మహదేవపూర్')} hl={W(212, 'మహదేవపూర్') + 4} size={48} weight={700} />
						<Line text="కంప్లైంట్ ఇచ్చింది: డ్యూటీలో ఉన్న ఇంజనీర్" at={S(212) + 6} size={38} />
						<Line text="తెలియని వ్యక్తులు ఏదైనా చేసి ఉండొచ్చు" at={S(213)} hl={S(213) + 6} size={40} />
					</Sheet>
					<Say text="9 అక్టోబర్ 2023: ఎలక్షన్ షెడ్యూల్" at={S(215)} until={S(216)} x={1460} y={420} size={42} />
					<Say text="12 రోజుల తర్వాత: 21 అక్టోబర్" at={W(215, 'రెండు') - 6} until={S(216)} x={1460} y={520} size={42} color={C.ink} bg={C.yellow} />
					<Say text="BRS వాదన · పాయింట్లు మూడు" at={S(216)} until={S(222)} y={160} size={46} />
					{f >= S(216) ? (
						<>
							<Point x={130} y={250} n="1" text="పేలుడు లాంటి శబ్దం వచ్చింది" at={S(218)} open={S(226)} />
							<Point x={690} y={250} n="2" text="ఆ రోజు నదిలో పెద్ద వరద లేదు" at={S(219)} ans="రిపోర్ట్ ల సమాధానం: పైపింగ్ కి పెద్ద వరద అక్కర్లేదు" ansAt={S(223)} />
							<Point x={1250} y={250} n="3" text="దెబ్బ తిన్నది ఒక్క బ్లాక్ లోనే" at={S(220)} ans="రిపోర్ట్ మాట: ఇలాంటి ఖాళీలు మిగతా బ్లాక్స్ కింద కూడా ఉండొచ్చు" ansAt={S(225)} />
						</>
					) : null}
					<Say text="అడుగుతున్నది: స్పెషల్ ఇన్వెస్టిగేషన్ టీమ్ (SIT)" at={S(221)} until={S(222)} y={760} size={48} color={C.ink} bg={C.yellow} />
					<Say text="BRS మాట: పోలీసులు కేసుని 2025 లో ఎవరినీ గుర్తించకుండానే మూసేశారు" at={S(227)} until={S(229)} y={760} size={44} />
					<Say text="పేలుడు కోణంలో దర్యాప్తు రిపోర్ట్: పబ్లిక్ గా దొరకలేదు" at={S(228)} until={S(229)} y={870} size={44} color={C.white} bg={C.orange} />
				</Paper>
				<Source text="The South First · Telangana Today (22 అక్టోబర్ 2026)" from={S(212)} to={S(229)} />
			</Shot>
			{/* voice 2: the department of that time */}
			<Shot from={S(229)} to={S(236)}>
				<Paper>
					<Tabs on={1} from={S(229)} to={S(236)} />
					<Say text="రెండో మాట: అప్పటి ఇరిగేషన్ డిపార్ట్మెంట్ ది" at={S(229)} until={S(231)} y={440} size={56} color={C.ink} bg={C.yellow} />
					<Say text="1 నవంబర్: రిపోర్ట్ → 4 నవంబర్ 2023: స్టేట్ రిప్లై" at={S(231)} until={S(233)} y={190} size={48} />
					<Quote at={S(232)} until={S(234)} en="either unsubstantiated or made without a full appreciation of the facts" hl={S(233)} te="ఫౌండేషన్ నీళ్ళ కిందే ఉంది. చూడకుండానే కారణాలు తేల్చేశారు." teAt={S(232) + 8} src="తెలంగాణ ఇరిగేషన్ డిపార్ట్మెంట్ రిప్లై · 4 నవంబర్ 2023 (SANDRP)" y={600} h={520} />
					<Sheet at={S(234)} until={S(236)} x={960} y={600} w={1300} h={420} rot={1.2}>
						<Line text="అదే రిప్లైలో ఒక ఒప్పుకోలు" at={S(234) + 4} size={44} color={C.inkSoft} />
						<Line text="2023 వర్షాకాలానికి ముందు చెయ్యాల్సిన తనిఖీ జరగలేదు" at={S(235)} hl={S(235) + 8} size={50} weight={700} />
					</Sheet>
				</Paper>
			</Shot>
			{/* voice 3: L&T */}
			<Shot from={S(236)} to={S(246)}>
				<Paper>
					<Tabs on={2} from={S(236)} to={S(246)} />
					<Say text="మూడో మాట: కట్టిన కంపెనీ, L&T ది" at={S(236)} until={S(238)} y={440} size={60} color={C.ink} bg={C.yellow} />
					<Quote at={S(238)} until={S(242)} en="as per the design provided by the authorities … handed over in 2019 … having withstood the last five flood seasons" hl={S(239)} te="ఇచ్చిన డిజైన్ ప్రకారమే కట్టాం · 2019 లో అప్పగించాం · ఐదు వరద సీజన్లు తట్టుకుంది" teAt={S(239)} src="L&T స్టేట్మెంట్ · 4 నవంబర్ 2023 (Deccan Chronicle)" y={560} h={600} />
					<Say text="మే 2025: L&T లెటర్" at={S(242)} until={S(246)} y={190} size={52} color={C.ink} bg={C.yellow} />
					<Sheet at={S(243)} until={S(246)} x={560} y={560} w={760} h={380} rot={-2.5}>
						<Line text="రిపోర్ట్ లో ఒక చోట" at={S(243) + 4} size={36} color={C.inkSoft} />
						<Line text="గోడల క్వాలిటీ కంట్రోల్ జరగలేదు" at={S(243) + 10} hl={S(243) + 16} size={44} weight={700} />
					</Sheet>
					<Sheet at={S(244)} until={S(246)} x={1380} y={600} w={760} h={380} rot={2}>
						<Line text="ఇంకో చోట" at={S(244) + 4} size={36} color={C.inkSoft} />
						<Line text="కంపెనీ క్వాలిటీ డాక్యుమెంట్లు ఇచ్చింది" at={S(244) + 10} hl={S(244) + 16} size={44} weight={700} />
					</Sheet>
					<Say text="ఈ రెండూ సరిపోవు: L&T" at={S(245)} until={S(246)} y={920} size={54} />
				</Paper>
				<Source text="Telangana Today" from={S(242)} to={S(246)} />
			</Shot>
			{/* voice 4: it worked */}
			<Shot from={S(246)} to={S(254)}>
				<Paper>
					<Tabs on={3} from={S(246)} to={S(254)} />
					<Say text="నాలుగో మాట: BRS నేతలది" at={S(246)} until={S(248)} y={440} size={64} color={C.ink} bg={C.yellow} />
					<Say text="ఈ ప్రాజెక్ట్ పనిచేసింది" at={S(248)} until={S(250)} y={210} size={60} />
					<Say text="అందులో నిజం ఉంది" at={S(249)} until={S(250)} y={320} size={52} color={C.ink} bg={C.yellow} />
					{f >= S(250) ? (
						<svg viewBox="0 0 1920 1080" style={{position: 'absolute', inset: 0}}>
							<rect x={500} y={300} width={300} height={560} fill="none" stroke={C.ink} strokeWidth={8} rx={6} />
							<rect x={504} y={860 - 552 * (tmc(162, W(250, 'వన్') - 20) / 162)} width={292} height={552 * (tmc(162, W(250, 'వన్') - 20) / 162)} fill={C.blue} opacity={0.75} />
							<rect x={1120} y={300} width={300} height={560} fill="none" stroke={C.ink} strokeWidth={8} rx={6} />
							<rect x={1124} y={860 - 552 * (tmc(63, W(252, 'సిక్స్టీ') - 20) / 162)} width={292} height={552 * (tmc(63, W(252, 'సిక్స్టీ') - 20) / 162)} fill={C.ochre} opacity={0.8} />
						</svg>
					) : null}
					<Roll to={162} start={W(250, 'వన్') - 20} land={W(250, 'టీఎంసీల')} until={S(254)} x={650} y={230} size={84} suffix=" TMC ఎత్తిపోశారు" bg={null} color={C.ink} />
					<Roll to={63} start={W(252, 'సిక్స్టీ') - 20} land={W(252, 'టీఎంసీలని')} until={S(254)} x={1270} y={230} size={84} suffix=" TMC మళ్ళీ కిందికి" bg={null} color={C.ink} />
					<Say text="5 సీజన్లలో · మేడిగడ్డ నుంచి" at={S(250)} until={S(254)} x={650} y={930} size={38} />
					<Say text="ఈ నంబర్ల మీద రెండు పక్షాల మధ్య ఒప్పందం లేదు" at={S(253)} until={S(254)} y={1000} size={44} color={C.ink} bg={C.yellow} />
				</Paper>
				<Source text="ఒక పేపర్ లెక్క: Telangana Today" from={S(250)} to={S(254)} />
			</Shot>
			<Shot from={S(248)} to={S(250)} x={8} out={8} hold={0}>
				<Photo src="photos/pump_pipes.jpg" from={S(248)} to={S(250) + 8} credit="Wikimedia Commons · CC BY-SA 4.0" zoom={[1.2, 1.08]} pan={[-40, -10, 30, 0]} />
				<Say text="ఈ ప్రాజెక్ట్ పనిచేసింది" at={S(248)} y={840} size={60} />
				<Say text="అందులో నిజం ఉంది" at={S(249)} y={950} size={52} color={C.ink} bg={C.yellow} />
			</Shot>
			{/* the court */}
			<Shot from={S(254)} to={S(269)}>
				<Paper>
					<Tabs on={4} from={S(254)} to={S(269)} />
					<Say text="కోర్ట్ ఒక పక్షం కాదు · కానీ దాని మాట తెలియాలి" at={S(254)} until={S(257)} y={440} size={56} />
					<Say text="జస్టిస్ పీసీ ఘోష్ కమిషన్" at={W(257, 'జస్టిస్')} until={S(261)} y={210} size={60} color={C.ink} bg={C.yellow} />
					<Say text="వేసింది: ఇప్పటి కాంగ్రెస్ గవర్నమెంట్" at={S(257)} until={S(261)} y={320} size={42} />
					<Say text="జులై 2025: రిపోర్ట్" at={S(258)} until={S(261)} y={420} size={48} />
					<Say text="బాధ్యులుగా చెప్పింది: అప్పటి ముఖ్యమంత్రి కేసీఆర్, అప్పటి ఇరిగేషన్ మినిస్టర్ హరీష్ రావు" at={S(259)} until={S(261)} y={560} size={40} w={1500} />
					<Say text="వాళ్ళు హైకోర్ట్ లో ఛాలెంజ్ చేశారు" at={S(260)} until={S(261)} y={720} size={48} />

					{f >= S(266) ? (
						<>
							<Sheet at={S(267) - 4} x={560} y={600} w={700} h={420} rot={-2} tint="#E7F0FA">
								<Line text="ఇంజనీరింగ్ ప్రశ్న" at={S(267)} size={50} weight={700} />
								<Line text="ఒక రిపోర్ట్ ఉంది" at={S(267) + 10} hl={S(267) + 16} size={46} />
							</Sheet>
							<Sheet at={S(268) - 4} x={1360} y={600} w={700} h={420} rot={2} tint="#FBF6E9">
								<Line text="బాధ్యత ప్రశ్న" at={S(268)} size={50} weight={700} />
								<Line text="ఇంకా తెరిచే ఉంది" at={S(268) + 10} size={46} color={C.orange} weight={700} />
							</Sheet>
							<Say text="ఎవరు బాధ్యులు? ఏ కోర్ట్ నుంచీ ఫైనల్ సమాధానం రాలేదు" at={S(266)} until={S(267) + 20} y={240} size={48} />
						</>
					) : null}
				</Paper>
				<Source text="Deccan Herald · newsonair.gov.in" from={S(257)} to={S(269)} />
			</Shot>
			<Shot from={S(261)} to={S(266)} x={10} hold={0} out={8}>
				<DocPage src="docs/hc-109.png" from={S(261)} to={S(266)} box={f < S(263) - 6 ? [0.2, 0.465, 0.63, 0.135] : [0.2, 0.603, 0.63, 0.17]} hl={f < S(263) - 6 ? S(262) : S(263)} aspect={0.709} zoom={[0.95, 1.5]} />
				<Say text="తెలంగాణ హైకోర్ట్ · 22 ఏప్రిల్ 2026" at={S(261)} until={S(266)} y={110} size={46} />
				<Say text="కమిషన్ ని వెయ్యడం తప్పు కాదు" at={S(262)} until={S(263)} y={950} size={52} />
				<Say text="పిటిషనర్లకు వ్యతిరేకంగా రాసిన మాటలు అమల్లో ఉండవు · చర్య తీసుకోకూడదు" at={S(263)} until={S(265)} y={950} size={44} color={C.ink} bg={C.yellow} />
				<Say text="కారణం: చట్టం ప్రకారం ఇవ్వాల్సిన అవకాశం (సెక్షన్ 8B) ఇవ్వలేదు" at={S(265)} until={S(266)} y={950} size={44} />
				<Source text="హైకోర్ట్ తీర్పు · W.P. 24835/2025 మొ. · అసలు పేజీ" from={S(261) + 6} to={S(266)} />
			</Shot>
		</>
	);
};
