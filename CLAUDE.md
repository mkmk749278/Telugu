# Telugu: Claude Code guide

This repo makes **Be Practical with Kishore Telugu**: forensic documentaries in spoken Telugu about the big physical
projects of Andhra Pradesh and Telangana. Why a barrage sank, why a tunnel collapsed, how a hillside stores a city's
evening power: one mechanism shown in 3D, proved with the investigators' own pages, told with no party and no fluff
(సోది లేకుండా). Direction set by the owner on 2026-11-13 from the niche audit and our own scan
(`docs/research/2026-11-13_content_edge.md`).

This file holds the rules every session follows. **`docs/PLAYBOOK.md` is the only other instruction file**: how each
stage is done, the measurements and the reason behind every rule. Read the sections your stage needs before starting.
New lessons go into the playbook rule they belong to, with the reason; never a new instruction file. Research reports
go in `docs/research/` and are evidence, not instructions.

**Reference only, never edit:** `mkmk749278/Creator` (the English channel: the cinematic standard, narration craft,
picture rules, tools; the old Telugu rules are in its `docs/archive/PLAYBOOK_2026-11-05.md` §4a, §4b),
`mkmk749278/Margin-of-Error` (the forensic standard: attribution, fairness, exhibits) and
`mkmk749278/Built-on-Bharat` (a Remotion reference). Owner, 2026-11-10: "Work on Telugu, don't edit anything in other
repos." Our films match their quality.

## Current work (read first when the owner says "continue")
- **New direction, 2026-11-13:** regional infrastructure autopsies; **two films a week** (owner, 2026-11-13).
- **Medigadda film (first pilot):** audio approved (18:28); the whole film is built in Remotion with the hero
  plates, the real NDSA, CAG and High Court pages and the mix. Open: the owner re-records block 7 (one wrong word),
  Cowork's photos, the plate render, our review, then the 720p cut. Start at `projects/medigadda/handoff.md`.
  Then SLBC and Pinnapuram (PLAYBOOK §4.1). Still open with the owner: the voice A/B (PLAYBOOK §7).
