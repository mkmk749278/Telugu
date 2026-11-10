import React from 'react';
import {AbsoluteFill, Easing, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Costume} from '../../../../lib/remotion/ink/draw';
import {InkFigure} from '../../../../lib/remotion/ink/InkFigure';
import {InkLine, InkStage} from '../../../../lib/remotion/ink/InkStage';
import {V2} from '../../../../lib/remotion/ink/rig';
import {Atmos, Tag, tw} from './kit';
import {C, F} from './theme';

// The 2004 and 1984 moments no photograph shows, drawn in ink as featureless figures and labelled ILLUSTRATION.
// Nobody is drawn as a likeness: the scenes show what the excerpts describe, never a face.

const POL = (i: number): Costume => ({
	head: 'bare',
	hair: i % 3 === 0 ? 'grey' : i % 3 === 1 ? 'bald' : 'short',
	top: 'kurta',
	topTone: i % 2 ? 'white' : 'light',
	bottom: 'pyjama',
	bottomTone: 'white',
	waistcoat: i % 2 === 0,
	moustache: i % 4 !== 3,
	glasses: i % 3 === 1,
	shoes: true,
});
const HER: Costume = {head: 'bare', hair: 'bun', top: 'blouse', topTone: 'light', bottom: 'saree', bottomTone: 'light', pallu: 'shoulder', border: true, shoes: true};
const DAUGHTER: Costume = {head: 'bare', hair: 'bun', top: 'blouse', topTone: 'indigo', bottom: 'saree', bottomTone: 'indigo', pallu: 'shoulder', shoes: true};
const SON: Costume = {head: 'bare', hair: 'short', top: 'kurta', topTone: 'white', bottom: 'pyjama', bottomTone: 'white', shoes: true};
const HUSBAND: Costume = {head: 'bare', hair: 'short', top: 'shirt', topTone: 'white', bottom: 'trousers', bottomTone: 'dark', shoes: true};

const GROUND = 860;
const LAMP: V2 = [700, 260];

/** Camera for a whole ink scene: a slow push toward `to` (stage px), always visibly moving. */
const Cam: React.FC<{dur: number; from?: number; to?: number; ox?: string; children: React.ReactNode}> = ({dur, from = 1.0, to = 1.12, ox = '50% 55%', children}) => {
	const f = useCurrentFrame();
	return <AbsoluteFill style={{transform: `scale(${tw(f, 0, dur, from, to, Easing.inOut(Easing.sin))})`, transformOrigin: ox}}>{children}</AbsoluteFill>;
};

/** The conference room at 10 Janpath as the excerpt describes it: a long table, a lamp, the open windows. */
const Room: React.FC<{red?: number}> = ({red = 0}) => (
	<g>
		<defs>
			<radialGradient id="rm-lamp" cx="0.36" cy="0.25" r="0.7">
				<stop offset="0" stopColor="#FFCF8A" stopOpacity={0.32} />
				<stop offset="1" stopColor="#FFCF8A" stopOpacity={0} />
			</radialGradient>
			<linearGradient id="rm-win" x1="0" y1="0" x2="0" y2="1">
				<stop offset="0" stopColor="#1B2A3A" />
				<stop offset="1" stopColor="#0C131B" />
			</linearGradient>
		</defs>
		<rect width={1920} height={1080} fill="#15110D" />
		{/* back wall panels */}
		{[120, 460, 800].map((x, i) => (
			<InkLine key={i} seed={`rm-p${i}`} closed w={1.4} opacity={0.45} pts={[[x, 180], [x + 280, 180], [x + 280, 700], [x, 700]]} />
		))}
		{/* the windows on the right, open: night outside */}
		{[1270, 1560].map((x, i) => (
			<g key={i}>
				<InkLine seed={`rm-w${i}`} closed fill="url(#rm-win)" w={2.6} pts={[[x, 170], [x + 250, 170], [x + 250, 720], [x, 720]]} />
				<InkLine seed={`rm-wm${i}`} w={1.6} opacity={0.8} pts={[[x + 125, 170], [x + 125, 720]]} />
				<InkLine seed={`rm-wc${i}`} w={1.2} opacity={0.5} smooth pts={[[x + 6, 172], [x + 30, 330], [x + 14, 520], [x + 34, 716]]} />
			</g>
		))}
		<rect width={1920} height={1080} fill="url(#rm-lamp)" />
		{/* the long table */}
		<InkLine seed="rm-tab" closed fill="#241B13" w={2.4} pts={[[180, 760], [1180, 760], [1240, 820], [120, 820]]} />
		<InkLine seed="rm-tab2" w={2} pts={[[150, 820], [150, 900]]} />
		<InkLine seed="rm-tab3" w={2} pts={[[1210, 820], [1210, 900]]} />
		{/* floor line */}
		<InkLine seed="rm-floor" w={1.4} opacity={0.5} pts={[[0, GROUND + 6], [1920, GROUND + 6]]} />
		{red > 0 ? <rect width={1920} height={1080} fill={C.red} opacity={0.16 * red} style={{mixBlendMode: 'multiply'}} /> : null}
	</g>
);

