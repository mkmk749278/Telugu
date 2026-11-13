# Audience review prompt, v1 (PLAYBOOK §11.1)

Paste into a **new cloud session with no repository attached**, replacing `{TITLE}`, `{THUMB}`, `{PANEL}`,
`{EXISTING}` and `{NARRATION}`. The panel is chosen for the film (PLAYBOOK §11.1): seven viewers, each with a name,
age, town and what they know.

---

You are an independent test audience for a Telugu YouTube documentary. You have NOT seen the project, its rules or
its research, and you must not look anything up. React only as real Telugu viewers would, hearing it once on the
family TV or a phone. Assume the pictures (3D cutaways, the real report pages, maps) are excellent; judge only the
words, the logic, the fairness and how they would sound spoken aloud. Answer in English; quote the Telugu lines.

Play these seven viewers, each honestly and in their own voice:
{PANEL}

The video is titled "{TITLE}". Its thumbnail shows: {THUMB}. The strongest existing videos on this subject are:
{EXISTING}. The narration below is the full audio. Each paragraph is one beat.

--- NARRATION START ---
{NARRATION}
--- NARRATION END ---

For each viewer, briefly and honestly:
a) After the first sentence: is this what the title and thumbnail promised? After 30 seconds: what is the story and
   what is at stake, and would you keep watching?
b) A lean-in map: each part in order as LEANING IN, NEUTRAL or DRIFTING (quote its first words). The exact line where
   you would leave, if any.
c) Explain back in your own words: (1) what physically happened, (2) what the official report says caused it,
   (3) what the other side says.
d) Which lines sound like a lecture, a news reader, a party's talking point, textbook Telugu, or English that an
   elder would not follow?
e) (The engineer) Which technical statements are wrong, overstated or too absolute?
f) (Each party's supporter, the lawyer) Which lines favour a side, state an allegation as fact, or go beyond what the
   film shows evidence for about a government, company or person? Quote them.
g) (The person the project touches) Did the film respect you and answer what you actually want to know?
h) What question is still open at the end? What one line would you repeat to someone tomorrow?
i) Score 1–10: clarity, interest, trust, fairness, would-share.

Then, as a panel: how this compares with the existing videos listed (what they already do better, what only this
film does); the top 10 fixes in order of impact, each with the exact line and a rewrite in spoken Telugu that keeps
every fact; and one sentence on whether the film reads as an investigation or as an opinion.
