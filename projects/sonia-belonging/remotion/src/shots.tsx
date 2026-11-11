import React from 'react';
import {BookShot, CounterShot, Dim, ExcerptShot, Ground, Label, PhotoShot, PrintShot, QuoteShot, StampShot, Words} from './kit';
import {MapShot, OutroShot, PLACE, PollShot, QuestionsShot, SourcesShot, TimelineShot} from './kit2';
import {InkBed, InkCorridor, InkDoor, InkHall, InkMirror, InkRoom, InkWindow} from './ink';
import {M} from './media';
import {C} from './theme';
import {AUDIO_FRAMES, s0, w0} from './timing';

// The film, shot by shot. Each shot starts on a sentence (s0) and runs until the next shot starts; times inside a shot
// are local frames (`r(x)` = x - the shot's start). Every frame comes from the approved audio's timing.
export type Shot = {at: number; render: (dur: number, r: (x: number) => number) => React.ReactNode};

const IE = 'BELONGING · EXCERPT VIA THE INDIAN EXPRESS';
const HINDU = 'BELONGING · EXCERPT VIA THE HINDU';
const TOI = 'BELONGING · AS QUOTED BY THE TIMES OF INDIA';
const GUARD = 'BELONGING · EXTRACT VIA THE GUARDIAN / HINDUSTAN TIMES';

const ph = (k: keyof typeof M) => ({file: M[k].file, credit: M[k].credit});