/**
 * The room scene. phase 'talk': the leaders talk in turns, she listens; 'close': at her answer they rise and close in
 * around her; 'yes': her "Theek hai", and they turn to congratulate her. `at` = the local frame the move starts.
 */
export const InkRoom: React.FC<{dur: number; phase: 'talk' | 'close' | 'yes'; at?: number}> = ({dur, phase, at = 0}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	const herX = 980;
	const start = phase === 'talk' ? 999 : at / fps;
	const red = phase === 'close' ? tw(f, at, at + 40, 0, 1) : phase === 'yes' ? 1 - tw(f, 0, 30, 0, 0.6) : 0;
	const men = [
		{x: 280, d: 360, face: 1 as const},
		{x: 430, d: 310, face: 1 as const},
		{x: 600, d: 240, face: 1 as const},
		{x: 1700, d: -380, face: -1 as const},
		{x: 1530, d: -310, face: -1 as const},
		{x: 1380, d: -260, face: -1 as const},
	];
	const done = phase === 'yes';
	return (
		<AbsoluteFill>
			<Cam dur={dur} from={phase === 'close' ? 1.0 : 1.04} to={phase === 'close' ? 1.22 : 1.14} ox={`${(herX / 1920) * 100}% 60%`}>
				<InkStage paper={false}>
					<Room red={red} />
					{men.map((m, i) => (
						<InkFigure
							key={i}
							seed={`man${i}`}
							costume={POL(i)}
							x={done ? m.x + m.d : m.x}
							y={GROUND - (i % 3) * 6}
							scale={1.6 - (i % 3) * 0.05}
							facing={m.face}
							look={[herX, GROUND - 330]}
							light={LAMP}
							action={{type: 'wait', hands: done ? 'offer' : i % 2 ? 'clasp' : 'behind', mood: done ? 'warm' : 'resolute', glance: false, shuffle: [{at: start + i * 0.12, steps: 4, dur: 1.4, dist: Math.abs(m.d) / 1.6}]}}
							t0={0}
						/>
					))}
					<InkFigure seed="her" costume={HER} x={herX} y={GROUND + 10} scale={1.62} facing={-1} light={LAMP} action={{type: 'wait', hands: 'clasp', mood: phase === 'talk' ? 'dignified' : 'worried', glance: phase === 'talk'}} detail />
				</InkStage>
			</Cam>
			<Atmos />
			<Tag text="ILLUSTRATION" />
		</AbsoluteFill>
	);
};