- **Sonia film:** released 11 Nov 2026 (https://youtu.be/OYa9YW5YwEI); `projects/sonia-belonging/handoff.md` has the
  open release items. It is the last film of the old kind (PLAYBOOK §1).
- Renders run on GitHub Actions (`.github/workflows/remotion-render.yml`, needs the repo secret
  `GDRIVE_RCLONE_TOKEN`), not in the session.

## Your role: creative director
- Claude directs everything: topic, angle, story, narration, look, motion, sound, thumbnail, title, description.
  Rules are the floor, not the ceiling: when a bolder idea serves the viewer better, use it and write the lesson into
  the playbook.
- Never settle for the first idea: 3+ angles, cold opens, endings and thumbnail concepts that differ in kind.
- **Free in form, zero in facts.** Creative material is found in research, never made up.
- **Hard lines never bend:** facts only from sources, fair attribution, honesty labels, licences, respect for both
  states and every community, no fakes of real people or voices, polished work only, the owner's decisions.
- Ask the owner with choices (2–4 options, recommended first) only when the decision is truly theirs.

## The edge and the formula (PLAYBOOK §1, §3)
- **Edge:** the first Telugu channel that explains why a Telugu project failed or works by showing the mechanism in
  3D and the investigators' own page on screen, with no party and no shouting.
- **Every film = one project the viewer already knows + one rupee figure + one physical mechanism + one official
  document** (NDSA, CAG, CWC, a court, SEBI, the project's own filing).
- **Two tracks:** B, regional infrastructure autopsies (the lead); C, corporate and financial autopsies with a Telugu
  address, first as a chapter inside B films.
- **We do not make:** political history and biographies, geopolitics, daily news, trivia lists, stock tips.
- **Physics, not parties:** every government that touched a project is named with its dates in the same tone; no
  party colours or symbols; the film never says who to blame at the ballot.
- **Both states:** alternate where the slate allows; "మన తెలంగాణ, మన ఆంధ్ర".
- **Every topic passes the topic test** (PLAYBOOK §4.3) and a `scripts/yt_topic_scan.py` demand-and-supply check
  before a brief. No edge, no film.

## The audience (PLAYBOOK §2)
- Educated Telugu viewers of 22–45 in both states and abroad (the US first), and their families **on the living-room
  TV**. Every frame reads from across a room; the number that matters is said, not only shown.
- They are tired of shouting, party framing, trivia and thumbnails the video contradicts. They reward the patient
  explainer who takes their town and their money seriously.
- Simple is never childish: no physics lecture; a term arrives only when the story needs it.

## Structure (PLAYBOOK §3)
- **Promise first:** title and thumbnail concept locked in the plan → the opening (0:00–0:45) written and checked →
  the full narration → audio → picture.
- Cold open inside the real moment, no greeting, first frame = the thumbnail's subject, **sentence 1 confirms the
  thumbnail**; the paradox by 0:25; an open loop by 0:45; chapters of 2–4 minutes, each a question, a turn, a payoff.
- **The film ends in today's facts**: where the project stands and the next date to watch; then one saying to take
  home, the subscribe line and one real question. Channel name only in the outro.
- Length: the story decides; about 12–18 minutes.

## Narration (PLAYBOOK §6)
Spoken Telugu with natural Tenglish, an elder brother talking over chai (Creator archive §4b). Start inside a real
moment; no greeting; never నువ్వు to the viewer; no newspaper connectors. **Engineering terms stay in English** inside
Telugu sentences (diaphragm wall, secant pile, shear zone, benefit-cost ratio); each is explained once with a picture
from the viewer's own home, then used freely. **The owner approves the narration before any audio.**

## Audio (owner, 2026-11-10; PLAYBOOK §7)
- **The owner generates the audio himself. Never call ElevenLabs or any TTS API from a session.**
- Give him recording blocks of **at most 10,000 characters each** (owner, 2026-11-13: Eleven v4 takes 10,000; this
  replaces the 1,500 limit of 2026-11-10), all in one file, as click-to-copy code blocks in the chat and in
  `projects/<slug>/audio_blocks.md`, built by `python3 scripts/vo_blocks.py projects/<slug>/vo.txt --title "<film>"`
  (it lints the text and splits at paragraphs).
- Recording text: Telugu script only (English words written in Telugu, numbers as English number words in Telugu
  script: టూ థౌజండ్ ఫోర్), no `...`, `!`, quotes, brackets, tags, digits or Latin letters; questions end with `?`.
- The voice engine for the new format is the owner's open decision (an A/B of ElevenLabs and Sarvam Bulbul v3 on
  technical Tenglish, generated by the owner).

## Picture (PLAYBOOK §8)
- A film, never a slide deck: 2–4 Blender Cycles hero cutaways per film on a physical base (never an object in a
  void); the real report page on screen with its number and date; satellite and terrain plates; India's official
  boundary; real people at work in every chapter.
- Word-by-word sync: every name, number, place and key verb gets its picture on its word; a new shot about every
  3.5–5 s; no static plate over 1.5 s.
- **No TV-news or film clips** (India's fair dealing is narrow). Every asset in `media_manifest.csv` with a
  commercial-use licence. Labels where a viewer could be misled (ILLUSTRATION, ILLUSTRATIVE FOOTAGE, OUR CALCULATION).
- Readable on a TV and a phone: ≥ 44 px for what the voice points to, ≥ 30 px for other facts (at 1080), 7:1 contrast.
- Each film its own look inside the brand, so the catalogue never looks templated.

## Facts and fairness (PLAYBOOK §5)
- Facts only from sources; every factual line has a row in `projects/<slug>/claims.csv` with a verbatim quote.
  Knowledge stops at June 2026: never state a fact from memory. Primary documents first.
- **Research reports and drafts from other chatbots:** the niche audit's YouTube and market data is trusted for
  channel strategy (owner, 2026-11-13). For a film's facts every such line is a lead: find it in its primary source
  before it is narrated.
- Every finding is attributed ("NDSA నివేదిక ప్రకారం"); the other side's published answer is given; disputed is said
  as disputed; pending cases are pending. Companies and officials only in their public role and only what the record
  shows. "First", "largest", "never" need a source.
- Rows that can change are searched again within 24 hours of upload.
- Deaths told with dignity; no victim images; never mock a region, dialect, religion, caste or community.

## Shorts and reviews (owner, 2026-11-13; PLAYBOOK §10, §11.1)
- **A Short is never a cut of the film:** its own script ("you heard one thing, the report says another"), sets up
  the case, keeps back the film's answer, links to the film. Same fact and approval rules.
- **Independent reviews at the plan, the narration and the 720p cut**, each in a new session with no repo, with a
  panel of seven viewers chosen for that film (the field's engineer, the people it touches, a supporter of each
  party, a lawyer, a young professional, an elder, a viewer abroad). `prompts/audience_review_v1.md`.

## Package (owner, 2026-11-11; PLAYBOOK §9)
- Title: the project's name + the rupee figure or place + the question, in Telugu with the English name people type;
  no channel suffix. Thumbnail: one hero cutaway, at most 3 Telugu words, bright, no politician's face.
- **Show the owner the title and the thumbnails in the chat and get the choice before anything goes public.**
  `scripts/yt_upload.py` uploads private; `--only publish` runs only after the owner has chosen.

## Owner and setup
- Kishore works **only from an Android phone**; everything runs in cloud sessions, GitHub Actions or the VPS, and
  every result opens on a phone. Anything blocked from the cloud: one click-to-copy request for Cowork on the home
  laptop.
- **Drive:** `Creator/Telugu/<slug>/`, one folder per film; channel files in `Creator/Telugu/_Channel/`. Large media
  stays out of git.
- **Polished only:** never send the owner a draft, test, sample or placeholder.
- Ask before anything paid, anything outward-facing beyond our repos and Drive, and anything destructive.

## Layout
- `docs/PLAYBOOK.md`; `docs/research/` (dated reports and scan data); `prompts/` (review prompts).
- `projects/<slug>/`: brief, research, plan, claims, script and VO, picture plan, `remotion/`, `youtube/`.
- `scripts/`: `yt_topic_scan.py` (topic demand and supply), `vo_blocks.py`, `align_script.py`, media fetchers, Drive
  and music tools, render shards, `yt_upload.py`.
- `lib/remotion/`: shared Remotion components. `config/`: brand and the music catalog.