export const SHOTS: Shot[] = [
	// ---------------------------------------------------------------- cold open: the yes
	{at: 0, render: (d, r) => <BookShot dur={d} te="ప్రైమ్ మినిస్టర్ పదవికి సరే" en="HER OWN MEMOIR · 10 NOV 2026" labelAt={r(w0(0, 'సరే'))} />},
	{at: s0(1), render: (d, r) => <ExcerptShot dur={d} source={IE} lines={['I am shaken. I feel overpowered.', '“Theek hai,” (“All right,”),', 'I mumble almost inaudibly.']} hi={[[1, r(w0(2, 'పుస్తకంలో')), r(w0(2, 'రాశారు'))]]} />},
	{at: s0(3), render: (d, r) => <StampShot dur={d} big="MAY 2004" sub="10 JANPATH · NEW DELHI" subAt={r(s0(4))} />},
	{at: s0(5), render: (d, r) => (
		<>
			<Dim dur={d} file={M.parliament.file} />
			<Words items={[{t: 'ఎలక్షన్ రిజల్ట్స్', at: 4}, {t: 'యూపీఏ గెలిచింది', at: r(w0(6, 'యూపీఏ')), gold: true}]} sub="UPA WINS · MAY 2004" subAt={r(w0(6, 'గెలిచింది'))} />
		</>
	)},
	{at: s0(7), render: (d) => <InkRoom dur={d} phase="talk" />},
	{at: s0(9), render: (d) => (
		<>
			<Dim><InkRoom dur={d} phase="talk" /></Dim>
			<Words items={[{t: 'మీరే', at: 2}, {t: 'ప్రైమ్ మినిస్టర్', at: 10, gold: true}, {t: 'కావాలి', at: 20}]} />
		</>
	)},
	{at: s0(10), render: (d, r) => <InkRoom dur={d} phase="close" at={r(w0(12, 'లేచి'))} />},
	{at: s0(14), render: (d, r) => <ExcerptShot dur={d} source={IE} lines={['“We will not accept this,” one of them says.', '“You cannot take this decision, Madam.”', '“We will not take no for an answer.”']} hi={[[0, 2, 30], [1, r(s0(15)), r(s0(15)) + 40], [2, r(s0(16)), r(s0(16)) + 36]]} />},
	{at: s0(17), render: (d) => <ExcerptShot dur={d} source={IE} lines={['They physically surround me.', 'I am shaken. I feel overpowered.']} hi={[[1, 30, 70]]}  under={<InkRoom dur={d} phase="close" at={-200} />} />},
	{at: s0(18), render: (d) => <InkRoom dur={d} phase="close" at={-200} />},
	{at: s0(19), render: (d, r) => (
		<>
			<Dim red><InkRoom dur={d} phase="close" at={-200} /></Dim>
			<Words items={[{t: 'ఠీక్ హై.', at: 1, gold: true}]} size={170} sub="“THEEK HAI” · ALL RIGHT" subAt={r(s0(20))} />
		</>
	)},
	{at: s0(21), render: (d) => <InkRoom dur={d} phase="yes" />},
	{at: s0(22), render: (d, r) => (
		<>
			<InkWindow dur={d} />
			<Label te="ప్రియాంక" en="HER DAUGHTER" at={r(s0(24))} y={120} />
		</>
	)},
	{at: s0(25), render: (d) => (
		<>
			<Dim><InkWindow dur={d} /></Dim>
			<Words items={[{t: 'అసలు కథ', at: 2}, {t: 'ఇక్కడే', at: 16, gold: true}]} />
		</>
	)},
	{at: s0(26), render: (d, r) => (
		<>
			<Dim red dur={d} file={M.parliament.file} />
			<Words items={[{t: 'సరే', at: 2}, {t: 'ఒక్క రాత్రి', at: r(w0(26, 'ఒక్క')), gold: true}, {t: 'వద్దు', at: r(w0(26, 'వెనక్కి')), red: true}]} size={140} />
		</>
	)},
	{at: s0(27), render: (d, r) => <PhotoShot dur={d} {...ph('parliament')} grade="night" move="in" te="దేశం మొత్తం చూస్తుండగా" en="PARLIAMENT, NEW DELHI" labelAt={4} />},
	{at: s0(28), render: (d, r) => <QuestionsShot items={[{t: 'ఆ ఒక్క రాత్రిలో ఏం జరిగింది?', at: 2}, {t: 'కిటికీ బయట ప్రియాంక ఏం చేసింది?', at: r(s0(29))}, {t: 'ట్వెంటీ ఇయర్స్ ముందు, ఎందుకు వేడుకున్నారు?', at: r(s0(31))}]} />},
	{at: s0(31) + 50, render: (d) => <InkMirror dur={d} showRight={99999} />},
	{at: s0(33), render: (d) => <BookShot dur={d} te="సమాధానం ఆమె పుస్తకంలోనే" labelAt={8} />},
	{at: s0(34), render: (d) => <BookShot dur={d} en="BELONGING: A JOURNEY OF LOVE" labelAt={6} />},
	{at: s0(35), render: (d, r) => <CounterShot dur={d} value={544} land={r(w0(35, 'పేజీలు'))} unit="పేజీలు" />},
	{at: s0(36), render: (d) => <BookShot dur={d} open en="HARPERCOLLINS INDIA" labelAt={6} />},
	{at: s0(37), render: (d, r) => <StampShot dur={d} big="10 NOV 2026" sub="IN BOOKSHOPS FROM 10 AM" subAt={r(w0(37, 'బుక్'))} />},
	// ---------------------------------------------------------------- the honesty promise
	{at: s0(38), render: (d, r) => <SourcesShot dur={d} rows={['Her book’s published excerpts', 'Her interviews', 'News reports, every line sourced']} at={[r(w0(39, 'పుస్తకం')), r(w0(39, 'ఇంటర్వ్యూలు')), r(w0(39, 'మాత్రమే'))]} />},
	{at: s0(40), render: (d, r) => (
		<>
			<Dim><BookShot dur={d} open /></Dim>
			<Words items={[{t: 'ఆమె వైపు కథ', at: 2}, {t: 'విమర్శకుల మాట కూడా', at: r(s0(41)), gold: true}]} size={110} />
		</>
	)},
	// ---------------------------------------------------------------- Cambridge, 1965
	{at: s0(42), render: (d, r) => <PhotoShot dur={d} {...ph('kingsParade1980')} grade="archive" move="r" te="కేంబ్రిడ్జ్, ఇంగ్లాండ్" en="CAMBRIDGE · KING'S PARADE" labelAt={r(s0(44))} />},
	{at: s0(45), render: (d) => <StampShot dur={d} {...ph('senateHouse')} grade="archive" big="1965" sub="CAMBRIDGE" />},
	{at: s0(46), render: (d, r) => <PhotoShot dur={d} {...ph('birthplace')} grade="archive" move="in" te="ఇటలీలోని ఒక చిన్న టౌన్" en="HER BIRTHPLACE, ITALY" labelAt={6} />},
	{at: s0(47), render: (d, r) => (
		<>
			<Dim dur={d} file={M.kingsParade1980.file} />
			<Words items={[{t: 'వయసు', at: 2}, {t: 'నైన్టీన్', at: 8, gold: true}]} sub="STUDYING ENGLISH IN CAMBRIDGE" subAt={r(s0(48))} />
		</>
	)},
	{at: s0(49), render: (d, r) => <ExcerptShot dur={d} source="SONIA GANDHI, ON X · VIA AFP" lines={['“In a small Greek restaurant', 'in Cambridge', 'my journey of love began.”']} hi={[[0, r(w0(49, 'గ్రీక్')), r(w0(49, 'రెస్టారెంట్')) + 10]]} te="ది వర్సిటీ" />},
	{at: s0(50), render: (d) => <PrintShot dur={d} {...ph('rajiv1985')} caption="RAJIV GANDHI" grade="bw" width={640} />},
	{at: s0(51), render: (d) => <QuoteShot dur={d} {...ph('rajiv1985')} who="SONIA GANDHI" te="చూసిన వెంటనే అనిపించింది, ఇతనితోనే ఉండాలని." en="He was someone I would really love to be with. And of course, I learned that it was the same for him." source="VIDEO STATEMENT ON HER MEMOIR · VIA AFP" />},
	{at: s0(53), render: (d, r) => <PrintShot dur={d} {...ph('family1949')} caption="NEHRU, INDIRA, RAJIV AND SANJAY · 1949" te="జవహర్లాల్ నెహ్రూ" en="INDIA'S FIRST PRIME MINISTER" labelAt={r(s0(54))} width={760} />},
	{at: s0(56), render: (d, r) => <PhotoShot dur={d} {...ph('indira1966')} grade="bw" contain move="in" te="ఇందిరా గాంధీ" en="PRIME MINISTER FROM 1966" labelAt={4} />},
	{at: s0(58), render: (d, r) => <StampShot dur={d} big="25 FEB 1968" sub="NEW DELHI · THE WEDDING" subAt={r(s0(59))} />},
	{at: s0(60), render: (d, r) => (
		<>
			<Dim dur={d} file={M.family1949.file} />
			<Words items={[{t: 'చీర నూలు', at: 4}, {t: 'నెహ్రూ వడికినది', at: r(s0(61)), gold: true}]} sub="YARN SPUN BY NEHRU IN PRISON · AFP" subAt={r(w0(61, 'జైల్లో'))} />
		</>
	)},
	{at: s0(62), render: (d, r) => (
		<>
			<Dim dur={d} file={M.sonia2006.file} />
			<Words items={[{t: 'హిందీ', at: r(s0(63))}, {t: 'చీర', at: r(s0(64)), gold: true}, {t: 'మన ఫుడ్', at: r(s0(65))}]} size={130} sub="AN ITALIAN GIRL BECOMES AN INDIAN DAUGHTER-IN-LAW" subAt={4} />
		</>
	)},
	{at: s0(66), render: (d) => <PhotoShot dur={d} {...ph('indira1977')} grade="bw" contain move="in" te="అత్తగారు, దేశానికే ప్రైమ్ మినిస్టర్" labelAt={6} />},
	{at: s0(68), render: (d) => <PhotoShot dur={d} {...ph('indira1983')} grade="bw" move="l" te="ఒక మూలన నిలబెట్టారట" en="AS SHE RECALLS IT IN THE BOOK" labelAt={20} />},
	{at: s0(69), render: (d) => <ExcerptShot dur={d} source={TOI} lines={['“But until I got to know her well,', 'I’d quake in my seat.”']} hi={[[1, 40, 80]]} />},
	{at: s0(70), render: (d) => <QuoteShot dur={d} {...ph('family1949')} who="SONIA GANDHI · THE GUARDIAN" te="ఇంట్లో, మిగతా అమ్మల్లాగే ఒక అమ్మ." en="At home she was just like any other mother." source="INTERVIEW · VIA THE INDIAN EXPRESS" />},
	{at: s0(71), render: (d, r) => (
		<>
			<Dim dur={d} file={M.rajiv1985.file} />
			<Words items={[{t: 'రాజీవ్', at: 2}, {t: 'ఒక పైలట్', at: r(w0(72, 'ఎయిర్')), gold: true}]} sub="A COMMERCIAL AIRLINE PILOT · NOT IN POLITICS" subAt={r(s0(72))} />
		</>
	)},
	{at: s0(73), render: (d, r) => <ExcerptShot dur={d} source={HINDU} lines={['“I’d always disliked politics,', 'even during all the years', 'when Rajiv was in public life.”']} hi={[[0, r(w0(74, 'నాకు')), r(w0(74, 'లేదు')) + 10]]} />},
	// ---------------------------------------------------------------- 1984
	{at: s0(75), render: () => <StampShot dur={90} {...ph('memorial1')} big="1984" />},
	{at: s0(76), render: (d, r) => <StampShot dur={d} {...ph('memorial1')} grade="night" big="31 OCT 1984" sub="1 SAFDARJUNG ROAD, NEW DELHI" subAt={r(s0(77))} />},
	{at: s0(78), render: (d) => <PhotoShot dur={d} {...ph('memorial2')} grade="night" move="in" te="సొంత బాడీగార్డ్సే కాల్చారు" en="NOW THE INDIRA GANDHI MEMORIAL" labelAt={8} />},
	{at: s0(79), render: (d) => <PhotoShot dur={d} {...ph('safdarjungLane')} grade="night" move="r" te="హాస్పిటల్ కి వెళ్ళే దారిలో" en="SHE HELD HER ALL THE WAY" labelAt={10} />},
	{at: s0(81), render: (d) => <PhotoShot dur={d} {...ph('indira1983')} grade="night" move="out" te="ఇక ఆన్సర్ చెప్పడం లేదు" labelAt={20} />},
	{at: s0(83), render: (d, r) => <StampShot dur={d} {...ph('memorial2')} big="2:00 PM" sub="31 OCTOBER 1984 · DECLARED DEAD" subAt={r(w0(83, 'చనిపోయారని'))} />},
	{at: s0(84), render: (d, r) => <MapShot dur={d} a={{at: PLACE.kolkata, label: 'WEST BENGAL'}} b={{at: PLACE.delhi, label: 'NEW DELHI'}} head="plane" go={r(w0(85, 'హడావిడిగా'))} arrive={r(w0(85, 'హాస్పిటల్'))} />},
	{at: s0(86), render: (d, r) => <ExcerptShot dur={d} source={GUARD} lines={['“We held each other …', '‘I have been asked;', 'They want me to be sworn in', 'as prime minister.’”']} hi={[[2, r(s0(88)), r(s0(88)) + 50], [3, r(s0(88)) + 30, r(s0(88)) + 70]]}  under={<PhotoShot dur={d} {...ph('memorial2')} grade="night" />} />},
	{at: s0(89), render: (d) => (
		<>
			<Dim red><InkMirror dur={d} showRight={99999} /></Dim>
			<Words items={[{t: 'గుండెలో కత్తి', at: 20, red: true}]} size={150} sub="“AS IF A KNIFE HAD BEEN PLUNGED RIGHT INTO MY HEART”" subAt={36} />
		</>
	)},
	{at: s0(90), render: (d) => <InkMirror dur={d} showRight={99999} />},
	{at: s0(94), render: (d, r) => <ExcerptShot dur={d} source={GUARD} lines={['“They will kill you;', 'they will kill you, too!”', '', 'Rajiv: “They will kill me anyway.”']} hi={[[3, r(s0(95)), r(s0(95)) + 40]]}  under={<PhotoShot dur={d} {...ph('memorial1')} grade="night" />} />},
	{at: s0(96), render: (d) => (
		<>
			<Dim><InkMirror dur={d} showRight={99999} /></Dim>
			<Words items={[{t: 'ఈ మాట', at: 2}, {t: 'గుర్తుపెట్టుకోండి', at: 12, gold: true}]} />
		</>
	)},
	{at: s0(98), render: (d) => <PhotoShot dur={d} {...ph('rajivThatcher')} grade="warm" move="in" te="ప్రైమ్ మినిస్టర్ రాజీవ్ గాంధీ" en="WITH MARGARET THATCHER, 1985" labelAt={4} />},
	// ---------------------------------------------------------------- 1991
	{at: s0(100), render: (d, r) => <StampShot dur={d} {...ph('rajiv1987')} grade="night" big="1991" sub="RAJIV IS CAMPAIGNING AGAIN" subAt={r(s0(101))} />},
	{at: s0(102), render: (d, r) => <ExcerptShot dur={d} source={TOI} lines={['Rahul, two months before:', '“If something isn’t done about Pa’s security,', 'I know I’ll soon have to come back', 'for his funeral.”']} hi={[[1, r(s0(103)), r(s0(103)) + 50], [3, r(w0(103, 'ఫ్యూనరల్')), r(w0(103, 'ఫ్యూనరల్')) + 20]]}  under={<PhotoShot dur={d} {...ph('rajiv1987')} grade="bw" contain />} />},
	{at: s0(104), render: (d) => <StampShot dur={d} {...ph('sriperumbudur')} big="21 MAY 1991" sub="RAJIV'S LAST DAY OF CAMPAIGNING" />},
	{at: s0(105), render: (d, r) => <PhotoShot dur={d} {...ph('vizag')} grade="warm" move="l" te="మన విశాఖపట్నం" en="VISAKHAPATNAM" labelAt={r(w0(105, 'విశాఖపట్నం'))} />},
	{at: s0(106), render: (d, r) => <MapShot dur={d} a={{at: PLACE.vizag, label: 'VISAKHAPATNAM'}} b={{at: PLACE.sriperumbudur, label: 'SRIPERUMBUDUR'}} go={4} arrive={r(w0(106, 'శ్రీపెరంబుదూర్'))} />},
	{at: s0(107), render: (d) => <PhotoShot dur={d} {...ph('sriperumbudur')} grade="night" move="in" te="శ్రీపెరంబుదూర్" en="RAJIV GANDHI MEMORIAL, SRIPERUMBUDUR" labelAt={10} />},
	{at: s0(108), render: (d, r) => (
		<>
			<Dim dur={d} file={M.sriperumbudur.file} />
			<Words items={[{t: 'ఆ వార్త చెప్పింది', at: 4}, {t: 'ప్రియాంక', at: r(w0(108, 'ప్రియాంక')), gold: true}]} sub="SHE STRUGGLED TO ACCEPT HE WAS DEAD" subAt={r(s0(109))} />
		</>
	)},
	{at: s0(110), render: (d) => <PhotoShot dur={d} {...ph('requiem')} grade="night" move="l" te="చీకట్లో, మొజార్ట్ రెక్వియమ్" en="AS PRIYANKA REMEMBERS IT" labelAt={20} />},
	// ---------------------------------------------------------------- why politics again
	{at: s0(111), render: (d, r) => (
		<>
			<Dim dur={d} file={M.doon1997.file} />
			<Words items={[{t: 'మళ్ళీ', at: r(s0(112))}, {t: 'పాలిటిక్స్ లోకి', at: r(s0(112)) + 10, gold: true}, {t: 'ఎందుకు?', at: r(w0(112, 'ఎందుకు')), red: true}]} />
		</>
	)},
	{at: s0(113), render: (d, r) => <ExcerptShot dur={d} source={HINDU} lines={['“I had experienced it through Rajiv:', 'in its peaks of high endeavour,', 'as well as in all its ugliness and venality.', 'How could I even think of getting into it?”']} hi={[[2, r(w0(114, 'అసహ్యంగా')), r(w0(114, 'అసహ్యంగా')) + 40], [3, r(s0(115)), r(s0(115)) + 60]]}  under={<PhotoShot dur={d} {...ph('parliament')} grade="night" />} />},
	{at: s0(116), render: (d, r) => <StampShot dur={d} {...ph('parliament')} big="1996" sub="CONGRESS DEFEATED · LEADERS LEAVE" subAt={r(s0(117))} />},
	{at: s0(118), render: (d, r) => <ExcerptShot dur={d} source={HINDU} lines={['“I’d wake up in the middle of the night', 'wondering what I should do …', 'That pull was now getting hold of me.”']} hi={[[0, 6, 50], [2, r(s0(119)), r(s0(119)) + 60]]} />},
	{at: s0(120), render: (d, r) => <ExcerptShot dur={d} source={HINDU} lines={['“I was after all the outsider.', 'I had been reminded of that status', 'again and again.”']} hi={[[0, r(s0(121)), r(s0(121)) + 30], [2, r(s0(122)) + 20, r(s0(122)) + 60]]} />},
	{at: s0(123), render: (d) => <StampShot dur={d} big="1997" sub="KOLKATA · SHE JOINS THE PARTY" />},
	{at: s0(124), render: (d) => <PhotoShot dur={d} {...ph('doon1997')} grade="warm" contain move="in" te="1998లో పార్టీ ప్రెసిడెంట్" en="SONIA GANDHI, 1997" labelAt={6} />},
	// ---------------------------------------------------------------- back to the window: 2004
	{at: s0(125), render: (d) => <InkWindow dur={d} />},
	{at: s0(126), render: (d, r) => (
		<>
			<Dim><InkCorridor dur={d} walk={false} /></Dim>
			<Words items={[{t: 'మనం గెలిస్తే,', at: r(s0(127))}, {t: 'నువ్వు ప్రైమ్ మినిస్టర్', at: r(s0(127)) + 14, gold: true}, {t: 'అవుతావా?', at: r(s0(127)) + 28}]} size={104} sub="HER CHILDREN, MONTHS BEFORE THE 2004 ELECTION" subAt={4} />
		</>
	)},
	{at: s0(128), render: (d, r) => <ExcerptShot dur={d} source={IE} lines={['“Absolutely not!” I’d said, almost indignantly.', '“Are you sure?” they pressed me.', '“I’m very clear,” I said emphatically.']} hi={[[0, r(s0(129)), r(s0(129)) + 24], [1, r(s0(130)), r(s0(130)) + 40], [2, r(s0(131)), r(s0(131)) + 40]]} />},
	{at: s0(132), render: (d, r) => (
		<>
			<Dim red><InkMirror dur={d} showRight={-30} /></Dim>
			<Words items={[{t: 'అధికారం కాదు.', at: 6}, {t: 'ప్రమాదం.', at: r(s0(133)), red: true}]} size={140} />
		</>
	)},
	{at: s0(134), render: (d) => <PhotoShot dur={d} {...ph('indira1966')} grade="bw" contain move="in" te="నానమ్మ" en="INDIRA GANDHI · ASSASSINATED 1984" labelAt={2} />},
	{at: s0(135), render: (d) => <PhotoShot dur={d} {...ph('rajiv1987')} grade="bw" contain move="in" te="నాన్న" en="RAJIV GANDHI · ASSASSINATED 1991" labelAt={2} />},
	{at: s0(136), render: (d) => (
		<>
			<Dim red dur={d} file={M.rajiv1987.file} />
			<Words items={[{t: 'ఆ పదవి అంటేనే', at: 4}, {t: 'ప్రాణభయం', at: 30, red: true}]} size={130} />
		</>
	)},
	{at: s0(137), render: (d, r) => <ExcerptShot dur={d} source={IE} lines={['“I kept my views firmly to myself,', 'not even confiding in my closest colleagues.”']} hi={[[0, 6, 50]]} te="మౌనం" />},
	{at: s0(141), render: (d) => <InkRoom dur={d} phase="close" at={-200} />},
	{at: s0(144), render: (d) => <InkWindow dur={d} />},
	{at: s0(146), render: (d) => <ExcerptShot dur={d} source={IE} lines={['She tore into the house to look for Rahul,', 'tears running down her face.']} hi={[[1, 40, 90]]}  under={<InkWindow dur={d} />} />},
	{at: s0(147), render: (d) => <ExcerptShot dur={d} source={IE} lines={['“She’s said yes to them!', 'They’re all around her,', 'she’s said yes!”']} hi={[[0, 2, 30], [2, 50, 80]]} />},
	{at: s0(149), render: (d) => <InkCorridor dur={d} />},
	{at: s0(150), render: (d, r) => <ExcerptShot dur={d} source={IE} lines={['“You said yes?” thundered Rahul.']} hi={[[0, r(s0(151)), r(s0(151)) + 30]]}  under={<InkCorridor dur={d} />} />},
	{at: s0(152), render: (d, r) => <ExcerptShot dur={d} source={IE} lines={['“They wouldn’t listen to me,” I replied,', '“I don’t want to do it, you know I don’t.', 'I was being pressurised.”']} hi={[[2, r(s0(154)), r(s0(154)) + 40]]} />},
	{at: s0(155), render: (d, r) => (
		<>
			<Dim red><InkCorridor dur={d} walk={false} /></Dim>
			<Words items={[{t: 'ప్రెషరా?', at: 2}, {t: 'మరి మా సంగతేంటి?', at: r(s0(157)), red: true}]} size={130} sub="“WHAT ABOUT US?” · RAHUL" subAt={r(s0(157)) + 10} />
		</>
	)},
	{at: s0(158), render: (d) => <InkCorridor dur={d} walk={false} />},
	{at: s0(159), render: (d, r) => <ExcerptShot dur={d} source={IE} lines={['“Look, Ma, you’ve always been clear about this,”', '“Don’t get forced into it.', 'Do what you’ve decided to do.', 'We’re both here to help you handle it.”']} hi={[[1, r(s0(161)), r(s0(161)) + 30], [3, r(s0(163)), r(s0(163)) + 40]]} />},
	{at: s0(164), render: (d, r) => <InkMirror dur={d} showRight={r(s0(166))} />},
	{at: s0(169), render: (d) => <QuoteShot dur={d} who="K. NATWAR SINGH · HIS AUTOBIOGRAPHY" te="అమ్మ పీఎమ్ అయితే సిక్స్ మంత్స్ లో చంపేస్తారని రాహుల్ భయపడ్డారు." en="Rahul did not want her to become PM; he felt she would be assassinated in six months." source="HIS CLAIM, AS SUMMARISED BY THE INDIAN EXPRESS" plain />},
	{at: s0(171), render: (d, r) => (
		<>
			<Dim dur={d} file={M.sonia2007.file} />
			<Words items={[{t: 'పిల్లల భయం', at: 4}, {t: 'ఒక్కటే కాదు', at: 20, gold: true}]} />
		</>
	)},
	{at: s0(173), render: (d, r) => <ExcerptShot dur={d} source={IE} lines={['“The BJP and its allies would for certain', 'use my “foreign origin” as an issue …', 'How could I agree to holding the office', 'knowing it could wound my country?”']} hi={[[1, r(w0(173, 'ఫారిన్')), r(w0(173, 'ఫారిన్')) + 30], [3, r(s0(175)) + 20, r(s0(175)) + 80]]}  under={<PhotoShot dur={d} {...ph('sonia2013')} grade="bw" />} />},
	// ---------------------------------------------------------------- the night
	{at: s0(176), render: (d) => <InkBed dur={d} />},
	{at: s0(179), render: (d, r) => <InkBed dur={d} lines={[{t: 'ఇటలీలో పుట్టి పెరిగిన నువ్వు, దేశాన్ని నడిపించాలా?', at: 4, side: 'l'}, {t: 'ఇది నీ దేశం.', at: r(s0(182)), side: 'r'}]} />},
	{at: s0(185), render: (d) => <PhotoShot dur={d} {...ph('rajiv1987')} grade="bw" contain move="in" te="రాజీవ్ పక్కన ఉంటే బాగుండు" en="RAJIV GANDHI, 1987" labelAt={8} />},
	{at: s0(187), render: (d, r) => <ExcerptShot dur={d} source={IE} lines={['“Sonia, be true to yourself,”', 'I could hear myself say.', '“You’ve always known it. Just leave it!”']} hi={[[0, 4, 40], [2, r(s0(189)) - 20, r(s0(189)) + 10]]}  under={<InkBed dur={d} />} />},
	{at: s0(190), render: (d) => <InkDoor dur={d} />},
	{at: s0(192), render: (d) => <ExcerptShot dur={d} source={IE} lines={['“I’ve made up my mind.', 'I’m going to stick to my stand.”']} hi={[[0, 4, 30], [1, 40, 80]]} />},
	{at: s0(194), render: (d, r) => (
		<>
			<Dim><InkDoor dur={d} /></Dim>
			<Words items={[{t: 'ఇది కరెక్ట్ డెసిషన్.', at: r(s0(195)), gold: true}]} size={130} sub="RAHUL, ARMS AROUND HER: “IT’S THE RIGHT DECISION.”" subAt={4} />
		</>
	)},
	// ---------------------------------------------------------------- Central Hall
	{at: s0(196), render: (d) => <InkHall dur={d} />},
	{at: s0(199), render: (d) => <InkHall dur={d} />},
	{at: s0(201), render: (d) => <ExcerptShot dur={d} source={IE} lines={['“I can hear my breath', 'above the whirring of the fans.”']} hi={[[0, 20, 60]]}  under={<InkHall dur={d} />} />},
	{at: s0(203), render: (d, r) => <ExcerptShot dur={d} source={IE} lines={['“… the post of prime minister is not my aim.', 'I would follow my own inner voice.', 'Today that voice tells me', 'I must humbly decline this post.”']} hi={[[0, r(s0(204)), r(s0(204)) + 50], [1, r(w0(205, 'అంతరాత్మ')), r(w0(205, 'అంతరాత్మ')) + 40], [3, r(w0(206, 'వినయంగా')), r(w0(206, 'వినయంగా')) + 40]]} />},
	{at: s0(207), render: (d) => <InkHall dur={d} surge={10} />},
	{at: s0(213), render: (d) => <ExcerptShot dur={d} source={IE} lines={['“I request you to accept my decision', 'and to recognize that I will not reverse it.”']} hi={[[1, 40, 100]]} />},
	{at: s0(215), render: (d, r) => <PhotoShot dur={d} {...ph('manmohan')} grade="warm" contain move="in" te="డాక్టర్ మన్మోహన్ సింగ్" en="PRIME MINISTER FROM 2004" labelAt={r(s0(216))} />},
	{at: s0(217), render: (d, r) => (
		<>
			<Dim dur={d} file={M.manmohan.file} />
			<Words items={[{t: 'మరి', at: 2}, {t: 'ఆయనే ఎందుకు?', at: 10, gold: true}]} sub="SENIOR LEADERS WERE READY, SHE ADMITS" subAt={r(s0(218))} />
		</>
	)},
	{at: s0(219), render: (d, r) => <PrintShot dur={d} {...ph('pvrao')} caption="P. V. NARASIMHA RAO" grade="warm" te="మన పీవీ నరసింహారావు" en="MANMOHAN SINGH WAS HIS FINANCE MINISTER" labelAt={r(s0(220))} width={760} />},
	{at: s0(221), render: (d) => <ExcerptShot dur={d} source={TOI} lines={['“… his integrity unquestionable.”', '“I knew that our beloved country', 'would be safe in his hands.”']} hi={[[0, 10, 50], [2, 90, 140]]}  under={<PhotoShot dur={d} {...ph('manmohan')} grade="warm" contain />} />},
	{at: s0(222), render: (d, r) => (
		<>
			<Dim dur={d} file={M.clinton2000.file} />
			<Words items={[{t: 'బ్యాక్ సీట్ డ్రైవర్?', at: 6, red: true}]} size={130} sub="WHAT CRITICS CALLED HER, 2004–2014" subAt={20} />
		</>
	)},
	{at: s0(224), render: (d) => <PhotoShot dur={d} {...ph('clinton2000')} grade="warm" move="r" te="ప్రైమ్ మినిస్టర్ మాటకే విలువ" en="SHE SAYS SHE DEFERRED TO HIM" labelAt={10} />},
	// ---------------------------------------------------------------- the rest of the book
	{at: s0(226), render: (d) => <BookShot dur={d} open te="ఈ పుస్తకంలో ఇంకా" labelAt={6} />},
	{at: s0(227), render: (d, r) => <StampShot dur={d} {...ph('indira1977')} big="1975–77" sub="THE EMERGENCY · “A MISTAKE”" subAt={r(w0(227, 'తప్పు'))} />},
	{at: s0(229), render: (d) => <StampShot dur={d} big="6 DEC 1992" sub="BABRI MASJID · SHE WEPT AT THE TV" />},
	{at: s0(230), render: (d, r) => <PrintShot dur={d} {...ph('modi')} caption="NARENDRA MODI" grade="warm" te="దాదాపు కాంటాక్టే లేదు" en="“PRACTICALLY NO REAL CONTACT” · “HE TENDS TO LOOK AWAY”" labelAt={r(w0(230, 'కాంటాక్టే'))} width={700} />},
	{at: s0(231), render: (d) => (
		<>
			<Dim dur={d} file={M.modi.file} />
			<Words items={[{t: 'హెల్త్ గురించి', at: 30}, {t: 'అడిగారు', at: 50, gold: true}]} sub="MODI ASKED ABOUT HER HEALTH, SHE ALSO WRITES" subAt={70} />
		</>
	)},
	// ---------------------------------------------------------------- the other side
	{at: s0(232), render: (d) => (
		<>
			<Dim red><BookShot dur={d} /></Dim>
			<Words items={[{t: 'అవతలి వైపు', at: 2, red: true}]} size={140} />
		</>
	)},
	{at: s0(233), render: (d) => <QuoteShot dur={d} who="C. R. KESAVAN · BJP SPOKESPERSON" te="బిలాంగింగ్ కాదు, వైట్ వాషింగ్ అని పేరు పెట్టాల్సింది." en="Smt. Sonia Gandhi could have titled her memoir as ‘Whitewashing’ instead of ‘Belonging’." source="POST ON X · 10 NOV 2026 · VIA MONEYCONTROL" accent={C.red} />},
	{at: s0(235), render: (d) => (
		<>
			<Dim dur={d} file={M.indira1977.file} />
			<Words items={[{t: '1984', at: 4}, {t: 'ఎమర్జెన్సీ', at: 26}]} size={130} sub="HIS QUESTIONS: THE 1984 VIOLENCE, THE EMERGENCY" subAt={40} />
		</>
	)},
	{at: s0(236), render: (d) => <QuoteShot dur={d} who="AAM AADMI PARTY" te="ఇందిర కన్నీళ్ళ కథ, వినికిడి మాట." en="Hearsay that could not be independently verified." plain source="ON HER ACCOUNT OF OPERATION BLUE STAR · VIA GULF NEWS / IANS" accent={C.red} />},
	{at: s0(237), render: (d) => <QuoteShot dur={d} who="PENGUIN RANDOM HOUSE INDIA" te="ఒక విషయంలో ఒప్పందం కుదరలేదు. బయటి ప్రెషర్ లేదు." en="An impasse over a particular issue; no external pressure." plain source="ON DROPPING THE BOOK · VIA BUSINESS STANDARD / PTI" />},
	{at: s0(241), render: (d) => <QuoteShot dur={d} who="SONIA GANDHI · THE GUARDIAN" te="గవర్నమెంట్ మీద విమర్శలు పెంగ్విన్ కి నచ్చలేదు." en="Uneasy in general with the criticism of the government." source="INTERVIEW · VIA BUSINESS STANDARD" />},
	{at: s0(242), render: (d) => <BookShot dur={d} en="PUBLISHED BY HARPERCOLLINS INDIA" labelAt={6} />},
	{at: s0(243), render: (d, r) => (
		<>
			<Dim><BookShot dur={d} /></Dim>
			<Words items={[{t: 'ఎవరిది నిజం?', at: 2, gold: true}]} size={140} sub="READ IT AND DECIDE" subAt={r(s0(244))} />
		</>
	)},
	// ---------------------------------------------------------------- Hyderabad and the landing
	{at: s0(245), render: (d) => <PhotoShot dur={d} {...ph('hydBookstore')} grade="warm" move="in" te="మన హైదరాబాద్ లో" en="A HYDERABAD BOOKSHOP (FILE PHOTO)" labelAt={6} />},
	{at: s0(246), render: (d, r) => <CounterShot dur={d} {...ph('hydBookstore')} value={1000} land={r(w0(246, 'కాపీలు'))} unit="కాపీలు" sub="ONE DISTRIBUTOR, HYDERABAD · THE HINDU" />},
	{at: s0(247), render: (d, r) => <CounterShot dur={d} value={150} land={r(w0(247, 'ఆర్డర్లు'))} unit="ఆర్డర్లు" sub="IN ONE HOUR" />},
	{at: s0(248), render: (d, r) => (
		<>
			<Dim><InkHall dur={d} /></Dim>
			<Words items={[{t: 'పవర్ కోసం పోరాటాలు', at: r(s0(249))}, {t: 'కాదు.', at: r(s0(250))}, {t: 'ఆ కుర్చీని చూసి భయపడిన కథ', at: r(w0(250, 'కుర్చీని')), gold: true}]} size={96} />
		</>
	)},
	{at: s0(251), render: (d, r) => <TimelineShot nodes={[{year: '1984', te: 'భార్య భర్తని వేడుకుంది', at: 2}, {year: '1991', te: 'కొడుకు హెచ్చరించాడు', at: r(s0(252))}, {year: '2004', te: 'పిల్లలు అమ్మని ఆపారు', at: r(s0(253))}]} />},
	{at: s0(254), render: (d, r) => <PollShot q="మీరేమంటారు?" qAt={2} options={[{t: 'నిజమైన త్యాగం', at: r(s0(255))}, {t: 'స్మార్ట్ పాలిటిక్స్', at: r(s0(256))}, {t: 'వైట్ వాషింగ్', at: r(w0(257, 'వైట్'))}]} />},
	{at: s0(259), render: (d) => <OutroShot dur={d} />},
];

export const END = AUDIO_FRAMES + 150;