/** From the garden: the lit, open window; inside, the circle of figures; outside in the dark, a young woman watching. */
export const InkWindow: React.FC<{dur: number}> = ({dur}) => {
	const f = useCurrentFrame();
	const x0 = 760;
	return (
		<AbsoluteFill>
			<Cam dur={dur} from={1.0} to={1.16} ox="38% 55%">
				<InkStage paper={false}>
					<defs>
						<linearGradient id="wn-in" x1="0" y1="0" x2="0" y2="1">
							<stop offset="0" stopColor="#F2B871" />
							<stop offset="1" stopColor="#B86A2E" />
						</linearGradient>
						<radialGradient id="wn-spill" cx="0.5" cy="0.5" r="0.5">
							<stop offset="0" stopColor="#FFB565" stopOpacity={0.35} />
							<stop offset="1" stopColor="#FFB565" stopOpacity={0} />
						</radialGradient>
					</defs>
					<rect width={1920} height={1080} fill="#0B0E12" />
					{/* house wall */}
					<InkLine seed="wn-wall" closed fill="#14161A" w={2} pts={[[520, 90], [1920, 90], [1920, 900], [520, 900]]} />
					{/* the window, lit from inside */}
					<InkLine seed="wn-win" closed fill="url(#wn-in)" w={3} pts={[[x0, 260], [x0 + 760, 260], [x0 + 760, 700], [x0, 700]]} />
					{/* the figures inside, seen as dark shapes against the lamp: a circle closing on one */}
					<clipPath id="wn-clip">
						<rect x={x0} y={260} width={760} height={440} />
					</clipPath>
					<g clipPath="url(#wn-clip)" style={{filter: 'brightness(0.12) blur(0.6px)'}}>
						{[-3, -2, -1, 1, 2, 3].map((k, i) => (
							<InkFigure key={i} seed={`wf${i}`} costume={POL(i)} x={x0 + 380 + k * (110 - tw(f, 0, dur, 0, 30))} y={760} scale={1.05} facing={k < 0 ? 1 : -1} rim={0} shadow={false} action={{type: 'wait', hands: 'offer', glance: false}} />
						))}
						<InkFigure seed="wher" costume={HER} x={x0 + 380} y={770} scale={1.0} facing={-1} rim={0} shadow={false} action={{type: 'wait', hands: 'clasp', mood: 'worried', glance: false}} />
					</g>
					<InkLine seed="wn-mull" w={2.6} pts={[[x0 + 380, 260], [x0 + 380, 700]]} />
					<InkLine seed="wn-sill" w={3} pts={[[x0 - 20, 706], [x0 + 780, 706]]} />
					<ellipse cx={x0 + 380} cy={880} rx={520} ry={120} fill="url(#wn-spill)" style={{mixBlendMode: 'screen'}} />
					{/* garden: a hedge line */}
					<InkLine seed="wn-hedge" closed fill="#0E1210" w={2} smooth pts={[[0, 900], [0, 760], [160, 730], [330, 770], [480, 740], [600, 800], [660, 900]]} />
					<InkLine seed="wn-ground" w={1.4} opacity={0.6} pts={[[0, 905], [1920, 905]]} />
					{/* the watcher, in the dark */}
					<InkFigure seed="daughter" costume={DAUGHTER} x={430} y={960} scale={2.0} facing={1} look={[x0 + 380, 480]} light={[x0 + 380, 480]} rim={1} action={{type: 'stand', hands: 'chest', mood: 'worried'}} detail />
				</InkStage>
			</Cam>
			<Atmos v={0.7} />
			<Tag text="ILLUSTRATION" />
		</AbsoluteFill>
	);
};

