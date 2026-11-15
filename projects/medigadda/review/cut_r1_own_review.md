# Our review of the 720p cut r1 (15 Nov 2026)

Method: contact sheets of r1 every 5 s (223 frames, all read), then 1 s sheets of every suspect window; a
measurement of frames that are mostly paper colour for over 1.5 s (`paper.py` in the session scratchpad: 27 windows,
each looked at); local stills of every fix (`scripts/remotion_stills.mjs`). r1's measured numbers (handoff) stand:
1114.1 s, −14.3 LUFS, true peak −1.2 dB, no black frame, no freeze.

## Found and fixed in the code
| Time in r1 | What | Fix |
|---|---|---|
| 3:02, 5:07–5:13 | labels "గట్టి రాయి చాలా లోతులో", "గోడలు రాయి దాకా" cut by the right edge as the camera moved | `Tag` keeps itself on screen (flips side, 40 px margin); all pinned labels |
| 9:37 | "పిల్లర్ 20 · పగుళ్ళ మ్యాప్" on top of the source label | caption raised to y 905 |
| 12:47 | "ఈ నంబర్ల మీద … ఒప్పందం లేదు" on top of the source label | moved right (x 1250) |
| 11:12–11:33 | the reports' answers on the BRS cards: 32 px, blue on cream (4.5:1) | 34 px, dark blue (#0F3F80, 9.5:1) |
| 6:12 | 1.5 s of empty paper between the NDSA page and the 20 records | the page holds until the folders arrive |
| 1:19–1:22 | "రిపోర్ట్ లు చేతిలో పట్టుకుని" over the cutaway only | the NDSA, CAG and High Court pages rise on "రిపోర్ట్ లు", then the dive into the sand |
| 10:30–10:37 | 6.7 s: two captions on empty paper ("ఒక వైపు కథ") | the NDSA and CAG pages on the table, dimmed on "ఒప్పుకోని వాళ్ళు" |
| 11:34–11:41 | 6.5 s: "రెండో మాట" on empty paper | the NDSA letter of 1 Nov 2023 with its date, before the state's reply |
| 12:09–12:15 | 5.5 s: "మే 2025: L&T లెటర్" alone | a letter card "L&T → ఇరిగేషన్ డిపార్ట్మెంట్", labelled "మా బొమ్మ · అసలు లెటర్ కాదు" |
| 13:26–13:32 | 6 s: "ఎవరు బాధ్యులు?" alone | the High Court's conclusion page under it |
| 16:29–16:34 | 5.5 s: "ఖర్చు?" alone | the staircase, its three barrages lit |
| 17:10–17:16 | 5 s: "మూడు విషయాలు" alone | the Sentinel-2 view of Feb 2025 with its credit |
| 18:00–18:05 | 5 s: the subscribe line alone | the three reports' pages under it |
| 14:17–14:42 | a 16 px blue stub at the acre's corner read as a stray mark | the canal now enters from the frame's edge |

Sound: the new page arrivals get the paper sound (`tools/sfx_cues.py` reads `Evidence`); stem and mix rebuilt.

## Credits and licences (Commons pages read through the Wikipedia API)
All seven pending files are commercial-use: pump pipes (Burra.manohar goud, CC BY-SA 4.0), paddy
(Dhananjaya.karre, CC BY-SA 3.0), sand boil (US Army Corps of Engineers, **CC BY 2.0**, the screen said "Public
domain": fixed), core store (MARUM, V. Diekamp, CC BY 4.0), Polavaram (Chaduvari, CC BY-SA 4.0), pile wall (Falk2,
CC BY-SA 4.0), MEIL clips (CC BY 3.0). On-screen credits now name each author.

## Looked at and kept
- The four-voices tabs and the "2019"/"జూలై 2022" labels looked clipped on the sheets: the sheet's timecode box hid
  them; the frames are clean.
- Diagram beats on paper (the staircase, the maps, the month ruler, the TMC bars, the SLBC teaser) are pictures, not
  slides.
- The paddy photo carries s280–288 (25 s) with the camera moving and a new overlay every 3–5 s. A second Telangana
  field photo would help; none with a checked licence is in hand yet.

## r2 (GitHub run 43681762799, 15 Nov)
Measured: 1114.1 s, 33,424 frames, 1280×720, 30 fps, −14.3 LUFS, peak −1.4 dBFS, no black frame. One freeze of
2.3 s at 17:25 (s339: the three boxes, only a caption arriving): the boxes now tick in turn on "ఈ మూడూ జరిగితే".
r3 (15 Nov): the same numbers, but the card still held 2.4 s after the ticks finished; a 16% push-in from s339 to
the cut now moves it (0.0076 mean change per frame on local stills, the detector's floor is 0.003). r4 carries it.

**r4 (15 Nov), measured:** 1114.1 s, 33,424 frames, 1280×720, 30 fps, −14.3 LUFS, peak −1.4 dBFS, no black frame
≥ 0.1 s, no freeze ≥ 1.5 s. This is the cut for the independent viewer review.

## Still open
- The court passage (s254–261) is type on paper: two High Court photos (CC BY-SA 4.0) are named in the Cowork request.
- Nobody has listened to the mix: the owner's ears.
- The Sentinel dates in the Copernicus Browser; the independent viewer review of the cut; the owner.
