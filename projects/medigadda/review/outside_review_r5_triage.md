# Outside review of r5 (another chatbot, via the owner, 15 Nov 2026): what we took

The review (`outside_review_r5.md`) is a lead, not an instruction (CLAUDE.md). Each point against what we hold.

## Taken (r6)
| Point | Done |
|---|---|
| The real sunk road deck is a 1 s flash at 0:36 | it now holds about 3 s, through s10 "ఇక్కడే ఒక వింత ఉంది"; the 2022 flood starts on s11 |
| Hold the water-line photo at 11:41 longer | +1.5 s, into "దాన్ని చూడకుండా" |
| The coins at 14:05 fight the CAG page behind them | the page is dimmed to a texture (overlay 0.35 → 0.66); the highlight and source stay |
| A music reset at 10:29 "ఇక్కడితో ఆపేస్తే" and at the money "ఇప్పుడు డబ్బు" | the bed drops out for s207 and s269 (`HUSH` in `tools/mix.py`; measured: only those windows change) |
| A tick on each checkmark (17:25) | three taps, 16 frames apart (`Box tick` read by `tools/sfx_cues.py`) |

## Already in the film
- Music that changes texture at each turn: 14 library tracks by chapter (`tools/mix.py` PLAN).
- Sounds on the thud, documents, cards, rings, pins and the river under the raft (`vo/sfx_cues.json`).
- Captions above the player bar; sources bottom left; honesty labels top right.

## Not taken, and why
- **Real drone, dusk, 2022 flood, construction-era or police-inspection footage of Medigadda** (0:00, 0:10, 0:42,
  10:36, 11:59): none exists with a commercial licence. Cowork searched Commons, Flickr (CC), Mapillary, PIB,
  data.gov.in and the state's releases (Drive `photos_barrage/notes.txt`); news-agency footage is excluded
  (PLAYBOOK §8). The film's real pictures are the NDSA committee's own photos, which are already on their words.
- **Open on a real shot instead of the cutaway:** the first frame is the thumbnail's subject and sentence 1 confirms
  it (CLAUDE.md, Structure); the thumbnail is the cutaway.
- **Faint B-roll at 20–30% behind text cards:** it muddies the text on a phone; the empty beats were fixed with the
  real pages instead (`Evidence`, our r1 review).
- **Ambient occlusion and animated water on the plates:** the plates are Cycles stills (AO is in the path tracing);
  animated water means re-rendering 44 plates as sequences. A note for the next film's plate pipeline, not this one.
- **Pump PiP beside the 162 TMC bars:** the pump-house clip plays seconds before (s248–250).
- **Its "₹1 → ₹1.50" and title numbers:** the film's own figures stand (₹1.50 from the project report, 52 paise
  from CAG; 28.7 lakh cusecs). Titles and thumbnails are the owner's choice from `plan.md`; its two title ideas are
  noted for that choice.