/** The half-lit corridor at her bedroom door: her two children stride toward her. */
export const InkCorridor: React.FC<{dur: number; walk?: boolean}> = ({dur, walk = true}) => (
	<AbsoluteFill>
		<Cam dur={dur} from={1.02} to={1.14} ox="30% 60%">
			<InkStage paper={false}>
				<defs>
					<linearGradient id="cr-l" x1="0" y1="0" x2="1" y2="0">
						<stop offset="0" stopColor="#3A2A1C" />
						<stop offset="1" stopColor="#0E0B09" />
					</linearGradient>
				</defs>
				<rect width={1920} height={1080} fill="url(#cr-l)" />
				{/* corridor in perspective */}
				<InkLine seed="cr-1" w={2} pts={[[0, 120], [1500, 380]]} />
				<InkLine seed="cr-2" w={2} pts={[[0, 980], [1500, 720]]} />
				<InkLine seed="cr-3" closed fill="#0A0807" w={2} pts={[[1500, 380], [1920, 380], [1920, 720], [1500, 720]]} />
				{/* the bedroom door, ajar, on the left */}
				<InkLine seed="cr-door" closed fill="#5A3F25" w={2.4} pts={[[150, 240], [380, 280], [380, 900], [150, 950]]} />
				<InkFigure seed="her2" costume={HER} x={300} y={930} scale={2.1} facing={1} look={[1100, 520]} light={[260, 400]} action={{type: 'wait', hands: 'clasp', mood: 'worried', glance: false}} detail />
				<InkFigure seed="son" costume={SON} x={1380} y={900} scale={1.85} facing={-1} look={[300, 520]} light={[260, 400]} action={walk ? {type: 'walk', speed: 0.55, dist: 9999} : {type: 'stand', mood: 'resolute'}} t0={0} />
				<InkFigure seed="dtr" costume={DAUGHTER} x={1550} y={880} scale={1.75} facing={-1} look={[300, 520]} light={[260, 400]} action={walk ? {type: 'walk', speed: 0.5, dist: 9999} : {type: 'stand', mood: 'worried'}} t0={0.4} />
			</InkStage>
		</Cam>
		<Atmos v={0.75} />
		<Tag text="ILLUSTRATION" />
	</AbsoluteFill>
);

/** Her bedroom at night: the bed, the empty side; two voices as two captions (no figure drawn). */
export const InkBed: React.FC<{dur: number; lines?: {t: string; at: number; side: 'l' | 'r'}[]}> = ({dur, lines = []}) => {
	const f = useCurrentFrame();
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill>
			<Cam dur={dur} from={1.0} to={1.12} ox="50% 60%">
				<InkStage paper={false}>
					<defs>
						<radialGradient id="bd-moon" cx="0.78" cy="0.25" r="0.6">
							<stop offset="0" stopColor="#9DB6D8" stopOpacity={0.3} />
							<stop offset="1" stopColor="#9DB6D8" stopOpacity={0} />
						</radialGradient>
					</defs>
					<rect width={1920} height={1080} fill="#0A0C10" />
					<rect width={1920} height={1080} fill="url(#bd-moon)" />
					<InkLine seed="bd-win" closed fill="#16202C" w={2.2} pts={[[1360, 140], [1700, 140], [1700, 560], [1360, 560]]} />
					<InkLine seed="bd-wm" w={1.6} pts={[[1530, 140], [1530, 560]]} />
					{/* headboard, bed, two pillows */}
					<InkLine seed="bd-head" closed fill="#1C1814" w={2.4} pts={[[420, 380], [1300, 380], [1300, 640], [420, 640]]} />
					<InkLine seed="bd-bed" closed fill="#2A2621" w={2.4} pts={[[380, 640], [1340, 640], [1480, 900], [240, 900]]} />
					<InkLine seed="bd-p1" closed fill="#D8D2C4" w={2} smooth pts={[[480, 600], [700, 590], [760, 640], [520, 660]]} />
					<InkLine seed="bd-p2" closed fill="#B8B2A6" w={2} smooth pts={[[960, 600], [1180, 590], [1240, 640], [1000, 660]]} />
					<InkLine seed="bd-sheet" w={1.6} opacity={0.6} smooth pts={[[300, 760], [700, 740], [1100, 770], [1420, 760]]} />
				</InkStage>
			</Cam>
			{lines.map((l, i) => {
				const p = tw(f, l.at, l.at + fps * 0.5, 0, 1);
				return (
					<div key={i} style={{position: 'absolute', top: 120 + (i % 2) * 40, [l.side === 'l' ? 'left' : 'right']: 90, width: 760, fontFamily: F.te, fontWeight: 700, fontSize: 54, lineHeight: 1.35, color: l.side === 'l' ? C.grey : C.gold, opacity: p, textShadow: '0 4px 20px #000', textAlign: l.side === 'l' ? 'left' : 'right'}}>
						{l.t}
					</div>
				);
			})}
			<Atmos v={0.75} />
			<Tag text="ILLUSTRATION" />
		</AbsoluteFill>
	);
};

/** A closed door with light under it, at dawn; a figure's hand raised to knock. */
export const InkDoor: React.FC<{dur: number}> = ({dur}) => (
	<AbsoluteFill>
		<Cam dur={dur} from={1.0} to={1.15} ox="55% 55%">
			<InkStage paper={false}>
				<rect width={1920} height={1080} fill="#1A1814" />
				<InkLine seed="dr-door" closed fill="#3B2B1D" w={2.6} pts={[[760, 160], [1240, 160], [1240, 980], [760, 980]]} />
				{[260, 600].map((y, i) => (
					<InkLine key={i} seed={`dr-pan${i}`} closed w={1.6} opacity={0.6} pts={[[820, y], [1180, y], [1180, y + 280], [820, y + 280]]} />
				))}
				<circle cx={1190} cy={600} r={12} fill="#C9A15A" />
				<rect x={760} y={974} width={480} height={10} fill="#FFD9A0" opacity={0.8} style={{filter: 'blur(4px)'}} />
				<InkFigure seed="her3" costume={HER} x={560} y={1010} scale={2.4} facing={1} look={[1000, 500]} light={[1000, 980]} action={{type: 'stand', hands: 'chest', mood: 'resolute'}} detail />
			</InkStage>
		</Cam>
		<Atmos v={0.7} />
		<Tag text="ILLUSTRATION" />
	</AbsoluteFill>
);

/** Central Hall, May 2004: the dome's ring of light, rows of MPs, a lectern; `surge` makes the rows rise and close in. */
export const InkHall: React.FC<{dur: number; surge?: number; atLectern?: boolean}> = ({dur, surge, atLectern = true}) => {
	const rows = [
		{y: 1000, n: 9, s: 1.35},
		{y: 900, n: 11, s: 1.1},
		{y: 820, n: 13, s: 0.92},
	];
	const {fps} = useVideoConfig();
	return (
		<AbsoluteFill>
			<Cam dur={dur} from={1.0} to={1.14} ox="50% 45%">
				<InkStage paper={false}>
					<defs>
						<radialGradient id="hl-dome" cx="0.5" cy="0.05" r="0.8">
							<stop offset="0" stopColor="#F7D8A0" stopOpacity={0.35} />
							<stop offset="1" stopColor="#F7D8A0" stopOpacity={0} />
						</radialGradient>
					</defs>
					<rect width={1920} height={1080} fill="#14100C" />
					{/* the round hall: arches */}
					{Array.from({length: 9}).map((_, i) => {
						const x = 120 + i * 210;
						return <InkLine key={i} seed={`hl-a${i}`} closed fill="#1B1611" w={1.6} opacity={0.8} smooth pts={[[x, 640], [x, 300], [x + 80, 220], [x + 160, 300], [x + 160, 640]]} />;
					})}
					<rect width={1920} height={1080} fill="url(#hl-dome)" />
					{/* the leaders' table and lectern */}
					<InkLine seed="hl-tab" closed fill="#2B2017" w={2.2} pts={[[560, 640], [1360, 640], [1380, 690], [540, 690]]} />
					<InkLine seed="hl-lec" closed fill="#3A2A1B" w={2.4} pts={[[920, 560], [1000, 560], [1010, 700], [910, 700]]} />
					{atLectern ? <InkFigure seed="her4" costume={HER} x={960} y={700} scale={0.95} facing={1} light={[960, 100]} action={{type: 'stand', hands: 'clasp', mood: 'resolute'}} /> : null}
					{rows.map((r, ri) =>
						Array.from({length: r.n}).map((_, i) => {
							const x = 960 + (i - (r.n - 1) / 2) * (1700 / r.n);
							const toward = surge !== undefined ? (960 - x) * 0.25 : 0;
							return (
								<InkFigure
									key={`${ri}-${i}`}
									seed={`mp${ri}${i}`}
									costume={POL(i + ri)}
									x={x}
									y={r.y}
									scale={r.s}
									facing={x < 960 ? 1 : -1}
									look={[960, 560]}
									light={[960, 100]}
									rim={0.6}
									t0={random(`mp${ri}${i}`) * 3}
									action={{type: 'wait', hands: surge !== undefined ? 'offer' : 'clasp', glance: false, shuffle: surge !== undefined ? [{at: surge / fps + random(`sh${ri}${i}`) * 0.6, steps: 3, dur: 1.2, dist: Math.abs(toward) / r.s}] : []}}
								/>
							);
						}),
					)}
				</InkStage>
			</Cam>
			<Atmos v={0.7} />
			<Tag text="ILLUSTRATION" />
		</AbsoluteFill>
	);
};

/** The mirror: 1984 (a wife pleads with her husband) beside 2004 (two children plead with their mother). */
export const InkMirror: React.FC<{dur: number; showRight: number}> = ({dur, showRight}) => {
	const f = useCurrentFrame();
	const split = tw(f, showRight, showRight + 24, 1920, 960);
	const half = (left: boolean) => (
		<InkStage paper={false}>
			<rect width={1920} height={1080} fill={left ? '#16110C' : '#0E1116'} />
			{left ? (
				<>
					<InkFigure seed="m-her" costume={HER} x={760} y={900} scale={2.2} facing={1} look={[1180, 420]} light={[960, 200]} action={{type: 'stand', hands: 'folded', mood: 'worried'}} detail />
					<InkFigure seed="m-him" costume={HUSBAND} x={1200} y={900} scale={2.3} facing={-1} look={[760, 420]} light={[960, 200]} action={{type: 'stand', hands: 'hang', mood: 'resolute'}} detail />
				</>
			) : (
				<>
					<InkFigure seed="m-son" costume={SON} x={700} y={900} scale={2.2} facing={1} look={[1200, 420]} light={[960, 200]} action={{type: 'stand', hands: 'offer', mood: 'worried'}} detail />
					<InkFigure seed="m-dtr" costume={DAUGHTER} x={900} y={910} scale={2.1} facing={1} look={[1200, 420]} light={[960, 200]} action={{type: 'stand', hands: 'chest', mood: 'worried'}} detail />
					<InkFigure seed="m-mom" costume={HER} x={1250} y={900} scale={2.2} facing={-1} look={[800, 420]} light={[960, 200]} action={{type: 'stand', hands: 'clasp', mood: 'dignified'}} detail />
				</>
			)}
		</InkStage>
	);
	return (
		<AbsoluteFill style={{background: '#000'}}>
			<Cam dur={dur} from={1.0} to={1.08}>
				<AbsoluteFill style={{clipPath: `inset(0 ${1920 - split}px 0 0)`}}>
					<AbsoluteFill style={{transform: `translateX(${(split - 1920) / 2}px)`}}>{half(true)}</AbsoluteFill>
				</AbsoluteFill>
				<AbsoluteFill style={{clipPath: `inset(0 0 0 ${split}px)`}}>
					<AbsoluteFill style={{transform: `translateX(${split / 2}px)`}}>{half(false)}</AbsoluteFill>
				</AbsoluteFill>
				<div style={{position: 'absolute', left: split - 2, top: 0, width: 4, height: 1080, background: C.gold, opacity: split < 1900 ? 1 : 0}} />
			</Cam>
			<div style={{position: 'absolute', left: 80, top: 70, fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 96, color: C.cream, textShadow: '0 4px 20px #000'}}>1984</div>
			<div style={{position: 'absolute', right: 80, top: 70, fontFamily: "'Inter Tight', sans-serif", fontWeight: 800, fontSize: 96, color: C.gold, opacity: tw(f, showRight + 10, showRight + 30, 0, 1), textShadow: '0 4px 20px #000'}}>2004</div>
			<Atmos />
			<Tag text="ILLUSTRATION" />
		</AbsoluteFill>
	);
};
